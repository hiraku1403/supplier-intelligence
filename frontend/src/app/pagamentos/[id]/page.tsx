"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileCheck,
  FileText,
  History,
  Receipt,
  ShieldCheck,
  UserCheck,
  Wallet,
  AlertCircle,
  Paperclip,
  Eye,
X,
Check,
MessageSquare,
FileSearch,
} from "lucide-react";

type PaymentStatus = "Pago" | "Pendente" | "Vencido" | "Em aprovação";

type PaymentDetail = {
  id: string;
  supplier: string;
  tradeName: string;
  cnpj: string;
  category: string;
  invoice: string;
  boleto: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  paymentDate?: string;
  method: string;
  status: PaymentStatus;
  description: string;
  costCenter: string;
  purchaseOrder: string;
  approver: string;
  approvalDate: string;
  bankReference: string;
};

const paymentDetails: Record<string, PaymentDetail> = {
  "PAY-2026-0148": {
    id: "PAY-2026-0148",
    supplier: "Metalúrgica Sol Indústria Ltda.",
    tradeName: "Metalúrgica Sol",
    cnpj: "12.345.678/0001-90",
    category: "Manutenção industrial",
    invoice: "NF-008421",
    boleto: "23790.00001 12345.678901 23456.789012 3 00000001845000",
    amount: 18450,
    issueDate: "05/11/2026",
    dueDate: "15/11/2026",
    method: "PIX",
    status: "Pendente",
    description: "Fornecimento de peças e componentes industriais",
    costCenter: "CC-001 · Manutenção",
    purchaseOrder: "OC-2026-0842",
    approver: "Carlos Mendes",
    approvalDate: "10/11/2026",
    bankReference: "Aguardando execução",
  },
  "PAY-2026-0147": {
    id: "PAY-2026-0147",
    supplier: "TechOffice",
    tradeName: "TechOffice",
    cnpj: "23.456.789/0001-01",
    category: "Material de escritório",
    invoice: "NF-003192",
    boleto: "23790.00001 12345.678901 23456.789013 4 00000000428000",
    amount: 4280,
    issueDate: "03/11/2026",
    dueDate: "18/11/2026",
    method: "Transferência",
    status: "Em aprovação",
    description: "Aquisição de equipamentos e materiais de escritório",
    costCenter: "CC-004 · Administrativo",
    purchaseOrder: "OC-2026-0791",
    approver: "Fernanda Costa",
    approvalDate: "11/11/2026",
    bankReference: "Aguardando aprovação final",
  },
  "PAY-2026-0146": {
    id: "PAY-2026-0146",
    supplier: "Transportes Brasil",
    tradeName: "Transportes Brasil",
    cnpj: "34.567.890/0001-12",
    category: "Transporte e logística",
    invoice: "NF-001874",
    boleto: "34191.00001 12345.678901 23456.789014 5 00000001275000",
    amount: 12750,
    issueDate: "28/10/2026",
    dueDate: "10/11/2026",
    method: "Boleto",
    status: "Vencido",
    description: "Serviços de transporte de materiais",
    costCenter: "CC-002 · Logística",
    purchaseOrder: "OC-2026-0724",
    approver: "Roberto Almeida",
    approvalDate: "30/10/2026",
    bankReference: "Pagamento não identificado",
  },
  "PAY-2026-0145": {
    id: "PAY-2026-0145",
    supplier: "Alfa Serviços",
    tradeName: "Alfa Serviços",
    cnpj: "45.678.901/0001-23",
    category: "Serviços operacionais",
    invoice: "NF-006510",
    boleto: "Não aplicável",
    amount: 8950,
    issueDate: "25/10/2026",
    dueDate: "08/11/2026",
    paymentDate: "08/11/2026",
    method: "Transferência",
    status: "Pago",
    description: "Serviços de apoio operacional",
    costCenter: "CC-003 · Operações",
    purchaseOrder: "OC-2026-0680",
    approver: "Fernanda Costa",
    approvalDate: "04/11/2026",
    bankReference: "TRX-00821",
  },
  "PAY-2026-0144": {
    id: "PAY-2026-0144",
    supplier: "TechOffice",
    tradeName: "TechOffice",
    cnpj: "23.456.789/0001-01",
    category: "Material de escritório",
    invoice: "NF-003181",
    boleto: "Não aplicável",
    amount: 3200,
    issueDate: "20/10/2026",
    dueDate: "05/11/2026",
    paymentDate: "05/11/2026",
    method: "PIX",
    status: "Pago",
    description: "Materiais de escritório",
    costCenter: "CC-004 · Administrativo",
    purchaseOrder: "OC-2026-0642",
    approver: "Carlos Mendes",
    approvalDate: "02/11/2026",
    bankReference: "TRX-00820",
  },
  "PAY-2026-0143": {
    id: "PAY-2026-0143",
    supplier: "Metalúrgica Sol Indústria Ltda.",
    tradeName: "Metalúrgica Sol",
    cnpj: "12.345.678/0001-90",
    category: "Manutenção industrial",
    invoice: "NF-008390",
    boleto: "23790.00001 12345.678901 23456.789015 6 00000002210000",
    amount: 22100,
    issueDate: "15/10/2026",
    dueDate: "30/10/2026",
    paymentDate: "30/10/2026",
    method: "Boleto",
    status: "Pago",
    description: "Componentes para manutenção de máquinas",
    costCenter: "CC-001 · Manutenção",
    purchaseOrder: "OC-2026-0591",
    approver: "Roberto Almeida",
    approvalDate: "27/10/2026",
    bankReference: "TRX-00819",
  },
  "PAY-2026-0142": {
    id: "PAY-2026-0142",
    supplier: "Transportes Brasil",
    tradeName: "Transportes Brasil",
    cnpj: "34.567.890/0001-12",
    category: "Transporte e logística",
    invoice: "NF-001820",
    boleto: "Não aplicável",
    amount: 6800,
    issueDate: "12/10/2026",
    dueDate: "25/10/2026",
    paymentDate: "25/10/2026",
    method: "PIX",
    status: "Pago",
    description: "Transporte de insumos industriais",
    costCenter: "CC-002 · Logística",
    purchaseOrder: "OC-2026-0540",
    approver: "Carlos Mendes",
    approvalDate: "22/10/2026",
    bankReference: "TRX-00818",
  },
};

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
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 p-5">
        <div className="rounded-lg bg-blue-50 p-2.5">
          <Icon size={19} className="text-blue-700" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-slate-500">{description}</p>
          )}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}


