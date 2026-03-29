import { Router } from "express";
import { db, schema } from "../db/index.js";
import { sql } from "drizzle-orm";

export const statsRouter = Router();

statsRouter.get("/", async (_req, res) => {
  try {
    const [total] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.showroomApps);

    const phaseRows = await db
      .select({
        phase: schema.showroomApps.phase,
        count: sql<number>`count(*)::int`,
      })
      .from(schema.showroomApps)
      .groupBy(schema.showroomApps.phase);

    const pipelineRows = await db
      .select({
        pipeline: schema.showroomApps.pipeline,
        count: sql<number>`count(*)::int`,
      })
      .from(schema.showroomApps)
      .groupBy(schema.showroomApps.pipeline);

    const categoryRows = await db
      .select({
        category: schema.showroomApps.category,
        count: sql<number>`count(*)::int`,
      })
      .from(schema.showroomApps)
      .groupBy(schema.showroomApps.category);

    const phaseMap = Object.fromEntries(phaseRows.map((r) => [r.phase, r.count]));
    const stats = {
      total: total.count,
      deployed: phaseMap["Deployed"] || 0,
      building: (phaseMap["Building"] || 0) + (phaseMap["Deploying"] || 0),
      failed: phaseMap["Failed"] || 0,
      pending: (phaseMap["Pending"] || 0) + (phaseMap["Queued"] || 0),
      byPipeline: Object.fromEntries(pipelineRows.map((r) => [r.pipeline, r.count])),
      byCategory: Object.fromEntries(categoryRows.map((r) => [r.category, r.count])),
    };

    res.json(stats);
  } catch (err) {
    console.error("[stats] Error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});
