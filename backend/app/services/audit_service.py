
import json

from sqlalchemy.orm import Session

from app.models.audit import EvaluationAudit
from app.schemas.evaluation import SupplierEvaluation


def save_evaluation(
    db: Session,
    evaluation: SupplierEvaluation,
) -> EvaluationAudit:

    audit = EvaluationAudit(
        supplier_id=evaluation.supplier_id,
        supplier_name=evaluation.supplier_name,
        status=evaluation.status.value,
        risk_score=evaluation.risk_score,
        can_contract=evaluation.can_contract,
        summary=evaluation.summary,
        findings_json=json.dumps(
            [
                finding.model_dump(mode="json")
                for finding in evaluation.findings
            ],
            ensure_ascii=False,
        ),
        evaluated_at=evaluation.evaluated_at,
        simulated=evaluation.simulated,
    )

    db.add(audit)
    db.commit()
    db.refresh(audit)

    return audit


def get_supplier_history(
    db: Session,
    supplier_id: str,
) -> list[EvaluationAudit]:

    return (
        db.query(EvaluationAudit)
        .filter(EvaluationAudit.supplier_id == supplier_id)
        .order_by(EvaluationAudit.id.desc())
        .all()
    )


def get_all_audits(
    db: Session,
    limit: int = 100,
) -> list[EvaluationAudit]:

    return (
        db.query(EvaluationAudit)
        .order_by(EvaluationAudit.id.desc())
        .limit(limit)
        .all()
    )
