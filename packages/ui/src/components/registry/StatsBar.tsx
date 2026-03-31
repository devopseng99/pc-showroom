import type { RegistryProps } from "./index.js";

const METRIC_CONFIG: Record<string, { label: string; color: string }> = {
  total: { label: "Total Apps", color: "text-white" },
  deployed: { label: "Deployed", color: "text-emerald-400" },
  deploying: { label: "Deploying", color: "text-blue-400" },
  building: { label: "Building", color: "text-amber-400" },
  pending: { label: "Pending", color: "text-gray-400" },
  failed: { label: "Failed", color: "text-red-400" },
};

export function StatsBar({ stats, section }: RegistryProps) {
  if (!stats) return null;
  const metrics = section.props?.metrics || ["total", "deployed", "deploying", "building", "pending", "failed"];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {(metrics as string[]).map((key) => {
        const cfg = METRIC_CONFIG[key] || { label: key, color: "text-white" };
        const value = stats[key] ?? 0;
        return (
          <div
            key={key}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center"
          >
            <div className={`text-3xl font-bold ${cfg.color}`}>{value}</div>
            <div className="text-sm text-gray-500 mt-1">{cfg.label}</div>
          </div>
        );
      })}
    </div>
  );
}
