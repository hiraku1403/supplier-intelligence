import {
  Building2,
  CheckCircle2,
  Clock3,
  ShieldAlert,
  FileWarning,
  CalendarClock,
} from "lucide-react";

type MetricCardProps = {
  title: string;
  value: number;
  description: string;
  type: "total" | "approved" | "pending" | "blocked" | "expired" | "upcoming";
};

const configurations = {
  total: {
    icon: Building2,
    color: "#2563eb",
    background: "#eff6ff",
  },
  approved: {
    icon: CheckCircle2,
    color: "#15803d",
    background: "#f0fdf4",
  },
  pending: {
    icon: Clock3,
    color: "#b45309",
    background: "#fffbeb",
  },
  blocked: {
    icon: ShieldAlert,
    color: "#b91c1c",
    background: "#fef2f2",
  },
  expired: {
    icon: FileWarning,
    color: "#b91c1c",
    background: "#fef2f2",
  },
  upcoming: {
    icon: CalendarClock,
    color: "#7c3aed",
    background: "#f5f3ff",
  },
};

export default function MetricCard({
  title,
  value,
  description,
  type,
}: MetricCardProps) {
  const config = configurations[type];
  const Icon = config.icon;

  return (
    <div className="metric-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span className="metric-label">{title}</span>

        <div
          style={{
            width: 37,
            height: 37,
            borderRadius: 9,
            display: "grid",
            placeItems: "center",
            background: config.background,
            color: config.color,
          }}
        >
          <Icon size={19} />
        </div>
      </div>

      <div className="metric-value">{value}</div>

      <div className="metric-description">{description}</div>
    </div>
  );
}