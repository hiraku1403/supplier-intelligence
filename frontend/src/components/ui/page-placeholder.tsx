import { Construction } from "lucide-react";

interface PagePlaceholderProps {
  title: string;
  description: string;
}

export default function PagePlaceholder({
  title,
  description,
}: PagePlaceholderProps) {
  return (
    <section>
      <div className="page-heading">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-description">{description}</p>
        </div>
      </div>

      <div className="card">
        <div
          style={{
            minHeight: 260,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 12,
          }}
        >
          <Construction size={34} color="#94a3b8" />

          <h2 style={{ fontSize: 16, fontWeight: 650 }}>
            Área em desenvolvimento
          </h2>

          <p style={{ color: "#64748b", maxWidth: 400 }}>
            Esta funcionalidade será implementada nas próximas etapas
            do Supplier Intelligence.
          </p>
        </div>
      </div>
    </section>
  );
}