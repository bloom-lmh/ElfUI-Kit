// elf-flex — flex 容器
//
// 用法：
//   <elf-flex direction="row" gap="md" justify="space-between" align="center">
//     <div>A</div><div>B</div>
//   </elf-flex>
//
// 样式见 ./style.scss；运行时通过 Vite 的 ?inline 加载为字符串注入 Shadow DOM。

import {
  defineHtml,
  defineProps,
  defineStyle,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type {
  FlexAlign,
  FlexAlignContent,
  FlexJustify,
  FlexProps,
  FlexSlots,
  FlexWrap,
} from "./types";

export type {
  FlexAlign,
  FlexAlignContent,
  FlexDirection,
  FlexGap,
  FlexJustify,
  FlexProps,
  FlexSize,
  FlexSlots,
  FlexWrap,
} from "./types";

const gapTokens: Record<string, string> = {
  "0": "0",
  xs: "var(--elf-space-1)",
  sm: "var(--elf-space-2)",
  md: "var(--elf-space-4)",
  lg: "var(--elf-space-6)",
  xl: "var(--elf-space-8)",
};

const justifyValues = new Set<FlexJustify>([
  "flex-start",
  "flex-end",
  "center",
  "space-between",
  "space-around",
  "space-evenly",
]);

const alignValues = new Set<FlexAlign>(["stretch", "flex-start", "flex-end", "center", "baseline"]);

const alignContentValues = new Set<FlexAlignContent>([
  "stretch",
  "flex-start",
  "flex-end",
  "center",
  "space-between",
  "space-around",
  "space-evenly",
]);

const props = defineProps<FlexProps>({
  direction: { type: String, default: "row" },
  justify: { type: String, default: "flex-start" },
  align: { type: String, default: "stretch" },
  alignContent: { type: String, default: "stretch" },
  alignment: { type: String, default: "" },
  gap: { type: [String, Number, Array], default: "0" },
  size: { type: [String, Number, Array], default: "" },
  wrap: { type: [Boolean, String], default: false },
  inline: { type: Boolean, default: false },
  fill: { type: Boolean, default: false },
  fillRatio: { type: Number, default: 100 },
});

const normalizedJustify = (): FlexJustify =>
  justifyValues.has(props.justify) ? props.justify : "flex-start";

const normalizedAlign = (): FlexAlign => {
  const value = props.alignment || props.align;
  return alignValues.has(value) ? value : "stretch";
};

const normalizedAlignContent = (): FlexAlignContent =>
  alignContentValues.has(props.alignContent) ? props.alignContent : "stretch";

const normalizedWrap = (): Exclude<FlexWrap, boolean> => {
  const value = props.wrap as FlexWrap | "";
  if (value === true || value === "") return "wrap";
  if (value === false) return "nowrap";
  return value === "wrap" || value === "wrap-reverse" ? value : "nowrap";
};

const toCssLength = (value: number | string): string => {
  if (typeof value === "number") return `${Math.max(0, value)}px`;
  const numeric = Number(value);
  if (value.trim() && Number.isFinite(numeric)) return `${Math.max(0, numeric)}px`;
  return gapTokens[value] || value || "0";
};

const normalizedGap = (): string => {
  const value = props.size === "" ? props.gap : props.size;
  if (Array.isArray(value)) {
    const [horizontal = 0, vertical = horizontal] = value;
    return `${Math.max(0, vertical)}px ${Math.max(0, horizontal)}px`;
  }
  return toCssLength(value);
};

const normalizedFillRatio = (): string =>
  `${Math.min(100, Math.max(0, Number(props.fillRatio) || 0))}%`;

useHostAttr("direction", () => props.direction);
useHostAttr("justify", normalizedJustify);
useHostAttr("align", normalizedAlign);
useHostAttr("align-content", normalizedAlignContent);
useHostAttr("wrap", normalizedWrap);
useHostFlag("inline", () => props.inline);
useHostFlag("fill", () => props.fill);
useHostCssVar("--_justify", normalizedJustify);
useHostCssVar("--_align", normalizedAlign);
useHostCssVar("--_align-content", normalizedAlignContent);
useHostCssVar("--_wrap", normalizedWrap);
useHostCssVar("--_gap", normalizedGap);
useHostCssVar("--_fill-ratio", normalizedFillRatio);

defineStyle(styles);

const Flex = defineHtml<FlexProps, Record<string, never>, FlexSlots>(`<slot></slot>`);

export { Flex };
