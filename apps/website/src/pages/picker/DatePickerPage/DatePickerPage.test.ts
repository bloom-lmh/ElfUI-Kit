import { registerAllComponents } from "@elfui/kit";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

interface PlaygroundElement extends HTMLElement {
  code?: string;
  script?: string;
  title?: string;
}

interface PropsTableElement extends HTMLElement {
  rows?: Array<{ name: string; desc?: string }>;
}

let pageTag = "";
const exampleTags: string[] = [];

beforeAll(async () => {
  document.documentElement.lang = "en-US";
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const [pageModule, ...exampleModules] = await Promise.all([
    import("./index"),
    import("./ex1"),
    import("./ex2"),
    import("./ex3"),
    import("./ex4"),
    import("./ex5"),
    import("./ex6"),
    import("./ex7"),
    import("./ex8"),
  ]);

  pageTag = ensureCustomElement(pageModule.PageDatePicker);
  for (const [index, module] of exampleModules.entries()) {
    const component = module[`PageDatePickerEx${index + 1}` as keyof typeof module];
    exampleTags.push(ensureCustomElement(component));
  }
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
});

afterAll(() => {
  document.documentElement.lang = "zh-CN";
});

const wait = (ms = 20): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

const deepQuery = <T extends Element>(root: ParentNode, selector: string): T | null => {
  const direct = root.querySelector<T>(selector);
  if (direct) return direct;
  for (const element of Array.from(root.querySelectorAll("*"))) {
    if (element.shadowRoot) {
      const nested = deepQuery<T>(element.shadowRoot, selector);
      if (nested) return nested;
    }
  }
  return null;
};

describe("DatePicker documentation", () => {
  it("renders eight focused examples and complete localized API tables", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    expect(
      page.shadowRoot?.querySelectorAll(
        "elf-page-date-picker-ex1, elf-page-date-picker-ex2, elf-page-date-picker-ex3, elf-page-date-picker-ex4, elf-page-date-picker-ex5, elf-page-date-picker-ex6, elf-page-date-picker-ex7, elf-page-date-picker-ex8",
      ),
    ).toHaveLength(8);
    expect(deepQuery(page.shadowRoot!, "h1")?.textContent).toBe("DatePicker");
    expect(deepQuery(page.shadowRoot!, "p")?.textContent).toContain("shared Calendar");

    const api = page.shadowRoot?.querySelector("elf-page-date-picker-props");
    const tables = api?.shadowRoot?.querySelectorAll<PropsTableElement>("elf-props-table");
    expect(tables).toHaveLength(4);
    expect(tables?.[0]?.rows?.[0]?.desc).toContain("Controlled single");
  });

  it("keeps every preview centered and every changing state in the title row", async () => {
    for (const tag of exampleTags) {
      const example = document.createElement(tag);
      document.body.appendChild(example);
      await tick();
      await tick();

      const playground = example.shadowRoot?.querySelector<PlaygroundElement>("elf-playground");
      const status = playground?.querySelector<HTMLElement>('[slot="status"]');
      expect(playground).not.toBeNull();
      expect(playground?.querySelector(".date-picker-demo-stage")).not.toBeNull();
      expect(status?.parentElement).toBe(playground);
      expect(status?.getAttribute("role")).toBe("status");
      expect(status?.getAttribute("aria-live")).toBe("polite");
      example.remove();
    }
  });

  it("localizes copied source and drives the advanced example from real controls", async () => {
    const example = document.createElement(exampleTags[6]!);
    document.body.appendChild(example);
    await tick();
    await tick();

    const playground = example.shadowRoot?.querySelector<PlaygroundElement>("elf-playground");
    const controls = playground?.querySelector<HTMLElement>('[slot="controls"]');
    const picker = example.shadowRoot?.querySelector<HTMLElement>("elf-date-picker");
    const switches = controls?.querySelectorAll<HTMLElement>("elf-switch");

    expect(playground?.title).toBe("Dual panels and advanced positioning");
    expect(playground?.code).toContain('<span slot="range-separator">to</span>');
    expect(playground?.script).toContain("const dualPanel = useRef(true)");
    expect(controls?.getAttribute("aria-label")).toBe("Panel configuration");
    expect(switches).toHaveLength(3);
    expect((picker as HTMLElement & { singlePanel?: boolean }).singlePanel).toBe(false);

    switches?.[0]?.dispatchEvent(new CustomEvent("update:modelValue", { detail: false }));
    await tick();
    expect((picker as HTMLElement & { singlePanel?: boolean }).singlePanel).toBe(true);
  });

  it("documents disabled-date formatting, Top Layer, and a complete script", async () => {
    const example = document.createElement(exampleTags[5]!);
    document.body.appendChild(example);
    await wait();

    const picker = example.shadowRoot!.querySelector<HTMLElement>("elf-date-picker")!;
    const playground = example.shadowRoot!.querySelector<PlaygroundElement>("elf-playground")!;
    expect((picker as HTMLElement & { valueFormat?: string }).valueFormat).toBe("YYYY/MM/DD");
    expect((picker as HTMLElement & { teleported?: boolean }).teleported).toBe(true);
    expect(typeof (picker as HTMLElement & { disabledDate?: unknown }).disabledDate).toBe(
      "function",
    );
    expect(playground.script).toContain("disableWeekend");

    const trigger = picker.shadowRoot!.querySelector<HTMLButtonElement>(".field-trigger")!;
    trigger.click();
    await wait();
    const calendar = picker.shadowRoot!.querySelector("elf-calendar") as HTMLElement;
    expect(
      (calendar.shadowRoot!.querySelector('[data-date="2026-06-20"]') as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(picker.shadowRoot!.querySelector('.panel[popover="manual"]')).toBeTruthy();
  });

  it("closes only the topmost date overlay before its containing Dialog", async () => {
    const example = document.createElement(exampleTags[7]!);
    document.body.appendChild(example);
    await wait();

    example.shadowRoot!.querySelector<HTMLElement>("#date-picker-open-dialog")!.click();
    await wait();

    const picker = document.body.querySelector<HTMLElement>("#dialog-date-picker")!;
    const trigger = picker.shadowRoot!.querySelector<HTMLButtonElement>(".field-trigger")!;
    trigger.click();
    await wait();
    expect(picker.shadowRoot!.querySelector(".panel")).toBeTruthy();
    expect(document.body.querySelector(".elf-dialog-mask")).toBeTruthy();

    trigger.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
    await wait();
    expect(picker.shadowRoot!.querySelector(".panel")).toBeNull();
    expect(document.body.querySelector(".elf-dialog-mask")).toBeTruthy();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await wait(260);
    expect(document.body.querySelector(".elf-dialog-mask")).toBeNull();
  });
});
