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
  format?: string;
  valueFormat?: string;
  disabledDate?: (date: Date) => boolean;
  teleported?: boolean;
  placement?: string;
  size?: string;
  valueOnClear?: string | string[];
  popperClass?: string;
  popperStyle?: Record<string, string>;
  defaultValue?: string;
  defaultTime?: string | [string, string];
  unlinkPanels?: boolean;
  singlePanel?: boolean;
  cellClassName?: (date: Date) => string;
  showWeekNumber?: boolean;
  fallbackPlacements?: string[];
  popperOptions?: Record<string, unknown>;
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
  it("uses the shared Input outline and floating-label focus surface", async () => {
    const el = await mount({ variant: "outlined", label: "发布日期" });
    const trigger = el.shadowRoot!.querySelector<HTMLButtonElement>(".field-trigger")!;

    expect(el.shadowRoot!.querySelector(".field-outline legend")?.textContent).toBe("发布日期");
    trigger.focus();
    expect(el.shadowRoot!.activeElement).toBe(trigger);
  });

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

  it("separates display format from emitted value format", async () => {
    const el = await mount({
      modelValue: "2026/06/17",
      valueFormat: "YYYY/MM/DD",
      format: "DD.MM.YYYY"
    });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    expect(el.shadowRoot!.querySelector(".field-value")?.textContent).toContain("17.06.2026");
    await selectCalendarDay(el, "2026-06-19");
    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("2026/06/19");
    expect(el.shadowRoot!.querySelector(".field-value")?.textContent).toContain("19.06.2026");
  });

  it("combines min/max with disabledDate for calendar cells", async () => {
    const el = await mount({
      modelValue: "2026-06-17",
      min: "2026-06-10",
      max: "2026-06-25",
      disabledDate: (date) => date.getDay() === 0 || date.getDay() === 6
    } as Partial<DatePickerEl> & { min: string; max: string });
    await openPanel(el);

    const calendar = el.shadowRoot!.querySelector("elf-calendar") as HTMLElement;
    expect((calendar.shadowRoot!.querySelector('[data-date="2026-06-07"]') as HTMLButtonElement).disabled).toBe(true);
    expect((calendar.shadowRoot!.querySelector('[data-date="2026-06-27"]') as HTMLButtonElement).disabled).toBe(true);
    expect((calendar.shadowRoot!.querySelector('[data-date="2026-06-17"]') as HTMLButtonElement).disabled).toBe(false);
  });

  it("opens from ArrowDown, focuses the calendar, and exposes a Top Layer panel", async () => {
    const el = await mount({ modelValue: "2026-06-17", teleported: true });
    const visibleChanges: boolean[] = [];
    el.addEventListener("visible-change", (event) => {
      visibleChanges.push(Boolean((event as CustomEvent).detail));
    });
    const trigger = el.shadowRoot!.querySelector<HTMLButtonElement>(".field-trigger")!;

    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await tick();
    await tick();

    const panel = el.shadowRoot!.querySelector<HTMLElement>('.panel[popover="manual"]');
    const calendar = el.shadowRoot!.querySelector("elf-calendar") as HTMLElement;
    expect(panel).toBeTruthy();
    expect(panel?.getAttribute("role")).toBe("dialog");
    expect(calendar.shadowRoot!.activeElement?.getAttribute("data-date")).toBe("2026-06-17");
    expect(visibleChanges).toEqual([true]);

    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();
    expect(el.shadowRoot!.querySelector(".panel")).toBeNull();
    expect(visibleChanges).toEqual([true, false]);
  });

  it("supports clear fallbacks and custom overlay surfaces", async () => {
    const el = await mount({
      modelValue: "2026-06-17",
      clearable: true,
      valueOnClear: "2026-01-01",
      popperClass: "release-calendar",
      popperStyle: { width: "360px" }
    });
    await openPanel(el);

    const panel = el.shadowRoot!.querySelector<HTMLElement>(".panel")!;
    expect(panel.classList.contains("release-calendar")).toBe(true);
    expect(panel.style.width).toBe("360px");

    const update = vi.fn();
    el.addEventListener("update:modelValue", update as EventListener);
    el.shadowRoot!.querySelector<HTMLButtonElement>(".clear")!.click();
    await tick();
    expect((update.mock.calls[0]![0] as CustomEvent).detail).toBe("2026-01-01");
  });

  it("emits calendar and panel navigation changes", async () => {
    const el = await mount({ type: "month" });
    const panelChange = vi.fn();
    el.addEventListener("panel-change", panelChange as EventListener);
    await openPanel(el);
    el.shadowRoot!.querySelector<HTMLButtonElement>(".month-nav button")!.click();
    await tick();
    expect((panelChange.mock.calls[0]![0] as CustomEvent).detail[1]).toBe("year");

    el.type = "date";
    await tick();
    const calendarChange = vi.fn();
    el.addEventListener("calendar-change", calendarChange as EventListener);
    const calendar = el.shadowRoot!.querySelector("elf-calendar") as HTMLElement;
    calendar.shadowRoot!.querySelector<HTMLButtonElement>("button.day:not(:disabled)")!.click();
    await tick();
    expect(calendarChange).toHaveBeenCalledOnce();
  });

  it("inherits Form size and disabled state", async () => {
    const form = document.createElement("elf-form") as HTMLElement & { disabled?: boolean; size?: string };
    form.disabled = true;
    form.size = "lg";
    const item = document.createElement("elf-form-item");
    const picker = document.createElement("elf-date-picker") as DatePickerEl;
    item.appendChild(picker);
    form.appendChild(item);
    document.body.appendChild(form);
    await tick();
    await tick();

    expect(picker.getAttribute("size")).toBe("lg");
    expect(picker.hasAttribute("disabled")).toBe(true);
    expect(picker.shadowRoot!.querySelector<HTMLButtonElement>(".field-trigger")!.disabled).toBe(true);
  });

  it("supports dual range panels, week numbers, custom cell classes, and advanced placement options", async () => {
    const el = await mount({
      modelValue: "",
      endValue: "",
      range: true,
      singlePanel: false,
      unlinkPanels: true,
      defaultValue: "2026-07-01",
      showWeekNumber: true,
      cellClassName: (date) => date.getDate() === 15 ? "is-release-day" : "",
      fallbackPlacements: ["top-end"],
      popperOptions: { offset: [4, 12], padding: 12 }
    });
    await openPanel(el);

    const calendars = el.shadowRoot!.querySelectorAll<HTMLElement>("elf-calendar");
    expect(calendars).toHaveLength(2);
    await tick();
    expect(calendars[0]!.shadowRoot!.querySelectorAll(".week-number")).toHaveLength(6);
    expect(calendars[0]!.shadowRoot!.querySelector(".day.is-release-day")).toBeTruthy();
    expect(calendars[0]!.shadowRoot!.querySelector(".header")?.textContent).toContain("7");
    expect(calendars[1]!.shadowRoot!.querySelector(".header")?.textContent).toContain("8");
  });
});
