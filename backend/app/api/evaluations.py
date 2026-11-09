
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.audit import AuditRecord
from app.schemas.evaluation import SupplierEvaluation
from app.services.audit_service import (
    get_supplier_history,
    save_evaluation,
    get_all_audits,
)
from app.services.compliance_service import evaluate_supplier
from app.services.supplier_service import get_supplier_by_id


router = APIRouter(
    prefix="/evaluations",
    tags=["Evaluations"],
)

@router.get(
    "/audit",
    response_model=list[AuditRecord],
)
def audit_trail(
    db: Session = Depends(get_db),
):
    records = get_all_audits(db)

    return [
        AuditRecord.from_orm_record(record)
        for record in records
    ]


@router.get(
    "/{supplier_id}",
    response_model=SupplierEvaluation,
)
def preview_evaluation(supplier_id: str):
    supplier = get_supplier_by_id(supplier_id)

    if supplier is None:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found.",
        )

    return evaluate_supplier(supplier)


@router.post(
    "/{supplier_id}/run",
    response_model=AuditRecord,
)
def run_evaluation(
    supplier_id: str,
    db: Session = Depends(get_db),
):
    supplier = get_supplier_by_id(supplier_id)

    if supplier is None:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found.",
        )

    evaluation = evaluate_supplier(supplier)
    return AuditRecord.from_orm_record(
        save_evaluation(db, evaluation)
    )


@router.get(
    "/{supplier_id}/history",
    response_model=list[AuditRecord],
)
def supplier_history(
    supplier_id: str,
    db: Session = Depends(get_db),
):
    supplier = get_supplier_by_id(supplier_id)

    if supplier is None:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found.",
        )

    records = get_supplier_history(db, supplier_id)

    return [
        AuditRecord.from_orm_record(record)
        for record in records
    ]
