from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.config import get_settings
from app.errors import api_error
from app.models import Contract, ContractEvent, ContractEventType, ContractStatus, Dispute, Profile, UserRole
from app.schemas import (
    ActionResultOut,
    AuditEventItemOut,
    BlockchainStatusOut,
    ContractActionBody,
    CreateContractBody,
    DashboardSummaryOut,
    OpenDisputeBody,
    SimulateFraudBody,
    SimulateFraudResultOut,
    UpdateContractBody,
    iso_z,
)
from app.security import normalize_wallet
from app.serializers import contract_out, event_out


ACTION_ROLES = {
    "create": {UserRole.GESTOR.value},
    "update": {UserRole.GESTOR.value},
    "delete": {UserRole.GESTOR.value},
    "confirm_shipment": {UserRole.FORNECEDOR.value},
    "confirm_delivery": {UserRole.ENTREGADOR.value},
    "validate_receipt": {UserRole.FISCAL.value},
    "authorize_payment": {UserRole.GESTOR.value},
    "open_dispute": {UserRole.GESTOR.value, UserRole.FISCAL.value, UserRole.AUDITOR.value},
    "simulate_fraud": {UserRole.GESTOR.value, UserRole.FISCAL.value, UserRole.AUDITOR.value},
    "register_on_chain": {UserRole.GESTOR.value},
}

BLOCKCHAIN_UNAVAILABLE_MESSAGE = "Registro em blockchain indisponivel neste ambiente."


def is_blockchain_available() -> bool:
    settings = get_settings()
    return settings.blockchain_enabled and bool(settings.contract_address.strip())


def parse_dt(value: str | None, field_name: str) -> datetime | None:
    if value is None:
        return None
    try:
        normalized = value.replace("Z", "+00:00")
        parsed = datetime.fromisoformat(normalized)
    except ValueError as exc:
        raise api_error(400, "VALIDATION_ERROR", f"Campo {field_name} deve estar em formato ISO 8601.") from exc
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


def optional_wallet(value: str | None) -> str | None:
    return normalize_wallet(value) if value else None


def require_role(profile: Profile, action: str) -> None:
    allowed = ACTION_ROLES[action]
    if profile.role not in allowed:
        raise api_error(
            403,
            "UNAUTHORIZED_ROLE",
            "Seu perfil não tem permissão para executar esta ação.",
            {"requiredRoles": sorted(allowed), "currentRole": profile.role},
        )


def require_party_wallet(contract: Contract, profile: Profile, field_name: str) -> None:
    expected = getattr(contract, field_name)
    if expected and expected.lower() != profile.wallet_address.lower():
        raise api_error(
            403,
            "UNAUTHORIZED_ROLE",
            "Esta ação exige a wallet vinculada a este contrato.",
            {"requiredWallet": expected, "currentWallet": profile.wallet_address},
        )


def get_contract_or_404(db: Session, contract_id: UUID) -> Contract:
    contract = db.get(Contract, contract_id)
    if contract is None:
        raise api_error(404, "NOT_FOUND", "Contrato não encontrado.")
    return contract


def ensure_status(contract: Contract, required_status: ContractStatus) -> None:
    if contract.status != required_status.value:
        raise api_error(
            422,
            "INVALID_STATUS_TRANSITION",
            f"Esta ação requer que o contrato esteja no status {required_status.value}.",
            {"currentStatus": contract.status, "requiredStatus": required_status.value},
        )


def ensure_not_terminal_for_dispute(contract: Contract) -> None:
    if contract.status in {ContractStatus.PAGAMENTO_AUTORIZADO.value, ContractStatus.DISPUTA.value}:
        raise api_error(
            422,
            "INVALID_STATUS_TRANSITION",
            "Não é possível abrir disputa para contrato já finalizado ou já em disputa.",
            {"currentStatus": contract.status},
        )


