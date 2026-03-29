import { Router } from "express";
import { db, schema } from "../db/index.js";
import { eq, desc } from "drizzle-orm";
import { createUIVersionSchema } from "@pc-showroom/shared";
import { sseBroadcaster } from "../services/sse-broadcaster.js";
import { requireAuth } from "../middleware/auth.js";

export const uiConfigRouter = Router();

// Get active config
uiConfigRouter.get("/", async (_req, res) => {
  try {
    const [active] = await db
      .select()
      .from(schema.uiVersions)
      .where(eq(schema.uiVersions.isActive, true))
      .limit(1);

    if (!active) return res.status(404).json({ error: "No active config" });
    res.json(active);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch config" });
  }
});

// List all versions
uiConfigRouter.get("/versions", async (_req, res) => {
  try {
    const versions = await db
      .select()
      .from(schema.uiVersions)
      .orderBy(desc(schema.uiVersions.version));
    res.json(versions);
  } catch (err) {
    res.status(500).json({ error: "Failed to list versions" });
  }
});

// Create new version (auth required)
uiConfigRouter.post("/", requireAuth, async (req, res) => {
  try {
    const parsed = createUIVersionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });

    const [version] = await db
      .insert(schema.uiVersions)
      .values(parsed.data)
      .returning();

    res.status(201).json(version);
  } catch (err) {
    res.status(500).json({ error: "Failed to create version" });
  }
});

// Activate a version (auth required)
uiConfigRouter.post("/:version/activate", requireAuth, async (req, res) => {
  try {
    const ver = parseInt(req.params.version);

    // Deactivate all
    await db
      .update(schema.uiVersions)
      .set({ isActive: false })
      .where(eq(schema.uiVersions.isActive, true));

    // Activate target
    const [activated] = await db
      .update(schema.uiVersions)
      .set({ isActive: true, isDraft: false })
      .where(eq(schema.uiVersions.version, ver))
      .returning();

    if (!activated) return res.status(404).json({ error: "Version not found" });

    sseBroadcaster.broadcast({ type: "config_update", data: activated });
    res.json(activated);
  } catch (err) {
    res.status(500).json({ error: "Failed to activate version" });
  }
});
