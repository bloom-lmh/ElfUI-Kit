import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PagePagination } = await import("./index");
  pageTag = ensureCustomElement(PagePagination);
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

const mount = async (): Promise<string> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await new Promise((resolve) => setTimeout(resolve, 30));
  return collectText(page);
};

describe("PaginationPage locale", () => {
  it("renders complete Chinese docs", async () => {
    const text = await mount();
    expect(text).toContain("基础用法");
    expect(text).toContain("尺寸浮层与导航图标");
    expect(text).toContain("数据总数");
  });

  it("renders complete English docs without Han characters", async () => {
    document.documentElement.lang = "en-US";
    const text = await mount();
    expect(text).toContain("Pagination basic usage");
    expect(text).toContain("Size overlay and navigation icons");
    expect(text).toContain("Total item count");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
