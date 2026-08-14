// elf-tour — 漫游式引导

import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onBeforeUnmount,
  useEffect,
  useEventListener,
  useHost,
  useHostFlag,
  useIntersectionObserver,
  useRef,
  useResizeObserver,
  useTemplateRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { TourEmits, TourExpose, TourPlacement, TourProps, TourSlots, TourStep } from "./types";
import { useLocaleProvider } from "../../Providers/context";
import { useGoTo } from "../../../composables/useGoTo";
import { findScrollContainer } from "../../../composables/scroll";
import type { GoToTask } from "../../../composables/goTo";
import { useModalOverlay } from "../../../composables/useModalOverlay";
import { useGlobalStyle } from "../../../composables/useGlobalStyle";
import { createMutateController } from "../../../directives/observers";

export type {
  TourChangeDetail,
  TourElement,
  TourEmits,
  TourExpose,
  TourPlacement,
  TourProps,
  TourSlots,
  TourStep,
} from "./types";

let tourLayerId = 0;

// Tour 内容通过 Teleport 挂到 body，必须同时提供全局样式；仅注入 Shadow DOM
// 会让遮罩和步骤面板失去布局，这也是页面上“引导无效果”的根因。
useGlobalStyle("kit-tour", styles);

interface TargetBox {
  left: number;
  top: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}

const props = defineProps<TourProps>({
  steps: { type: Array, default: () => [] as TourStep[] },
  visible: { type: Boolean, default: false },
  current: { type: Number, default: 0 },
  maskClosable: { type: Boolean, default: true },
  keyboard: { type: Boolean, default: true },
  closeOnPressEscape: { type: Boolean, default: true },
  showClose: { type: Boolean, default: true },
  mask: { type: Boolean, default: true },
  lockScroll: { type: Boolean, default: true },
  gap: { type: Number, default: 12 },
  zIndex: { type: Number, default: 3000 },
  contentStyle: { type: Object, default: () => ({}) },
});

const emit = defineEmits<TourEmits>(["update:current", "change", "close", "finish"]);

const locale = useLocaleProvider();
const goTo = useGoTo();

const host = useHost();
const overlayRef = useTemplateRef<HTMLElement>("overlay");
const panelRef = useTemplateRef<HTMLElement>("panel");
const layerId = useRef(`elf-tour-layer-${++tourLayerId}`);
const currentStep = useRef(0);
const openState = useRef(false);
const rendered = useRef(false);
const closing = useRef(false);
const targetBox = useRef<TargetBox | null>(null);
const hostVisible = useRef(true);

let frameId = 0;
let lastPropCurrent = 0;
let activeRoot: HTMLElement | null = null;
let targetObservers: Array<ReturnType<typeof createMutateController>> = [];
let targetScrollTask: GoToTask | null = null;

const steps = (): TourStep[] => (Array.isArray(props.steps) ? (props.steps as TourStep[]) : []);
const stepCount = (): number => steps().length;
const clampIndex = (index: number): number => {
  const max = Math.max(0, stepCount() - 1);
  return Math.min(max, Math.max(0, Math.trunc(index) || 0));
};
const activeStep = (): TourStep | null => steps()[currentStep.value] ?? null;
const placement = (): TourPlacement => {
  const value = activeStep()?.placement;
  return value === "top" || value === "left" || value === "right" ? value : "bottom";
};
const isFirstStep = (): boolean => currentStep.value <= 0;
const isLastStep = (): boolean => currentStep.value >= stepCount() - 1;
const currentNumber = (): number => currentStep.value + 1;
const nextButtonText = (): string =>
  activeStep()?.nextText || locale.t(isLastStep() ? "common.done" : "common.next");
const prevButtonText = (): string => activeStep()?.prevText || locale.t("common.previous");

const resolveTarget = (): Element | null => {
  const step = activeStep();
  if (!step?.target) return null;
  const root = host.getRootNode() as Document | ShadowRoot;
  return root.querySelector(step.target) || document.querySelector(step.target);
};

