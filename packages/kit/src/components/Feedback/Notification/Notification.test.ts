// elf-notification + ElfNotification() 测试

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  // 确保全局 Custom Elements 已经注册
  await import("../../../register-all").then(({ registerAllComponents }) =>
    registerAllComponents(),
  );
});

afterEach(async () => {
  const { ElfNotification } = await import("../Notification/index");
  ElfNotification.closeAll();
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));
const wait = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));
const waitFor = async (predicate: () => boolean, timeout = 1000): Promise<void> => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (predicate()) return;
    await wait(20);
  }
  expect(predicate()).toBe(true);
};

describe("ElfNotification()", () => {
  it("函数式调用：直接传字符串", async () => {
    const { ElfNotification } = await import("../Notification/index");
    ElfNotification("测试通知内容");
    await tick();
    await tick();
    const el = document.body.querySelector("elf-notification");
    expect(el).toBeTruthy();
    expect(el!.shadowRoot!.textContent).toContain("测试通知内容");
    expect(el!.getAttribute("position")).toBe("top-right"); // 默认方向
  });

  it("ElfNotification.success/error 传递 title 和 type", async () => {
    const { ElfNotification } = await import("../Notification/index");
    ElfNotification.success({ title: "温馨提示", message: "操作已成功" });
    ElfNotification.error({ title: "警报", message: "有未知错误" });
    await tick();
    await tick();
    const els = document.body.querySelectorAll("elf-notification");
    expect(els.length).toBe(2);

    const successEl = els[0] as HTMLElement & { type?: string };
    expect(successEl.type).toBe("success");
    expect(successEl.getAttribute("title-text")).toBe("温馨提示");
    expect(successEl.shadowRoot!.textContent).toContain("温馨提示");
    expect(successEl.shadowRoot!.textContent).toContain("✓");

    const errorEl = els[1] as HTMLElement & { type?: string };
    expect(errorEl.type).toBe("error");
    expect(errorEl.getAttribute("title-text")).toBe("警报");
    expect(errorEl.shadowRoot!.textContent).toContain("警报");
    expect(errorEl.shadowRoot!.textContent).toContain("×");
  });

  it("支持自定义 position 属性", async () => {
    const { ElfNotification } = await import("../Notification/index");
    ElfNotification({ message: "左下角通知", position: "bottom-left" });
    await tick();
    await tick();
    const el = document.body.querySelector("elf-notification");
    expect(el).toBeTruthy();
    expect(el!.getAttribute("position")).toBe("bottom-left");
  });

  it("自动关闭", async () => {
    const { ElfNotification } = await import("../Notification/index");
    ElfNotification({ message: "闪烁提示", duration: 50 });
    await tick();
    await tick();
    expect(document.body.querySelectorAll("elf-notification").length).toBe(1);
    await waitFor(() => document.body.querySelectorAll("elf-notification").length === 0);
    expect(document.body.querySelectorAll("elf-notification").length).toBe(0);
  });

  it("点击 closable 按钮手动关闭", async () => {
    const { ElfNotification } = await import("../Notification/index");
    ElfNotification({ message: "手动关闭提示", duration: 0, closable: true });
    await tick();
    await tick();
    const el = document.body.querySelector("elf-notification");
    expect(el).toBeTruthy();

    const closeBtn = el!.shadowRoot!.querySelector(".close") as HTMLButtonElement;
    expect(closeBtn).toBeTruthy();
    closeBtn.click();

    await waitFor(() => document.body.querySelectorAll("elf-notification").length === 0);
    expect(document.body.querySelectorAll("elf-notification").length).toBe(0);
  });

  it("支持 onClick 点击回调", async () => {
    const { ElfNotification } = await import("../Notification/index");
    const onClickSpy = vi.fn();
    ElfNotification({ message: "点击提示", duration: 0, onClick: onClickSpy });
    await tick();
    await tick();
    const el = document.body.querySelector("elf-notification");
    expect(el).toBeTruthy();

    const notifyInner = el!.shadowRoot!.querySelector(".notification") as HTMLElement;
    notifyInner.click();

    expect(onClickSpy).toHaveBeenCalledTimes(1);
  });

  it("多通知叠加 restack 偏移计算", async () => {
    const { ElfNotification } = await import("../Notification/index");
    // 创建两个同一位置的通知
    ElfNotification({ message: "通知A", duration: 0, position: "top-right" });
    ElfNotification({ message: "通知B", duration: 0, position: "top-right" });
    await tick();
    await wait(50); // 给点时间进行 DOM 渲染与高度计算

    const els = document.body.querySelectorAll("elf-notification");
    expect(els.length).toBe(2);

    const elA = els[0] as HTMLElement;
    const elB = els[1] as HTMLElement;

    expect(elA.style.getPropertyValue("--_offset")).toBe("16px");
    // 通知B由于排在后面，其偏移量应当大于16px
    const offsetB = elB.style.getPropertyValue("--_offset");
    expect(offsetB).toBeTruthy();
    expect(parseInt(offsetB)).toBeGreaterThan(16);
  });

  it("supports append targets, host classes, z-index, and custom offsets", async () => {
    const { ElfNotification } = await import("../Notification/index");
    const target = document.createElement("section");
    document.body.appendChild(target);

    ElfNotification({
      message: "targeted",
      duration: 0,
      appendTo: target,
      customClass: "notice analytics-notice",
      zIndex: 4321,
      offset: 40,
      icon: "@",
      closeIcon: "Dismiss",
    });
    await tick();
    await tick();

    const el = target.querySelector("elf-notification") as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.classList.contains("notice")).toBe(true);
    expect(el.classList.contains("analytics-notice")).toBe(true);
    expect(el.style.zIndex).toBe("4321");
    expect(el.style.getPropertyValue("--_offset")).toBe("40px");
    expect(el.shadowRoot!.querySelector(".icon")?.textContent).toBe("@");
    expect(el.shadowRoot!.querySelector(".close")?.textContent?.trim()).toBe("Dismiss");
    expect(el.shadowRoot!.querySelector(".close")?.classList.contains("is-label")).toBe(true);
    expect(el.shadowRoot!.querySelector(".close")?.getAttribute("aria-label")).toBe("Dismiss");
  });

  it("renders trusted DOM nodes without enabling HTML-string injection", async () => {
    const { ElfNotification } = await import("../Notification/index");
    const action = document.createElement("button");
    action.textContent = "查看详情";
    action.dataset.notificationAction = "details";

    ElfNotification({ message: () => action, duration: 0 });
    ElfNotification({
      message: '<img src=x onerror="alert(1)">',
      duration: 0,
      position: "bottom-left",
    });
    await tick();
    await tick();

    const notifications = document.body.querySelectorAll("elf-notification");
    expect(notifications[0].querySelector("[data-notification-action='details']")).toBe(action);
    expect(notifications[0].shadowRoot!.querySelector("slot")!.assignedElements()).toContain(
      action,
    );
    expect(notifications[1].shadowRoot!.querySelector(".message")!.textContent).toContain("<img");
    expect(notifications[1].querySelector("img")).toBeNull();
  });

  it("calls onClose once and supports the showClose compatibility option", async () => {
    const { ElfNotification } = await import("../Notification/index");
    const onClose = vi.fn();
    const handle = ElfNotification({ message: "manual", duration: 0, showClose: false, onClose });
    await tick();
    await tick();

    const el = document.body.querySelector("elf-notification")!;
    expect(el.shadowRoot!.querySelector(".close")).toBeNull();
    handle.close();
    expect(onClose).toHaveBeenCalledTimes(1);
    handle.close();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("uses the document locale for a detached service close label", async () => {
    document.documentElement.lang = "en-US";
    const { ElfNotification } = await import("../Notification/index");
    ElfNotification({ message: "Detached notification", duration: 0 });
    await tick();
    await tick();

    const close = document.body
      .querySelector("elf-notification")!
      .shadowRoot!.querySelector(".close");
    expect(close?.getAttribute("aria-label")).toBe("Close notification");
  });
});
