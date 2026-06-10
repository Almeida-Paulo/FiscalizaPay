from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models import ContractEventType, ContractStatus, UserRole


def iso_z(value: datetime | None) -> str | None:
    """Serializa datetimes no padrao ISO com Z usado pelo frontend."""
    if value is None:
        return None
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


class ApiResponse(BaseModel):
    data: Any
    message: str | None = None


class ProfileOut(BaseModel):
    id: str
    name: str
    role: UserRole
    walletAddress: str
    createdAt: str
    updatedAt: str


class NonceOut(BaseModel):
    walletAddress: str
    nonce: str
    message: str
    expiresAt: str


class VerifyWalletBody(BaseModel):
    walletAddress: str
    nonce: str
    signature: str


class AuthTokenOut(BaseModel):
    accessToken: str
    tokenType: str = "bearer"
    expiresAt: str
    profile: ProfileOut


class CreateContractBody(BaseModel):
    contractNumber: str = Field(min_length=3, max_length=100)
    publicAgency: str = Field(min_length=1, max_length=255)
    supplierName: str = Field(min_length=1, max_length=255)
    supplierWallet: str | None = None
    object: str = Field(min_length=10)
    amount: Decimal = Field(gt=0)
    startDate: str | None = None
    endDate: str | None = None
    deadline: str
    inspectorName: str = Field(min_length=1, max_length=255)
    inspectorWallet: str | None = None
    logisticsResponsible: str = Field(min_length=1, max_length=255)
    logisticsWallet: str | None = None
    managerName: str | None = None
    managerWallet: str | None = None
    documentHash: str | None = None

    @field_validator("contractNumber", "publicAgency", "supplierName", "object", "deadline", "inspectorName", "logisticsResponsible")
    @classmethod
    def strip_required(cls, value: str) -> str:
        return value.strip()

    @field_validator("supplierWallet", "inspectorWallet", "logisticsWallet", "managerWallet", "documentHash", "managerName", "startDate", "endDate")
    @classmethod
    def blank_to_none(cls, value: str | None) -> str | None:
        if value is None:
            return None
        stripped = value.strip()
        return stripped or None


class UpdateContractBody(BaseModel):
    contractNumber: str | None = None
    publicAgency: str | None = None
    supplierName: str | None = None
    supplierWallet: str | None = None
    object: str | None = None
    amount: Decimal | None = Field(default=None, gt=0)
    startDate: str | None = None
    endDate: str | None = None
    deadline: str | None = None
    inspectorName: str | None = None
    inspectorWallet: str | None = None
    logisticsResponsible: str | None = None
    logisticsWallet: str | None = None
    managerName: str | None = None
    managerWallet: str | None = None
    documentHash: str | None = None


class ContractActionBody(BaseModel):
    notes: str | None = None
    description: str | None = None
    documentHash: str | None = None


class OpenDisputeBody(BaseModel):
    reason: str = Field(min_length=10)
    disputeType: str | None = None
    notes: str | None = None


class SimulateFraudBody(BaseModel):
    newDocumentHash: str = Field(min_length=16)
    reason: str | None = None


class ContractOut(BaseModel):
    id: str
    contractNumber: str
    publicAgency: str
    supplierName: str
    supplierWallet: str | None = None
    object: str
    amount: float
    startDate: str | None = None
    endDate: str | None = None
    deadline: str
    inspectorName: str
    inspectorWallet: str | None = None
    logisticsResponsible: str
    logisticsWallet: str | None = None
    managerName: str | None = None
    managerWallet: str | None = None
    status: ContractStatus
    documentHash: str | None = None
    blockchainContractId: str | None = None
    createdAt: str
    updatedAt: str


class ContractEventOut(BaseModel):
    id: str
    contractId: str
    eventType: ContractEventType
    description: str
    responsibleRole: UserRole
    responsibleName: str | None = None
    responsibleWallet: str | None = None
    statusBefore: ContractStatus | None = None
    statusAfter: ContractStatus | None = None
    documentHash: str | None = None
    transactionHash: str | None = None
    blockchainTimestamp: str | None = None
    createdAt: str


class ActionResultOut(BaseModel):
    id: str
    status: ContractStatus
    updatedAt: str
    event: dict[str, Any]


class DashboardSummaryOut(BaseModel):
    total: int
    criado: int
    enviado: int
    entregue: int
    validado: int
    pagamentoAutorizado: int
    disputa: int


class BlockchainStatusOut(BaseModel):
    contractId: str
    status: ContractStatus | None = None
    documentHash: str | None = None
    transactionHash: str | None = None
    blockNumber: int | None = None
    blockchainTimestamp: str | None = None
    registeredOnChain: bool
    blockchainAvailable: bool = False
    unavailableReason: str | None = None


class RegisterOnChainResultOut(BaseModel):
    contractId: str
    transactionHash: str
    blockNumber: int
    blockchainTimestamp: str
    registeredOnChain: bool = True
    event: dict[str, Any]


class SimulateFraudResultOut(BaseModel):
    id: str | None = None
    status: ContractStatus | None = None
    fraudDetected: bool
    originalHash: str | None = None
    newHash: str | None = None
    updatedAt: str | None = None
    events: list[dict[str, Any]] | None = None
    message: str | None = None


class AuditEventItemOut(ContractEventOut):
    contractNumber: str
    contractObject: str
    contractStatus: ContractStatus


class HealthOut(BaseModel):
    status: str
    app: str
    environment: str


class JwtPayload(BaseModel):
    # Ignora claims extras para permitir evolucao do token sem quebrar validacao.
    model_config = ConfigDict(extra="ignore")

    sub: UUID
    walletAddress: str
    role: UserRole
    exp: int
