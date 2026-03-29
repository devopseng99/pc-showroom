import { Router } from "express";
import { db, schema } from "../db/index.js";
import { eq, like, sql, and, inArray } from "drizzle-orm";

export const appsRouter = Router();

appsRouter.get("/", async (req, res) => {
  try {
    const { pipeline, category, phase, search, featured, limit, offset } = req.query;

    let query = db.select().from(schema.showroomApps).$dynamic();
    const conditions: any[] = [];

    if (pipeline) conditions.push(eq(schema.showroomApps.pipeline, String(pipeline)));
    if (category) conditions.push(eq(schema.showroomApps.category, String(category)));
    if (phase) conditions.push(eq(schema.showroomApps.phase, String(phase)));
    if (featured === "true") conditions.push(eq(schema.showroomApps.featured, true));
    if (search) conditions.push(like(schema.showroomApps.appName, `%${search}%`));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const lim = Math.min(parseInt(String(limit || "100")), 500);
    const off = parseInt(String(offset || "0"));

    const apps = await (query as any).limit(lim).offset(off);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.showroomApps);

    res.json({ apps, total: countResult.count });
  } catch (err) {
    console.error("[apps] Error:", err);
    res.status(500).json({ error: "Failed to fetch apps" });
  }
});

appsRouter.get("/:appId", async (req, res) => {
  try {
    const appId = parseInt(req.params.appId);
    const [app] = await db
      .select()
      .from(schema.showroomApps)
      .where(eq(schema.showroomApps.appId, appId));

    if (!app) return res.status(404).json({ error: "App not found" });

    const events = await db
      .select()
      .from(schema.buildEvents)
      .where(eq(schema.buildEvents.appId, appId))
      .orderBy(schema.buildEvents.createdAt);

    res.json({ ...app, events });
  } catch (err) {
    console.error("[apps] Error:", err);
    res.status(500).json({ error: "Failed to fetch app" });
  }
});
