import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { VersionManager } from "./VersionManager.js";
import { ConfigEditor } from "./ConfigEditor.js";
import { SectionBuilder } from "./SectionBuilder.js";

export function AdminPanel() {
  const { isAuthenticated, login, logout, error } = useAuth();
  const [tokenInput, setTokenInput] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="max-w-sm mx-auto mt-20">
        <h2 className="text-lg font-bold mb-4 text-center">Admin Login</h2>
        <div className="space-y-3">
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login(tokenInput)}
            placeholder="Enter admin token..."
            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            onClick={() => login(tokenInput)}
            className="w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm"
          >
            Authenticate
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button
          onClick={logout}
          className="text-xs px-3 py-1 rounded border border-gray-700 text-gray-400 hover:text-white"
        >
          Logout
        </button>
      </div>
      <VersionManager />
      <SectionBuilder />
      <ConfigEditor />
    </div>
  );
}
