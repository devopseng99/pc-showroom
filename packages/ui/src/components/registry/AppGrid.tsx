import { useState } from "react";
import { AppCard } from "./AppCard.js";
import { AppDetailModal } from "./AppDetailModal.js";
import type { RegistryProps } from "./index.js";

export function AppGrid({ apps, section, config }: RegistryProps) {
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const groupBy = section.groupBy;
  const cardTemplate = section.cardTemplate || "default";
  const collapsible = section.collapsible;
  const cols = config?.theme?.gridColumns || { sm: 1, md: 2, lg: 3, xl: 4 };

  const gridClass = `grid gap-3 grid-cols-${cols.sm} sm:grid-cols-${cols.sm} md:grid-cols-${cols.md} lg:grid-cols-${cols.lg} xl:grid-cols-${cols.xl}`;

  if (groupBy) {
    const groups = new Map<string, any[]>();
    for (const app of apps) {
      const key = app[groupBy] || "Other";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(app);
    }

    return (
      <div className="space-y-6">
        {Array.from(groups.entries()).map(([group, groupApps]) => (
          <GroupSection
            key={group}
            title={group}
            count={groupApps.length}
            collapsible={collapsible}
          >
            <div className={gridClass}>
              {groupApps.map((app) => (
                <AppCard
                  key={app.appId}
                  app={app}
                  compact={cardTemplate === "compact"}
                  onClick={() => setSelectedApp(app)}
                />
              ))}
            </div>
          </GroupSection>
        ))}
        {selectedApp && (
          <AppDetailModal app={selectedApp} onClose={() => setSelectedApp(null)} />
        )}
      </div>
    );
  }

  return (
    <>
      <div className={gridClass}>
        {apps.map((app) => (
          <AppCard
            key={app.appId}
            app={app}
            compact={cardTemplate === "compact"}
            onClick={() => setSelectedApp(app)}
          />
        ))}
      </div>
      {selectedApp && (
        <AppDetailModal app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}
    </>
  );
}

function GroupSection({
  title,
  count,
  collapsible,
  children,
}: {
  title: string;
  count: number;
  collapsible?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => collapsible && setOpen(!open)}
        className={`flex items-center gap-2 mb-3 ${collapsible ? "cursor-pointer" : "cursor-default"}`}
      >
        {collapsible && (
          <span className={`text-gray-500 text-xs transition-transform ${open ? "rotate-90" : ""}`}>
            &#9654;
          </span>
        )}
        <h2 className="text-lg font-semibold text-gray-200">{title}</h2>
        <span className="text-sm text-gray-500">({count})</span>
      </button>
      {open && children}
    </div>
  );
}