def create_event(
    db: Session,
    contract: Contract,
    event_type: ContractEventType,
    description: str,
    profile: Profile,
    status_before: str | None,
    status_after: str | None,
    document_hash: str | None = None,
    transaction_hash: str | None = None,
    blockchain_timestamp: datetime | None = None,
) -> ContractEvent:
    event = ContractEvent(
        contract_id=contract.id,
        event_type=event_type.value,
        description=description,
        responsible_role=profile.role,
        responsible_name=profile.name,
        responsible_wallet=profile.wallet_address,
        status_before=status_before,
        status_after=status_after,
        document_hash=document_hash,
        transaction_hash=transaction_hash,
        blockchain_timestamp=blockchain_timestamp,
    )
    db.add(event)
    db.flush()
    return event


def list_contracts(db: Session, status: str | None = None) -> list[Contract]:
    stmt = select(Contract).order_by(Contract.created_at.desc())
    if status:
        try:
            status_value = ContractStatus(status).value
        except ValueError as exc:
            raise api_error(400, "VALIDATION_ERROR", "Status inválido.", {"status": status}) from exc
        stmt = stmt.where(Contract.status == status_value)
    return list(db.scalars(stmt))


def create_contract(db: Session, body: CreateContractBody, profile: Profile) -> Contract:
    require_role(profile, "create")
    manager_wallet = optional_wallet(body.managerWallet) or profile.wallet_address
    manager_name = body.managerName or profile.name

    contract = Contract(
        contract_number=body.contractNumber,
        public_agency=body.publicAgency,
        supplier_name=body.supplierName,
        supplier_wallet=optional_wallet(body.supplierWallet),
        object=body.object,
        amount=body.amount,
        start_date=parse_dt(body.startDate, "startDate"),
        end_date=parse_dt(body.endDate, "endDate"),
        deadline=parse_dt(body.deadline, "deadline"),
        inspector_name=body.inspectorName,
        inspector_wallet=optional_wallet(body.inspectorWallet),
        logistics_responsible=body.logisticsResponsible,
        logistics_wallet=optional_wallet(body.logisticsWallet),
        manager_name=manager_name,
        manager_wallet=manager_wallet,
        status=ContractStatus.CRIADO.value,
        document_hash=body.documentHash,
    )
    db.add(contract)
    try:
        db.flush()
    except IntegrityError as exc:
        raise api_error(400, "VALIDATION_ERROR", "Número do contrato já cadastrado.") from exc

    create_event(
        db,
        contract,
        ContractEventType.CONTRATO_CRIADO,
        f"Contrato {contract.contract_number} criado por {profile.name}.",
        profile,
        None,
        ContractStatus.CRIADO.value,
        document_hash=contract.document_hash,
    )
    db.commit()
    db.refresh(contract)
    return contract


def update_contract(db: Session, contract: Contract, body: UpdateContractBody, profile: Profile) -> Contract:
    require_role(profile, "update")
    require_party_wallet(contract, profile, "manager_wallet")
    ensure_status(contract, ContractStatus.CRIADO)

    mapping: dict[str, Any] = {
        "contractNumber": "contract_number",
        "publicAgency": "public_agency",
        "supplierName": "supplier_name",
        "object": "object",
        "amount": "amount",
        "inspectorName": "inspector_name",
        "logisticsResponsible": "logistics_responsible",
        "managerName": "manager_name",
        "documentHash": "document_hash",
    }
    for public_name, column_name in mapping.items():
        value = getattr(body, public_name)
        if value is not None:
            setattr(contract, column_name, value)

    for public_name, column_name in {
        "supplierWallet": "supplier_wallet",
        "inspectorWallet": "inspector_wallet",
        "logisticsWallet": "logistics_wallet",
        "managerWallet": "manager_wallet",
    }.items():
        value = getattr(body, public_name)
        if value is not None:
            setattr(contract, column_name, optional_wallet(value))

    for public_name, column_name in {
        "startDate": "start_date",
        "endDate": "end_date",
        "deadline": "deadline",
    }.items():
        value = getattr(body, public_name)
        if value is not None:
            setattr(contract, column_name, parse_dt(value, public_name))

    try:
        db.commit()
    except IntegrityError as exc:
        raise api_error(400, "VALIDATION_ERROR", "Número do contrato já cadastrado.") from exc
    db.refresh(contract)
    return contract


