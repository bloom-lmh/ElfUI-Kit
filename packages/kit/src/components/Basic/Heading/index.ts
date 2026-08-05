import {
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  onUnmounted,
  useEffect,
  useHost,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import {
  advanceHeadingCounters,
  createHeadingCounters,
  formatHeadingNumber,
  formatMarkdownNumber,
} from "./numbering";
import type {
  HeadingAlign,
  HeadingColor,
  HeadingElement,
  HeadingFamily,
  HeadingLevel,
  HeadingMarkdown,
  HeadingProps,
  HeadingSlots,
  HeadingWeight,
} from "./types";

export type {
  HeadingAlign,
  HeadingColor,
  HeadingElement,
  HeadingFamily,
  HeadingLevel,
  HeadingMarkdown,
  HeadingProps,
  HeadingSlots,
  HeadingWeight,
} from "./types";

const FAMILIES: readonly HeadingFamily[] = [
  "guide",
  "editorial",
  "terminal",
  "brand",
  "neon",
  "minimal",
];
const LEVELS: readonly HeadingLevel[] = [1, 2, 3, 4, 5, 6];
const MARKDOWN: readonly HeadingMarkdown[] = ["bullet", "ordered"];
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
  family: { type: String, default: "guide" },
  level: { type: Number, default: 2 },
  align: { type: String, default: "start" },
  color: { type: String, default: "default" },
  weight: { type: String, default: "" },
  truncated: { type: Boolean, default: false },
  lineClamp: { type: [Number, String], default: undefined },
  eyebrow: { type: String, default: "" },
  numbered: { type: Boolean, default: false },
  index: { type: [Number, String], default: "" },
  markdown: { type: String, default: "" },
  accent: { type: Boolean, default: undefined },
  chip: { type: Boolean, default: undefined },
  gradient: { type: Boolean, default: undefined },
  lineHeight: { type: [Number, String], default: undefined },
  marginTop: { type: [Number, String], default: undefined },
  marginBottom: { type: [Number, String], default: undefined },
  fontSize: { type: [Number, String], default: undefined },
  letterSpacing: { type: [Number, String], default: undefined },
});

const host = useHost<HeadingElement>();
const numberText = useRef("");
const scopeObserver = useRef<MutationObserver | null>(null);

const normalizedFamily = (): HeadingFamily =>
  FAMILIES.includes(props.family as HeadingFamily) ? (props.family as HeadingFamily) : "guide";
const normalizedLevel = (): HeadingLevel =>
  LEVELS.includes(Number(props.level) as HeadingLevel) ? (Number(props.level) as HeadingLevel) : 2;
const normalizedMarkdown = (): HeadingMarkdown =>
  MARKDOWN.includes(props.markdown as HeadingMarkdown) ? (props.markdown as HeadingMarkdown) : "";
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

const hasManualIndex = (): boolean =>
  props.index !== "" && props.index !== undefined && props.index !== null;
const markerVisible = (): boolean =>
  hasManualIndex() || Boolean(props.numbered) || normalizedMarkdown() !== "";
const displayNumber = (): string => {
  if (hasManualIndex()) return String(props.index);
  if (normalizedMarkdown() === "bullet") return "-";
  return numberText.value;
};

const accentActive = (): boolean =>
  props.accent ?? (normalizedFamily() === "guide" && normalizedLevel() === 2);
const chipActive = (): boolean =>
  props.chip ??
  (normalizedFamily() === "guide" && normalizedLevel() === 3 && normalizedMarkdown() === "");
const gradientActive = (): boolean =>
  props.gradient ?? (normalizedFamily() === "brand" && normalizedLevel() === 1);

const hasOverride = (value: number | string | undefined): boolean =>
  value !== undefined && value !== null && String(value).trim() !== "";
const spacingOverride = (value: number | string | undefined): string => {
  if (!hasOverride(value)) return "";
  return typeof value === "number" ? `${value}px` : String(value);
};
const lineHeightOverride = (value: number | string | undefined): string => {
  if (!hasOverride(value)) return "";
  return String(value);
};

const headingScope = (): Node => {
  let node: Node | null = host;
  while (node) {
    if (node instanceof Element && node.hasAttribute("data-heading-scope")) return node;
    node = node.parentNode;
  }
  return host.getRootNode();
};

const renumber = (): void => {
  const markdown = normalizedMarkdown();
  if (!props.numbered && markdown !== "ordered") {
    numberText.set("");
    return;
  }
  const scope = headingScope();
  let counters = createHeadingCounters();
  let found = false;
  for (const heading of Array.from(
    (scope as ParentNode).querySelectorAll(
      "elf-heading[numbered], elf-heading[markdown='ordered']",
    ),
  )) {
    const rawLevel = Number(heading.getAttribute("level") ?? 2);
    const level = LEVELS.includes(rawLevel as HeadingLevel) ? (rawLevel as HeadingLevel) : 2;
    counters = advanceHeadingCounters(counters, level);
    if (heading === host) {
      numberText.set(
        markdown === "ordered"
          ? formatMarkdownNumber(level, counters)
          : formatHeadingNumber(normalizedFamily(), level, counters),
      );
      found = true;
      break;
    }
  }
  if (!found) numberText.set("");
};

