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
  ]);

  pageTag = ensureCustomElement(pageModule.PageTimePicker);
  for (const [index, module] of exampleModules.entries()) {
    const component = module[`PageTimePickerEx${index + 1}` as keyof typeof module];
    exampleTags.push(ensureCustomElement(component));
  }
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
});

afterAll(() => {
  document.documentElement.lang = "zh-CN";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

const deepQuery = <T extends Element>(root: ParentNode, selector: string): T | null => {
  const direct = root.querySelector<T>(selector);
  if (direct) return direct;
  for (const element of Array.from(root.querySelectorAll("*"))) {
    if (!element.shadowRoot) continue;
    const nested = deepQuery<T>(element.shadowRoot, selector);
    if (nested) return nested;
  }
  return null;
};

describe("TimePicker documentation", () => {
  it("renders six focused examples and complete API tables", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    expect(
      page.shadowRoot?.querySelectorAll(
        "elf-page-time-picker-ex1, elf-page-time-picker-ex2, elf-page-time-picker-ex3, elf-page-time-picker-ex4, elf-page-time-picker-ex5, elf-page-time-picker-ex6",
      ),
    ).toHaveLength(6);
    expect(deepQuery(page.shadowRoot!, "h1")?.textContent).toBe("TimePicker");
    expect(deepQuery(page.shadowRoot!, "p")?.textContent).toContain("Material clock face");

    const api = page.shadowRoot?.querySelector("elf-page-time-picker-props");
    const tables = api?.shadowRoot?.querySelectorAll<PropsTableElement>("elf-props-table");
    expect(tables).toHaveLength(3);
    expect(tables?.[0]?.rows?.[0]?.desc).toContain("Controlled time value");
  });

  it("keeps every preview centered and every changing state in the title row", async () => {
    for (const tag of exampleTags) {
      const page = document.createElement(tag);
      document.body.appendChild(page);
      await tick();
      await tick();

      const playground = page.shadowRoot?.querySelector<PlaygroundElement>("elf-playground");
      const status = playground?.querySelector<HTMLElement>('[slot="status"]');
      expect(playground).not.toBeNull();
      expect(playground?.querySelector(".time-picker-demo-stage")).not.toBeNull();
      expect(status?.parentElement).toBe(playground);
      expect(status?.getAttribute("role")).toBe("status");
      expect(status?.getAttribute("aria-live")).toBe("polite");
      page.remove();
    }
  });

  it("localizes the title and copied template while keeping status reactive", async () => {
    const page = document.createElement(exampleTags[0]!);
    document.body.appendChild(page);
    await tick();
    await tick();

    const playground = page.shadowRoot?.querySelector<PlaygroundElement>("elf-playground");
    const picker = page.shadowRoot?.querySelector("elf-time-picker");
    expect(playground?.title).toBe("Single time");
    expect(playground?.code).toContain('label="Start time"');
    expect(playground?.script).toContain('useRef("09:30")');

    picker?.dispatchEvent(new CustomEvent("update:modelValue", { detail: "10:15" }));
    await tick();
    expect(page.shadowRoot?.querySelector('[slot="status"]')?.textContent).toContain("10:15");
  });
});
