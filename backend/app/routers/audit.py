from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_profile
from app.models import Profile
from app.services.contracts import audit_events

router = APIRouter(prefix="/audit", tags=["audit"])


@router.get("/events")
def events(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[Profile, Depends(get_current_profile)],
):
    return {"data": audit_events(db)}
