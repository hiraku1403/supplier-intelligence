"use client";

import { useCallback, useEffect, useState } from "react";
import {
  RefreshCw,
  ShieldCheck,
  Database,
  AlertCircle,
} from "lucide-react";

import {
  getDashboard,
  getSuppliers,
  type DashboardMetrics,
  type Supplier,
} from "@/services/api";

import MetricCard from "@/components/dashboard/metric-card";
import SupplierChart from "@/components/dashboard/supplier-chart";
import RecentAlerts from "@/components/dashboard/recent-alerts";
import AttentionSuppliers from "@/components/dashboard/attention-suppliers";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboardData, suppliersData] = await Promise.all([
        getDashboard(),
        getSuppliers(),
      ]);

      setMetrics(dashboardData);
      setSuppliers(suppliersData);
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
      setError(
        "Não foi possível carregar os dados. Verifique se o backend está ativo."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <RefreshCw
          size={28}
          color="#2563eb"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <p style={{ color: "#64748b", marginTop: 14 }}>
          Carregando indicadores da operação...
        </p>
        <style jsx>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#b91c1c",
          }}
        >
          <AlertCircle size={22} />
          <strong>Erro ao carregar dashboard</strong>
        </div>

        <p style={{ color: "#64748b", margin: "12px 0" }}>
          {error || "Não foi possível obter os indicadores."}
        </p>

        <button
          className="btn btn-primary"
          onClick={loadDashboard}
        >
          <RefreshCw size={14} />
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <section>
      <div className="simulation-banner">
        <Database size={16} />
        Ambiente demonstrativo: dados fictícios utilizados exclusivamente
        para este protótipo. As consultas externas são simuladas.
      </div>

      <div className="page-heading">
        <div>
          <h1 className="page-title">Visão geral</h1>
          <p className="page-description">
            Acompanhe a saúde cadastral, os riscos e a conformidade
            da cadeia de fornecedores da Ferrovale.
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={loadDashboard}
        >
          <RefreshCw size={14} />
          Atualizar dados
        </button>
      </div>

      <div className="metric-grid">
        <MetricCard
          title="Total de fornecedores"
          value={metrics.total_suppliers}
          description="Fornecedores cadastrados"
          type="total"
        />

        <MetricCard
          title="Aprovados"
          value={metrics.approved}
          description="Aptos para contratação"
          type="approved"
        />

        <MetricCard
          title="Em análise"
          value={metrics.pending_review}
          description="Aguardando regularização ou revisão"
          type="pending"
        />

        <MetricCard
          title="Bloqueados"
          value={metrics.blocked}
          description="Com impedimentos identificados"
          type="blocked"
        />

        <MetricCard
          title="Documentos vencidos"
          value={metrics.expired_documents}
          description="Exigem regularização"
          type="expired"
        />

        <MetricCard
          title="Próximos vencimentos"
          value={metrics.upcoming_expirations}
          description="Dentro da janela de alerta"
          type="upcoming"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 18,
          marginTop: 22,
        }}
        className="dashboard-panels"
      >
        <SupplierChart
          approved={metrics.approved}
          pending={metrics.pending_review}
          blocked={metrics.blocked}
        />

        <RecentAlerts alerts={metrics.recent_alerts} />
      </div>

      <div style={{ marginTop: 22 }}>
        <AttentionSuppliers suppliers={suppliers} />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          marginTop: 22,
          color: "#94a3b8",
          fontSize: 10,
        }}
      >
        <ShieldCheck size={14} />
        Indicadores calculados pelo motor de regras do Supplier Intelligence.
      </div>
    </section>
  );
}