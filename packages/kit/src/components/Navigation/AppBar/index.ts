import {
  defineEmits,
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

import {
  getScrollPosition,
  resolveScrollContainer,
  type ScrollContainer,
} from "../../../composables/scroll";
import { cssSize, surfaceColor, surfaceForeground, surfaceShadow } from "../../surface";
import styles from "./style.scss?inline";
import type { AppBarDensity, AppBarEmits, AppBarProps, AppBarSlots } from "./types";

export type {
  AppBarDensity,
  AppBarEmits,
  AppBarProps,
  AppBarScrollBehavior,
  AppBarSlots,
} from "./types";

const props = defineProps<AppBarProps>({
  title: { type: String, default: "" },
  ariaLabel: { type: String, default: "Application bar" },
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
  fixed: { type: Boolean, default: false },
  sticky: { type: Boolean, default: false },
  collapsed: { type: Boolean, default: false },
  scrollBehavior: { type: String, default: "" },
  scrollTarget: { type: null, default: null },
  scrollThreshold: { type: Number, default: 300 },
});

const emit = defineEmits<AppBarEmits>(["scroll"]);
const host = useHost();
const hasExtension = useRef(false);
const scrollPosition = useRef(0);
const scrollDirection = useRef<"up" | "down">("down");
const scrollCollapsedState = useRef(false);
const scrollHiddenState = useRef(false);
let target: ScrollContainer | null = null;
let mounted = false;
let cleanup = (): void => {};
let directionAnchor = 0;

const density = (): AppBarDensity =>
  props.density === "comfortable" || props.density === "compact" || props.density === "prominent"
    ? props.density
    : "default";
const threshold = (): number => Math.max(1, Number(props.scrollThreshold) || 300);
const behaviors = (): Set<string> =>
  new Set(
    String(props.scrollBehavior || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean),
  );
const hasBehavior = (name: string): boolean => behaviors().has(name);
const scrollProgress = (): number => Math.min(1, scrollPosition.value / threshold());
const scrollCollapsed = (): boolean => hasBehavior("collapse") && scrollCollapsedState.value;
const scrollElevated = (): boolean => hasBehavior("elevate") && scrollPosition.value > 0;
const scrollHidden = (): boolean => hasBehavior("hide") && scrollHiddenState.value;
const imageOpacity = (): string => {
  const base = Math.max(0, Math.min(1, Number(props.imageOpacity)));
  return String(base * (hasBehavior("fade-image") ? 1 - scrollProgress() : 1));
};

const appBarForeground = (): string => {
  const color = String(props.color || "").toLowerCase();
  if (color === "primary" || color === "secondary") {
    return "var(--elf-app-bar-on-color, #ffffff)";
  }
  return surfaceForeground(props.color);
};

const updateScroll = (): void => {
  if (!target) return;
  const next = Math.max(0, getScrollPosition(target));
  const previous = scrollPosition.peek();

  // Ignore sub-pixel and layout-induced jitter. A prominent bar can lose up to
  // 72px when it collapses; without a stable direction anchor that reflow can
  // immediately reverse the state and make the toolbar flash at the threshold.
  const directionDelta = next - directionAnchor;
  if (next !== previous && (Math.abs(directionDelta) >= 4 || next === 0)) {
    scrollDirection.set(directionDelta > 0 ? "down" : "up");
    directionAnchor = next;
  }

  const activationPoint = threshold();
  const releasePoint = Math.max(0, activationPoint - Math.min(96, activationPoint - 1));
  if (hasBehavior("collapse")) {
    if (!scrollCollapsedState.peek() && next >= activationPoint) scrollCollapsedState.set(true);
    else if (scrollCollapsedState.peek() && next <= releasePoint) scrollCollapsedState.set(false);
  } else {
    scrollCollapsedState.set(false);
  }

  if (!hasBehavior("hide") || next < activationPoint) {
    scrollHiddenState.set(false);
  } else {
    const shouldHide = hasBehavior("inverted")
      ? scrollDirection.value === "up"
      : scrollDirection.value === "down";
    scrollHiddenState.set(shouldHide);
  }

  if (next !== previous) {
    scrollPosition.set(next);
    emit("scroll", next, scrollDirection.value);
  }
};

const connectScroll = (): void => {
  cleanup();
  target = resolveScrollContainer(props.scrollTarget, host.getRootNode() as Document | ShadowRoot);
  if (!target || !String(props.scrollBehavior || "").trim()) {
    scrollPosition.set(0);
    scrollCollapsedState.set(false);
    scrollHiddenState.set(false);
    directionAnchor = 0;
    return;
  }
  directionAnchor = Math.max(0, getScrollPosition(target));
  target.addEventListener("scroll", updateScroll, { passive: true });
  cleanup = () => target?.removeEventListener("scroll", updateScroll);
  updateScroll();
};

const onExtensionSlotChange = (event: Event): void => {
  const slot = event.target as HTMLSlotElement;
  hasExtension.set(
    slot
      .assignedNodes({ flatten: true })
      .some((node) => node.nodeType !== Node.TEXT_NODE || Boolean(node.textContent?.trim())),
  );
};

useEffect(() => {
  void props.scrollTarget;
  void props.scrollBehavior;
  if (mounted) queueMicrotask(connectScroll);
});

useEffect(() => {
  void props.scrollThreshold;
  void props.imageOpacity;
  if (mounted) updateScroll();
});

onMounted(() => {
  mounted = true;
  connectScroll();
});

onUnmounted(() => {
  mounted = false;
  cleanup();
  target = null;
});

useHostAttr("density", density);
useHostFlag("border", () => props.border);
useHostFlag("rounded", () => props.rounded);
useHostFlag("fixed", () => props.fixed);
useHostFlag("sticky", () => props.sticky);
useHostFlag("collapsed", () => props.collapsed);
useHostFlag("data-scroll-hidden", scrollHidden);
useHostFlag("data-scroll-collapsed", scrollCollapsed);
useHostFlag("data-scroll-elevated", scrollElevated);
useHostFlag("data-fade-image", () => hasBehavior("fade-image"));
useHostFlag("data-inverted", () => hasBehavior("inverted"));
useHostCssVar("--_app-bar-height", () => cssSize(props.height));
useHostCssVar("--_app-bar-extension-height", () => cssSize(props.extensionHeight));
useHostCssVar("--_app-bar-bg", () => surfaceColor(props.color));
useHostCssVar("--_app-bar-color", appBarForeground);
useHostCssVar("--_app-bar-shadow", () => surfaceShadow(props.elevation));
useHostCssVar("--_app-bar-image-opacity", imageOpacity);
useHostCssVar("--_app-bar-image-position", () => props.imagePosition || "center");

defineStyle(styles);

const AppBar = defineHtml<AppBarProps, AppBarEmits, AppBarSlots>(`
  <header class="app-bar" part="app-bar" :aria-label=${props.ariaLabel}>
    <div class="background" part="background" aria-hidden=${props.imageAlt ? null : "true"}>
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
  </header>
`);

export { AppBar };
