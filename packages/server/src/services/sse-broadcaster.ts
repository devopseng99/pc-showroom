import type { Request, Response } from "express";
import { SSE_HEARTBEAT_INTERVAL } from "@pc-showroom/shared";
import type { SSEEvent } from "@pc-showroom/shared";

class SSEBroadcaster {
  private clients = new Set<Response>();
  private heartbeatTimer: ReturnType<typeof setInterval>;

  constructor() {
    this.heartbeatTimer = setInterval(() => {
      this.broadcast({ type: "heartbeat", data: { time: Date.now() } });
    }, SSE_HEARTBEAT_INTERVAL);
  }

  addClient(req: Request, res: Response) {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });
    res.write(`data: ${JSON.stringify({ type: "connected", data: {} })}\n\n`);

    this.clients.add(res);
    console.log(`[sse] Client connected (${this.clients.size} total)`);

    req.on("close", () => {
      this.clients.delete(res);
      console.log(`[sse] Client disconnected (${this.clients.size} total)`);
    });
  }

  broadcast(event: SSEEvent) {
    const data = `data: ${JSON.stringify(event)}\n\n`;
    for (const client of this.clients) {
      try {
        client.write(data);
      } catch {
        this.clients.delete(client);
      }
    }
  }

  closeAll() {
    clearInterval(this.heartbeatTimer);
    for (const client of this.clients) {
      try { client.end(); } catch {}
    }
    this.clients.clear();
  }
}

export const sseBroadcaster = new SSEBroadcaster();
