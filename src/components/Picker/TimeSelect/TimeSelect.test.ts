import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import type { TimeSelectElement } from "./types";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> =>
  new Promise((resolve) => queueMicrotask(resolve));

const mount = async (
  setup: (element: TimeSelectElement) => void = () => undefined,
): Promise<TimeSelectElement> => {
  const element = document.createElement("elf-time-select") as TimeSelectElement;
  setup(element);
  document.body.appendChild(element);
  await tick();
  await tick();
  return element;
};

const innerSelect = (element: TimeSelectElement): HTMLElement =>
  element.shadowRoot!.querySelector("elf-select") as HTMLElement;

const selectTrigger = (element: TimeSelectElement): HTMLElement =>
  innerSelect(element).shadowRoot!.querySelector(".trigger") as HTMLElement;

describe("elf-time-select", () => {
  it("renders fixed-step options and the controlled value through Select", async () => {
    const element = await mount((target) => {
      target.modelValue = "09:30";
      Object.assign(target, {
        start: "09:00",
        end: "10:30",
        step: "00:30",
        includeEndTime: true,
      });
    });

    expect(element.modelValue).toBe("09:30");
    expect((innerSelect(element) as HTMLElement & { modelValue: unknown }).modelValue).toBe("09:30");
    expect(selectTrigger(element).textContent).toContain("09:30");
    selectTrigger(element).click();
    await tick();

    const labels = Array.from(
      innerSelect(element).shadowRoot!.querySelectorAll(".option"),
      (option) => option.textContent?.replace("✓", "").trim(),
    );
    expect(labels).toEqual(["09:00", "09:30", "10:00", "10:30"]);
  });

  it("emits controlled updates and semantic changes exactly once", async () => {
    const element = await mount((target) => {
      Object.assign(target, {
        start: "09:00",
        end: "10:00",
        step: "00:30",
      });
    });
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    element.addEventListener("update:modelValue", onUpdate as EventListener);
    element.addEventListener("change", onChange as EventListener);

    selectTrigger(element).click();
    await tick();
    (
      innerSelect(element).shadowRoot!.querySelectorAll<HTMLElement>(".option")[1]
    )?.click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("09:30");
    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toBe("09:30");
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("disables values outside linked min and max times", async () => {
    const element = await mount((target) => {
      Object.assign(target, {
        start: "08:00",
        end: "10:00",
        step: "00:30",
        minTime: "08:30",
        maxTime: "09:00",
        includeEndTime: true,
      });
    });

    selectTrigger(element).click();
    await tick();
    const options = innerSelect(element).shadowRoot!.querySelectorAll(".option");
    expect(options[0]?.getAttribute("aria-disabled")).toBe("true");
    expect(options[1]?.getAttribute("aria-disabled")).toBe("false");
    expect(options[2]?.getAttribute("aria-disabled")).toBe("false");
    expect(options[3]?.getAttribute("aria-disabled")).toBe("true");
  });

  it("formats labels without changing the canonical model value", async () => {
    const element = await mount((target) => {
      target.modelValue = "13:30";
      Object.assign(target, {
        start: "13:00",
        end: "14:00",
        step: "00:30",
        format: "hh:mm A",
      });
    });

    expect(selectTrigger(element).textContent).toContain("01:30 PM");
  });

  it("delegates clear and focus APIs while preserving wrapper events", async () => {
    const element = await mount((target) => {
      target.modelValue = "09:30";
      Object.assign(target, { clearable: true });
    });
    const onClear = vi.fn();
    element.addEventListener("clear", onClear);

    element.focus();
    expect(innerSelect(element).shadowRoot!.activeElement).toBe(
      selectTrigger(element),
    );
    (
      innerSelect(element).shadowRoot!.querySelector(".clear") as HTMLElement
    ).click();
    await tick();

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("inherits the disabled state and blocks opening", async () => {
    const element = await mount((target) => {
      Object.assign(target, { disabled: true });
    });

    expect(element.hasAttribute("disabled")).toBe(true);
    selectTrigger(element).click();
    await tick();
    expect(innerSelect(element).shadowRoot!.querySelector(".dropdown")).toBeNull();
  });

  it("rebuilds options when a range prop changes", async () => {
    const element = await mount((target) => {
      Object.assign(target, {
        start: "09:00",
        end: "10:00",
        step: "00:30",
      });
    });

    Object.assign(element, { end: "11:00" });
    await tick();
    selectTrigger(element).click();
    await tick();

    expect(
      innerSelect(element).shadowRoot!.querySelectorAll(".option"),
    ).toHaveLength(4);
  });
});
