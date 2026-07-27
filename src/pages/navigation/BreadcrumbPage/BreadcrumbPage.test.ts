import { afterEach, beforeAll, describe, expect, it } from "vitest";

let breadcrumbExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageBreadcrumbEx2 } = await import("./ex2");
  breadcrumbExampleTag = ensureCustomElement(PageBreadcrumbEx2);
});

afterEach(() => {
  document.body.innerHTML = "";
  window.history.replaceState(null, "", "#/navigation/breadcrumb");
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

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

describe("BreadcrumbPage", () => {
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
      breadcrumb.shadowRoot!.querySelectorAll<HTMLElement>(".breadcrumb-link")
    ).find((link) => link.textContent?.includes("组件"));

    expect(status.textContent).toContain("当前 hash");
    expect(playground.shadowRoot!.querySelector('.header slot[name="status"]')).toBeTruthy();
    expect(componentLink?.tagName).toBe("A");
    expect(componentLink?.getAttribute("href")).toBe("#/basic/button");
    componentLink?.click();
    await tick();
    expect(window.location.hash).toBe("#/basic/button");
  });
});
