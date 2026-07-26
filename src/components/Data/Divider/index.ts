import {
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  useHost,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useRef
} from "@elfui/core";

import styles from "./style.scss?inline";
import type {
  DividerBorderStyle,
  DividerContentPosition,
  DividerDirection,
  DividerProps,
  DividerSlots
} from "./types";

export type {
  DividerBorderStyle,
  DividerContentPosition,
  DividerDirection,
  DividerProps,
  DividerSlots
} from "./types";

const BORDER_STYLES = new Set<DividerBorderStyle>([
  "solid",
  "dashed",
  "dotted",
  "double"
]);
const CONTENT_POSITIONS = new Set<DividerContentPosition>(["left", "center", "right"]);

const props = defineProps<DividerProps>({
  direction: { type: String, default: "horizontal" },
  contentPosition: { type: String, default: "center" },
  borderStyle: { type: String, default: "solid" },
  dashed: { type: Boolean, default: false }
});

const host = useHost();

// State
const contentLabel = useRef("");

// Derived state
const normalizedDirection = (): DividerDirection =>
  props.direction === "vertical" ? "vertical" : "horizontal";

const normalizedContentPosition = (): DividerContentPosition => {
  const value = String(props.contentPosition || "center") as DividerContentPosition;
  return CONTENT_POSITIONS.has(value) ? value : "center";
};

const normalizedBorderStyle = (): DividerBorderStyle => {
  if (props.dashed) return "dashed";
  const value = String(props.borderStyle || "solid") as DividerBorderStyle;
  return BORDER_STYLES.has(value) ? value : "solid";
};

const hasContent = (): boolean => Boolean(contentLabel.value);

// Methods
const syncSlotContent = (slot?: HTMLSlotElement | null): void => {
  const target = slot ?? host.shadowRoot?.querySelector<HTMLSlotElement>("slot");
  if (!target) return;
  const label = target
    .assignedNodes({ flatten: true })
    .map((node) => node.textContent ?? "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  contentLabel.set(label);
};

const onSlotChange = (event: Event): void => {
  syncSlotContent(event.target as HTMLSlotElement);
};

useHostAttr("role", () => "separator");
useHostAttr("direction", normalizedDirection);
useHostAttr("content-position", normalizedContentPosition);
useHostAttr("border-style", normalizedBorderStyle);
useHostAttr("aria-orientation", normalizedDirection);
useHostAttr("aria-label", () => contentLabel.value || null);
useHostFlag("has-content", hasContent);
useHostCssVar("--_divider-border-style", normalizedBorderStyle);

onMounted(() => queueMicrotask(() => syncSlotContent()));

defineStyle(styles);

const Divider = defineHtml<
  DividerProps,
  Record<string, never>,
  DividerSlots
>(`
  <span class="line line-before" part="line" aria-hidden="true"></span>
  <span class="text" part="text" v-show=${hasContent()}>
    <slot @slotchange=${onSlotChange}></slot>
  </span>
  <span class="line line-after" part="line" aria-hidden="true"></span>
`);

export { Divider };
