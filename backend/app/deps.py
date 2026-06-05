from typing import Annotated
from uuid import UUID

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.errors import api_error
from app.models import Profile
from app.security import decode_access_token, parse_profile_id

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_profile(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> Profile:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise api_error(401, "UNAUTHORIZED_ROLE", "Autenticação obrigatória.")

    payload = decode_access_token(credentials.credentials)
    profile_id: UUID = parse_profile_id(str(payload.get("sub", "")))
    profile = db.get(Profile, profile_id)
    if profile is None:
        raise api_error(401, "UNAUTHORIZED_ROLE", "Perfil autenticado não encontrado.")
    return profile
