
from app.services.compliance_service import evaluate_supplier
from app.services.monitoring_service import get_expiration_alerts
from app.services.supplier_service import (
    get_supplier_by_id,
    list_suppliers,
)


def normalize_cnpj(cnpj: str) -> str:
    return "".join(character for character in cnpj if character.isdigit())


def find_supplier_by_cnpj(cnpj: str):
    normalized = normalize_cnpj(cnpj)

    for supplier in list_suppliers():
        if normalize_cnpj(supplier.cnpj) == normalized:
            return supplier

    return None


def consultar_fornecedor(cnpj: str):
    supplier = find_supplier_by_cnpj(cnpj)

    if supplier is None:
        return {
            "success": False,
            "error": "SUPPLIER_NOT_FOUND",
            "message": "Fornecedor não encontrado.",
            "simulated": True,
        }

    return {
        "success": True,
        "data": supplier.model_dump(mode="json"),
        "simulated": True,
    }


def status_homologacao(cnpj: str):
    supplier = find_supplier_by_cnpj(cnpj)

    if supplier is None:
        return {
            "success": False,
            "error": "SUPPLIER_NOT_FOUND",
            "message": "Fornecedor não encontrado.",
            "simulated": True,
        }

    evaluation = evaluate_supplier(supplier)

    return {
        "success": True,
        "supplier_id": supplier.id,
        "supplier_name": supplier.trade_name,
        "status": evaluation.status.value,
        "risk_score": evaluation.risk_score,
        "can_contract": evaluation.can_contract,
        "summary": evaluation.summary,
        "simulated": True,
    }


def listar_pendencias(cnpj: str):
    supplier = find_supplier_by_cnpj(cnpj)

    if supplier is None:
        return {
            "success": False,
            "error": "SUPPLIER_NOT_FOUND",
            "message": "Fornecedor não encontrado.",
            "simulated": True,
        }

    evaluation = evaluate_supplier(supplier)

    return {
        "success": True,
        "supplier_id": supplier.id,
        "supplier_name": supplier.trade_name,
        "pending_items": [
            finding.model_dump(mode="json")
            for finding in evaluation.findings
        ],
        "can_contract": evaluation.can_contract,
        "simulated": True,
    }


def listar_vencimentos(dias: int = 15):
    alerts = get_expiration_alerts(days=dias)

    return {
        "success": True,
        "total": len(alerts),
        "items": [
            alert.model_dump(mode="json")
            for alert in alerts
        ],
        "simulated": True,
    }
