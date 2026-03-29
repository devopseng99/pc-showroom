import { z } from "zod";

export const appPhaseSchema = z.enum([
  "Pending",
  "Queued",
  "Onboarding",
  "Building",
  "Deploying",
  "Deployed",
  "Failed",
]);

export const uiSectionSchema = z.object({
  component: z.string(),
  props: z.record(z.unknown()).optional(),
  filter: z.record(z.unknown()).optional(),
  groupBy: z.string().optional(),
  cardTemplate: z.string().optional(),
  collapsible: z.boolean().optional(),
  maxItems: z.number().optional(),
});

export const uiConfigSchema = z.object({
  theme: z.object({
    mode: z.enum(["dark", "light"]),
    primaryColor: z.string(),
    gridColumns: z.object({
      sm: z.number(),
      md: z.number(),
      lg: z.number(),
      xl: z.number(),
    }),
  }),
  header: z.object({
    title: z.string(),
    showStats: z.boolean(),
  }),
  sections: z.array(uiSectionSchema),
  filters: z.object({
    showSearch: z.boolean(),
    showPipelineToggle: z.boolean(),
    showCategoryDropdown: z.boolean(),
  }),
});

export const createUIVersionSchema = z.object({
  name: z.string().min(1),
  config: uiConfigSchema,
  isDraft: z.boolean().default(false),
  notes: z.string().optional(),
});
