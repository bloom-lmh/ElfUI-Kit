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
  clearable?: boolean;
  format?: string;
  showAlpha?: boolean;
  valueOnClear?: string | (() => string);
  colorFormat?: string;
  predefine?: unknown[];
  persistent?: boolean;
  teleported?: boolean;
  popperClass?: string;
  popperStyle?: Record<string, string>;
  border?: boolean;
  appendTo?: string | HTMLElement;
  hueSliderClass?: string;
  hueSliderStyle?: Record<string, string>;
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
    (el.shadowRoot!.querySelector(".open-button") as HTMLButtonElement).click();
    await tick();
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

    (el.shadowRoot!.querySelector(".open-button") as HTMLButtonElement).click();
    await tick();

    expect(el.getAttribute("variant")).toBe("outlined");
    expect(el.shadowRoot!.querySelector(".field-label")?.textContent).toBe("Brand color");
    expect(el.shadowRoot!.querySelector(".field-outline legend")?.textContent).toBe("Brand color");
    expect((el.shadowRoot!.querySelector(".preset") as HTMLElement).style.backgroundColor).toBe("#ff0000");
    expect(el.shadowRoot!.querySelector(".trigger")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".value")).toBeTruthy();
  });

  it("opens from the keyboard, exposes the Top Layer panel, and closes with Escape", async () => {
    const originalShow = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "showPopover");
    const showPopover = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "showPopover", { configurable: true, value: showPopover });

    try {
      const el = document.createElement("elf-color-picker") as ColorPickerEl;
      document.body.appendChild(el);
      await tick();

      const trigger = el.shadowRoot!.querySelector(".open-button") as HTMLButtonElement;
      trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
      await tick();
      await tick();
      const panel = el.shadowRoot!.querySelector(".panel") as HTMLElement;
      expect(panel.getAttribute("popover")).toBe("manual");
      expect(showPopover).toHaveBeenCalledOnce();

      panel.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
      await tick();
      expect(el.shadowRoot!.querySelector(".panel")).toBeNull();
    } finally {
      if (originalShow) Object.defineProperty(HTMLElement.prototype, "showPopover", originalShow);
      else delete (HTMLElement.prototype as HTMLElement & { showPopover?: () => void }).showPopover;
    }
  });

  it("emits rgba values when alpha changes", async () => {
    const el = document.createElement("elf-color-picker") as ColorPickerEl;
    el.modelValue = "#006a6a";
    el.format = "rgb";
    el.showAlpha = true;
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    document.body.appendChild(el);
    await tick();

    (el.shadowRoot!.querySelector(".open-button") as HTMLButtonElement).click();
    await tick();
    const range = el.shadowRoot!.querySelector(".alpha") as HTMLInputElement;
    range.value = "40";
    range.dispatchEvent(new Event("input", { bubbles: true }));
    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toBe("rgba(0, 106, 106, 0.4)");
  });

  it("supports a configured clear fallback", async () => {
    const el = document.createElement("elf-color-picker") as ColorPickerEl;
    el.modelValue = "#ff0000";
    el.clearable = true;
    el.valueOnClear = () => "#6750a4";
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    document.body.appendChild(el);
    await tick();

    (el.shadowRoot!.querySelector(".clear") as HTMLButtonElement).click();
    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toBe("#6750a4");
    expect((el.shadowRoot!.querySelector(".value") as HTMLInputElement).value).toBe("#6750a4");
  });

  it("clears the selected color immediately and stays empty when controlled with an empty value", async () => {
    const el = document.createElement("elf-color-picker") as ColorPickerEl;
    el.modelValue = "#ff0000";
    el.clearable = true;
    document.body.appendChild(el);
    await tick();
    await tick();

    const onUpdate = vi.fn();
    const onClear = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    el.addEventListener("clear", onClear as EventListener);
    (el.shadowRoot!.querySelector(".clear") as HTMLButtonElement).click();
    await tick();

    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toBe("");
    expect(onClear).toHaveBeenCalledOnce();
    expect((el.shadowRoot!.querySelector(".value") as HTMLInputElement).value).toBe("");
    expect(el.shadowRoot!.querySelector(".clear")).toBeNull();

    el.modelValue = "";
    await tick();
    expect((el.shadowRoot!.querySelector(".value") as HTMLInputElement).value).toBe("");
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

  it("supports compatibility aliases, persistent panels, and inputRef", async () => {
    const el = document.createElement("elf-color-picker") as ColorPickerEl & {
      show(): void;
      hide(): void;
      readonly inputRef: HTMLInputElement | null;
    };
    el.colorFormat = "rgb";
    el.predefine = ["#ff0000", "#00ff00"];
    el.persistent = true;
    el.teleported = false;
    el.popperClass = "brand-colors";
    el.popperStyle = { width: "280px" };
    el.border = false;
    document.body.appendChild(el);
    await tick();
    el.show();
    await tick();
    await tick();

    const panel = el.shadowRoot!.querySelector<HTMLElement>(".panel")!;
    expect(panel.classList.contains("brand-colors")).toBe(true);
    expect(panel.hasAttribute("popover")).toBe(false);
    expect(panel.style.width).toBe("280px");
    expect(el.shadowRoot!.querySelectorAll(".preset")).toHaveLength(2);
    expect(el.inputRef).toBe(el.shadowRoot!.querySelector(".value"));
    expect(el.hasAttribute("data-border")).toBe(false);

    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
    await tick();
    expect(el.shadowRoot!.querySelector(".panel")).not.toBeNull();
    el.hide();
  });

  it("mounts an advanced panel into an external target without losing its shadow styles", async () => {
    const target = document.createElement("section");
    target.id = "picker-overlays";
    document.body.appendChild(target);
    const el = document.createElement("elf-color-picker") as ColorPickerEl & { show(): void; hide(): void };
    el.appendTo = "#picker-overlays";
    el.hueSliderClass = "brand-hue";
    el.hueSliderStyle = { inlineSize: "52px" };
    document.body.appendChild(el);
    await tick();
    el.show();
    await tick();
    await tick();

    const portal = target.querySelector<HTMLElement>("[data-elf-color-picker-portal]")!;
    const native = portal.shadowRoot!.querySelector<HTMLInputElement>(".native")!;
    expect(native.classList.contains("brand-hue")).toBe(true);
    expect(native.style.inlineSize).toBe("52px");
    expect(portal.shadowRoot!.querySelector("style")).toBeTruthy();

    el.hide();
    await tick();
    expect(target.querySelector("[data-elf-color-picker-portal]")).toBeNull();
  });
});
