import { readFileSync } from "node:fs";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { collectFocusable, trapFocus } from "../../Common/focus/focus-scope";

beforeAll(async () => {
  const [{ ensureCustomElement }, { Button }, { PopConfirm }] = await Promise.all([
    import("@elfui/core"),
    import("../../Basic/Button/index"),
    import("./index"),
  ]);
  ensureCustomElement(Button);
  ensureCustomElement(PopConfirm);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

const panel = (el: PopConfirmEl): HTMLElement | null =>
  el.shadowRoot?.querySelector<HTMLElement>(".pop-confirm-popover") ?? null;

const finishTransition = async (element: HTMLElement | null): Promise<void> => {
  await frame();
  await frame();
  element?.dispatchEvent(new Event("transitionend", { bubbles: true }));
  await tick();
};

type PopConfirmEl = HTMLElement & {
  content?: string;
  visible?: boolean;
  trigger?: string;
  placement?: string;
  teleported?: boolean;
  beforeConfirm?: () => boolean | void | Promise<boolean | void>;
  show?: () => void;
  hide?: () => void;
  toggle?: () => void;
  confirm?: () => Promise<void>;
  cancel?: () => void;
  isVisible?: () => boolean;
};

const mount = async (patch: Partial<PopConfirmEl> = {}): Promise<PopConfirmEl> => {
  const el = document.createElement("elf-pop-confirm") as PopConfirmEl;
  Object.assign(el, { title: "确认删除？", content: "删除后不可恢复", ...patch });
  el.innerHTML = "<button>删除</button>";
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

const openByClick = async (el: PopConfirmEl): Promise<void> => {
  el.querySelector<HTMLButtonElement>("button")!.click();
  await tick();
  await tick();
};

describe("elf-pop-confirm", () => {
  it("通过 Core Transition 管理结构生命周期和 reduced-motion 样式", () => {
    const source = readFileSync("src/components/Feedback/PopConfirm/index.ts", "utf8");
    const cssText = readFileSync("src/components/Feedback/PopConfirm/style.scss", "utf8");

    expect(source).toContain('<Transition\n            name="pop-confirm"');
    expect(source).toContain("@after-leave=${onAfterLeave}");
    expect(source).not.toContain("setTimeout");
    expect(source).not.toContain("queueMicrotask");
    expect(source).not.toContain("hideTimer");
    expect(source).not.toContain("triggerElements");
    expect(source).not.toContain('panel.addEventListener("keydown"');
    expect(source).not.toContain("panel.onkeydown");
    expect(source).toContain("trapFocus(event, panel)");
    expect(source).toContain("dismissibleOverlay.beginClose()");
    expect(source).toContain("dismissibleOverlay.completeClose()");
    expect(cssText).toContain(".pop-confirm-enter-active");
    expect(cssText).toContain(".pop-confirm-leave-active");
    expect(cssText).not.toContain(".is-closing");
    expect(cssText).toMatch(/prefers-reduced-motion[\s\S]*transition: none/);
  });

  it("通过现有 elf-button 触发器只建立一次打开事务", async () => {
    const el = document.createElement("elf-pop-confirm") as PopConfirmEl;
    const triggerButton = document.createElement("elf-button");
    triggerButton.textContent = "删除";
    el.appendChild(triggerButton);
    const onOpen = vi.fn();
    el.addEventListener("open", onOpen);
    document.body.appendChild(el);
    await tick();
    await tick();

    triggerButton.click();
    await tick();
    await tick();

    expect(panel(el)).toBeTruthy();
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("受控 hover 触发只由 wrapper 发出一次更新", async () => {
    const el = await mount({ trigger: "hover", visible: false });
    const onUpdate = vi.fn();
    el.addEventListener("update:visible", onUpdate);

    el.shadowRoot!.querySelector(".pop-confirm-trigger")!.dispatchEvent(
      new Event("mouseenter", { bubbles: true, composed: true }),
    );
    await tick();

    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(true);
  });

  it("受控 focus 触发只由宿主委托发出一次更新", async () => {
    const el = await mount({ trigger: "focus", visible: false });
    const onUpdate = vi.fn();
    el.addEventListener("update:visible", onUpdate);

    el.querySelector("button")!.dispatchEvent(
      new Event("focusin", { bubbles: true, composed: true }),
    );
    await tick();

    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(true);
  });

  it("click 触发打开，确认后触发事件并关闭", async () => {
    const el = await mount();
    const onConfirm = vi.fn();
    const onOpen = vi.fn();
    const onUpdate = vi.fn();
    el.addEventListener("confirm", onConfirm);
    el.addEventListener("open", onOpen);
    el.addEventListener("update:visible", onUpdate as EventListener);

    await openByClick(el);
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(el.shadowRoot!.querySelector(".pop-confirm-popover")).toBeTruthy();
    expect(el.hasAttribute("data-open")).toBe(true);

    (el.shadowRoot!.querySelector(".pop-confirm-action.primary") as HTMLElement).click();
    await tick();

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toBe(false);
    await finishTransition(panel(el));
    expect(el.shadowRoot!.querySelector(".pop-confirm-popover")).toBeNull();
  });

  it("支持受控 visible", async () => {
    const el = await mount({ visible: false });

    el.visible = true;
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector(".pop-confirm-popover")).toBeTruthy();

    el.visible = false;
    await tick();
    await finishTransition(panel(el));
    expect(el.shadowRoot!.querySelector(".pop-confirm-popover")).toBeNull();
  });

  it("受控 show/hide 只请求更新并等待父层回写后提交生命周期", async () => {
    const el = await mount({ visible: false });
    const onUpdate = vi.fn();
    const onOpen = vi.fn();
    const onClose = vi.fn();
    el.addEventListener("update:visible", onUpdate);
    el.addEventListener("open", onOpen);
    el.addEventListener("close", onClose);

    el.show!();
    await tick();
    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toBe(true);
    expect(panel(el)).toBeNull();
    expect(onOpen).not.toHaveBeenCalled();

    el.visible = true;
    await tick();
    expect(panel(el)).toBeTruthy();
    expect(onOpen).toHaveBeenCalledTimes(1);

    el.hide!();
    await tick();
    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toBe(false);
    expect(panel(el)).toBeTruthy();
    expect(onClose).not.toHaveBeenCalled();

    el.visible = false;
    await tick();
    expect(onClose).toHaveBeenCalledTimes(1);
    await finishTransition(panel(el));
    expect(panel(el)).toBeNull();
  });

  it("点击外部和 ESC 可关闭", async () => {
    const el = await mount();

    el.show!();
    await tick();
    expect(el.shadowRoot!.querySelector(".pop-confirm-popover")).toBeTruthy();

    document.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await tick();
    await finishTransition(panel(el));
    expect(el.shadowRoot!.querySelector(".pop-confirm-popover")).toBeNull();

    el.show!();
    await tick();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();
    await finishTransition(panel(el));
    expect(el.shadowRoot!.querySelector(".pop-confirm-popover")).toBeNull();
  });

  it("快速重开会隔离旧 leave 并保持新面板的浮层、焦点和事件事务", async () => {
    const el = await mount();
    const triggerButton = el.querySelector<HTMLButtonElement>("button")!;
    const openEvents = vi.fn();
    const closeEvents = vi.fn();
    el.addEventListener("open", openEvents);
    el.addEventListener("close", closeEvents);
    triggerButton.focus();

    await openByClick(el);
    const firstPanel = panel(el)!;
    await finishTransition(firstPanel);

    el.hide!();
    await tick();
    const leavingPanel = panel(el)!;
    el.show!();
    await tick();

    const duringReopen = Array.from(
      el.shadowRoot!.querySelectorAll<HTMLElement>(".pop-confirm-popover"),
    );
    const replacementPanel = duringReopen.find((candidate) => candidate !== leavingPanel)!;
    expect(replacementPanel).toBeTruthy();

    await finishTransition(leavingPanel);
    expect(panel(el)).toBe(replacementPanel);
    expect(openEvents).toHaveBeenCalledTimes(2);
    expect(closeEvents).toHaveBeenCalledTimes(1);

    await finishTransition(replacementPanel);
    expect(el.shadowRoot!.activeElement).toBe(
      replacementPanel.querySelector(".pop-confirm-action.ghost"),
    );

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();
    await finishTransition(replacementPanel);
    expect(panel(el)).toBeNull();
    expect(closeEvents).toHaveBeenCalledTimes(2);
    expect(document.activeElement).toBe(triggerButton);
  });

  it("leave 期间第二次 Escape 会继续关闭下一层浮层", async () => {
    const lower = await mount();
    const upper = await mount();
    lower.show!();
    await tick();
    upper.show!();
    await tick();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();
    expect(upper.hasAttribute("data-open")).toBe(false);
    expect(lower.hasAttribute("data-open")).toBe(true);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();
    expect(lower.hasAttribute("data-open")).toBe(false);

    await finishTransition(panel(upper));
    await finishTransition(panel(lower));
  });

  it("卸载会释放顶层、定位、键盘和焦点资源", async () => {
    const el = await mount();
    const externalTrigger = document.createElement("button");
    document.body.appendChild(externalTrigger);
    externalTrigger.focus();
    el.show!();
    await tick();

    const activePanel = panel(el)!;
    expect(activePanel).toBeTruthy();
    el.remove();
    await tick();

    expect(activePanel.isConnected).toBe(false);
    expect(document.activeElement).toBe(externalTrigger);
  });

  it("focus trap 覆盖 shadowRoot 内可聚焦动作", async () => {
    const el = await mount();
    el.show!();
    await tick();
    await tick();

    const actions = Array.from(
      el.shadowRoot!.querySelectorAll<HTMLElement>(".pop-confirm-actions button"),
    );
    expect(actions).toHaveLength(2);
    actions[1]!.focus();
    el.shadowRoot!.querySelector(".pop-confirm-popover")!.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }),
    );
    await tick();

    expect(el.shadowRoot!.activeElement).toBe(actions[0]);
  });

  it("actions 插槽会穿透 elf-button Shadow DOM 建立焦点闭环", async () => {
    const el = document.createElement("elf-pop-confirm") as PopConfirmEl;
    const triggerButton = document.createElement("button");
    triggerButton.textContent = "打开";
    const actions = document.createElement("span");
    actions.slot = "actions";
    const cancelButton = document.createElement("elf-button");
    cancelButton.textContent = "取消";
    const middleButton = document.createElement("elf-button");
    middleButton.textContent = "稍后";
    const confirmButton = document.createElement("elf-button");
    confirmButton.textContent = "确认";
    actions.append(cancelButton, middleButton, confirmButton);
    el.append(triggerButton, actions);
    document.body.appendChild(el);
    await tick();
    await tick();

    el.show!();
    await tick();
    await tick();

    const cancelTarget = cancelButton.shadowRoot!.querySelector<HTMLButtonElement>("button")!;
    const middleTarget = middleButton.shadowRoot!.querySelector<HTMLButtonElement>("button")!;
    const confirmTarget = confirmButton.shadowRoot!.querySelector<HTMLButtonElement>("button")!;
    const activePanel = panel(el)!;
    expect(collectFocusable(activePanel)).toEqual([cancelTarget, middleTarget, confirmTarget]);
    expect(cancelButton.shadowRoot!.activeElement).toBe(cancelTarget);

    middleTarget.focus();
    const middleTab = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    vi.spyOn(middleTab, "composedPath").mockReturnValue([middleTarget]);
    expect(trapFocus(middleTab, activePanel)).toBe(false);
    expect(middleTab.defaultPrevented).toBe(false);
    expect(middleButton.shadowRoot!.activeElement).toBe(middleTarget);

    confirmTarget.focus();
    const forwardWrap = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    vi.spyOn(forwardWrap, "composedPath").mockReturnValue([confirmTarget]);
    expect(trapFocus(forwardWrap, activePanel)).toBe(true);
    expect(forwardWrap.defaultPrevented).toBe(true);

    cancelTarget.focus();
    const backwardWrap = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    vi.spyOn(backwardWrap, "composedPath").mockReturnValue([cancelTarget]);
    expect(trapFocus(backwardWrap, activePanel)).toBe(true);
    expect(backwardWrap.defaultPrevented).toBe(true);
  });

  it("异步确认期间锁定动作，完成后只提交一次", async () => {
    let resolveGuard!: (value?: boolean | void) => void;
    const beforeConfirm = vi.fn(
      () =>
        new Promise<boolean | void>((resolve) => {
          resolveGuard = resolve;
        }),
    );
    const el = await mount({ beforeConfirm });
    const onConfirm = vi.fn();
    el.addEventListener("confirm", onConfirm);
    await openByClick(el);

    const confirmButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      ".pop-confirm-action.primary",
    )!;
    confirmButton.click();
    confirmButton.click();
    await tick();

    expect(beforeConfirm).toHaveBeenCalledTimes(1);
    expect(confirmButton.disabled).toBe(true);
    expect(el.hasAttribute("data-confirming")).toBe(true);
    expect(el.shadowRoot!.querySelector(".pop-confirm-spinner")).toBeTruthy();

    resolveGuard();
    await tick();
    await tick();
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(el.hasAttribute("data-open")).toBe(false);
  });

  it("守卫返回 false 时保持打开且允许重试", async () => {
    const beforeConfirm = vi.fn().mockResolvedValue(false);
    const el = await mount({ beforeConfirm });
    const onConfirm = vi.fn();
    el.addEventListener("confirm", onConfirm);
    await openByClick(el);

    (el.shadowRoot!.querySelector(".pop-confirm-action.primary") as HTMLButtonElement).click();
    await tick();
    await tick();

    expect(onConfirm).not.toHaveBeenCalled();
    expect(el.hasAttribute("data-open")).toBe(true);
    expect(el.hasAttribute("data-confirming")).toBe(false);
  });

  it("守卫拒绝时派发 confirm-error 并保持打开", async () => {
    const error = new Error("request failed");
    const el = await mount({ beforeConfirm: () => Promise.reject(error) });
    const onError = vi.fn();
    el.addEventListener("confirm-error", onError as EventListener);
    await openByClick(el);

    (el.shadowRoot!.querySelector(".pop-confirm-action.primary") as HTMLButtonElement).click();
    await tick();
    await tick();

    expect(onError).toHaveBeenCalledTimes(1);
    expect((onError.mock.calls[0]![0] as CustomEvent).detail).toBe(error);
    expect(el.hasAttribute("data-open")).toBe(true);
  });

  it("uses the top layer, flips placement and re-anchors on external scroll", async () => {
    const originalShow = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "showPopover");
    const originalHide = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "hidePopover");
    const originalRect = HTMLElement.prototype.getBoundingClientRect;
    const showPopover = vi.fn();
    const hidePopover = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "showPopover", {
      configurable: true,
      value: showPopover,
    });
    Object.defineProperty(HTMLElement.prototype, "hidePopover", {
      configurable: true,
      value: hidePopover,
    });
    HTMLElement.prototype.getBoundingClientRect = vi.fn(function (this: HTMLElement) {
      if (this.classList.contains("pop-confirm-trigger")) {
        return {
          left: 200,
          top: 24,
          right: 280,
          bottom: 56,
          width: 80,
          height: 32,
          x: 200,
          y: 24,
          toJSON: () => ({}),
        };
      }
      if (this.classList.contains("pop-confirm-popover")) {
        return {
          left: 0,
          top: 0,
          right: 260,
          bottom: 120,
          width: 260,
          height: 120,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        };
      }
      return originalRect.call(this);
    });

    try {
      const el = await mount({ teleported: true, placement: "top" });
      await openByClick(el);
      await frame();
      await tick();
      const panel = el.shadowRoot!.querySelector<HTMLElement>(".pop-confirm-popover")!;

      expect(showPopover).toHaveBeenCalled();
      expect(panel.getAttribute("popover")).toBe("manual");
      expect(panel.classList.contains("placement-bottom")).toBe(true);
      expect(panel.style.position).toBe("fixed");

      window.dispatchEvent(new Event("scroll"));
      await frame();
      await tick();
      expect(el.hasAttribute("data-open")).toBe(true);
      expect(panel.style.position).toBe("fixed");
    } finally {
      HTMLElement.prototype.getBoundingClientRect = originalRect;
      if (originalShow) Object.defineProperty(HTMLElement.prototype, "showPopover", originalShow);
      else delete (HTMLElement.prototype as HTMLElement & { showPopover?: () => void }).showPopover;
      if (originalHide) Object.defineProperty(HTMLElement.prototype, "hidePopover", originalHide);
      else delete (HTMLElement.prototype as HTMLElement & { hidePopover?: () => void }).hidePopover;
    }
  });

  it("renders custom actions and exposes confirm/cancel behavior", async () => {
    const el = await mount({ teleported: false });
    el.insertAdjacentHTML(
      "beforeend",
      '<button slot="actions" data-test="keep">保留</button><button slot="actions" data-test="confirm">继续</button>',
    );
    await tick();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    el.addEventListener("confirm", onConfirm);
    el.addEventListener("cancel", onCancel);

    el.show!();
    await tick();
    const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="actions"]')!;
    expect(slot.assignedElements()).toHaveLength(2);
    expect(el.shadowRoot!.querySelectorAll(".pop-confirm-action")).toHaveLength(2);

    await el.confirm!();
    expect(onConfirm).toHaveBeenCalledTimes(1);
    el.show!();
    await tick();
    el.cancel!();
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
