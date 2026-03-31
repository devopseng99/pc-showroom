import type { RegistryProps } from "./index.js";

export function LiveBuildStrip({ apps, section }: RegistryProps) {
  const filterPhases = section.filter?.phase || ["Building"];
  const active = apps.filter((a: any) =>
    (filterPhases as string[]).includes(a.phase)
  );

  if (active.length === 0) return null;

  return (
    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <h3 className="text-sm font-medium text-amber-400">
          Live — {active.length} build{active.length !== 1 ? "s" : ""} in progress
        </h3>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {active.map((app: any) => (
          <div
            key={app.appId}
            className="shrink-0 bg-gray-900/80 border border-gray-800 rounded-lg px-3 py-2 min-w-[200px]"
          >
            <div className="text-sm font-medium truncate">{app.appName}</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full animate-pulse w-2/3" />
              </div>
              <span className="text-xs text-amber-400">{app.phase}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
