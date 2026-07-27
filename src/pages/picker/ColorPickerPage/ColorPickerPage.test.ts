import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageColorPickerEx3 } = await import("./ex3");
  exampleTag = ensureCustomElement(PageColorPickerEx3);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("ColorPicker documentation", () => {
  it("renders a constrained form example with a controlled picker", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const wrapper = page.shadowRoot!.querySelector<HTMLElement>("elf-playground > div")!;
    expect(wrapper.style.maxWidth).toBe("560px");
    expect(wrapper.querySelector("elf-form-item")?.hasAttribute("required")).toBe(true);
    expect(wrapper.querySelector("elf-color-picker")?.hasAttribute("clearable")).toBe(true);
  });
});
