import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  useComputed,
  useEffect,
  useHostAttr,
  useHostCssVar,
  useScrollLock,
  useTemplateRef
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { LoadingEmits, LoadingProps, LoadingSlots, LoadingVariant } from "./types";
import { useLocaleProvider } from "../../Providers/context";

export type {
  LoadingDirectiveValue,
  LoadingEmits,
  LoadingInstance,
  LoadingOptions,
  LoadingProps,
  LoadingSlots,
  LoadingTarget,
  LoadingVariant
} from "./types";

const props = defineProps<LoadingProps>({
  loading: { type: Boolean, default: false },
  text: { type: String, default: "" },
  fullscreen: { type: Boolean, default: false },
  background: { type: String, default: "rgba(255,255,255,0.72)" },
  closable: { type: Boolean, default: false },
  variant: { type: String, default: "spinner" },
  svg: { type: String, default: "" },
  svgViewBox: { type: String, default: "0 0 50 50" },
  lock: { type: Boolean, default: false }
});

const emit = defineEmits<LoadingEmits>();
const locale = useLocaleProvider();
const overlayRef = useTemplateRef<HTMLElement>("overlayEl");

const normalizedVariant = (): LoadingVariant => {
  const variant = String(props.variant || "spinner") as LoadingVariant;
  return ["dots", "pulse", "bars"].includes(variant) ? variant : "spinner";
};
const isInteractiveFullscreen = (): boolean => props.fullscreen && props.closable;
const overlayRole = (): "dialog" | "status" => (isInteractiveFullscreen() ? "dialog" : "status");
const variant = useComputed(normalizedVariant);
const interactiveFullscreen = useComputed(isInteractiveFullscreen);
const indicatorClasses = useComputed(() => ["indicator", `is-${variant.value}`]);
const hasSvg = useComputed(() => Boolean(props.svg));
const showSpinner = useComputed(() => !hasSvg.value && variant.value === "spinner");
const showDots = useComputed(() => variant.value === "dots");
const showPulse = useComputed(() => variant.value === "pulse");
const showBars = useComputed(() => variant.value === "bars");

const close = (): void => {
  emit("update:loading", false);
  emit("close");
};

useHostAttr("fullscreen", () => (props.fullscreen ? "" : null));
useHostCssVar("--_loading-bg", () => props.background || "rgba(255,255,255,0.72)");
useScrollLock(() => props.loading && props.fullscreen && props.lock);

useEffect(() => {
  void props.loading;
  void props.fullscreen;
  if (!props.loading || !props.fullscreen) return;
  queueMicrotask(() => {
    const overlay = overlayRef.value;
    if (!overlay || overlay.matches(":popover-open")) return;
    overlay.showPopover?.();
  });
});

defineStyle(styles);

const Loading = defineHtml<LoadingProps, LoadingEmits, LoadingSlots>(`
  <div class="loading" part="loading">
    <slot></slot>
    <div
      v-if=${props.loading}
      ref="overlayEl"
      class="overlay"
      part="overlay"
      :popover=${props.fullscreen ? "manual" : undefined}
      :role=${overlayRole()}
      :aria-modal=${interactiveFullscreen ? "true" : null}
      :aria-label=${props.text || locale.t("loading.active")}
    >
      <div class="box">
        <span :class=${indicatorClasses} aria-hidden="true">
          <svg
            v-if=${hasSvg}
            class="custom-spinner"
            :viewBox=${props.svgViewBox}
            focusable="false"
          >
            <path :d=${props.svg}></path>
          </svg>
          <span v-if=${showSpinner} class="spinner"></span>
          <span v-if=${showDots} class="dot"></span>
          <span v-if=${showDots} class="dot"></span>
          <span v-if=${showDots} class="dot"></span>
          <span v-if=${showPulse} class="pulse"></span>
          <span v-if=${showBars} class="bar"></span>
          <span v-if=${showBars} class="bar"></span>
          <span v-if=${showBars} class="bar"></span>
        </span>
        <span v-if=${props.text} class="loading-text">${props.text}</span>
      </div>
      <button
        v-if=${props.fullscreen && props.closable}
        class="close"
        type="button"
        :aria-label=${locale.t("loading.exitFullscreen")}
        @click=${close}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <path d="M5 5l10 10M15 5L5 15"></path>
        </svg>
        <span>${locale.t("loading.exitFullscreen")}</span>
      </button>
    </div>
  </div>
`);

export { Loading };
