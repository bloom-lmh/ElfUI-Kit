import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageInputTag } = await import("./index");
  pageTag = ensureCustomElement(PageInputTag);
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
const mountPage = async (): Promise<HTMLElement> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await wait();
  await wait();
  return page;
};

describe("InputTagPage", () => {
  it("中文页面覆盖案例、状态、源码和 API", async () => {
    const text = collectText(await mountPage());
    expect(text).toContain("受控数组与清空");
    expect(text).toContain("当前标签");
    expect(text).toContain("数量上限、自动换行与状态");
    expect(text).toContain("自定义输入框前后内容");
  });

  it("英文页面覆盖案例、状态、源码和 API 且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const text = collectText(await mountPage());
    expect(text).toContain("Controlled array and clear");
    expect(text).toContain("Current tags");
    expect(text).toContain("Maximum count, wrapping, and states");
    expect(text).toContain("Custom content before or after the input.");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
