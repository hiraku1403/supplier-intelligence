import Sidebar from "./sidebar";
import Topbar from "./topbar";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}