import {
  defineExpose,
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  useHost,
  useHostAttr,
  useHostFlag,
  useEffect
} from "@elfui/core";

import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";
import type {
  InfiniteScrollContainer,
  InfiniteScrollEmits,
  InfiniteScrollExposes,
  InfiniteScrollProps,
  InfiniteScrollSlots
} from "./types";

export type {
  InfiniteScrollContainer,
  InfiniteScrollDirectiveHandler,
  InfiniteScrollDirectiveOptions,
  InfiniteScrollDirectiveValue,
  InfiniteScrollEmits,
  InfiniteScrollExposes,
  InfiniteScrollProps,
  InfiniteScrollSlots
} from "./types";

type ScrollTarget = HTMLElement | Window;

const normalizeNonNegative = (value: unknown, fallback = 0): number => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : fallback;
};

const normalizeHeight = (value: unknown): string => {
  if (value === "" || value == null) return "";
  if (typeof value === "number") return `${Math.max(0, value)}px`;
  const text = String(value).trim();
  return /^-?\d+(?:\.\d+)?$/.test(text)
    ? `${Math.max(0, Number(text))}px`
    : text;
};

const props = defineProps<InfiniteScrollProps>({
  disabled: { type: Boolean, default: false },
  distance: { type: Number, default: 0 },
  delay: { type: Number, default: 200 },
  immediate: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  finished: { type: Boolean, default: false },
  height: { type: null, default: "280px" },
  container: { type: [String, Object], default: null },
  ariaLabel: { type: String, default: "" }
});

const emit = defineEmits<InfiniteScrollEmits>();
const host = useHost();
const locale = useLocaleProvider();

// State
let target: ScrollTarget | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
let mounted = false;
let checkQueued = false;

// Derived state
const normalizedDistance = (): number => normalizeNonNegative(props.distance);
const normalizedDelay = (): number => normalizeNonNegative(props.delay, 200);
const normalizedContainer = (): InfiniteScrollContainer => props.container;
const isWindowTarget = (value: ScrollTarget | null): value is Window =>
  typeof window !== "undefined" && value === window;
const isExternalTarget = (): boolean => normalizedContainer() != null && normalizedContainer() !== "";
const scrollTargetKind = (): "internal" | "external" | "window" => {
  const container = normalizedContainer();
  if (typeof window !== "undefined" && (container === window || container === "window")) {
    return "window";
  }
  return isExternalTarget() ? "external" : "internal";
};
const isFinished = (): boolean => Boolean(props.finished);
const canLoad = (): boolean => !props.disabled && !props.loading && !isFinished();
const viewportStyle = (): Record<string, string> => {
  const height = normalizeHeight(props.height);
  return height ? { height } : {};
};
const accessibleLabel = (): string => {
  if (props.ariaLabel.trim()) return props.ariaLabel.trim();
  return locale.name.toLowerCase().startsWith("zh")
    ? "无限滚动内容"
    : "Infinite scroll content";
};

const remainingDistance = (scrollTarget: ScrollTarget): number => {
  if (isWindowTarget(scrollTarget)) {
    const root = document.scrollingElement ?? document.documentElement;
    const top = window.scrollY || root.scrollTop;
    return root.scrollHeight - top - window.innerHeight;
  }
  return scrollTarget.scrollHeight - scrollTarget.scrollTop - scrollTarget.clientHeight;
};

// Methods
const load = (): void => {
  if (canLoad()) emit("load");
};

const clearTimer = (): void => {
  if (timer) clearTimeout(timer);
  timer = undefined;
};

const scheduleLoad = (): void => {
  if (!canLoad() || timer) return;
  const delay = normalizedDelay();
  if (delay === 0) {
    load();
    return;
  }
  timer = setTimeout(() => {
    timer = undefined;
    if (target && remainingDistance(target) <= normalizedDistance()) load();
  }, delay);
};

const check = (): void => {
  if (!mounted || !target || !canLoad()) return;
  if (remainingDistance(target) <= normalizedDistance()) scheduleLoad();
};

const queueCheck = (): void => {
  if (!mounted || checkQueued) return;
  checkQueued = true;
  queueMicrotask(() => {
    checkQueued = false;
    check();
  });
};

const onScroll = (): void => check();

const resolveContainer = (): ScrollTarget | null => {
  const container = normalizedContainer();
  if (typeof window !== "undefined" && (container === window || container === "window")) {
    return window;
  }
  if (typeof HTMLElement !== "undefined" && container instanceof HTMLElement) return container;
  if (typeof container === "string" && container.trim()) {
    try {
      return document.querySelector<HTMLElement>(container);
    } catch {
      return null;
    }
  }
  return host.shadowRoot?.querySelector<HTMLElement>(".scroll") ?? null;
};

const detach = (): void => {
  target?.removeEventListener("scroll", onScroll);
  if (isWindowTarget(target)) window.removeEventListener("resize", queueCheck);
  target = null;
};

const attach = (): void => {
  const nextTarget = resolveContainer();
  if (nextTarget === target) return;
  detach();
  target = nextTarget;
  target?.addEventListener("scroll", onScroll, { passive: true });
  if (isWindowTarget(target)) window.addEventListener("resize", queueCheck, { passive: true });
};

// Host state, lifecycle, and exposes
useHostAttr("data-scroll-target", scrollTargetKind);
useHostFlag("disabled", () => Boolean(props.disabled));
useHostFlag("loading", () => Boolean(props.loading));
useHostFlag("finished", isFinished);

onMounted(() => {
  mounted = true;
  attach();
  if (props.immediate) queueCheck();
  return () => {
    mounted = false;
    checkQueued = false;
    clearTimer();
    detach();
  };
});

useEffect(() => {
  void props.container;
  if (!mounted) return;
  attach();
  if (props.immediate) queueCheck();
});

useEffect(() => {
  const shouldFill = props.immediate
    && !props.disabled
    && !props.loading
    && !props.finished;
  void props.distance;
  if (mounted && shouldFill) queueCheck();
});

defineExpose<InfiniteScrollExposes>({ check });
defineStyle(styles);

const InfiniteScroll = defineHtml<
  InfiniteScrollProps,
  InfiniteScrollEmits,
  InfiniteScrollSlots
>(`
  <div
    class="scroll"
    part="scroll"
    role="region"
    tabindex="0"
    :aria-label=${accessibleLabel()}
    :aria-busy=${String(Boolean(props.loading))}
    :aria-disabled=${String(Boolean(props.disabled || props.finished))}
    :style=${viewportStyle()}
  >
    <slot></slot>
  </div>
`);

export { InfiniteScroll };