function DocumentCard({
  title,
  subtitle,
  icon: Icon,
  status,
  onClick,
}: {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  status: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col justify-between gap-4 rounded-lg border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/30 sm:flex-row sm:items-center"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-slate-100 p-3">
          <Icon size={20} className="text-slate-600" />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-900">{title}</p>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
          {status}
        </span>

        <span className="flex items-center gap-1 text-xs font-medium text-blue-700">
          <Eye size={15} />
          Visualizar
        </span>
      </div>
    </button>
  );
}


export default function PaymentDetailPage() {
  const params = useParams<{ id: string }>();
  const payment = paymentDetails[params.id];

  const [approvalState, setApprovalState] = useState(
  payment?.status === "Em aprovação"
    ? "Aguardando aprovação"
    : "Aprovado"
);

const [currentStatus, setCurrentStatus] = useState<PaymentStatus>(
  payment?.status ?? "Pendente"
);

const [approvalDate, setApprovalDate] = useState(
  payment?.approvalDate ?? "—"
);

const [adjustmentNote, setAdjustmentNote] = useState("");
const [showAdjustmentForm, setShowAdjustmentForm] = useState(false);
const [approvalFeedback, setApprovalFeedback] = useState("");

const [previewDocument, setPreviewDocument] = useState<
  "invoice" | "boleto" | "receipt" | null
>(null);

  if (!payment) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
        <div className="rounded-full bg-amber-50 p-4">
          <AlertCircle size={30} className="text-amber-600" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-slate-900">
          Lançamento não encontrado
        </h1>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          Não encontramos um lançamento com o identificador informado.
        </p>
        <Link
          href="/pagamentos"
          className="mt-5 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-800"
        >
          Voltar para pagamentos
        </Link>
      </div>
    );
  }

  const isPaid = currentStatus === "Pago";

  const timeline = [
    {
      title: "Lançamento registrado",
      description: `Documento ${payment.invoice} vinculado ao lançamento financeiro.`,
      date: payment.issueDate,
      completed: true,
    },
    {
      title: "Análise e aprovação",
      description: `Responsável: ${payment.approver}.`,
      date: payment.approvalDate,
      completed: true,
    },
    {
      title: "Vencimento programado",
      description: `Data prevista: ${payment.dueDate}.`,
      date: payment.dueDate,
      completed: isPaid,
    },
    {
      title: "Pagamento",
      description: isPaid
        ? `Pagamento registrado. Referência: ${payment.bankReference}.`
        : payment.status === "Vencido"
          ? "Pagamento não identificado até o vencimento."
          : "Aguardando execução do pagamento.",
      date: payment.paymentDate || "Aguardando",
      completed: isPaid,
    },
  ];

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 md:p-6 lg:p-8">
      {/* Breadcrumb and header */}
      <div>
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/pagamentos" className="hover:text-blue-700">
            Gestão de Pagamentos
          </Link>
          <span>/</span>
          <span className="text-slate-700">Detalhes do lançamento</span>
        </div>

        <Link
          href="/pagamentos"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900"
        >
          <ArrowLeft size={16} />
          Voltar para pagamentos
        </Link>

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                {payment.id}
              </h1>
              <StatusBadge status={currentStatus} />
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Detalhamento do lançamento financeiro e documentos associados.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <Download size={16} />
            Exportar detalhes
          </button>
        </div>
      </div>

      {/* Main summary */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Valor do lançamento</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {formatCurrency(payment.amount)}
              </h2>
            </div>
            <div className="rounded-xl bg-blue-50 p-3">
              <Wallet size={25} className="text-blue-700" />
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard label="Nota fiscal" value={payment.invoice} />
            <InfoCard label="Emissão" value={payment.issueDate} />
            <InfoCard label="Vencimento" value={payment.dueDate} />
            <InfoCard
              label="Data do pagamento"
              value={payment.paymentDate || "Não realizado"}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Situação financeira
          </p>

          <div className="mt-4 flex items-center gap-3">
            {isPaid ? (
              <CheckCircle2 size={26} className="text-emerald-600" />
            ) : payment.status === "Vencido" ? (
              <AlertCircle size={26} className="text-red-600" />
            ) : (
              <Clock3 size={26} className="text-amber-600" />
            )}

            <div>
              <p className="font-semibold text-slate-900">
                {currentStatus}
              </p>
              <p className="text-xs text-slate-500">
                Situação do lançamento
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4 border-t border-slate-100 pt-5">
            <InfoCard label="Método de pagamento" value={payment.method} />
            <InfoCard label="Referência financeira" value={payment.bankReference} />
            <InfoCard label="Pedido de compra" value={payment.purchaseOrder} />
          </div>
        </div>
      </div>

      {/* Supplier and financial details */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionCard
          title="Dados do fornecedor"
          description="Identificação do beneficiário do pagamento"
          icon={Building2}
        >
          <div className="space-y-5">
            <div>
              <p className="text-xs text-slate-500">Razão social</p>
              <p className="mt-1 font-semibold text-slate-900">
                {payment.supplier}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Nome fantasia: {payment.tradeName}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoCard label="CNPJ" value={payment.cnpj} />
              <InfoCard label="Categoria" value={payment.category} />
              <InfoCard label="Centro de custo" value={payment.costCenter} />
              <InfoCard label="Pedido de compra" value={payment.purchaseOrder} />
            </div>

            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
              <div className="flex gap-2">
                <ShieldCheck size={17} className="mt-0.5 shrink-0 text-blue-700" />
                <p className="text-xs leading-relaxed text-blue-800">
                  A situação financeira deste lançamento é independente da
                  situação de homologação do fornecedor.
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Informações do pagamento"
          description="Dados operacionais e financeiros"
          icon={Receipt}
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InfoCard label="Valor bruto" value={formatCurrency(payment.amount)} />
            <InfoCard label="Método" value={payment.method} />
            <InfoCard label="Data de emissão" value={payment.issueDate} />
            <InfoCard label="Data de vencimento" value={payment.dueDate} />
            <InfoCard
              label="Referência bancária"
              value={payment.bankReference}
            />
            <InfoCard label="Descrição" value={payment.description} />
          </div>
        </SectionCard>
      </div>

      {/* Documents */}
      <SectionCard
        title="Documentos financeiros"
        description="Documentos vinculados ao lançamento"
        icon={Paperclip}
      >
        <div className="space-y-3">
          <DocumentCard
  title="Nota fiscal eletrônica"
  subtitle={`${payment.invoice} · Emissão ${payment.issueDate}`}
  icon={FileText}
  status="Vinculada"
  onClick={() => setPreviewDocument("invoice")}
/>

<DocumentCard
  title="Boleto bancário"
  subtitle={
    payment.boleto === "Não aplicável"
      ? "Não aplicável a este lançamento"
      : payment.boleto
  }
  icon={Receipt}
  status={payment.boleto === "Não aplicável" ? "N/A" : "Vinculado"}
  onClick={() => setPreviewDocument("boleto")}
/>

<DocumentCard
  title="Comprovante de pagamento"
  subtitle={
    isPaid
      ? `Referência ${payment.bankReference}`
      : "Comprovante ainda não disponível"
  }
  icon={FileCheck}
  status={isPaid ? "Registrado" : "Aguardando"}
  onClick={() => setPreviewDocument("receipt")}
/>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          Os documentos e referências desta tela são demonstrativos. Não há
          arquivos fiscais ou comprovantes bancários reais anexados.
        </p>
      </SectionCard>

      {/* Approval */}
      
{/* Approval */}
<SectionCard
  title="Fluxo de aprovação"
  description="Responsáveis, decisões e etapas do processo financeiro"
  icon={UserCheck}
>
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div>
        <p className="text-xs text-slate-500">
          Responsável pela aprovação
        </p>
        <p className="mt-1 font-semibold text-slate-900">
          {payment.approver}
        </p>
      </div>

      <div>
        <p className="text-xs text-slate-500">
          Data da aprovação
        </p>
        <p className="mt-1 font-semibold text-slate-900">
          {approvalDate}
        </p>
      </div>

      <div>
        <p className="text-xs text-slate-500">
          Situação da aprovação
        </p>

        <span
          className={`mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
            approvalState === "Aprovado"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : approvalState === "Requer ajustes"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {approvalState}
        </span>
      </div>
    </div>

    <div className="border-t border-slate-100 pt-5">
      <h3 className="text-sm font-semibold text-slate-900">
        Ações de aprovação
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        Registre uma decisão sobre este lançamento financeiro.
      </p>

      {approvalState === "Aguardando aprovação" ? (
        <div className="mt-5 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setApprovalState("Aprovado");
                setApprovalDate("14/11/2026");
                setCurrentStatus("Pendente");
                setShowAdjustmentForm(false);
                setApprovalFeedback(
                  "Lançamento aprovado. Agora está aguardando a execução do pagamento."
                );
              }}
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              <Check size={17} />
              Aprovar lançamento
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAdjustmentForm(!showAdjustmentForm);
                setApprovalFeedback("");
              }}
              className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50"
            >
              <MessageSquare size={17} />
              Solicitar ajustes
            </button>
          </div>

          {showAdjustmentForm && (
            <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
              <label className="text-sm font-medium text-slate-800">
                Motivo da solicitação
              </label>

              <textarea
                value={adjustmentNote}
                onChange={(event) => setAdjustmentNote(event.target.value)}
                placeholder="Descreva os ajustes necessários neste lançamento..."
                rows={3}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <div className="mt-3 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustmentForm(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={!adjustmentNote.trim()}
                  onClick={() => {
                    setApprovalState("Requer ajustes");
                    setShowAdjustmentForm(false);
                    setApprovalFeedback(
                      `Solicitação registrada: ${adjustmentNote.trim()}`
                    );
                  }}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Registrar solicitação
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-2">
            {approvalState === "Aprovado" ? (
              <CheckCircle2 size={18} className="mt-0.5 text-emerald-600" />
            ) : (
              <AlertCircle size={18} className="mt-0.5 text-red-600" />
            )}

            <div>
              <p className="text-sm font-medium text-slate-800">
                {approvalState === "Aprovado"
                  ? "Este lançamento já foi aprovado."
                  : "Este lançamento requer ajustes."}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {approvalState === "Aprovado"
                  ? "A aprovação está registrada nesta demonstração. O pagamento ainda depende de execução."
                  : "A solicitação de ajustes foi registrada nesta demonstração."}
              </p>
            </div>
          </div>

          {approvalState === "Requer ajustes" && (
            <button
              type="button"
              onClick={() => {
                setApprovalState("Aguardando aprovação");
                setAdjustmentNote("");
                setApprovalFeedback("");
              }}
              className="mt-4 text-sm font-medium text-blue-700 hover:text-blue-900"
            >
              Reabrir análise demonstrativa
            </button>
          )}
        </div>
      )}

      {approvalFeedback && (
        <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3">
          <p className="text-sm text-blue-800">{approvalFeedback}</p>
        </div>
      )}
    </div>
  </div>
</SectionCard>


      {/* Timeline */}
      <SectionCard
        title="Histórico do lançamento"
        description="Linha do tempo demonstrativa de eventos financeiros"
        icon={History}
      >
        <div className="space-y-6">
          {timeline.map((event, index) => (
            <div key={event.title} className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`z-10 flex h-9 w-9 items-center justify-center rounded-full ${
                    event.completed
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {event.completed ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Clock3 size={18} />
                  )}
                </div>

                {index !== timeline.length - 1 && (
                  <div className="absolute left-[17px] top-9 h-[calc(100%+8px)] w-px bg-slate-200" />
                )}
              </div>

              <div className="min-w-0 pb-2">
                <p className="text-sm font-semibold text-slate-900">
                  {event.title}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {event.description}
                </p>
                <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                  <CalendarDays size={13} />
                  {event.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

{/* Document Preview Modal */}
{previewDocument && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
    onClick={() => setPreviewDocument(null)}
  >
    <div
      className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-2.5">
            {previewDocument === "invoice" ? (
              <FileText size={21} className="text-blue-700" />
            ) : previewDocument === "boleto" ? (
              <Receipt size={21} className="text-blue-700" />
            ) : (
              <FileCheck size={21} className="text-blue-700" />
            )}
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              {previewDocument === "invoice"
                ? "Nota fiscal eletrônica"
                : previewDocument === "boleto"
                  ? "Boleto bancário"
                  : "Comprovante de pagamento"}
            </h2>
            <p className="text-xs text-slate-500">
              Documento demonstrativo · {payment.id}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPreviewDocument(null)}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Fechar visualização"
        >
          <X size={20} />
        </button>
      </div>

      <div className="bg-slate-100 p-4 sm:p-7">
        <div className="mx-auto min-h-[390px] max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
                Ferrovale
              </p>
              <h3 className="mt-2 text-lg font-bold text-slate-900">
                {previewDocument === "invoice"
                  ? "Documento fiscal"
                  : previewDocument === "boleto"
                    ? "Documento de cobrança"
                    : "Comprovante de pagamento"}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Registro financeiro demonstrativo
              </p>
            </div>

            <span className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase text-amber-700">
              Simulação
            </span>
          </div>

          {previewDocument === "invoice" && (
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs text-slate-400">Número da nota fiscal</p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {payment.invoice}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoCard label="Data de emissão" value={payment.issueDate} />
                <InfoCard label="Valor total" value={formatCurrency(payment.amount)} />
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Emitente
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {payment.supplier}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  CNPJ: {payment.cnpj}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Descrição dos serviços / produtos
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  {payment.description}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Valor total da operação
                </p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {formatCurrency(payment.amount)}
                </p>
              </div>
            </div>
          )}

          {previewDocument === "boleto" && (
            <div className="mt-6 space-y-5">
              {payment.boleto === "Não aplicável" ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-center">
                  <AlertCircle
                    size={28}
                    className="mx-auto text-slate-400"
                  />
                  <p className="mt-3 text-sm font-medium text-slate-800">
                    Boleto não aplicável
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Este lançamento utiliza outro método de pagamento.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-xs text-slate-400">
                      Beneficiário
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {payment.supplier}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      CNPJ: {payment.cnpj}
                    </p>
                  </div>

                  <div className="rounded-lg border border-dashed border-slate-300 p-4">
                    <p className="text-xs text-slate-500">
                      Linha digitável fictícia
                    </p>
                    <p className="mt-2 break-all font-mono text-sm leading-relaxed text-slate-800">
                      {payment.boleto}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InfoCard label="Vencimento" value={payment.dueDate} />
                    <InfoCard label="Valor do boleto" value={formatCurrency(payment.amount)} />
                  </div>

                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">
                      Referência da nota fiscal
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {payment.invoice}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {previewDocument === "receipt" && (
            <div className="mt-6 space-y-5">
              {isPaid ? (
                <>
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                    <CheckCircle2 size={19} className="text-emerald-700" />
                    <p className="text-sm font-medium text-emerald-800">
                      Pagamento registrado na demonstração
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InfoCard label="Beneficiário" value={payment.tradeName} />
                    <InfoCard label="Data do pagamento" value={payment.paymentDate || "—"} />
                    <InfoCard label="Valor pago" value={formatCurrency(payment.amount)} />
                    <InfoCard label="Método" value={payment.method} />
                  </div>

                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs text-slate-500">
                      Identificador da transação
                    </p>
                    <p className="mt-1 font-mono text-sm font-semibold text-slate-900">
                      {payment.bankReference}
                    </p>
                  </div>
                </>
              ) : (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-center">
                  <Clock3
                    size={28}
                    className="mx-auto text-amber-600"
                  />
                  <p className="mt-3 text-sm font-semibold text-amber-800">
                    Comprovante ainda não disponível
                  </p>
                  <p className="mt-1 text-xs text-amber-700">
                    O lançamento ainda não possui pagamento registrado.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-7 border-t border-slate-200 pt-4 text-center">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Documento fictício para demonstração do Supplier Intelligence
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-100 p-4">
        <button
          type="button"
          onClick={() => setPreviewDocument(null)}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Fechar visualização
        </button>
      </div>
    </div>
  </div>
)}

      {/* Footer */}
      <div className="flex flex-col justify-between gap-2 border-t border-slate-200 pt-4 text-xs text-slate-400 sm:flex-row">
        <p>Ferrovale · Supplier Intelligence · Gestão Financeira</p>
        <p>Registro demonstrativo · Dados fictícios</p>
      </div>
    </div>
  );
}
