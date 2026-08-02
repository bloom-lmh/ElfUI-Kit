import { defineHtml, defineProps, defineStyle, useHostCssVar } from "@elfui/core";

import styles from "./style.scss?inline";
import type { MasonryProps, MasonrySlots } from "./types";

export type { MasonryGap, MasonryProps, MasonrySlots } from "./types";

const GAP_TOKENS: Record<string, string> = {
  "0": "0",
  xs: "var(--elf-space-1)",
  sm: "var(--elf-space-2)",
  md: "var(--elf-space-4)",
  lg: "var(--elf-space-6)",
  xl: "var(--elf-space-8)",
};

const props = defineProps<MasonryProps>({
  columns: { type: Number, default: 3 },
  minColumnWidth: { type: [String, Number], default: 240 },
  gap: { type: [String, Number], default: "md" },
});

const cssSize = (value: string | number): string => {
  if (typeof value === "number") return `${Math.max(0, value)}px`;
  const normalized = String(value).trim();
  if (/^\d+(?:\.\d+)?$/.test(normalized)) return `${normalized}px`;
  return GAP_TOKENS[normalized] || normalized;
};

useHostCssVar("--_columns", () => Math.max(1, Math.floor(Number(props.columns) || 1)));
useHostCssVar("--_min-column-width", () => cssSize(props.minColumnWidth));
useHostCssVar("--_gap", () => cssSize(props.gap));

defineStyle(styles);

const Masonry = defineHtml<MasonryProps, Record<string, never>, MasonrySlots>(`<slot></slot>`);

export { Masonry };
