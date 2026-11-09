
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock3,
  ExternalLink,
  FileSearch,
  Search,
  ShieldCheck,
} from "lucide-react";
import { api } from "@/services/api";

interface AuditRecord {
  id: number;
  supplier_id: string;
  supplier_name: string;
  status: "approved" | "pending_review" | "blocked";
  risk_score: number;
  can_contract: boolean;
  summary: string;
  findings: {
    rule_id: string;
    title: string;
    description: string;
    severity: string;
    evidence: string;
  }[];
  evaluated_at: string;
  simulated: boolean;
}

type AuditFilter = "all" | "approved" | "pending_review" | "blocked";

function formatDate(date: string) {
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusLabel(status: AuditRecord["status"]) {
  const labels = {
    approved: "Aprovado",
    pending_review: "Requer atenção",
    blocked: "Bloqueado",
  };

  return labels[status] ?? status;
}

function getSeverityLabel(severity: string) {
  const labels: Record<string, string> = {
    critical: "Crítica",
    high: "Alta",
    medium: "Média",
    low: "Baixa",
  };

  return labels[severity] ?? severity;
}

export default function AuditPage() {
  const [records, setRecords] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<AuditFilter>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const loadAudit = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = (await api.getAudit()) as unknown as AuditRecord[];
        setRecords(data);
    } catch (err) {
      console.error("Erro ao carregar auditoria:", err);
      setError(
        "Não foi possível carregar o histórico de auditoria. Verifique se o backend está funcionando."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAudit();
  }, [loadAudit]);

  const metrics = useMemo(() => {
    return {
      total: records.length,
      approved: records.filter((record) => record.status === "approved").length,
      pending: records.filter((record) => record.status === "pending_review").length,
      blocked: records.filter((record) => record.status === "blocked").length,
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !normalizedSearch ||
        record.supplier_name.toLowerCase().includes(normalizedSearch) ||
        record.supplier_id.toLowerCase().includes(normalizedSearch) ||
        String(record.id).includes(normalizedSearch);

      const matchesFilter =
        filter === "all" || record.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [records, search, filter]);

  const toggleExpanded = (id: number) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <div className="page-content audit-page">
      <div className="page-heading">
        <div>
          <span className="page-eyebrow">CONTROLE E GOVERNANÇA</span>
          <h1>Auditoria</h1>
          <p>
            Histórico de avaliações, decisões e evidências dos fornecedores.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={loadAudit} disabled={loading}>
          <ClipboardList size={16} />
          Atualizar histórico
        </button>
      </div>

      <div className="simulation-banner">
        <ShieldCheck size={18} />
        <span>
          Ambiente demonstrativo: registros, consultas e evidências apresentados
          nesta tela utilizam dados simulados.
        </span>
      </div>

      <section className="audit-metrics">
        <div className="audit-metric">
          <div className="audit-metric-icon neutral">
            <ClipboardList size={20} />
          </div>
          <div>
            <span>Total de avaliações</span>
            <strong>{metrics.total}</strong>
          </div>
        </div>

        <div className="audit-metric">
          <div className="audit-metric-icon success">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span>Aprovadas</span>
            <strong>{metrics.approved}</strong>
          </div>
        </div>

        <div className="audit-metric">
          <div className="audit-metric-icon warning">
            <Clock3 size={20} />
          </div>
          <div>
            <span>Requerem atenção</span>
            <strong>{metrics.pending}</strong>
          </div>
        </div>

        <div className="audit-metric">
          <div className="audit-metric-icon danger">
            <Ban size={20} />
          </div>
          <div>
            <span>Bloqueadas</span>
            <strong>{metrics.blocked}</strong>
          </div>
        </div>
      </section>

      <section className="card audit-history-card">
        <div className="audit-section-heading">
          <div>
            <h2>Histórico de avaliações</h2>
            <p>Consulte os resultados e as evidências de cada avaliação.</p>
          </div>

          <span className="audit-record-count">
            {filteredRecords.length} registro(s)
          </span>
        </div>

        <div className="audit-toolbar">
          <div className="audit-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Buscar fornecedor ou código..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="audit-filters">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              Todas
            </button>
            <button
              className={filter === "approved" ? "active" : ""}
              onClick={() => setFilter("approved")}
            >
              Aprovadas
            </button>
            <button
              className={filter === "pending_review" ? "active" : ""}
              onClick={() => setFilter("pending_review")}
            >
              Pendentes
            </button>
            <button
              className={filter === "blocked" ? "active" : ""}
              onClick={() => setFilter("blocked")}
            >
              Bloqueadas
            </button>
          </div>
        </div>

        {loading ? (
          <div className="audit-state">
            <div className="loading-spinner" />
            <p>Carregando histórico de auditoria...</p>
          </div>
        ) : error ? (
          <div className="audit-state audit-error">
            <AlertTriangle size={24} />
            <p>{error}</p>
            <button className="btn btn-primary" onClick={loadAudit}>
              Tentar novamente
            </button>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="audit-state">
            <FileSearch size={30} />
            <strong>Nenhum registro encontrado</strong>
            <p>
              Tente alterar a pesquisa ou selecionar outro filtro.
            </p>
          </div>
        ) : (
          <div className="audit-record-list">
            {filteredRecords.map((record) => {
              const expanded = expandedId === record.id;

              return (
                <article className="audit-record" key={record.id}>
                  <div className="audit-record-main">
                    <div className="audit-record-identity">
                      <div className="audit-record-icon">
                        <FileSearch size={19} />
                      </div>

                      <div>
                        <strong>{record.supplier_name}</strong>
                        <span>
                          {record.supplier_id} · Avaliação #{record.id}
                        </span>
                      </div>
                    </div>

                    <div className="audit-record-date">
                      <span>Data da avaliação</span>
                      <strong>{formatDate(record.evaluated_at)}</strong>
                    </div>

                    <div className="audit-record-score">
                      <span>Score de risco</span>
                      <strong>{record.risk_score}/100</strong>
                    </div>

                    <div className="audit-record-status">
                      <span className={`status-badge ${record.status}`}>
                        {getStatusLabel(record.status)}
                      </span>
                      <small>
                        {record.can_contract
                          ? "Pode contratar"
                          : "Não pode contratar"}
                      </small>
                    </div>

                    <button
                      className="audit-expand-button"
                      onClick={() => toggleExpanded(record.id)}
                      aria-label={expanded ? "Recolher detalhes" : "Ver detalhes"}
                    >
                      {expanded ? (
                        <ChevronUp size={19} />
                      ) : (
                        <ChevronDown size={19} />
                      )}
                    </button>
                  </div>

                  <div className="audit-record-summary">
                    {record.summary}
                  </div>

                  {expanded && (
                    <div className="audit-expanded">
                      <div className="audit-expanded-heading">
                        <div>
                          <h3>Detalhes da avaliação</h3>
                          <p>
                            Resultado das regras aplicadas e evidências
                            identificadas pelo motor de avaliação.
                          </p>
                        </div>

                        <Link
                          href={`/suppliers/${record.supplier_id}`}
                          className="audit-detail-link"
                        >
                          Ver fornecedor
                          <ExternalLink size={14} />
                        </Link>
                      </div>

                      <div className="audit-decision">
                        <div>
                          <span>Resultado</span>
                          <strong>{getStatusLabel(record.status)}</strong>
                        </div>
                        <div>
                          <span>Permissão para contratar</span>
                          <strong>
                            {record.can_contract ? "Sim" : "Não"}
                          </strong>
                        </div>
                        <div>
                          <span>Regras identificadas</span>
                          <strong>{record.findings.length}</strong>
                        </div>
                      </div>

                      {record.findings.length > 0 ? (
                        <div className="audit-findings">
                          <h4>Evidências e ocorrências</h4>

                          {record.findings.map((finding, index) => (
                            <div
                              className="audit-finding"
                              key={`${finding.rule_id}-${index}`}
                            >
                              <div className="audit-finding-top">
                                <strong>{finding.title}</strong>
                                <span className={`severity-badge ${finding.severity}`}>
                                  {getSeverityLabel(finding.severity)}
                                </span>
                              </div>

                              <span className="audit-rule-id">
                                Regra: {finding.rule_id}
                              </span>

                              <p>{finding.description}</p>

                              <div className="audit-evidence">
                                <strong>Evidência:</strong> {finding.evidence}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="audit-no-findings">
                          <CheckCircle2 size={18} />
                          Nenhuma ocorrência identificada nesta avaliação.
                        </div>
                      )}

                      <div className="audit-record-footer">
                        <span>
                          <ShieldCheck size={15} />
                          Registro simulado para fins demonstrativos
                        </span>
                        <span>{formatDate(record.evaluated_at)}</span>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <div className="audit-footer-note">
        <ShieldCheck size={17} />
        <p>
          O histórico é preservado a cada nova avaliação. Assim, alterações
          posteriores no cadastro não apagam as decisões anteriores.
        </p>
      </div>
    </div>
  );
}
