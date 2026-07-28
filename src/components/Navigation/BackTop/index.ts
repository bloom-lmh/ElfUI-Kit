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
import {
  getScrollPosition,
  resolveScrollContainer,
  type ScrollContainer,
} from "../../../composables/scroll";
import type {
  GoToOptions,
  GoToTask,
} from "../../../composables/goTo";
import { useGoTo } from "../../../composables/useGoTo";
import type { BackTopProps, BackTopShape, BackTopSlots } from "./types";

export type { BackTopElement, BackTopProps, BackTopShape, BackTopSlots } from "./types";

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
  duration: { type: Number, default: undefined },
  easing: { type: null, default: undefined },
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
const goTo = useGoTo();

const visible = useRef(false);

let scrollTarget: ScrollContainer | null = null;
let scrollTask: GoToTask | null = null;

let cleanup = (): void => {};
let mounted = false;

const getContainer = (): ScrollContainer => {
  const root = host.getRootNode() as Document | ShadowRoot;
  return resolveScrollContainer(props.target, root) ?? host;
};

const getScrollTop = (container: ScrollContainer): number =>
  getScrollPosition(container);

const motionOptions = (): GoToOptions => ({
  ...(props.smooth
    ? props.duration === undefined
      ? {}
      : { duration: props.duration }
    : { duration: 0 }),
  ...(props.easing === undefined ? {} : { easing: props.easing }),
});

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

const scrollToTop = (): void => {
  if (props.disabled) return;
  const target = scrollTarget || getContainer();
  scrollTask?.cancel();
  scrollTask = goTo(0, {
    container: target,
    ...motionOptions(),
  });
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
  scrollTask?.cancel();
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
