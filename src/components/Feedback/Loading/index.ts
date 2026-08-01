import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  onBeforeUnmount,
  useComputed,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useRef,
  useScrollLock,
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
  LoadingVariant,
} from "./types";

const props = defineProps<LoadingProps>({
  loading: { type: Boolean, default: false },
  text: { type: String, default: "" },
  fullscreen: { type: Boolean, default: false },
  background: { type: String, default: "rgba(255,255,255,0.72)" },
  closable: { type: Boolean, default: false },
  plain: { type: Boolean, default: false },
  variant: { type: String, default: "spinner" },
  svg: { type: String, default: "" },
  svgViewBox: { type: String, default: "0 0 50 50" },
  lock: { type: Boolean, default: false },
});

const emit = defineEmits<LoadingEmits>(["update:loading", "close", "closed"]);
const locale = useLocaleProvider();
const rendered = useRef(false);

let activeOverlay: HTMLElement | null = null;
let completionPending = false;

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
useHostFlag("plain", () => props.plain);
useHostCssVar("--_loading-bg", () => props.background || "rgba(255,255,255,0.72)");
/** Keeps the shared Core scroll-lock lease until the final leave completes. */
useScrollLock(() => rendered.value && props.lock);

const showTopLayer = (element: HTMLElement): void => {
  if (!props.fullscreen) return;
  try {
    element.showPopover?.();
  } catch {
    // A rapid replacement can update the native popover state before this hook runs.
  }
};

const hideTopLayer = (element: Element): void => {
  try {
    (element as HTMLElement & { hidePopover?: () => void }).hidePopover?.();
  } catch {
    // Disconnecting a popover already removes it from the Top Layer.
  }
};

const completeLoadingCycle = (): void => {
  if (!completionPending) return;
  completionPending = false;
  emit("closed");
};

/** Starts one structural Loading transaction after Transition inserts the overlay. */
const onBeforeEnter = (element: Element): void => {
  const overlay = element as HTMLElement;
  activeOverlay = overlay;
  completionPending = true;
  rendered.set(true);
  showTopLayer(overlay);
};

const onAfterEnter = (element: Element): void => {
  if (activeOverlay !== element || !props.loading) return;
  if (props.fullscreen && props.closable) {
    (element as HTMLElement).querySelector<HTMLButtonElement>(".close")?.focus();
  }
};

/** Releases Top Layer and scroll-lock ownership only for the final active leave. */
const onAfterLeave = (element: Element): void => {
  hideTopLayer(element);
  if (activeOverlay !== element || props.loading) return;
  activeOverlay = null;
  rendered.set(false);
  completeLoadingCycle();
};

onBeforeUnmount(() => {
  if (activeOverlay) hideTopLayer(activeOverlay);
  activeOverlay = null;
  rendered.set(false);
  completeLoadingCycle();
});

defineStyle(styles);

const Loading = defineHtml<LoadingProps, LoadingEmits, LoadingSlots>(`
  <div class="loading" part="loading">
    <slot></slot>
    <Transition
      name="elf-loading"
      appear
      @before-enter=${onBeforeEnter}
      @after-enter=${onAfterEnter}
      @after-leave=${onAfterLeave}
    >
      <div
        v-if=${props.loading}
        class="overlay"
        part="overlay"
        :popover=${props.fullscreen ? "manual" : undefined}
        :role=${overlayRole()}
        :aria-modal=${interactiveFullscreen ? "true" : null}
        :aria-label=${props.text || locale.t("loading.active")}
      >
        <div class="box" part="box">
          <span :class=${indicatorClasses} part="indicator" aria-hidden="true">
            <slot name="indicator">
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
            </slot>
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
    </Transition>
  </div>
`);

export { Loading };
