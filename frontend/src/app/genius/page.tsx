
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  Send,
  Search,
  ShieldCheck,
  Clock3,
  FileText,
  CheckCircle2,
  AlertTriangle,
    Wrench,
  UserRound,
  ExternalLink,
  LoaderCircle,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type ToolInfo = {
  name: string;
  description: string;
  method: string;
  endpoint: string;
};

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
  tool?: string;
  data?: any;
  error?: boolean;
};

const suggestions = [
  {
    label: "Consultar vencimentos",
    question: "Quais documentos estão vencidos ou próximos do vencimento?",
    icon: Clock3,
  },
  {
    label: "Verificar homologação",
    question: "Qual é a situação de homologação do CNPJ 12.345.678/0001-90?",
    icon: ShieldCheck,
  },
  {
    label: "Consultar pendências",
    question: "Quais são as pendências do fornecedor 12.345.678/0001-90?",
    icon: FileText,
  },
  {
    label: "Consultar fornecedor",
    question: "Consulte os dados cadastrais do CNPJ 12.345.678/0001-90",
    icon: Search,
  },
];

async function callTool<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Erro na consulta (${response.status}).`);
  }

  return response.json();
}

function extractCnpj(message: string) {
  const match = message.match(/\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}/);

  if (!match) return null;

  // Remove pontos, barras, hífens e qualquer caractere não numérico.
  return match[0].replace(/\D/g, "");
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function findSupplierByName(message: string) {
  const response = await callTool<any>("/suppliers/");

  // Aceita tanto uma lista direta quanto respostas envelopadas.
  const suppliers = Array.isArray(response)
    ? response
    : response.suppliers || response.items || response.data || [];

  const normalizedMessage = normalizeText(message);

  const matches = suppliers.filter((supplier: any) => {
    const tradeName = normalizeText(supplier.trade_name || "");
    const legalName = normalizeText(supplier.legal_name || "");

    return (
      (tradeName.length >= 3 && normalizedMessage.includes(tradeName)) ||
      (legalName.length >= 3 && normalizedMessage.includes(legalName))
    );
  });

  if (matches.length === 0) {
    return null;
  }

  if (matches.length > 1) {
    throw new Error(
      "Encontrei mais de um fornecedor com esse nome. Informe o nome completo para identificar o cadastro correto."
    );
  }

  return matches[0];
}

function formatDate(value: string) {
  if (!value) return "Não informado";

  return new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR");
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    approved: "Aprovado",
    pending_review: "Requer atenção",
    blocked: "Bloqueado",
    active: "Ativo",
    inactive: "Inativo",
    valid: "Válido",
    expired: "Vencido",
    missing: "Ausente",
  };

  return labels[status] || status;
}

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`genius-status ${status}`}>
      {statusLabel(status)}
    </span>
  );
}

function ResultData({ message }: { message: ChatMessage }) {
  const data = message.data;

  if (!data) return null;

  if (message.tool === "listar_vencimentos") {
    const items = data.items || [];

    return (
      <div className="genius-result">
        <div className="genius-result-summary">
          <strong>{data.total} alerta(s) encontrado(s)</strong>
          <span>Janela de consulta: próximos 15 dias</span>
        </div>

        {items.map((item: any, index: number) => (
          <div className="genius-result-item" key={`${item.supplier_id}-${index}`}>
            <div className="genius-result-item-heading">
              <div>
                <strong>{item.document_name}</strong>
                <span>{item.supplier_name} · {item.supplier_id}</span>
              </div>
              <StatusPill
                status={item.days_remaining < 0 ? "expired" : "pending_review"}
              />
            </div>

            <p>{item.message}</p>

            <div className="genius-result-meta">
              <span>Vencimento: {formatDate(item.expiration_date)}</span>
              <span>
                {item.days_remaining < 0
                  ? `${Math.abs(item.days_remaining)} dia(s) em atraso`
                  : `${item.days_remaining} dia(s) restantes`}
              </span>
            </div>

            <Link
              href={`/suppliers/${item.supplier_id}`}
              className="genius-result-link"
            >
              Ver fornecedor <ExternalLink size={13} />
            </Link>
          </div>
        ))}

        {items.length === 0 && (
          <p className="genius-no-results">Nenhum vencimento encontrado.</p>
        )}
      </div>
    );
  }

  if (message.tool === "consultar_fornecedor") {
    const supplier = data.data;

    if (!supplier) return null;

    return (
      <div className="genius-result">
        <div className="genius-supplier-card">
          <div className="genius-supplier-heading">
            <div className="genius-supplier-avatar">
              <Wrench size={20} />
            </div>
            <div>
              <strong>{supplier.trade_name}</strong>
              <span>{supplier.legal_name}</span>
            </div>
          </div>

          <div className="genius-data-grid">
            <div>
              <span>CNPJ</span>
              <strong>{supplier.cnpj}</strong>
            </div>
            <div>
              <span>Categoria</span>
              <strong>{supplier.category}</strong>
            </div>
            <div>
              <span>Localização</span>
              <strong>{supplier.city} - {supplier.state}</strong>
            </div>
            <div>
              <span>Score de risco</span>
              <strong>{supplier.risk_score}/100</strong>
            </div>
            <div>
              <span>Cadastro</span>
              <strong>{statusLabel(supplier.registration_status)}</strong>
            </div>
            <div>
              <span>Homologação</span>
              <StatusPill status={supplier.homologation_status} />
            </div>
          </div>

          <div className="genius-documents">
            <strong>Documentos cadastrados</strong>

            {supplier.documents.map((doc: any, index: number) => (
              <div className="genius-document-row" key={`${doc.document_type}-${index}`}>
                <span>{doc.name}</span>
                <StatusPill status={doc.status} />
              </div>
            ))}
          </div>

          <Link
            href={`/suppliers/${supplier.id}`}
            className="genius-result-link"
          >
            Abrir cadastro completo <ExternalLink size={13} />
          </Link>
        </div>
      </div>
    );
  }

  if (message.tool === "status_homologacao") {
    return (
      <div className="genius-result">
        <div className="genius-status-card">
          <div>
            <span>Fornecedor</span>
            <strong>{data.supplier_name}</strong>
            <small>{data.supplier_id}</small>
          </div>
          <div>
            <span>Status de homologação</span>
            <StatusPill status={data.status} />
          </div>
          <div>
            <span>Score de risco</span>
            <strong>{data.risk_score}/100</strong>
          </div>
          <div>
            <span>Pode contratar?</span>
            <strong>{data.can_contract ? "Sim" : "Não"}</strong>
          </div>
        </div>

        <p className="genius-result-summary-text">{data.summary}</p>

        <Link
          href={`/suppliers/${data.supplier_id}`}
          className="genius-result-link"
        >
          Ver detalhes do fornecedor <ExternalLink size={13} />
        </Link>
      </div>
    );
  }

  if (message.tool === "listar_pendencias") {
    const items = data.pending_items || [];

    return (
      <div className="genius-result">
        <div className="genius-result-summary">
          <strong>{data.supplier_name}</strong>
          <span>{items.length} pendência(s) identificada(s)</span>
        </div>

        {items.map((item: any, index: number) => (
          <div className="genius-pending-item" key={`${item.rule_id}-${index}`}>
            <div className="genius-result-item-heading">
              <strong>{item.title}</strong>
              <span className={`severity-badge ${item.severity}`}>
                {item.severity === "high" ? "Alta" : item.severity}
              </span>
            </div>
            <span className="genius-rule">Regra {item.rule_id}</span>
            <p>{item.description}</p>
            <div className="genius-evidence">
              <strong>Evidência:</strong> {item.evidence}
            </div>
          </div>
        ))}

        <div className="genius-contract-warning">
          {data.can_contract ? (
            <CheckCircle2 size={17} />
          ) : (
            <AlertTriangle size={17} />
          )}
          {data.can_contract
            ? "Fornecedor liberado para contratação."
            : "Fornecedor não está liberado para contratação."}
        </div>

        <Link
          href={`/suppliers/${data.supplier_id}`}
          className="genius-result-link"
        >
          Ver fornecedor <ExternalLink size={13} />
        </Link>
      </div>
    );
  }

  return null;
}

export default function GeniusPage() {
  const [tools, setTools] = useState<ToolInfo[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      text:
        "Olá! Sou o Genius, assistente demonstrativo do Supplier Intelligence. Posso consultar fornecedores, verificar homologações, identificar pendências e acompanhar vencimentos. Como posso ajudar?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toolsLoading, setToolsLoading] = useState(true);
  

  useEffect(() => {
    async function loadTools() {
      try {
        const response = await callTool<any>("/genius/tools");
        setTools(response.tools || []);
      } catch (err) {
        console.error("Erro ao carregar ferramentas:", err);
      } finally {
        setToolsLoading(false);
      }
    }

    loadTools();
  }, []);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((current) => [...current, message]);
  }, []);

  async function handleSend(question?: string) {
    const text = (question ?? input).trim();

    if (!text || loading) return;

    setInput("");
   

    addMessage({
      id: Date.now(),
      role: "user",
      text,
    });

    setLoading(true);

   const normalized = normalizeText(text);

        let cnpj = extractCnpj(text);

        let supplierName = "";

        if (!cnpj) {
        const supplier = await findSupplierByName(text);

        if (supplier) {
            cnpj = String(supplier.cnpj).replace(/\D/g, "");
            supplierName = supplier.trade_name || supplier.legal_name;
        }
    }

    try {
      let tool = "";
      let endpoint = "";
      let responseText = "";

      if (
        normalized.includes("vencimento") ||
        normalized.includes("vencido") ||
        normalized.includes("vencem") ||
        normalized.includes("expira") ||
        normalized.includes("expiração")
      ) {
        tool = "listar_vencimentos";
        endpoint = "/genius/tools/expirations?dias=15";
        responseText =
          "Consultei a ferramenta de vencimentos. Encontrei os seguintes documentos vencidos ou próximos do vencimento:";
      } else if (
            normalized.includes("pendencia") ||
            normalized.includes("pendencias") ||
            normalized.includes("o que falta") ||
            normalized.includes("falta na homologacao") ||
            normalized.includes("posso contratar") ||
            normalized.includes("pode contratar")
      ) {
        if (!cnpj) {
            throw new Error(
                "Não consegui identificar o fornecedor pelo nome. Informe o nome completo ou o CNPJ para continuar."
            );
        }

        tool = "listar_pendencias";
        endpoint = `/genius/tools/suppliers/${encodeURIComponent(cnpj)}/pending`;
        responseText = supplierName
            ? `Encontrei ${supplierName} pelo nome e consultei sua homologação. Veja o que identifiquei:`
            : "Consultei as pendências e evidências registradas para este fornecedor:";
      } else if (
        normalized.includes("homologação") ||
        normalized.includes("homologacao") ||
        normalized.includes("status") ||
        normalized.includes("pode contratar") ||
        normalized.includes("situação")
      ) {
        if (!cnpj) {
          throw new Error(
            "Para consultar a homologação, informe o CNPJ do fornecedor."
          );
        }

        tool = "status_homologacao";
        endpoint = `/genius/tools/suppliers/${encodeURIComponent(cnpj)}/status`;
        responseText =
          "Consultei a situação atual da homologação deste fornecedor:";
      } else if (
        normalized.includes("fornecedor") ||
        normalized.includes("cadastro") ||
        normalized.includes("documentos") ||
        cnpj
      ) {
        if (!cnpj) {
          throw new Error(
            "Informe o CNPJ do fornecedor para consultar seus dados cadastrais."
          );
        }

        tool = "consultar_fornecedor";
        endpoint = `/genius/tools/suppliers/${encodeURIComponent(cnpj)}`;
        responseText =
          "Consultei os dados cadastrais e os documentos deste fornecedor:";
      } else {
        throw new Error(
          "Ainda não reconheço essa consulta. Experimente perguntar sobre vencimentos, homologação, pendências ou dados cadastrais de um fornecedor."
        );
      }

      const data = await callTool<any>(endpoint);

      if (data.success === false) {
        throw new Error("A ferramenta não conseguiu concluir a consulta.");
      }

      addMessage({
        id: Date.now() + 1,
        role: "assistant",
        text: responseText,
        tool,
        data,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao consultar ferramenta.";

      addMessage({
        id: Date.now() + 1,
        role: "assistant",
        text: message,
        error: true,
      });

     
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-content genius-page">
      <div className="page-heading">
        <div>
          <span className="page-eyebrow">INTELIGÊNCIA ARTIFICIAL</span>
          <h1>Genius Assistant</h1>
          <p>
            Assistente de compras e compliance com acesso a ferramentas
            operacionais.
          </p>
        </div>
        <span className="genius-online">
          <span />
          Ambiente demonstrativo
        </span>
      </div>

      <div className="simulation-banner">
        <Sparkles size={18} />
        <span>
          Demonstração de tool calling: o assistente seleciona ferramentas
          REST simuladas e apresenta os dados retornados pelo backend.
        </span>
      </div>

      <div className="genius-layout">
        <section className="card genius-chat-card">
          <div className="genius-chat-header">
            <div className="genius-avatar">
              <Bot size={23} />
            </div>
            <div>
              <strong>Genius</strong>
              <span>Assistente de Supplier Intelligence</span>
            </div>
            <span className="genius-header-status">Online</span>
          </div>

          <div className="genius-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`genius-message ${message.role}`}
              >
                <div className="genius-message-avatar">
                  {message.role === "assistant" ? (
                    <Bot size={16} />
                  ) : (
                    <UserRound size={16} />
                  )}
                </div>

                <div className="genius-message-content">
                  <div className={`genius-message-bubble ${message.error ? "error" : ""}`}>
                    {message.text}
                  </div>

                  {message.tool && (
                    <div className="genius-tool-used">
                      <Wrench size={13} />
                      Ferramenta executada: <strong>{message.tool}</strong>
                    </div>
                  )}

                  <ResultData message={message} />
                </div>
              </div>
            ))}

            {loading && (
              <div className="genius-message assistant">
                <div className="genius-message-avatar">
                  <Bot size={16} />
                </div>
                <div className="genius-thinking">
                  <LoaderCircle size={16} className="genius-spinner" />
                  Consultando ferramenta...
                </div>
              </div>
            )}
          </div>

          <div className="genius-suggestions">
            <span>Perguntas sugeridas</span>
            <div>
              {suggestions.map((suggestion) => {
                const Icon = suggestion.icon;

                return (
                  <button
                    key={suggestion.label}
                    onClick={() => handleSend(suggestion.question)}
                    disabled={loading}
                  >
                    <Icon size={14} />
                    {suggestion.label}
                  </button>
                );
              })}
            </div>
          </div>

          <form
            className="genius-input-area"
            onSubmit={(event) => {
              event.preventDefault();
              handleSend();
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Pergunte sobre fornecedores, homologação ou vencimentos..."
              disabled={loading}
            />
            <button type="submit" disabled={!input.trim() || loading}>
              <Send size={17} />
            </button>
          </form>

          <div className="genius-disclaimer">
            As respostas refletem exclusivamente os dados simulados disponíveis
            no protótipo.
          </div>
        </section>

        <aside className="genius-tools-panel">
          <section className="card genius-tools-card">
            <div className="genius-panel-heading">
              <div>
                <h2>Ferramentas disponíveis</h2>
                <p>Recursos que o assistente pode executar.</p>
              </div>
              <Wrench size={18} />
            </div>

            {toolsLoading ? (
              <p className="genius-tools-loading">Carregando ferramentas...</p>
            ) : tools.length > 0 ? (
              <div className="genius-tool-list">
                {tools.map((tool) => (
                  <div className="genius-tool-card" key={tool.name}>
                    <div className="genius-tool-icon">
                      <Wrench size={16} />
                    </div>
                    <div>
                      <strong>{tool.name}</strong>
                      <p>{tool.description}</p>
                      <span>{tool.method} · {tool.endpoint}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="genius-tools-loading">
                Não foi possível carregar a lista de ferramentas.
              </p>
            )}
          </section>

          <section className="card genius-capabilities-card">
            <h2>O que posso fazer?</h2>

            <div>
              <Search size={17} />
              <span>Consultar dados cadastrais</span>
            </div>
            <div>
              <ShieldCheck size={17} />
              <span>Verificar homologação</span>
            </div>
            <div>
              <AlertTriangle size={17} />
              <span>Identificar pendências</span>
            </div>
            <div>
              <Clock3 size={17} />
              <span>Monitorar vencimentos</span>
            </div>
          </section>

          <section className="genius-architecture-note">
            <ShieldCheck size={18} />
            <div>
              <strong>Arquitetura demonstrativa</strong>
              <p>
                As ferramentas são expostas por endpoints REST. A seleção
                da ferramenta nesta versão é baseada em regras de intenção,
                sem integração real com o Genius.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
