from __future__ import annotations

import re
import secrets
from datetime import datetime, timedelta, timezone
from uuid import UUID

import jwt
from eth_account import Account
from eth_account.messages import encode_defunct

from app.config import get_settings
from app.errors import api_error
from app.models import Profile
from app.schemas import iso_z

WALLET_RE = re.compile(r"^0x[a-fA-F0-9]{40}$")


def normalize_wallet(wallet_address: str) -> str:
    """Normaliza wallets EVM para comparacoes case-insensitive no backend."""
    value = wallet_address.strip()
    if not WALLET_RE.match(value):
        raise api_error(
            400,
            "VALIDATION_ERROR",
            "Endereço de wallet inválido. Use um endereço EVM no formato 0x + 40 caracteres hexadecimais.",
        )
    return value.lower()


def generate_nonce() -> str:
    return secrets.token_hex(24)


def build_login_message(wallet_address: str, nonce: str, expires_at: datetime) -> str:
    """Monta a mensagem humana que a MetaMask mostra antes da assinatura."""
    settings = get_settings()
    return (
        "FiscalizaPay Web3\n\n"
        "Assine esta mensagem para autenticar sua wallet.\n"
        "Esta assinatura não realiza transação e não gasta gas.\n\n"
        f"Wallet: {wallet_address}\n"
        f"Chain ID: {settings.chain_id}\n"
        f"Nonce: {nonce}\n"
        f"Expira em: {iso_z(expires_at)}"
    )


def recover_wallet_from_signature(message: str, signature: str) -> str:
    """Recupera o endereco que assinou a mensagem e rejeita assinaturas invalidas."""
    try:
        recovered = Account.recover_message(encode_defunct(text=message), signature=signature)
    except Exception as exc:
        raise api_error(401, "UNAUTHORIZED_ROLE", "Assinatura de wallet inválida.") from exc
    return recovered.lower()


def create_access_token(profile: Profile) -> tuple[str, datetime]:
    """Gera JWT curto contendo apenas dados necessarios para autorizacao."""
    settings = get_settings()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expires_minutes)
    payload = {
        "sub": str(profile.id),
        "walletAddress": profile.wallet_address,
        "role": profile.role,
        "exp": int(expires_at.timestamp()),
    }
    token = jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return token, expires_at


def decode_access_token(token: str) -> dict:
    settings = get_settings()
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except jwt.ExpiredSignatureError as exc:
        raise api_error(401, "UNAUTHORIZED_ROLE", "Sessão expirada. Faça login novamente.") from exc
    except jwt.InvalidTokenError as exc:
        raise api_error(401, "UNAUTHORIZED_ROLE", "Token de autenticação inválido.") from exc


def parse_profile_id(value: str) -> UUID:
    try:
        return UUID(value)
    except ValueError as exc:
        raise api_error(401, "UNAUTHORIZED_ROLE", "Token de autenticação inválido.") from exc
