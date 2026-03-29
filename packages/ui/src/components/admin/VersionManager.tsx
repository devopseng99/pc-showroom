import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUIVersions, activateUIVersion } from "../../lib/api.js";

export function VersionManager() {
  const qc = useQueryClient();
  const { data: versions, isLoading } = useQuery({
    queryKey: ["ui-versions"],
    queryFn: fetchUIVersions,
  });

  const activate = useMutation({
    mutationFn: activateUIVersion,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ui-versions"] });
      qc.invalidateQueries({ queryKey: ["ui-config"] });
    },
  });

  if (isLoading) return <div className="text-gray-500">Loading versions...</div>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">UI Versions</h2>
      <div className="space-y-2">
        {(versions || []).map((v: any) => (
          <div
            key={v.version}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              v.isActive
                ? "border-indigo-500 bg-indigo-500/5"
                : "border-gray-800 bg-gray-900"
            }`}
          >
            <div>
              <span className="font-medium text-sm">{v.name}</span>
              <span className="text-xs text-gray-500 ml-2">v{v.version}</span>
              {v.isDraft && (
                <span className="text-xs text-amber-400 ml-2">draft</span>
              )}
              {v.isActive && (
                <span className="text-xs text-indigo-400 ml-2">active</span>
              )}
            </div>
            {!v.isActive && (
              <button
                onClick={() => activate.mutate(v.version)}
                disabled={activate.isPending}
                className="text-xs px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50"
              >
                Activate
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
