
from datetime import date, datetime, timezone

from app.rules.requirements import (
    EXPIRATION_WARNING_DAYS,
    REQUIRED_DOCUMENTS,
)
from app.schemas.evaluation import (
    RuleFinding,
    SupplierEvaluation,
)
from app.schemas.supplier import (
    DocumentStatus,
    HomologationStatus,
    Supplier,
)


def _get_effective_document_status(document) -> DocumentStatus:
    """
    Calcula a situação do documento considerando sua validade.
    Se não houver data de vencimento, utiliza o status informado.
    """
    if document.status == DocumentStatus.MISSING:
        return DocumentStatus.MISSING

    if document.expiration_date:
        today = date.today()
        days_until_expiration = (
            document.expiration_date - today
        ).days

        if days_until_expiration < 0:
            return DocumentStatus.EXPIRED

        if days_until_expiration <= EXPIRATION_WARNING_DAYS:
            return DocumentStatus.EXPIRING

        return DocumentStatus.VALID

    return document.status


def evaluate_supplier(supplier: Supplier) -> SupplierEvaluation:
    findings: list[RuleFinding] = []
    blocking_issues = False

    # REGRA 001: situação cadastral
    if supplier.registration_status.lower() != "active":
        blocking_issues = True

        findings.append(
            RuleFinding(
                rule_id="REG-001",
                title="Situação cadastral irregular",
                description=(
                    "O fornecedor não possui situação cadastral ativa."
                ),
                severity="critical",
                evidence=(
                    f"Situação cadastral: "
                    f"{supplier.registration_status}"
                ),
            )
        )

    # REGRA 002: sanções confirmadas
    if supplier.active_sanctions:
        blocking_issues = True

        findings.append(
            RuleFinding(
                rule_id="COM-001",
                title="Sanção impeditiva identificada",
                description=(
                    "Foi identificada uma sanção ativa na "
                    "base simulada de compliance."
                ),
                severity="critical",
                evidence="Registro de sanção ativa - dado simulado.",
            )
        )

    # REGRA 003: restrição trabalhista
    if supplier.labor_restriction:
        blocking_issues = True

        findings.append(
            RuleFinding(
                rule_id="COM-002",
                title="Restrição trabalhista identificada",
                description=(
                    "Foi identificada uma restrição trabalhista "
                    "na base simulada."
                ),
                severity="critical",
                evidence=(
                    "Registro de restrição trabalhista - dado simulado."
                ),
            )
        )

    # REGRA 004: documentos obrigatórios por categoria
    required_documents = REQUIRED_DOCUMENTS[supplier.category]

    documents_by_type = {
        document.document_type: document
        for document in supplier.documents
    }

    for document_type in sorted(required_documents):
        document = documents_by_type.get(document_type)

        if document is None:
            findings.append(
                RuleFinding(
                    rule_id="DOC-001",
                    title="Documento obrigatório ausente",
                    description=(
                        f"O documento {document_type} não foi anexado."
                    ),
                    severity="high",
                    evidence=(
                        f"Documento exigido para a categoria "
                        f"{supplier.category.value}."
                    ),
                )
            )
            continue

        effective_status = _get_effective_document_status(document)

        if effective_status == DocumentStatus.MISSING:
            findings.append(
                RuleFinding(
                    rule_id="DOC-001",
                    title="Documento obrigatório ausente",
                    description=f"{document.name} não foi apresentado.",
                    severity="high",
                    evidence=f"Fonte esperada: {document.issuing_source}.",
                )
            )

        elif effective_status == DocumentStatus.EXPIRED:
            findings.append(
                RuleFinding(
                    rule_id="DOC-002",
                    title="Documento vencido",
                    description=f"{document.name} está vencido.",
                    severity="high",
                    evidence=(
                        f"Validade registrada: "
                        f"{document.expiration_date or 'não informada'}."
                    ),
                )
            )

        elif effective_status == DocumentStatus.EXPIRING:
            findings.append(
                RuleFinding(
                    rule_id="DOC-003",
                    title="Documento próximo do vencimento",
                    description=(
                        f"{document.name} vence em até "
                        f"{EXPIRATION_WARNING_DAYS} dias."
                    ),
                    severity="medium",
                    evidence=(
                        f"Data de vencimento: "
                        f"{document.expiration_date}."
                    ),
                )
            )

    # REGRA 005: resultado consolidado
    if blocking_issues:
        final_status = HomologationStatus.BLOCKED
        summary = (
            "Fornecedor bloqueado por uma condição impeditiva "
            "identificada nas verificações."
        )

    elif findings:
        final_status = HomologationStatus.PENDING_REVIEW
        summary = (
            "Fornecedor com pendências documentais ou de "
            "verificação. É necessária regularização ou revisão."
        )

    else:
        final_status = HomologationStatus.APPROVED
        summary = (
            "Fornecedor aprovado nas verificações simuladas "
            "para sua categoria."
        )

    return SupplierEvaluation(
        supplier_id=supplier.id,
        supplier_name=supplier.trade_name,
        status=final_status,
        risk_score=supplier.risk_score,
        can_contract=final_status == HomologationStatus.APPROVED,
        summary=summary,
        findings=findings,
        evaluated_at=datetime.now(timezone.utc).isoformat(),
        simulated=True,
    )
