import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageContainer } = await import("./index");
  pageTag = ensureCustomElement(PageContainer);
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

describe("ContainerPage", () => {
  it("中文页面覆盖案例、运行内容、源码和 API", async () => {
    const page = await mountPage();
    const text = collectText(page);

    expect(text).toContain("最大宽度档位");
    expect(text).toContain("内边距档位");
    expect(text).toContain("全宽外壳与居中正文");
    expect(text).toContain("全宽背景");
    expect(text).toContain("取消最大宽度限制并填满父容器");
  });

  it("英文页面覆盖案例、运行内容、源码和 API 且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const page = await mountPage();
    const text = collectText(page);

    expect(text).toContain("Maximum-width presets");
    expect(text).toContain("Padding presets");
    expect(text).toContain("Full-width shell with centered content");
    expect(text).toContain("Full-width background");
    expect(text).toContain("Remove the maximum-width limit and fill the parent.");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
