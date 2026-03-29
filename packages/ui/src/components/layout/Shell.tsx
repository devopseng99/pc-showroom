import type { ReactNode } from "react";

interface ShellProps {
  children: ReactNode;
  currentView: "showroom" | "admin";
  onViewChange: (view: "showroom" | "admin") => void;
}

export function Shell({ children, currentView, onViewChange }: ShellProps) {
  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Paperclip Showroom
              </span>
              <span className="text-xs text-gray-500 border border-gray-700 rounded px-1.5 py-0.5">
                AGUI
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => onViewChange("showroom")}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  currentView === "showroom"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                Gallery
              </button>
              <button
                onClick={() => onViewChange("admin")}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  currentView === "admin"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
