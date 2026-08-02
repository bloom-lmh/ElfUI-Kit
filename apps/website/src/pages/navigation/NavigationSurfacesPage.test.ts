import { afterEach, beforeAll, describe, expect, it } from "vitest";

const pageTags: Record<string, string> = {};

beforeAll(async () => {
  await import("../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const pages = await Promise.all([
    import("./AppBarPage/index"),
    import("./BottomNavigationPage/index"),
    import("./FooterPage/index"),
  ]);
  pageTags.appBar = ensureCustomElement(pages[0].PageAppBar);
  pageTags.bottomNavigation = ensureCustomElement(pages[1].PageBottomNavigation);
  pageTags.footer = ensureCustomElement(pages[2].PageFooter);
}, 60_000);

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});
const wait = (ms = 25): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
const collectText = (root: Node): string => {
  let output = "";
  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) output += ` ${node.textContent || ""}`;
    if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot);
    node.childNodes.forEach(visit);
  };
  visit(root);
  return output.replace(/\s+/g, " ").trim();
};
const mount = async (tag: string): Promise<HTMLElement> => {
  const page = document.createElement(tag);
  document.body.appendChild(page);
  await wait();
  await wait();
  return page;
};

describe("navigation surface documentation", () => {
  it.each([
    ["appBar", "滚动行为", "图片", "突出模式"],
    ["bottomNavigation", "颜色", "铺满", "Shift 模式"],
    ["footer", "公司页脚", "靛蓝页脚", "青绿页脚"],
  ])("renders %s Chinese examples under the global theme", async (key, first, second, third) => {
    const page = await mount(pageTags[key]!);
    const text = collectText(page);
    expect(text).toContain(first);
    expect(text).toContain(second);
    expect(text).toContain(third);
    expect(text).not.toContain("切换预览明暗");
    expect(page.shadowRoot!.querySelector("elf-theme-provider")).toBeNull();
  });

  it("uses ElfUI controls for configurable navigation examples", async () => {
    const appBar = await mount(pageTags.appBar!);
    const bottomNavigation = await mount(pageTags.bottomNavigation!);
    expect(appBar.shadowRoot!.querySelectorAll("elf-switch")).toHaveLength(5);
    expect(appBar.shadowRoot!.querySelector("elf-slider")).not.toBeNull();
    expect(bottomNavigation.shadowRoot!.querySelector("elf-switch")).not.toBeNull();
    expect(
      appBar.shadowRoot!.querySelector('input[type="checkbox"], input[type="range"]'),
    ).toBeNull();
    expect(
      bottomNavigation.shadowRoot!.querySelector('input[type="checkbox"], input[type="range"]'),
    ).toBeNull();
  }, 15_000);

  it("keeps grow and horizontal bottom-navigation selections independent", async () => {
    const page = await mount(pageTags.bottomNavigation!);
    const navigationItems = page.shadowRoot!.querySelectorAll("elf-bottom-navigation");
    const grow = navigationItems[1]!;
    const horizontal = navigationItems[2]!;

    grow.shadowRoot!.querySelectorAll<HTMLButtonElement>("button.item")[0]!.click();
    await wait();

    expect(
      grow.shadowRoot!.querySelector<HTMLButtonElement>('button[aria-current="page"]')?.dataset
        .navKey,
    ).toBe("recent");
    expect(
      horizontal.shadowRoot!.querySelector<HTMLButtonElement>('button[aria-current="page"]')
        ?.dataset.navKey,
    ).toBe("favorites");
  });

  it.each([
    ["appBar", "Scroll behavior", "Prominent"],
    ["bottomNavigation", "Color", "Grow"],
    ["footer", "Company footer", "Indigo footer"],
  ])("renders %s English examples", async (key, first, second) => {
    document.documentElement.lang = "en-US";
    const text = collectText(await mount(pageTags[key]!));
    expect(text).toContain(first);
    expect(text).toContain(second);
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });

  it.each([
    ["appBar", 4],
    ["bottomNavigation", 5],
    ["footer", 3],
  ])("renders the complete %s example set", async (key, count) => {
    const page = await mount(pageTags[key]!);
    expect(page.shadowRoot!.querySelectorAll("elf-playground")).toHaveLength(count);
  });
});
