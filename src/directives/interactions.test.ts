import type { DirectiveBinding } from "@elfui/core";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  rippleDirective,
  scrollDirective,
  tooltipDirective,
  touchDirective,
  type RippleDirectiveValue,
  type ScrollDirectiveValue,
  type TooltipDirectiveValue,
  type TouchDirectiveValue
} from "./interactions";

const binding = <Value>(value: Value): DirectiveBinding<Value> => ({
  value,
  oldValue: undefined,
  modifiers: {}
});

const hooks = <Value>(definition: unknown) => definition as {
  mounted: (element: HTMLElement, binding: DirectiveBinding<Value>) => void;
  updated: (element: HTMLElement, binding: DirectiveBinding<Value>) => void;
  beforeUnmount: (element: HTMLElement) => void;
};

const pointerEvent = (
  type: string,
  values: Partial<PointerEvent>
): PointerEvent => {
  const event = new Event(type, { bubbles: true }) as PointerEvent;
  Object.defineProperties(event, Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, { value }])
  ));
  return event;
};

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

describe("interaction directives", () => {
  it("creates and cleans a ripple for pointer and keyboard activation", () => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    const element = document.createElement("button");
    Object.defineProperty(element, "getBoundingClientRect", {
      value: () => ({ left: 0, top: 0, width: 100, height: 40 })
    });
    document.body.appendChild(element);
    const directive = hooks<RippleDirectiveValue>(rippleDirective);
    directive.mounted(element, binding({ duration: 120 }));
    element.dispatchEvent(pointerEvent("pointerdown", { clientX: 20, clientY: 20 }));

    expect(element.querySelector("[data-elf-ripple]")).toBeTruthy();
    directive.beforeUnmount(element);
    expect(element.querySelector("[data-elf-ripple]")).toBeNull();
    vi.unstubAllGlobals();
  });

  it("reports scroll position and normalized progress", () => {
    const container = document.createElement("div");
    Object.defineProperties(container, {
      scrollTop: { value: 150, writable: true },
      scrollHeight: { value: 400 },
      clientHeight: { value: 100 }
    });
    document.body.appendChild(container);
    const handler = vi.fn();
    const directive = hooks<ScrollDirectiveValue>(scrollDirective);
    directive.mounted(container, binding({ handler, target: container, immediate: false }));
    container.dispatchEvent(new Event("scroll"));

    expect(handler).toHaveBeenCalledWith(expect.objectContaining({
      position: 150,
      maximum: 300,
      progress: 0.5
    }));
    directive.beforeUnmount(container);
  });

  it("shows an accessible tooltip on focus and restores aria-describedby", () => {
    vi.useFakeTimers();
    const element = document.createElement("button");
    element.setAttribute("aria-describedby", "existing");
    document.body.appendChild(element);
    const directive = hooks<TooltipDirectiveValue>(tooltipDirective);
    directive.mounted(element, binding("Helpful text"));
    element.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    vi.runAllTimers();

    const tooltip = document.body.querySelector<HTMLElement>("[data-elf-tooltip]");
    expect(tooltip?.hidden).toBe(false);
    expect(tooltip?.textContent).toBe("Helpful text");
    expect(tooltip?.querySelector("[data-elf-tooltip-arrow]")).toBeTruthy();
    expect(element.getAttribute("aria-describedby")).toContain(tooltip!.id);

    directive.beforeUnmount(element);
    expect(element.getAttribute("aria-describedby")).toBe("existing");
    expect(tooltip?.isConnected).toBe(false);
  });

  it("inherits Provider-resolved theme tokens into the document-level tooltip", () => {
    vi.useFakeTimers();
    const element = document.createElement("button");
    element.style.setProperty("--elf-text-primary", "#17211b");
    element.style.setProperty("--elf-bg-paper", "#f5faf5");
    element.style.setProperty("--elf-radius-sm", "10px");
    document.body.appendChild(element);
    const directive = hooks<TooltipDirectiveValue>(tooltipDirective);
    directive.mounted(element, binding("Forest tooltip"));
    element.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    vi.runAllTimers();

    const tooltip = document.body.querySelector<HTMLElement>("[data-elf-tooltip]")!;
    expect(tooltip.style.getPropertyValue("--elf-text-primary")).toBe("#17211b");
    expect(tooltip.style.getPropertyValue("--elf-bg-paper")).toBe("#f5faf5");
    expect(tooltip.style.getPropertyValue("--elf-radius-sm")).toBe("10px");

    directive.beforeUnmount(element);
  });

  it("emits directional touch gestures above the threshold", () => {
    const element = document.createElement("div");
    const handler = vi.fn();
    const directive = hooks<TouchDirectiveValue>(touchDirective);
    directive.mounted(element, binding({ handler, threshold: 20 }));
    element.dispatchEvent(pointerEvent("pointerdown", {
      pointerId: 1,
      pointerType: "touch",
      clientX: 100,
      clientY: 50
    }));
    element.dispatchEvent(pointerEvent("pointerup", {
      pointerId: 1,
      pointerType: "touch",
      clientX: 50,
      clientY: 52
    }));

    expect(handler).toHaveBeenCalledWith(expect.objectContaining({
      direction: "left",
      deltaX: -50
    }));
    directive.beforeUnmount(element);
  });
});
