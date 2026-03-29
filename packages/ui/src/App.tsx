import { useState } from "react";
import { Shell } from "./components/layout/Shell.js";
import { ServerDrivenLayout } from "./components/layout/ServerDrivenLayout.js";
import { AdminPanel } from "./components/admin/AdminPanel.js";
import { useSSE } from "./hooks/useSSE.js";
import { useUIConfig } from "./hooks/useUIConfig.js";
import { FilterProvider } from "./hooks/useFilters.js";

export default function App() {
  const [view, setView] = useState<"showroom" | "admin">("showroom");
  useSSE();
  const { data: config } = useUIConfig();
  const theme = config?.config?.theme || { mode: "dark" };

  return (
    <div className={theme.mode === "light" ? "light" : ""}>
      <FilterProvider>
        <Shell currentView={view} onViewChange={setView}>
          {view === "showroom" ? <ServerDrivenLayout /> : <AdminPanel />}
        </Shell>
      </FilterProvider>
    </div>
  );
}
