import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface DatePickerEl extends HTMLElement {
  modelValue?: string | string[];
  endValue?: string;
  type?: string;
  range?: boolean;
  multiple?: boolean;
  actions?: boolean;
  showHeader?: boolean;
  header?: string;
  clearable?: boolean;
  shortcuts?: unknown[];
  variant?: string;
  label?: string;
}

const mount = async (patch: Partial<DatePickerEl> = {}): Promise<DatePickerEl> => {
  const el = document.createElement("elf-date-picker") as DatePickerEl;
  Object.assign(el, patch);
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

const openPanel = async (el: DatePickerEl): Promise<void> => {
  (el.shadowRoot!.querySelector(".field-trigger") as HTMLButtonElement).click();
  await tick();
  await tick();
};

const selectCalendarDay = async (el: DatePickerEl, value: string): Promise<void> => {
  await openPanel(el);
  const calendar = el.shadowRoot!.querySelector("elf-calendar") as HTMLElement;
  const day = calendar.shadowRoot!.querySelector(`[data-date="${value}"]`) as HTMLButtonElement;
  day.click();
  await tick();
  await tick();
};

describe("elf-date-picker", () => {
  it("range 快捷项同时更新开始和结束日期", async () => {
    const el = await mount({
      range: true,
      shortcuts: [{ label: "本周", value: "2026-06-15", endValue: "2026-06-21" }]
    });

    const onStart = vi.fn();
    const onEnd = vi.fn();
    el.addEventListener("update:modelValue", onStart as unknown as EventListener);
    el.addEventListener("update:endValue", onEnd as unknown as EventListener);
    await openPanel(el);
    (el.shadowRoot!.querySelector(".shortcut") as HTMLElement).click();
    await tick();

    expect((onStart.mock.calls[0]![0] as CustomEvent).detail).toBe("2026-06-15");
    expect((onEnd.mock.calls[0]![0] as CustomEvent).detail).toBe("2026-06-21");
  });

  it("multiple 模式切换日期并 emit 数组", async () => {
    const el = await mount({ multiple: true, modelValue: ["2026-06-10"] });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    await selectCalendarDay(el, "2026-06-18");

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual([
      "2026-06-10",
      "2026-06-18"
    ]);
    expect(el.shadowRoot!.querySelector(".chips")?.textContent).toContain("2026-06-18");
  });

  it("actions 模式在确认前不提交", async () => {
    const el = await mount({ actions: true, modelValue: "2026-06-01" });
    const onUpdate = vi.fn();
    const onConfirm = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    el.addEventListener("confirm", onConfirm as unknown as EventListener);

    await selectCalendarDay(el, "2026-06-19");
    expect(onUpdate).not.toHaveBeenCalled();

    (el.shadowRoot!.querySelector(".primary-action") as HTMLElement).click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("2026-06-19");
    expect((onConfirm.mock.calls[0]![0] as CustomEvent).detail).toBe("2026-06-19");
  });

  it("cancel 会恢复到外部 modelValue", async () => {
    const el = await mount({ actions: true, modelValue: "2026-06-01" });
    await selectCalendarDay(el, "2026-06-20");
    (el.shadowRoot!.querySelector(".text-action") as HTMLElement).click();
    await tick();

    expect(el.shadowRoot!.querySelector(".field-value")?.textContent).toContain("2026-06-01");
  });

  it("showHeader 与 month 类型正常渲染", async () => {
    const el = await mount({ showHeader: true, header: "选择月份", type: "month" });

    expect(el.shadowRoot!.querySelector(".header-title")?.textContent).toContain("选择月份");
    await openPanel(el);
    expect(el.shadowRoot!.querySelectorAll(".month-option")).toHaveLength(12);
  });

  it("uses the shared surface and closes only on outside interaction or external scroll", async () => {
    const el = await mount({ variant: "outlined", label: "Publish date" });
    await openPanel(el);
    const panel = el.shadowRoot!.querySelector(".panel") as HTMLElement;

    panel.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
    expect(el.shadowRoot!.querySelector(".panel")).not.toBeNull();
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
    await tick();
    expect(el.shadowRoot!.querySelector(".panel")).toBeNull();

    await openPanel(el);
    window.dispatchEvent(new Event("scroll"));
    await tick();
    expect(el.shadowRoot!.querySelector(".panel")).toBeNull();
    expect(el.getAttribute("variant")).toBe("outlined");
    expect(el.shadowRoot!.querySelector(".field-label")?.textContent).toBe("Publish date");
    expect(el.shadowRoot!.querySelector(".field-outline legend")?.textContent).toBe("Publish date");
  });

  it.each(["default", "underlined", "solo", "solo-filled", "solo-inverted"])(
    "reflects the shared %s field variant",
    async (variant) => {
      const el = await mount({ variant });
      expect(el.getAttribute("variant")).toBe(variant);
    }
  );

  it("starts a fresh visible range before committing the second day", async () => {
    const el = await mount({ range: true, modelValue: "2026-06-05", endValue: "2026-06-12" });
    await openPanel(el);
    const calendar = el.shadowRoot!.querySelector("elf-calendar") as HTMLElement;
    (calendar.shadowRoot!.querySelector('[data-date="2026-06-20"]') as HTMLButtonElement).click();
    await tick();

    expect(calendar.shadowRoot!.querySelector('[data-date="2026-06-20"]')?.classList.contains("is-range-start")).toBe(true);
    expect(calendar.shadowRoot!.querySelector('[data-date="2026-06-05"]')?.classList.contains("is-range-start")).toBe(false);
    expect(calendar.shadowRoot!.querySelector('[data-date="2026-06-12"]')?.classList.contains("is-range-end")).toBe(false);
    expect(calendar.shadowRoot!.querySelectorAll(".is-in-range")).toHaveLength(0);
    expect(el.shadowRoot!.querySelector(".panel")).not.toBeNull();
  });
});
