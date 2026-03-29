const PHASE_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  Deployed: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  Building: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400 animate-pulse" },
  Deploying: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400 animate-pulse" },
  Failed: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
  Pending: { bg: "bg-gray-500/10", text: "text-gray-400", dot: "bg-gray-400" },
  Queued: { bg: "bg-gray-500/10", text: "text-gray-400", dot: "bg-gray-400" },
  Onboarding: { bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-400 animate-pulse" },
};

interface AppCardProps {
  app: any;
  compact?: boolean;
  onClick?: () => void;
}

export function AppCard({ app, compact, onClick }: AppCardProps) {
  const style = PHASE_STYLES[app.phase] || PHASE_STYLES.Pending;

  if (compact) {
    return (
      <div
        onClick={onClick}
        className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-colors cursor-pointer"
      >
        <div className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium truncate">{app.appName}</div>
          <div className="text-xs text-gray-500">{app.prefix}-{app.appId}</div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
          {app.phase}
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-indigo-500/50 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm truncate group-hover:text-indigo-400 transition-colors">
            {app.appName}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {app.prefix}-{app.appId} &middot; {app.pipeline}
          </p>
        </div>
        <span
          className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full shrink-0 ml-2 ${style.bg} ${style.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          {app.phase}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="truncate">{app.category}</span>
        {app.deployUrl && (
          <a
            href={app.deployUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-indigo-400 hover:text-indigo-300 shrink-0"
          >
            Visit
          </a>
        )}
      </div>

      {app.repo && (
        <div className="mt-2 text-xs text-gray-600 truncate">
          {app.repo}
        </div>
      )}
    </div>
  );
}
