
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock,
  RefreshCw,
  ShieldAlert,
  FileText,
  Building2,
} from "lucide-react";

import { api, type ExpirationAlert } from "@/services/api";

type AlertFilter = "all" | "expired" | "upcoming";

function formatDate(value: string) {
  if (!value) return "Não informado";

  const date = new Date(`${value.slice(0, 10)}T12:00:00`);

  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function getAlertType(alert: ExpirationAlert) {
  return alert.days_remaining < 0 ? "expired" : "upcoming";
}

export default function MonitoringPage() {
  const [alerts, setAlerts] = useState<ExpirationAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<AlertFilter>("all");
  const [suppliersCount, setSuppliersCount] = useState(0);

  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [data, suppliers] = await Promise.all([
        api.getAlerts(15),
        api.getSuppliers(),
        ]);

setAlerts(data);
setSuppliersCount(suppliers.length);
    } catch (err) {
      console.error("Erro ao carregar alertas:", err);
      setError("Não foi possível carregar os alertas de monitoramento.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  const expiredAlerts = useMemo(
    () => alerts.filter((alert) => alert.days_remaining < 0),
    [alerts]
  );

  const upcomingAlerts = useMemo(
    () => alerts.filter((alert) => alert.days_remaining >= 0),
    [alerts]
  );

  const filteredAlerts = useMemo(() => {
    if (filter === "expired") return expiredAlerts;
    if (filter === "upcoming") return upcomingAlerts;

    return alerts;
  }, [alerts, filter, expiredAlerts, upcomingAlerts]);

  return (
    <div className="monitoring-page">
      <div className="page-heading">
        <div>
          <h1>Monitoramento</h1>
          <p>
            Acompanhe documentos vencidos e vencimentos próximos
            dos fornecedores.
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={loadAlerts}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "spin-icon" : ""}
          />
          Atualizar
        </button>
      </div>

      <div className="simulation-banner">
        <strong>Monitoramento demonstrativo:</strong> os alertas
        utilizam documentos e datas fictícias. A consulta é
        realizada sobre a base simulada do projeto.
      </div>

      {/* Indicadores */}
      <div className="monitoring-metrics">

        <div className="card monitoring-metric">
          <div className="monitoring-icon blue">
            <FileText size={20} />
          </div>
          <span>Total de alertas</span>
          <strong>{alerts.length}</strong>
          <small>Ocorrências identificadas</small>
        </div>

        <div className="card monitoring-metric">
          <div className="monitoring-icon red">
            <AlertTriangle size={20} />
          </div>
          <span>Documentos vencidos</span>
          <strong>{expiredAlerts.length}</strong>
          <small>Exigem regularização</small>
        </div>

        <div className="card monitoring-metric">
          <div className="monitoring-icon orange">
            <CalendarClock size={20} />
          </div>
          <span>Próximos vencimentos</span>
          <strong>{upcomingAlerts.length}</strong>
          <small>Janela de até 15 dias</small>
        </div>

        <div className="card monitoring-metric">
          <div className="monitoring-icon green">
            <CheckCircle2 size={20} />
          </div>
          <span>Fornecedores monitorados</span>
          <strong>{suppliersCount}</strong>
          <small>Base demonstrativa</small>
        </div>

      </div>

      {/* Alertas */}
      <section className="card monitoring-alerts">

        <div className="monitoring-section-header">
          <div>
            <h2>Alertas de documentos</h2>
            <p>
              Acompanhamento dos vencimentos identificados
            </p>
          </div>

          <div className="monitoring-period">
            <Clock size={15} />
            Próximos 15 dias
          </div>
        </div>

        <div className="monitoring-filters">
          <button
            className={filter === "all" ? "filter-active" : ""}
            onClick={() => setFilter("all")}
          >
            Todos ({alerts.length})
          </button>

          <button
            className={filter === "expired" ? "filter-active" : ""}
            onClick={() => setFilter("expired")}
          >
            Vencidos ({expiredAlerts.length})
          </button>

          <button
            className={filter === "upcoming" ? "filter-active" : ""}
            onClick={() => setFilter("upcoming")}
          >
            Próximos ({upcomingAlerts.length})
          </button>
        </div>

        {loading ? (
          <div className="supplier-feedback">
            Carregando alertas...
          </div>
        ) : error ? (
          <div className="supplier-feedback supplier-error">
            <p>{error}</p>

            <button className="btn" onClick={loadAlerts}>
              Tentar novamente
            </button>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="monitoring-empty">
            <CheckCircle2 size={32} />
            <strong>Nenhum alerta encontrado</strong>
            <p>
              Não existem documentos nesta categoria de alerta.
            </p>
          </div>
        ) : (
          <div className="monitoring-alert-list">

            {filteredAlerts.map((alert, index) => {
              const expired = getAlertType(alert) === "expired";

              return (
                <div
                  className={`monitoring-alert-item ${
                    expired ? "alert-expired" : "alert-upcoming"
                  }`}
                  key={`${alert.supplier_id}-${alert.document_type}-${index}`}
                >
                  <div className="monitoring-alert-icon">
                    {expired ? (
                      <ShieldAlert size={21} />
                    ) : (
                      <CalendarClock size={21} />
                    )}
                  </div>

                  <div className="monitoring-alert-content">

                    <div className="monitoring-alert-title">
                      <strong>{alert.document_name}</strong>

                      <span
                        className={`status-badge ${
                          expired
                            ? "status-blocked"
                            : "status-pending"
                        }`}
                      >
                        {expired ? "Vencido" : "Próximo do vencimento"}
                      </span>
                    </div>

                    <div className="monitoring-alert-details">
                      <span>
                        <Building2 size={14} />
                        {alert.supplier_name}
                      </span>

                      <span>
                        <CalendarClock size={14} />
                        Validade: {formatDate(alert.expiration_date)}
                      </span>
                    </div>

                    <p>{alert.message}</p>

                    <small>
                      {expired
                        ? `Vencido há ${Math.abs(alert.days_remaining)} dia(s)`
                        : alert.days_remaining === 0
                        ? "Vence hoje"
                        : `Vence em ${alert.days_remaining} dia(s)`}
                    </small>

                  </div>

                  <Link
                    href={`/suppliers/${alert.supplier_id}`}
                    className="supplier-detail-link"
                  >
                    Ver fornecedor
                  </Link>

                </div>
              );
            })}

          </div>
        )}

      </section>

      <div className="monitoring-footer">
        <AlertTriangle size={17} />
        <p>
          Um documento vencido ou uma consulta indisponível não
          deve ser tratado como aprovação automática. A situação
          precisa ser analisada conforme as regras de homologação.
        </p>
      </div>

    </div>
  );
}
