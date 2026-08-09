// elf-tooltip 测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../register-all").then(({ registerAllComponents }) =>
    registerAllComponents(),
  );
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => setTimeout(r, 20));
const wait = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));
const triggerOf = (el: HTMLElement): HTMLElement =>
  Array.from(el.children).find((child) => !child.hasAttribute("slot")) as HTMLElement;

interface TooltipEl extends HTMLElement {
  content?: string;
  placement?: string;
  disabled?: boolean;
  trigger?: string;
  showAfter?: number;
  hideAfter?: number;
  effect?: string;
  maxWidth?: number | string;
  visible?: boolean;
  touchLongPress?: boolean;
  longPressDelay?: number;
  longPressTolerance?: number;
  show?: () => void;
  hide?: () => void;
}

const touchPointerEvent = (
  type: "pointerdown" | "pointermove" | "pointerup" | "pointercancel",
  clientX: number,
  clientY: number,
): Event => {
  const event = new Event(type, { bubbles: true, composed: true });
  Object.defineProperties(event, {
    pointerType: { value: "touch" },
    clientX: { value: clientX },
    clientY: { value: clientY },
  });
  return event;
};

describe("elf-tooltip", () => {
  it("默认隐藏，Hover 模式下 mouseenter 显示，mouseleave 隐藏", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.content = "提示信息";
    el.innerHTML = "<button id='btn'>按钮</button>";
    document.body.appendChild(el);
    await tick();

    // 默认不渲染气泡
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();

    // 模拟 mouseenter 触发
    const _container = el.shadowRoot!.querySelector(".tooltip-container") as HTMLElement;
    triggerOf(el).dispatchEvent(new MouseEvent("mouseenter"));
    await tick();
    await tick();

    const tooltip = el.shadowRoot!.querySelector(".tooltip-content");
    expect(tooltip).toBeTruthy();
    expect(tooltip!.textContent).toContain("提示信息");
    expect(tooltip!.className).toContain("active");

    // 模拟 mouseleave 触发
    triggerOf(el).dispatchEvent(new MouseEvent("mouseleave"));
    await tick();
    await tick();

    // 处于 closing 状态
    expect(tooltip!.className).toContain("closing");

    // 等待 150ms 优雅淡出延迟
    await wait(160);
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();
  });

  it("Focus 模式下 focusin 显示，focusout 隐藏", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.content = "Focus 提示";
    el.trigger = "focus";
    el.innerHTML = "<input id='inp' />";
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();

    const _container = el.shadowRoot!.querySelector(".tooltip-container") as HTMLElement;
    triggerOf(el).dispatchEvent(new FocusEvent("focusin"));
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeTruthy();

    triggerOf(el).dispatchEvent(new FocusEvent("focusout"));
    await tick();
    await wait(160);

    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();
  });

  it("focus 触发时建立 aria-describedby，Escape 隐藏后恢复原值", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    const button = document.createElement("button");
    button.textContent = "查看权限说明";
    button.setAttribute("aria-describedby", "existing-help");
    el.appendChild(button);
    el.content = "只有管理员可以修改此配置";
    el.trigger = "focus";
    el.maxWidth = 280;
    document.body.appendChild(el);
    await tick();

    const _container = el.shadowRoot!.querySelector(".tooltip-container") as HTMLElement;
    triggerOf(el).dispatchEvent(new FocusEvent("focusin"));
    await tick();

    const tooltip = el.shadowRoot!.querySelector<HTMLElement>("[role='tooltip']");
    expect(tooltip).toBeTruthy();
    expect(tooltip?.style.getPropertyValue("--elf-tooltip-max-width")).toBe("280px");
    expect(button.getAttribute("aria-describedby")?.split(" ")).toEqual([
      "existing-help",
      tooltip?.id,
    ]);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();

    expect(button.getAttribute("aria-describedby")).toBe("existing-help");
    expect(el.shadowRoot!.querySelector(".tooltip-content")?.className).toContain("closing");
  });

  it("auto placement 在顶部空间不足时选择可用方向", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.content = "自动避让";
    el.placement = "auto";
    el.innerHTML = "<button>目标</button>";
    document.body.appendChild(el);
    await tick();

    const _container = el.shadowRoot!.querySelector(".tooltip-container") as HTMLElement;
    triggerOf(el).dispatchEvent(new MouseEvent("mouseenter"));
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelector(".tooltip-content")?.className).toContain("bottom");
  });

  it("Click 模式下点击切换，点击外部关闭", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.content = "Click 提示";
    el.trigger = "click";
    el.innerHTML = "<span>点我</span>";
    document.body.appendChild(el);
    await tick();

    const _container = el.shadowRoot!.querySelector(".tooltip-container") as HTMLElement;

    // 第一次点击：显示
    triggerOf(el).dispatchEvent(new MouseEvent("click"));
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeTruthy();

    // 第二次点击：隐藏
    triggerOf(el).dispatchEvent(new MouseEvent("click"));
    await tick();
    await wait(160);
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();

    // 再次显示后点击外部
    triggerOf(el).dispatchEvent(new MouseEvent("click"));
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeTruthy();

    // 点击外部
    document.dispatchEvent(new MouseEvent("click"));
    await tick();
    await wait(160);
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();
  });

  it("Contextmenu 模式下右键显示，再次右键隐藏，点击外部关闭", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.content = "右键提示";
    el.trigger = "contextmenu";
    el.innerHTML = "<span>右键</span>";
    document.body.appendChild(el);
    await tick();

    const _container = el.shadowRoot!.querySelector(".tooltip-container") as HTMLElement;

    // 右键触发
    const contextMenuEvt = new MouseEvent("contextmenu", { cancelable: true });
    triggerOf(el).dispatchEvent(contextMenuEvt);
    await tick();
    await tick();
    expect(contextMenuEvt.defaultPrevented).toBe(true);
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeTruthy();

    // 点击外部关闭
    document.dispatchEvent(new MouseEvent("click"));
    await tick();
    await wait(160);
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();
  });

  it("Manual 模式由 visible 属性控制", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.content = "手动提示";
    el.trigger = "manual";
    el.visible = false;
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();

    el.visible = true;
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeTruthy();

    el.visible = false;
    await tick();
    await wait(160);
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();
  });

  it("showAfter 延迟显示与 hideAfter 延迟隐藏", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.content = "延迟提示";
    el.showAfter = 100;
    el.hideAfter = 100;
    el.innerHTML = "<button>延迟触发</button>";
    document.body.appendChild(el);
    await tick();

    const _container = el.shadowRoot!.querySelector(".tooltip-container") as HTMLElement;

    triggerOf(el).dispatchEvent(new MouseEvent("mouseenter"));
    await tick();
    // 立即检查，因为有 100ms 延迟，应当还未显示
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();

    // 等待 110ms 后检查，应当显示
    await wait(110);
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeTruthy();

    triggerOf(el).dispatchEvent(new MouseEvent("mouseleave"));
    await tick();
    // 立即检查，应当还没开始隐藏
    expect(el.shadowRoot!.querySelector(".tooltip-content")!.className).not.toContain("closing");

    // 等待 110ms 后，开始隐藏（变为 closing）
    await wait(110);
    expect(el.shadowRoot!.querySelector(".tooltip-content")!.className).toContain("closing");

    // 再等 150ms 彻底销毁
    await wait(160);
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();
  });

  it("disabled 属性为 true 时，mouseenter 不会触发显示", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.content = "禁用提示";
    el.disabled = true;
    el.innerHTML = "<button>禁用触发</button>";
    document.body.appendChild(el);
    await tick();

    const _container = el.shadowRoot!.querySelector(".tooltip-container") as HTMLElement;
    triggerOf(el).dispatchEvent(new MouseEvent("mouseenter"));
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();
  });

  it("placement 和 effect 反映到气泡的 class", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.content = "样式提示";
    el.placement = "bottom";
    el.effect = "light";
    el.innerHTML = "<button>样式触发</button>";
    document.body.appendChild(el);
    await tick();

    const _container = el.shadowRoot!.querySelector(".tooltip-container") as HTMLElement;
    triggerOf(el).dispatchEvent(new MouseEvent("mouseenter"));
    await tick();
    await tick();

    const tooltip = el.shadowRoot!.querySelector(".tooltip-content") as HTMLElement;
    expect(tooltip.className).toContain("bottom");
    expect(tooltip.className).toContain("light");
  });

  it("可以通过 slot name='content' 传入自定义内容", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.innerHTML = "<button>触发</button><div slot='content'>自定义内容</div>";
    document.body.appendChild(el);
    await tick();

    const _container = el.shadowRoot!.querySelector(".tooltip-container") as HTMLElement;
    triggerOf(el).dispatchEvent(new MouseEvent("mouseenter"));
    await tick();
    await tick();

    const tooltip = el.shadowRoot!.querySelector(".tooltip-content") as HTMLElement;
    expect(tooltip).toBeTruthy();
    const slot = tooltip.querySelector("slot[name='content']");
    expect(slot).toBeTruthy();
  });

  it("可以通过 public API show() 和 hide() 来控制显示", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.content = "API提示";
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();

    el.show!();
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeTruthy();

    el.hide!();
    await tick();
    await wait(160);
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();
  });

  it("公开显隐方法按顺序派发生命周期事件", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.content = "生命周期";
    document.body.appendChild(el);
    await tick();
    const events: string[] = [];
    for (const name of ["before-show", "show", "before-hide", "hide"]) {
      el.addEventListener(name, () => events.push(name));
    }

    el.show!();
    await tick();
    el.hide!();
    await wait(170);

    expect(events).toEqual(["before-show", "show", "before-hide", "hide"]);
  });
});

