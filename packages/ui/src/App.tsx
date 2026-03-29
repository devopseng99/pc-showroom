import { useState } from "react";
import { Shell } from "./components/layout/Shell.js";
import { ServerDrivenLayout } from "./components/layout/ServerDrivenLayout.js";
import { AdminPanel } from "./components/admin/AdminPanel.js";
import { useSSE } from "./hooks/useSSE.js";

export default function App() {
  const [view, setView] = useState<"showroom" | "admin">("showroom");
  useSSE();

  return (
    <Shell currentView={view} onViewChange={setView}>
      {view === "showroom" ? <ServerDrivenLayout /> : <AdminPanel />}
    </Shell>
  );
}