const updateTarget = (): void => {
  const el = resolveTarget();
  if (!el) {
    targetBox.set(null);
    return;
  }
  const rect = el.getBoundingClientRect();
  targetBox.set({
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    right: rect.right,
    bottom: rect.bottom,
  });
};

const scheduleUpdate = (): void => {
  if (!openState.peek() || closing.peek()) return;
  if (frameId) cancelAnimationFrame(frameId);
  frameId = requestAnimationFrame(() => {
    frameId = 0;
    updateTarget();
  });
};

const isTargetVisible = (
  target: Element,
  container: HTMLElement | null,
  padding: number,
): boolean => {
  const targetRect = target.getBoundingClientRect();
  const bounds = container?.getBoundingClientRect() ?? {
    top: 0,
    bottom: window.innerHeight,
  };
  return targetRect.top >= bounds.top + padding && targetRect.bottom <= bounds.bottom - padding;
};

const scrollToActiveTarget = (): void => {
  targetScrollTask?.cancel();
  targetScrollTask = null;
  const target = resolveTarget();
  if (!target) {
    scheduleUpdate();
    return;
  }
  const container = findScrollContainer(target);
  const padding = Math.max(16, Number(props.gap) || 0);
  if (isTargetVisible(target, container, padding)) {
    scheduleUpdate();
    return;
  }

  const task = goTo(target, {
    container,
    offset: padding,
  });
  targetScrollTask = task;
  void task.finished.then((result) => {
    if (targetScrollTask !== task) return;
    targetScrollTask = null;
    if (result.status === "completed") scheduleUpdate();
  });
};

const disconnectTargetObserver = (): void => {
  for (const observer of targetObservers) observer.dispose();
  targetObservers = [];
};

/** Connects the dynamic-target geometry resource for the active Tour transaction. */
const connectTargetObserver = (): void => {
  disconnectTargetObserver();
  const root = host.getRootNode();
  targetObservers.push(
    createMutateController(root, {
      handler: scheduleUpdate,
      observer: {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["id", "hidden"],
      },
    }),
  );
  if (root !== document && document.body) {
    targetObservers.push(
      createMutateController(document.body, {
        handler: scheduleUpdate,
        observer: { childList: true, subtree: true },
      }),
    );
  }
};

const resolveOverlay = (): HTMLElement | null =>
  overlayRef.peek() || document.getElementById(layerId.peek());
const resolvePanel = (): HTMLElement | null =>
  panelRef.peek() || resolveOverlay()?.querySelector<HTMLElement>(".tour-panel") || null;

const open = (): void => {
  if (stepCount() === 0) return;
  lastPropCurrent = clampIndex(Number(props.current) || 0);
  currentStep.set(lastPropCurrent);
  openState.set(true);
};

const close = (): void => {
  if (!openState.peek() || closing.peek()) return;
  openState.set(false);
};

const setCurrent = (index: number): void => {
  const next = clampIndex(index);
  if (next === currentStep.value) return;
  const step = steps()[next] ?? null;
  currentStep.set(next);
  emit("update:current", next);
  emit("change", { current: next, step });
  scheduleUpdate();
  overlay.scheduleInitialFocus();
};

const prev = (): void => setCurrent(currentStep.value - 1);

const finish = (): void => {
  emit("finish");
  close();
};

const next = (): void => {
  if (isLastStep()) {
    finish();
    return;
  }
  setCurrent(currentStep.value + 1);
};

const skip = (): void => close();

const onLayerClick = (event: MouseEvent): void => {
  if (props.maskClosable && event.target === event.currentTarget && overlay.claim(event)) close();
};

const onKeydown = (event: KeyboardEvent): void => {
  if (
    !props.keyboard ||
    !rendered.value ||
    closing.value ||
    !overlay.isTopmost() ||
    event.defaultPrevented ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey
  )
    return;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    event.preventDefault();
    next();
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    event.preventDefault();
    prev();
  }
};

