import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

interface PlaygroundElement extends HTMLElement {
  code?: string;
  script?: string;
}

interface PropsTableElement extends HTMLElement {
  rows?: Array<{ name: string; desc?: string; default?: string }>;
}

const HAN_TEXT = /[\u3400-\u9fff]/u;
const STATUS_EXAMPLES = new Set([1, 2, 9, 11, 13, 15, 16, 17, 18, 19, 20, 21]);

let pageTag = "";
let propsTag = "";
const exampleTags: string[] = [];

beforeAll(async () => {
  document.documentElement.lang = "en-US";
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const [pageModule, propsModule, ...exampleModules] = await Promise.all([
    import("./index"),
    import("./props"),
    import("./ex1"),
    import("./ex2"),
    import("./ex3"),
    import("./ex4"),
    import("./ex5"),
    import("./ex6"),
    import("./ex7"),
    import("./ex8"),
    import("./ex9"),
    import("./ex10"),
    import("./ex11"),
    import("./ex12"),
    import("./ex13"),
    import("./ex14"),
    import("./ex15"),
    import("./ex16"),
    import("./ex17"),
    import("./ex18"),
    import("./ex19"),
    import("./ex20"),
    import("./ex21"),
    import("./ex22"),
  ]);

  pageTag = ensureCustomElement(pageModule.PageTable);
  propsTag = ensureCustomElement(propsModule.PageTableProps);
  for (const [index, module] of exampleModules.entries()) {
    const component = module[`PageTableEx${index + 1}` as keyof typeof module];
    exampleTags.push(ensureCustomElement(component));
  }
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
});

afterAll(() => {
  document.documentElement.lang = "zh-CN";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

const mount = async (tag: string): Promise<HTMLElement> => {
  const element = document.createElement(tag);
  document.body.appendChild(element);
  await tick();
  return element;
};

const collectText = (root: Node): string => {
  let text = "";

  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += `${node.textContent ?? ""}\n`;
      return;
    }

    if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot);
    node.childNodes.forEach(visit);
  };

  visit(root);
  return text.replace(/\s+/g, " ").trim();
};

describe("Table documentation locale", () => {
  it("renders all 22 examples and the public API section", async () => {
    const page = await mount(pageTag);
    const exampleSelector = Array.from(
      { length: 22 },
      (_, index) => `elf-page-table-ex${index + 1}`,
    ).join(", ");

    expect(page.shadowRoot?.querySelector("h1")?.textContent).toBe("Table");
    expect(page.shadowRoot?.querySelector("p")?.textContent).toContain("sorting, selection");
    expect(page.shadowRoot?.querySelectorAll(exampleSelector)).toHaveLength(22);
    expect(page.shadowRoot?.querySelector("elf-page-table-props")).toBeTruthy();
  });

  it("centers every preview and keeps dynamic state in the title row", async () => {
    for (const [index, tag] of exampleTags.entries()) {
      const exampleNumber = index + 1;
      const example = await mount(tag);
      const playground = example.shadowRoot?.querySelector<PlaygroundElement>("elf-playground");
      const status = playground?.querySelector<HTMLElement>('[slot="status"]');

      expect(playground, `example ${exampleNumber} playground`).not.toBeNull();
      expect(
        playground?.querySelector(".table-demo-stage"),
        `example ${exampleNumber} stage`,
      ).not.toBeNull();
      expect(Boolean(status), `example ${exampleNumber} status`).toBe(
        STATUS_EXAMPLES.has(exampleNumber),
      );
      if (status) {
        expect(status.parentElement).toBe(playground);
        expect(status.getAttribute("role")).toBe("status");
        expect(status.getAttribute("aria-live")).toBe("polite");
      }
      example.remove();
    }
  });

  it("keeps English previews and runnable source free of untranslated Han text", async () => {
    for (const [index, tag] of exampleTags.entries()) {
      const example = await mount(tag);
      const playground = example.shadowRoot?.querySelector<PlaygroundElement>("elf-playground");

      expect(collectText(example), `example ${index + 1} visible text`).not.toMatch(HAN_TEXT);
      expect(
        `${playground?.code ?? ""}\n${playground?.script ?? ""}`,
        `example ${index + 1} source`,
      ).not.toMatch(HAN_TEXT);
      example.remove();
    }
  });

  it("localizes every public API description and displayed default", async () => {
    const props = await mount(propsTag);
    const tables = props.shadowRoot?.querySelectorAll<PropsTableElement>("elf-props-table");

    expect(tables).toHaveLength(5);
    expect(collectText(props)).not.toMatch(HAN_TEXT);
    for (const table of tables ?? []) {
      for (const row of table.rows ?? []) {
        expect(`${row.desc ?? ""}\n${row.default ?? ""}`, row.name).not.toMatch(HAN_TEXT);
      }
    }
  });
});
