import staticData from "./static-data.json";

const USE_STATIC = !import.meta.env.VITE_API_URL;
const BASE = import.meta.env.VITE_API_URL || "/api";

async function fetchJSON(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

export async function fetchApps(params?: Record<string, string>) {
  if (USE_STATIC) {
    return { apps: staticData.apps, total: staticData.apps.length };
  }
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return fetchJSON(`${BASE}/apps${qs}`);
}

export async function fetchApp(appId: number) {
  if (USE_STATIC) {
    const app = staticData.apps.find((a: any) => a.appId === appId);
    if (!app) throw new Error("App not found");
    return { ...app, events: [] };
  }
  return fetchJSON(`${BASE}/apps/${appId}`);
}

export async function fetchStats() {
  if (USE_STATIC) {
    return staticData.stats;
  }
  return fetchJSON(`${BASE}/stats`);
}

export async function fetchUIConfig() {
  if (USE_STATIC) {
    return staticData.uiConfig;
  }
  return fetchJSON(`${BASE}/ui-config`);
}

export async function fetchUIVersions() {
  if (USE_STATIC) {
    return [staticData.uiConfig];
  }
  return fetchJSON(`${BASE}/ui-config/versions`);
}

export async function createUIVersion(data: any) {
  const res = await fetch(`${BASE}/ui-config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create version");
  return res.json();
}

export async function activateUIVersion(version: number) {
  const res = await fetch(`${BASE}/ui-config/${version}/activate`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to activate version");
  return res.json();
}