describe("elf-tooltip touch long press", () => {
  it("触屏长按打开提示，松手后保持，并允许外部点击关闭", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    const button = document.createElement("button");
    button.textContent = "长按查看说明";
    el.appendChild(button);
    el.content = "触屏补充说明";
    el.longPressDelay = 120;
    document.body.appendChild(el);
    await tick();

    const _container = el.shadowRoot!.querySelector(".tooltip-container") as HTMLElement;
    triggerOf(el).dispatchEvent(touchPointerEvent("pointerdown", 20, 20));
    await wait(130);

    const tooltip = el.shadowRoot!.querySelector<HTMLElement>("[role='tooltip']");
    expect(tooltip).toBeTruthy();
    expect(button.getAttribute("aria-describedby")).toContain(tooltip!.id);

    triggerOf(el).dispatchEvent(touchPointerEvent("pointerup", 20, 20));
    await tick();
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeTruthy();

    document.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await wait(170);
    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();
  });

  it("触屏长按期间移动超过容差时取消打开", async () => {
    const el = document.createElement("elf-tooltip") as TooltipEl;
    el.content = "不应显示";
    el.longPressDelay = 120;
    el.longPressTolerance = 8;
    el.innerHTML = "<button>可滚动目标</button>";
    document.body.appendChild(el);
    await tick();

    const _container = el.shadowRoot!.querySelector(".tooltip-container") as HTMLElement;
    triggerOf(el).dispatchEvent(touchPointerEvent("pointerdown", 10, 10));
    triggerOf(el).dispatchEvent(touchPointerEvent("pointermove", 30, 10));
    await wait(140);

    expect(el.shadowRoot!.querySelector(".tooltip-content")).toBeNull();
  });
});
