from app.models import Contract, ContractEvent, Profile
from app.schemas import ContractEventOut, ContractOut, ProfileOut, iso_z


def profile_out(profile: Profile) -> ProfileOut:
    return ProfileOut(
        id=str(profile.id),
        name=profile.name,
        role=profile.role,
        walletAddress=profile.wallet_address,
        createdAt=iso_z(profile.created_at) or "",
        updatedAt=iso_z(profile.updated_at) or "",
    )


def contract_out(contract: Contract) -> ContractOut:
    return ContractOut(
        id=str(contract.id),
        contractNumber=contract.contract_number,
        publicAgency=contract.public_agency,
        supplierName=contract.supplier_name,
        supplierWallet=contract.supplier_wallet,
        object=contract.object,
        amount=float(contract.amount),
        startDate=iso_z(contract.start_date),
        endDate=iso_z(contract.end_date),
        deadline=iso_z(contract.deadline) or "",
        inspectorName=contract.inspector_name,
        inspectorWallet=contract.inspector_wallet,
        logisticsResponsible=contract.logistics_responsible,
        logisticsWallet=contract.logistics_wallet,
        managerName=contract.manager_name,
        managerWallet=contract.manager_wallet,
        status=contract.status,
        documentHash=contract.document_hash,
        blockchainContractId=contract.blockchain_contract_id,
        createdAt=iso_z(contract.created_at) or "",
        updatedAt=iso_z(contract.updated_at) or "",
    )


def event_out(event: ContractEvent) -> ContractEventOut:
    return ContractEventOut(
        id=str(event.id),
        contractId=str(event.contract_id),
        eventType=event.event_type,
        description=event.description,
        responsibleRole=event.responsible_role,
        responsibleName=event.responsible_name,
        responsibleWallet=event.responsible_wallet,
        statusBefore=event.status_before,
        statusAfter=event.status_after,
        documentHash=event.document_hash,
        transactionHash=event.transaction_hash,
        blockchainTimestamp=iso_z(event.blockchain_timestamp),
        createdAt=iso_z(event.created_at) or "",
    )
