import { useFilters } from "../../hooks/useFilters.js";
import type { RegistryProps } from "./index.js";

export function FilterBar({ apps, config }: RegistryProps) {
  const filters = config?.filters;
  const { search, pipeline, category, setSearch, setPipeline, setCategory } = useFilters();

  if (!filters) return null;

  const categories = [...new Set(apps.map((a: any) => a.category))].sort();

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {filters.showSearch && (
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search apps..."
          className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 w-64"
        />
      )}
      {filters.showPipelineToggle && (
        <div className="flex gap-0.5 bg-gray-900 rounded-lg border border-gray-800 p-0.5">
          {["", "v1", "tech"].map((p) => (
            <button
              key={p}
              onClick={() => setPipeline(p)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                pipeline === p
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {p || "All"}
            </button>
          ))}
        </div>
      )}
      {filters.showCategoryDropdown && categories.length > 0 && (
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      )}
    </div>
  );
}
