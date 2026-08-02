export type MasonryGap = "0" | "xs" | "sm" | "md" | "lg" | "xl" | string | number;

export interface MasonryProps {
  /** Maximum column count. */
  columns: number;
  /** Minimum width used before a new column is created. */
  minColumnWidth: string | number;
  gap: MasonryGap;
}

export interface MasonrySlots {
  default?: unknown;
}
