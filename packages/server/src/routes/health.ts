import { Router } from "express";
import { db } from "../db/index.js";
import { sql } from "drizzle-orm";
import { sseBroadcaster } from "../services/sse-broadcaster.js";

export const healthRouter = Router();

healthRouter.get("/", async (_req, res) => {
  const checks: Record<string, string> = {};

  try {
    await db.execute(sql`SELECT 1`);
    checks.database = "ok";
  } catch {
    checks.database = "error";
  }

  checks.sseClients = String(sseBroadcaster.clientCount);

  const allOk = checks.database === "ok";
  res.status(allOk ? 200 : 503).json({
    status: allOk ? "ok" : "degraded",
    checks,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});
