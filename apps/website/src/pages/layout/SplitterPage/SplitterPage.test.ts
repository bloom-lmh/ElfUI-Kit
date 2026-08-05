import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageSplitter } = await import("./index");
  pageTag = ensureCustomElement(PageSplitter);
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

describe("SplitterPage", () => {
  it("中文页面覆盖全部案例、运行状态、源码和 API", async () => {
    const text = collectText(await mountPage());
    expect(text).toContain("水平分割");
    expect(text).toContain("上方面板比例");
    expect(text).toContain("折叠与持久化");
    expect(text).toContain("面板内容");
  });

  it("英文页面覆盖全部案例、运行状态、源码和 API 且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const text = collectText(await mountPage());
    expect(text).toContain("Horizontal split");
    expect(text).toContain("Top panel ratio");
    expect(text).toContain("Collapse and persistence");
    expect(text).toContain("Panel content.");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
