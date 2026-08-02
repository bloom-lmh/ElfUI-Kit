import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";
beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageRate } = await import("./index");
  pageTag = ensureCustomElement(PageRate);
}, 30_000);
afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});
const wait = (ms = 20): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
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
const mountText = async (): Promise<string> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await wait();
  await wait();
  return collectText(page);
};
describe("RatePage", () => {
  it("中文页面覆盖案例与 API", async () => {
    const text = await mountText();
    expect(text).toContain("分段颜色与图标");
    expect(text).toContain("重置当前评分");
  });
  it("英文页面覆盖案例与 API 且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const text = await mountText();
    expect(text).toContain("Segmented colors and icons");
    expect(text).toContain("Reset the current rating.");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
