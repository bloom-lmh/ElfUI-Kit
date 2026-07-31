// elf-drawer 测试

import { ensureCustomElement } from "@elfui/core";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { Drawer } from "./index";

beforeAll(() => {
  ensureCustomElement(Drawer);
});

afterEach(() => {
  document.body.innerHTML = "";
  document.body.style.overflow = "";
  document.body.style.cursor = "";
  document.body.style.userSelect = "";
});

const tick = (): Promise<void> => new Promise((r) => setTimeout(r, 20));
const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

const mask = (): HTMLElement | null => document.body.querySelector(".elf-drawer-mask");
const panel = (): HTMLElement | null => document.body.querySelector(".elf-drawer-panel");

const finishTransition = async (element: HTMLElement | null = mask()): Promise<void> => {
  await frame();
  await frame();
  element?.dispatchEvent(new Event("transitionend", { bubbles: true }));
  await tick();
};

type DrawerEl = HTMLElement & {
  open?: boolean;
  title?: string;
  direction?: string;
  size?: string;
  resizable?: boolean;
  minSize?: number | string;
  maxSize?: number | string;
  modal?: boolean;
  closeOnMask?: boolean;
  closeOnEscape?: boolean;
  closable?: boolean;
  lockScroll?: boolean;
  beforeClose?: (() => boolean | Promise<boolean>) | null;
  close?: () => void;
  resetSize?: () => void;
};

const pointerEvent = (type: string, clientX: number, clientY: number): Event => {
  const event = new Event(type, { bubbles: true, composed: true, cancelable: true });
  Object.defineProperties(event, {
    button: { value: 0 },
    clientX: { value: clientX },
    clientY: { value: clientY },
    pointerId: { value: 1 },
    pointerType: { value: "mouse" },
  });
  return event;
};

