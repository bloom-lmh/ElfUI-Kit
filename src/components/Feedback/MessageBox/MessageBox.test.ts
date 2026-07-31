import { readFileSync } from "node:fs";

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import type { MessageBoxElement } from "./types";

beforeAll(async () => {
  await import("../../../components");
});

const tick = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 20));
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));
const host = (): MessageBoxElement | null =>
  document.body.querySelector<MessageBoxElement>("elf-message-box");
const shadow = (): ShadowRoot => host()!.shadowRoot!;
const finishTransition = async (element: HTMLElement | null): Promise<void> => {
  await frame();
  await frame();
  element?.dispatchEvent(new Event("transitionend", { bubbles: true }));
  await tick();
};

afterEach(async () => {
  const { ElfMessageBox } = await import("./index");
  ElfMessageBox.closeAll();
  await wait(230);
  document.body.innerHTML = "";
  document.body.style.overflow = "";
  document.documentElement.lang = "zh-CN";
});

describe("ElfMessageBox", () => {
  it("uses Core Transition as the only structural close owner", () => {
    const source = readFileSync("src/components/Feedback/MessageBox/component.ts", "utf8");
    const cssText = readFileSync("src/components/Feedback/MessageBox/style.scss", "utf8");

    expect(source).toContain('<Transition\n    name="message-box"');
    expect(source).toContain("@before-leave=${onBeforeLeave}");
    expect(source).toContain("@after-leave=${onAfterLeave}");
    expect(source).not.toContain("closeTimer");
    expect(source).not.toContain("setTimeout");
    expect(cssText).not.toContain(".is-closing");
    expect(cssText).toContain(".message-box-enter-active");
    expect(cssText).toContain(".message-box-leave-active");
    expect(cssText).toMatch(/prefers-reduced-motion[\s\S]*transition: none/);
  });

  it("settles only after leave releases focus and scroll ownership", async () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();

    const { ElfMessageBox } = await import("./index");
    let settled = false;
    const result = ElfMessageBox.confirm("Continue?");
    void result.then(
      () => {
        settled = true;
      },
      () => {
        settled = true;
      },
    );
    await tick();

    shadow().querySelector<HTMLButtonElement>(".confirm")!.click();
    expect(settled).toBe(false);
    expect(host()).toBeTruthy();
    expect(document.body.style.overflow).toBe("hidden");

    await finishTransition(shadow().querySelector<HTMLElement>(".mask"));
    await expect(result).resolves.toEqual({ action: "confirm", value: "" });
    expect(host()).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(trigger);
  });

  it("hands Escape ownership to the next box as soon as the top box leaves", async () => {
    const { ElfMessageBox } = await import("./index");
    const first = ElfMessageBox.confirm("First", {
      distinguishCancelAndClose: true,
    }).catch((reason: unknown) => reason);
    const second = ElfMessageBox.confirm("Second", {
      distinguishCancelAndClose: true,
    }).catch((reason: unknown) => reason);
    await tick();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

    await expect(Promise.all([first, second])).resolves.toEqual(["close", "close"]);
    expect(document.querySelectorAll("elf-message-box")).toHaveLength(0);
  });

  it("preserves the accepted action when another close arrives during leave", async () => {
    const { ElfMessageBox } = await import("./index");
    const result = ElfMessageBox.confirm("Confirm wins", {
      distinguishCancelAndClose: true,
    });
    await tick();

    const leavingMask = shadow().querySelector<HTMLElement>(".mask");
    shadow().querySelector<HTMLButtonElement>(".confirm")!.click();
    window.dispatchEvent(new Event("hashchange"));
    await finishTransition(leavingMask);

    await expect(result).resolves.toEqual({ action: "confirm", value: "" });
  });

  it("settles an in-flight close when its host unmounts", async () => {
    const { ElfMessageBox } = await import("./index");
    const result = ElfMessageBox.confirm("Unmount", {
      distinguishCancelAndClose: true,
    }).catch((reason: unknown) => reason);
    await tick();

    const activeHost = host()!;
    activeHost.startClose("close");
    await tick();
    activeHost.remove();

    await expect(result).resolves.toBe("close");
    expect(activeHost.startClose("confirm")).toBe(false);
    expect(document.body.style.overflow).toBe("");
  });

  it("ignores an async guard result after the host has unmounted", async () => {
    const { ElfMessageBox } = await import("./index");
    let release!: (allowed: boolean) => void;
    const callback = vi.fn();
    const result = ElfMessageBox.confirm("Guarded unmount", {
      distinguishCancelAndClose: true,
      callback,
      beforeClose: () =>
        new Promise<boolean>((resolve) => {
          release = resolve;
        }),
    }).catch((reason: unknown) => reason);
    await tick();

    shadow().querySelector<HTMLButtonElement>(".confirm")!.click();
    await tick();
    host()!.remove();
    await expect(result).resolves.toBe("close");

    release(true);
    await tick();
    expect(callback).toHaveBeenCalledOnce();
    expect(document.querySelectorAll("elf-message-box")).toHaveLength(0);
  });

  it("opens an alert and resolves after confirmation", async () => {
    const { ElfMessageBox } = await import("./index");
    const result = ElfMessageBox.alert("版本已更新", "提示");
    await tick();

    expect(shadow().textContent).toContain("版本已更新");
    expect(shadow().textContent).toContain("提示");
    expect(shadow().querySelector(".cancel")).toBeNull();
    expect(document.body.style.overflow).toBe("hidden");

    shadow().querySelector<HTMLButtonElement>(".confirm")!.click();
    await expect(result).resolves.toEqual({ action: "confirm", value: "" });
    expect(host()).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("rejects confirm cancellation with the compatible action", async () => {
    const { ElfMessageBox } = await import("./index");
    const result = ElfMessageBox.confirm("永久删除当前记录？", "删除确认");
    await tick();

    expect(shadow().querySelector(".cancel")).toBeTruthy();
    shadow().querySelector<HTMLButtonElement>(".cancel")!.click();
    await expect(result).rejects.toBe("cancel");
  });

  it("distinguishes a close action when requested", async () => {
    const { ElfMessageBox } = await import("./index");
    const result = ElfMessageBox.confirm("保存更改？", {
      distinguishCancelAndClose: true,
    });
    await tick();

    shadow().querySelector<HTMLButtonElement>(".close")!.click();
    await expect(result).rejects.toBe("close");
  });

  it("keeps alert open for Escape and backdrop interactions", async () => {
    const { ElfMessageBox } = await import("./index");
    const result = ElfMessageBox.alert("必须确认").catch(() => undefined);
    await tick();
    await tick();

    expect(host()!.closeOnPressEscape).toBe(false);
    expect(shadow().querySelector(".mask")).toBeTruthy();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    shadow()
      .querySelector<HTMLElement>(".mask")!
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await tick();
    expect(host()).toBeTruthy();

    shadow().querySelector<HTMLButtonElement>(".confirm")!.click();
    await result;
  });

  it("validates prompt input before resolving", async () => {
    const { ElfMessageBox } = await import("./index");
    const result = ElfMessageBox.prompt("请输入工作邮箱", "邀请成员", {
      inputPlaceholder: "name@example.com",
      inputPattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
      inputErrorMessage: "邮箱格式不正确",
    });
    await tick();

    const input = shadow().querySelector<HTMLInputElement>(".input")!;
    shadow().querySelector<HTMLButtonElement>(".confirm")!.click();
    await tick();
    expect(shadow().textContent).toContain("邮箱格式不正确");
    expect(input.getAttribute("aria-invalid")).toBe("true");

    input.value = "team@elfui.dev";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    shadow().querySelector<HTMLButtonElement>(".confirm")!.click();
    await expect(result).resolves.toEqual({
      action: "confirm",
      value: "team@elfui.dev",
    });
  });

  it("waits for an async beforeClose guard and exposes pending state", async () => {
    const { ElfMessageBox } = await import("./index");
    let release!: (allowed: boolean) => void;
    const beforeClose = vi.fn(
      () =>
        new Promise<boolean>((resolve) => {
          release = resolve;
        }),
    );
    const result = ElfMessageBox.confirm("提交审批？", { beforeClose });
    await tick();

    const confirm = shadow().querySelector<HTMLButtonElement>(".confirm")!;
    confirm.click();
    await tick();
    expect(confirm.disabled).toBe(true);
    expect(shadow().querySelector(".spinner")).toBeTruthy();

    release(false);
    await tick();
    expect(confirm.disabled).toBe(false);
    expect(host()).toBeTruthy();

    confirm.click();
    await tick();
    release(true);
    await expect(result).resolves.toEqual({ action: "confirm", value: "" });
    expect(beforeClose).toHaveBeenCalledTimes(2);
  });

  it("renders trusted Node content without parsing HTML strings", async () => {
    const { ElfMessageBox } = await import("./index");
    const content = document.createElement("strong");
    content.textContent = "可信节点内容";
    const result = ElfMessageBox({ message: content });
    await tick();

    expect(host()!.querySelector("strong")?.textContent).toBe("可信节点内容");
    shadow().querySelector<HTMLButtonElement>(".confirm")!.click();
    await result;
  });

  it("restores focus and localizes the close button", async () => {
    document.documentElement.lang = "en-US";
    const trigger = document.createElement("button");
    trigger.textContent = "Open";
    document.body.appendChild(trigger);
    trigger.focus();

    const { ElfMessageBox } = await import("./index");
    const result = ElfMessageBox.confirm("Continue?");
    await tick();
    await tick();

    expect(shadow().querySelector(".close")?.getAttribute("aria-label")).toBe("Close message box");
    expect(shadow().querySelector("[role='alertdialog']")?.getAttribute("aria-label")).toBe(
      "Message box",
    );
    const confirm = shadow().querySelector<HTMLButtonElement>(".confirm")!;
    expect(shadow().activeElement).toBe(confirm);
    confirm.click();
    await result;
    expect(document.activeElement).toBe(trigger);
  });

  it("applies custom host classes, z-index and theme tokens", async () => {
    const { ElfMessageBox } = await import("./index");
    const result = ElfMessageBox({
      message: "Themed",
      customClass: "audit-box",
      zIndex: 12000,
      themeTokens: { primary: "#6750a4", bgPaper: "#fff8ff" },
    });
    await tick();

    expect(host()!.classList.contains("audit-box")).toBe(true);
    expect(host()!.style.getPropertyValue("--_message-box-z-index")).toBe("12000");
    expect(host()!.style.getPropertyValue("--elf-primary")).toBe("#6750a4");
    shadow().querySelector<HTMLButtonElement>(".confirm")!.click();
    await result;
  });
});
