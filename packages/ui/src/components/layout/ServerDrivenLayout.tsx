import { useUIConfig } from "../../hooks/useUIConfig.js";
import { useApps, useStats } from "../../hooks/useApps.js";
import { componentRegistry } from "../registry/index.js";

export function ServerDrivenLayout() {
  const { data: config, isLoading: configLoading } = useUIConfig();
  const { data: appsData, isLoading: appsLoading } = useApps();
  const { data: stats, isLoading: statsLoading } = useStats();

  if (configLoading || appsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  const uiConfig = config?.config || config;
  const apps = appsData?.apps || [];

  if (!uiConfig?.sections) {
    return <div className="text-gray-500 text-center py-10">No UI config loaded</div>;
  }

  // Auto-insert FilterBar if config has filters enabled
  const FilterBar = componentRegistry["FilterBar"];

  return (
    <div className="space-y-6">
      {uiConfig.filters && FilterBar && (
        <FilterBar apps={apps} stats={stats} config={uiConfig} section={{}} />
      )}
      {uiConfig.sections.map((section: any, i: number) => {
        const Component = componentRegistry[section.component];
        if (!Component) {
          return (
            <div key={i} className="text-red-400 text-sm">
              Unknown component: {section.component}
            </div>
          );
        }
        return (
          <Component
            key={`${section.component}-${i}`}
            apps={apps}
            stats={stats}
            config={uiConfig}
            section={section}
          />
        );
      })}
    </div>
  );
}
