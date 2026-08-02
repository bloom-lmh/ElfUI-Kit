import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Splitter, SplitterPanel } from "./index";

beforeAll(() => {
  registerComponents(Splitter, SplitterPanel);
});

afterEach(() => {
  document.body.innerHTML = "";
  localStorage.clear();
});

const tick = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 10));

interface SplitterEl extends HTMLElement {
  modelValue?: number;
  min?: number;
  max?: number;
  vertical?: boolean;
  disabled?: boolean;
  collapsible?: boolean;
  resizable?: boolean;
  storageKey?: string;
}

interface SplitterPanelEl extends HTMLElement {
  size?: number;
  min?: number;
  max?: number;
  collapsible?: boolean;
  resizable?: boolean;
  lazy?: boolean;
  collapsed?: boolean;
}

describe("elf-splitter", () => {
  it("sets host CSS variable from modelValue", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    el.modelValue = 35;
    document.body.appendChild(el);
    await tick();

    expect(el.style.getPropertyValue("--_splitter-size")).toBe("35%");
  });

  it("modelValue = 0 is not treated as falsy", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    el.min = 0;
    el.modelValue = 0;
    document.body.appendChild(el);
    await tick();

    expect(el.style.getPropertyValue("--_splitter-size")).toBe("0%");
  });

  it("emits resize-start on pointerdown", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    const onStart = vi.fn();
    el.addEventListener("resize-start", onStart as EventListener);
    document.body.appendChild(el);
    await tick();

    const bar = el.shadowRoot!.querySelector(".bar") as HTMLElement;
    bar.setPointerCapture = vi.fn();
    bar.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));

    expect(onStart).toHaveBeenCalled();
  });

  it("emits update:modelValue on pointermove while dragging", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    el.modelValue = 50;
    document.body.appendChild(el);
    await tick();

    const bar = el.shadowRoot!.querySelector(".bar") as HTMLElement;
    bar.setPointerCapture = vi.fn();
    bar.releasePointerCapture = vi.fn();

    // Start drag first
    bar.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1 }));

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    bar.dispatchEvent(
      new PointerEvent("pointermove", { bubbles: true, pointerId: 1, clientX: 200 }),
    );

    expect(onUpdate).toHaveBeenCalled();
  });

  it("stops dragging on pointerup", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    const onEnd = vi.fn();
    el.addEventListener("resize-end", onEnd as EventListener);
    document.body.appendChild(el);
    await tick();

    const bar = el.shadowRoot!.querySelector(".bar") as HTMLElement;
    bar.setPointerCapture = vi.fn();
    bar.releasePointerCapture = vi.fn();

    // Start drag
    bar.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1 }));
    // End drag
    bar.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerId: 1 }));

    expect(onEnd).toHaveBeenCalled();
    expect(bar.releasePointerCapture).toHaveBeenCalled();
  });

  it("stops dragging on lostpointercapture", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    const onEnd = vi.fn();
    el.addEventListener("resize-end", onEnd as EventListener);
    document.body.appendChild(el);
    await tick();

    const bar = el.shadowRoot!.querySelector(".bar") as HTMLElement;
    bar.setPointerCapture = vi.fn();

    bar.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1 }));
    bar.dispatchEvent(new Event("lostpointercapture", { bubbles: true }));

    expect(onEnd).toHaveBeenCalled();
  });

  it("disabled bar ignores pointerdown", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    el.disabled = true;
    document.body.appendChild(el);
    await tick();

    const onStart = vi.fn();
    el.addEventListener("resize-start", onStart as EventListener);

    const bar = el.shadowRoot!.querySelector(".bar") as HTMLElement;
    bar.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));

    expect(onStart).not.toHaveBeenCalled();
  });

  it("vertical host attribute reflects", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    el.vertical = true;
    document.body.appendChild(el);
    await tick();

    expect(el.hasAttribute("vertical")).toBe(true);
  });

  it("disabled host flag reflects", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    el.disabled = true;
    document.body.appendChild(el);
    await tick();

    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("clamps size to min/max", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    el.min = 20;
    el.max = 80;
    el.modelValue = 50;
    document.body.appendChild(el);
    await tick();

    expect(el.style.getPropertyValue("--_splitter-size")).toBe("50%");

    el.modelValue = 5;
    await tick();
    expect(el.style.getPropertyValue("--_splitter-size")).toBe("20%");

    el.modelValue = 95;
    await tick();
    expect(el.style.getPropertyValue("--_splitter-size")).toBe("80%");
  });

  it("keyboard ArrowRight increases size", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    el.modelValue = 50;
    document.body.appendChild(el);
    await tick();

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    const bar = el.shadowRoot!.querySelector(".bar") as HTMLElement;
    bar.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

    expect(onUpdate).toHaveBeenCalled();
  });

  it("keyboard ArrowLeft decreases size", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    el.modelValue = 50;
    document.body.appendChild(el);
    await tick();

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    const bar = el.shadowRoot!.querySelector(".bar") as HTMLElement;
    bar.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));

    expect(onUpdate).toHaveBeenCalled();
  });

  it("bar has separator role and ARIA attributes", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    document.body.appendChild(el);
    await tick();

    const bar = el.shadowRoot!.querySelector(".bar")!;
    expect(bar.getAttribute("role")).toBe("separator");
    expect(bar.getAttribute("aria-valuenow")).toBe("50");
    expect(bar.hasAttribute("tabindex")).toBe(true);
  });

  it("uses SplitterPanel size and limits when modelValue is not explicitly bound", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    const first = document.createElement("elf-splitter-panel") as SplitterPanelEl;
    first.slot = "first";
    first.size = 38;
    first.min = 15;
    first.max = 72;
    const second = document.createElement("elf-splitter-panel") as SplitterPanelEl;
    second.slot = "second";
    el.append(first, second);
    document.body.appendChild(el);
    await tick();

    const bar = el.shadowRoot!.querySelector(".bar")!;
    expect(el.style.getPropertyValue("--_splitter-size")).toBe("38%");
    expect(bar.getAttribute("aria-valuemin")).toBe("15");
    expect(bar.getAttribute("aria-valuemax")).toBe("72");
  });

  it("collapses and restores a collapsible panel", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    const first = document.createElement("elf-splitter-panel") as SplitterPanelEl;
    first.slot = "first";
    first.collapsible = true;
    const second = document.createElement("elf-splitter-panel") as SplitterPanelEl;
    second.slot = "second";
    el.append(first, second);
    document.body.appendChild(el);
    await tick();

    const collapseEvents: boolean[] = [];
    const resizeStart = vi.fn();
    el.addEventListener("collapse", (event) =>
      collapseEvents.push((event as CustomEvent<boolean>).detail),
    );
    el.addEventListener("resize-start", resizeStart);
    const button = el.shadowRoot!.querySelector<HTMLButtonElement>(".collapse-button")!;
    button.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 7 }));
    expect(resizeStart).not.toHaveBeenCalled();
    button.click();
    await tick();

    expect(el.style.getPropertyValue("--_splitter-size")).toBe("0%");
    expect(first.hasAttribute("collapsed")).toBe(true);
    expect(collapseEvents).toEqual([true]);

    el.shadowRoot!.querySelector<HTMLButtonElement>(".collapse-button")!.click();
    await tick();
    expect(el.style.getPropertyValue("--_splitter-size")).toBe("50%");
    expect(first.hasAttribute("collapsed")).toBe(false);
    expect(collapseEvents).toEqual([true, false]);
  });

  it("honors a panel-level non-resizable contract", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    const first = document.createElement("elf-splitter-panel") as SplitterPanelEl;
    first.slot = "first";
    first.resizable = false;
    el.appendChild(first);
    document.body.appendChild(el);
    await tick();

    const bar = el.shadowRoot!.querySelector<HTMLElement>(".bar")!;
    expect(bar.getAttribute("tabindex")).toBe("-1");
    expect(bar.getAttribute("aria-disabled")).toBe("true");
    const update = vi.fn();
    el.addEventListener("update:modelValue", update);
    bar.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(update).not.toHaveBeenCalled();
  });

  it("reacts when a slotted panel becomes non-resizable after mount", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    const first = document.createElement("elf-splitter-panel") as SplitterPanelEl;
    first.slot = "first";
    el.appendChild(first);
    document.body.appendChild(el);
    await tick();

    const bar = el.shadowRoot!.querySelector<HTMLElement>(".bar")!;
    expect(bar.getAttribute("aria-disabled")).toBeNull();

    first.resizable = false;
    await tick();

    expect(first.getAttribute("data-resizable")).toBe("false");
    expect(bar.getAttribute("tabindex")).toBe("-1");
    expect(bar.getAttribute("aria-disabled")).toBe("true");
  });

  it("activates lazy panel content only after expansion", async () => {
    const panel = document.createElement("elf-splitter-panel") as SplitterPanelEl;
    panel.lazy = true;
    panel.collapsed = true;
    panel.innerHTML = "<strong>Deferred panel</strong>";
    document.body.appendChild(panel);
    await tick();
    expect(panel.shadowRoot!.querySelector("slot")).toBeNull();

    panel.collapsed = false;
    await tick();
    expect(panel.shadowRoot!.querySelector("slot")).toBeTruthy();
  });

  it("loads and persists size with storage-key", async () => {
    localStorage.setItem("splitter-layout", "64");
    const el = document.createElement("elf-splitter") as SplitterEl;
    el.storageKey = "splitter-layout";
    document.body.appendChild(el);
    await tick();
    expect(el.style.getPropertyValue("--_splitter-size")).toBe("64%");

    const bar = el.shadowRoot!.querySelector<HTMLElement>(".bar")!;
    bar.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(localStorage.getItem("splitter-layout")).toBe("69");
  });

  it("falls back to panel size when storage-key has no saved value", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    el.storageKey = "new-layout";
    const panel = document.createElement("elf-splitter-panel") as SplitterPanelEl;
    panel.slot = "first";
    panel.size = 42;
    el.appendChild(panel);
    document.body.appendChild(el);
    await tick();

    expect(el.style.getPropertyValue("--_splitter-size")).toBe("42%");
    expect(localStorage.getItem("new-layout")).toBeNull();
  });
});
