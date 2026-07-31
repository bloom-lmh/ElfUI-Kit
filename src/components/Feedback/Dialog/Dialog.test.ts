// elf-dialog 测试

import { compile } from "@elfui/compiler";
import { defineComponent, useRef, type RenderFn } from "@elfui/core";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  const [{ ensureCustomElement }, { Button }, { Dialog }] = await Promise.all([
    import("@elfui/core"),
    import("../../Basic/Button/index"),
    import("./index"),
  ]);
  ensureCustomElement(Button);
  ensureCustomElement(Dialog);
});

afterEach(() => {
  document.body.innerHTML = "";
  document.body.style.overflow = "";
  delete document.documentElement.dataset.theme;
});

const tick = (): Promise<void> => new Promise((r) => setTimeout(r, 20));
const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

const mask = (): HTMLElement | null => document.body.querySelector(".elf-dialog-mask");
const panel = (): HTMLElement | null => document.body.querySelector(".elf-dialog-panel");

const finishTransition = async (element: HTMLElement | null = mask()): Promise<void> => {
  await frame();
  await frame();
  element?.dispatchEvent(new Event("transitionend", { bubbles: true }));
  await tick();
};

type DialogEl = HTMLElement & {
  open?: boolean;
  title?: string;
  size?: string;
  closeOnMask?: boolean;
  closeOnEscape?: boolean;
  closable?: boolean;
  lockScroll?: boolean;
  beforeClose?: (() => boolean | Promise<boolean>) | null;
  close?: () => void;
};

