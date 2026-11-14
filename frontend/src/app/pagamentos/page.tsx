
"use client";

import { useMemo, useState } from "react";

import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Search,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Clock3,
  CheckCircle2,
  FileText,
  CreditCard,
  Building2,
  Receipt,
  Download,
  Filter,
  ChevronRight,
  CircleDollarSign,
  Banknote,
  Plus,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type PaymentStatus =
  | "Pago"
  | "Pendente"
  | "Vencido"
  | "Em aprovação";

type Payment = {
  id: string;
  supplier: string;
  document: string;
  invoice: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  method: string;
  status: PaymentStatus;
};

const payments: Payment[] = [
  {
    id: "PAY-2026-0148",
    supplier: "Metalúrgica Sol Indústria Ltda.",
    document: "12.345.678/0001-90",
    invoice: "NF-008421",
    amount: 18450,
    issueDate: "05/11/2026",
    dueDate: "15/11/2026",
    method: "PIX",
    status: "Pendente",
  },
  {
    id: "PAY-2026-0147",
    supplier: "TechOffice",
    document: "23.456.789/0001-01",
    invoice: "NF-003192",
    amount: 4280,
    issueDate: "03/11/2026",
    dueDate: "18/11/2026",
    method: "Transferência",
    status: "Em aprovação",
  },
  {
    id: "PAY-2026-0146",
    supplier: "Transportes Brasil",
    document: "34.567.890/0001-12",
    invoice: "NF-001874",
    amount: 12750,
    issueDate: "28/10/2026",
    dueDate: "10/11/2026",
    method: "Boleto",
    status: "Vencido",
  },
  {
    id: "PAY-2026-0145",
    supplier: "Alfa Serviços",
    document: "45.678.901/0001-23",
    invoice: "NF-006510",
    amount: 8950,
    issueDate: "25/10/2026",
    dueDate: "08/11/2026",
    method: "Transferência",
    status: "Pago",
  },
  {
    id: "PAY-2026-0144",
    supplier: "TechOffice",
    document: "23.456.789/0001-01",
    invoice: "NF-003181",
    amount: 3200,
    issueDate: "20/10/2026",
    dueDate: "05/11/2026",
    method: "PIX",
    status: "Pago",
  },
  {
    id: "PAY-2026-0143",
    supplier: "Metalúrgica Sol Indústria Ltda.",
    document: "12.345.678/0001-90",
    invoice: "NF-008390",
    amount: 22100,
    issueDate: "15/10/2026",
    dueDate: "30/10/2026",
    method: "Boleto",
    status: "Pago",
  },
  {
    id: "PAY-2026-0142",
    supplier: "Transportes Brasil",
    document: "34.567.890/0001-12",
    invoice: "NF-001820",
    amount: 6800,
    issueDate: "12/10/2026",
    dueDate: "25/10/2026",
    method: "PIX",
    status: "Pago",
  },
];

const monthlyData = [
  { month: "Jun", paid: 42000, pending: 18000 },
  { month: "Jul", paid: 51000, pending: 22000 },
  { month: "Ago", paid: 47000, pending: 15000 },
  { month: "Set", paid: 63000, pending: 25000 },
  { month: "Out", paid: 58000, pending: 21000 },
  { month: "Nov", paid: 48600, pending: 35430 },
];

const recentTransactions = [
  {
    id: "TRX-00821",
    supplier: "Alfa Serviços",
    description: "Pagamento NF-006510",
    date: "08/11/2026",
    amount: 8950,
    method: "Transferência",
  },
  {
    id: "TRX-00820",
    supplier: "TechOffice",
    description: "Pagamento NF-003181",
    date: "05/11/2026",
    amount: 3200,
    method: "PIX",
  },
  {
    id: "TRX-00819",
    supplier: "Metalúrgica Sol",
    description: "Pagamento NF-008390",
    date: "30/10/2026",
    amount: 22100,
    method: "Boleto",
  },
];

