
from datetime import date

from app.rules.requirements import EXPIRATION_WARNING_DAYS
from app.schemas.monitoring import ExpirationAlert
from app.schemas.supplier import DocumentStatus
from app.services.supplier_service import list_suppliers


def get_expiration_alerts(
    days: int = EXPIRATION_WARNING_DAYS,
) -> list[ExpirationAlert]:

    today = date.today()
    alerts = []

    for supplier in list_suppliers():
        for document in supplier.documents:

            if document.status == DocumentStatus.MISSING:
                continue

            if document.expiration_date is None:
                continue

            days_remaining = (
                document.expiration_date - today
            ).days

            if days_remaining > days:
                continue

            if days_remaining < 0:
                severity = "critical"
                message = (
                    f"{document.name} está vencido há "
                    f"{abs(days_remaining)} dia(s)."
                )

            else:
                severity = (
                    "high" if days_remaining <= 7 else "medium"
                )

                message = (
                    f"{document.name} vence em "
                    f"{days_remaining} dia(s)."
                )

            alerts.append(
                ExpirationAlert(
                    supplier_id=supplier.id,
                    supplier_name=supplier.trade_name,
                    document_type=document.document_type,
                    document_name=document.name,
                    expiration_date=document.expiration_date,
                    days_remaining=days_remaining,
                    severity=severity,
                    message=message,
                    simulated=True,
                )
            )

    return sorted(
        alerts,
        key=lambda alert: alert.days_remaining,
    )
