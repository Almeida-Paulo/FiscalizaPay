// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title FiscalizaPayRegistry
/// @notice Registro publico e imutavel do hash do documento de contratos de
///         fiscalizacao de pagamentos publicos. Cada contrato (identificado
///         por `contractId`) so pode ser registrado uma unica vez, criando
///         uma prova on-chain de integridade (existiu, com este hash, neste
///         momento, registrado por este endereco).
/// @dev Apenas o `owner` (a wallet operadora do backend FiscalizaPay) pode
///      gravar registros. Autorizacao de papel/usuario (GESTOR + wallet do
///      contrato) ja e validada no backend antes de chamar este contrato;
///      o `onlyOwner` aqui e uma camada extra de defesa contra escrita por
///      terceiros caso o endereco do contrato seja descoberto.
contract FiscalizaPayRegistry is Ownable {
    struct Record {
        bytes32 documentHash;
        address registeredBy;
        uint256 timestamp;
    }

    /// @notice contractId => registro on-chain.
    mapping(bytes32 => Record) private _records;

    event ContractRegistered(
        bytes32 indexed contractId,
        bytes32 indexed documentHash,
        address indexed registeredBy,
        uint256 timestamp
    );

    error AlreadyRegistered(bytes32 contractId);
    error RecordNotFound(bytes32 contractId);

    constructor(address initialOwner) Ownable(initialOwner) {}

    /// @notice Registra o hash do documento de um contrato de fiscalizacao.
    /// @dev Reverte se `contractId` ja tiver sido registrado anteriormente —
    ///      o registro e imutavel por design (nao existe funcao de update).
    function registerContract(bytes32 contractId, bytes32 documentHash) external onlyOwner {
        if (_records[contractId].timestamp != 0) {
            revert AlreadyRegistered(contractId);
        }

        _records[contractId] = Record({
            documentHash: documentHash,
            registeredBy: msg.sender,
            timestamp: block.timestamp
        });

        emit ContractRegistered(contractId, documentHash, msg.sender, block.timestamp);
    }

    /// @notice Retorna o registro on-chain de um contrato, se existir.
    function getRecord(bytes32 contractId)
        external
        view
        returns (bytes32 documentHash, address registeredBy, uint256 timestamp, bool exists)
    {
        Record storage record = _records[contractId];
        exists = record.timestamp != 0;
        if (!exists) {
            return (bytes32(0), address(0), 0, false);
        }
        return (record.documentHash, record.registeredBy, record.timestamp, true);
    }

    /// @notice Atalho para verificar se um contrato ja foi registrado on-chain.
    function isRegistered(bytes32 contractId) external view returns (bool) {
        return _records[contractId].timestamp != 0;
    }
}
