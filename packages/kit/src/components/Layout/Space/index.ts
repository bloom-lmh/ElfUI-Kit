import {
  defineHtml,
  defineProps,
  defineStyle,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { SpaceAlignment, SpaceProps, SpaceSize, SpaceSlots } from "./types";

export type {
  SpaceAlignment,
  SpaceDirection,
  SpacePresetSize,
  SpaceProps,
  SpaceSize,
  SpaceSlots,
} from "./types";

const SIZE_TOKENS: Record<string, string> = {
  small: "8px",
  default: "12px",
  large: "16px",
};

const props = defineProps<SpaceProps>({
  direction: { type: String, default: "horizontal" },
  alignment: { type: String, default: "center" },
  size: { type: [String, Number, Array], default: "small" },
  spacer: { type: [String, Number], default: "" },
  wrap: { type: Boolean, default: false },
  fill: { type: Boolean, default: false },
  fillRatio: { type: Number, default: 100 },
});

const toCssLength = (value: string | number): string => {
  if (typeof value === "number") return `${Math.max(0, value)}px`;
  const normalized = String(value).trim();
  if (/^\d+(?:\.\d+)?$/.test(normalized)) return `${normalized}px`;
  return SIZE_TOKENS[normalized] || normalized || SIZE_TOKENS.small!;
};

const normalizedGap = (): string => {
  const value: SpaceSize = props.size;
  if (!Array.isArray(value)) return toCssLength(value);
  const [horizontal = 0, vertical = horizontal] = value;
  return `${Math.max(0, vertical)}px ${Math.max(0, horizontal)}px`;
};

const normalizedDirection = (): string => (props.direction === "vertical" ? "column" : "row");

const normalizedAlignment = (): SpaceAlignment => props.alignment || "center";

const normalizedFillRatio = (): string =>
  `${Math.min(100, Math.max(0, Number(props.fillRatio) || 0))}%`;

const normalizedSpacer = (): string => String(props.spacer ?? "");

useHostAttr("direction", () => props.direction);
useHostAttr("alignment", normalizedAlignment);
useHostFlag("wrap", () => props.wrap);
useHostFlag("fill", () => props.fill);
useHostFlag("has-spacer", () => normalizedSpacer().length > 0);
useHostCssVar("--_direction", normalizedDirection);
useHostCssVar("--_alignment", normalizedAlignment);
useHostCssVar("--_gap", normalizedGap);
useHostCssVar("--_fill-ratio", normalizedFillRatio);
useHostCssVar("--_spacer-content", () => JSON.stringify(normalizedSpacer()));

defineStyle(styles);

const Space = defineHtml<SpaceProps, Record<string, never>, SpaceSlots>(`<slot></slot>`);

export { Space };
