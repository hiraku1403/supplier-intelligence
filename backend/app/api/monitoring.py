
from fastapi import APIRouter, Query

from app.schemas.monitoring import ExpirationAlert
from app.services.monitoring_service import get_expiration_alerts

router = APIRouter(
    prefix="/monitoring",
    tags=["Monitoring"],
)


@router.get(
    "/expirations",
    response_model=list[ExpirationAlert],
)
def expiration_alerts(
    days: int = Query(default=15, ge=0, le=365),
):
    return get_expiration_alerts(days)
