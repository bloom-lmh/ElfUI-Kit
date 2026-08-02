import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageUpgradeGuide } = await import("./index");
  pageTag = ensureCustomElement(PageUpgradeGuide);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const collectText = (root: Node): string => {
  let text = "";
  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) text += ` ${node.textContent || ""}`;
    if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot);
    node.childNodes.forEach(visit);
  };
  visit(root);
  return text.replace(/\s+/g, " ").trim();
};

describe("UpgradeGuidePage release history", () => {
  it("splits release history into framework and kit collapse groups", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const root = page.shadowRoot!;
    const headings = Array.from(root.querySelectorAll<HTMLElement>(".release-group-title")).map(
      (node) => node.textContent?.trim(),
    );

    expect(headings).toContain("框架版本记录");
    expect(headings).toContain("组件库版本记录");
    expect(root.querySelectorAll(".release-accordion")).toHaveLength(2);
    const text = collectText(page);
    expect(text).toContain("Framework v0.1.0-beta.20");
    expect(text).toContain("Framework v0.1.0-beta.18");
    expect(text).toContain("v0.0.2-beta.1");
  });
});
