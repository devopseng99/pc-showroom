import { useQuery } from "@tanstack/react-query";
import { fetchUIConfig } from "../lib/api.js";

export function useUIConfig() {
  return useQuery({
    queryKey: ["ui-config"],
    queryFn: fetchUIConfig,
  });
}
