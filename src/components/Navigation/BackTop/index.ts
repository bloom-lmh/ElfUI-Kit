import {
  defineEmits,
  defineExpose,
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
  defineHtml,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { BackTopProps, BackTopShape, BackTopSlots } from "./types";

export type { BackTopElement, BackTopProps, BackTopShape, BackTopSlots } from "./types";

type ScrollContainer = Window | HTMLElement;

const cssSize = (value: unknown, fallback: string): string => {
  if (value == null || value === "") return fallback;
  if (typeof value === "number") return `${Math.max(0, value)}px`;
  const text = String(value).trim();
  return /^-?\d+(?:\.\d+)?$/.test(text) ? `${Math.max(0, Number(text))}px` : text;
};

const numberProp = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const props = defineProps<BackTopProps>({
  target: { type: null, default: "" },
  visibilityHeight: { type: Number, default: 200 },
  right: { type: [Number, String], default: 40 },
  bottom: { type: [Number, String], default: 40 },
  zIndex: { type: null, default: 10 },
  smooth: { type: Boolean, default: true },
  shape: { type: String, default: "circle" },
  size: { type: [Number, String], default: 40 },
  icon: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits<{
  click: [event: MouseEvent];
  "visible-change": [visible: boolean];
}>();

const host = useHost();

const visible = useRef(false);

let scrollTarget: ScrollContainer | null = null;

let cleanup = (): void => {};
let mounted = false;

const isScrollContainer = (value: unknown): value is ScrollContainer =>
  typeof value === "object" && value !== null && "addEventListener" in value;

const getContainer = (): ScrollContainer => {
  if (typeof window === "undefined") return document.documentElement;
  const target = props.target;
  const root = host.getRootNode() as Document | ShadowRoot;
  if (typeof target === "string" && target) {
    return (
      (root.querySelector(target) as HTMLElement | null) ||
      (document.querySelector(target) as HTMLElement | null) ||
      window
    );
  }
  if (typeof target === "function") {
    const resolved = (target as () => ScrollContainer | null)();
    return resolved || window;
  }
  if (isScrollContainer(target)) return target;
  return window;
};

const getScrollTop = (container: ScrollContainer): number =>
  container === window
    ? window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
    : (container as HTMLElement).scrollTop;

const setVisible = (next: boolean): void => {
  if (visible.peek() === next) return;
  visible.set(next);
  emit("visible-change", next);
};

const updateVisible = (): void => {
  if (props.disabled) {
    setVisible(false);
    return;
  }
  const target = scrollTarget || getContainer();
  setVisible(getScrollTop(target) >= Math.max(0, numberProp(props.visibilityHeight, 200)));
};

const scrollContainerTo = (container: ScrollContainer, top: number): void => {
  const behavior = props.smooth ? "smooth" : "auto";
  if (container === window) {
    window.scrollTo({ top, behavior });
    return;
  }
  const element = container as HTMLElement & {
    scrollTo?: (options: ScrollToOptions) => void;
  };
  if (typeof element.scrollTo === "function") {
    element.scrollTo({ top, behavior });
  } else {
    element.scrollTop = top;
  }
};

const scrollToTop = (): void => {
  if (props.disabled) return;
  const target = scrollTarget || getContainer();
  scrollContainerTo(target, 0);
  updateVisible();
};

const onClick = (event: MouseEvent): void => {
  event.preventDefault();
  event.stopPropagation();
  if (props.disabled) return;
  emit("click", event);
  scrollToTop();
};

const shape = (): BackTopShape => (props.shape === "square" ? "square" : "circle");

const connect = (): void => {
  if (typeof window === "undefined") return;
  cleanup();
  const target = getContainer();
  scrollTarget = target;
  target.addEventListener("scroll", updateVisible, { passive: true });
  window.addEventListener("resize", updateVisible);
  cleanup = () => {
    target.removeEventListener("scroll", updateVisible);
    window.removeEventListener("resize", updateVisible);
  };
  updateVisible();
};

useEffect(() => {
  void props.target;
  if (mounted) queueMicrotask(connect);
});

useEffect(() => {
  void props.visibilityHeight;
  void props.disabled;
  if (mounted) updateVisible();
});

onMounted(() => {
  mounted = true;
  connect();
});

onUnmounted(() => {
  mounted = false;
  cleanup();
});

useHostAttr("shape", shape);
useHostCssVar("--backtop-right", () => cssSize(props.right, "40px"));
useHostCssVar("--backtop-bottom", () => cssSize(props.bottom, "40px"));
useHostCssVar("--backtop-size", () => cssSize(props.size, "40px"));
useHostCssVar("--backtop-z-index", () => String(props.zIndex || 10));
useHostFlag("data-visible", () => visible.value);
useHostFlag("disabled", () => Boolean(props.disabled));

defineExpose({ scrollToTop });

defineStyle(styles);

const BackTop = defineHtml<BackTopProps, Record<string, never>, BackTopSlots>(`
  <button
    v-if=${visible && !props.disabled}
    class="backtop"
    part="root"
    type="button"
    aria-label="Back to top"
    @click=${onClick}
  >
    <slot>
      <span v-if=${props.icon} class="icon">${props.icon}</span>
      <svg v-else class="icon" viewBox="0 0 20 20" aria-hidden="true">
        <path d="m5.5 11 4.5-4.5 4.5 4.5M10 6.5V15"></path>
      </svg>
    </slot>
  </button>
`);

export { BackTop };
