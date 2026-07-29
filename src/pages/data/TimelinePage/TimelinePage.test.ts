import { afterEach, beforeAll, describe, expect, it } from "vitest";
let pageTag = "";
beforeAll(async () => { await import("../../../components"); const { ensureCustomElement } = await import("@elfui/core"); const { PageTimeline } = await import("./index"); pageTag = ensureCustomElement(PageTimeline); }, 30_000);
afterEach(() => { document.body.innerHTML = ""; document.documentElement.lang = "zh-CN"; });
const collect = (root: Node): string => { let text = ""; const visit = (node: Node): void => { if (node.nodeType === Node.TEXT_NODE) text += ` ${node.textContent || ""}`; if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot); node.childNodes.forEach(visit); }; visit(root); return text.replace(/\s+/g, " ").trim(); };
const mount = async (): Promise<string> => { const page = document.createElement(pageTag); document.body.appendChild(page); await new Promise((r) => setTimeout(r, 30)); return collect(page); };
describe("TimelinePage locale", () => {
  it("renders Chinese docs", async () => { const text = await mount(); expect(text).toContain("双边交替"); expect(text).toContain("横向时间轴"); expect(text).toContain("自定义卡片与节点图标"); expect(text).toContain("时间轴数据"); });
  it("renders strict English docs", async () => { document.documentElement.lang = "en-US"; const text = await mount(); expect(text).toContain("Alternating sides"); expect(text).toContain("Horizontal timeline"); expect(text).toContain("Custom cards and node icons"); expect(text).toContain("Timeline data"); expect(text).not.toMatch(/[\u3400-\u9fff]/u); });
});
