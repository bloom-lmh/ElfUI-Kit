import {
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi } from "vitest";
import { registerComponents
} from "@elfui/core";

import { InputNumber } from "./index";

beforeAll(() => {
  registerComponents(InputNumber);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface InputNumberEl extends HTMLElement {
  modelValue?: number | null;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  controls?: boolean;
  controlVariant?: "default" | "stacked" | "split" | "hidden";
  reverse?: boolean;
  inset?: boolean;
  hideInput?: boolean;
  label?: string;
  variant?: string;
  disabled?: boolean;
  valueOnClear?: number | null;
}

const mount = async (patch: Partial<InputNumberEl> = {}): Promise<InputNumberEl> => {
  const el = document.createElement("elf-input-number") as InputNumberEl;
  Object.assign(el, { modelValue: 1, ...patch });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-input-number", () => {
  it("increments and emits change", async () => {
    const el = await mount({ step: 2 });
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    el.addEventListener("change", onChange as EventListener);

    (el.shadowRoot!.querySelector(".increase") as HTMLButtonElement).click();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(3);
    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toBe(3);
  });

  it("clamps and applies precision", async () => {
    const el = await mount({ modelValue: 9, max: 10, step: 1.25, precision: 1 });
    const onChange = vi.fn();
    el.addEventListener("change", onChange as EventListener);

    (el.shadowRoot!.querySelector(".increase") as HTMLButtonElement).click();

    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toBe(10);
    expect((el.shadowRoot!.querySelector("input") as HTMLInputElement).value).toBe("10");
  });

  it("emits null when input is cleared", async () => {
    const el = await mount();
    const onInput = vi.fn();
    el.addEventListener("input", onInput as EventListener);
    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;

    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect((onInput.mock.calls[0]![0] as CustomEvent).detail).toBeNull();
  });

  it("uses value-on-clear and exposes spinbutton ARIA values", async () => {
    const el = await mount({ min: 0, max: 10, valueOnClear: 4 });
    const onInput = vi.fn();
    el.addEventListener("input", onInput as EventListener);
    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();

    expect((onInput.mock.calls[0]![0] as CustomEvent).detail).toBe(4);
    expect(input.getAttribute("role")).toBe("spinbutton");
    expect(input.getAttribute("aria-valuemin")).toBe("0");
    expect(input.getAttribute("aria-valuemax")).toBe("10");
    expect(input.getAttribute("aria-valuenow")).toBe("4");
  });

  it("does not change when disabled", async () => {
    const el = await mount({ disabled: true });
    const onChange = vi.fn();
    el.addEventListener("change", onChange as EventListener);

    (el.shadowRoot!.querySelector(".increase") as HTMLButtonElement).click();

    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not render increment controls when controls is false", async () => {
    const el = await mount({ controls: false, modelValue: 8 });

    expect(el.shadowRoot!.querySelectorAll(".control")).toHaveLength(0);
    expect((el.shadowRoot!.querySelector("input") as HTMLInputElement).value).toBe("8");
    expect(el.shadowRoot!.querySelector(".input-number")?.classList.contains("controls-hidden")).toBe(true);
  });

  it.each(["default", "stacked", "split", "hidden"] as const)(
    "renders %s control variant",
    async (controlVariant) => {
      const el = await mount({ controlVariant });
      expect(el.getAttribute("control-variant")).toBe(controlVariant);
      expect(el.shadowRoot!.querySelector(".input-number")?.classList.contains(`controls-${controlVariant}`)).toBe(true);
      expect(el.shadowRoot!.querySelectorAll(".control")).toHaveLength(controlVariant === "hidden" ? 0 : 2);
    }
  );

  it("renders the shared outlined floating-label structure", async () => {
    const el = await mount({ modelValue: 8, label: "Quantity", variant: "outlined" });
    expect(el.getAttribute("variant")).toBe("outlined");
    expect(el.hasAttribute("data-dirty")).toBe(true);
    expect(el.shadowRoot!.querySelector(".field-outline legend")?.textContent).toBe("Quantity");
    expect(el.shadowRoot!.querySelector('[part="label"]')?.textContent).toBe("Quantity");
  });

  it("normalizes density and avoids rendering a duplicate placeholder", async () => {
    const el = await mount({ label: "Quantity", placeholder: "Quantity", density: "compact" });
    expect(el.getAttribute("density")).toBe("compact");
    expect(el.shadowRoot!.querySelector("input")?.getAttribute("placeholder")).toBe("");
  });
});
