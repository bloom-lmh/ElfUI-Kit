import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

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
  (el.querySelector("button") as HTMLElement).click();
  await tick();
  await tick();
};

describe("elf-pop-confirm", () => {
  it("click 触发打开，确认后触发事件并关闭", async () => {
    const el = await mount();
    const onConfirm = vi.fn();
    const onUpdate = vi.fn();
    el.addEventListener("confirm", onConfirm);
    el.addEventListener("update:visible", onUpdate as EventListener);

    await openByClick(el);
    expect(el.shadowRoot!.querySelector(".pop-confirm-popover")).toBeTruthy();
    expect(el.hasAttribute("data-open")).toBe(true);

    (el.shadowRoot!.querySelector(".pop-confirm-action.primary") as HTMLElement).click();
    await tick();

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toBe(false);
    await wait(150);
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
    await wait(150);
    expect(el.shadowRoot!.querySelector(".pop-confirm-popover")).toBeNull();
  });

  it("点击外部和 ESC 可关闭", async () => {
    const el = await mount();

    el.show!();
    await tick();
    expect(el.shadowRoot!.querySelector(".pop-confirm-popover")).toBeTruthy();

    document.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await tick();
    await wait(150);
    expect(el.shadowRoot!.querySelector(".pop-confirm-popover")).toBeNull();

    el.show!();
    await tick();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();
    await wait(150);
    expect(el.shadowRoot!.querySelector(".pop-confirm-popover")).toBeNull();
  });

  it("focus trap 覆盖 shadowRoot 内可聚焦动作", async () => {
    const el = await mount();
    el.show!();
    await tick();
    await tick();

    const actions = Array.from(
      el.shadowRoot!.querySelectorAll<HTMLElement>(".pop-confirm-actions button")
    );
    expect(actions).toHaveLength(2);
    actions[1]!.focus();
    el.shadowRoot!.querySelector(".pop-confirm-popover")!.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true })
    );
    await tick();

    expect(el.shadowRoot!.activeElement).toBe(actions[0]);
  });

  it("异步确认期间锁定动作，完成后只提交一次", async () => {
    let resolveGuard!: (value?: boolean | void) => void;
    const beforeConfirm = vi.fn(
      () => new Promise<boolean | void>((resolve) => {
        resolveGuard = resolve;
      })
    );
    const el = await mount({ beforeConfirm });
    const onConfirm = vi.fn();
    el.addEventListener("confirm", onConfirm);
    await openByClick(el);

    const confirmButton = el.shadowRoot!.querySelector<HTMLButtonElement>(".pop-confirm-action.primary")!;
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
    Object.defineProperty(HTMLElement.prototype, "showPopover", { configurable: true, value: showPopover });
    Object.defineProperty(HTMLElement.prototype, "hidePopover", { configurable: true, value: hidePopover });
    HTMLElement.prototype.getBoundingClientRect = vi.fn(function (this: HTMLElement) {
      if (this.classList.contains("pop-confirm-trigger")) {
        return { left: 200, top: 24, right: 280, bottom: 56, width: 80, height: 32, x: 200, y: 24, toJSON: () => ({}) };
      }
      if (this.classList.contains("pop-confirm-popover")) {
        return { left: 0, top: 0, right: 260, bottom: 120, width: 260, height: 120, x: 0, y: 0, toJSON: () => ({}) };
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
      '<button slot="actions" data-test="keep">保留</button><button slot="actions" data-test="confirm">继续</button>'
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
