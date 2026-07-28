// elf-tooltip — 文字气泡提示
//
//   <elf-tooltip content="这是提示文字" placement="top">
//     <elf-button>悬浮我</elf-button>
//   </elf-tooltip>

import {
  defineExpose,
  defineEmits,
  defineProps,
  defineStyle,
  onBeforeUnmount,
  onMounted,
  useComputed,
  useEffect,
  useHost,
  useRef,
  defineHtml
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { TooltipEmits, TooltipExpose, TooltipProps, TooltipSlots } from "./types";
import { useDismissibleOverlay } from "../../../composables/useDismissibleOverlay";

export type {
  TooltipElement,
  TooltipEmits,
  TooltipExpose,
  TooltipProps,
  TooltipSlots
} from "./types";

const props = defineProps({
  content: { type: String, default: "" },
  placement: { type: String, default: "top" },
  disabled: { type: Boolean, default: false },
  trigger: { type: String, default: "hover" },
  showAfter: { type: Number, default: 0 },
  hideAfter: { type: Number, default: 0 },
  effect: { type: String, default: "dark" },
  maxWidth: { type: null, default: 240 },
  visible: { type: Boolean, default: undefined },
  touchLongPress: { type: Boolean, default: true },
  longPressDelay: { type: Number, default: 500 },
  longPressTolerance: { type: Number, default: 10 }
}) as unknown as Readonly<TooltipProps>;

const host = useHost();
const emit = defineEmits<TooltipEmits>();

const visible = useRef(false);
const rendered = useRef(false);
const closing = useRef(false);
const resolvedPlacement = useRef("top");
const touchOpen = useRef(false);

const nextId = (): string => {
  const store = globalThis as typeof globalThis & { __elfTooltipIdSeed?: number };
  store.__elfTooltipIdSeed = (store.__elfTooltipIdSeed ?? 0) + 1;
  return `elf-tooltip-${store.__elfTooltipIdSeed}`;
};

const tooltipId = nextId();
const describedBySnapshot = new Map<HTMLElement, string | null>();
const connectedTriggers = new Set<HTMLElement>();

let showTimer: ReturnType<typeof setTimeout> | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;
let longPressTimer: ReturnType<typeof setTimeout> | null = null;
let touchStartX = 0;
let touchStartY = 0;

const clearTimers = (): void => {
  if (showTimer) clearTimeout(showTimer);
  if (hideTimer) clearTimeout(hideTimer);
  showTimer = null;
  hideTimer = null;
};

const clearLongPress = (): void => {
  if (longPressTimer) clearTimeout(longPressTimer);
  longPressTimer = null;
};

const triggerElements = (): HTMLElement[] =>
  Array.from(host.children).filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement && element.getAttribute("slot") !== "content"
  );

const syncAccessibleDescription = (active: boolean): void => {
  if (!active) {
    for (const [element, previousValue] of describedBySnapshot) {
      if (!element.isConnected) continue;
      if (previousValue === null) element.removeAttribute("aria-describedby");
      else element.setAttribute("aria-describedby", previousValue);
    }
    describedBySnapshot.clear();
    return;
  }

  for (const element of triggerElements()) {
    if (!describedBySnapshot.has(element)) {
      describedBySnapshot.set(element, element.getAttribute("aria-describedby"));
    }
    const tokens = new Set((element.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean));
    tokens.add(tooltipId);
    element.setAttribute("aria-describedby", Array.from(tokens).join(" "));
  }
};

