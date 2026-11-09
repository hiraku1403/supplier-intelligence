
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `API error: ${response.status} - ${endpoint}`
    );
  }

  return response.json();
}

export const api = {
  getDashboard: () =>
    request<DashboardMetrics>("/dashboard/metrics"),

  getSuppliers: () =>
    request<Supplier[]>("/suppliers/"),

  getSupplier: (id: string) =>
    request<Supplier>(`/suppliers/${id}`),

  getEvaluation: (id: string) =>
    request<SupplierEvaluation>(`/evaluations/${id}`),

  runEvaluation: (id: string) =>
    request<SupplierEvaluation>(
      `/evaluations/${id}/run`,
      {
        method: "POST",
      }
    ),

  getHistory: (id: string) =>
    request<AuditRecord[]>(`/evaluations/${id}/history`),

  getAudit: () =>
    request<AuditRecord[]>("/evaluations/audit"),

  getAlerts: (days = 15) =>
    request<ExpirationAlert[]>(
      `/monitoring/expirations?days=${days}`
    ),

  getGeniusTools: () =>
    request<GeniusTools>("/genius/tools"),

  askGeniusStatus: (cnpj: string) =>
    request<GeniusStatus>(
      `/genius/tools/suppliers/${cnpj}/status`
    ),

  askGeniusPending: (cnpj: string) =>
    request<GeniusPending>(
      `/genius/tools/suppliers/${cnpj}/pending`
    ),

  getGeniusExpirations: (days = 15) =>
    request<GeniusExpirations>(
      `/genius/tools/expirations?dias=${days}`
    ),
};

// Tipos da aplicação

export interface DashboardMetrics {
  total_suppliers: number;
  approved: number;
  pending_review: number;
  blocked: number;
  expired_documents: number;
  upcoming_expirations: number;
  categories: Record<string, number>;
  recent_alerts: ExpirationAlert[];
  simulated: boolean;
}

export interface Supplier {
  id: string;
  legal_name: string;
  trade_name: string;
  cnpj: string;
  category: "low" | "medium" | "high";
  state: string;
  city: string;
  registration_status: string;
  documents: SupplierDocument[];
  active_sanctions: boolean;
  labor_restriction: boolean;
  risk_score: number;
  homologation_status:
    | "approved"
    | "pending_review"
    | "blocked";
  last_review: string | null;
  simulated: boolean;
  notes: string[];
}

export interface SupplierDocument {
  document_type: string;
  name: string;
  status: "valid" | "expiring" | "expired" | "missing";
  issuing_source: string;
  issue_date: string | null;
  expiration_date: string | null;
  simulated: boolean;
}

export interface RuleFinding {
  rule_id: string;
  title: string;
  description: string;
  severity: string;
  evidence: string;
}

export interface SupplierEvaluation {
  supplier_id: string;
  supplier_name: string;
  status: "Aprovado" | "Requer atenção" | "Bloqueado";
  risk_score: number;
  can_contract: boolean;
  summary: string;
  findings: RuleFinding[];
  evaluated_at: string;
  simulated: boolean;
}

export interface AuditRecord extends SupplierEvaluation {
  id: number;
}

export interface ExpirationAlert {
  supplier_id: string;
  supplier_name: string;
  document_type: string;
  document_name: string;
  expiration_date: string;
  days_remaining: number;
  severity: string;
  message: string;
  simulated: boolean;
}

export interface GeniusTools {
  agent: string;
  version: string;
  tools: {
    name: string;
    description: string;
    method: string;
    endpoint: string;
    parameters: Record<string, unknown>;
  }[];
  simulated: boolean;
}

export interface GeniusStatus {
  success: boolean;
  supplier_id?: string;
  supplier_name?: string;
  status?: string;
  risk_score?: number;
  can_contract?: boolean;
  summary?: string;
  error?: string;
  message?: string;
}

export interface GeniusPending {
  success: boolean;
  supplier_id?: string;
  supplier_name?: string;
  pending_items?: RuleFinding[];
  can_contract?: boolean;
  error?: string;
  message?: string;
}

export interface GeniusExpirations {
  success: boolean;
  total: number;
  items: ExpirationAlert[];
  simulated: boolean;
}

// Exports individuais

export const getDashboard = api.getDashboard;
export const getSuppliers = api.getSuppliers;
export const getSupplier = api.getSupplier;
export const getEvaluation = api.getEvaluation;
export const runEvaluation = api.runEvaluation;
export const getHistory = api.getHistory;
export const getAudit = api.getAudit;
export const getAlerts = api.getAlerts;
export const getGeniusTools = api.getGeniusTools;
export const askGeniusStatus = api.askGeniusStatus;
export const askGeniusPending = api.askGeniusPending;
export const getGeniusExpirations = api.getGeniusExpirations;
