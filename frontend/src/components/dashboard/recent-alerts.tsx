import { AlertTriangle, CalendarClock } from "lucide-react";
import type { DashboardMetrics } from "@/services/api";

type Alert = DashboardMetrics["recent_alerts"][number];

export default function RecentAlerts({
  alerts,
}: {
  alerts: Alert[];
}) {
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
          <h2 className="card-title">Alertas documentais</h2>
          <p style={{ color: "#94a3b8", fontSize: 11, marginTop: 5 }}>
            Documentos que precisam de atenção
          </p>
        </div>

        <AlertTriangle size={19} color="#d97706" />
      </div>

      {alerts.length === 0 ? (
        <p style={{ color: "#94a3b8", fontSize: 12 }}>
          Nenhum alerta documental encontrado.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {alerts.slice(0, 5).map((alert, index) => {
            const expired = alert.days_remaining < 0;

            return (
              <div
                key={`${alert.supplier_id}-${alert.document_type}-${index}`}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  paddingBottom: 13,
                  borderBottom:
                    index !== Math.min(alerts.length, 5) - 1
                      ? "1px solid #edf0f5"
                      : "none",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    minWidth: 34,
                    borderRadius: 8,
                    background: expired ? "#fef2f2" : "#fffbeb",
                    color: expired ? "#dc2626" : "#d97706",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <CalendarClock size={17} />
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 650,
                      color: "#334155",
                    }}
                  >
                    {alert.document_name}
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      color: "#64748b",
                      marginTop: 4,
                    }}
                  >
                    {alert.supplier_name}
                  </div>

                  <div
                    style={{
                      fontSize: 10,
                      marginTop: 6,
                      color: expired ? "#b91c1c" : "#b45309",
                      fontWeight: 650,
                    }}
                  >
                    {expired
                      ? `Vencido há ${Math.abs(alert.days_remaining)} dia(s)`
                      : alert.days_remaining === 0
                        ? "Vence hoje"
                        : `Vence em ${alert.days_remaining} dia(s)`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}