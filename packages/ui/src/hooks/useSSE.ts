import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createSSEClient } from "../lib/sse-client.js";

export function useSSE() {
  const qc = useQueryClient();

  useEffect(() => {
    const client = createSSEClient((event) => {
      if (event.type === "app_update") {
        qc.invalidateQueries({ queryKey: ["apps"] });
        qc.invalidateQueries({ queryKey: ["stats"] });
      } else if (event.type === "config_update") {
        qc.invalidateQueries({ queryKey: ["ui-config"] });
      }
    });

    return () => client.close();
  }, [qc]);
}
