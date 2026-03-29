interface AppDetailModalProps {
  app: any;
  onClose: () => void;
}

export function AppDetailModal({ app, onClose }: AppDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">{app.appName}</h2>
            <p className="text-sm text-gray-500">
              {app.prefix}-{app.appId} &middot; {app.pipeline} &middot; {app.category}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">&times;</button>
        </div>

        <div className="space-y-3">
          <Row label="Phase" value={app.phase} />
          <Row label="Repo" value={app.repo} />
          <Row label="Priority" value={app.priority} />
          {app.deployUrl && (
            <Row
              label="URL"
              value={
                <a
                  href={app.deployUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  {app.deployUrl}
                </a>
              }
            />
          )}
          {app.startedAt && <Row label="Started" value={new Date(app.startedAt).toLocaleString()} />}
          {app.completedAt && <Row label="Completed" value={new Date(app.completedAt).toLocaleString()} />}
        </div>
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
