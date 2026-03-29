import { execSync } from "child_process";
import { db, schema } from "../db/index.js";
import { eq } from "drizzle-orm";
import { CRD_SYNC_INTERVAL, CRD_NAMESPACE } from "@pc-showroom/shared";
import { sseBroadcaster } from "./sse-broadcaster.js";

interface CRDItem {
  metadata: { name: string; creationTimestamp: string };
  spec: {
    appId: number;
    appName: string;
    prefix: string;
    category?: string;
    pipeline: string;
    repo: string;
    priority?: number;
  };
  status?: {
    phase?: string;
    deployUrl?: string;
    errorMessage?: string;
    startedAt?: string;
    completedAt?: string;
    checkpoints?: Array<{ stage: string; status: string; completedAt?: string }>;
  };
}

export class CrdSyncer {
  private timer: ReturnType<typeof setInterval> | null = null;
  private syncing = false;

  start() {
    this.sync();
    this.timer = setInterval(() => this.sync(), CRD_SYNC_INTERVAL);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }

  async sync() {
    if (this.syncing) return;
    this.syncing = true;
    try {
      const raw = execSync(
        `kubectl get paperclipbuilds -n ${CRD_NAMESPACE} -o json 2>/dev/null`,
        { encoding: "utf-8", timeout: 15_000 }
      );
      const list = JSON.parse(raw);
      const items: CRDItem[] = list.items || [];

      let upserted = 0;
      for (const item of items) {
        const s = item.spec;
        const st = item.status || {};
        const values = {
          appId: s.appId,
          appName: s.appName,
          prefix: s.prefix,
          repo: s.repo,
          pipeline: s.pipeline,
          category: s.category || "Misc",
          phase: st.phase || "Pending",
          deployUrl: st.deployUrl || null,
          priority: s.priority || 5,
          startedAt: st.startedAt ? new Date(st.startedAt) : null,
          completedAt: st.completedAt ? new Date(st.completedAt) : null,
          updatedAt: new Date(),
        };

        const [existing] = await db
          .select()
          .from(schema.showroomApps)
          .where(eq(schema.showroomApps.appId, s.appId));

        if (existing) {
          // Only update if phase changed
          if (existing.phase !== values.phase || existing.deployUrl !== values.deployUrl) {
            await db
              .update(schema.showroomApps)
              .set(values)
              .where(eq(schema.showroomApps.appId, s.appId));
            sseBroadcaster.broadcast({
              type: "app_update",
              data: { ...existing, ...values },
            });
            upserted++;
          }
        } else {
          const [inserted] = await db
            .insert(schema.showroomApps)
            .values(values)
            .returning();
          sseBroadcaster.broadcast({ type: "app_update", data: inserted });
          upserted++;
        }
      }

      if (upserted > 0) {
        console.log(`[crd-syncer] Synced ${items.length} CRDs, ${upserted} changed`);
      }
    } catch (err: any) {
      console.error("[crd-syncer] Sync error:", err.message);
    } finally {
      this.syncing = false;
    }
  }
}
