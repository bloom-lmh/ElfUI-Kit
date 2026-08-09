import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let nestedTag = "";
let columnsTag = "";
let pageTag = "";

beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageLayoutShellEx3 } = await import("./ex3");
  const { PageLayoutShellEx4 } = await import("./ex4");
  const { PageLayoutShell } = await import("./index");
  nestedTag = ensureCustomElement(PageLayoutShellEx3);
  columnsTag = ensureCustomElement(PageLayoutShellEx4);
  pageTag = ensureCustomElement(PageLayoutShell);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
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

describe("LayoutShellPage examples", () => {
  it("中文页面覆盖八种结构、运行标签、源码和 API", async () => {
    const page = await mountPage();
    const text = collectText(page);

    expect(text).toContain("顶栏与内容");
    expect(text).toContain("嵌套双导航");
    expect(text).toContain("多栏协作区");
    expect(text).toContain("次级导航");
    expect(text).toContain("各布局区域的默认内容");
  });

  it("英文页面覆盖八种结构、运行标签、源码和 API 且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const page = await mountPage();
    const text = collectText(page);

    expect(text).toContain("Header and content");
    expect(text).toContain("Nested navigation");
    expect(text).toContain("Multi-column collaboration");
    expect(text).toContain("Sub navigation");
    expect(text).toContain("Default content for each layout region.");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });

  it("渲染嵌套双导航和右侧详情栏", async () => {
    const page = document.createElement(nestedTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    expect(page.shadowRoot!.querySelectorAll("elf-playground")).toHaveLength(2);
    expect(page.shadowRoot!.querySelectorAll(".layout-shell")).toHaveLength(2);
    const titles = Array.from(page.shadowRoot!.querySelectorAll("elf-playground"), (item) =>
      item.getAttribute("title"),
    );
    expect(titles).toEqual(["嵌套双导航", "右侧详情栏"]);
  });

  it("将三栏和多栏结构保留为两个不重复案例", async () => {
    const page = document.createElement(columnsTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    expect(page.shadowRoot!.querySelectorAll("elf-playground")).toHaveLength(2);
    expect(page.shadowRoot!.querySelectorAll(".layout-shell")).toHaveLength(2);
    const titles = Array.from(page.shadowRoot!.querySelectorAll("elf-playground"), (item) =>
      item.getAttribute("title"),
    );
    expect(titles).toEqual(["三栏工作台", "多栏协作区"]);
  });
});
