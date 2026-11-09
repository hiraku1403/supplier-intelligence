
from collections import Counter

from app.services.compliance_service import evaluate_supplier
from app.services.monitoring_service import get_expiration_alerts
from app.services.supplier_service import list_suppliers


def get_dashboard_metrics():

    suppliers = list_suppliers()

    evaluations = [
        evaluate_supplier(supplier)
        for supplier in suppliers
    ]

    status_counts = Counter(
        evaluation.status.value
        for evaluation in evaluations
    )

    category_counts = Counter(
        supplier.category.value
        for supplier in suppliers
    )

    alerts = get_expiration_alerts()

    expired_alerts = [
        alert for alert in alerts
        if alert.days_remaining < 0
    ]

    upcoming_alerts = [
        alert for alert in alerts
        if alert.days_remaining >= 0
    ]

    return {
        "total_suppliers": len(suppliers),
        "approved": status_counts.get("approved", 0),
        "pending_review": status_counts.get("pending_review", 0),
        "blocked": status_counts.get("blocked", 0),
        "expired_documents": len(expired_alerts),
        "upcoming_expirations": len(upcoming_alerts),
        "categories": dict(category_counts),
        "recent_alerts": [
            alert.model_dump(mode="json")
            for alert in alerts[:5]
        ],
        "simulated": True,
    }
