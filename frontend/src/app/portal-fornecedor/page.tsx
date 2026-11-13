
"use client";

import { useState } from "react";
import {
  Building2,
  Package,
  FileText,
  AlertTriangle,
  Clock3,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  FileCheck2,
  CalendarDays,
  MapPin,
  Mail,
  Phone,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Truck,
  ShoppingCart,
  ClipboardCheck,
  ShieldCheck,
  Star,
  ArrowUpRight,
  CircleDollarSign,
  BriefcaseBusiness,
} from "lucide-react";

type Tab =
  | "overview"
  | "company"
  | "documents"
  | "quotations"
  | "proposals"
  | "performance";

const tabs: { id: Tab; label: string; icon: typeof Building2 }[] = [
  { id: "overview", label: "Visão geral", icon: Building2 },
  { id: "company", label: "Cadastro e produtos", icon: Package },
  { id: "documents", label: "Documentos", icon: FileText },
  { id: "quotations", label: "Cotações", icon: ShoppingCart },
  { id: "proposals", label: "Propostas", icon: ClipboardCheck },
  { id: "performance", label: "Desempenho", icon: TrendingUp },
];

const products = [
  {
    name: "Chapa de aço carbono",
    code: "PRD-001",
    category: "Matéria-prima",
    unit: "KG",
    price: 8.9,
    status: "Ativo",
  },
  {
    name: "Perfil metálico U",
    code: "PRD-002",
    category: "Estruturas",
    unit: "UN",
    price: 145.0,
    status: "Ativo",
  },
  {
    name: "Barra de aço inox",
    code: "PRD-003",
    category: "Matéria-prima",
    unit: "KG",
    price: 24.5,
    status: "Ativo",
  },
  {
    name: "Tubulação industrial",
    code: "PRD-004",
    category: "Componentes",
    unit: "M",
    price: 68.0,
    status: "Ativo",
  },
];

const documents = [
  {
    name: "Certidão Federal",
    detail: "Receita Federal",
    validity: "20/12/2026",
    status: "Válido",
    color: "green",
  },
  {
    name: "Certidão Negativa Trabalhista",
    detail: "CNDT",
    validity: "01/11/2026",
    status: "Vencido",
    color: "red",
  },
  {
    name: "Certificado FGTS",
    detail: "Caixa Econômica Federal",
    validity: "15/12/2026",
    status: "Válido",
    color: "green",
  },
  {
    name: "Licença de Operação",
    detail: "Órgão ambiental competente",
    validity: "Não cadastrada",
    status: "Pendente",
    color: "amber",
  },
];

const quotations = [
  {
    id: "COT-2026-0142",
    product: "Chapa de aço carbono",
    quantity: "2.500 KG",
    deadline: "18/11/2026",
    status: "Aguardando proposta",
    color: "amber",
  },
  {
    id: "COT-2026-0138",
    product: "Perfil metálico U",
    quantity: "350 UN",
    deadline: "20/11/2026",
    status: "Em análise",
    color: "blue",
  },
  {
    id: "COT-2026-0129",
    product: "Barra de aço inox",
    quantity: "800 KG",
    deadline: "10/11/2026",
    status: "Finalizada",
    color: "green",
  },
];

const proposals = [
  {
    id: "PROP-2026-0081",
    quotation: "COT-2026-0142",
    value: 22250,
    date: "12/11/2026",
    status: "Em elaboração",
    color: "amber",
  },
  {
    id: "PROP-2026-0076",
    quotation: "COT-2026-0138",
    value: 50750,
    date: "08/11/2026",
    status: "Enviada",
    color: "blue",
  },
  {
    id: "PROP-2026-0062",
    quotation: "COT-2026-0129",
    value: 19600,
    date: "04/11/2026",
    status: "Aprovada",
    color: "green",
  },
];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function StatusBadge({
  children,
  color = "gray",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  const styles: Record<string, string> = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    red: "bg-red-50 text-red-700 ring-red-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    gray: "bg-slate-100 text-slate-600 ring-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        styles[color] || styles.gray
      }`}
    >
      {children}
    </span>
  );
}

function SectionTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "blue",
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Building2;
  tone?: string;
}) {
  const tones: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    violet: "bg-violet-50 text-violet-700",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${tones[tone] || tones.blue}`}>
          <Icon size={21} />
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

