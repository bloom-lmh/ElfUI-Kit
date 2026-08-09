import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageFaq } = await import("./index");
  pageTag = ensureCustomElement(PageFaq);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
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

describe("FaqPage", () => {
  it("renders grouped Q&A through elf-md-page", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const root = page.shadowRoot!;
    expect(root.querySelectorAll("elf-md-page").length).toBeGreaterThanOrEqual(5);
    expect(root.querySelectorAll("elf-md-page")[0]?.getAttribute("max-width")).toBe("100%");
    expect(root.querySelectorAll("elf-collapse")).toHaveLength(4);
    expect(root.querySelectorAll("elf-collapse-item")).toHaveLength(10);

    const text = collectText(page);
    expect(text).toContain("接入与构建");
    expect(text).toContain("运行时与弹层");
    expect(text).toContain("主题与样式");
    expect(text).toContain("升级与发布");
    expect(text).toContain("页面显示未知的 elf-* 标签");
    expect(text).toContain("仍未解决？");
  });
});
