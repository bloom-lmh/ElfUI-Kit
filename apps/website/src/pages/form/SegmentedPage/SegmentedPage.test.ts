import { afterEach, beforeAll, describe, expect, it } from "vitest";
let pageTag = "";
beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageSegmented } = await import("./index");
  pageTag = ensureCustomElement(PageSegmented);
}, 30_000);
afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});
const wait = (ms = 20): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
const text = async (): Promise<string> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await wait();
  await wait();
  let output = "";
  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) output += ` ${node.textContent || ""}`;
    if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot);
    node.childNodes.forEach(visit);
  };
  visit(page);
  return output;
};
describe("SegmentedPage", () => {
  it("中文页面完整", async () => expect(await text()).toContain("对象选项字段映射"));
  it("英文页面完整且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const value = await text();
    expect(value).toContain("Object-option field mapping.");
    expect(value).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
