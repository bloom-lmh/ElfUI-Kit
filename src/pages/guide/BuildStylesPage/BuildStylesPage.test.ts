import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageBuildStyles } = await import("./index");
  pageTag = ensureCustomElement(PageBuildStyles);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

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

const mount = async (): Promise<HTMLElement> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await tick();
  await tick();
  return page;
};

describe("Build and styles guide", () => {
  it("中文页面覆盖入口、层级、源码和公开契约", async () => {
    const text = collectText(await mount());
    expect(text).toContain("入口与摇树边界");
    expect(text).toContain("重置与 CSS 层");
    expect(text).toContain("构建契约");
    expect(text).toContain("@elfui/kit/styles/utilities.css");
    expect(text).not.toContain("@elfui/kit/components/");
  });

  it("英文页面覆盖入口、层级、源码和公开契约且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const text = collectText(await mount());
    expect(text).toContain("Entries and tree-shaking boundaries");
    expect(text).toContain("Reset and CSS Layers");
    expect(text).toContain("Build contract");
    expect(text).toContain("Theme and customization");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
