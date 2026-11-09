
from app.services.genius_service import normalize_cnpj


# ==========================================
# HEALTH CHECK
# ==========================================

def test_health_check(client):
    response = client.get("/health/")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_root_endpoint(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["application"] == (
        "Supplier Intelligence - Ferrovale"
    )


# ==========================================
# SUPPLIERS
# ==========================================

def test_list_suppliers(client):
    response = client.get("/suppliers/")

    assert response.status_code == 200

    suppliers = response.json()

    assert len(suppliers) == 4
    assert suppliers[0]["id"] == "SUP-001"
    assert suppliers[0]["simulated"] is True


def test_get_supplier_by_id(client):
    response = client.get("/suppliers/SUP-001")

    assert response.status_code == 200
    assert response.json()["trade_name"] == "Metalúrgica Sol"


def test_get_supplier_not_found(client):
    response = client.get("/suppliers/SUP-999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Supplier not found."


# ==========================================
# COMPLIANCE / EVALUATIONS
# ==========================================

def test_supplier_evaluation_pending_review(client):
    response = client.get("/evaluations/SUP-001")

    assert response.status_code == 200

    evaluation = response.json()

    assert evaluation["supplier_id"] == "SUP-001"
    assert evaluation["status"] == "pending_review"
    assert evaluation["can_contract"] is False
    assert evaluation["simulated"] is True

    rule_ids = [
        finding["rule_id"]
        for finding in evaluation["findings"]
    ]

    assert "DOC-001" in rule_ids
    assert "DOC-002" in rule_ids


def test_supplier_evaluation_approved(client):
    response = client.get("/evaluations/SUP-002")

    assert response.status_code == 200

    evaluation = response.json()

    assert evaluation["status"] == "approved"
    assert evaluation["can_contract"] is True
    assert evaluation["findings"] == []


def test_supplier_evaluation_blocked(client):
    response = client.get("/evaluations/SUP-004")

    assert response.status_code == 200

    evaluation = response.json()

    assert evaluation["status"] == "blocked"
    assert evaluation["can_contract"] is False

    rule_ids = [
        finding["rule_id"]
        for finding in evaluation["findings"]
    ]

    assert "REG-001" in rule_ids
    assert "COM-001" in rule_ids


def test_evaluation_supplier_not_found(client):
    response = client.get("/evaluations/SUP-999")

    assert response.status_code == 404


# ==========================================
# DASHBOARD
# ==========================================

def test_dashboard_metrics(client):
    response = client.get("/dashboard/metrics")

    assert response.status_code == 200

    metrics = response.json()

    assert metrics["total_suppliers"] == 4
    assert metrics["approved"] == 1
    assert metrics["pending_review"] == 2
    assert metrics["blocked"] == 1
    assert metrics["simulated"] is True

    assert "expired_documents" in metrics
    assert "upcoming_expirations" in metrics
    assert "categories" in metrics
    assert "recent_alerts" in metrics


# ==========================================
# MONITORING
# ==========================================

def test_expiration_monitoring(client):
    response = client.get("/monitoring/expirations?days=15")

    assert response.status_code == 200

    alerts = response.json()

    assert isinstance(alerts, list)
    assert len(alerts) >= 1

    for alert in alerts:
        assert alert["simulated"] is True
        assert alert["supplier_id"]
        assert alert["document_type"]
        assert alert["days_remaining"] <= 15


def test_monitoring_rejects_invalid_days(client):
    response = client.get("/monitoring/expirations?days=500")

    assert response.status_code == 422


# ==========================================
# GENIUS ASSISTANT
# ==========================================

def test_genius_tools_list(client):
    response = client.get("/genius/tools")

    assert response.status_code == 200

    data = response.json()

    assert data["agent"] == "Genius"
    assert data["simulated"] is True
    assert len(data["tools"]) == 4


def test_genius_supplier_lookup(client):
    response = client.get(
        "/genius/tools/suppliers/12345678000190"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True
    assert data["data"]["id"] == "SUP-001"
    assert data["data"]["trade_name"] == "Metalúrgica Sol"


def test_genius_cnpj_normalization():
    formatted = "12.345.678/0001-90"
    unformatted = "12345678000190"

    assert normalize_cnpj(formatted) == unformatted
    assert normalize_cnpj(unformatted) == unformatted


def test_genius_supplier_not_found(client):
    response = client.get(
        "/genius/tools/suppliers/99999999000199"
    )

    assert response.status_code == 200
    assert response.json()["success"] is False
    assert response.json()["error"] == "SUPPLIER_NOT_FOUND"


def test_genius_homologation_status(client):
    response = client.get(
        "/genius/tools/suppliers/23456789000101/status"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True
    assert data["status"] == "approved"
    assert data["can_contract"] is True


def test_genius_pending_items(client):
    response = client.get(
        "/genius/tools/suppliers/12345678000190/pending"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True
    assert len(data["pending_items"]) > 0
    assert data["can_contract"] is False


def test_genius_expirations(client):
    response = client.get(
        "/genius/tools/expirations?dias=15"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True
    assert data["total"] == len(data["items"])
    assert data["simulated"] is True


# ==========================================
# AUDIT / HISTORY
# ==========================================

def test_run_evaluation_and_save_audit(client):
    response = client.post("/evaluations/SUP-001/run")

    assert response.status_code == 200

    audit = response.json()

    assert audit["id"] > 0
    assert audit["supplier_id"] == "SUP-001"
    assert audit["status"] == "pending_review"
    assert audit["simulated"] is True


def test_evaluation_history(client):
    # Primeiro, registra uma avaliação no banco de teste.
    client.post("/evaluations/SUP-001/run")

    response = client.get("/evaluations/SUP-001/history")

    assert response.status_code == 200

    history = response.json()

    assert len(history) == 1
    assert history[0]["supplier_id"] == "SUP-001"


def test_audit_trail(client):
    # Registra avaliações para testar a trilha de auditoria.
    client.post("/evaluations/SUP-001/run")
    client.post("/evaluations/SUP-002/run")

    response = client.get("/evaluations/audit")

    assert response.status_code == 200

    audits = response.json()

    assert len(audits) == 2
    assert audits[0]["supplier_id"] == "SUP-002"
    assert audits[1]["supplier_id"] == "SUP-001"


def test_run_evaluation_supplier_not_found(client):
    response = client.post("/evaluations/SUP-999/run")

    assert response.status_code == 404
