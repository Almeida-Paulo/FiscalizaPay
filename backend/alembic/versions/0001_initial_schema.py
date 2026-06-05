"""initial schema

Revision ID: 0001_initial_schema
Revises:
Create Date: 2026-06-04
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0001_initial_schema"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "profiles",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=20), nullable=False),
        sa.Column("wallet_address", sa.String(length=42), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint("role IN ('GESTOR', 'FORNECEDOR', 'ENTREGADOR', 'FISCAL', 'AUDITOR')", name="chk_profiles_role"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("wallet_address"),
    )
    op.create_index(op.f("ix_profiles_wallet_address"), "profiles", ["wallet_address"], unique=False)

    op.create_table(
        "auth_nonces",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("wallet_address", sa.String(length=42), nullable=False),
        sa.Column("nonce", sa.String(length=64), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("used_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_auth_nonces_wallet_nonce", "auth_nonces", ["wallet_address", "nonce"], unique=False)
    op.create_index(op.f("ix_auth_nonces_nonce"), "auth_nonces", ["nonce"], unique=False)
    op.create_index(op.f("ix_auth_nonces_wallet_address"), "auth_nonces", ["wallet_address"], unique=False)

    op.create_table(
        "contracts",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("contract_number", sa.String(length=100), nullable=False),
        sa.Column("public_agency", sa.String(length=255), nullable=False),
        sa.Column("supplier_name", sa.String(length=255), nullable=False),
        sa.Column("supplier_wallet", sa.String(length=42), nullable=True),
        sa.Column("object", sa.Text(), nullable=False),
        sa.Column("amount", sa.Numeric(precision=15, scale=2), nullable=False),
        sa.Column("start_date", sa.DateTime(timezone=True), nullable=True),
        sa.Column("end_date", sa.DateTime(timezone=True), nullable=True),
        sa.Column("deadline", sa.DateTime(timezone=True), nullable=False),
        sa.Column("inspector_name", sa.String(length=255), nullable=False),
        sa.Column("inspector_wallet", sa.String(length=42), nullable=True),
        sa.Column("logistics_responsible", sa.String(length=255), nullable=False),
        sa.Column("logistics_wallet", sa.String(length=42), nullable=True),
        sa.Column("manager_name", sa.String(length=255), nullable=True),
        sa.Column("manager_wallet", sa.String(length=42), nullable=True),
        sa.Column("status", sa.String(length=30), nullable=False),
        sa.Column("document_hash", sa.Text(), nullable=True),
        sa.Column("blockchain_contract_id", sa.String(length=100), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint("amount > 0", name="chk_contracts_amount_positive"),
        sa.CheckConstraint("status IN ('CRIADO', 'ENVIADO', 'ENTREGUE', 'VALIDADO', 'PAGAMENTO_AUTORIZADO', 'DISPUTA')", name="chk_contracts_status"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("contract_number"),
    )
    op.create_index("idx_contracts_status", "contracts", ["status"], unique=False)
    op.create_index(op.f("ix_contracts_contract_number"), "contracts", ["contract_number"], unique=False)
    op.create_index(op.f("ix_contracts_status"), "contracts", ["status"], unique=False)

    op.create_table(
        "contract_events",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("contract_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("event_type", sa.String(length=50), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("responsible_role", sa.String(length=20), nullable=False),
        sa.Column("responsible_name", sa.String(length=255), nullable=True),
        sa.Column("responsible_wallet", sa.String(length=42), nullable=True),
        sa.Column("status_before", sa.String(length=30), nullable=True),
        sa.Column("status_after", sa.String(length=30), nullable=True),
        sa.Column("document_hash", sa.Text(), nullable=True),
        sa.Column("transaction_hash", sa.Text(), nullable=True),
        sa.Column("blockchain_timestamp", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint("event_type IN ('CONTRATO_CRIADO', 'ENVIO_CONFIRMADO', 'ENTREGA_CONFIRMADA', 'RECEBIMENTO_VALIDADO', 'PAGAMENTO_AUTORIZADO', 'DISPUTA_ABERTA', 'FRAUDE_SIMULADA', 'HASH_REGISTRADO')", name="chk_contract_events_event_type"),
        sa.CheckConstraint("responsible_role IN ('GESTOR', 'FORNECEDOR', 'ENTREGADOR', 'FISCAL', 'AUDITOR')", name="chk_contract_events_role"),
        sa.ForeignKeyConstraint(["contract_id"], ["contracts.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_events_contract_created", "contract_events", ["contract_id", "created_at"], unique=False)
    op.create_index(op.f("ix_contract_events_contract_id"), "contract_events", ["contract_id"], unique=False)
    op.create_index(op.f("ix_contract_events_created_at"), "contract_events", ["created_at"], unique=False)

    op.create_table(
        "disputes",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("contract_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("opened_by", sa.String(length=20), nullable=False),
        sa.Column("opened_by_wallet", sa.String(length=42), nullable=True),
        sa.Column("reason", sa.Text(), nullable=False),
        sa.Column("original_hash", sa.Text(), nullable=True),
        sa.Column("new_hash", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint("opened_by IN ('GESTOR', 'FORNECEDOR', 'ENTREGADOR', 'FISCAL', 'AUDITOR')", name="chk_disputes_opened_by"),
        sa.ForeignKeyConstraint(["contract_id"], ["contracts.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_disputes_contract_id"), "disputes", ["contract_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_disputes_contract_id"), table_name="disputes")
    op.drop_table("disputes")
    op.drop_index(op.f("ix_contract_events_created_at"), table_name="contract_events")
    op.drop_index(op.f("ix_contract_events_contract_id"), table_name="contract_events")
    op.drop_index("idx_events_contract_created", table_name="contract_events")
    op.drop_table("contract_events")
    op.drop_index(op.f("ix_contracts_status"), table_name="contracts")
    op.drop_index(op.f("ix_contracts_contract_number"), table_name="contracts")
    op.drop_index("idx_contracts_status", table_name="contracts")
    op.drop_table("contracts")
    op.drop_index(op.f("ix_auth_nonces_wallet_address"), table_name="auth_nonces")
    op.drop_index(op.f("ix_auth_nonces_nonce"), table_name="auth_nonces")
    op.drop_index("idx_auth_nonces_wallet_nonce", table_name="auth_nonces")
    op.drop_table("auth_nonces")
    op.drop_index(op.f("ix_profiles_wallet_address"), table_name="profiles")
    op.drop_table("profiles")