const resolvePlacement = (): void => {
  const tooltip = host.shadowRoot?.querySelector<HTMLElement>(".tooltip-content");
  if (!tooltip || !visible.value) return;

  const requested = String(props.placement || "top");
  const triggerRect = host.getBoundingClientRect();
  const requiredWidth = tooltip.offsetWidth + 12;
  const requiredHeight = tooltip.offsetHeight + 12;
  const available: Record<string, number> = {
    top: triggerRect.top,
    bottom: window.innerHeight - triggerRect.bottom,
    left: triggerRect.left,
    right: window.innerWidth - triggerRect.right
  };

  if (requested === "auto") {
    const candidates = ["top", "bottom", "right", "left"];
    const fitting = candidates.find((placement) =>
      placement === "top" || placement === "bottom"
        ? (available[placement] ?? 0) >= requiredHeight
        : (available[placement] ?? 0) >= requiredWidth
    );
    resolvedPlacement.set(
      fitting ?? candidates.reduce((best, placement) =>
        (available[placement] ?? 0) > (available[best] ?? 0) ? placement : best
      )
    );
    return;
  }

  const opposite: Record<string, string> = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left"
  };
  const required = requested === "top" || requested === "bottom" ? requiredHeight : requiredWidth;
  const alternative = opposite[requested] ?? "top";
  resolvedPlacement.set(
    (available[requested] ?? 0) < required &&
      (available[alternative] ?? 0) > (available[requested] ?? 0)
      ? alternative
      : requested
  );
};

const schedulePlacement = (): void => {
  queueMicrotask(() => queueMicrotask(resolvePlacement));
};

const show = (): void => {
  if (props.disabled) return;
  clearTimers();
  if (visible.peek()) return;
  emit("before-show");
  const delay = Number(props.showAfter) || 0;
  if (delay > 0) {
    showTimer = setTimeout(() => {
      visible.set(true);
      showTimer = null;
    }, delay);
  } else {
    visible.set(true);
  }
};

const hide = (): void => {
  touchOpen.set(false);
  clearLongPress();
  clearTimers();
  if (!visible.peek()) return;
  emit("before-hide");
  const delay = Number(props.hideAfter) || 0;
  if (delay > 0) {
    hideTimer = setTimeout(() => {
      visible.set(false);
      hideTimer = null;
    }, delay);
  } else {
    visible.set(false);
  }
};

const dismissibleOverlay = useDismissibleOverlay({
  kind: "tooltip",
  containers: () => [
    host,
    host.shadowRoot?.querySelector<HTMLElement>(".tooltip-content"),
  ],
  closeOnEscape: () => true,
  closeOnOutside: () =>
    props.trigger === "click" ||
    props.trigger === "contextmenu" ||
    touchOpen.peek(),
  onRequestClose: () => hide(),
});

useEffect(() => {
  const isVisible = visible.value;
  if (isVisible) {
    if (!dismissibleOverlay.isActive()) dismissibleOverlay.activate();
    const isEntering = !rendered.peek();
    rendered.set(true);
    closing.set(false);
    syncAccessibleDescription(true);
    schedulePlacement();
    if (isEntering) emit("show");
  } else {
    dismissibleOverlay.deactivate();
    syncAccessibleDescription(false);
    if (rendered.peek() && !closing.peek()) {
      closing.set(true);
      const timer = setTimeout(() => {
        rendered.set(false);
        closing.set(false);
        emit("hide");
      }, 150);
      return () => clearTimeout(timer);
    }
  }
});

useEffect(() => {
  if (props.trigger === "manual" || props.visible !== undefined) {
    if (props.visible !== undefined) {
      visible.set(Boolean(props.visible));
    }
  }
});

const onMouseEnter = (): void => {
  if (props.trigger !== "hover") return;
  show();
};

const onMouseLeave = (): void => {
  if (props.trigger !== "hover") return;
  hide();
};

const onFocusIn = (): void => {
  if (props.trigger !== "focus") return;
  show();
};

const onFocusOut = (): void => {
  if (props.trigger !== "focus") return;
  hide();
};

const onClick = (event?: MouseEvent): void => {
  if (props.trigger !== "click") return;
  event?.stopPropagation();
  if (visible.value) {
    hide();
  } else {
    show();
  }
};

const onContextMenu = (e: MouseEvent): void => {
  if (props.trigger !== "contextmenu") return;
  e.preventDefault();
  e.stopPropagation();
  if (visible.value) {
    hide();
  } else {
    show();
  }
};

const supportsTouchLongPress = (): boolean =>
  props.touchLongPress !== false && (props.trigger === "hover" || props.trigger === "focus");

