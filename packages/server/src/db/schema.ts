import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";

export const showroomApps = pgTable("showroom_apps", {
  id: serial("id").primaryKey(),
  appId: integer("app_id").notNull().unique(),
  appName: text("app_name").notNull(),
  prefix: text("prefix").notNull(),
  repo: text("repo").notNull(),
  pipeline: text("pipeline").notNull(),
  category: text("category").notNull().default("Misc"),
  phase: text("phase").notNull().default("Pending"),
  deployUrl: text("deploy_url"),
  screenshotUrl: text("screenshot_url"),
  featured: boolean("featured").notNull().default(false),
  priority: integer("priority").notNull().default(5),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const uiVersions = pgTable("ui_versions", {
  version: serial("version").primaryKey(),
  name: text("name").notNull(),
  config: jsonb("config").notNull(),
  isActive: boolean("is_active").notNull().default(false),
  isDraft: boolean("is_draft").notNull().default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const uiComponents = pgTable("ui_components", {
  id: serial("id").primaryKey(),
  componentKey: text("component_key").notNull().unique(),
  propsSchema: jsonb("props_schema").notNull().default({}),
  defaultProps: jsonb("default_props").notNull().default({}),
});

export const buildEvents = pgTable("build_events", {
  id: serial("id").primaryKey(),
  appId: integer("app_id").notNull(),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