describe("elf-dialog", () => {
  it("通过 Core Transition 管理结构生命周期和 reduced-motion 样式", () => {
    const source = readFileSync("src/components/Feedback/Dialog/index.ts", "utf8");
    const cssText = readFileSync("src/components/Feedback/Dialog/style.scss", "utf8");

    expect(source).toContain('<Transition\n      name="elf-dialog"');
    expect(source).toContain("@after-leave=${onAfterLeave}");
    expect(source).not.toContain("setTimeout");
    expect(source).not.toContain("closeTimer");
    expect(cssText).toContain(".elf-dialog-enter-active");
    expect(cssText).toContain(".elf-dialog-leave-active");
    expect(cssText).toContain("@media (prefers-reduced-motion: reduce)");
    expect(cssText).toMatch(/prefers-reduced-motion[\s\S]*transition: none/);
  });

  it("默认关闭，open=true 后 Teleport 到 body", async () => {
    const el = document.createElement("elf-dialog") as DialogEl;
    el.title = "我的标题";
    document.body.appendChild(el);
    await tick();

    expect(mask()).toBeNull();

    el.open = true;
    await tick();

    expect(mask()).toBeTruthy();
    expect(document.body.textContent).toContain("我的标题");
  });

  it("size 反映到 panel class", async () => {
    const el = document.createElement("elf-dialog") as DialogEl;
    el.size = "lg";
    el.open = true;
    document.body.appendChild(el);
    await tick();

    expect(panel()?.className).toContain("size-lg");
  });

  it("面板颜色跟随全局主题变量", async () => {
    document.documentElement.dataset.theme = "dark";
    const el = document.createElement("elf-dialog") as DialogEl;
    el.open = true;
    document.body.appendChild(el);
    await tick();

    expect(panel()).toBeTruthy();
    const cssText = readFileSync("src/components/Feedback/Dialog/style.scss", "utf8");
    expect(cssText).toContain("var(--elf-bg-paper");
    expect(cssText).toContain("var(--elf-text-primary");
    document.documentElement.dataset.theme = "light";
  });

  it("close 按钮触发 close + update:open", async () => {
    const el = document.createElement("elf-dialog") as DialogEl;
    el.open = true;
    document.body.appendChild(el);
    await tick();

    let closeFired = false;
    let lastOpen: unknown = undefined;
    el.addEventListener("close", () => {
      closeFired = true;
    });
    el.addEventListener("update:open", (e) => {
      lastOpen = (e as CustomEvent).detail;
    });

    const btn = document.body.querySelector(".elf-dialog-close") as HTMLButtonElement;
    expect(btn.querySelector("svg")).toBeTruthy();
    btn.click();
    await tick();

    expect(closeFired).toBe(true);
    expect(lastOpen).toBe(false);
  });

  it("closeOnMask=true 时点击遮罩关闭", async () => {
    const el = document.createElement("elf-dialog") as DialogEl;
    el.open = true;
    document.body.appendChild(el);
    await tick();

    let closeFired = false;
    el.addEventListener("close", () => {
      closeFired = true;
    });

    mask()?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await tick();
    expect(closeFired).toBe(true);
  });

  it("closeOnMask=false 时点击遮罩不关闭", async () => {
    const el = document.createElement("elf-dialog") as DialogEl;
    el.open = true;
    el.closeOnMask = false;
    document.body.appendChild(el);
    await tick();

    let closeFired = false;
    el.addEventListener("close", () => {
      closeFired = true;
    });

    mask()?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await tick();
    expect(closeFired).toBe(false);
  });

  it("ESC 触发关闭", async () => {
    const el = document.createElement("elf-dialog") as DialogEl;
    el.open = true;
    document.body.appendChild(el);
    await tick();

    let closeFired = false;
    el.addEventListener("close", () => {
      closeFired = true;
    });

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await tick();
    expect(closeFired).toBe(true);
  });

  it("beforeClose 返回 false 阻止关闭", async () => {
    const el = document.createElement("elf-dialog") as DialogEl;
    el.beforeClose = () => false;
    el.open = true;
    document.body.appendChild(el);
    await tick();

    let closeFired = false;
    el.addEventListener("close", () => {
      closeFired = true;
    });

    const btn = document.body.querySelector(".elf-dialog-close") as HTMLButtonElement;
    btn.click();
    await tick();
    expect(closeFired).toBe(false);
    expect(el.open).toBe(true);
  });

  it("打开时锁滚动，关闭后还原", async () => {
    const el = document.createElement("elf-dialog") as DialogEl;
    el.open = true;
    document.body.appendChild(el);
    await tick();

    expect(document.body.style.overflow).toBe("hidden");

    el.open = false;
    await finishTransition();
    expect(document.body.style.overflow).toBe("");
  });

  it("只在 Transition leave 完成后触发 closed 和清理 Teleport", async () => {
    const el = document.createElement("elf-dialog") as DialogEl;
    const events: string[] = [];
    el.addEventListener("open", () => events.push("open"));
    el.addEventListener("opened", () => events.push("opened"));
    el.addEventListener("closed", () => events.push("closed"));
    el.open = true;
    document.body.appendChild(el);
    await tick();

    await finishTransition();
    expect(events).toEqual(["open", "opened"]);

    el.open = false;
    expect(mask()).toBeTruthy();
    expect(events).toEqual(["open", "opened"]);

    await finishTransition();
    expect(mask()).toBeNull();
    expect(events).toEqual(["open", "opened", "closed"]);
  });

  it("打开后聚焦 autofocus，并在 Tab / Shift+Tab 时约束焦点", async () => {
    const trigger = document.createElement("button");
    trigger.textContent = "打开";
    document.body.appendChild(trigger);
    trigger.focus();

    const el = document.createElement("elf-dialog") as DialogEl;
    el.title = "键盘与焦点";
    el.closable = false;
    const input = document.createElement("input");
    input.setAttribute("autofocus", "");
    const action = document.createElement("button");
    action.textContent = "保存";
    el.append(input, action);
    document.body.appendChild(el);

    let autoFocusEvents = 0;
    el.addEventListener("open-auto-focus", () => autoFocusEvents++);
    el.open = true;
    await tick();

    expect(document.activeElement).toBe(input);
    expect(autoFocusEvents).toBe(1);

    action.focus();
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }),
    );
    expect(document.activeElement).toBe(input);

    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Tab",
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(document.activeElement).toBe(action);
  });

  it("关闭动画完成后把焦点返回打开前的元素", async () => {
    const trigger = document.createElement("button");
    trigger.textContent = "打开";
    document.body.appendChild(trigger);
    trigger.focus();

    const el = document.createElement("elf-dialog") as DialogEl;
    const input = document.createElement("input");
    input.setAttribute("autofocus", "");
    el.appendChild(input);
    document.body.appendChild(el);

    let restoreEvents = 0;
    el.addEventListener("close-auto-focus", () => restoreEvents++);
    el.open = true;
    await tick();
    expect(document.activeElement).toBe(input);

    el.close?.();
    await finishTransition();
    expect(document.activeElement).toBe(trigger);
    expect(restoreEvents).toBe(1);
  });

  it("嵌套对话框按 Escape 时只关闭最上层", async () => {
    const parent = document.createElement("elf-dialog") as DialogEl;
    const child = document.createElement("elf-dialog") as DialogEl;
    parent.title = "父对话框";
    child.title = "子对话框";
    parent.open = true;
    child.open = true;
    document.body.append(parent, child);
    await tick();

    const parentUpdate = { value: true };
    const childUpdate = { value: true };
    parent.addEventListener("update:open", (event) => {
      parentUpdate.value = Boolean((event as CustomEvent).detail);
    });
    child.addEventListener("update:open", (event) => {
      childUpdate.value = Boolean((event as CustomEvent).detail);
    });

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();

    expect(parentUpdate.value).toBe(true);
    expect(childUpdate.value).toBe(false);
  });

  it("关闭动画完成前重新打开会恢复到模态栈并继续响应 Escape", async () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();

    const el = document.createElement("elf-dialog") as DialogEl;
    const content = document.createElement("button");
    content.textContent = "继续";
    let contentClicks = 0;
    content.addEventListener("click", () => contentClicks++);
    el.appendChild(content);
    let openEvents = 0;
    let openedEvents = 0;
    el.addEventListener("open", () => openEvents++);
    el.addEventListener("opened", () => openedEvents++);
    el.open = true;
    document.body.appendChild(el);
    await tick();
    await finishTransition();
    expect(openEvents).toBe(1);
    expect(openedEvents).toBe(1);
    expect(document.body.querySelector(".elf-dialog-body button")).toBe(content);

    let closedEvents = 0;
    let restoreEvents = 0;
    el.addEventListener("closed", () => closedEvents++);
    el.addEventListener("close-auto-focus", () => restoreEvents++);

    el.open = false;
    const leavingRoot = mask();
    expect(leavingRoot).toBeTruthy();
    el.open = true;
    await tick();

    await finishTransition(leavingRoot);
    expect(mask()).toBeTruthy();
    expect(openEvents).toBe(2);
    expect(closedEvents).toBe(0);
    expect(restoreEvents).toBe(0);
    expect(document.activeElement).toBe(mask()?.querySelector(".elf-dialog-close"));
    expect(document.body.style.overflow).toBe("hidden");

    await finishTransition(mask());
    expect(openedEvents).toBe(2);
    const projectedButtons = document.body.querySelectorAll(".elf-dialog-body button");
    expect(projectedButtons).toHaveLength(1);
    expect(projectedButtons[0]).toBe(content);
    (projectedButtons[0] as HTMLButtonElement).click();
    expect(contentClicks).toBe(1);

    let lastOpen: unknown = true;
    el.addEventListener("update:open", (event) => {
      lastOpen = (event as CustomEvent).detail;
    });
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();

    expect(lastOpen).toBe(false);
    await finishTransition();
    expect(mask()).toBeNull();
    expect(closedEvents).toBe(1);
    expect(restoreEvents).toBe(1);
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).toBe("");
    expect(el.contains(content)).toBe(true);
  });

  it("卸载会取消 Transition 并释放投射、滚动锁和焦点资源", async () => {
    const trigger = document.createElement("button");
    const content = document.createElement("button");
    trigger.textContent = "打开";
    content.textContent = "内容操作";
    document.body.appendChild(trigger);
    trigger.focus();

    const el = document.createElement("elf-dialog") as DialogEl;
    el.appendChild(content);
    el.open = true;
    document.body.appendChild(el);
    await tick();

    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.querySelector(".elf-dialog-body button")).toBe(content);

    el.open = false;
    await tick();
    el.remove();
    await tick();

    expect(mask()).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(el.contains(content)).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it("footer light DOM 使用真实节点投射，事件不丢失", async () => {
    const el = document.createElement("elf-dialog") as DialogEl;
    const button = document.createElement("button");
    button.setAttribute("slot", "footer");
    button.textContent = "确定";
    let clicked = 0;
    button.addEventListener("click", () => {
      clicked++;
    });
    el.appendChild(button);
    el.open = true;
    document.body.appendChild(el);
    await tick();

    const teleportedButton = document.body.querySelector(".elf-dialog-footer button");
    expect(teleportedButton).toBe(button);
    (teleportedButton as HTMLButtonElement).click();
    expect(clicked).toBe(1);
  });

  it("close() 公共 API 工作：触发 update:open 并移除 mask", async () => {
    const el = document.createElement("elf-dialog") as DialogEl;
    el.open = true;
    document.body.appendChild(el);
    await tick();
    expect(mask()).toBeTruthy();

    let lastOpen: unknown = undefined;
    el.addEventListener("update:open", (e) => {
      lastOpen = (e as CustomEvent).detail;
    });

    el.close?.();
    await tick();
    expect(lastOpen).toBe(false);
    await finishTransition();
    expect(mask()).toBeNull();
  });

  it("父组件通过 elf-button + v-model:open 可以打开", async () => {
    defineComponent({
      name: "test-dialog-page-open",
      setup: () => {
        const visible = useRef(false);
        return {
          visible,
          open: () => visible.set(true),
        };
      },
      render: compile(`
        <elf-button @click="open">打开</elf-button>
        <elf-dialog v-model:open="visible" title="真实页面弹窗">
          <p>内容</p>
        </elf-dialog>
      `) as unknown as RenderFn,
    });

    const page = document.createElement("test-dialog-page-open");
    document.body.appendChild(page);
    await tick();

    const btn = page.shadowRoot!.querySelector("elf-button") as HTMLElement;
    btn.click();
    await tick();

    const dialog = page.shadowRoot!.querySelector("elf-dialog") as DialogEl;
    expect(dialog.open).toBe(true);
    expect(mask()).toBeTruthy();
    expect(document.body.textContent).toContain("真实页面弹窗");
  });

  it("父组件模板 :before-close kebab 绑定可以拦截关闭", async () => {
    defineComponent({
      name: "test-dialog-before-close-binding",
      setup: () => {
        const visible = useRef(true);
        return {
          visible,
          guard: () => false,
        };
      },
      render: compile(`
        <elf-dialog v-model:open="visible" :before-close="guard" title="拦截">
          <p>内容</p>
        </elf-dialog>
      `) as unknown as RenderFn,
    });

    const page = document.createElement("test-dialog-before-close-binding");
    document.body.appendChild(page);
    await tick();

    (document.body.querySelector(".elf-dialog-close") as HTMLButtonElement).click();
    await tick();

    const dialog = page.shadowRoot!.querySelector("elf-dialog") as DialogEl;
    expect(dialog.open).toBe(true);
    expect(mask()).toBeTruthy();
  });
});
