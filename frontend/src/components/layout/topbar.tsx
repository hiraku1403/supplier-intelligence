"use client";

import { usePathname } from "next/navigation";
import { Bell, ChevronDown } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/": "Visão geral da operação",
  "/suppliers": "Gestão de fornecedores",
  "/monitoring": "Monitoramento contínuo",
  "/audit": "Auditoria e histórico",
  "/genius": "Inteligência artificial",
};

export default function Topbar() {
  const pathname = usePathname();

  const currentTitle =
    pageTitles[pathname] || "Supplier Intelligence";

  return (
    <header className="topbar">
      <div className="topbar-title">
        <span>Supplier Intelligence</span>
        <span style={{ margin: "0 9px", color: "#cbd5e1" }}>/</span>
        <strong style={{ color: "#334155" }}>{currentTitle}</strong>
      </div>

      <div className="topbar-user">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#64748b",
            marginRight: 12,
          }}
        >
          <Bell size={17} />
        </div>

        <div className="avatar">SI</div>

        <div>
          <div style={{ fontWeight: 650, color: "#334155" }}>
            Administrador
          </div>
          <div style={{ fontSize: 10, color: "#94a3b8" }}>
            Ferrovale
          </div>
        </div>

        <ChevronDown size={15} color="#94a3b8" />
      </div>
    </header>
  );
}