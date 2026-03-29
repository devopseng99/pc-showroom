import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUIVersion } from "../../lib/api.js";
import { useUIConfig } from "../../hooks/useUIConfig.js";

export function ConfigEditor() {
  const qc = useQueryClient();
  const { data: currentConfig } = useUIConfig();
  const [name, setName] = useState("");
  const [json, setJson] = useState("");
  const [error, setError] = useState("");

  const create = useMutation({
    mutationFn: createUIVersion,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ui-versions"] });
      setName("");
      setJson("");
      setError("");
    },
    onError: (err: any) => setError(err.message),
  });

  const loadCurrent = () => {
    if (currentConfig?.config) {
      setJson(JSON.stringify(currentConfig.config, null, 2));
    }
  };

  const handleSubmit = () => {
    try {
      const config = JSON.parse(json);
      create.mutate({ name, config, isDraft: true });
    } catch {
      setError("Invalid JSON");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Create New Version</h2>
      <div className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Version name (e.g. 'Dark Compact Theme')"
          className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500"
        />
        <div className="flex gap-2">
          <button
            onClick={loadCurrent}
            className="text-xs px-3 py-1 rounded border border-gray-700 text-gray-400 hover:text-white"
          >
            Load Current Config
          </button>
        </div>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          placeholder="Paste UI config JSON..."
          rows={12}
          className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 font-mono placeholder-gray-600 focus:outline-none focus:border-indigo-500"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={!name || !json || create.isPending}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm disabled:opacity-50"
        >
          {create.isPending ? "Creating..." : "Create Draft Version"}
        </button>
      </div>
    </div>
  );
}
