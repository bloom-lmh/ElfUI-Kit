import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageUtilities } = await import("./index");
  pageTag = ensureCustomElement(PageUtilities);
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

const mount = async (): Promise<HTMLElement> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await tick();
  await tick();
  return page;
};

describe("UtilitiesPage", () => {
  it("在一个页面渲染全部工具类交互面板", async () => {
    const page = await mount();
    const root = page.shadowRoot!;

    expect(root.querySelectorAll(".utility-lab")).toHaveLength(14);
    expect(root.querySelectorAll(".utility-preview")).toHaveLength(14);
    expect(root.querySelectorAll(".utility-controls")).toHaveLength(14);
    expect(root.querySelectorAll("elf-playground")).toHaveLength(14);
    const draggable = root.querySelector<HTMLElement>("elf-page-utilities-draggable")!;
    expect(draggable.shadowRoot?.querySelector("#utility-draggable")).toBeTruthy();
    expect(draggable.shadowRoot?.querySelectorAll(".task-card")).toHaveLength(4);
    expect(root.textContent).toContain("Utilities 工具类");
    expect(root.querySelector(".page-description")).toBeNull();
    expect(root.querySelector(".utility-toolbar")).toBeNull();
    expect(root.querySelector(".lab-description")).toBeNull();
    expect(root.querySelector(".lab-note")).toBeNull();

    const playground = root.querySelector<HTMLElement>("#utility-borders elf-playground")!;
    expect(playground.shadowRoot?.querySelector(".workspace.has-controls")).toBeTruthy();
    expect(playground.shadowRoot?.querySelector(".source-toolbar")).toBeTruthy();
    expect(playground.shadowRoot?.querySelectorAll('[role="tab"]')).toHaveLength(2);
    expect(root.querySelector<HTMLElement>("#utility-typography elf-playground")?.shadowRoot?.textContent)
      .toContain("Text and typography 文本和排版");
  });

  it("使用下拉单选切换分类和工具类并同步预览代码", async () => {
    const page = await mount();
    const root = page.shadowRoot!;
    const borders = root.querySelector<HTMLElement>("#utility-borders")!;
    const selects = borders.querySelectorAll<HTMLElement>("elf-select");

    selects[0]!.dispatchEvent(new CustomEvent("update:modelValue", { detail: "1" }));
    await tick();
    expect(borders.querySelector(".border-card")?.classList.contains("border-t")).toBe(true);
    const playground = borders.querySelector<HTMLElement>("elf-playground")!;
    expect(playground.shadowRoot?.textContent).toContain('class="surface border-t"');

    selects[1]!.dispatchEvent(new CustomEvent("update:modelValue", { detail: "border-e-lg" }));
    await tick();
    expect(borders.querySelector(".border-card")?.classList.contains("border-e-lg")).toBe(true);
    expect(borders.querySelector(".border-card")?.classList.contains("border-t")).toBe(false);
    expect(playground.shadowRoot?.textContent).toContain("border-e-lg");
  });

  it("复用标准 Playground 复制源码并从右侧面板重置", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    const page = await mount();
    const root = page.shadowRoot!;
    const borders = root.querySelector<HTMLElement>("#utility-borders")!;
    const selects = borders.querySelectorAll<HTMLElement>("elf-select");
    selects[0]!.dispatchEvent(new CustomEvent("update:modelValue", { detail: "1" }));
    await tick();

    const playground = borders.querySelector<HTMLElement>("elf-playground")!;
    playground.shadowRoot!.querySelector<HTMLButtonElement>(".copy")!.click();
    await tick();
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("border-t"));

    borders.querySelector<HTMLElement>(".config-actions elf-button")!.click();
    await tick();
    expect(borders.querySelector(".border-card")?.classList.contains("border")).toBe(true);
  });

  it("为不同工具主题提供不同的语义化预览", async () => {
    const page = await mount();
    const root = page.shadowRoot!;

    expect(root.querySelector("#utility-cursor .cursor-board")).toBeTruthy();
    expect(root.querySelector("#utility-elevation .elevation-row")).toBeTruthy();
    expect(root.querySelector("#utility-overflow .terminal-frame")).toBeTruthy();
    expect(root.querySelector("#utility-spacing .spacing-stage")).toBeTruthy();
    expect(root.querySelector("#utility-typography .type-specimen")).toBeTruthy();
    expect(root.querySelector("#utility-content .config-purpose")?.textContent).toContain("屏幕阅读器");
    expect(root.querySelector("#utility-display .config-purpose")?.textContent).toContain("隐藏元素");
  });

  it("applies spacing utilities to the element whose layout they control", async () => {
    const page = await mount();
    const spacing = page.shadowRoot!.querySelector<HTMLElement>("#utility-spacing")!;
    const selects = spacing.querySelectorAll<HTMLElement>("elf-select");

    selects[0]!.dispatchEvent(new CustomEvent("update:modelValue", { detail: "1" }));
    await tick();
    expect(spacing.querySelector(".spacing-padding-target")?.classList.contains("pa-4")).toBe(true);
    expect(spacing.querySelector(".spacing-padding-target > strong")).toBeTruthy();

    selects[0]!.dispatchEvent(new CustomEvent("update:modelValue", { detail: "2" }));
    await tick();
    expect(spacing.querySelector(".spacing-gap-frame")?.classList.contains("ga-4")).toBe(true);
    expect(spacing.querySelectorAll(".spacing-gap-frame > span")).toHaveLength(3);
  });

  it("keeps responsive display utilities inside a stable preview frame", async () => {
    const page = await mount();
    const display = page.shadowRoot!.querySelector<HTMLElement>("#utility-display")!;

    expect(display.querySelector(".display-target-frame > .display-target")).toBeTruthy();
    expect(display.querySelector(".display-target")?.classList.contains("d-none")).toBe(true);

    const selects = display.querySelectorAll<HTMLElement>("elf-select");
    selects[0]!.dispatchEvent(new CustomEvent("update:modelValue", { detail: "1" }));
    await tick();
    expect(display.querySelector(".visibility-scene")).toBeTruthy();
    expect(display.querySelector(".config-purpose")?.textContent).toContain("xs 视口");

    selects[0]!.dispatchEvent(new CustomEvent("update:modelValue", { detail: "2" }));
    await tick();
    expect(display.querySelector(".print-scene")).toBeTruthy();
    expect(display.querySelector(".config-purpose")?.textContent).toContain("打印或导出 PDF");
  });

  it("updates content and display purpose copy from the selected utility class", async () => {
    const page = await mount();
    const root = page.shadowRoot!;
    const content = root.querySelector<HTMLElement>("#utility-content")!;
    const contentSelects = content.querySelectorAll<HTMLElement>("elf-select");

    contentSelects[0]!.dispatchEvent(new CustomEvent("update:modelValue", { detail: "1" }));
    await tick();
    expect(content.querySelector(".config-purpose")?.textContent).toContain("不拦截鼠标事件");

    contentSelects[1]!.dispatchEvent(new CustomEvent("update:modelValue", { detail: "pointer-pass-through" }));
    await tick();
    expect(content.querySelector(".config-purpose")?.textContent).toContain("子元素仍能操作");
  });

  it("documents reusable drag sources, drop targets and sorting callbacks", async () => {
    const page = await mount();
    const draggable = page.shadowRoot!.querySelector<HTMLElement>("elf-page-utilities-draggable")!;
    const playground = draggable.shadowRoot!.querySelector<HTMLElement & { script?: string }>("elf-playground")!;

    expect(playground.script).toContain("draggableDirective");
    expect(playground.script).toContain("placement");
    expect(draggable.shadowRoot!.querySelector(".archive-target")?.hasAttribute("data-droppable")).toBe(true);
    expect(draggable.shadowRoot!.querySelector(".task-card")?.hasAttribute("data-draggable")).toBe(true);
  });
});
