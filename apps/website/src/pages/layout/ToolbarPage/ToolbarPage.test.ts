import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";
beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageToolbar } = await import("./index");
  pageTag = ensureCustomElement(PageToolbar);
}, 30_000);
afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});
const wait = (ms = 25): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
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
  await wait();
  await wait();
  return page;
};

describe("ToolbarPage", () => {
  it("renders the Chinese Vuetify-inspired examples", async () => {
    const page = await mount();
    const text = collectText(page);
    expect(text).toContain("紧凑工具栏");
    expect(text).toContain("折叠与对齐");
    expect(text).toContain("背景");
    expect(text).toContain("放置区域");
    expect(text).toContain("扩展工具栏");
    expect(text).toContain("突出工具栏");
    expect(text).toContain("上下文操作栏");
    expect(text).toContain("浮动搜索");
    expect(text).toContain("切换 64/48px");
    expect(text).not.toContain("切换预览明暗");
    expect(page.shadowRoot!.querySelector('elf-playground elf-button[slot="status"]')).toBeTruthy();
    const collapsePlayground = page.shadowRoot!.querySelectorAll("elf-playground")[1]!;
    expect(collapsePlayground.querySelector('[slot="controls"]')).toBeTruthy();
    expect(collapsePlayground.querySelector('[slot="controls"] elf-checkbox')).toBeTruthy();
    expect(collapsePlayground.querySelector('[slot="controls"] elf-radio-group')).toBeTruthy();
    expect(collapsePlayground.querySelectorAll('[slot="controls"] elf-radio')).toHaveLength(2);
    const locationPlayground = page.shadowRoot!.querySelectorAll("elf-playground")[3]!;
    expect(locationPlayground.querySelector('[slot="controls"] elf-radio-group')).toBeTruthy();
    expect(locationPlayground.querySelectorAll('[slot="controls"] elf-radio')).toHaveLength(4);
    const icons = page.shadowRoot!.querySelectorAll<HTMLElement>("elf-icon");
    expect(icons.length).toBeGreaterThan(10);
    expect(
      page
        .shadowRoot!.querySelector<HTMLElement>('elf-icon[name="back"]')
        ?.shadowRoot?.querySelector("svg"),
    ).toBeTruthy();
    expect(page.shadowRoot!.querySelectorAll("elf-playground")).toHaveLength(12);
    const prominent = page.shadowRoot!.querySelector<HTMLElement>(
      'elf-toolbar[density="prominent"]',
    )!;
    expect(prominent.hasAttribute("extended")).toBe(true);
    expect(prominent.shadowRoot!.querySelector(".extension")).toBeTruthy();
    expect(pageTag).toBeTruthy();
  });

  it("uses interactive ElfUI tabs in every toolbar extension", async () => {
    const page = await mount();
    const tabs = page.shadowRoot!.querySelectorAll<HTMLElement>(".toolbar-extension-tabs");
    expect(tabs).toHaveLength(3);

    tabs[0]!.dispatchEvent(
      new CustomEvent("update:modelValue", {
        detail: "favorites",
        bubbles: true,
        composed: true,
      }),
    );
    await wait();
    expect(
      tabs[0]!.shadowRoot?.querySelector('[role="tab"][aria-selected="true"]')?.textContent,
    ).toContain("收藏");

    const heightPlayground = page.shadowRoot!.querySelectorAll("elf-playground")[6]!;
    expect(heightPlayground.querySelector('input[type="range"]')?.getAttribute("min")).toBe("40");
  });

  it("switches the contextual toolbar into selection mode", async () => {
    const page = await mount();
    const action = page.shadowRoot!.querySelector<HTMLElement>(".contextual-actions elf-button")!;
    action.click();
    await wait();

    const stage = page.shadowRoot!.querySelector<HTMLElement>(".contextual-stage")!;
    expect(collectText(stage)).toContain("已选择 3 张");
    const toolbar = stage.querySelector<HTMLElement>("elf-toolbar")!;
    expect(toolbar.getAttribute("color")).toBe("#1e3a5f");
  });

  it("renders the English examples without Chinese copy", async () => {
    document.documentElement.lang = "en-US";
    const text = collectText(await mount());
    expect(text).toContain("Dense toolbars");
    expect(text).toContain("Collapse and alignment");
    expect(text).toContain("Background");
    expect(text).toContain("Location");
    expect(text).toContain("Extension height");
    expect(text).toContain("Prominent");
    expect(text).toContain("Contextual action bar");
    expect(text).toContain("Tooltips and Speed Dial");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
