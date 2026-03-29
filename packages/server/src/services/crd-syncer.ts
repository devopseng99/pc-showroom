import * as k8s from "@kubernetes/client-node";
import { db, schema } from "../db/index.js";
import { eq } from "drizzle-orm";
import { CRD_NAMESPACE, CRD_GROUP, CRD_VERSION, CRD_PLURAL, CRD_SYNC_INTERVAL } from "@pc-showroom/shared";
import { sseBroadcaster } from "./sse-broadcaster.js";

interface CRDSpec {
  appId: number;
  appName: string;
  prefix: string;
  category?: string;
  pipeline: string;
  repo: string;
  priority?: number;
}

interface CRDStatus {
  phase?: string;
  deployUrl?: string;
  startedAt?: string;
  completedAt?: string;
}

export class CrdSyncer {
  private kc: k8s.KubeConfig;
  private customApi: k8s.CustomObjectsApi;
  private watcher: any = null;
  private watchRetryTimer: ReturnType<typeof setTimeout> | null = null;
  private fallbackTimer: ReturnType<typeof setInterval> | null = null;
  private stopped = false;

  constructor() {
    this.kc = new k8s.KubeConfig();
    this.kc.loadFromCluster();
    this.customApi = this.kc.makeApiClient(k8s.CustomObjectsApi);
  }

  async start() {
    // Initial bulk sync
    await this.bulkSync();
    // Start watch for real-time updates
    this.startWatch();
    // Fallback poll every 60s in case watch drops silently
    this.fallbackTimer = setInterval(() => this.bulkSync(), CRD_SYNC_INTERVAL * 2);
  }

  stop() {
    this.stopped = true;
    if (this.watcher) {
      try { this.watcher.abort(); } catch {}
    }
    if (this.watchRetryTimer) clearTimeout(this.watchRetryTimer);
    if (this.fallbackTimer) clearInterval(this.fallbackTimer);
  }

  private async startWatch() {
    if (this.stopped) return;

    const watch = new k8s.Watch(this.kc);
    const path = `/apis/${CRD_GROUP}/${CRD_VERSION}/namespaces/${CRD_NAMESPACE}/${CRD_PLURAL}`;

    try {
      this.watcher = await watch.watch(
        path,
        {},
        (type: string, obj: any) => {
          this.handleWatchEvent(type, obj).catch((err) =>
            console.error("[crd-watch] Event handler error:", err.message)
          );
        },
        (err: any) => {
          if (this.stopped) return;
          console.log("[crd-watch] Watch ended:", err?.message || "connection closed");
          this.scheduleWatchRetry();
        }
      );
      console.log("[crd-watch] Watching PaperclipBuilds in", CRD_NAMESPACE);
    } catch (err: any) {
      console.error("[crd-watch] Failed to start watch:", err.message);
      this.scheduleWatchRetry();
    }
  }

  private scheduleWatchRetry() {
    if (this.stopped) return;
    this.watchRetryTimer = setTimeout(() => this.startWatch(), 5000);
  }

  private async handleWatchEvent(type: string, obj: any) {
    if (type === "DELETED") return; // We keep records
    const spec: CRDSpec = obj.spec;
    const status: CRDStatus = obj.status || {};

    const values = {
      appId: spec.appId,
      appName: spec.appName,
      prefix: spec.prefix,
      repo: spec.repo,
      pipeline: spec.pipeline,
      category: spec.category || "Misc",
      phase: status.phase || "Pending",
      deployUrl: status.deployUrl || null,
      priority: spec.priority || 5,
      startedAt: status.startedAt ? new Date(status.startedAt) : null,
      completedAt: status.completedAt ? new Date(status.completedAt) : null,
      updatedAt: new Date(),
    };

    const [existing] = await db
      .select()
      .from(schema.showroomApps)
      .where(eq(schema.showroomApps.appId, spec.appId));

    if (existing) {
      if (existing.phase !== values.phase || existing.deployUrl !== values.deployUrl) {
        await db
          .update(schema.showroomApps)
          .set(values)
          .where(eq(schema.showroomApps.appId, spec.appId));
        // Preserve user-set category if not "Misc"
        const merged = { ...existing, ...values };
        if (existing.category !== "Misc") merged.category = existing.category;
        sseBroadcaster.broadcast({ type: "app_update", data: merged });
        console.log(`[crd-watch] ${type} ${spec.appName}: ${existing.phase} -> ${values.phase}`);
      }
    } else {
      const [inserted] = await db
        .insert(schema.showroomApps)
        .values(values)
        .returning();
      sseBroadcaster.broadcast({ type: "app_update", data: inserted });
      console.log(`[crd-watch] ${type} NEW ${spec.appName}: ${values.phase}`);
    }
  }

  private async bulkSync() {
    try {
      const res = await this.customApi.listNamespacedCustomObject({
        group: CRD_GROUP,
        version: CRD_VERSION,
        namespace: CRD_NAMESPACE,
        plural: CRD_PLURAL,
      });
      const items: any[] = (res as any).items || [];

      let upserted = 0;
      for (const item of items) {
        const spec: CRDSpec = item.spec;
        const status: CRDStatus = item.status || {};

        const values = {
          appId: spec.appId,
          appName: spec.appName,
          prefix: spec.prefix,
          repo: spec.repo,
          pipeline: spec.pipeline,
          category: spec.category || "Misc",
          phase: status.phase || "Pending",
          deployUrl: status.deployUrl || null,
          priority: spec.priority || 5,
          startedAt: status.startedAt ? new Date(status.startedAt) : null,
          completedAt: status.completedAt ? new Date(status.completedAt) : null,
          updatedAt: new Date(),
        };

        const [existing] = await db
          .select()
          .from(schema.showroomApps)
          .where(eq(schema.showroomApps.appId, spec.appId));

        if (existing) {
          if (existing.phase !== values.phase || existing.deployUrl !== values.deployUrl) {
            await db
              .update(schema.showroomApps)
              .set(values)
              .where(eq(schema.showroomApps.appId, spec.appId));
            upserted++;
          }
        } else {
          await db.insert(schema.showroomApps).values(values);
          upserted++;
        }
      }

      if (upserted > 0) {
        console.log(`[crd-sync] Bulk synced ${items.length} CRDs, ${upserted} changed`);
      }
    } catch (err: any) {
      console.error("[crd-sync] Bulk sync error:", err.message?.slice(0, 200));
    }
  }
}
