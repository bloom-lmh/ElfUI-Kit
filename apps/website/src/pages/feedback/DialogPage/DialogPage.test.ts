import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";
let nestedExampleTag = "";
let mixedOverlayExampleTag = "";
let pageTag = "";

beforeAll(async () => {
  const { ensureCustomElement } = await import("@elfui/core");
  const [
    { Button },
    { Playground },
    { PropsTable },
    { Container },
    { Dialog },
    { Drawer },
    { PopConfirm },
  ] = await Promise.all([
    import("@elfui/kit-src/components/Basic/Button/index"),
    import("@elfui/website-components/Playground/index"),
    import("@elfui/website-components/PropsTable/index"),
    import("@elfui/kit-src/components/Layout/Container/index"),
    import("@elfui/kit-src/components/Feedback/Dialog/index"),
    import("@elfui/kit-src/components/Feedback/Drawer/index"),
    import("@elfui/kit-src/components/Feedback/PopConfirm/index"),
  ]);
  [Button, Playground, PropsTable, Container, Dialog, Drawer, PopConfirm].forEach((component) => {
    ensureCustomElement(component);
  });
  const { PageDialogEx3 } = await import("./ex3");
  const { PageDialogEx4 } = await import("./ex4");
  const { PageDialogEx5 } = await import("./ex5");
  const { PageDialog } = await import("./index");
  exampleTag = ensureCustomElement(PageDialogEx3);
  nestedExampleTag = ensureCustomElement(PageDialogEx4);
  mixedOverlayExampleTag = ensureCustomElement(PageDialogEx5);
  pageTag = ensureCustomElement(PageDialog);
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

describe("DialogPage", () => {
  it("中文页面覆盖案例、源码和 API 文案", async () => {
    const page = await mountPage();
    const text = collectText(page);
    expect(text).toContain("基础用法");
    expect(text).toContain("关闭守卫");
    expect(text).toContain("键盘与焦点");
    expect(text).toContain("返回 false 或拒绝时阻止关闭");
  });

  it("英文页面覆盖全部案例、源码和 API 文案", async () => {
    document.documentElement.lang = "en-US";
    const page = await mountPage();
    const text = collectText(page);
    expect(text).toContain("Basic usage");
    expect(text).toContain("Close guard");
    expect(text).toContain("Keyboard and focus");
    expect(text).toContain("Mixed nesting and close order");
    expect(text).toContain("Modal and anchored overlays");
    expect(text).toContain("Prevent closing by returning false or rejecting.");
    expect(text).not.toContain("基础用法");
  });

  it("键盘案例会聚焦输入框，并在关闭后恢复打开按钮", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await wait();

    const triggerHost = deepQuery<HTMLElement>(page.shadowRoot!, "elf-button");
    const triggerButton = triggerHost?.shadowRoot?.querySelector<HTMLButtonElement>("button");
    expect(triggerButton).toBeTruthy();
    triggerButton?.focus();
    triggerHost?.click();
    await wait();

    const input = document.body.querySelector<HTMLInputElement>("#dialog-workspace-name");
    expect(input).toBeTruthy();
    expect(deepActiveElement()).toBe(input);
    expect(document.body.querySelector('[role="dialog"]')).toBeTruthy();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await wait(260);
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
    expect(deepActiveElement()).toBe(triggerButton);
  });

  it("混合嵌套案例按 Escape 依次关闭 Drawer 和 Dialog", async () => {
    const page = document.createElement(nestedExampleTag);
    document.body.appendChild(page);
    await wait();

    const buttons = Array.from(page.shadowRoot!.querySelectorAll("elf-button"));
    buttons[0]?.click();
    await wait();

    const drawerTrigger = document.body.querySelector<HTMLElement>("#dialog-open-drawer");
    expect(drawerTrigger).toBeTruthy();
    drawerTrigger?.click();
    await wait();
    expect(document.body.querySelector(".elf-dialog-mask")).toBeTruthy();
    expect(document.body.querySelector(".elf-drawer-mask")).toBeTruthy();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await wait(280);
    expect(document.body.querySelector(".elf-drawer-mask")).toBeNull();
    expect(document.body.querySelector(".elf-dialog-mask")).toBeTruthy();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await wait(260);
    expect(document.body.querySelector(".elf-dialog-mask")).toBeNull();
  });

  it("同一 Escape 事件只关闭最上层的 PopConfirm，不会连带关闭 Dialog", async () => {
    const page = document.createElement(mixedOverlayExampleTag);
    document.body.appendChild(page);
    await wait();

    page.shadowRoot!.querySelector<HTMLElement>("#dialog-open-overlay-flow")!.click();
    await wait();

    const popConfirm = document.body.querySelector<HTMLElement>("#dialog-overlay-popconfirm")!;
    popConfirm.querySelector<HTMLElement>("elf-button")!.click();
    await wait();
    expect(popConfirm.shadowRoot!.querySelector(".pop-confirm-popover")).toBeTruthy();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await wait(180);
    expect(popConfirm.shadowRoot!.querySelector(".pop-confirm-popover")).toBeNull();
    expect(document.body.querySelector(".elf-dialog-mask")).toBeTruthy();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await wait(260);
    expect(document.body.querySelector(".elf-dialog-mask")).toBeNull();
  });
});
