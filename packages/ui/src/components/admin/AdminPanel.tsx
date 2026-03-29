import { VersionManager } from "./VersionManager.js";
import { ConfigEditor } from "./ConfigEditor.js";

export function AdminPanel() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <VersionManager />
      <ConfigEditor />
    </div>
  );
}
