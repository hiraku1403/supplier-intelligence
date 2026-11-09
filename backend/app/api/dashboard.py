
from fastapi import APIRouter

from app.services.dashboard_service import get_dashboard_metrics

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/metrics")
def dashboard_metrics():
    return get_dashboard_metrics()
