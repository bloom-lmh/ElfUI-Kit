import type { DirectiveDefinition, ElfUIApp } from "@elfui/core";

import {
  findScrollContainer,
  getMaxScrollPosition,
  getScrollPosition,
  resolveScrollContainer,
  type ScrollAxis,
  type ScrollContainer,
  type ScrollContainerTarget
} from "../composables/scroll";
import {
  createControllerDirective,
  registerDirective,
  type DirectiveController
} from "./controller";

export interface RippleOptions {
  disabled?: boolean;
  center?: boolean;
  color?: string;
  duration?: number;
}

export type RippleDirectiveValue = boolean | RippleOptions | undefined;

const normalizeRipple = (
  value: RippleDirectiveValue
): Required<RippleOptions> => {
  if (typeof value === "boolean") {
    return {
      disabled: !value,
      center: false,
      color: "currentColor",
      duration: 420
    };
  }
  return {
    disabled: value?.disabled ?? false,
    center: value?.center ?? false,
    color: value?.color ?? "currentColor",
    duration: Math.max(120, Number(value?.duration) || 420)
  };
};

export const createRippleController = (
  element: HTMLElement,
  initialValue: RippleDirectiveValue
): DirectiveController<RippleDirectiveValue> => {
  let options = normalizeRipple(initialValue);
  const originalPosition = element.style.position;
  const originalOverflow = element.style.overflow;
  const waves = new Set<HTMLElement>();

  if (getComputedStyle(element).position === "static") element.style.position = "relative";
  if (!element.style.overflow) element.style.overflow = "hidden";

  const createWave = (clientX?: number, clientY?: number): void => {
    if (options.disabled) return;
    const rect = element.getBoundingClientRect();
    const diameter = Math.hypot(rect.width, rect.height) * 2;
    const x = options.center || clientX == null ? rect.width / 2 : clientX - rect.left;
    const y = options.center || clientY == null ? rect.height / 2 : clientY - rect.top;
    const wave = document.createElement("span");
    wave.dataset.elfRipple = "";
    Object.assign(wave.style, {
      position: "absolute",
      zIndex: "0",
      pointerEvents: "none",
      width: `${diameter}px`,
      height: `${diameter}px`,
      left: `${x - diameter / 2}px`,
      top: `${y - diameter / 2}px`,
      borderRadius: "50%",
      background: options.color,
      opacity: "0.2",
      transform: "scale(0)",
      transition: `transform ${options.duration}ms ease-out, opacity ${options.duration}ms ease-out`
    });
    waves.add(wave);
    element.appendChild(wave);
    requestAnimationFrame(() => {
      wave.style.transform = "scale(1)";
      wave.style.opacity = "0";
    });
    setTimeout(() => {
      waves.delete(wave);
      wave.remove();
    }, options.duration + 40);
  };

  const onPointerDown = (event: PointerEvent): void => createWave(event.clientX, event.clientY);
  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Enter" || event.key === " ") createWave();
  };

  element.addEventListener("pointerdown", onPointerDown);
  element.addEventListener("keydown", onKeyDown);

  return {
    update(value) {
      options = normalizeRipple(value);
    },
    dispose() {
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("keydown", onKeyDown);
      waves.forEach((wave) => wave.remove());
      waves.clear();
      element.style.position = originalPosition;
      element.style.overflow = originalOverflow;
    }
  };
};

export const rippleDirective = createControllerDirective(createRippleController);

export interface ScrollDirectiveDetail {
  axis: ScrollAxis;
  position: number;
  maximum: number;
  progress: number;
  container: ScrollContainer;
  event?: Event | undefined;
}

export type ScrollDirectiveHandler = (detail: ScrollDirectiveDetail) => void;

export interface ScrollDirectiveOptions {
  handler: ScrollDirectiveHandler;
  target?: ScrollContainerTarget | undefined;
  axis?: ScrollAxis;
  disabled?: boolean;
  immediate?: boolean;
}

export type ScrollDirectiveValue = ScrollDirectiveHandler | ScrollDirectiveOptions;

