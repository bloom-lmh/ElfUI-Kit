import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageDatePickerEx6 } = await import("./ex6");
  exampleTag = ensureCustomElement(PageDatePickerEx6);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const wait = (ms = 20): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

describe("DatePickerPage", () => {
  it("格式边界案例公开禁用函数、Top Layer 与完整 Script", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await wait();

    const picker = page.shadowRoot!.querySelector<HTMLElement>("elf-date-picker")!;
    const playground = page.shadowRoot!.querySelector<HTMLElement>("elf-playground")!;
    expect((picker as HTMLElement & { valueFormat?: string }).valueFormat).toBe("YYYY/MM/DD");
    expect((picker as HTMLElement & { teleported?: boolean }).teleported).toBe(true);
    expect(typeof (picker as HTMLElement & { disabledDate?: unknown }).disabledDate).toBe("function");
    expect((playground as HTMLElement & { script?: string }).script).toContain("disableWeekend");

    picker.shadowRoot!.querySelector<HTMLButtonElement>(".field-trigger")!.click();
    await wait();
    const calendar = picker.shadowRoot!.querySelector("elf-calendar") as HTMLElement;
    expect((calendar.shadowRoot!.querySelector('[data-date="2026-06-20"]') as HTMLButtonElement).disabled).toBe(true);
    expect(picker.shadowRoot!.querySelector('.panel[popover="manual"]')).toBeTruthy();
  });
});
