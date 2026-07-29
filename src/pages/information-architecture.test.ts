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
    { PageDirectivesIntroduction },
    { PageClickOutside },
    { PageQualityIntroduction },
    { PageLabsIntroduction }
  ] = await Promise.all([
    import("./getting-started/InstallationPage/index"),
    import("./getting-started/UpgradeGuidePage/index"),
    import("./getting-started/BrowserSupportPage/index"),
    import("./getting-started/FaqPage/index"),
    import("./directives/DirectivesIntroductionPage/index"),
    import("./directives/ClickOutsidePage/index"),
    import("./quality/QualityIntroductionPage/index"),
    import("./labs/LabsIntroductionPage/index")
  ]);

  pages.push(
    { tag: ensureCustomElement(PageInstallation), title: "Installation" },
    { tag: ensureCustomElement(PageUpgradeGuide), title: "Upgrade guide" },
    { tag: ensureCustomElement(PageBrowserSupport), title: "Browser support" },
    { tag: ensureCustomElement(PageFaq), title: "Frequently asked questions" },
    { tag: ensureCustomElement(PageDirectivesIntroduction), title: "Directives" },
    { tag: ensureCustomElement(PageClickOutside), title: "Click outside" },
    { tag: ensureCustomElement(PageQualityIntroduction), title: "Quality" },
    { tag: ensureCustomElement(PageLabsIntroduction), title: "Labs" }
  );
});

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

describe("新文档领域页面", () => {
  it("英文模式覆盖七个入口且不泄漏中文", async () => {
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
});
