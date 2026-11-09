import Link from "next/link";
import type { Supplier } from "@/services/api";
import { ArrowRight } from "lucide-react";

function getStatus(status: string) {
  switch (status) {
    case "approved":
      return {
        label: "Aprovado",
        className: "status-approved",
      };

    case "blocked":
      return {
        label: "Bloqueado",
        className: "status-blocked",
      };

    default:
      return {
        label: "Em análise",
        className: "status-pending",
      };
  }
}

export default function AttentionSuppliers({
  suppliers,
}: {
  suppliers: Supplier[];
}) {
  const attentionSuppliers = suppliers
    .filter((supplier) => supplier.homologation_status !== "approved")
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, 5);

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <div>
          <h2 className="card-title">Fornecedores que exigem atenção</h2>
          <p style={{ color: "#94a3b8", fontSize: 11, marginTop: 5 }}>
            Prioridade baseada nas avaliações de risco
          </p>
        </div>

        <Link
          href="/suppliers"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 11,
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: 650,
          }}
        >
          Ver todos <ArrowRight size={14} />
        </Link>
      </div>

      {attentionSuppliers.length === 0 ? (
        <p style={{ color: "#94a3b8", fontSize: 12 }}>
          Nenhum fornecedor exige atenção no momento.
        </p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Fornecedor</th>
                <th>Categoria</th>
                <th>Risco</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {attentionSuppliers.map((supplier) => {
                const status = getStatus(supplier.homologation_status);

                return (
                  <tr key={supplier.id}>
                    <td>
                      <div style={{ fontWeight: 650 }}>
                        {supplier.trade_name || supplier.legal_name}
                      </div>
                      <div
                        style={{
                          color: "#94a3b8",
                          fontSize: 10,
                          marginTop: 4,
                        }}
                      >
                        {supplier.cnpj}
                      </div>
                    </td>

                    <td>
                      {supplier.category.toUpperCase()}
                    </td>

                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          color:
                            supplier.risk_score >= 70
                              ? "#dc2626"
                              : supplier.risk_score >= 40
                                ? "#d97706"
                                : "#15803d",
                        }}
                      >
                        {supplier.risk_score}/100
                      </span>
                    </td>

                    <td>
                      <span className={`status-badge ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}