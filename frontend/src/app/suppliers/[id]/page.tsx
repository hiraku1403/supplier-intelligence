
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Clock,
  RefreshCw,
  MapPin,
  CalendarDays,
} from "lucide-react";

import {
  api,
  type Supplier,
  type SupplierEvaluation,
  type AuditRecord,
} from "@/services/api";

const statusLabels: Record<string, string> = {
  approved: "Aprovado",
  pending_review: "Em análise",
  blocked: "Bloqueado",
};

const documentLabels: Record<string, string> = {
  valid: "Válido",
  expiring: "Próximo do vencimento",
  expired: "Vencido",
  missing: "Não apresentado",
};

const categoryLabels: Record<string, string> = {
  low: "Baixo risco",
  medium: "Médio risco",
  high: "Alto risco",
};



function formatDate(value: string | null | undefined) {
  if (!value) return "Não informado";

  const date = new Date(`${value.slice(0, 10)}T12:00:00`);

  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function statusClass(status: string) {
  if (status === "approved" || status === "valid") {
    return "status-approved";
  }

  if (status === "blocked" || status === "expired" || status === "missing") {
    return "status-blocked";
  }

  return "status-pending";
}

function SupplierDetailsContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const supplierId = params.id;

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [evaluation, setEvaluation] =
    useState<SupplierEvaluation | null>(null);
  const [history, setHistory] = useState<AuditRecord[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [runningEvaluation, setRunningEvaluation] = useState(false);
  const [evaluationMessage, setEvaluationMessage] = useState("");
  const [evaluationError, setEvaluationError] = useState("");

  async function loadDetails() {
    try {
      setLoading(true);
      setError("");

      const supplierData = await api.getSupplier(supplierId);
      setSupplier(supplierData);

      const [evaluationResult, historyResult] =
        await Promise.allSettled([
          api.getEvaluation(supplierId),
          api.getHistory(supplierId),
        ]);

      if (evaluationResult.status === "fulfilled") {
        setEvaluation(evaluationResult.value);
      } else {
        setEvaluation(null);
      }

      if (historyResult.status === "fulfilled") {
        setHistory(historyResult.value);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error("Erro ao carregar fornecedor:", err);
      setError("Não foi possível localizar este fornecedor.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (supplierId) {
      loadDetails();
    }
  }, [supplierId]);

  if (loading) {
    return (
      <div className="supplier-feedback">
        Carregando informações do fornecedor...
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="card supplier-feedback supplier-error">
        <p>{error || "Fornecedor não encontrado."}</p>
        <button
          className="btn"
          onClick={() => router.push("/suppliers")}
        >
          Voltar para fornecedores
        </button>
      </div>
    );
  }

  async function handleRunEvaluation() {
  try {
    setRunningEvaluation(true);
    setEvaluationMessage("");
    setEvaluationError("");

    // Executa as regras no backend e registra a auditoria
    const result = await api.runEvaluation(supplierId);

    setEvaluation(result);

    // Atualiza os dados do fornecedor e o histórico
    const [supplierData, historyData] = await Promise.all([
      api.getSupplier(supplierId),
      api.getHistory(supplierId),
    ]);

    setSupplier(supplierData);
    setHistory(historyData);

    setEvaluationMessage(
      "Nova avaliação concluída e registrada na auditoria."
    );
  } catch (err) {
    console.error("Erro ao executar homologação:", err);

    setEvaluationError(
      "Não foi possível executar a avaliação. Verifique a conexão com a API."
    );
  } finally {
    setRunningEvaluation(false);
  }
}

  return (
    <div className="supplier-detail-page">
      <div className="detail-back">
        <Link href="/suppliers" className="back-link">
          <ArrowLeft size={16} />
          Voltar para fornecedores
        </Link>
      </div>

      <div className="page-heading detail-heading">
        <div>
          <h1>{supplier.trade_name}</h1>
          <p>{supplier.legal_name}</p>
        </div>

        <span
          className={`status-badge ${
            supplier.homologation_status === "approved"
              ? "status-approved"
              : supplier.homologation_status === "blocked"
              ? "status-blocked"
              : "status-pending"
          }`}
        >
          {statusLabels[supplier.homologation_status]}
        </span>
      </div>

      <div className="detail-metrics">
        <div className="card detail-metric">
          <div className="detail-metric-icon blue">
            <Building2 size={20} />
          </div>
          <span>CNPJ</span>
          <strong>{supplier.cnpj}</strong>
        </div>

        <div className="card detail-metric">
          <div className="detail-metric-icon purple">
            <ShieldCheck size={20} />
          </div>
          <span>Score de risco</span>
          <strong>{supplier.risk_score}/100</strong>
        </div>

        <div className="card detail-metric">
          <div className="detail-metric-icon orange">
            <AlertTriangle size={20} />
          </div>
          <span>Categoria</span>
          <strong>{categoryLabels[supplier.category]}</strong>
        </div>
      </div>

      <div className="detail-grid">
        <section className="card detail-section">
          <div className="section-title">
            <Building2 size={19} />
            <h2>Dados cadastrais</h2>
          </div>

          <div className="detail-info-grid">
            <div>
              <span>Razão social</span>
              <strong>{supplier.legal_name}</strong>
            </div>

            <div>
              <span>Nome fantasia</span>
              <strong>{supplier.trade_name}</strong>
            </div>

            <div>
              <span>CNPJ</span>
              <strong>{supplier.cnpj}</strong>
            </div>

            <div>
              <span>Situação cadastral</span>
              <strong>
                {supplier.registration_status === "active"
                  ? "Ativo"
                  : "Irregular"}
              </strong>
            </div>

            <div>
              <span>Estado</span>
              <strong>{supplier.state || "Não informado"}</strong>
            </div>

            <div>
              <span>Município</span>
              <strong>{supplier.city || "Não informado"}</strong>
            </div>

            <div>
              <span>Última revisão</span>
              <strong>{formatDate(supplier.last_review)}</strong>
            </div>

            <div>
              <span>Identificação dos dados</span>
              <strong>
                {supplier.simulated ? "Simulados" : "Não simulados"}
              </strong>
            </div>
          </div>
        </section>

        <section className="card detail-section">
          <div className="section-title">
            <ShieldCheck size={19} />
            <h2>Risco e conformidade</h2>
          </div>

          <div className="risk-progress">
            <div className="risk-progress-header">
              <span>Nível de risco demonstrativo</span>
              <strong>{supplier.risk_score}/100</strong>
            </div>

            <div className="risk-track">
              <div
                className="risk-fill"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, supplier.risk_score)
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="compliance-list">
            <div>
              <span>Sanções ativas</span>
              <strong className={supplier.active_sanctions ? "text-danger" : "text-success"}>
                {supplier.active_sanctions ? "Identificadas" : "Não identificadas"}
              </strong>
            </div>

            <div>
              <span>Restrição trabalhista</span>
              <strong className={supplier.labor_restriction ? "text-danger" : "text-success"}>
                {supplier.labor_restriction ? "Identificada" : "Não identificada"}
              </strong>
            </div>
          </div>

          {supplier.notes.length > 0 && (
            <div className="detail-notes">
              <strong>Observações</strong>
              {supplier.notes.map((note, index) => (
                <p key={index}>{note}</p>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="card detail-section">
        <div className="section-title">
          <FileText size={19} />
          <div>
            <h2>Documentação</h2>
            <p>Documentos exigidos e situação de validade</p>
          </div>
        </div>

        {supplier.documents.length === 0 ? (
          <div className="supplier-feedback">
            Nenhum documento cadastrado.
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Documento</th>
                  <th>Origem</th>
                  <th>Emissão</th>
                  <th>Validade</th>
                  <th>Situação</th>
                </tr>
              </thead>

              <tbody>
                {supplier.documents.map((document, index) => (
                  <tr key={`${document.document_type}-${index}`}>
                    <td>
                      <strong>{document.name}</strong>
                    </td>
                    <td>{document.issuing_source}</td>
                    <td>{formatDate(document.issue_date)}</td>
                    <td>{formatDate(document.expiration_date)}</td>
                    <td>
                      <span
                        className={`status-badge ${statusClass(
                          document.status
                        )}`}
                      >
                        {documentLabels[document.status] ??
                          document.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card detail-section">
        <div className="section-title">
          <AlertTriangle size={19} />
          <div>
            <h2>Resultado da avaliação</h2>
            <p>Regras e evidências da última análise disponível</p>
          </div>
        </div>

        <div className="evaluation-action">
  <div>
    <strong>Reavaliar fornecedor</strong>
    <p>
      Executa novamente as regras de conformidade e registra
      o resultado no histórico.
    </p>
  </div>

            <button
                className="btn btn-primary"
                onClick={handleRunEvaluation}
                disabled={runningEvaluation}
            >
                <RefreshCw
                size={16}
                className={runningEvaluation ? "spin-icon" : ""}
                />

                {runningEvaluation
                ? "Avaliando..."
                : "Executar nova avaliação"}
            </button>
            </div>

            {evaluationMessage && (
            <div className="evaluation-feedback success">
                {evaluationMessage}
            </div>
            )}

            {evaluationError && (
            <div className="evaluation-feedback error">
                {evaluationError}
            </div>
            )}

        {evaluation ? (
          <>
            <div className="evaluation-summary">
              <div>
                <span>Resultado</span>
                <strong>{evaluation.status}</strong>
              </div>

              <div>
                <span>Pode contratar?</span>
                <strong className={evaluation.can_contract ? "text-success" : "text-danger"}>
                  {evaluation.can_contract ? "Sim" : "Não"}
                </strong>
              </div>

              <div>
                <span>Avaliado em</span>
                <strong>{formatDate(evaluation.evaluated_at)}</strong>
              </div>
            </div>

            <p className="evaluation-description">
              {evaluation.summary}
            </p>

            {evaluation.findings.length > 0 ? (
              <div className="findings-list">
                {evaluation.findings.map((finding, index) => (
                  <div className="finding-item" key={`${finding.rule_id}-${index}`}>
                    <div>
                      <strong>{finding.title}</strong>
                      <span>{finding.description}</span>
                      <small>Evidência: {finding.evidence}</small>
                    </div>

                    <span
                      className={`status-badge ${
                        finding.severity === "critical" ||
                        finding.severity === "high"
                          ? "status-blocked"
                          : "status-pending"
                      }`}
                    >
                      {finding.severity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p>Nenhuma pendência identificada na avaliação.</p>
            )}
          </>
        ) : (
          <div className="supplier-feedback">
            Ainda não há avaliação disponível para este fornecedor.
          </div>
        )}
      </section>

      <section className="card detail-section">
        <div className="section-title">
          <Clock size={19} />
          <div>
            <h2>Histórico de homologação</h2>
            <p>Registro das avaliações realizadas</p>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="supplier-feedback">
            Nenhuma avaliação registrada no histórico.
          </div>
        ) : (
          <div className="history-list">
            {history.map((record) => (
              <div className="history-item" key={record.id}>
                <div className="history-icon">
                  <CalendarDays size={17} />
                </div>

                <div className="history-content">
                  <strong>{record.status}</strong>
                  <span>{record.summary}</span>
                  <small>{formatDate(record.evaluated_at)}</small>
                </div>

                <span
                  className={`status-badge ${
                    record.can_contract
                      ? "status-approved"
                      : "status-pending"
                  }`}
                >
                  {record.can_contract ? "Apto" : "Não apto"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="simulation-banner">
        <strong>Ambiente demonstrativo:</strong> todas as informações
        e evidências apresentadas são simuladas. O score é ilustrativo
        e não representa uma análise oficial de crédito ou conformidade.
      </div>

      <div className="detail-footer">
        <button
          className="btn btn-secondary"
          onClick={loadDetails}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Atualizar informações
        </button>
      </div>
    </div>
  );
}
export default function SupplierDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="supplier-feedback">
          Carregando informações do fornecedor...
        </div>
      }
    >
      <SupplierDetailsContent />
    </Suspense>
  );
}