def delete_contract(db: Session, contract: Contract, profile: Profile) -> None:
    require_role(profile, "delete")
    require_party_wallet(contract, profile, "manager_wallet")
    ensure_status(contract, ContractStatus.CRIADO)
    db.delete(contract)
    db.commit()


def action_result(contract: Contract, event: ContractEvent) -> ActionResultOut:
    return ActionResultOut(
        id=str(contract.id),
        status=contract.status,
        updatedAt=iso_z(contract.updated_at) or "",
        event={
            "id": str(event.id),
            "eventType": event.event_type,
            "transactionHash": event.transaction_hash,
            "createdAt": iso_z(event.created_at),
        },
    )


def run_flow_action(
    db: Session,
    contract: Contract,
    profile: Profile,
    action: str,
    required_status: ContractStatus,
    next_status: ContractStatus,
    event_type: ContractEventType,
    party_wallet_field: str,
    default_description: str,
    body: ContractActionBody | None,
) -> ActionResultOut:
    require_role(profile, action)
    require_party_wallet(contract, profile, party_wallet_field)
    ensure_status(contract, required_status)

    previous_status = contract.status
    contract.status = next_status.value
    description = (body.description if body else None) or (body.notes if body else None) or default_description
    event = create_event(
        db,
        contract,
        event_type,
        description,
        profile,
        previous_status,
        next_status.value,
        document_hash=body.documentHash if body else None,
    )
    db.commit()
    db.refresh(contract)
    db.refresh(event)
    return action_result(contract, event)


def open_dispute(db: Session, contract: Contract, profile: Profile, body: OpenDisputeBody) -> ActionResultOut:
    require_role(profile, "open_dispute")
    ensure_not_terminal_for_dispute(contract)

    previous_status = contract.status
    contract.status = ContractStatus.DISPUTA.value
    reason = body.reason if not body.notes else f"{body.reason}\n\nNotas: {body.notes}"

    dispute = Dispute(
        contract_id=contract.id,
        opened_by=profile.role,
        opened_by_wallet=profile.wallet_address,
        reason=reason,
        original_hash=contract.document_hash,
    )
    db.add(dispute)
    event = create_event(
        db,
        contract,
        ContractEventType.DISPUTA_ABERTA,
        reason,
        profile,
        previous_status,
        ContractStatus.DISPUTA.value,
    )
    db.commit()
    db.refresh(contract)
    db.refresh(event)
    return action_result(contract, event)


