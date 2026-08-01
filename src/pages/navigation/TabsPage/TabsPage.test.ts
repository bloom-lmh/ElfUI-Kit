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
  ]);

  pageTag = ensureCustomElement(pageModule.PageTabs);
  propsTag = ensureCustomElement(propsModule.PageTabsProps);
  for (const [index, module] of exampleModules.entries()) {
    const component = module[`PageTabsEx${index + 1}` as keyof typeof module];
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

const mount = async (tag: string): Promise<HTMLElement> => {
  const element = document.createElement(tag);
  document.body.appendChild(element);
  await wait();
  await wait();
  return element;
};

describe("Tabs documentation", () => {
  it("renders ten examples and complete localized API tables", async () => {
    const page = await mount(pageTag);
    expect(page.shadowRoot?.querySelector("h1")?.textContent).toBe("Tabs");
    expect(
      page.shadowRoot?.querySelectorAll(
        "elf-page-tabs-ex1, elf-page-tabs-ex2, elf-page-tabs-ex3, elf-page-tabs-ex4, elf-page-tabs-ex5, elf-page-tabs-ex6, elf-page-tabs-ex7, elf-page-tabs-ex8, elf-page-tabs-ex9, elf-page-tabs-ex10",
      ),
    ).toHaveLength(10);

    const propsPage = await mount(propsTag);
    const tables = propsPage.shadowRoot?.querySelectorAll<PropsTableElement>("elf-props-table");
    expect(tables).toHaveLength(6);
    expect(tables?.[0]?.rows?.[0]?.desc).toContain("Data-driven tabs");
    expect(tables?.[2]?.rows?.some((row) => row.name === "tabListRef / tabBarRef")).toBe(true);
  });

  it("keeps every preview centered and every changing state in the title row", async () => {
    for (const tag of exampleTags) {
      const example = await mount(tag);
      const playgrounds = example.shadowRoot?.querySelectorAll<PlaygroundElement>("elf-playground");
      expect(playgrounds?.length).toBeGreaterThan(0);

      for (const playground of playgrounds ?? []) {
        const status = playground.querySelector<HTMLElement>('[slot="status"]');
        expect(playground.querySelector(".tabs-demo-stage")).not.toBeNull();
        expect(status?.parentElement).toBe(playground);
        expect(status?.getAttribute("role")).toBe("status");
        expect(status?.getAttribute("aria-live")).toBe("polite");
      }
      example.remove();
    }
  });

  it("keeps English Template and Script source free of untranslated Han text", async () => {
    for (const tag of exampleTags) {
      const example = await mount(tag);
      const playgrounds = example.shadowRoot?.querySelectorAll<PlaygroundElement>("elf-playground");
      for (const playground of playgrounds ?? []) {
        expect(`${playground.code ?? ""}\n${playground.script ?? ""}`).not.toMatch(
          /[\u3400-\u9fff]/u,
        );
      }
      example.remove();
    }
  });

  it("uses real controls and the framework Transition in the applicable examples", async () => {
    const playgroundExample = await mount(exampleTags[7]!);
    const playground =
      playgroundExample.shadowRoot?.querySelector<PlaygroundElement>("elf-playground");
    const controls = playground?.querySelector<HTMLElement>('[slot="controls"]');
    expect(controls?.querySelectorAll("elf-select")).toHaveLength(5);
    expect(controls?.querySelectorAll("elf-checkbox")).toHaveLength(2);

    const galleryExample = await mount(exampleTags[8]!);
    const galleryPlayground =
      galleryExample.shadowRoot?.querySelector<PlaygroundElement>("elf-playground");
    expect(galleryPlayground?.code).toContain('<Transition name="tabs-gallery">');
  });

  it("updates the basic example status from the real Tabs interaction", async () => {
    const example = await mount(exampleTags[0]!);
    const tabs = example.shadowRoot?.querySelector<HTMLElement>("elf-tabs");
    const status = example.shadowRoot?.querySelector<HTMLElement>('[slot="status"]');
    const buttons = tabs?.shadowRoot?.querySelectorAll<HTMLButtonElement>(".tab");

    buttons?.[1]?.click();
    await wait();
    expect(status?.textContent).toContain("projects");
  });
});
