import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { appsRouter } from "./routes/apps.js";
import { statsRouter } from "./routes/stats.js";
import { healthRouter } from "./routes/health.js";
import { uiConfigRouter } from "./routes/ui-config.js";
import { eventsRouter } from "./routes/events.js";
import { CrdSyncer } from "./services/crd-syncer.js";
import { RedisSubscriber } from "./services/redis-subscriber.js";
import { sseBroadcaster } from "./services/sse-broadcaster.js";
import { runMigrations } from "./db/migrate.js";
import { requireAuth } from "./middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = parseInt(process.env.PORT || "3000");

app.use(express.json());

// Auth verification endpoint
app.post("/api/auth/verify", requireAuth, (_req, res) => {
  res.json({ valid: true });
});

// Public API routes (read-only)
app.use("/api/apps", appsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/health", healthRouter);
app.use("/api/ui-config", uiConfigRouter);
app.use("/api/events", eventsRouter);

// Serve static UI in production
const uiDist = path.resolve(__dirname, "../../ui/dist");
app.use(express.static(uiDist));
app.get("/{*path}", (_req, res) => {
  res.sendFile(path.join(uiDist, "index.html"));
});

async function start() {
  console.log("[showroom] Running migrations...");
  await runMigrations();

  console.log("[showroom] Starting CRD syncer...");
  const crdSyncer = new CrdSyncer();
  await crdSyncer.start();

  console.log("[showroom] Starting Redis subscriber...");
  const redisSub = new RedisSubscriber();
  await redisSub.start();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[showroom] Server listening on :${PORT}`);
  });

  const shutdown = () => {
    console.log("[showroom] Shutting down...");
    crdSyncer.stop();
    redisSub.stop();
    sseBroadcaster.closeAll();
    process.exit(0);
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

process.on("unhandledRejection", (err) => {
  console.error("[showroom] Unhandled rejection:", err);
});

start().catch((err) => {
  console.error("[showroom] Fatal error:", err);
  process.exit(1);
});