def simulate_fraud(db: Session, contract: Contract, profile: Profile, body: SimulateFraudBody) -> SimulateFraudResultOut:
    require_role(profile, "simulate_fraud")
    if not contract.document_hash:
        raise api_error(400, "VALIDATION_ERROR", "Contrato não possui documentHash original.")
    if contract.status in {ContractStatus.PAGAMENTO_AUTORIZADO.value, ContractStatus.DISPUTA.value}:
        raise api_error(
            422,
            "INVALID_STATUS_TRANSITION",
            "Não é possível simular fraude para contrato já finalizado ou já em disputa.",
            {"currentStatus": contract.status},
        )

    fraud_detected = contract.document_hash != body.newDocumentHash
    if not fraud_detected:
        return SimulateFraudResultOut(
            fraudDetected=False,
            message="Hashes idênticos. Nenhuma adulteração detectada.",
        )

    previous_status = contract.status
    original_hash = contract.document_hash
    contract.status = ContractStatus.DISPUTA.value

    fraud_event = create_event(
        db,
        contract,
        ContractEventType.FRAUDE_SIMULADA,
        body.reason or "Hash do documento diverge do original. Possível adulteração detectada.",
        profile,
        previous_status,
        ContractStatus.DISPUTA.value,
        document_hash=body.newDocumentHash,
    )
    dispute = Dispute(
        contract_id=contract.id,
        opened_by=profile.role,
        opened_by_wallet=profile.wallet_address,
        reason=body.reason or "Disputa aberta automaticamente por divergência de hash.",
        original_hash=original_hash,
        new_hash=body.newDocumentHash,
    )
    db.add(dispute)
    dispute_event = create_event(
        db,
        contract,
        ContractEventType.DISPUTA_ABERTA,
        "Disputa aberta automaticamente por divergência de hash.",
        profile,
        previous_status,
        ContractStatus.DISPUTA.value,
    )
    db.commit()
    db.refresh(contract)
    db.refresh(fraud_event)
    db.refresh(dispute_event)

    return SimulateFraudResultOut(
        id=str(contract.id),
        status=contract.status,
        fraudDetected=True,
        originalHash=original_hash,
        newHash=body.newDocumentHash,
        updatedAt=iso_z(contract.updated_at),
        events=[
            {"id": str(fraud_event.id), "eventType": fraud_event.event_type, "createdAt": iso_z(fraud_event.created_at)},
            {"id": str(dispute_event.id), "eventType": dispute_event.event_type, "createdAt": iso_z(dispute_event.created_at)},
        ],
    )


def dashboard_summary(db: Session) -> DashboardSummaryOut:
    rows = db.execute(select(Contract.status, func.count(Contract.id)).group_by(Contract.status)).all()
    counts = {status: count for status, count in rows}
    return DashboardSummaryOut(
        total=sum(counts.values()),
        criado=counts.get(ContractStatus.CRIADO.value, 0),
        enviado=counts.get(ContractStatus.ENVIADO.value, 0),
        entregue=counts.get(ContractStatus.ENTREGUE.value, 0),
        validado=counts.get(ContractStatus.VALIDADO.value, 0),
        pagamentoAutorizado=counts.get(ContractStatus.PAGAMENTO_AUTORIZADO.value, 0),
        disputa=counts.get(ContractStatus.DISPUTA.value, 0),
    )


def blockchain_status(contract: Contract) -> BlockchainStatusOut:
    blockchain_available = is_blockchain_available()
    return BlockchainStatusOut(
        contractId=str(contract.id),
        status=contract.status,
        documentHash=contract.document_hash,
        registeredOnChain=False,
        blockchainAvailable=blockchain_available,
        unavailableReason=None if blockchain_available else BLOCKCHAIN_UNAVAILABLE_MESSAGE,
    )


def register_on_chain(_: Session, contract: Contract, profile: Profile) -> None:
    require_role(profile, "register_on_chain")
    require_party_wallet(contract, profile, "manager_wallet")

    if not is_blockchain_available():
        raise api_error(
            503,
            "BLOCKCHAIN_UNAVAILABLE",
            BLOCKCHAIN_UNAVAILABLE_MESSAGE,
        )

    raise api_error(
        501,
        "BLOCKCHAIN_ERROR",
        "Registro on-chain ainda nao implementado.",
    )


def audit_events(db: Session) -> list[AuditEventItemOut]:
    rows = db.execute(
        select(ContractEvent, Contract)
        .join(Contract, ContractEvent.contract_id == Contract.id)
        .order_by(ContractEvent.created_at.desc())
    ).all()
    items: list[AuditEventItemOut] = []
    for event, contract in rows:
        serialized = event_out(event).model_dump()
        items.append(
            AuditEventItemOut(
                **serialized,
                contractNumber=contract.contract_number,
                contractObject=contract.object,
                contractStatus=contract.status,
            )
        )
    return items
