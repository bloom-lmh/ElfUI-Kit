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
  it("renders Chinese documentation with all heading variants", async () => {
    const page = await mount();
    const text = collectText(page);

    expect(text).toContain("标题");
    expect(text).toContain("标题族 · 文档蓝");
    expect(text).toContain("标题族 · 编辑杂志");
    expect(text).toContain("标题族 · 开发者终端");
    expect(countTags(page, "elf-playground")).toBe(3);
    expect(countTags(page, "elf-heading")).toBeGreaterThanOrEqual(30);
    expect(countClass(page, "heading-family-docs")).toBe(1);
    expect(countClass(page, "heading-family-editorial")).toBe(1);
    expect(countClass(page, "heading-family-terminal")).toBe(1);
  });

  it("renders complete English documentation without Han characters", async () => {
    document.documentElement.lang = "en-US";
    const page = await mount();
    const text = collectText(page);

    expect(text).toContain("Heading");
    expect(text).toContain("Heading family · Documentation blue");
    expect(text).toContain("Heading family · Editorial serif");
    expect(text).toContain("Heading family · Developer terminal");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
