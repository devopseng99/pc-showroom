import { useQuery } from "@tanstack/react-query";
import { fetchApps, fetchStats } from "../lib/api.js";

export function useApps(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["apps", params],
    queryFn: () => fetchApps(params),
  });
}

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    refetchInterval: 30_000,
  });
}