export default function PortalFornecedorPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <main className="min-h-screen bg-slate-50/70 p-4 md:p-7">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-lg md:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-blue-200">
                <BriefcaseBusiness size={17} />
                ÁREA EXCLUSIVA DO FORNECEDOR
              </div>

              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Portal do Fornecedor
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
                Gerencie seus dados cadastrais, documentos, produtos e
                oportunidades comerciais com a Ferrovale.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-200">
                <Building2 size={25} />
              </div>
              <div>
                <p className="text-xs text-slate-300">Fornecedor conectado</p>
                <p className="font-semibold">Metalúrgica Sol</p>
                <p className="text-xs text-slate-300">SUP-001</p>
              </div>
              <StatusBadge color="green">Ativo</StatusBadge>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-xs text-slate-300">
            <span className="flex items-center gap-2">
              <ShieldCheck size={15} />
              Ambiente demonstrativo
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays size={15} />
              Última atualização: 13/11/2026
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={15} />
              São Paulo - SP
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="flex min-w-max gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-blue-700 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon size={17} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Documentos pendentes"
                value="2"
                detail="1 vencido e 1 não cadastrado"
                icon={AlertTriangle}
                tone="amber"
              />
              <MetricCard
                label="Cotações recebidas"
                value="3"
                detail="Oportunidades comerciais"
                icon={ShoppingCart}
                tone="blue"
              />
              <MetricCard
                label="Produtos cadastrados"
                value="8"
                detail="Itens no catálogo"
                icon={Package}
                tone="violet"
              />
              <MetricCard
                label="Desempenho geral"
                value="92%"
                detail="Indicador demonstrativo"
                icon={TrendingUp}
                tone="green"
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
                <SectionTitle
                  title="Resumo da homologação"
                  description="Acompanhe a situação cadastral da sua empresa."
                  action={
                    <StatusBadge color="amber">Pendente de revisão</StatusBadge>
                  }
                />

                <div className="mb-5 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    Documentação obrigatória
                  </span>
                  <span className="font-bold text-slate-900">2 de 4 válidos</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-1/2 rounded-full bg-amber-500" />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-3">
                    <CheckCircle2 className="text-emerald-600" size={19} />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Certidão Federal
                      </p>
                      <p className="text-xs text-emerald-700">Documento válido</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg bg-red-50 p-3">
                    <AlertTriangle className="text-red-600" size={19} />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        CNDT
                      </p>
                      <p className="text-xs text-red-700">Documento vencido</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-3">
                    <CheckCircle2 className="text-emerald-600" size={19} />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        FGTS
                      </p>
                      <p className="text-xs text-emerald-700">Documento válido</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg bg-amber-50 p-3">
                    <Clock3 className="text-amber-600" size={19} />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Licença de Operação
                      </p>
                      <p className="text-xs text-amber-700">
                        Aguardando cadastro
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("documents")}
                  className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
                >
                  Consultar documentação
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <SectionTitle
                  title="Dados da empresa"
                  description="Informações do cadastro."
                />

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500">Razão social</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      Metalúrgica Sol Indústria Ltda.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">CNPJ</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      12.345.678/0001-90
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Categoria</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      Alto risco · Manutenção industrial
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Contato comercial</p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-800">
                      <Mail size={14} className="text-slate-400" />
                      comercial@metalurgicasol.com.br
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("company")}
                  className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
                >
                  Ver cadastro completo
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <SectionTitle
                  title="Cotações recentes"
                  description="Oportunidades comerciais recebidas."
                  action={
                    <button
                      onClick={() => setActiveTab("quotations")}
                      className="text-sm font-semibold text-blue-700"
                    >
                      Ver todas
                    </button>
                  }
                />

                <div className="space-y-4">
                  {quotations.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {item.product}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.id} · {item.quantity}
                        </p>
                      </div>
                      <StatusBadge color={item.color}>{item.status}</StatusBadge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <SectionTitle
                  title="Desempenho"
                  description="Indicadores de relacionamento comercial."
                  action={
                    <button
                      onClick={() => setActiveTab("performance")}
                      className="text-sm font-semibold text-blue-700"
                    >
                      Detalhes
                    </button>
                  }
                />

                <div className="space-y-5">
                  {[
                    { label: "Pontualidade nas entregas", value: 96 },
                    { label: "Qualidade dos produtos", value: 94 },
                    { label: "Atendimento comercial", value: 86 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-slate-600">{item.label}</span>
                        <span className="font-bold text-slate-800">
                          {item.value}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Company and products */}
        {activeTab === "company" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionTitle
                title="Cadastro do fornecedor"
                description="Dados cadastrais e informações comerciais da empresa."
                action={<StatusBadge color="green">Cadastro ativo</StatusBadge>}
              />

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {[
                  ["Razão social", "Metalúrgica Sol Indústria Ltda."],
                  ["Nome fantasia", "Metalúrgica Sol"],
                  ["CNPJ", "12.345.678/0001-90"],
                  ["Categoria", "Alto risco"],
                  ["Segmento", "Manutenção industrial"],
                  ["Inscrição estadual", "123.456.789.112"],
                  ["E-mail comercial", "comercial@metalurgicasol.com.br"],
                  ["Telefone", "(11) 3456-7890"],
                  ["Responsável", "Carlos Mendes"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                  >
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionTitle
                title="Catálogo de produtos"
                description="Produtos e serviços disponibilizados para a Ferrovale."
                action={
                  <StatusBadge color="blue">8 produtos cadastrados</StatusBadge>
                }
              />

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="relative w-full max-w-sm">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    placeholder="Pesquisar produto..."
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <span className="text-xs text-slate-500">
                  Valores de referência fictícios
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                      <th className="px-3 py-3 font-semibold">Produto</th>
                      <th className="px-3 py-3 font-semibold">Código</th>
                      <th className="px-3 py-3 font-semibold">Categoria</th>
                      <th className="px-3 py-3 font-semibold">Unidade</th>
                      <th className="px-3 py-3 font-semibold">Preço referência</th>
                      <th className="px-3 py-3 font-semibold">Situação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.code}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="px-3 py-4 font-semibold text-slate-800">
                          {product.name}
                        </td>
                        <td className="px-3 py-4 text-slate-500">
                          {product.code}
                        </td>
                        <td className="px-3 py-4 text-slate-600">
                          {product.category}
                        </td>
                        <td className="px-3 py-4 text-slate-600">
                          {product.unit}
                        </td>
                        <td className="px-3 py-4 font-medium text-slate-800">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-3 py-4">
                          <StatusBadge color="green">{product.status}</StatusBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Documents */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricCard
                label="Documentos válidos"
                value="2"
                detail="Documentação regular"
                icon={FileCheck2}
                tone="green"
              />
              <MetricCard
                label="Documentos vencidos"
                value="1"
                detail="Necessita atualização"
                icon={AlertTriangle}
                tone="red"
              />
              <MetricCard
                label="Documentos ausentes"
                value="1"
                detail="Necessita cadastro"
                icon={Clock3}
                tone="amber"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionTitle
                title="Documentação do fornecedor"
                description="Acompanhe os documentos exigidos para sua categoria de fornecimento."
                action={<StatusBadge color="amber">2 pendências</StatusBadge>}
              />

              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.name}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-slate-100 p-3 text-slate-600">
                        <FileText size={21} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {doc.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {doc.detail}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                          Validade: {doc.validity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge color={doc.color}>{doc.status}</StatusBadge>
                      {doc.status === "Válido" ? (
                        <button
                          className="rounded-lg border border-slate-200 p-2 text-slate-500"
                          title="Visualização demonstrativa"
                        >
                          <Eye size={17} />
                        </button>
                      ) : (
                        <span className="text-xs font-medium text-slate-500">
                          Atualização necessária
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 text-blue-700" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      Sobre a atualização documental
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-blue-800">
                      Mantenha sua documentação atualizada para evitar
                      interrupções no processo de homologação. Esta tela é uma
                      demonstração visual e não realiza upload de arquivos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 text-amber-700" size={21} />
                <div>
                  <h3 className="font-semibold text-amber-900">
                    Documentações que precisam de atenção
                  </h3>
                  <ul className="mt-2 space-y-2 text-sm text-amber-900">
                    <li>• CNDT: documento vencido em 01/11/2026.</li>
                    <li>• Licença de Operação: documento ainda não cadastrado.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quotations */}
        {activeTab === "quotations" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricCard
                label="Cotações recebidas"
                value="3"
                detail="Total de oportunidades"
                icon={ShoppingCart}
                tone="blue"
              />
              <MetricCard
                label="Em andamento"
                value="2"
                detail="Aguardando ação ou análise"
                icon={Clock3}
                tone="amber"
              />
              <MetricCard
                label="Finalizadas"
                value="1"
                detail="Processo concluído"
                icon={CheckCircle2}
                tone="green"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionTitle
                title="Cotações recebidas"
                description="Solicitações de preços enviadas pela equipe de compras da Ferrovale."
              />

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                      <th className="px-3 py-3 font-semibold">Identificação</th>
                      <th className="px-3 py-3 font-semibold">Produto</th>
                      <th className="px-3 py-3 font-semibold">Quantidade</th>
                      <th className="px-3 py-3 font-semibold">Prazo</th>
                      <th className="px-3 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotations.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="px-3 py-4 font-semibold text-blue-700">
                          {item.id}
                        </td>
                        <td className="px-3 py-4 text-slate-800">
                          {item.product}
                        </td>
                        <td className="px-3 py-4 text-slate-600">
                          {item.quantity}
                        </td>
                        <td className="px-3 py-4 text-slate-600">
                          {item.deadline}
                        </td>
                        <td className="px-3 py-4">
                          <StatusBadge color={item.color}>
                            {item.status}
                          </StatusBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex items-start gap-3">
                <ShoppingCart className="mt-0.5 text-blue-700" size={21} />
                <div>
                  <h3 className="font-semibold text-blue-900">
                    Oportunidade de negócio
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-blue-800">
                    A Ferrovale disponibiliza solicitações de cotação para
                    fornecedores homologados. Consulte os itens, quantidades e
                    prazos para preparar suas propostas comerciais.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Proposals */}
        {activeTab === "proposals" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricCard
                label="Propostas registradas"
                value="3"
                detail="Histórico demonstrativo"
                icon={FileText}
                tone="blue"
              />
              <MetricCard
                label="Valor total"
                value="R$ 92,6 mil"
                detail="Soma das propostas"
                icon={CircleDollarSign}
                tone="violet"
              />
              <MetricCard
                label="Aprovadas"
                value="1"
                detail="Proposta aprovada"
                icon={CheckCircle2}
                tone="green"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionTitle
                title="Propostas comerciais"
                description="Acompanhe as propostas vinculadas às cotações recebidas."
              />

              <div className="space-y-3">
                {proposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">
                        {proposal.id}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Cotação vinculada: {proposal.quotation}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Registrada em {proposal.date}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <p className="text-xs text-slate-500">Valor total</p>
                        <p className="font-bold text-slate-900">
                          {formatCurrency(proposal.value)}
                        </p>
                      </div>
                      <StatusBadge color={proposal.color}>
                        {proposal.status}
                      </StatusBadge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionTitle
                title="Exemplo de proposta de venda"
                description="Simulação de uma proposta comercial para a Ferrovale."
                action={<StatusBadge color="gray">Modelo ilustrativo</StatusBadge>}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Produto</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    Chapa de aço carbono
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Quantidade</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    2.500 KG
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Preço unitário</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    R$ 8,90
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Prazo de entrega</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    15 dias úteis
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-blue-50 p-4">
                <div>
                  <p className="text-xs text-blue-700">Valor total da proposta</p>
                  <p className="mt-1 text-2xl font-bold text-blue-900">
                    R$ 22.250,00
                  </p>
                </div>
                <StatusBadge color="blue">Proposta ilustrativa</StatusBadge>
              </div>
            </div>
          </div>
        )}

        {/* Performance */}
        {activeTab === "performance" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Desempenho geral"
                value="92%"
                detail="Indicador consolidado"
                icon={Star}
                tone="green"
              />
              <MetricCard
                label="Pontualidade"
                value="96%"
                detail="Entregas dentro do prazo"
                icon={Truck}
                tone="blue"
              />
              <MetricCard
                label="Qualidade"
                value="94%"
                detail="Avaliação dos produtos"
                icon={ShieldCheck}
                tone="green"
              />
              <MetricCard
                label="Atendimento"
                value="86%"
                detail="Avaliação comercial"
                icon={Building2}
                tone="violet"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <SectionTitle
                  title="Indicadores de desempenho"
                  description="Avaliação operacional do fornecedor."
                />

                <div className="space-y-6">
                  {[
                    { label: "Pontualidade nas entregas", value: 96 },
                    { label: "Qualidade dos produtos", value: 94 },
                    { label: "Atendimento comercial", value: 86 },
                    { label: "Conformidade dos pedidos", value: 92 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="font-medium text-slate-700">
                          {item.label}
                        </span>
                        <span className="font-bold text-slate-900">
                          {item.value}%
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <SectionTitle
                  title="Resumo operacional"
                  description="Dados de desempenho do período demonstrativo."
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
                        <Package size={19} />
                      </div>
                      <span className="text-sm text-slate-700">
                        Pedidos entregues
                      </span>
                    </div>
                    <strong className="text-lg text-slate-900">48</strong>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                        <CheckCircle2 size={19} />
                      </div>
                      <span className="text-sm text-slate-700">
                        Entregas no prazo
                      </span>
                    </div>
                    <strong className="text-lg text-slate-900">46</strong>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
                        <AlertTriangle size={19} />
                      </div>
                      <span className="text-sm text-slate-700">
                        Ocorrências registradas
                      </span>
                    </div>
                    <strong className="text-lg text-slate-900">2</strong>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-violet-100 p-2 text-violet-700">
                        <Star size={19} />
                      </div>
                      <span className="text-sm text-slate-700">
                        Avaliação média
                      </span>
                    </div>
                    <strong className="text-lg text-slate-900">4,6/5</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex items-start gap-3">
                <TrendingUp className="mt-0.5 text-blue-700" size={21} />
                <div>
                  <h3 className="font-semibold text-blue-900">
                    Acompanhe sua evolução
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-blue-800">
                    Os indicadores permitem acompanhar a qualidade do
                    fornecimento e identificar oportunidades de melhoria.
                    Nesta demonstração, os índices são fictícios e não
                    representam uma avaliação real da empresa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col justify-between gap-2 border-t border-slate-200 py-5 text-xs text-slate-400 sm:flex-row sm:items-center">
          <span>Supplier Intelligence · Portal do Fornecedor</span>
          <span>Ferrovale · Ambiente de demonstração</span>
        </div>
      </div>
    </main>
  );
}
