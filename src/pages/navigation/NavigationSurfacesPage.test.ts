import { afterEach, beforeAll, describe, expect, it } from "vitest";

const pageTags: Record<string, string> = {};

beforeAll(async () => {
  await import("../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const pages = await Promise.all([
    import("./AppBarPage/index"),
    import("./BottomNavigationPage/index"),
    import("./FooterPage/index")
  ]);
  pageTags.appBar = ensureCustomElement(pages[0].PageAppBar);
  pageTags.bottomNavigation = ensureCustomElement(pages[1].PageBottomNavigation);
  pageTags.footer = ensureCustomElement(pages[2].PageFooter);
}, 30_000);

afterEach(() => { document.body.innerHTML = ""; document.documentElement.lang = "zh-CN"; });
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
  await wait(); await wait();
  return page;
};

describe("navigation surface documentation", () => {
  it.each([
    ["appBar", "滚动行为实验台", "突出与图片", "密度层级"],
    ["bottomNavigation", "图标与文本", "水平与铺满", "Shift 模式"],
    ["footer", "公司页脚", "品牌社交页脚", "连接型页脚"]
  ])("renders %s Chinese examples and theme controls", async (key, first, second, third) => {
    const text = collectText(await mount(pageTags[key]!));
    expect(text).toContain(first);
    expect(text).toContain(second);
    expect(text).toContain(third);
    expect(text).toContain("切换预览明暗");
  });

  it.each([
    ["appBar", "Scroll behavior lab", "Prominent with imagery"],
    ["bottomNavigation", "Icons and labels", "Horizontal and grow"],
    ["footer", "Company footer", "Brand social footer"]
  ])("renders %s English examples", async (key, first, second) => {
    document.documentElement.lang = "en-US";
    const text = collectText(await mount(pageTags[key]!));
    expect(text).toContain(first);
    expect(text).toContain(second);
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