const highlightStyle = (): Record<string, string> => {
  const box = targetBox.value;
  if (!box) return {};
  const gap = Math.max(0, Number(props.gap) || 0);
  return {
    left: `${Math.max(8, box.left - gap)}px`,
    top: `${Math.max(8, box.top - gap)}px`,
    width: `${Math.max(0, box.width + gap * 2)}px`,
    height: `${Math.max(0, box.height + gap * 2)}px`,
  };
};

const bubbleStyle = (): Record<string, string> => {
  const box = targetBox.value;
  if (!box) {
    return {
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: String((Number(props.zIndex) || 3000) + 2),
    };
  }
  const gap = Math.max(8, Number(props.gap) || 12) + 8;
  const viewportPadding = 16;
  const panelRect = panelRef.peek()?.getBoundingClientRect();
  const panelWidth = panelRect?.width || Math.min(360, window.innerWidth - viewportPadding * 2);
  const panelHeight = panelRect?.height || 220;
  const maxPanelLeft = window.innerWidth - viewportPadding - panelWidth;
  const maxPanelTop = window.innerHeight - viewportPadding - panelHeight;
  let p = placement();

  if (
    p === "bottom" &&
    box.bottom + gap + panelHeight > window.innerHeight - viewportPadding &&
    box.top - gap - panelHeight >= viewportPadding
  ) {
    p = "top";
  } else if (
    p === "top" &&
    box.top - gap - panelHeight < viewportPadding &&
    box.bottom + gap + panelHeight <= window.innerHeight - viewportPadding
  ) {
    p = "bottom";
  } else if (
    p === "right" &&
    box.right + gap + panelWidth > window.innerWidth - viewportPadding &&
    box.left - gap - panelWidth >= viewportPadding
  ) {
    p = "left";
  } else if (
    p === "left" &&
    box.left - gap - panelWidth < viewportPadding &&
    box.right + gap + panelWidth <= window.innerWidth - viewportPadding
  ) {
    p = "right";
  }

  let left = box.left + box.width / 2;
  let top = box.bottom + gap;
  let transform = "translate(-50%, 0)";

  if (p === "top") {
    top = Math.max(viewportPadding + panelHeight, box.top - gap);
    transform = "translate(-50%, -100%)";
  } else if (p === "left") {
    left = Math.max(viewportPadding + panelWidth, box.left - gap);
    top = box.top + box.height / 2;
    transform = "translate(-100%, -50%)";
  } else if (p === "right") {
    left = Math.min(maxPanelLeft, box.right + gap);
    top = box.top + box.height / 2;
    transform = "translate(0, -50%)";
  } else {
    top = Math.min(maxPanelTop, box.bottom + gap);
  }

  if (p === "top" || p === "bottom") {
    left = Math.min(
      window.innerWidth - viewportPadding - panelWidth / 2,
      Math.max(viewportPadding + panelWidth / 2, left),
    );
  } else {
    top = Math.min(
      window.innerHeight - viewportPadding - panelHeight / 2,
      Math.max(viewportPadding + panelHeight / 2, top),
    );
  }

  return {
    left: `${left}px`,
    top: `${top}px`,
    transform,
    zIndex: String((Number(props.zIndex) || 3000) + 2),
  };
};

const layerStyle = (): Record<string, string> => ({ zIndex: String(Number(props.zIndex) || 3000) });
const hasTarget = (): boolean => Boolean(targetBox.value);
const panelStyle = (): Record<string, string> => ({
  ...bubbleStyle(),
  ...(props.contentStyle || {}),
});

const overlay = useModalOverlay({
  kind: "tour",
  panel: resolvePanel,
  rendered: () => rendered.value,
  closing: () => closing.value,
  closeOnEscape: () => Boolean(props.keyboard && props.closeOnPressEscape),
  lockScroll: () => Boolean(props.lockScroll),
  onRequestClose: close,
});

/** Starts target tracking and the shared modal transaction for one inserted Tour root. */
const onBeforeEnter = (element: Element): void => {
  activeRoot = element as HTMLElement;
  rendered.set(true);
  closing.set(false);
  if (!overlay.isActive()) overlay.activate();
  connectTargetObserver();
  scheduleUpdate();
  overlay.scheduleInitialFocus();
};

