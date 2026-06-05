from __future__ import annotations

import enum
import uuid
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Index, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class ContractStatus(str, enum.Enum):
    CRIADO = "CRIADO"
    ENVIADO = "ENVIADO"
    ENTREGUE = "ENTREGUE"
    VALIDADO = "VALIDADO"
    PAGAMENTO_AUTORIZADO = "PAGAMENTO_AUTORIZADO"
    DISPUTA = "DISPUTA"


class UserRole(str, enum.Enum):
    GESTOR = "GESTOR"
    FORNECEDOR = "FORNECEDOR"
    ENTREGADOR = "ENTREGADOR"
    FISCAL = "FISCAL"
    AUDITOR = "AUDITOR"


class ContractEventType(str, enum.Enum):
    CONTRATO_CRIADO = "CONTRATO_CRIADO"
    ENVIO_CONFIRMADO = "ENVIO_CONFIRMADO"
    ENTREGA_CONFIRMADA = "ENTREGA_CONFIRMADA"
    RECEBIMENTO_VALIDADO = "RECEBIMENTO_VALIDADO"
    PAGAMENTO_AUTORIZADO = "PAGAMENTO_AUTORIZADO"
    DISPUTA_ABERTA = "DISPUTA_ABERTA"
    FRAUDE_SIMULADA = "FRAUDE_SIMULADA"
    HASH_REGISTRADO = "HASH_REGISTRADO"


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False)
    wallet_address: Mapped[str] = mapped_column(String(42), unique=True, index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    __table_args__ = (
        CheckConstraint(
            "role IN ('GESTOR', 'FORNECEDOR', 'ENTREGADOR', 'FISCAL', 'AUDITOR')",
            name="chk_profiles_role",
        ),
    )


class AuthNonce(Base):
    __tablename__ = "auth_nonces"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    wallet_address: Mapped[str] = mapped_column(String(42), nullable=False, index=True)
    nonce: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)

    __table_args__ = (Index("idx_auth_nonces_wallet_nonce", "wallet_address", "nonce"),)


class Contract(Base):
    __tablename__ = "contracts"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contract_number: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    public_agency: Mapped[str] = mapped_column(String(255), nullable=False)
    supplier_name: Mapped[str] = mapped_column(String(255), nullable=False)
    supplier_wallet: Mapped[str | None] = mapped_column(String(42), nullable=True)
    object: Mapped[str] = mapped_column(Text, nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)
    start_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    end_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    deadline: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    inspector_name: Mapped[str] = mapped_column(String(255), nullable=False)
    inspector_wallet: Mapped[str | None] = mapped_column(String(42), nullable=True)
    logistics_responsible: Mapped[str] = mapped_column(String(255), nullable=False)
    logistics_wallet: Mapped[str | None] = mapped_column(String(42), nullable=True)
    manager_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    manager_wallet: Mapped[str | None] = mapped_column(String(42), nullable=True)
    status: Mapped[str] = mapped_column(String(30), default=ContractStatus.CRIADO.value, nullable=False, index=True)
    document_hash: Mapped[str | None] = mapped_column(Text, nullable=True)
    blockchain_contract_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    events: Mapped[list[ContractEvent]] = relationship(back_populates="contract", cascade="all, delete-orphan")
    disputes: Mapped[list[Dispute]] = relationship(back_populates="contract", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint("amount > 0", name="chk_contracts_amount_positive"),
        CheckConstraint(
            "status IN ('CRIADO', 'ENVIADO', 'ENTREGUE', 'VALIDADO', 'PAGAMENTO_AUTORIZADO', 'DISPUTA')",
            name="chk_contracts_status",
        ),
        Index("idx_contracts_status", "status"),
    )


class ContractEvent(Base):
    __tablename__ = "contract_events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contract_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("contracts.id", ondelete="CASCADE"), nullable=False, index=True)
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    responsible_role: Mapped[str] = mapped_column(String(20), nullable=False)
    responsible_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    responsible_wallet: Mapped[str | None] = mapped_column(String(42), nullable=True)
    status_before: Mapped[str | None] = mapped_column(String(30), nullable=True)
    status_after: Mapped[str | None] = mapped_column(String(30), nullable=True)
    document_hash: Mapped[str | None] = mapped_column(Text, nullable=True)
    transaction_hash: Mapped[str | None] = mapped_column(Text, nullable=True)
    blockchain_timestamp: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False, index=True)

    contract: Mapped[Contract] = relationship(back_populates="events")

    __table_args__ = (
        CheckConstraint(
            "event_type IN ('CONTRATO_CRIADO', 'ENVIO_CONFIRMADO', 'ENTREGA_CONFIRMADA', 'RECEBIMENTO_VALIDADO', 'PAGAMENTO_AUTORIZADO', 'DISPUTA_ABERTA', 'FRAUDE_SIMULADA', 'HASH_REGISTRADO')",
            name="chk_contract_events_event_type",
        ),
        CheckConstraint(
            "responsible_role IN ('GESTOR', 'FORNECEDOR', 'ENTREGADOR', 'FISCAL', 'AUDITOR')",
            name="chk_contract_events_role",
        ),
        Index("idx_events_contract_created", "contract_id", "created_at"),
    )


class Dispute(Base):
    __tablename__ = "disputes"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contract_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("contracts.id", ondelete="CASCADE"), nullable=False, index=True)
    opened_by: Mapped[str] = mapped_column(String(20), nullable=False)
    opened_by_wallet: Mapped[str | None] = mapped_column(String(42), nullable=True)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    original_hash: Mapped[str | None] = mapped_column(Text, nullable=True)
    new_hash: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)

    contract: Mapped[Contract] = relationship(back_populates="disputes")

    __table_args__ = (
        CheckConstraint(
            "opened_by IN ('GESTOR', 'FORNECEDOR', 'ENTREGADOR', 'FISCAL', 'AUDITOR')",
            name="chk_disputes_opened_by",
        ),
    )
