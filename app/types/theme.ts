import type {
  bgColors,
  brandColors,
  componentSizes,
  componentColors,
  componentShapes,
  componentStatuses,
  componentPositions,
} from "~/types/constants";

export const DEFAULT_THEMES = ["light", "dark"] as const;

export type DataTheme = (typeof DEFAULT_THEMES)[number] | string;

export interface IComponentBaseProps {
  dataTheme?: DataTheme;
}

export type ComponentBgColors = (typeof bgColors)[number];
export type ComponentSize = (typeof componentSizes)[number];
export type ComponentColor = (typeof componentColors)[number];
export type ComponentShape = (typeof componentShapes)[number];
export type ComponentBrandColors = (typeof brandColors)[number];
export type ComponentStatus = (typeof componentStatuses)[number];
export type ComponentPosition = (typeof componentPositions)[number];
