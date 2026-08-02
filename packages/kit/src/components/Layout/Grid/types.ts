// elf-grid + elf-grid-item 类型定义

export type GridGap = "0" | "xs" | "sm" | "md" | "lg" | "xl";

export type GridSpacing = GridGap | string | number;
export type GridJustify =
  "start" | "end" | "center" | "space-between" | "space-around" | "space-evenly";
export type GridAlign = "stretch" | "start" | "center" | "end";

export interface GridProps {
  columns: number;
  gap: GridSpacing;
  /** Element Plus Row compatibility alias for gap. */
  gutter: GridSpacing | "";
  justify: GridJustify;
  align: GridAlign;
  autoFit: boolean;
  minColumnWidth: string;
}

export interface GridSlots {
  default?: unknown;
}

export interface GridItemBreakpoint {
  span?: number;
  offset?: number;
  push?: number;
  pull?: number;
}

export type GridItemResponsiveValue = number | GridItemBreakpoint;

export interface GridItemProps {
  span: number;
  offset: number;
  push: number;
  pull: number;
  xs?: GridItemResponsiveValue;
  sm?: GridItemResponsiveValue;
  md?: GridItemResponsiveValue;
  lg?: GridItemResponsiveValue;
  xl?: GridItemResponsiveValue;
}

export interface GridItemSlots {
  default?: unknown;
}
