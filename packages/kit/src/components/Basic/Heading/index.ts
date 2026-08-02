import {
  defineHtml,
  defineProps,
  defineStyle,
  useHost,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type {
  HeadingAlign,
  HeadingColor,
  HeadingElement,
  HeadingLevel,
  HeadingProps,
  HeadingSlots,
  HeadingVariant,
  HeadingWeight,
} from "./types";

export type {
  HeadingAlign,
  HeadingColor,
  HeadingElement,
  HeadingLevel,
  HeadingProps,
  HeadingSlots,
  HeadingVariant,
  HeadingWeight,
} from "./types";

const LEVELS: readonly HeadingLevel[] = [1, 2, 3, 4, 5, 6];
const VARIANTS: readonly HeadingVariant[] = [
  "display",
  "hero",
  "page",
  "section",
  "subsection",
  "card",
  "overline",
  "eyebrow",
  "stat",
  "label",
  "caption",
];
const ALIGNS: readonly HeadingAlign[] = ["start", "center", "end"];
const COLORS: readonly HeadingColor[] = [
  "default",
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
  "muted",
];
const WEIGHTS: readonly HeadingWeight[] = ["regular", "medium", "bold"];

const props = defineProps<HeadingProps>({
  level: { type: Number, default: 2 },
  variant: { type: String, default: "section" },
  align: { type: String, default: "start" },
  color: { type: String, default: "default" },
  weight: { type: String, default: "" },
  truncated: { type: Boolean, default: false },
  lineClamp: { type: [Number, String], default: undefined },
  eyebrow: { type: String, default: "" },
  index: { type: [Number, String], default: "" },
  accent: { type: Boolean, default: false },
  chip: { type: Boolean, default: false },
});

const host = useHost<HeadingElement>();

const normalizedLevel = (): HeadingLevel =>
  LEVELS.includes(Number(props.level) as HeadingLevel) ? (Number(props.level) as HeadingLevel) : 2;
const normalizedVariant = (): HeadingVariant =>
  VARIANTS.includes(props.variant as HeadingVariant)
    ? (props.variant as HeadingVariant)
    : "section";
const normalizedAlign = (): HeadingAlign =>
  ALIGNS.includes(props.align as HeadingAlign) ? (props.align as HeadingAlign) : "start";
const normalizedColor = (): HeadingColor =>
  COLORS.includes(props.color as HeadingColor) ? (props.color as HeadingColor) : "default";
const normalizedWeight = (): HeadingWeight =>
  props.weight && WEIGHTS.includes(props.weight as HeadingWeight)
    ? (props.weight as HeadingWeight)
    : "";

const hasLineClamp = (): boolean => {
  const value = props.lineClamp;
  return (
    (value !== undefined && value !== null && String(value).trim() !== "") ||
    host.hasAttribute("line-clamp")
  );
};

const lineClampValue = (): number => {
  const rawValue = props.lineClamp ?? host.getAttribute("line-clamp") ?? 1;
  const value = Number.parseInt(String(rawValue), 10);
  return Number.isFinite(value) ? Math.max(1, value) : 1;
};

useHostAttr("level", normalizedLevel);
useHostAttr("variant", normalizedVariant);
useHostAttr("align", normalizedAlign);
useHostAttr("color", normalizedColor);
useHostAttr("weight", normalizedWeight);
useHostFlag("truncated", () => Boolean(props.truncated));
useHostFlag("data-line-clamp", hasLineClamp);
useHostFlag("accent", () => Boolean(props.accent));
useHostFlag("chip", () => Boolean(props.chip));
useHostCssVar("--_heading-line-clamp", () => String(lineClampValue()));

defineStyle(styles);

const Heading = defineHtml<HeadingProps, Record<string, never>, HeadingSlots>(`
  <h1 v-if=${normalizedLevel() === 1} class="heading" part="heading">
    <span v-if=${props.eyebrow} class="eyebrow" part="eyebrow">${props.eyebrow}</span>
    <span class="heading-line">
      <span v-if=${props.index !== "" && props.index !== undefined && props.index !== null} class="index" part="index">${props.index}</span>
      <span class="heading-text" part="text"><slot></slot></span>
    </span>
  </h1>
  <h2 v-else-if=${normalizedLevel() === 2} class="heading" part="heading">
    <span v-if=${props.eyebrow} class="eyebrow" part="eyebrow">${props.eyebrow}</span>
    <span class="heading-line">
      <span v-if=${props.index !== "" && props.index !== undefined && props.index !== null} class="index" part="index">${props.index}</span>
      <span class="heading-text" part="text"><slot></slot></span>
    </span>
  </h2>
  <h3 v-else-if=${normalizedLevel() === 3} class="heading" part="heading">
    <span v-if=${props.eyebrow} class="eyebrow" part="eyebrow">${props.eyebrow}</span>
    <span class="heading-line">
      <span v-if=${props.index !== "" && props.index !== undefined && props.index !== null} class="index" part="index">${props.index}</span>
      <span class="heading-text" part="text"><slot></slot></span>
    </span>
  </h3>
  <h4 v-else-if=${normalizedLevel() === 4} class="heading" part="heading">
    <span v-if=${props.eyebrow} class="eyebrow" part="eyebrow">${props.eyebrow}</span>
    <span class="heading-line">
      <span v-if=${props.index !== "" && props.index !== undefined && props.index !== null} class="index" part="index">${props.index}</span>
      <span class="heading-text" part="text"><slot></slot></span>
    </span>
  </h4>
  <h5 v-else-if=${normalizedLevel() === 5} class="heading" part="heading">
    <span v-if=${props.eyebrow} class="eyebrow" part="eyebrow">${props.eyebrow}</span>
    <span class="heading-line">
      <span v-if=${props.index !== "" && props.index !== undefined && props.index !== null} class="index" part="index">${props.index}</span>
      <span class="heading-text" part="text"><slot></slot></span>
    </span>
  </h5>
  <h6 v-else class="heading" part="heading">
    <span v-if=${props.eyebrow} class="eyebrow" part="eyebrow">${props.eyebrow}</span>
    <span class="heading-line">
      <span v-if=${props.index !== "" && props.index !== undefined && props.index !== null} class="index" part="index">${props.index}</span>
      <span class="heading-text" part="text"><slot></slot></span>
    </span>
  </h6>
`);

export { Heading };

declare global {
  interface HTMLElementTagNameMap {
    "elf-heading": HeadingElement;
  }
}
