import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
let pageTag = "";
beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageInput } = await import("./index");
  pageTag = ensureCustomElement(PageInput);
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
  await new Promise((r) => setTimeout(r, 40));
  return collect(page);
};
describe("InputPage locale", () => {
  it("renders complete Chinese docs", async () => {
    const text = await mount();
    expect(text).toContain("尺寸");
    expect(text).toContain("格式化与插槽");
    expect(text).toContain("命令式焦点");
    expect(text).toContain("自定义字段背景色");
  });
  it("renders complete English docs without Han characters", async () => {
    document.documentElement.lang = "en-US";
    const text = await mount();
    expect(text).toContain("Sizes");
    expect(text).toContain("Formatting and slots");
    expect(text).toContain("Imperative focus");
    expect(text).toContain("Custom field background");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
