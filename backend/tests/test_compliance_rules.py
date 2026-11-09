
from datetime import date, timedelta

from app.services.compliance_service import evaluate_supplier
from app.services.supplier_service import get_supplier_by_id
from app.schemas.supplier import DocumentStatus, HomologationStatus


def test_labor_restriction_blocks_supplier():
    supplier = get_supplier_by_id("SUP-002").model_copy(
        update={"labor_restriction": True}
    )

    result = evaluate_supplier(supplier)

    assert result.status == HomologationStatus.BLOCKED
    assert result.can_contract is False
    assert any(
        finding.rule_id == "COM-002"
        for finding in result.findings
    )


def test_active_sanction_blocks_supplier():
    supplier = get_supplier_by_id("SUP-002").model_copy(
        update={"active_sanctions": True}
    )

    result = evaluate_supplier(supplier)

    assert result.status == HomologationStatus.BLOCKED
    assert result.can_contract is False
    assert any(
        finding.rule_id == "COM-001"
        for finding in result.findings
    )


def test_expired_document_requires_review():
    supplier = get_supplier_by_id("SUP-002").model_copy(
        deep=True
    )

    supplier.documents[0].expiration_date = (
        date.today() - timedelta(days=1)
    )

    result = evaluate_supplier(supplier)

    assert result.status == HomologationStatus.PENDING_REVIEW
    assert result.can_contract is False
    assert any(
        finding.rule_id == "DOC-002"
        for finding in result.findings
    )


def test_missing_document_requires_review():
    supplier = get_supplier_by_id("SUP-002").model_copy(
        deep=True
    )

    supplier.documents[0].status = DocumentStatus.MISSING
    supplier.documents[0].expiration_date = None

    result = evaluate_supplier(supplier)

    assert result.status == HomologationStatus.PENDING_REVIEW
    assert any(
        finding.rule_id == "DOC-001"
        for finding in result.findings
    )


def test_document_expiring_within_15_days_requires_review():
    supplier = get_supplier_by_id("SUP-002").model_copy(
        deep=True
    )

    supplier.documents[0].expiration_date = (
        date.today() + timedelta(days=15)
    )

    result = evaluate_supplier(supplier)

    assert result.status == HomologationStatus.PENDING_REVIEW
    assert any(
        finding.rule_id == "DOC-003"
        for finding in result.findings
    )


def test_high_risk_score_alone_does_not_block_supplier():
    supplier = get_supplier_by_id("SUP-002").model_copy(
        update={"risk_score": 99}
    )

    result = evaluate_supplier(supplier)

    assert result.status == HomologationStatus.APPROVED
    assert result.can_contract is True
    assert result.findings == []
