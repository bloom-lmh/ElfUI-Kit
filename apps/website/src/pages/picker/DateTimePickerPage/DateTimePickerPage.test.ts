import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";
let adapterTag = "";

beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const [{ PageDateTimePicker }, { PageDateTimePickerEx4 }] = await Promise.all([
    import("./index"),
    import("./ex4"),
  ]);
  pageTag = ensureCustomElement(PageDateTimePicker);
  adapterTag = ensureCustomElement(PageDateTimePickerEx4);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("DateTimePicker documentation", () => {
  it("renders four focused examples and complete API tables", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    expect(
      page.shadowRoot?.querySelectorAll(
        "elf-page-date-time-picker-ex1, elf-page-date-time-picker-ex2, elf-page-date-time-picker-ex3, elf-page-date-time-picker-ex4",
      ),
    ).toHaveLength(4);
    const api = page.shadowRoot?.querySelector("elf-page-date-time-picker-props");
    expect(api?.shadowRoot?.querySelectorAll("elf-props-table")).toHaveLength(3);
  });

  it("demonstrates the ConfigProvider date adapter", async () => {
    const page = document.createElement(adapterTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const provider = page.shadowRoot?.querySelector("elf-config-provider") as HTMLElement & {
      config?: { date?: { firstDayOfWeek?: number } };
    };
    expect(provider.config?.date?.firstDayOfWeek).toBe(0);
    expect(page.shadowRoot?.querySelector("elf-date-time-picker")).not.toBeNull();
  });
});
