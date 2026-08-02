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
    { PageLabsHeatmap },
    { PageLabsCodeCard },
  ] = await Promise.all([
    import("./getting-started/InstallationPage/index"),
    import("./getting-started/UpgradeGuidePage/index"),
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
    import("./labs/HeatmapPage/index"),
    import("./labs/CodeCardPage/index"),
  ]);

  pages.push(
    { tag: ensureCustomElement(PageInstallation), title: "Installation" },
    { tag: ensureCustomElement(PageUpgradeGuide), title: "Upgrade guide" },
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
    { tag: ensureCustomElement(PageLabsHeatmap), title: "Heatmap" },
    { tag: ensureCustomElement(PageLabsCodeCard), title: "Code Card" },
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
      [
        "Installation",
        [
          [".docs-checklist li", 4],
          ["elf-code-card", 6],
          ['elf-code-card[variant="workbench"]', 6],
          ['[slot="footer"]', 6],
          ["elf-quote", 2],
          [".guide-content", 1],
        ],
      ],
      [
        "Upgrade guide",
        [
          ["elf-collapse", 1],
          ["elf-collapse-item", 3],
          ["elf-code-card", 1],
          [".guide-content", 1],
        ],
      ],
      [
        "Frequently asked questions",
        [
          ["elf-collapse", 4],
          [".docs-section", 4],
          [".guide-content", 1],
        ],
      ],
      [
        "Click outside",
        [
          ["elf-playground", 1],
          ["elf-props-table", 1],
        ],
      ],
      [
        "Intersect",
        [
          ["elf-playground", 1],
          ["elf-props-table", 1],
        ],
      ],
      [
        "Mutate",
        [
          ["elf-playground", 1],
          ["elf-props-table", 1],
        ],
      ],
      [
        "Resize",
        [
          ["elf-playground", 1],
          ["elf-props-table", 1],
        ],
      ],
      [
        "Ripple",
        [
          ["elf-playground", 1],
          ["elf-props-table", 1],
        ],
      ],
      [
        "Scroll",
        [
          ["elf-playground", 1],
          ["elf-props-table", 1],
        ],
      ],
      [
        "Tooltip",
        [
          ["elf-playground", 1],
          ["elf-props-table", 1],
        ],
      ],
      [
        "Touch",
        [
          ["elf-playground", 1],
          ["elf-props-table", 1],
        ],
      ],
      [
        "Video",
        [
          ["elf-playground", 1],
          ["elf-props-table", 2],
        ],
      ],
      [
        "Heatmap",
        [
          ["elf-playground", 1],
          ["elf-props-table", 2],
        ],
      ],
      [
        "Code Card",
        [
          ["elf-playground", 5],
          ["elf-props-table", 3],
        ],
      ],
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
      if (pageCase.title === "Installation") {
        interface CodeCardProbe extends HTMLElement {
          code: string;
          items: Array<{ key: string; code: string }>;
        }
        const cards = Array.from(
          page.shadowRoot?.querySelectorAll("elf-code-card") || [],
        ) as Array<CodeCardProbe>;
        expect(cards).toHaveLength(6);
        expect(cards.every((card) => Boolean(card.shadowRoot?.querySelector(".card-header")))).toBe(
          true,
        );
        expect(
          cards.every((card) =>
            Boolean(card.shadowRoot?.querySelector(".card-header")?.textContent),
          ),
        ).toBe(true);
        expect(cards[0]?.items.map((item) => item.key)).toEqual([
          "scaffold",
          "router",
          "bare",
          "existing",
        ]);
        expect(cards[0]?.items[0]?.code.split("\n")).toEqual([
          "pnpm create elfui@beta my-app --install",
          "cd my-app",
          "pnpm dev",
        ]);
        expect(cards[1]?.items.map((item) => item.key)).toEqual(["pnpm", "npm", "yarn"]);
        expect(cards[1]?.items[0]?.code).toBe("pnpm add @elfui/kit");
        expect(cards[3]?.items.map((item) => item.key)).toEqual(["utilities", "labs"]);
      }
      page.remove();
    }
  });

  it("解释 DOM 变更监听与外部点击排除目标的用途", async () => {
    const clickOutsideCase = pages.find(({ title }) => title === "Click outside");
    const mutateCase = pages.find(({ title }) => title === "Mutate");
    expect(clickOutsideCase).toBeDefined();
    expect(mutateCase).toBeDefined();

    const clickOutsidePage = document.createElement(clickOutsideCase!.tag);
    const mutatePage = document.createElement(mutateCase!.tag);
    document.body.append(clickOutsidePage, mutatePage);
    await wait();

    expect(collectText(clickOutsidePage)).toContain("触发按钮（已排除）");
    expect(collectText(clickOutsidePage)).toContain("不会同时被当作一次外部点击");
    expect(collectText(mutatePage)).toContain("它不监听业务变量");
    expect(collectText(mutatePage)).toContain("普通界面状态继续使用 ref、computed 或 watch");
  });
});
