import {
  defineProps,
  defineStyle,
  onUnmounted,
  useComputed,
  useEffect,
  useHostFlag,
  useRef,
  defineHtml,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { SkeletonProps, SkeletonThrottle } from "./types";

export type {
  SkeletonProps,
  SkeletonThrottle,
  SkeletonThrottleOptions,
  SkeletonVariant,
} from "./types";

const props = defineProps({
  variant: { type: String, default: "text" },
  width: { type: String, default: "" },
  height: { type: String, default: "" },
  animated: { type: Boolean, default: false },
  count: { type: Number, default: 1 },
  loading: { type: Boolean, default: false },
  rows: { type: Number, default: 3 },
  throttle: { type: [Number, Object], default: 0 },
  // Kit extension retained for hand-built skeleton layouts.
  gap: { type: String, default: "12px" },
}) as unknown as Readonly<SkeletonProps>;

const visible = useRef(false);
let timer: ReturnType<typeof setTimeout> | undefined;

const clearTimer = (): void => {
  if (timer !== undefined) {
    clearTimeout(timer);
    timer = undefined;
  }
};

const defaultSize = useComputed(() => {
  switch (props.variant) {
    case "circle":
      return { w: "48px", h: "48px" };
    case "rect":
      return { w: "100%", h: "48px" };
    case "image":
      return { w: "100%", h: "200px" };
    default:
      return { w: "100%", h: "16px" };
  }
});

const width = useComputed(() => props.width || defaultSize.peek().w);
const height = useComputed(() => props.height || defaultSize.peek().h);
const groups = useComputed(() =>
  Array.from({ length: Math.max(1, Math.floor(Number(props.count) || 1)) }, (_, index) => index),
);
const lines = useComputed(() => {
  const count = props.variant === "text" ? Math.max(1, Math.floor(Number(props.rows) || 1)) : 1;
  return Array.from({ length: count }, (_, index) => index);
});
const ariaBusy = useComputed(() => (visible.value ? "true" : "false"));

const throttleDelay = (show: boolean): number => {
  const throttle = props.throttle as SkeletonThrottle;
  if (typeof throttle === "number") return show ? Math.max(0, throttle) : 0;
  if (!throttle || typeof throttle !== "object") return 0;
  return Math.max(0, Number(show ? throttle.leading : throttle.trailing) || 0);
};

useEffect(() => {
  const show = Boolean(props.loading);
  clearTimer();

  const delay = throttleDelay(show);
  if (delay === 0) {
    visible.set(show);
    return;
  }

  timer = setTimeout(() => {
    visible.set(show);
    timer = undefined;
  }, delay);
});

onUnmounted(clearTimer);
useHostFlag("animated", () => Boolean(props.animated));
defineStyle(styles);

const Skeleton = defineHtml(`
  <div class="root" :aria-busy=${ariaBusy}>
    <div v-if=${visible} class="placeholder" role="status" aria-label="Loading">
      <slot name="template">
        <div v-for="group in groups" :key="group" class="group" :style=${{ gap: props.gap }}>
          <div
            v-for="line in lines"
            :key="line"
            class="skeleton"
            part="skeleton"
            :style=${{ width, height }}
          ></div>
        </div>
      </slot>
    </div>
    <div v-if=${!visible} class="content"><slot></slot></div>
  </div>
`);

export { Skeleton };
