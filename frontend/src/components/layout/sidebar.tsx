
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Activity,
  ClipboardList,
  Bot,
  ShieldCheck,
  Store,
} from "lucide-react";

const navigation = [
  {
    label: "VISÃO GERAL",
    items: [
      {
        name: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "GESTÃO",
    items: [
      {
        name: "Fornecedores",
        href: "/suppliers",
        icon: Building2,
      },
      {
        name: "Monitoramento",
        href: "/monitoring",
        icon: Activity,
      },
      {
        name: "Auditoria",
        href: "/audit",
        icon: ClipboardList,
      },
    ],
  },
  {
    label: "ÁREA DO FORNECEDOR",
    items: [
      {
        name: "Portal do Fornecedor",
        href: "/portal-fornecedor",
        icon: Store,
      },
    ],
  },
  {
    label: "INTELIGÊNCIA",
    items: [
      {
        name: "Genius Assistant",
        href: "/genius",
        icon: Bot,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <ShieldCheck size={22} />
        </div>

        <div className="brand-text">
          <div className="brand-name">Supplier Intelligence</div>
          <div className="brand-subtitle">Supplier Risk Management</div>
        </div>
      </div>

      <nav>
        {navigation.map((section) => (
          <div className="nav-section" key={section.label}>
            <div className="nav-label">{section.label}</div>

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${isActive ? "active" : ""}`}
                  title={item.name}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div>Supplier Intelligence v1.0</div>
        <div>Ambiente de demonstração</div>
      </div>
    </aside>
  );
}
