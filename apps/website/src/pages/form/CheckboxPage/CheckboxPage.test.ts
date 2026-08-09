import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageCheckbox } = await import("./index");
  pageTag = ensureCustomElement(PageCheckbox);
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

describe("CheckboxPage", () => {
  it("中文页面覆盖案例、状态、源码和 API", async () => {
    const text = collectText(await mountPage());
    expect(text).toContain("同意条款");
    expect(text).toContain("选择数量限制");
    expect(text).toContain("状态映射与无障碍");
    expect(text).toContain("复选框标签内容");
  });

  it("英文页面覆盖案例、状态、源码和 API 且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const text = collectText(await mountPage());
    expect(text).toContain("Accept the terms");
    expect(text).toContain("Selection limits");
    expect(text).toContain("State mappings and accessibility");
    expect(text).toContain("Checkbox label content.");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
