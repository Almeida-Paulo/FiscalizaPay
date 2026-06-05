from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_profile
from app.models import Profile
from app.schemas import VerifyWalletBody
from app.serializers import profile_out
from app.services.auth import create_nonce, verify_wallet

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/nonce")
def nonce(walletAddress: Annotated[str, Query(min_length=42, max_length=42)], db: Annotated[Session, Depends(get_db)]):
    return {"data": create_nonce(db, walletAddress)}


@router.post("/verify")
def verify(body: VerifyWalletBody, db: Annotated[Session, Depends(get_db)]):
    return {"data": verify_wallet(db, body), "message": "Wallet autenticada com sucesso."}


@router.get("/me")
def me(profile: Annotated[Profile, Depends(get_current_profile)]):
    return {"data": profile_out(profile)}
