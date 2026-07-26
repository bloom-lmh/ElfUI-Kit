export type DividerDirection = "horizontal" | "vertical";
export type DividerContentPosition = "left" | "center" | "right";
export type DividerBorderStyle = "solid" | "dashed" | "dotted" | "double";

export interface DividerProps {
  direction: DividerDirection;
  contentPosition: DividerContentPosition;
  borderStyle: DividerBorderStyle;
  /** @deprecated Prefer `borderStyle="dashed"`. */
  dashed: boolean;
}

export interface DividerSlots {
  default?: unknown;
}
