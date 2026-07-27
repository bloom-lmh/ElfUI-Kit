import {
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  onUnmounted,
  useHost,
  useHostCssVar,
  useHostFlag,
  useEffect,
  useRef
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { ParallaxExpose, ParallaxProps } from "./types";

export type { ParallaxExpose, ParallaxProps } from "./types";

const props = defineProps<ParallaxProps>({
  src: { type: String, default: "" },
  alt: { type: String, default: "" },
  height: { type: [Number, String], default: 420 },
  scale: { type: Number, default: 1.25 },
  disabled: { type: Boolean, default: false },
  position: { type: String, default: "center" }
});

const host = useHost();
const offset = useRef(0);
let frame = 0;
let scrollTargets: Array<Window | HTMLElement> = [];
let resizeObserver: ResizeObserver | undefined;

const cssSize = (value: number | string): string => {
  if (typeof value === "number") return `${Math.max(0, value)}px`;
  const normalized = String(value || "420").trim();
  return /^-?\d+(?:\.\d+)?$/.test(normalized) ? `${Math.max(0, Number(normalized))}px` : normalized;
};

const normalizedScale = (): number => Math.max(1, Math.min(1.8, Number(props.scale) || 1.25));

const canAnimate = (): boolean =>
  !props.disabled &&
  typeof window !== "undefined" &&
  !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const composedParent = (element: HTMLElement): HTMLElement | null => {
  if (element.parentElement) return element.parentElement;
  const root = element.getRootNode();
  return root instanceof ShadowRoot ? root.host as HTMLElement : null;
};

const isScrollable = (element: HTMLElement): boolean => {
  const computed = window.getComputedStyle(element);
  return /(auto|scroll|overlay)/.test(`${computed.overflow} ${computed.overflowY} ${computed.overflowX}`);
};

const resolveScrollTargets = (): Array<Window | HTMLElement> => {
  const targets = new Set<Window | HTMLElement>([window]);
  let parent = composedParent(host);
  while (parent && parent !== document.body && parent !== document.documentElement) {
    if (isScrollable(parent)) targets.add(parent);
    parent = composedParent(parent);
  }
  return [...targets];
};

const viewportBounds = (): { top: number; bottom: number; height: number } => {
  let top = 0;
  let bottom = window.innerHeight || document.documentElement.clientHeight || 1;
  for (const target of scrollTargets) {
    if (!(target instanceof HTMLElement)) continue;
    const rect = target.getBoundingClientRect();
    top = Math.max(top, rect.top + target.clientTop);
    bottom = Math.min(bottom, rect.bottom - target.clientTop);
  }
  return { top, bottom, height: Math.max(1, bottom - top) };
};

const updateNow = (): void => {
  frame = 0;
  if (!canAnimate()) {
    offset.set(0);
    return;
  }
  const rect = host.getBoundingClientRect();
  const viewport = viewportBounds();
  if (rect.bottom < viewport.top || rect.top > viewport.bottom) return;
  const viewportCenter = viewport.top + viewport.height / 2;
  const progress = (rect.top + rect.height / 2 - viewportCenter) / viewport.height;
  const travel = rect.height * (normalizedScale() - 1);
  offset.set(Math.round(Math.max(-travel, Math.min(travel, progress * travel)) * 100) / 100);
};

const scheduleUpdate = (): void => {
  if (frame) return;
  frame = window.requestAnimationFrame(updateNow);
};

const update = (): void => scheduleUpdate();

const disconnect = (): void => {
  for (const target of scrollTargets) target.removeEventListener("scroll", scheduleUpdate);
  scrollTargets = [];
  window.removeEventListener("resize", scheduleUpdate);
  resizeObserver?.disconnect();
  resizeObserver = undefined;
};

const connect = (): void => {
  disconnect();
  scrollTargets = resolveScrollTargets();
  for (const target of scrollTargets) target.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(host);
  }
};

useEffect(() => {
  void props.disabled;
  void props.scale;
  scheduleUpdate();
});

onMounted(() => {
  connect();
  updateNow();
});

onUnmounted(() => {
  if (frame) window.cancelAnimationFrame(frame);
  frame = 0;
  disconnect();
});

useHostCssVar("--_parallax-height", () => cssSize(props.height));
useHostCssVar("--_parallax-scale", () => String(normalizedScale()));
useHostCssVar("--_parallax-position", () => String(props.position || "center"));
useHostCssVar("--_parallax-offset", () => `${offset.value}px`);
useHostFlag("data-disabled", () => Boolean(props.disabled));

defineExpose<ParallaxExpose>({ update });
defineStyle(styles);

const Parallax = defineHtml<ParallaxProps>(`
  <section class="parallax" part="parallax">
    <img v-if=${props.src} class="media" part="image" :src=${props.src} :alt=${props.alt} loading="lazy" />
    <div class="content" part="content">
      <slot></slot>
    </div>
  </section>
`);

export { Parallax };
