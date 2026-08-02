import { defineHtml, defineProps, defineStyle, useHostCssVar } from "@elfui/core";

import styles from "./style.scss?inline";
import type { DescriptionsItemAlign, DescriptionsItemProps, DescriptionsItemSlots } from "./types";

export type { DescriptionsItemAlign, DescriptionsItemProps, DescriptionsItemSlots } from "./types";

const normalizeAlign = (value: unknown): DescriptionsItemAlign => {
  const candidate = String(value || "");
  return candidate === "left" || candidate === "center" || candidate === "right" ? candidate : "";
};

const cssSize = (value: string | number, fallback: string): string => {
  if (typeof value === "number") return `${Math.max(0, value)}px`;
  const candidate = String(value || "").trim();
  if (!candidate) return fallback;
  const numeric = Number(candidate);
  return Number.isFinite(numeric) ? `${Math.max(0, numeric)}px` : candidate;
};

const props = defineProps<DescriptionsItemProps>({
  label: { type: String, default: "" },
  span: { type: Number, default: 1 },
  rowspan: { type: Number, default: 1 },
  align: { type: String, default: "" },
  labelAlign: { type: String, default: "" },
  labelWidth: { type: [String, Number], default: "" },
  className: { type: String, default: "" },
  labelClassName: { type: String, default: "" },
  emptyText: { type: String, default: "—" },
});

// Derived state
const normalizedSpan = (): number => Math.max(1, Math.floor(Number(props.span) || 1));
const normalizedRowspan = (): number => Math.max(1, Math.floor(Number(props.rowspan) || 1));

useHostCssVar("--_descriptions-item-span", () => String(normalizedSpan()));
useHostCssVar("--_descriptions-item-rowspan", () => String(normalizedRowspan()));
useHostCssVar("--_descriptions-item-align", () => normalizeAlign(props.align) || "left");
useHostCssVar("--_descriptions-item-label-align", () => normalizeAlign(props.labelAlign) || "left");
useHostCssVar("--_descriptions-item-label-width", () => cssSize(props.labelWidth, "88px"));

defineStyle(styles);

const DescriptionsItem = defineHtml<
  DescriptionsItemProps,
  Record<string, never>,
  DescriptionsItemSlots
>(`
  <div class="item" :class=${props.className} part="item" role="group">
    <div class="label" :class=${props.labelClassName} part="label">
      <slot name="label">${props.label}</slot>
    </div>
    <div class="content" part="content"><slot>${props.emptyText}</slot></div>
  </div>
`);

export { DescriptionsItem };
