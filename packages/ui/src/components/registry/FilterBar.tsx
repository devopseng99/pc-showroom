import type { RegistryProps } from "./index.js";

export function FilterBar({ config }: RegistryProps) {
  const filters = config?.filters;
  if (!filters) return null;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {filters.showSearch && (
        <input
          type="text"
          placeholder="Search apps..."
          className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 w-64"
        />
      )}
      {filters.showPipelineToggle && (
        <div className="flex gap-1 bg-gray-900 rounded-lg border border-gray-800 p-0.5">
          {["All", "v1", "tech"].map((p) => (
            <button
              key={p}
              className="px-3 py-1.5 text-xs rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
