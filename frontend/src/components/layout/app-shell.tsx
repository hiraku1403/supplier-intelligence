import { Suspense } from "react";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <Suspense fallback={<aside className="sidebar" />}>
        <Sidebar />
      </Suspense>

      <div className="main-area">
        <Suspense fallback={<header className="topbar" />}>
          <Topbar />
        </Suspense>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}