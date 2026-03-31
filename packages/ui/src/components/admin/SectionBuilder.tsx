import { useState } from "react";
import { useUIConfig } from "../../hooks/useUIConfig.js";

const AVAILABLE_COMPONENTS = [
  { key: "StatsBar", label: "Stats Bar", description: "Key metrics row" },
  { key: "LiveBuildStrip", label: "Live Build Strip", description: "Active builds ticker" },
  { key: "FeaturedSection", label: "Featured Section", description: "Pinned/highlighted apps" },
  { key: "AppGrid", label: "App Grid", description: "Main app gallery grid" },
  { key: "BuildProgress", label: "Build Progress", description: "Active build progress bars" },
  { key: "FilterBar", label: "Filter Bar", description: "Search and filter controls" },
];

const GROUP_BY_OPTIONS = ["", "pipeline", "category", "phase"];
const CARD_TEMPLATES = ["default", "compact"];

interface SectionConfig {
  component: string;
  props?: Record<string, any>;
  filter?: Record<string, any>;
  groupBy?: string;
  cardTemplate?: string;
  collapsible?: boolean;
  maxItems?: number;
}

export function SectionBuilder() {
  const { data: currentConfig } = useUIConfig();
  const sections: SectionConfig[] = currentConfig?.config?.sections || [];
  const [editSections, setEditSections] = useState<SectionConfig[] | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const working = editSections || sections;

  const startEdit = () => setEditSections([...sections]);
  const cancel = () => setEditSections(null);

  const moveSection = (idx: number, dir: -1 | 1) => {
    if (!editSections) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= editSections.length) return;
    const copy = [...editSections];
    [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
    setEditSections(copy);
  };

  const removeSection = (idx: number) => {
    if (!editSections) return;
    setEditSections(editSections.filter((_, i) => i !== idx));
  };

  const addSection = (componentKey: string) => {
    const newSection: SectionConfig = { component: componentKey };
    if (componentKey === "AppGrid") {
      newSection.groupBy = "pipeline";
      newSection.cardTemplate = "default";
    }
    if (componentKey === "FeaturedSection") {
      newSection.filter = { featured: true };
      newSection.maxItems = 6;
    }
    if (componentKey === "LiveBuildStrip") {
      newSection.filter = { phase: ["Building"] };
    }
    if (componentKey === "StatsBar") {
      newSection.props = { metrics: ["total", "deployed", "deploying", "building", "pending", "failed"] };
    }
    setEditSections([...(editSections || sections), newSection]);
    setShowAdd(false);
  };

  const updateSection = (idx: number, updates: Partial<SectionConfig>) => {
    if (!editSections) return;
    const copy = [...editSections];
    copy[idx] = { ...copy[idx], ...updates };
    setEditSections(copy);
  };

  const getExportJSON = () => {
    const config = currentConfig?.config || {};
    return JSON.stringify({ ...config, sections: editSections }, null, 2);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Layout Builder</h2>
        {!editSections ? (
          <button onClick={startEdit} className="text-xs px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white">
            Edit Layout
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={cancel} className="text-xs px-3 py-1.5 rounded border border-gray-700 text-gray-400 hover:text-white">
              Cancel
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(getExportJSON());
              }}
              className="text-xs px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              Copy Config JSON
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {working.map((section, idx) => (
          <div
            key={`${section.component}-${idx}`}
            className={`border rounded-lg p-3 ${
              editSections
                ? "border-indigo-500/30 bg-gray-900"
                : "border-gray-800 bg-gray-900/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-5">{idx + 1}</span>
                <span className="text-sm font-medium">{section.component}</span>
                {section.groupBy && (
                  <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">
                    group: {section.groupBy}
                  </span>
                )}
                {section.cardTemplate && (
                  <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">
                    {section.cardTemplate}
                  </span>
                )}
                {section.collapsible && (
                  <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">
                    collapsible
                  </span>
                )}
              </div>
              {editSections && (
                <div className="flex gap-1">
                  <button onClick={() => moveSection(idx, -1)} disabled={idx === 0} className="text-gray-500 hover:text-white disabled:opacity-30 px-1">&#9650;</button>
                  <button onClick={() => moveSection(idx, 1)} disabled={idx === working.length - 1} className="text-gray-500 hover:text-white disabled:opacity-30 px-1">&#9660;</button>
                  <button onClick={() => removeSection(idx)} className="text-red-500/50 hover:text-red-400 px-1">&times;</button>
                </div>
              )}
            </div>

            {editSections && section.component === "AppGrid" && (
              <div className="flex gap-3 mt-2 text-xs">
                <label className="flex items-center gap-1 text-gray-400">
                  Group by:
                  <select
                    value={section.groupBy || ""}
                    onChange={(e) => updateSection(idx, { groupBy: e.target.value || undefined })}
                    className="bg-gray-800 border border-gray-700 rounded px-1.5 py-0.5 text-gray-200"
                  >
                    {GROUP_BY_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o || "none"}</option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-1 text-gray-400">
                  Card:
                  <select
                    value={section.cardTemplate || "default"}
                    onChange={(e) => updateSection(idx, { cardTemplate: e.target.value })}
                    className="bg-gray-800 border border-gray-700 rounded px-1.5 py-0.5 text-gray-200"
                  >
                    {CARD_TEMPLATES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-1.5 text-gray-400">
                  <input
                    type="checkbox"
                    checked={section.collapsible || false}
                    onChange={(e) => updateSection(idx, { collapsible: e.target.checked })}
                    className="rounded"
                  />
                  Collapsible
                </label>
              </div>
            )}

            {editSections && section.component === "FeaturedSection" && (
              <div className="flex gap-3 mt-2 text-xs">
                <label className="flex items-center gap-1 text-gray-400">
                  Max items:
                  <input
                    type="number"
                    value={section.maxItems || 6}
                    onChange={(e) => updateSection(idx, { maxItems: parseInt(e.target.value) })}
                    className="w-14 bg-gray-800 border border-gray-700 rounded px-1.5 py-0.5 text-gray-200"
                  />
                </label>
              </div>
            )}
          </div>
        ))}
      </div>

      {editSections && (
        <div className="mt-3">
          {showAdd ? (
            <div className="border border-dashed border-gray-700 rounded-lg p-3 space-y-1.5">
              <p className="text-xs text-gray-500 mb-2">Add a section:</p>
              {AVAILABLE_COMPONENTS.map((c) => (
                <button
                  key={c.key}
                  onClick={() => addSection(c.key)}
                  className="flex items-center justify-between w-full text-left px-3 py-2 rounded hover:bg-gray-800 text-sm"
                >
                  <span className="font-medium">{c.label}</span>
                  <span className="text-xs text-gray-500">{c.description}</span>
                </button>
              ))}
              <button onClick={() => setShowAdd(false)} className="text-xs text-gray-500 mt-2">Cancel</button>
            </div>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="w-full border border-dashed border-gray-700 rounded-lg py-2 text-sm text-gray-500 hover:text-white hover:border-gray-600"
            >
              + Add Section
            </button>
          )}
        </div>
      )}
    </div>
  );
}
