from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Body, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_profile
from app.models import ContractEventType, ContractStatus, Profile
from app.schemas import ContractActionBody, CreateContractBody, OpenDisputeBody, SimulateFraudBody, UpdateContractBody
from app.serializers import contract_out, event_out
from app.services import contracts as service

router = APIRouter(prefix="/contracts", tags=["contracts"])


@router.get("")
def list_contracts(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[Profile, Depends(get_current_profile)],
    status: Annotated[str | None, Query()] = None,
):
    return {"data": [contract_out(item) for item in service.list_contracts(db, status)]}


@router.post("", status_code=201)
def create_contract(
    body: CreateContractBody,
    db: Annotated[Session, Depends(get_db)],
    profile: Annotated[Profile, Depends(get_current_profile)],
):
    contract = service.create_contract(db, body, profile)
    return {"data": contract_out(contract), "message": "Contrato criado com sucesso."}


@router.get("/{contract_id}")
def get_contract(
    contract_id: UUID,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[Profile, Depends(get_current_profile)],
):
    return {"data": contract_out(service.get_contract_or_404(db, contract_id))}


@router.patch("/{contract_id}")
def update_contract(
    contract_id: UUID,
    body: UpdateContractBody,
    db: Annotated[Session, Depends(get_db)],
    profile: Annotated[Profile, Depends(get_current_profile)],
):
    contract = service.get_contract_or_404(db, contract_id)
    updated = service.update_contract(db, contract, body, profile)
    return {"data": contract_out(updated), "message": "Contrato atualizado com sucesso."}


@router.delete("/{contract_id}")
def delete_contract(
    contract_id: UUID,
    db: Annotated[Session, Depends(get_db)],
    profile: Annotated[Profile, Depends(get_current_profile)],
):
    contract = service.get_contract_or_404(db, contract_id)
    service.delete_contract(db, contract, profile)
    return {"data": None, "message": "Contrato excluído com sucesso."}


@router.get("/{contract_id}/events")
def get_events(
    contract_id: UUID,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[Profile, Depends(get_current_profile)],
):
    contract = service.get_contract_or_404(db, contract_id)
    events = sorted(contract.events, key=lambda item: item.created_at)
    return {"data": [event_out(event) for event in events]}


@router.post("/{contract_id}/confirm-shipment")
def confirm_shipment(
    contract_id: UUID,
    db: Annotated[Session, Depends(get_db)],
    profile: Annotated[Profile, Depends(get_current_profile)],
    body: Annotated[ContractActionBody | None, Body()] = None,
):
    contract = service.get_contract_or_404(db, contract_id)
    result = service.run_flow_action(
        db,
        contract,
        profile,
        action="confirm_shipment",
        required_status=ContractStatus.CRIADO,
        next_status=ContractStatus.ENVIADO,
        event_type=ContractEventType.ENVIO_CONFIRMADO,
        party_wallet_field="supplier_wallet",
        default_description="Envio confirmado pelo fornecedor.",
        body=body,
    )
    return {"data": result, "message": "Envio confirmado com sucesso."}


@router.post("/{contract_id}/confirm-delivery")
def confirm_delivery(
    contract_id: UUID,
    db: Annotated[Session, Depends(get_db)],
    profile: Annotated[Profile, Depends(get_current_profile)],
    body: Annotated[ContractActionBody | None, Body()] = None,
):
    contract = service.get_contract_or_404(db, contract_id)
    result = service.run_flow_action(
        db,
        contract,
        profile,
        action="confirm_delivery",
        required_status=ContractStatus.ENVIADO,
        next_status=ContractStatus.ENTREGUE,
        event_type=ContractEventType.ENTREGA_CONFIRMADA,
        party_wallet_field="logistics_wallet",
        default_description="Entrega confirmada pelo responsável logístico.",
        body=body,
    )
    return {"data": result, "message": "Entrega confirmada com sucesso."}


@router.post("/{contract_id}/validate-receipt")
def validate_receipt(
    contract_id: UUID,
    db: Annotated[Session, Depends(get_db)],
    profile: Annotated[Profile, Depends(get_current_profile)],
    body: Annotated[ContractActionBody | None, Body()] = None,
):
    contract = service.get_contract_or_404(db, contract_id)
    result = service.run_flow_action(
        db,
        contract,
        profile,
        action="validate_receipt",
        required_status=ContractStatus.ENTREGUE,
        next_status=ContractStatus.VALIDADO,
        event_type=ContractEventType.RECEBIMENTO_VALIDADO,
        party_wallet_field="inspector_wallet",
        default_description="Recebimento validado pelo fiscal.",
        body=body,
    )
    return {"data": result, "message": "Recebimento validado com sucesso."}


@router.post("/{contract_id}/authorize-payment")
def authorize_payment(
    contract_id: UUID,
    db: Annotated[Session, Depends(get_db)],
    profile: Annotated[Profile, Depends(get_current_profile)],
    body: Annotated[ContractActionBody | None, Body()] = None,
):
    contract = service.get_contract_or_404(db, contract_id)
    result = service.run_flow_action(
        db,
        contract,
        profile,
        action="authorize_payment",
        required_status=ContractStatus.VALIDADO,
        next_status=ContractStatus.PAGAMENTO_AUTORIZADO,
        event_type=ContractEventType.PAGAMENTO_AUTORIZADO,
        party_wallet_field="manager_wallet",
        default_description="Pagamento autorizado pelo gestor.",
        body=body,
    )
    return {"data": result, "message": "Pagamento autorizado com sucesso."}


@router.post("/{contract_id}/open-dispute")
def open_dispute(
    contract_id: UUID,
    body: OpenDisputeBody,
    db: Annotated[Session, Depends(get_db)],
    profile: Annotated[Profile, Depends(get_current_profile)],
):
    contract = service.get_contract_or_404(db, contract_id)
    result = service.open_dispute(db, contract, profile, body)
    return {"data": result, "message": "Disputa registrada. Pagamento bloqueado."}


@router.post("/{contract_id}/simulate-fraud")
def simulate_fraud(
    contract_id: UUID,
    body: SimulateFraudBody,
    db: Annotated[Session, Depends(get_db)],
    profile: Annotated[Profile, Depends(get_current_profile)],
):
    contract = service.get_contract_or_404(db, contract_id)
    result = service.simulate_fraud(db, contract, profile, body)
    message = (
        "Fraude detectada: hash do documento diverge do original. Disputa aberta automaticamente."
        if result.fraudDetected
        else "Hashes idênticos. Nenhuma adulteração detectada."
    )
    return {"data": result, "message": message}


@router.get("/{contract_id}/blockchain-status")
def blockchain_status(
    contract_id: UUID,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[Profile, Depends(get_current_profile)],
):
    contract = service.get_contract_or_404(db, contract_id)
    return {"data": service.blockchain_status(contract)}


@router.post("/{contract_id}/register-on-chain")
def register_on_chain(
    contract_id: UUID,
    db: Annotated[Session, Depends(get_db)],
    profile: Annotated[Profile, Depends(get_current_profile)],
):
    contract = service.get_contract_or_404(db, contract_id)
    service.register_on_chain(db, contract, profile)
    return {"data": None}
