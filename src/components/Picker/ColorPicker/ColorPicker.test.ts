import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface ColorPickerEl extends HTMLElement {
  modelValue?: string;
  presets?: unknown[];
  variant?: string;
  label?: string;
}

describe("elf-color-picker", () => {
  it("选择预设色触发更新", async () => {
    const el = document.createElement("elf-color-picker") as ColorPickerEl;
    el.presets = ["#ff0000", "#00ff00"];
    document.body.appendChild(el);
    await tick();
    await tick();

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    (el.shadowRoot!.querySelector(".preset") as HTMLElement).click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("#ff0000");
  });

  it("renders preset colors and reflects the shared field surface", async () => {
    const el = document.createElement("elf-color-picker") as ColorPickerEl;
    el.variant = "outlined";
    el.label = "Brand color";
    el.presets = ["#ff0000"];
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(el.getAttribute("variant")).toBe("outlined");
    expect(el.shadowRoot!.querySelector(".field-label")?.textContent).toBe("Brand color");
    expect(el.shadowRoot!.querySelector(".field-outline legend")?.textContent).toBe("Brand color");
    expect((el.shadowRoot!.querySelector(".preset") as HTMLElement).style.backgroundColor).toBe("#ff0000");
  });

  it.each(["default", "underlined", "solo", "solo-filled", "solo-inverted"])(
    "reflects the shared %s field variant",
    async (variant) => {
      const el = document.createElement("elf-color-picker") as ColorPickerEl;
      el.variant = variant;
      document.body.appendChild(el);
      await tick();
      expect(el.getAttribute("variant")).toBe(variant);
    }
  );
});
