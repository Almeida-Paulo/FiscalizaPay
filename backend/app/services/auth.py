from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import get_settings
from app.errors import api_error
from app.models import AuthNonce, Profile
from app.schemas import AuthTokenOut, NonceOut, VerifyWalletBody, iso_z
from app.security import (
    build_login_message,
    create_access_token,
    generate_nonce,
    normalize_wallet,
    recover_wallet_from_signature,
)
from app.serializers import profile_out


def create_nonce(db: Session, wallet_address: str) -> NonceOut:
    wallet = normalize_wallet(wallet_address)
    settings = get_settings()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.auth_nonce_expires_minutes)
    nonce = generate_nonce()
    message = build_login_message(wallet, nonce, expires_at)

    record = AuthNonce(wallet_address=wallet, nonce=nonce, message=message, expires_at=expires_at)
    db.add(record)
    db.commit()

    return NonceOut(walletAddress=wallet, nonce=nonce, message=message, expiresAt=iso_z(expires_at) or "")


def verify_wallet(db: Session, body: VerifyWalletBody) -> AuthTokenOut:
    wallet = normalize_wallet(body.walletAddress)
    nonce_record = db.scalar(
        select(AuthNonce)
        .where(AuthNonce.wallet_address == wallet)
        .where(AuthNonce.nonce == body.nonce)
        .where(AuthNonce.used_at.is_(None))
        .order_by(AuthNonce.created_at.desc())
    )
    if nonce_record is None:
        raise api_error(401, "UNAUTHORIZED_ROLE", "Nonce inválido ou já utilizado.")

    now = datetime.now(timezone.utc)
    if nonce_record.expires_at < now:
        raise api_error(401, "UNAUTHORIZED_ROLE", "Nonce expirado. Solicite uma nova assinatura.")

    recovered_wallet = recover_wallet_from_signature(nonce_record.message, body.signature)
    if recovered_wallet != wallet:
        raise api_error(401, "UNAUTHORIZED_ROLE", "A assinatura não corresponde à wallet informada.")

    profile = db.scalar(select(Profile).where(Profile.wallet_address == wallet))
    if profile is None:
        raise api_error(
            403,
            "UNAUTHORIZED_ROLE",
            "Wallet autenticada, mas sem perfil cadastrado no FiscalizaPay.",
            {"walletAddress": wallet},
        )

    nonce_record.used_at = now
    token, expires_at = create_access_token(profile)
    db.commit()

    return AuthTokenOut(
        accessToken=token,
        expiresAt=iso_z(expires_at) or "",
        profile=profile_out(profile),
    )
