import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { registerComponents } from "@elfui/core";

import { Segmented } from "./index";

beforeAll(() => {
  registerComponents(Segmented);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface SegmentedEl extends HTMLElement {
  modelValue?: string | number | boolean;
  options?: unknown[];
  block?: boolean;
  name?: string;
  id?: string;
  ariaLabel?: string;
  label?: string;
}

const mount = async (patch: Partial<SegmentedEl> = {}): Promise<SegmentedEl> => {
  const el = document.createElement("elf-segmented") as SegmentedEl;
  Object.assign(el, {
    modelValue: "daily",
    options: [
      { label: "Daily", value: "daily" },
      { label: "Weekly", value: "weekly" },
      { label: "Disabled", value: "disabled", disabled: true },
    ],
    ...patch,
  });
  document.body.appendChild(el);
  await tick();
  return el;
};

describe("elf-segmented", () => {
  it("renders active option", async () => {
    const el = await mount();

    expect(el.shadowRoot!.querySelectorAll(".option")).toHaveLength(3);
    expect(el.shadowRoot!.querySelector(".is-active")?.textContent).toContain("Daily");
  });

  it("emits update and change when selecting option", async () => {
    const el = await mount();
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    el.addEventListener("change", onChange as EventListener);

    (el.shadowRoot!.querySelectorAll(".option")[1] as HTMLButtonElement).click();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("weekly");
    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toBe("weekly");
  });

  it("does not emit for disabled option", async () => {
    const el = await mount();
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    (el.shadowRoot!.querySelectorAll(".option")[2] as HTMLButtonElement).click();

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("exposes accessible radio semantics and name/id", async () => {
    const el = await mount({ name: "period", id: "period-choice", ariaLabel: "Report period" });
    const group = el.shadowRoot!.querySelector(".segmented")!;
    expect(group.getAttribute("role")).toBe("radiogroup");
    expect(group.getAttribute("id")).toBe("period-choice");
    expect(group.getAttribute("aria-label")).toBe("Report period");
    expect(group.querySelector(".option")?.getAttribute("aria-checked")).toBe("true");
  });

  it("uses roving tabindex and arrow navigation while skipping disabled options", async () => {
    const el = await mount();
    const onChange = vi.fn();
    el.addEventListener("change", onChange as EventListener);
    const buttons = el.shadowRoot!.querySelectorAll(".option") as NodeListOf<HTMLButtonElement>;

    expect(buttons[0]!.tabIndex).toBe(0);
    expect(buttons[1]!.tabIndex).toBe(-1);
    buttons[0]!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await tick();

    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toBe("weekly");
    expect(buttons[1]!.tabIndex).toBe(0);
    expect(el.shadowRoot!.activeElement).toBe(buttons[1]);

    buttons[1]!.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    await tick();
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
