import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";
let resizeExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageDrawerEx3 } = await import("./ex3");
  const { PageDrawerEx4 } = await import("./ex4");
  exampleTag = ensureCustomElement(PageDrawerEx3);
  resizeExampleTag = ensureCustomElement(PageDrawerEx4);
});

afterEach(() => {
  document.body.innerHTML = "";
  document.body.style.overflow = "";
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

describe("DrawerPage", () => {
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
