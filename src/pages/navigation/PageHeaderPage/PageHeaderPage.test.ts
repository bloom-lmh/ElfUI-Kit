import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PagePageHeader } = await import("./index");
  pageTag = ensureCustomElement(PagePageHeader);
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

describe("PageHeaderPage", () => {
  it("中文页面覆盖案例、运行状态、源码和 API", async () => {
    const page = await mountPage();
    const text = collectText(page);
    expect(text).toContain("基础页头与返回事件");
    expect(text).toContain("自定义页头插槽");
    expect(text).toContain("等待返回操作");
    expect(text).toContain("右侧扩展操作");
  });

  it("英文页面覆盖案例、运行状态、源码和 API 且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const page = await mountPage();
    const text = collectText(page);
    expect(text).toContain("Basic page header and back event");
    expect(text).toContain("Custom page-header slots");
    expect(text).toContain("Waiting for a back action");
    expect(text).toContain("Trailing actions.");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
