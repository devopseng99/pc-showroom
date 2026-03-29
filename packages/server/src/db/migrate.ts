import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.js";
import { DEFAULT_UI_CONFIG } from "@pc-showroom/shared";

export async function runMigrations() {
  const connectionString =
    process.env.DATABASE_URL || "postgres://showroom:showroom@localhost:5432/showroom";
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema });

  // Create tables directly (no migration files needed)
  await createTablesDirectly(client);

  // Seed default UI config if none exists
  const existing = await db.select().from(schema.uiVersions).limit(1);
  if (existing.length === 0) {
    console.log("[migrate] Seeding default UI config...");
    await db.insert(schema.uiVersions).values({
      name: "Default Dark Theme",
      config: DEFAULT_UI_CONFIG,
      isActive: true,
      isDraft: false,
      notes: "Initial default configuration",
    });
  }

  // Seed component registry
  const existingComponents = await db.select().from(schema.uiComponents).limit(1);
  if (existingComponents.length === 0) {
    console.log("[migrate] Seeding component registry...");
    await db.insert(schema.uiComponents).values([
      { componentKey: "StatsBar", propsSchema: {}, defaultProps: { metrics: ["total", "deployed", "building", "failed"] } },
      { componentKey: "LiveBuildStrip", propsSchema: {}, defaultProps: {} },
      { componentKey: "FeaturedSection", propsSchema: {}, defaultProps: { maxItems: 6 } },
      { componentKey: "AppGrid", propsSchema: {}, defaultProps: { cardTemplate: "default" } },
      { componentKey: "AppCard", propsSchema: {}, defaultProps: {} },
      { componentKey: "FilterBar", propsSchema: {}, defaultProps: {} },
      { componentKey: "BuildProgress", propsSchema: {}, defaultProps: {} },
      { componentKey: "AppDetailModal", propsSchema: {}, defaultProps: {} },
    ]);
  }

  await client.end();
}

async function createTablesDirectly(client: postgres.Sql) {
  await client`
    CREATE TABLE IF NOT EXISTS showroom_apps (
      id SERIAL PRIMARY KEY,
      app_id INTEGER NOT NULL UNIQUE,
      app_name TEXT NOT NULL,
      prefix TEXT NOT NULL,
      repo TEXT NOT NULL,
      pipeline TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Misc',
      phase TEXT NOT NULL DEFAULT 'Pending',
      deploy_url TEXT,
      screenshot_url TEXT,
      featured BOOLEAN NOT NULL DEFAULT false,
      priority INTEGER NOT NULL DEFAULT 5,
      started_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await client`
    CREATE TABLE IF NOT EXISTS ui_versions (
      version SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      config JSONB NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT false,
      is_draft BOOLEAN NOT NULL DEFAULT false,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await client`
    CREATE TABLE IF NOT EXISTS ui_components (
      id SERIAL PRIMARY KEY,
      component_key TEXT NOT NULL UNIQUE,
      props_schema JSONB NOT NULL DEFAULT '{}',
      default_props JSONB NOT NULL DEFAULT '{}'
    )
  `;
  await client`
    CREATE TABLE IF NOT EXISTS build_events (
      id SERIAL PRIMARY KEY,
      app_id INTEGER NOT NULL,
      event_type TEXT NOT NULL,
      payload JSONB NOT NULL DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log("[migrate] Tables created directly");
}
