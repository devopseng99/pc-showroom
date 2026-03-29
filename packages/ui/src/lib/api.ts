import { getAuthHeaders } from "../hooks/useAuth.js";

const BASE = "/api";

export async function fetchApps(params?: Record<string, string>) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  const res = await fetch(`${BASE}/apps${qs}`);
  if (!res.ok) throw new Error("Failed to fetch apps");
  return res.json();
}

export async function fetchApp(appId: number) {
  const res = await fetch(`${BASE}/apps/${appId}`);
  if (!res.ok) throw new Error("Failed to fetch app");
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${BASE}/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function fetchUIConfig() {
  const res = await fetch(`${BASE}/ui-config`);
  if (!res.ok) throw new Error("Failed to fetch UI config");
  return res.json();
}

export async function fetchUIVersions() {
  const res = await fetch(`${BASE}/ui-config/versions`);
  if (!res.ok) throw new Error("Failed to fetch versions");
  return res.json();
}

export async function createUIVersion(data: any) {
  const res = await fetch(`${BASE}/ui-config`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create version");
  return res.json();
}

export async function activateUIVersion(version: number) {
  const res = await fetch(`${BASE}/ui-config/${version}/activate`, {
    method: "POST",
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error("Failed to activate version");
  return res.json();
}

export async function toggleFeatured(appId: number) {
  const res = await fetch(`${BASE}/apps/${appId}/featured`, {
    method: "POST",
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error("Failed to toggle featured");
  return res.json();
}

export async function updateApp(appId: number, data: any) {
  const res = await fetch(`${BASE}/apps/${appId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update app");
  return res.json();
}