const onPointerDown = (event: PointerEvent): void => {
  if (event.pointerType !== "touch" || !supportsTouchLongPress() || props.disabled) return;
  clearLongPress();
  if (touchOpen.peek()) {
    hide();
    return;
  }
  touchStartX = event.clientX;
  touchStartY = event.clientY;
  const delay = Math.max(120, Number(props.longPressDelay) || 500);
  longPressTimer = setTimeout(() => {
    clearTimers();
    touchOpen.set(true);
    visible.set(true);
    longPressTimer = null;
  }, delay);
};

const onPointerMove = (event: PointerEvent): void => {
  if (event.pointerType !== "touch" || !longPressTimer) return;
  const distance = Math.hypot(event.clientX - touchStartX, event.clientY - touchStartY);
  if (distance > Math.max(2, Number(props.longPressTolerance) || 10)) clearLongPress();
};

const onPointerEnd = (event: PointerEvent): void => {
  if (event.pointerType !== "touch") return;
  clearLongPress();
  if (event.type === "pointercancel" && touchOpen.peek()) hide();
};

const connectTriggerEvents = (): void => {
  disconnectTriggerEvents();
  for (const element of triggerElements()) {
    element.addEventListener("mouseenter", onMouseEnter);
    element.addEventListener("mouseleave", onMouseLeave);
    element.addEventListener("focusin", onFocusIn);
    element.addEventListener("focusout", onFocusOut);
    element.addEventListener("click", onClick);
    element.addEventListener("contextmenu", onContextMenu);
    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", onPointerEnd);
    element.addEventListener("pointercancel", onPointerEnd);
    connectedTriggers.add(element);
  }
};

const disconnectTriggerEvents = (): void => {
  for (const element of connectedTriggers) {
    element.removeEventListener("mouseenter", onMouseEnter);
    element.removeEventListener("mouseleave", onMouseLeave);
    element.removeEventListener("focusin", onFocusIn);
    element.removeEventListener("focusout", onFocusOut);
    element.removeEventListener("click", onClick);
    element.removeEventListener("contextmenu", onContextMenu);
    element.removeEventListener("pointerdown", onPointerDown);
    element.removeEventListener("pointermove", onPointerMove);
    element.removeEventListener("pointerup", onPointerEnd);
    element.removeEventListener("pointercancel", onPointerEnd);
  }
  connectedTriggers.clear();
};

const tooltipClass = useComputed((): string => {
  const p = resolvedPlacement.value || "top";
  const eff = props.effect || "dark";
  return `tooltip-content ${p} ${eff} ${closing.value ? "closing" : "active"}`;
});

const tooltipStyle = (): Record<string, string> => ({
  "--elf-tooltip-max-width":
    typeof props.maxWidth === "number" ? `${Math.max(80, props.maxWidth)}px` : String(props.maxWidth || "240px")
});

onMounted(connectTriggerEvents);

onBeforeUnmount(() => {
  disconnectTriggerEvents();
  clearTimers();
  clearLongPress();
  syncAccessibleDescription(false);
});

defineExpose<TooltipExpose>({
  show,
  hide,
  isVisible: () => visible.value,
  updatePosition: resolvePlacement
});

defineStyle(styles);

const Tooltip = defineHtml<TooltipProps, TooltipEmits, TooltipSlots>(`
  <div
    class="tooltip-container"
    part="container"
    @mouseenter=${onMouseEnter}
    @mouseleave=${onMouseLeave}
    @focusin=${onFocusIn}
    @focusout=${onFocusOut}
    @click.stop=${onClick}
    @contextmenu=${onContextMenu}
    @pointerdown=${onPointerDown}
    @pointermove=${onPointerMove}
    @pointerup=${onPointerEnd}
    @pointercancel=${onPointerEnd}
  >
    <slot @slotchange=${connectTriggerEvents}></slot>
    <div
      v-if=${rendered}
      :id=${tooltipId}
      :class=${tooltipClass}
      :style=${tooltipStyle()}
      part="content"
      role="tooltip"
    >
      <slot name="content">${props.content}</slot>
      <div class="arrow" part="arrow"></div>
    </div>
  </div>
`);

export { Tooltip };
