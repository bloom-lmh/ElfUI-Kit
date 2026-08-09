// elf-badge 单元测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../register-all").then(({ registerAllComponents }) =>
    registerAllComponents(),
  );
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

describe("elf-badge", () => {
  it("渲染默认状态", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("value", "5");
    document.body.appendChild(el);
    await tick();

    const badge = el.shadowRoot!.querySelector(".badge")!;
    expect(badge).toBeTruthy();
    expect(badge.textContent!.trim()).toBe("5");
  });

  it("value 为字符串时直接渲染文本", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("value", "新");
    document.body.appendChild(el);
    await tick();

    const badge = el.shadowRoot!.querySelector(".badge")!;
    expect(badge.textContent!.trim()).toBe("新");
  });

  it("数字 value 超出 max 时显示 max+", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("value", "200");
    el.setAttribute("max", "99");
    document.body.appendChild(el);
    await tick();

    const badge = el.shadowRoot!.querySelector(".badge")!;
    expect(badge.textContent!.trim()).toBe("99+");
  });

  it("数字 value 未超 max 时显示原值", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("value", "42");
    el.setAttribute("max", "99");
    document.body.appendChild(el);
    await tick();

    const badge = el.shadowRoot!.querySelector(".badge")!;
    expect(badge.textContent!.trim()).toBe("42");
  });

  it("isDot 模式下只渲染圆点，不渲染数字", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("is-dot", "");
    el.setAttribute("value", "99");
    document.body.appendChild(el);
    await tick();

    const badge = el.shadowRoot!.querySelector(".badge")!;
    expect(badge).toBeTruthy();
    expect(badge.querySelector("span")).toBeNull();
  });

  it("hidden 时不渲染 badge", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("hidden", "");
    el.setAttribute("value", "5");
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".badge")).toBeNull();
  });

  it("value 为 0 时默认显示（showZero=true）", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("value", "0");
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".badge")).toBeTruthy();
  });

  it("value 为 0 且 showZero=false 时不显示", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("value", "0");
    document.body.appendChild(el);
    // HTML boolean attribute 无法表示 false，需通过 JS property 设置
    (el as any).showZero = false;
    await tick();

    expect(el.shadowRoot!.querySelector(".badge")).toBeNull();
  });

  it("自定义 color 覆盖 type 颜色", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("value", "1");
    el.setAttribute("color", "#ff6f00");
    document.body.appendChild(el);
    await tick();

    const badge = el.shadowRoot!.querySelector(".badge") as HTMLElement;
    expect(badge).toBeTruthy();
    expect(["#ff6f00", "rgb(255, 111, 0)"]).toContain(badge.style.backgroundColor);
  });

  it("默认 slot 内容正常渲染", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("value", "3");
    el.innerHTML = "<span>消息</span>";
    document.body.appendChild(el);
    await tick();

    const wrapper = el.shadowRoot!.querySelector(".badge-wrapper")!;
    expect(wrapper.querySelector("slot")).toBeTruthy();
    expect(el.querySelector("span")?.textContent).toBe("消息");
  });

  it("type 属性反射到 host 上", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("value", "1");
    el.setAttribute("type", "success");
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("type")).toBe("success");
    expect(el.shadowRoot!.querySelector(".badge")).toBeTruthy();
  });

  it("part 属性可被外部 ::part(badge) 选中", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("value", "1");
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector("[part='badge']")).toBeTruthy();
  });

  it("value 为空字符串时不渲染", async () => {
    const el = document.createElement("elf-badge");
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".badge")).toBeNull();
  });

  it("applies offset, badge style, and badge class", async () => {
    const el = document.createElement("elf-badge") as HTMLElement & {
      offset: [number, number];
      badgeStyle: Record<string, string>;
      badgeClass: string;
      value: number;
    };
    el.value = 7;
    el.offset = [8, -4];
    el.badgeStyle = { borderRadius: "4px", minWidth: "24px" };
    el.badgeClass = "release-badge";
    document.body.appendChild(el);
    await tick();

    const badge = el.shadowRoot!.querySelector<HTMLElement>(".badge")!;
    expect(badge.classList.contains("release-badge")).toBe(true);
    expect(badge.style.getPropertyValue("--_badge-offset-x")).toBe("8px");
    expect(badge.style.getPropertyValue("--_badge-offset-y")).toBe("-4px");
    expect(badge.style.borderRadius).toBe("4px");
    expect(badge.style.minWidth).toBe("24px");
  });

  it("prefers content prop and supports the content slot", async () => {
    const propBadge = document.createElement("elf-badge") as HTMLElement & {
      value: number;
      content: string;
    };
    propBadge.value = 4;
    propBadge.content = "NEW";
    document.body.appendChild(propBadge);

    const slotBadge = document.createElement("elf-badge");
    slotBadge.setAttribute("value", "9");
    slotBadge.innerHTML = '<strong slot="content">VIP</strong>';
    document.body.appendChild(slotBadge);
    await tick();

    expect(propBadge.shadowRoot!.querySelector(".badge")!.textContent!.trim()).toBe("NEW");
    const slot = slotBadge.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="content"]')!;
    expect(slot.assignedElements()[0].textContent).toBe("VIP");
  });

  it("keeps reference content visible when hidden only suppresses the badge", async () => {
    const el = document.createElement("elf-badge") as HTMLElement & {
      hidden: boolean;
      value: number;
    };
    el.innerHTML = "<button>消息</button>";
    el.value = 3;
    el.hidden = true;
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".badge")).toBeNull();
    expect(el.querySelector("button")!.textContent).toBe("消息");
    expect(el.shadowRoot!.querySelector("slot")).toBeTruthy();
  });

  it("reflects dynamic type and dot state and exposes an accessible status", async () => {
    const el = document.createElement("elf-badge") as HTMLElement & {
      value: number;
      type: string;
      isDot: boolean;
    };
    el.value = 2;
    el.type = "success";
    el.isDot = true;
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("type")).toBe("success");
    expect(el.hasAttribute("is-dot")).toBe(true);
    const badge = el.shadowRoot!.querySelector(".badge")!;
    expect(badge.getAttribute("role")).toBe("status");
    expect(badge.getAttribute("aria-label")).toBe("状态提示");
  });

  it("keeps the full accessible label for long visual content", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("value", "需要人工复核的高优先级通知");
    document.body.appendChild(el);
    await tick();

    const badge = el.shadowRoot!.querySelector<HTMLElement>(".badge")!;
    expect(badge.textContent?.trim()).toBe("需要人工复核的高优先级通知");
    expect(badge.getAttribute("aria-label")).toBe("需要人工复核的高优先级通知");
  });
});
