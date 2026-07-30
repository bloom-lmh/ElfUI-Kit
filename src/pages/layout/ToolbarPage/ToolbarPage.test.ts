import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";
beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageToolbar } = await import("./index");
  pageTag = ensureCustomElement(PageToolbar);
}, 30_000);
afterEach(() => { document.body.innerHTML = ""; document.documentElement.lang = "zh-CN"; });
const wait = (ms = 25): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
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
const mount = async (): Promise<HTMLElement> => { const page = document.createElement(pageTag); document.body.appendChild(page); await wait(); await wait(); return page; };

describe("ToolbarPage", () => {
  it("renders the Chinese Vuetify-inspired examples", async () => {
    const text = collectText(await mount());
    expect(text).toContain("紧凑工具栏");
    expect(text).toContain("折叠与保留位置");
    expect(text).toContain("图片背景");
    expect(text).toContain("放置区域");
    expect(text).toContain("切换预览明暗");
  });

  it("renders the English examples without Chinese copy", async () => {
    document.documentElement.lang = "en-US";
    const text = collectText(await mount());
    expect(text).toContain("Compact toolbar");
    expect(text).toContain("Collapse and retained side");
    expect(text).toContain("Image background");
    expect(text).toContain("Location");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
