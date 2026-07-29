import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";
let resizeExampleTag = "";
let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageDrawerEx3 } = await import("./ex3");
  const { PageDrawerEx4 } = await import("./ex4");
  const { PageDrawer } = await import("./index");
  exampleTag = ensureCustomElement(PageDrawerEx3);
  resizeExampleTag = ensureCustomElement(PageDrawerEx4);
  pageTag = ensureCustomElement(PageDrawer);
});

afterEach(() => {
  document.body.innerHTML = "";
  document.body.style.overflow = "";
  document.documentElement.lang = "zh-CN";
});

const wait = (ms = 20): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const deepQuery = <T extends Element>(root: ParentNode, selector: string): T | null => {
  const direct = root.querySelector<T>(selector);
  if (direct) return direct;
  for (const element of Array.from(root.querySelectorAll("*"))) {
    if (element.shadowRoot) {
      const nested = deepQuery<T>(element.shadowRoot, selector);
      if (nested) return nested;
    }
  }
  return null;
};

const deepActiveElement = (): Element | null => {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
};

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

describe("DrawerPage", () => {
  it("中文页面覆盖案例、源码和 API 文案", async () => {
    const page = await mountPage();
    const text = collectText(page);
    expect(text).toContain("弹出方向");
    expect(text).toContain("非模态模式");
    expect(text).toContain("焦点与移动端");
    expect(text).toContain("允许通过内侧边缘或键盘调整尺寸");
  });

  it("英文页面覆盖全部案例、源码和 API 文案", async () => {
    document.documentElement.lang = "en-US";
    const page = await mountPage();
    const text = collectText(page);
    expect(text).toContain("Directions");
    expect(text).toContain("Non-modal mode");
    expect(text).toContain("Focus and mobile");
    expect(text).toContain("Resizable drawer");
    expect(text).toContain("Allow resizing from the inner edge or keyboard.");
    expect(text).not.toContain("弹出方向");
  });

  it("窄屏焦点案例锁定页面滚动，并在 Escape 后恢复打开按钮焦点", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await wait();

    const triggerHost = deepQuery<HTMLElement>(page.shadowRoot!, "elf-button");
    const triggerButton = triggerHost?.shadowRoot?.querySelector<HTMLButtonElement>("button");
    expect(triggerButton).toBeTruthy();
    triggerButton?.focus();
    triggerHost?.click();
    await wait();

    const input = document.body.querySelector<HTMLInputElement>('input[placeholder="姓名或团队"]');
    expect(input).toBeTruthy();
    expect(deepActiveElement()).toBe(input);
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.querySelector<HTMLElement>(".elf-drawer-panel")).toBeTruthy();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await wait(280);

    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(deepActiveElement()).toBe(triggerButton);
  });

  it("可调整尺寸案例公开边界、事件和完整 Script", async () => {
    const page = document.createElement(resizeExampleTag);
    document.body.appendChild(page);
    await wait();

    const drawer = deepQuery<HTMLElement>(page.shadowRoot!, "elf-drawer");
    const playground = deepQuery<HTMLElement>(page.shadowRoot!, "elf-playground");
    expect(drawer).toBeTruthy();
    expect((drawer as HTMLElement & { resizable?: boolean }).resizable).toBe(true);
    expect(String((drawer as HTMLElement & { minSize?: number | string }).minSize)).toBe("300");
    expect(String((drawer as HTMLElement & { maxSize?: number | string }).maxSize)).toBe("640");
    expect((playground as HTMLElement & { script?: string }).script).toContain("onResizeEnd");

    const trigger = deepQuery<HTMLElement>(page.shadowRoot!, "elf-button");
    trigger?.shadowRoot?.querySelector<HTMLButtonElement>("button")?.click();
    await wait();
    expect(document.body.querySelector('[role="dialog"]')).toBeTruthy();
    expect(document.body.querySelector('[role="separator"]')).toBeTruthy();
  });
});
