// elf-grid - 12 列栅格容器

import { defineHtml, defineProps, defineStyle, useHostAttr, useHostCssVar, useHostFlag } from "@elfui/core";

import styles from "./style.scss?inline";
import type { GridProps, GridSlots, GridSpacing } from "./types";

export type {
  GridAlign,
  GridGap,
  GridItemBreakpoint,
  GridItemProps,
  GridItemResponsiveValue,
  GridItemSlots,
  GridJustify,
  GridProps,
  GridSlots,
  GridSpacing
} from "./types";

const gapTokens: Record<string, string> = {
  "0": "0",
  xs: "var(--elf-space-1)",
  sm: "var(--elf-space-2)",
  md: "var(--elf-space-4)",
  lg: "var(--elf-space-6)",
  xl: "var(--elf-space-8)"
};

const props = defineProps<GridProps>({
  columns: { type: Number, default: 12 },
  gap: { type: [String, Number], default: "0" },
  gutter: { type: [String, Number], default: "" },
  justify: { type: String, default: "start" },
  align: { type: String, default: "stretch" },
  autoFit: { type: Boolean, default: false },
  minColumnWidth: { type: String, default: "220px" }
});

const toCssLength = (value: GridSpacing): string => {
  if (typeof value === "number") return `${Math.max(0, value)}px`;
  const numeric = Number(value);
  if (value.trim() && Number.isFinite(numeric)) return `${Math.max(0, numeric)}px`;
  return gapTokens[value] || value || "0";
};

const normalizedGap = (): string => toCssLength(props.gutter === "" ? props.gap : props.gutter);

useHostCssVar("--_cols", () => Math.max(1, Number(props.columns) || 12));
useHostCssVar("--_min-col", () => String(props.minColumnWidth || "220px"));
useHostCssVar("--_gap", normalizedGap);
useHostAttr("justify", () => props.justify);
useHostAttr("align", () => props.align);
useHostFlag("auto-fit", () => props.autoFit);

defineStyle(styles);

const Grid = defineHtml<GridProps, Record<string, never>, GridSlots>(`<slot></slot>`);

export { Grid };
