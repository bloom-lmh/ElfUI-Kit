export type SpaceDirection = "horizontal" | "vertical";

export type SpaceAlignment = "stretch" | "flex-start" | "flex-end" | "center" | "baseline";

export type SpacePresetSize = "small" | "default" | "large";

export type SpaceSize = SpacePresetSize | string | number | [number, number];

export interface SpaceProps {
  direction: SpaceDirection;
  alignment: SpaceAlignment;
  size: SpaceSize;
  spacer: string | number;
  wrap: boolean;
  fill: boolean;
  fillRatio: number;
}

export interface SpaceSlots {
  default?: unknown;
}
