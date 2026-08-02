import {
  defineHtml,
  defineProps,
  defineStyle,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useRef,
} from "@elfui/core";

import { cssSize, surfaceColor, surfaceForeground, surfaceShadow } from "../../surface";
import styles from "./style.scss?inline";
import type {
  ToolbarCollapsePosition,
  ToolbarDensity,
  ToolbarLocation,
  ToolbarProps,
  ToolbarSlots,
} from "./types";

export type {
  ToolbarCollapsePosition,
  ToolbarDensity,
  ToolbarLocation,
  ToolbarProps,
  ToolbarSlots,
} from "./types";

const props = defineProps<ToolbarProps>({
  title: { type: String, default: "" },
  ariaLabel: { type: String, default: "Toolbar" },
  density: { type: String, default: "default" },
  image: { type: String, default: "" },
  imageAlt: { type: String, default: "" },
  imagePosition: { type: String, default: "center" },
  imageOpacity: { type: Number, default: 1 },
  color: { type: String, default: "surface" },
  elevation: { type: Number, default: 0 },
  height: { type: [String, Number], default: "" },
  extensionHeight: { type: [String, Number], default: 48 },
  border: { type: Boolean, default: false },
  rounded: { type: Boolean, default: false },
  collapsed: { type: Boolean, default: false },
  collapsePosition: { type: String, default: "end" },
  collapseWidth: { type: [String, Number], default: 112 },
  floating: { type: Boolean, default: false },
  absolute: { type: Boolean, default: false },
  fixed: { type: Boolean, default: false },
  location: { type: String, default: "top" },
});

const hasExtension = useRef(false);

const density = (): ToolbarDensity =>
  props.density === "comfortable" || props.density === "compact" ? props.density : "default";
const collapsePosition = (): ToolbarCollapsePosition =>
  props.collapsePosition === "start" ? "start" : "end";
const location = (): ToolbarLocation => {
  const value = String(props.location || "top") as ToolbarLocation;
  return [
    "top",
    "bottom",
    "start",
    "end",
    "top-start",
    "top-end",
    "bottom-start",
    "bottom-end",
    "center",
  ].includes(value)
    ? value
    : "top";
};

const onExtensionSlotChange = (event: Event): void => {
  const slot = event.target as HTMLSlotElement;
  hasExtension.set(
    slot
      .assignedNodes({ flatten: true })
      .some((node) => node.nodeType !== Node.TEXT_NODE || Boolean(node.textContent?.trim())),
  );
};

useHostAttr("density", density);
useHostAttr("collapse-position", collapsePosition);
useHostAttr("location", location);
useHostFlag("border", () => props.border);
useHostFlag("rounded", () => props.rounded);
useHostFlag("collapsed", () => props.collapsed);
useHostFlag("floating", () => props.floating);
useHostFlag("absolute", () => props.absolute);
useHostFlag("fixed", () => props.fixed);
useHostCssVar("--_toolbar-height", () => cssSize(props.height));
useHostCssVar("--_toolbar-extension-height", () => cssSize(props.extensionHeight));
useHostCssVar("--_toolbar-bg", () => surfaceColor(props.color));
useHostCssVar("--_toolbar-color", () => surfaceForeground(props.color));
useHostCssVar("--_toolbar-shadow", () => surfaceShadow(props.elevation));
useHostCssVar("--_toolbar-collapse-width", () => cssSize(props.collapseWidth));
useHostCssVar("--_toolbar-image-position", () => props.imagePosition || "center");
useHostCssVar("--_toolbar-image-opacity", () =>
  String(Math.max(0, Math.min(1, Number(props.imageOpacity)))),
);

defineStyle(styles);

const Toolbar = defineHtml<ToolbarProps, Record<string, never>, ToolbarSlots>(`
  <div class="toolbar" part="toolbar" role="toolbar" :aria-label=${props.ariaLabel}>
    <div class="background" part="background" :aria-hidden=${props.imageAlt ? null : "true"}>
      <img v-if=${props.image} class="background-image" part="image" :src=${props.image} :alt=${props.imageAlt} />
      <slot name="background"></slot>
    </div>
    <div class="row" part="row">
      <div class="prepend" part="prepend"><slot name="prepend"></slot></div>
      <div class="title" part="title"><slot name="title">${props.title}</slot></div>
      <div class="content" part="content"><slot></slot></div>
      <div class="append" part="append"><slot name="append"></slot></div>
    </div>
    <div class="extension" part="extension" v-show=${hasExtension}>
      <slot name="extension" @slotchange=${onExtensionSlotChange}></slot>
    </div>
  </div>
`);

export { Toolbar };
