import { afterEach, beforeAll, describe, expect, it } from "vitest";
let pageTag = "";
beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageResult } = await import("./index");
  pageTag = ensureCustomElement(PageResult);
}, 30_000);
afterEach(() => { document.body.innerHTML = ""; document.documentElement.lang = "zh-CN"; });
const collect = (root: Node): string => {
  let text = "";
  const visit = (node: Node): void => { if (node.nodeType === Node.TEXT_NODE) text += ` ${node.textContent || ""}`; if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot); node.childNodes.forEach(visit); };
  visit(root); return text.replace(/\s+/g, " ").trim();
};
const mount = async (): Promise<string> => { const page = document.createElement(pageTag); document.body.appendChild(page); await new Promise((r) => setTimeout(r, 30)); return collect(page); };
describe("ResultPage locale", () => {
  it("renders Chinese docs", async () => { const text = await mount(); expect(text).toContain("四种状态"); expect(text).toContain("扩展操作区"); expect(text).toContain("替换默认状态图形"); });
  it("renders strict English docs", async () => { document.documentElement.lang = "en-US"; const text = await mount(); expect(text).toContain("Four states"); expect(text).toContain("Extra actions"); expect(text).toContain("Replace the default status graphic"); expect(text).not.toMatch(/[\u3400-\u9fff]/u); });
});
