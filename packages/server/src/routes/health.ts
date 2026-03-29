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

  const mem = process.memoryUsage();
  const memory = {
    rss: `${Math.round(mem.rss / 1024 / 1024)}Mi`,
    heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)}Mi`,
    heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)}Mi`,
    external: `${Math.round(mem.external / 1024 / 1024)}Mi`,
  };

  const allOk = checks.database === "ok";
  res.status(allOk ? 200 : 503).json({
    status: allOk ? "ok" : "degraded",
    checks,
    memory,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});
