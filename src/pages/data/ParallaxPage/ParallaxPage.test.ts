import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";
beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageParallax } = await import("./index");
  pageTag = ensureCustomElement(PageParallax);
}, 30_000);
afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});
const textOf = (root: Node): string => {
  let text = "";
  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) text += ` ${node.textContent || ""}`;
    if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot);
    node.childNodes.forEach(visit);
  };
  visit(root);
  return text.replace(/\s+/g, " ").trim();
};
const mount = async (): Promise<string> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await new Promise((resolve) => setTimeout(resolve, 30));
  return textOf(page);
};
describe("ParallaxPage locale", () => {
  it("renders Chinese docs", async () => {
    const text = await mount();
    expect(text).toContain("基础视差");
    expect(text).toContain("位置、缩放与禁用");
    expect(text).toContain("手动重新计算视差偏移");
  });
  it("renders strict English docs", async () => {
    document.documentElement.lang = "en-US";
    const text = await mount();
    expect(text).toContain("Basic parallax");
    expect(text).toContain("Position, scale, and disabled");
    expect(text).toContain("Recalculate offset");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
