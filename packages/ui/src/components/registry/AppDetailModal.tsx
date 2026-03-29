import { useQuery } from "@tanstack/react-query";
import { fetchApp } from "../../lib/api.js";

interface AppDetailModalProps {
  app: any;
  onClose: () => void;
}

export function AppDetailModal({ app, onClose }: AppDetailModalProps) {
  const { data: detail } = useQuery({
    queryKey: ["app", app.appId],
    queryFn: () => fetchApp(app.appId),
  });

  const events = detail?.events || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">{app.appName}</h2>
            <p className="text-sm text-gray-500">
              {app.prefix}-{app.appId} &middot; {app.pipeline} &middot;{" "}
              {app.category}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <Row label="Phase" value={<PhaseBadge phase={app.phase} />} />
          <Row label="Repo" value={app.repo} />
          <Row label="Priority" value={`${app.priority}/10`} />
          {app.featured && (
            <Row label="Featured" value={<span className="text-amber-400">Yes</span>} />
          )}
          {app.deployUrl && (
            <Row
              label="URL"
              value={
                <a
                  href={app.deployUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 truncate block max-w-[250px]"
                >
                  {app.deployUrl}
                </a>
              }
            />
          )}
          {app.startedAt && (
            <Row
              label="Started"
              value={new Date(app.startedAt).toLocaleString()}
            />
          )}
          {app.completedAt && (
            <Row
              label="Completed"
              value={new Date(app.completedAt).toLocaleString()}
            />
          )}
        </div>

        {events.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">
              Event Timeline ({events.length})
            </h3>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {events.map((e: any) => (
                <div
                  key={e.id}
                  className="flex items-center gap-2 text-xs bg-gray-800/50 rounded px-2 py-1.5"
                >
                  <span className="text-gray-500 shrink-0">
                    {new Date(e.createdAt).toLocaleTimeString()}
                  </span>
                  <span className="text-gray-300">{e.eventType}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-200">{value}</span>
    </div>
  );
}

function PhaseBadge({ phase }: { phase: string }) {
  const colors: Record<string, string> = {
    Deployed: "text-emerald-400",
    Building: "text-amber-400",
    Deploying: "text-blue-400",
    Failed: "text-red-400",
    Pending: "text-gray-400",
  };
  return <span className={colors[phase] || "text-gray-400"}>{phase}</span>;
}
