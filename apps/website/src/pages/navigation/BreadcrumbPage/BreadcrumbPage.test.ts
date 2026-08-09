import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let breadcrumbExampleTag = "";
let pageTag = "";

beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageBreadcrumbEx2 } = await import("./ex2");
  const { PageBreadcrumb } = await import("./index");
  breadcrumbExampleTag = ensureCustomElement(PageBreadcrumbEx2);
  pageTag = ensureCustomElement(PageBreadcrumb);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
  window.history.replaceState(null, "", "#/navigation/breadcrumb");
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const wait = (ms = 20): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const collectText = (root: Node): string => {
  let text = "";

  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += `${node.textContent ?? ""}\n`;
      return;
    }

    if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot);
    node.childNodes.forEach(visit);
  };

  visit(root);
  return text;
};

const mountPage = async (): Promise<HTMLElement> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await wait();
  await wait();
  return page;
};

describe("BreadcrumbPage", () => {
  it("中文页面覆盖全部案例、运行状态、源码和 API", async () => {
    const page = await mountPage();
    const text = collectText(page);
    expect(text).toContain("路径与点击");
    expect(text).toContain("路由与字段映射");
    expect(text).toContain("组合式导航");
    expect(text).toContain("最大展示数量");
  });

  it("英文页面覆盖全部案例、运行状态、源码和 API 且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const page = await mountPage();
    const text = collectText(page);
    expect(text).toContain("Path and click events");
    expect(text).toContain("Routing and field mapping");
    expect(text).toContain("Compositional navigation");
    expect(text).toContain("Maximum visible items");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });

  it("自定义字段示例会按 maxItems 折叠", async () => {
    const el = document.createElement(breadcrumbExampleTag);
    document.body.appendChild(el);
    await tick();
    await tick();

    const text = collectText(el);
    expect(text).toContain("组件");
    expect(text).toContain("...");
    expect(text).toContain("API");
    expect(text).not.toContain("Navigation");
  });

  it("路由案例只使用已注册页面并把状态放入标题栏", async () => {
    const el = document.createElement(breadcrumbExampleTag);
    document.body.appendChild(el);
    await tick();
    await tick();

    const playground = el.shadowRoot!.querySelector<HTMLElement>("elf-playground")!;
    const breadcrumb = el.shadowRoot!.querySelector<HTMLElement>("elf-breadcrumb")!;
    const status = playground.querySelector<HTMLElement>('[slot="status"]')!;
    const componentLink = Array.from(
      breadcrumb.shadowRoot!.querySelectorAll<HTMLElement>(".breadcrumb-link"),
    ).find((link) => link.textContent?.includes("组件"));

    expect(status.textContent).toContain("当前哈希");
    expect(playground.shadowRoot!.querySelector('.header slot[name="status"]')).toBeTruthy();
    expect(componentLink?.tagName).toBe("A");
    expect(componentLink?.getAttribute("href")).toBe("#/basic/button");
    componentLink?.click();
    await tick();
    expect(window.location.hash).toBe("#/basic/button");
  });
});
