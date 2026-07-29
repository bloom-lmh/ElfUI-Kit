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
const findElements = (root: Node, selector: string): Element[] => {
  const matches: Element[] = [];
  const visit = (node: Node): void => {
    if (node instanceof Element) {
      if (node.matches(selector)) matches.push(node);
      if (node.shadowRoot) visit(node.shadowRoot);
    }
    node.childNodes.forEach(visit);
  };
  visit(root);
  return matches;
};
const mountPage = async (): Promise<HTMLElement> => { const page = document.createElement(pageTag); document.body.appendChild(page); await new Promise((r) => setTimeout(r, 30)); return page; };
const mount = async (): Promise<string> => collect(await mountPage());
describe("ResultPage locale", () => {
  it("renders Chinese docs", async () => { const text = await mount(); expect(text).toContain("四种状态"); expect(text).toContain("扩展操作区"); expect(text).toContain("替换默认状态图形"); });
  it("renders strict English docs", async () => { document.documentElement.lang = "en-US"; const text = await mount(); expect(text).toContain("Four states"); expect(text).toContain("Extra actions"); expect(text).toContain("Replace the default status graphic"); expect(text).not.toMatch(/[\u3400-\u9fff]/u); });
  it("binds titles and subtitles without rendering template markers", async () => {
    const page = await mountPage();
    const results = findElements(page, "elf-result");
    expect(results.length).toBeGreaterThan(0);
    for (const result of results) expect(collect(result)).not.toContain("{{");
  });
});