const scheduleRenumber = (): void => {
  queueMicrotask(renumber);
};

const startScopeObserver = (): void => {
  const observer = new MutationObserver(scheduleRenumber);
  observer.observe(headingScope(), { childList: true, subtree: true });
  scopeObserver.set(observer);
};

useHostAttr("level", normalizedLevel);
useHostAttr("family", normalizedFamily);
useHostAttr("markdown", normalizedMarkdown);
useHostAttr("align", normalizedAlign);
useHostAttr("color", normalizedColor);
useHostAttr("weight", normalizedWeight);
useHostFlag("truncated", () => Boolean(props.truncated));
useHostFlag("data-line-clamp", hasLineClamp);
useHostFlag("numbered", () => Boolean(props.numbered));
useHostFlag("data-number-visible", markerVisible);
useHostFlag("accent", accentActive);
useHostFlag("chip", chipActive);
useHostFlag("gradient", gradientActive);
useHostFlag("data-line-height", () => hasOverride(props.lineHeight));
useHostFlag("data-margin-top", () => hasOverride(props.marginTop));
useHostFlag("data-margin-bottom", () => hasOverride(props.marginBottom));
useHostFlag("data-font-size", () => hasOverride(props.fontSize));
useHostFlag("data-letter-spacing", () => hasOverride(props.letterSpacing));
useHostCssVar("--_heading-line-clamp", () => String(lineClampValue()));
useHostCssVar("--_heading-line-height", () => lineHeightOverride(props.lineHeight));
useHostCssVar("--_heading-margin-top", () => spacingOverride(props.marginTop));
useHostCssVar("--_heading-margin-bottom", () => spacingOverride(props.marginBottom));
useHostCssVar("--_heading-font-size", () => spacingOverride(props.fontSize));
useHostCssVar("--_heading-letter-spacing", () => spacingOverride(props.letterSpacing));

useEffect(() => {
  renumber();
});

onMounted(() => {
  renumber();
  startScopeObserver();
});

onUnmounted(() => {
  scopeObserver.value?.disconnect();
  scopeObserver.set(null);
});

defineStyle(styles);

const Heading = defineHtml<HeadingProps, Record<string, never>, HeadingSlots>(`
  <h1 v-if=${normalizedLevel() === 1} class="heading" part="heading">
    <span v-if=${props.eyebrow} class="eyebrow" part="eyebrow">${props.eyebrow}</span>
    <span class="heading-line">
      <span v-if=${markerVisible()} class="index" part="index" aria-hidden="true">${displayNumber()}</span>
      <span class="heading-text" part="text"><slot></slot></span>
    </span>
  </h1>
  <h2 v-else-if=${normalizedLevel() === 2} class="heading" part="heading">
    <span v-if=${props.eyebrow} class="eyebrow" part="eyebrow">${props.eyebrow}</span>
    <span class="heading-line">
      <span v-if=${markerVisible()} class="index" part="index" aria-hidden="true">${displayNumber()}</span>
      <span class="heading-text" part="text"><slot></slot></span>
    </span>
  </h2>
  <h3 v-else-if=${normalizedLevel() === 3} class="heading" part="heading">
    <span v-if=${props.eyebrow} class="eyebrow" part="eyebrow">${props.eyebrow}</span>
    <span class="heading-line">
      <span v-if=${markerVisible()} class="index" part="index" aria-hidden="true">${displayNumber()}</span>
      <span class="heading-text" part="text"><slot></slot></span>
    </span>
  </h3>
  <h4 v-else-if=${normalizedLevel() === 4} class="heading" part="heading">
    <span v-if=${props.eyebrow} class="eyebrow" part="eyebrow">${props.eyebrow}</span>
    <span class="heading-line">
      <span v-if=${markerVisible()} class="index" part="index" aria-hidden="true">${displayNumber()}</span>
      <span class="heading-text" part="text"><slot></slot></span>
    </span>
  </h4>
  <h5 v-else-if=${normalizedLevel() === 5} class="heading" part="heading">
    <span v-if=${props.eyebrow} class="eyebrow" part="eyebrow">${props.eyebrow}</span>
    <span class="heading-line">
      <span v-if=${markerVisible()} class="index" part="index" aria-hidden="true">${displayNumber()}</span>
      <span class="heading-text" part="text"><slot></slot></span>
    </span>
  </h5>
  <h6 v-else class="heading" part="heading">
    <span v-if=${props.eyebrow} class="eyebrow" part="eyebrow">${props.eyebrow}</span>
    <span class="heading-line">
      <span v-if=${markerVisible()} class="index" part="index" aria-hidden="true">${displayNumber()}</span>
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
