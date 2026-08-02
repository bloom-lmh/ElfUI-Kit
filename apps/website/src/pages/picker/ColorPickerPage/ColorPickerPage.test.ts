import { afterEach, beforeAll, describe, expect, it } from "vitest";

let formExampleTag = "";
let alphaExampleTag = "";
let portalExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const [{ PageColorPickerEx2 }, { PageColorPickerEx3 }, { PageColorPickerEx4 }] =
    await Promise.all([import("./ex2"), import("./ex3"), import("./ex4")]);
  alphaExampleTag = ensureCustomElement(PageColorPickerEx2);
  formExampleTag = ensureCustomElement(PageColorPickerEx3);
  portalExampleTag = ensureCustomElement(PageColorPickerEx4);
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
});
