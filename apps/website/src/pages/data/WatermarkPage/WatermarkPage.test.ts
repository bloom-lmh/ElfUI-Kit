import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
let pageTag = "";
beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageWatermark } = await import("./index");
  pageTag = ensureCustomElement(PageWatermark);
}, 30_000);
afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});
const collect = (root: Node): string => {
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
  await new Promise((r) => setTimeout(r, 30));
  return collect(page);
};
describe("WatermarkPage locale", () => {
  it("renders Chinese docs", async () => {
    const text = await mount();
    expect(text).toContain("基础水印");
    expect(text).toContain("外部挂载与防篡改");
    expect(text).toContain("立即重建并同步水印覆盖层");
  });
  it("renders strict English docs", async () => {
    document.documentElement.lang = "en-US";
    const text = await mount();
    expect(text).toContain("Basic watermark");
    expect(text).toContain("External mount and anti-tamper");
    expect(text).toContain("Rebuild and synchronize the watermark overlay immediately");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