const upcomingPayments = [
  {
    supplier: "Metalúrgica Sol",
    invoice: "NF-008421",
    date: "15/11/2026",
    amount: 18450,
    urgency: "Amanhã",
  },
  {
    supplier: "TechOffice",
    invoice: "NF-003192",
    date: "18/11/2026",
    amount: 4280,
    urgency: "Em 4 dias",
  },
  {
    supplier: "Transportes Brasil",
    invoice: "NF-001901",
    date: "20/11/2026",
    amount: 9700,
    urgency: "Em 6 dias",
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const statusStyles: Record<PaymentStatus, string> = {
  Pago: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pendente: "bg-amber-50 text-amber-700 border-amber-200",
  Vencido: "bg-red-50 text-red-700 border-red-200",
  "Em aprovação": "bg-blue-50 text-blue-700 border-blue-200",
};

function StatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
  iconBackground,
  trend,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  iconBackground: string;
  trend?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>

        <div className={`rounded-lg p-3 ${iconBackground}`}>
          <Icon size={21} className={iconColor} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        {trend && (
          <span className="flex items-center gap-1 font-semibold text-emerald-600">
            <TrendingUp size={13} />
            {trend}
          </span>
        )}
        <span>{description}</span>
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("Visão geral");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const tabs = [
    "Visão geral",
    "Contas a pagar",
    "Métodos de pagamento",
    "Histórico",
  ];

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchMatch =
        payment.supplier.toLowerCase().includes(search.toLowerCase()) ||
        payment.document.includes(search) ||
        payment.invoice.toLowerCase().includes(search.toLowerCase()) ||
        payment.id.toLowerCase().includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "Todos" || payment.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [search, statusFilter]);

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <Wallet size={16} />
            <span>Gestão</span>
            <ChevronRight size={14} />
            <span>Financeiro</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Gestão de Pagamentos
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Controle financeiro, contas a pagar e histórico de pagamentos
            de fornecedores.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600">
            <CalendarDays size={16} />
            Novembro de 2026
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <Download size={16} />
            Exportar
          </button>

          <button
            type="button"
            onClick={() =>
              alert("Funcionalidade demonstrativa: novo lançamento.")
            }
            className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800"
          >
            <Plus size={17} />
            Novo lançamento
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto border-b border-slate-200">
        <div className="flex min-w-max gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-1 pb-3 text-sm font-medium transition ${
                activeTab === tab
                  ? "border-blue-700 text-blue-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview */}
      {activeTab === "Visão geral" && (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Total pago no mês"
              value="R$ 48.600"
              description="vs. mês anterior"
              trend="+12,4%"
              icon={CheckCircle2}
              iconColor="text-emerald-700"
              iconBackground="bg-emerald-50"
            />

            <MetricCard
              title="Contas a pagar"
              value="R$ 35.430"
              description="3 lançamentos em aberto"
              icon={Clock3}
              iconColor="text-amber-700"
              iconBackground="bg-amber-50"
            />

            <MetricCard
              title="Pagamentos vencidos"
              value="R$ 12.750"
              description="1 conta exige atenção"
              icon={AlertTriangle}
              iconColor="text-red-700"
              iconBackground="bg-red-50"
            />

            <MetricCard
              title="Fornecedores pagos"
              value="8"
              description="Neste mês"
              icon={Users}
              iconColor="text-blue-700"
              iconBackground="bg-blue-50"
            />
          </div>

          {/* Chart and summary */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
              <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Fluxo de pagamentos
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Comparativo mensal entre valores pagos e pendentes
                  </p>
                </div>

                <span className="w-fit rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                  Últimos 6 meses
                </span>
              </div>

              <div className="h-[290px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    barGap={6}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      tickFormatter={(value) =>
                        `R$ ${Number(value) / 1000}k`
                      }
                      width={65}
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                      contentStyle={{
                        borderRadius: 10,
                        border: "1px solid #e2e8f0",
                        fontSize: 12,
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      height={35}
                      iconType="circle"
                      wrapperStyle={{ fontSize: 12 }}
                    />
                    <Bar
                      dataKey="paid"
                      name="Pago"
                      fill="#2563eb"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={35}
                    />
                    <Bar
                      dataKey="pending"
                      name="Pendente"
                      fill="#f59e0b"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={35}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-900">
                Resumo financeiro
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Posição demonstrativa do mês
              </p>

              <div className="mt-7 space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-600">Total pago</span>
                    <span className="font-semibold text-slate-900">
                      R$ 48.600
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: "58%" }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    58% do volume financeiro considerado
                  </p>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-600">Pendente</span>
                    <span className="font-semibold text-slate-900">
                      R$ 35.430
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: "42%" }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    42% do volume financeiro considerado
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Total considerado
                    </span>
                    <span className="text-lg font-bold text-slate-900">
                      R$ 84.030
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-3">
                <div className="flex gap-2">
                  <CircleDollarSign
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-700"
                  />
                  <p className="text-xs leading-relaxed text-blue-800">
                    Indicadores financeiros consolidados para acompanhamento
                    das obrigações da empresa.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming and recent */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Próximos vencimentos
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Contas programadas para os próximos dias
                  </p>
                </div>
                <CalendarDays size={19} className="text-slate-400" />
              </div>

              <div className="divide-y divide-slate-100">
                {upcomingPayments.map((payment) => (
                  <div
                    key={payment.invoice}
                    className="flex items-center justify-between gap-3 p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-lg bg-amber-50 p-2.5">
                        <Receipt size={18} className="text-amber-700" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {payment.supplier}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {payment.invoice} · {payment.date}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        {formatCurrency(payment.amount)}
                      </p>
                      <p className="mt-1 text-xs text-amber-600">
                        {payment.urgency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("Contas a pagar")}
                className="flex w-full items-center justify-center gap-2 border-t border-slate-100 p-4 text-sm font-medium text-blue-700 transition hover:bg-slate-50"
              >
                Ver todas as contas
                <ArrowUpRight size={15} />
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Transações recentes
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Últimos pagamentos registrados
                  </p>
                </div>
                <Banknote size={19} className="text-slate-400" />
              </div>

              <div className="divide-y divide-slate-100">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between gap-3 p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-lg bg-emerald-50 p-2.5">
                        <ArrowUpRight
                          size={18}
                          className="text-emerald-700"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {transaction.supplier}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {transaction.description} · {transaction.date}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-emerald-700">
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {transaction.method}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("Histórico")}
                className="flex w-full items-center justify-center gap-2 border-t border-slate-100 p-4 text-sm font-medium text-blue-700 transition hover:bg-slate-50"
              >
                Ver histórico completo
                <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Accounts payable */}
      {activeTab === "Contas a pagar" && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-semibold text-slate-900">
              Contas a pagar
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Consulte e acompanhe os lançamentos financeiros dos fornecedores.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-5 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar fornecedor, CNPJ, nota ou lançamento..."
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="Todos">Todas as situações</option>
                <option value="Pago">Pago</option>
                <option value="Pendente">Pendente</option>
                <option value="Vencido">Vencido</option>
                <option value="Em aprovação">Em aprovação</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Fornecedor</th>
                  <th className="px-5 py-3 font-medium">Nota fiscal</th>
                  <th className="px-5 py-3 font-medium">Vencimento</th>
                  <th className="px-5 py-3 font-medium">Método</th>
                  <th className="px-5 py-3 text-right font-medium">Valor</th>
                  <th className="px-5 py-3 font-medium">Situação</th>
                  <th className="px-5 py-3 font-medium">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">
                        {payment.supplier}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {payment.document}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {payment.id}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {payment.invoice}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {payment.dueDate}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {payment.method}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-slate-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={payment.status} />
                    </td>
                        <td className="px-5 py-4">
                            <Link
                                href={`/pagamentos/${payment.id}`}
                                className="inline-flex items-center gap-1 font-medium text-blue-700 hover:text-blue-900"
                            >
                                Ver detalhes
                                <ArrowUpRight size={14} />
                            </Link>
                        </td>
                  </tr>
                ))}

                {filteredPayments.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-sm text-slate-500"
                    >
                      Nenhum lançamento encontrado para os filtros informados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
            Exibindo {filteredPayments.length} de {payments.length} lançamentos
            demonstrativos.
          </div>
        </div>
      )}

      {/* Payment methods */}
      {activeTab === "Métodos de pagamento" && (
        <div className="space-y-5">
          <div>
            <h2 className="font-semibold text-slate-900">
              Métodos de pagamento
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Formas de pagamento cadastradas para operações financeiras.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-blue-50 p-3">
                  <Building2 size={22} className="text-blue-700" />
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  Ativo
                </span>
              </div>
              <h3 className="mt-5 font-semibold text-slate-900">
                Transferência bancária
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Pagamentos por transferência entre instituições financeiras.
              </p>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-400">Conta demonstrativa</p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  Banco •••• 0042
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-emerald-50 p-3">
                  <CircleDollarSign size={22} className="text-emerald-700" />
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  Ativo
                </span>
              </div>
              <h3 className="mt-5 font-semibold text-slate-900">PIX</h3>
              <p className="mt-1 text-sm text-slate-500">
                Modalidade de pagamento instantâneo para fornecedores.
              </p>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-400">Identificação</p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  Chave corporativa ••••@ferrovale.com.br
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-violet-50 p-3">
                  <CreditCard size={22} className="text-violet-700" />
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  Ativo
                </span>
              </div>
              <h3 className="mt-5 font-semibold text-slate-900">
                Cartão corporativo
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Cartão utilizado em despesas operacionais da empresa.
              </p>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-400">Cartão cadastrado</p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  Mastercard •••• 4821
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-amber-50 p-3">
                  <FileText size={22} className="text-amber-700" />
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  Ativo
                </span>
              </div>
              <h3 className="mt-5 font-semibold text-slate-900">Boleto</h3>
              <p className="mt-1 text-sm text-slate-500">
                Controle de boletos recebidos e suas respectivas datas de
                vencimento.
              </p>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-400">Processamento</p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  Registro manual demonstrativo
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm leading-relaxed text-blue-800">
              <strong>Segurança:</strong> esta demonstração não armazena dados
              bancários completos, senhas, CVV ou números integrais de cartões.
              Nenhuma transação financeira real é executada.
            </p>
          </div>
        </div>
      )}

      {/* History */}
      {activeTab === "Histórico" && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-semibold text-slate-900">
              Histórico de pagamentos
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Registro demonstrativo das transações realizadas.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Identificação</th>
                  <th className="px-5 py-3 font-medium">Fornecedor</th>
                  <th className="px-5 py-3 font-medium">Descrição</th>
                  <th className="px-5 py-3 font-medium">Data</th>
                  <th className="px-5 py-3 font-medium">Método</th>
                  <th className="px-5 py-3 text-right font-medium">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-medium text-slate-700">
                      {transaction.id}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {transaction.supplier}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {transaction.description}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {transaction.date}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {transaction.method}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-emerald-700">
                      {formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer information */}
      <div className="flex flex-col justify-between gap-2 border-t border-slate-200 pt-4 text-xs text-slate-400 sm:flex-row">
        <p>Ferrovale · Supplier Intelligence · Gestão Financeira</p>
        <p>Ambiente demonstrativo · Dados fictícios</p>
      </div>
    </div>
  );
}
