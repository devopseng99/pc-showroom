import Redis from "ioredis";
import { db, schema } from "../db/index.js";
import { eq } from "drizzle-orm";
import { REDIS_EVENTS_CHANNEL } from "@pc-showroom/shared";
import { sseBroadcaster } from "./sse-broadcaster.js";

export class RedisSubscriber {
  private sub: Redis | null = null;

  start() {
    const redisHost =
      process.env.REDIS_HOST ||
      "redis-pc-ng-master.paperclip-v3.svc.cluster.local";
    const redisPort = parseInt(process.env.REDIS_PORT || "6379");
    const redisPassword = process.env.REDIS_PASSWORD || "";

    this.sub = new Redis({
      host: redisHost,
      port: redisPort,
      password: redisPassword,
      retryStrategy: (times) => Math.min(times * 1000, 30_000),
      maxRetriesPerRequest: null,
    });

    this.sub.on("connect", () => {
      console.log("[redis-sub] Connected to Redis");
    });

    this.sub.on("error", (err) => {
      console.error("[redis-sub] Redis error:", err.message);
    });

    this.sub.subscribe(REDIS_EVENTS_CHANNEL, (err) => {
      if (err) {
        console.error("[redis-sub] Subscribe error:", err);
      } else {
        console.log(`[redis-sub] Subscribed to ${REDIS_EVENTS_CHANNEL}`);
      }
    });

    this.sub.on("message", async (_channel, message) => {
      try {
        const event = JSON.parse(message);
        await this.handleEvent(event);
      } catch (err: any) {
        console.error("[redis-sub] Parse error:", err.message);
      }
    });
  }

  stop() {
    this.sub?.disconnect();
  }

  private async handleEvent(event: any) {
    const appId = event.appId || event.app_id;
    if (!appId) return;

    // Log the event
    await db.insert(schema.buildEvents).values({
      appId,
      eventType: event.type || event.event || "unknown",
      payload: event,
    });

    // Update app phase if present
    if (event.phase || event.status) {
      const phase = event.phase || event.status;
      const updates: any = { phase, updatedAt: new Date() };
      if (event.deployUrl || event.deploy_url) {
        updates.deployUrl = event.deployUrl || event.deploy_url;
      }
      if (event.completedAt || event.completed_at) {
        updates.completedAt = new Date(event.completedAt || event.completed_at);
      }

      await db
        .update(schema.showroomApps)
        .set(updates)
        .where(eq(schema.showroomApps.appId, appId));
    }

    // Broadcast to SSE clients
    const [app] = await db
      .select()
      .from(schema.showroomApps)
      .where(eq(schema.showroomApps.appId, appId));

    if (app) {
      sseBroadcaster.broadcast({ type: "app_update", data: app });
    }
  }
}
