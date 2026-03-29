import type { ComponentType } from "react";
import { StatsBar } from "./StatsBar.js";
import { LiveBuildStrip } from "./LiveBuildStrip.js";
import { FeaturedSection } from "./FeaturedSection.js";
import { AppGrid } from "./AppGrid.js";
import { FilterBar } from "./FilterBar.js";
import { BuildProgress } from "./BuildProgress.js";

export interface RegistryProps {
  apps: any[];
  stats: any;
  config: any;
  section: any;
}

export const componentRegistry: Record<string, ComponentType<RegistryProps>> = {
  StatsBar,
  LiveBuildStrip,
  FeaturedSection,
  AppGrid,
  FilterBar,
  BuildProgress,
};