describe("elf-drawer", () => {
  it("通过 Core Transition 管理结构生命周期和 reduced-motion 样式", () => {
    const source = readFileSync("src/components/Feedback/Drawer/index.ts", "utf8");
    const cssText = readFileSync("src/components/Feedback/Drawer/style.scss", "utf8");

    expect(source).toContain('<Transition\n      name="elf-drawer"');
    expect(source).toContain("@after-leave=${onAfterLeave}");
    expect(source).not.toMatch(/PANEL_LEAVE_MS|panelTimer|cleanupTimer/);
    expect(source).toContain("suppressMaskClickTimer");
    expect(cssText).toContain(".elf-drawer-enter-active");
    expect(cssText).toContain(".elf-drawer-leave-active");
    expect(cssText).toContain("@media (prefers-reduced-motion: reduce)");
    expect(cssText).toMatch(/prefers-reduced-motion[\s\S]*transition: none/);
  });

  it("默认关闭，open=true 后 Teleport 到 body", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    el.title = "我的抽屉";
    document.body.appendChild(el);
    await tick();

    expect(mask()).toBeNull();

    el.open = true;
    await tick();

    expect(mask()).toBeTruthy();
    expect(document.body.textContent).toContain("我的抽屉");
  });

  it("按 Transition enter/leave 完成顺序派发 opened 和 closed", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    const events: string[] = [];
    el.addEventListener("open", () => events.push("open"));
    el.addEventListener("opened", () => events.push("opened"));
    el.addEventListener("close", () => events.push("close"));
    el.addEventListener("closed", () => events.push("closed"));
    el.open = true;
    document.body.appendChild(el);
    await tick();

    await finishTransition();
    expect(events).toEqual(["open", "opened"]);

    el.close?.();
    const leavingRoot = mask();
    expect(leavingRoot).toBeTruthy();
    expect(events).toEqual(["open", "opened", "close"]);

    await finishTransition(leavingRoot);
    expect(mask()).toBeNull();
    expect(events).toEqual(["open", "opened", "close", "closed"]);
  });

  it("direction 反映到 panel class/style 和 host attribute", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    el.direction = "ltr";
    el.size = "200px";
    el.open = true;
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("direction")).toBe("ltr");
    expect(panel()?.className).toContain("ltr");
    expect(panel()?.getAttribute("style")).toContain("width: 200px");
  });

  it("vertical direction (ttb) 采用 height 作为 size", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    el.direction = "ttb";
    el.size = "150px";
    el.open = true;
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("direction")).toBe("ttb");
    expect(panel()?.className).toContain("ttb");
    expect(panel()?.getAttribute("style")).toContain("height: 150px");
  });

  it("rtl 抽屉支持拖动内侧边缘调整尺寸并派发完整事件", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    el.direction = "rtl";
    el.size = "300px";
    el.resizable = true;
    el.minSize = 240;
    el.maxSize = 480;
    el.open = true;
    document.body.appendChild(el);
    await tick();

    const drawerPanel = panel()!;
    Object.defineProperty(drawerPanel, "getBoundingClientRect", {
      value: () => ({
        width: 300,
        height: 600,
        x: 700,
        y: 0,
        top: 0,
        left: 700,
        right: 1000,
        bottom: 600,
      }),
    });
    const handle = document.body.querySelector<HTMLElement>(".elf-drawer-resize-handle")!;
    const events: Array<[string, number]> = [];
    for (const name of ["resize-start", "resize", "resize-end"]) {
      el.addEventListener(name, (event) => {
        events.push([name, (event as CustomEvent<{ size: number }>).detail.size]);
      });
    }

    handle.dispatchEvent(pointerEvent("pointerdown", 700, 200));
    document.dispatchEvent(pointerEvent("pointermove", 650, 200));
    document.dispatchEvent(pointerEvent("pointerup", 650, 200));
    await tick();

    expect(drawerPanel.getAttribute("style")).toContain("width: 350px");
    expect(events).toEqual([
      ["resize-start", 300],
      ["resize", 350],
      ["resize-end", 350],
    ]);
    expect(document.body.style.userSelect).toBe("");
  });

  it("does not close when a resize gesture ends on the mask", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    el.direction = "rtl";
    el.size = "300px";
    el.resizable = true;
    el.open = true;
    document.body.appendChild(el);
    await tick();

    const drawerPanel = panel()!;
    Object.defineProperty(drawerPanel, "getBoundingClientRect", {
      value: () => ({
        width: 300,
        height: 600,
        x: 700,
        y: 0,
        top: 0,
        left: 700,
        right: 1000,
        bottom: 600,
      }),
    });
    const handle = document.body.querySelector<HTMLElement>(".elf-drawer-resize-handle")!;
    const drawerMask = mask()!;
    handle.dispatchEvent(pointerEvent("pointerdown", 700, 200));
    document.dispatchEvent(pointerEvent("pointermove", 650, 200));
    document.dispatchEvent(pointerEvent("pointerup", 650, 200));
    drawerMask.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    await tick();

    expect(el.open).toBe(true);
    expect(drawerMask.classList.contains("closing")).toBe(false);
  });

  it("尺寸手柄支持键盘调整、边界限制和 resetSize", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    el.direction = "rtl";
    el.size = "300px";
    el.resizable = true;
    el.minSize = 280;
    el.maxSize = 320;
    el.open = true;
    document.body.appendChild(el);
    await tick();

    const drawerPanel = panel()!;
    Object.defineProperty(drawerPanel, "getBoundingClientRect", {
      value: () => ({
        width: 300,
        height: 600,
        x: 700,
        y: 0,
        top: 0,
        left: 700,
        right: 1000,
        bottom: 600,
      }),
    });
    const handle = document.body.querySelector<HTMLElement>(".elf-drawer-resize-handle")!;
    expect(handle.getAttribute("role")).toBe("separator");
    expect(handle.getAttribute("aria-orientation")).toBe("vertical");

    handle.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    await tick();
    expect(drawerPanel.getAttribute("style")).toContain("width: 310px");

    handle.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    await tick();
    expect(drawerPanel.getAttribute("style")).toContain("width: 320px");

    el.resetSize?.();
    await tick();
    expect(drawerPanel.getAttribute("style")).toContain("width: 300px");
  });

  it("modal=false 添加 no-modal class", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    el.modal = false;
    el.open = true;
    document.body.appendChild(el);
    await tick();

    expect(mask()?.classList.contains("no-modal")).toBe(true);
  });

  it("close 按钮触发 close + update:open", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
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

    const btn = document.body.querySelector(".elf-drawer-close") as HTMLButtonElement;
    expect(btn.querySelector("svg")).toBeTruthy();
    btn.click();
    await tick();

    expect(closeFired).toBe(true);
    expect(lastOpen).toBe(false);
  });

  it("closeOnMask=true 时点击遮罩关闭", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
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
    const el = document.createElement("elf-drawer") as DrawerEl;
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
    const el = document.createElement("elf-drawer") as DrawerEl;
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
    const el = document.createElement("elf-drawer") as DrawerEl;
    el.beforeClose = () => false;
    el.open = true;
    document.body.appendChild(el);
    await tick();

    let closeFired = false;
    el.addEventListener("close", () => {
      closeFired = true;
    });

    const btn = document.body.querySelector(".elf-drawer-close") as HTMLButtonElement;
    btn.click();
    await tick();
    expect(closeFired).toBe(false);
    expect(el.open).toBe(true);
  });

  it("打开时锁滚动，关闭后还原", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    el.open = true;
    document.body.appendChild(el);
    await tick();

    expect(document.body.style.overflow).toBe("hidden");

    el.open = false;
    expect(mask()).toBeTruthy();
    await finishTransition();
    expect(document.body.style.overflow).toBe("");
  });

  it("打开后聚焦 autofocus，关闭动画完成后恢复触发元素焦点", async () => {
    const trigger = document.createElement("button");
    trigger.textContent = "打开设置";
    document.body.appendChild(trigger);
    trigger.focus();

    const el = document.createElement("elf-drawer") as DrawerEl;
    const input = document.createElement("input");
    input.setAttribute("autofocus", "");
    el.appendChild(input);
    document.body.appendChild(el);

    let openFocusEvents = 0;
    let closeFocusEvents = 0;
    el.addEventListener("open-auto-focus", () => openFocusEvents++);
    el.addEventListener("close-auto-focus", () => closeFocusEvents++);

    el.open = true;
    await tick();
    expect(document.activeElement).toBe(input);
    expect(openFocusEvents).toBe(1);

    el.close?.();
    await finishTransition();
    expect(document.activeElement).toBe(trigger);
    expect(closeFocusEvents).toBe(1);
  });

  it("嵌套抽屉按 Escape 时只关闭最上层", async () => {
    const parent = document.createElement("elf-drawer") as DrawerEl;
    const child = document.createElement("elf-drawer") as DrawerEl;
    parent.title = "父抽屉";
    child.title = "子抽屉";
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

  it("关闭完成前重新打开会忽略旧 leave，并保持投射、焦点和 Escape 能力", async () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();

    const el = document.createElement("elf-drawer") as DrawerEl;
    const content = document.createElement("button");
    let clicks = 0;
    content.addEventListener("click", () => clicks++);
    el.appendChild(content);
    el.open = true;
    document.body.appendChild(el);
    await tick();
    await finishTransition();

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
    const activeRoots = document.body.querySelectorAll(".elf-drawer-mask");
    expect(activeRoots).toHaveLength(1);
    expect(document.body.querySelector(".elf-drawer-body button")).toBe(content);
    content.click();
    expect(clicks).toBe(1);
    expect(closedEvents).toBe(0);
    expect(restoreEvents).toBe(0);
    expect(document.activeElement).not.toBe(trigger);

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
  });

  it("离场期间卸载会释放投射、滚动、resize、焦点和 Teleport 资源", async () => {
    document.body.style.cursor = "crosshair";
    document.body.style.userSelect = "text";
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();

    const el = document.createElement("elf-drawer") as DrawerEl;
    const content = document.createElement("input");
    content.setAttribute("autofocus", "");
    el.appendChild(content);
    el.resizable = true;
    el.size = "300px";
    el.open = true;
    document.body.appendChild(el);
    await tick();
    await finishTransition();

    const drawerPanel = panel()!;
    Object.defineProperty(drawerPanel, "getBoundingClientRect", {
      value: () => ({
        width: 300,
        height: 600,
        x: 700,
        y: 0,
        top: 0,
        left: 700,
        right: 1000,
        bottom: 600,
      }),
    });
    const handle = document.body.querySelector<HTMLElement>(".elf-drawer-resize-handle")!;
    handle.dispatchEvent(pointerEvent("pointerdown", 700, 200));
    expect(document.body.style.cursor).toBe("col-resize");
    expect(document.body.style.userSelect).toBe("none");
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.querySelector(".elf-drawer-body input")).toBe(content);

    el.open = false;
    await tick();
    el.remove();
    await tick();

    expect(document.body.querySelectorAll(".elf-drawer-mask")).toHaveLength(0);
    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.cursor).toBe("crosshair");
    expect(document.body.style.userSelect).toBe("text");
    expect(el.contains(content)).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it("关闭时遮罩和面板由 Transition 同步离场", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    el.open = true;
    document.body.appendChild(el);
    await tick();

    el.open = false;

    expect(mask()?.classList.contains("elf-drawer-leave-active")).toBe(true);
    expect(panel()?.classList.contains("rtl")).toBe(true);

    await finishTransition();
    expect(mask()).toBeNull();
  });

  it("light DOM 内容使用真实节点投射", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
    const button = document.createElement("button");
    button.textContent = "抽屉按钮";
    let clicked = 0;
    button.addEventListener("click", () => {
      clicked++;
    });
    el.appendChild(button);
    el.open = true;
    document.body.appendChild(el);
    await tick();

    const teleportedButton = document.body.querySelector(".elf-drawer-body button");
    expect(teleportedButton).toBe(button);
    (teleportedButton as HTMLButtonElement).click();
    expect(clicked).toBe(1);
  });

  it("close() 公共 API 工作：触发 update:open 并移除 mask", async () => {
    const el = document.createElement("elf-drawer") as DrawerEl;
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
});