/** Releases stack ownership while retaining scroll lock until the structural leave finishes. */
const onBeforeLeave = (element: Element): void => {
  if (activeRoot !== element || closing.peek()) return;
  closing.set(true);
  overlay.beginClose("programmatic");
  disconnectTargetObserver();
  targetScrollTask?.cancel();
  targetScrollTask = null;
};

/** Completes focus, scroll, geometry, and event cleanup for the final active root. */
const onAfterLeave = (element: Element): void => {
  if (activeRoot !== element || openState.peek()) return;
  activeRoot = null;
  if (overlay.state() === "closing") overlay.completeClose();
  rendered.set(false);
  closing.set(false);
  targetBox.set(null);
  emit("close");
};

useEffect(() => {
  if (props.visible) open();
  else if (openState.peek()) close();
});

useEffect(() => {
  const next = clampIndex(Number(props.current) || 0);
  if (next === lastPropCurrent) return;
  lastPropCurrent = next;
  currentStep.set(next);
  scheduleUpdate();
});

useEffect(() => {
  void currentStep.value;
  if (!rendered.value || closing.value) return;
  scrollToActiveTarget();
});

useEventListener(window, "keydown", onKeydown);
useEventListener(window, "scroll", scheduleUpdate, { passive: true });
useEventListener(window, "resize", scheduleUpdate);
useResizeObserver(host, scheduleUpdate);
useIntersectionObserver(host, (entry) => {
  hostVisible.set(entry.isIntersecting);
  scheduleUpdate();
});
useHostFlag("data-open", () => openState.value);
useHostFlag("data-visible", () => hostVisible.value);

onBeforeUnmount(() => {
  disconnectTargetObserver();
  targetScrollTask?.cancel();
  targetScrollTask = null;
  if (frameId) cancelAnimationFrame(frameId);
  activeRoot = null;
  openState.set(false);
  rendered.set(false);
  closing.set(false);
  targetBox.set(null);
});

defineExpose<TourExpose>({ prev, next, skip, finish, close, open });
defineStyle(styles);

const Tour = defineHtml<TourProps, TourEmits, TourSlots>(`
  <Teleport to="body">
    <Transition
      name="elf-tour"
      appear
      @before-enter=${onBeforeEnter}
      @before-leave=${onBeforeLeave}
      @after-leave=${onAfterLeave}
    >
      <div
        v-if=${openState}
        :id=${layerId}
        ref="overlay"
        class="tour-layer"
        :style=${layerStyle()}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        @click=${onLayerClick}
      >
        <div v-if=${props.mask && !hasTarget()} class="tour-backdrop"></div>
        <div v-if=${hasTarget()} class="tour-highlight" :class=${{ "without-mask": !props.mask }} :style=${highlightStyle()}></div>
        <section ref="panel" class="tour-panel" :class=${placement()} :style=${panelStyle()}>
          <header class="tour-header">
            <slot name="header">
              <slot name="indicators">
                <span class="tour-progress">${currentNumber()} / ${stepCount()}</span>
              </slot>
            </slot>
            <button
              v-if=${props.showClose}
              class="tour-close"
              type="button"
              data-autofocus
              :aria-label=${locale.t("tour.close")}
              @click=${skip}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18"></path>
              </svg>
            </button>
          </header>
          <div class="tour-body">
            <h3 class="tour-title">${activeStep()?.title}</h3>
            <p class="tour-content">${activeStep()?.content}</p>
          </div>
          <footer class="tour-footer">
            <button class="tour-button tour-button--text" type="button" @click=${skip}>${locale.t("common.skip")}</button>
            <span class="tour-spacer"></span>
            <button class="tour-button tour-button--text" type="button" :disabled=${isFirstStep()} @click=${prev}>
              ${prevButtonText()}
            </button>
            <button class="tour-button tour-button--primary" type="button" @click=${next}>${nextButtonText()}</button>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
`);

export { Tour };
