"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

type SupplierChartProps = {
  approved: number;
  pending: number;
  blocked: number;
};

const COLORS = ["#16a34a", "#f59e0b", "#dc2626"];

export default function SupplierChart({
  approved,
  pending,
  blocked,
}: SupplierChartProps) {
  const data = [
    { name: "Aprovados", value: approved },
    { name: "Em análise", value: pending },
    { name: "Bloqueados", value: blocked },
  ];

  const total = approved + pending + blocked;

  return (
    <div className="card" style={{ height: 350 }}>
      <div style={{ marginBottom: 12 }}>
        <h2 className="card-title">Status de homologação</h2>
        <p
          style={{
            color: "#94a3b8",
            fontSize: 11,
            marginTop: 5,
          }}
        >
          Distribuição atual dos fornecedores
        </p>
      </div>

      {total === 0 ? (
        <div
          style={{
            height: 240,
            display: "grid",
            placeItems: "center",
            color: "#94a3b8",
          }}
        >
          Nenhum fornecedor encontrado.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="48%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [`${value} fornecedores`, "Quantidade"]}
            />

            <Legend verticalAlign="bottom" height={30} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}