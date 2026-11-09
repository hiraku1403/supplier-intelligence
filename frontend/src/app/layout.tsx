import type { Metadata } from "next";
import AppShell from "@/components/layout/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Supplier Intelligence | Gestão de Fornecedores - Ferrovale",
  description:
    "Plataforma inteligente de homologação, monitoramento e gestão de riscos de fornecedores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}