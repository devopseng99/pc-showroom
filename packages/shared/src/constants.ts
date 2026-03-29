export const REDIS_EVENTS_CHANNEL = "pipeline:events";
export const SSE_HEARTBEAT_INTERVAL = 15_000;
export const CRD_SYNC_INTERVAL = 30_000;
export const CRD_NAMESPACE = "paperclip-v3";
export const CRD_GROUP = "paperclip.istayintek.com";
export const CRD_VERSION = "v1alpha1";
export const CRD_PLURAL = "paperclipbuilds";

export const DEFAULT_UI_CONFIG = {
  theme: {
    mode: "dark" as const,
    primaryColor: "#6366f1",
    gridColumns: { sm: 1, md: 2, lg: 3, xl: 4 },
  },
  header: {
    title: "Paperclip Showroom",
    showStats: true,
  },
  sections: [
    {
      component: "StatsBar",
      props: { metrics: ["total", "deployed", "building", "failed"] },
    },
    {
      component: "LiveBuildStrip",
      filter: { phase: ["Building", "Deploying"] },
    },
    {
      component: "FeaturedSection",
      filter: { featured: true },
      maxItems: 6,
    },
    {
      component: "AppGrid",
      groupBy: "pipeline",
      cardTemplate: "default",
    },
    {
      component: "AppGrid",
      groupBy: "category",
      cardTemplate: "compact",
      collapsible: true,
    },
  ],
  filters: {
    showSearch: true,
    showPipelineToggle: true,
    showCategoryDropdown: true,
  },
};