const normalizeScroll = (
  value: ScrollDirectiveValue
): Required<Pick<ScrollDirectiveOptions, "handler" | "axis" | "disabled" | "immediate">> &
  Pick<ScrollDirectiveOptions, "target"> => {
  const options = typeof value === "function" ? { handler: value } : value;
  return {
    handler: options.handler,
    target: options.target,
    axis: options.axis ?? "y",
    disabled: options.disabled ?? false,
    immediate: options.immediate ?? true
  };
};

export const createScrollController = (
  element: HTMLElement,
  initialValue: ScrollDirectiveValue
): DirectiveController<ScrollDirectiveValue> => {
  let options = normalizeScroll(initialValue);
  let container: ScrollContainer | null = null;

  const notify = (event?: Event): void => {
    if (!container || options.disabled) return;
    const position = getScrollPosition(container, options.axis);
    const maximum = getMaxScrollPosition(container, options.axis);
    options.handler({
      axis: options.axis,
      position,
      maximum,
      progress: maximum > 0 ? Math.min(1, Math.max(0, position / maximum)) : 0,
      container,
      event
    });
  };

  const onScroll = (event: Event): void => notify(event);

  const disconnect = (): void => {
    container?.removeEventListener("scroll", onScroll);
    container = null;
  };

  const connect = (): void => {
    disconnect();
    if (options.disabled || typeof window === "undefined") return;
    container = options.target
      ? resolveScrollContainer(options.target, element.getRootNode() as Document | ShadowRoot)
      : findScrollContainer(element) ?? window;
    container?.addEventListener("scroll", onScroll, { passive: true });
    if (options.immediate) notify();
  };

  connect();
  return {
    update(value) {
      options = normalizeScroll(value);
      connect();
    },
    dispose: disconnect
  };
};

export const scrollDirective = createControllerDirective(createScrollController);

export type TooltipDirectivePlacement = "top" | "bottom" | "left" | "right";

export interface TooltipDirectiveOptions {
  content: string;
  placement?: TooltipDirectivePlacement;
  disabled?: boolean;
  showDelay?: number;
  hideDelay?: number;
}

export type TooltipDirectiveValue = string | TooltipDirectiveOptions;

let tooltipSeed = 0;

const TOOLTIP_THEME_VARIABLES = [
  "--elf-text-primary",
  "--elf-bg-paper",
  "--elf-font-family",
  "--elf-radius-sm",
  "--elf-shadow-2"
] as const;

const inheritCssVariables = (
  source: HTMLElement,
  target: HTMLElement,
  variables: readonly string[]
): void => {
  const computed = getComputedStyle(source);
  variables.forEach((variable) => {
    const value = computed.getPropertyValue(variable).trim();
    if (value) target.style.setProperty(variable, value);
    else target.style.removeProperty(variable);
  });
};

const normalizeTooltip = (
  value: TooltipDirectiveValue
): Required<TooltipDirectiveOptions> => {
  const options = typeof value === "string" ? { content: value } : value;
  return {
    content: options.content,
    placement: options.placement ?? "top",
    disabled: options.disabled ?? false,
    showDelay: Math.max(0, Number(options.showDelay) || 0),
    hideDelay: Math.max(0, Number(options.hideDelay) || 0)
  };
};

