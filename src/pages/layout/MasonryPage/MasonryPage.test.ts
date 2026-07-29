import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageMasonry } = await import("./index");
  pageTag = ensureCustomElement(PageMasonry);
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

describe("MasonryPage image gallery", () => {
  it("中文页面覆盖运行卡片、状态、源码和 API", async () => {
    const page = await mountPage();
    const text = collectText(page);

    expect(text).toContain("响应式图片瀑布流");
    expect(text).toContain("多洛米蒂山雾");
    expect(text).toContain("最多 4 列");
    expect(text).toContain("参与瀑布流排布的卡片内容");
  });

  it("英文页面覆盖运行卡片、状态、源码和 API 且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const page = await mountPage();
    const text = collectText(page);

    expect(text).toContain("Responsive image masonry");
    expect(text).toContain("Mist over Dolomites");
    expect(text).toContain("Up to 4 columns");
    expect(text).toContain("Card content arranged by the masonry layout.");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });

  it("使用七张具有稳定替代文本和不同高度的图片", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const images = page.shadowRoot!.querySelectorAll<HTMLImageElement>(".masonry-card img");
    expect(images).toHaveLength(7);
    expect(Array.from(images).every((image) => Boolean(image.alt))).toBe(true);
    expect(new Set(Array.from(images, (image) => image.style.height)).size).toBeGreaterThan(3);
  });
});
