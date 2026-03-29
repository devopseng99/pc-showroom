import { Router } from "express";
import { db, schema } from "../db/index.js";
import { eq, like, sql, and, inArray } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.js";

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

// Toggle featured (auth required)
appsRouter.post("/:appId/featured", requireAuth, async (req, res) => {
  try {
    const appId = parseInt(req.params.appId);
    const [app] = await db
      .select()
      .from(schema.showroomApps)
      .where(eq(schema.showroomApps.appId, appId));

    if (!app) return res.status(404).json({ error: "App not found" });

    const [updated] = await db
      .update(schema.showroomApps)
      .set({ featured: !app.featured, updatedAt: new Date() })
      .where(eq(schema.showroomApps.appId, appId))
      .returning();

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update" });
  }
});

// Update app fields (auth required)
appsRouter.patch("/:appId", requireAuth, async (req, res) => {
  try {
    const appId = parseInt(req.params.appId);
    const allowed = ["category", "featured", "priority", "screenshotUrl"];
    const updates: any = { updatedAt: new Date() };
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const [updated] = await db
      .update(schema.showroomApps)
      .set(updates)
      .where(eq(schema.showroomApps.appId, appId))
      .returning();

    if (!updated) return res.status(404).json({ error: "App not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update" });
  }
});

// Bulk update categories (auth required)
appsRouter.post("/bulk-categorize", requireAuth, async (req, res) => {
  try {
    const { updates } = req.body; // [{ appId, category }]
    let count = 0;
    for (const u of updates) {
      await db
        .update(schema.showroomApps)
        .set({ category: u.category, updatedAt: new Date() })
        .where(eq(schema.showroomApps.appId, u.appId));
      count++;
    }
    res.json({ updated: count });
  } catch (err) {
    res.status(500).json({ error: "Failed to bulk categorize" });
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
