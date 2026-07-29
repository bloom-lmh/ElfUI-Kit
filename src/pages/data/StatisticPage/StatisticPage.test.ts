import { afterEach, beforeAll, describe, expect, it } from "vitest";
let pageTag = "";
beforeAll(async () => { await import("../../../components"); const { ensureCustomElement } = await import("@elfui/core"); const { PageStatistic } = await import("./index"); pageTag = ensureCustomElement(PageStatistic); }, 30_000);
afterEach(() => { document.body.innerHTML = ""; document.documentElement.lang = "zh-CN"; });
const collect = (root: Node): string => { let text = ""; const visit = (node: Node): void => { if (node.nodeType === Node.TEXT_NODE) text += ` ${node.textContent || ""}`; if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot); node.childNodes.forEach(visit); }; visit(root); return text.replace(/\s+/g, " ").trim(); };
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
describe("StatisticPage locale", () => {
  it("renders Chinese docs", async () => { const text = await mount(); expect(text).toContain("基础数值"); expect(text).toContain("自定义格式化与数值样式"); expect(text).toContain("动态增长"); expect(text).toContain("倒计时"); expect(text).toContain("自定义格式化函数"); });
  it("renders strict English docs", async () => { document.documentElement.lang = "en-US"; const text = await mount(); expect(text).toContain("Basic values"); expect(text).toContain("Custom formatter and value style"); expect(text).toContain("Animated growth"); expect(text).toContain("Countdown"); expect(text).toContain("Custom formatter"); expect(text).not.toMatch(/[\u3400-\u9fff]/u); });
  it("binds statistic labels without rendering template markers", async () => {
    const page = await mountPage();
    const statistics = findElements(page, "elf-statistic, elf-countdown");
    expect(statistics.length).toBeGreaterThan(0);
    for (const statistic of statistics) expect(collect(statistic)).not.toContain("{{");
  });
});