export const createTooltipController = (
  element: HTMLElement,
  initialValue: TooltipDirectiveValue
): DirectiveController<TooltipDirectiveValue> => {
  let options = normalizeTooltip(initialValue);
  const id = `elf-directive-tooltip-${++tooltipSeed}`;
  const previousDescribedBy = element.getAttribute("aria-describedby");
  const tooltip = document.createElement("div");
  const content = document.createElement("span");
  const arrow = document.createElement("span");
  let showTimer: ReturnType<typeof setTimeout> | undefined;
  let hideTimer: ReturnType<typeof setTimeout> | undefined;

  tooltip.id = id;
  tooltip.role = "tooltip";
  tooltip.hidden = true;
  tooltip.dataset.elfTooltip = "";
  Object.assign(tooltip.style, {
    position: "fixed",
    zIndex: "2147483000",
    maxWidth: "280px",
    padding: "6px 10px",
    borderRadius: "var(--elf-radius-sm, 4px)",
    background: "var(--elf-text-primary, #1f2328)",
    color: "var(--elf-bg-paper, #fff)",
    boxShadow: "var(--elf-shadow-2, 0 6px 18px rgb(0 0 0 / 18%))",
    font: "500 12px/1.5 var(--elf-font-family, sans-serif)",
    pointerEvents: "none"
  });
  arrow.dataset.elfTooltipArrow = "";
  arrow.setAttribute("aria-hidden", "true");
  Object.assign(arrow.style, {
    position: "absolute",
    width: "8px",
    height: "8px",
    background: "inherit",
    transform: "rotate(45deg)",
    pointerEvents: "none"
  });
  tooltip.append(content, arrow);
  document.body.appendChild(tooltip);

  const syncTheme = (): void => {
    inheritCssVariables(element, tooltip, TOOLTIP_THEME_VARIABLES);
  };

  const clearTimers = (): void => {
    if (showTimer) clearTimeout(showTimer);
    if (hideTimer) clearTimeout(hideTimer);
    showTimer = undefined;
    hideTimer = undefined;
  };

  const position = (): void => {
    if (tooltip.hidden) return;
    const placement = options.placement;
    const target = element.getBoundingClientRect();
    const tip = tooltip.getBoundingClientRect();
    const gap = 8;
    const positions: Record<TooltipDirectivePlacement, readonly [number, number]> = {
      top: [target.left + (target.width - tip.width) / 2, target.top - tip.height - gap],
      bottom: [target.left + (target.width - tip.width) / 2, target.bottom + gap],
      left: [target.left - tip.width - gap, target.top + (target.height - tip.height) / 2],
      right: [target.right + gap, target.top + (target.height - tip.height) / 2]
    };
    const [left, top] = positions[placement];
    tooltip.style.left = `${Math.max(4, Math.min(left, window.innerWidth - tip.width - 4))}px`;
    tooltip.style.top = `${Math.max(4, Math.min(top, window.innerHeight - tip.height - 4))}px`;
    tooltip.dataset.placement = placement;
    Object.assign(arrow.style, {
      top: "auto",
      right: "auto",
      bottom: "auto",
      left: "auto",
      marginTop: "0",
      marginLeft: "0"
    });
    if (placement === "top" || placement === "bottom") {
      arrow.style.left = "50%";
      arrow.style.marginLeft = "-4px";
      arrow.style[placement === "top" ? "bottom" : "top"] = "-4px";
    } else {
      arrow.style.top = "50%";
      arrow.style.marginTop = "-4px";
      arrow.style[placement === "left" ? "right" : "left"] = "-4px";
    }
  };

  const open = (): void => {
    clearTimers();
    if (options.disabled || !options.content) return;
    showTimer = setTimeout(() => {
      syncTheme();
      content.textContent = options.content;
      tooltip.hidden = false;
      element.setAttribute(
        "aria-describedby",
        [previousDescribedBy, id].filter(Boolean).join(" ")
      );
      position();
    }, options.showDelay);
  };

  const close = (): void => {
    clearTimers();
    hideTimer = setTimeout(() => {
      tooltip.hidden = true;
      if (previousDescribedBy) element.setAttribute("aria-describedby", previousDescribedBy);
      else element.removeAttribute("aria-describedby");
    }, options.hideDelay);
  };

  const onEscape = (event: KeyboardEvent): void => {
    if (event.key === "Escape") close();
  };

  element.addEventListener("pointerenter", open);
  element.addEventListener("pointerleave", close);
  element.addEventListener("focusin", open);
  element.addEventListener("focusout", close);
  element.addEventListener("keydown", onEscape);
  window.addEventListener("scroll", position, true);
  window.addEventListener("resize", position);

  return {
    update(value) {
      options = normalizeTooltip(value);
      if (!tooltip.hidden) {
        syncTheme();
        content.textContent = options.content;
        if (options.disabled) close();
        else position();
      }
    },
    dispose() {
      clearTimers();
      element.removeEventListener("pointerenter", open);
      element.removeEventListener("pointerleave", close);
      element.removeEventListener("focusin", open);
      element.removeEventListener("focusout", close);
      element.removeEventListener("keydown", onEscape);
      window.removeEventListener("scroll", position, true);
      window.removeEventListener("resize", position);
      if (previousDescribedBy) element.setAttribute("aria-describedby", previousDescribedBy);
      else element.removeAttribute("aria-describedby");
      tooltip.remove();
    }
  };
};

