import { afterEach, beforeAll, describe, expect, it } from "vitest";

let formExampleTag = "";
let alphaExampleTag = "";
let portalExampleTag = "";
let sliderExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const [
    { PageColorPickerEx2 },
    { PageColorPickerEx3 },
    { PageColorPickerEx4 },
    { PageColorPickerEx5 },
  ] = await Promise.all([import("./ex2"), import("./ex3"), import("./ex4"), import("./ex5")]);
  alphaExampleTag = ensureCustomElement(PageColorPickerEx2);
  formExampleTag = ensureCustomElement(PageColorPickerEx3);
  portalExampleTag = ensureCustomElement(PageColorPickerEx4);
  sliderExampleTag = ensureCustomElement(PageColorPickerEx5);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("ColorPicker documentation", () => {
  it("renders a constrained form example with a controlled picker", async () => {
    const page = document.createElement(formExampleTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const wrapper = page.shadowRoot!.querySelector<HTMLElement>("elf-playground > div")!;
    expect(wrapper.style.maxWidth).toBe("560px");
    expect(wrapper.querySelector("elf-form-item")?.hasAttribute("required")).toBe(true);
    expect(wrapper.querySelector("elf-color-picker")?.hasAttribute("clearable")).toBe(true);
  });

  it("passes non-default example values through Custom Element properties", async () => {
    const alphaPage = document.createElement(alphaExampleTag);
    const portalPage = document.createElement(portalExampleTag);
    document.body.append(alphaPage, portalPage);
    await tick();
    await tick();

    const alphaPicker = alphaPage.shadowRoot!.querySelector("elf-color-picker") as
      (HTMLElement & { modelValue?: string }) | null;
    const portalPicker = portalPage.shadowRoot!.querySelector("elf-color-picker") as
      (HTMLElement & { modelValue?: string }) | null;

    expect(alphaPicker?.modelValue).toBe("rgba(0, 106, 106, 0.8)");
    expect(portalPicker?.modelValue).toBe("#2563eb");
  });

  it("drives the picker color from the HSL console sliders", async () => {
    const page = document.createElement(sliderExampleTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const sliders = Array.from(
      page.shadowRoot!.querySelectorAll<HTMLElement & { modelValue?: number }>("elf-slider"),
    );
    const picker = page.shadowRoot!.querySelector<HTMLElement & { modelValue?: string }>(
      "elf-color-picker",
    )!;

    expect(sliders).toHaveLength(6);
    expect(picker.modelValue?.toLowerCase()).toMatch(/^#[0-9a-f]{6}$/i);

    sliders[1]!.dispatchEvent(new CustomEvent("update:modelValue", { detail: 80 }));
    await tick();
    sliders[2]!.dispatchEvent(new CustomEvent("update:modelValue", { detail: 55 }));
    await tick();
    sliders[0]!.dispatchEvent(new CustomEvent("update:modelValue", { detail: 0 }));
    await tick();
    expect(picker.modelValue?.toLowerCase()).toBe("#e83030");
  });
});
