export interface ShowroomApp {
  id: number;
  appId: number;
  appName: string;
  prefix: string;
  repo: string;
  pipeline: "v1" | "tech";
  category: string;
  phase: AppPhase;
  deployUrl: string | null;
  screenshotUrl: string | null;
  featured: boolean;
  priority: number;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AppPhase =
  | "Pending"
  | "Queued"
  | "Onboarding"
  | "Building"
  | "Deploying"
  | "Deployed"
  | "Failed";

export interface UIVersion {
  version: number;
  name: string;
  config: UIConfig;
  isActive: boolean;
  isDraft: boolean;
  notes: string | null;
  createdAt: string;
}

export interface UIConfig {
  theme: {
    mode: "dark" | "light";
    primaryColor: string;
    gridColumns: { sm: number; md: number; lg: number; xl: number };
  };
  header: {
    title: string;
    showStats: boolean;
  };
  sections: UISection[];
  filters: {
    showSearch: boolean;
    showPipelineToggle: boolean;
    showCategoryDropdown: boolean;
  };
}

export interface UISection {
  component: string;
  props?: Record<string, unknown>;
  filter?: Record<string, unknown>;
  groupBy?: string;
  cardTemplate?: string;
  collapsible?: boolean;
  maxItems?: number;
}

export interface UIComponent {
  componentKey: string;
  propsSchema: Record<string, unknown>;
  defaultProps: Record<string, unknown>;
}

export interface BuildEvent {
  id: number;
  appId: number;
  eventType: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface AppStats {
  total: number;
  deployed: number;
  building: number;
  failed: number;
  pending: number;
  byPipeline: Record<string, number>;
  byCategory: Record<string, number>;
}

export interface SSEEvent {
  type: "app_update" | "config_update" | "heartbeat";
  data: unknown;
}