export const tooltipDirective = createControllerDirective(createTooltipController);

export type TouchDirection = "left" | "right" | "up" | "down";

export interface TouchGestureDetail {
  direction: TouchDirection;
  deltaX: number;
  deltaY: number;
  duration: number;
  event: PointerEvent;
}

export type TouchGestureHandler = (detail: TouchGestureDetail) => void;

export interface TouchDirectiveOptions {
  handler?: TouchGestureHandler;
  left?: TouchGestureHandler;
  right?: TouchGestureHandler;
  up?: TouchGestureHandler;
  down?: TouchGestureHandler;
  threshold?: number;
  disabled?: boolean;
}

export type TouchDirectiveValue = TouchGestureHandler | TouchDirectiveOptions;

const normalizeTouch = (
  value: TouchDirectiveValue
): TouchDirectiveOptions & { threshold: number; disabled: boolean } => {
  const options = typeof value === "function" ? { handler: value } : value;
  return {
    ...options,
    threshold: Math.max(8, Number(options.threshold) || 36),
    disabled: options.disabled ?? false
  };
};

export const createTouchController = (
  element: HTMLElement,
  initialValue: TouchDirectiveValue
): DirectiveController<TouchDirectiveValue> => {
  let options = normalizeTouch(initialValue);
  let pointerId: number | undefined;
  let startX = 0;
  let startY = 0;
  let startTime = 0;

  const reset = (): void => {
    pointerId = undefined;
  };

  const onPointerDown = (event: PointerEvent): void => {
    if (options.disabled || (event.pointerType !== "touch" && event.pointerType !== "pen")) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    startTime = Date.now();
  };

  const onPointerUp = (event: PointerEvent): void => {
    if (pointerId !== event.pointerId || options.disabled) return reset();
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    const horizontal = Math.abs(deltaX) >= Math.abs(deltaY);
    const distance = horizontal ? Math.abs(deltaX) : Math.abs(deltaY);
    if (distance >= options.threshold) {
      const direction: TouchDirection = horizontal
        ? deltaX < 0 ? "left" : "right"
        : deltaY < 0 ? "up" : "down";
      const detail: TouchGestureDetail = {
        direction,
        deltaX,
        deltaY,
        duration: Date.now() - startTime,
        event
      };
      options.handler?.(detail);
      options[direction]?.(detail);
    }
    reset();
  };

  element.addEventListener("pointerdown", onPointerDown);
  element.addEventListener("pointerup", onPointerUp);
  element.addEventListener("pointercancel", reset);

  return {
    update(value) {
      options = normalizeTouch(value);
    },
    dispose() {
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointercancel", reset);
    }
  };
};

export const touchDirective = createControllerDirective(createTouchController);

export const registerRippleDirective = (
  app: Pick<ElfUIApp, "directive">
): void => registerDirective(app, "ripple", rippleDirective as DirectiveDefinition);

export const registerScrollDirective = (
  app: Pick<ElfUIApp, "directive">
): void => registerDirective(app, "scroll", scrollDirective as DirectiveDefinition);

export const registerTooltipDirective = (
  app: Pick<ElfUIApp, "directive">
): void => registerDirective(app, "tooltip", tooltipDirective as DirectiveDefinition);

export const registerTouchDirective = (
  app: Pick<ElfUIApp, "directive">
): void => registerDirective(app, "touch", touchDirective as DirectiveDefinition);
