import { afterEach, beforeAll, describe, expect, it } from "vitest";

interface PageCase {
  tag: string;
  title: string;
}

const pages: PageCase[] = [];

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

const wait = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 20));

beforeAll(async () => {
  await import("../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const [
    { PageInstallation },
    { PageUpgradeGuide },
    { PageBrowserSupport },
    { PageFaq },
    { PageClickOutside },
    { PageIntersect },
    { PageMutate },
    { PageResize },
    { PageRipple },
    { PageScroll },
    { PageTooltipDirective },
    { PageTouch },
    { PageLabsVideo },
    { PageLabsHeatmap }
  ] = await Promise.all([
    import("./getting-started/InstallationPage/index"),
    import("./getting-started/UpgradeGuidePage/index"),
    import("./getting-started/BrowserSupportPage/index"),
    import("./getting-started/FaqPage/index"),
    import("./directives/ClickOutsidePage/index"),
    import("./directives/IntersectPage/index"),
    import("./directives/MutatePage/index"),
    import("./directives/ResizePage/index"),
    import("./directives/RipplePage/index"),
    import("./directives/ScrollPage/index"),
    import("./directives/TooltipPage/index"),
    import("./directives/TouchPage/index"),
    import("./labs/VideoPage/index"),
    import("./labs/HeatmapPage/index")
  ]);

  pages.push(
    { tag: ensureCustomElement(PageInstallation), title: "Install ElfUI Kit" },
    { tag: ensureCustomElement(PageUpgradeGuide), title: "Upgrade guide" },
    { tag: ensureCustomElement(PageBrowserSupport), title: "Browser support" },
    { tag: ensureCustomElement(PageFaq), title: "Frequently asked questions" },
    { tag: ensureCustomElement(PageClickOutside), title: "Click outside" },
    { tag: ensureCustomElement(PageIntersect), title: "Intersect" },
    { tag: ensureCustomElement(PageMutate), title: "Mutate" },
    { tag: ensureCustomElement(PageResize), title: "Resize" },
    { tag: ensureCustomElement(PageRipple), title: "Ripple" },
    { tag: ensureCustomElement(PageScroll), title: "Scroll" },
    { tag: ensureCustomElement(PageTooltipDirective), title: "Tooltip" },
    { tag: ensureCustomElement(PageTouch), title: "Touch" },
    { tag: ensureCustomElement(PageLabsVideo), title: "Video" },
    { tag: ensureCustomElement(PageLabsHeatmap), title: "Heatmap" }
  );
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

describe("新文档领域页面", () => {
  it("英文模式覆盖全部入口且不泄漏中文", async () => {
    document.documentElement.lang = "en-US";

    for (const pageCase of pages) {
      const page = document.createElement(pageCase.tag);
      document.body.appendChild(page);
      await wait();
      const text = collectText(page);
      expect(text).toContain(pageCase.title);
      expect(text, pageCase.title).not.toMatch(/[\u3400-\u9fff]/u);
      page.remove();
    }
  });

  it("为不同文档领域提供完整且差异化的学习结构", async () => {
    const expectations = new Map<string, ReadonlyArray<readonly [string, number]>>([
      ["Install ElfUI Kit", [[".docs-step", 3], [".docs-checklist li", 4]]],
      ["Upgrade guide", [[".docs-flow-item", 3], [".docs-matrix", 1]]],
      ["Browser support", [[".docs-matrix", 2], [".docs-checklist li", 4]]],
      ["Frequently asked questions", [["details", 10], [".docs-section", 4]]],
      ["Click outside", [["elf-playground", 1], ["elf-props-table", 1]]],
      ["Intersect", [["elf-playground", 1], ["elf-props-table", 1]]],
      ["Mutate", [["elf-playground", 1], ["elf-props-table", 1]]],
      ["Resize", [["elf-playground", 1], ["elf-props-table", 1]]],
      ["Ripple", [["elf-playground", 1], ["elf-props-table", 1]]],
      ["Scroll", [["elf-playground", 1], ["elf-props-table", 1]]],
      ["Tooltip", [["elf-playground", 1], ["elf-props-table", 1]]],
      ["Touch", [["elf-playground", 1], ["elf-props-table", 1]]],
      ["Video", [["elf-playground", 1], ["elf-props-table", 2]]],
      ["Heatmap", [["elf-playground", 1], ["elf-props-table", 2]]],
    ]);

    for (const pageCase of pages) {
      const page = document.createElement(pageCase.tag);
      document.body.appendChild(page);
      await wait();
      for (const [selector, minimum] of expectations.get(pageCase.title) || []) {
        expect(
          page.shadowRoot?.querySelectorAll(selector).length,
          `${pageCase.title}: ${selector}`,
        ).toBeGreaterThanOrEqual(minimum);
      }
      page.remove();
    }
  });
});
