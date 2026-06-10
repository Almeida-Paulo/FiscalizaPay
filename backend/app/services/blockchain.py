from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

from eth_account import Account
from web3 import Web3
from web3.exceptions import ContractLogicError, Web3Exception

from app.config import Settings


REGISTRY_ABI: list[dict[str, Any]] = [
    {
        "type": "function",
        "name": "registerContract",
        "stateMutability": "nonpayable",
        "inputs": [
            {"name": "contractId", "type": "bytes32"},
            {"name": "documentHash", "type": "bytes32"},
        ],
        "outputs": [],
    },
    {
        "type": "function",
        "name": "getRecord",
        "stateMutability": "view",
        "inputs": [{"name": "contractId", "type": "bytes32"}],
        "outputs": [
            {"name": "documentHash", "type": "bytes32"},
            {"name": "registeredBy", "type": "address"},
            {"name": "timestamp", "type": "uint256"},
            {"name": "exists", "type": "bool"},
        ],
    },
    {
        "type": "function",
        "name": "isRegistered",
        "stateMutability": "view",
        "inputs": [{"name": "contractId", "type": "bytes32"}],
        "outputs": [{"name": "", "type": "bool"}],
    },
]


@dataclass(frozen=True)
class ChainRecord:
    document_hash: str | None
    registered_by: str | None
    blockchain_timestamp: datetime | None
    exists: bool


@dataclass(frozen=True)
class ChainRegistration:
    transaction_hash: str
    block_number: int
    blockchain_timestamp: datetime
    contract_id: str
    document_hash: str


def make_contract_id(value: str) -> bytes:
    return Web3.keccak(text=value)


def make_document_hash(value: str) -> bytes:
    stripped = value.strip()
    if Web3.is_hex(stripped) and len(stripped.removeprefix("0x")) == 64:
        return Web3.to_bytes(hexstr=stripped)
    return Web3.keccak(text=stripped)


def to_hex32(value: bytes) -> str:
    return Web3.to_hex(value)


def _client(settings: Settings) -> tuple[Web3, Any, Any]:
    web3 = Web3(Web3.HTTPProvider(settings.rpc_url, request_kwargs={"timeout": 30}))
    contract = web3.eth.contract(address=Web3.to_checksum_address(settings.contract_address), abi=REGISTRY_ABI)
    account = Account.from_key(settings.operator_private_key)
    return web3, contract, account


def get_record(settings: Settings, contract_id: bytes) -> ChainRecord:
    _, registry, _ = _client(settings)
    document_hash, registered_by, timestamp, exists = registry.functions.getRecord(contract_id).call()
    if not exists:
        return ChainRecord(document_hash=None, registered_by=None, blockchain_timestamp=None, exists=False)
    return ChainRecord(
        document_hash=to_hex32(document_hash),
        registered_by=registered_by,
        blockchain_timestamp=datetime.fromtimestamp(timestamp, tz=timezone.utc),
        exists=True,
    )


def register_contract(settings: Settings, contract_id: bytes, document_hash: bytes) -> ChainRegistration:
    web3, registry, account = _client(settings)
    if registry.functions.isRegistered(contract_id).call():
        raise ContractLogicError("Contract already registered on-chain.")

    transaction = registry.functions.registerContract(contract_id, document_hash).build_transaction(
        {
            "from": account.address,
            "nonce": web3.eth.get_transaction_count(account.address),
            "chainId": settings.chain_id,
        }
    )
    if "gas" not in transaction:
        estimated_gas = web3.eth.estimate_gas(transaction)
        transaction["gas"] = int(estimated_gas * 1.2)
    if "gasPrice" not in transaction and "maxFeePerGas" not in transaction:
        transaction["gasPrice"] = web3.eth.gas_price

    signed = account.sign_transaction(transaction)
    tx_hash = web3.eth.send_raw_transaction(signed.raw_transaction)
    receipt = web3.eth.wait_for_transaction_receipt(
        tx_hash,
        timeout=settings.blockchain_tx_timeout_seconds,
    )
    if receipt.status != 1:
        raise Web3Exception("Transaction reverted.")

    block = web3.eth.get_block(receipt.blockNumber)
    block_timestamp = datetime.fromtimestamp(block.timestamp, tz=timezone.utc)
    return ChainRegistration(
        transaction_hash=Web3.to_hex(tx_hash),
        block_number=receipt.blockNumber,
        blockchain_timestamp=block_timestamp,
        contract_id=to_hex32(contract_id),
        document_hash=to_hex32(document_hash),
    )
