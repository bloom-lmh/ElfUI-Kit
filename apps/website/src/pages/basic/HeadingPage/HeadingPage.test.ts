import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageHeading } = await import("./index");
  pageTag = ensureCustomElement(PageHeading);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const collectText = (root: Node): string => {
  let text = "";
  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) text += ` ${node.textContent || ""}`;
    if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot);
    node.childNodes.forEach(visit);
  };
  visit(root);
  return text.replace(/\s+/g, " ").trim();
};

const countTags = (root: Node, tag: string): number => {
  let count = 0;
  const visit = (node: Node): void => {
    if (node instanceof Element) {
      if (node.tagName.toLowerCase() === tag) count += 1;
      if (node.shadowRoot) visit(node.shadowRoot);
    }
    node.childNodes.forEach(visit);
  };
  visit(root);
  return count;
};

const countClass = (root: Node, className: string): number => {
  let count = 0;
  const visit = (node: Node): void => {
    if (node instanceof Element) {
      if (node.classList.contains(className)) count += 1;
      if (node.shadowRoot) visit(node.shadowRoot);
    }
    node.childNodes.forEach(visit);
  };
  visit(root);
  return count;
};

const mount = async (): Promise<HTMLElement> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await new Promise((resolve) => setTimeout(resolve, 60));
  return page;
};

describe("HeadingPage", () => {
  it("renders Chinese documentation with all heading suites", async () => {
    const page = await mount();
    const text = collectText(page);

    expect(text).toContain("标题");
    expect(text).toContain("标题套装 · 文档指南");
    expect(text).toContain("标题套装 · 编辑杂志");
    expect(text).toContain("标题套装 · 开发者终端");
    expect(text).toContain("标题套装 · 品牌展示");
    expect(text).toContain("标题套装 · 霓虹");
    expect(text).toContain("标题套装 · 极简");
    expect(text).toContain("标题样式配置");
    expect(text).toContain("Markdown 转换");
    expect(countTags(page, "elf-playground")).toBe(7);
    expect(countTags(page, "elf-heading")).toBeGreaterThanOrEqual(40);
    expect(countClass(page, "heading-suite-guide")).toBe(1);
    expect(countClass(page, "heading-suite-editorial")).toBe(1);
    expect(countClass(page, "heading-suite-terminal")).toBe(1);
    expect(countClass(page, "heading-suite-brand")).toBe(1);
    expect(countClass(page, "heading-suite-neon")).toBe(1);
    expect(countClass(page, "heading-suite-minimal")).toBe(1);
    expect(countClass(page, "heading-suite-config")).toBe(1);
  });

  it("renders complete English documentation without Han characters", async () => {
    document.documentElement.lang = "en-US";
    const page = await mount();
    const text = collectText(page);

    expect(text).toContain("Heading");
    expect(text).toContain("Heading suite · Guide");
    expect(text).toContain("Heading suite · Editorial");
    expect(text).toContain("Heading suite · Developer terminal");
    expect(text).toContain("Heading suite · Brand");
    expect(text).toContain("Heading suite · Neon");
    expect(text).toContain("Heading suite · Minimal");
    expect(text).toContain("Heading style configuration");
    expect(text).toContain("Markdown conversion");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
