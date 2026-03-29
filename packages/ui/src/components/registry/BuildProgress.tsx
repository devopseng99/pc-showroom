import type { RegistryProps } from "./index.js";

export function BuildProgress({ apps }: RegistryProps) {
  const building = apps.filter(
    (a: any) => a.phase === "Building" || a.phase === "Deploying"
  );

  if (building.length === 0) return null;

  return (
    <div className="space-y-2">
      {building.map((app: any) => (
        <div
          key={app.appId}
          className="bg-gray-900 border border-gray-800 rounded-lg p-3"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{app.appName}</span>
            <span className="text-xs text-amber-400">{app.phase}</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"
              style={{ width: app.phase === "Deploying" ? "80%" : "50%" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
