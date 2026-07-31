import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ElfMessage } from "./index";

afterEach(() => {
  ElfMessage.closeAll();
  document.body.innerHTML = "";
  delete document.documentElement.dataset.theme;
  document.documentElement.lang = "zh-CN";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const finishTransitions = async (messages: readonly Element[]): Promise<void> => {
  await frame();
  await frame();
  for (const message of messages) {
    message.shadowRoot
      ?.querySelector(".message")
      ?.dispatchEvent(new Event("transitionend", { bubbles: true }));
  }
  await tick();
};

const finishTransition = async (message: Element | null): Promise<void> => {
  await finishTransitions(message ? [message] : []);
};

describe("ElfMessage()", () => {
  it("supports a string shorthand", async () => {
    const { ElfMessage } = await import("../Message/index");
    ElfMessage("测试消息");
    await tick();
    await tick();
    const el = document.body.querySelector("elf-message");
    expect(el).toBeTruthy();
    expect(el!.shadowRoot!.textContent).toContain("测试消息");
  });

  it("uses theme surface and text variables", async () => {
    document.documentElement.dataset.theme = "dark";
    const { ElfMessage } = await import("../Message/index");
    ElfMessage({ message: "暗色消息", duration: 0 });
    await tick();
    await tick();

    const content = document.body
      .querySelector("elf-message")!
      .shadowRoot!.querySelector(".content");
    expect(content).toBeTruthy();
    const cssText = readFileSync("src/components/Feedback/Message/style.scss", "utf8");
    expect(cssText).toContain("var(--elf-text-primary");
    expect(cssText).toContain("var(--elf-bg-paper");
    expect(cssText).toContain("var(--elf-info");
    expect(cssText).toContain("border-radius: var(--elf-radius-sm, 6px)");
  });

  it("accepts ThemeProvider tokens for document-level overlays", async () => {
    const { ElfMessage } = await import("../Message/index");
    ElfMessage.success("themed", {
      duration: 0,
      themeTokens: { primary: "#80cbc4", bgPaper: "#172525", textPrimary: "#ffffff" },
    });
    await tick();
    await tick();

    const message = document.body.querySelector<HTMLElement>("elf-message")!;
    expect(message.style.getPropertyValue("--elf-primary")).toBe("#80cbc4");
    expect(message.style.getPropertyValue("--elf-bg-paper")).toBe("#172525");
    expect(message.style.getPropertyValue("--elf-text-primary")).toBe("#ffffff");
  });

  it("normalizes error to danger", async () => {
    const { ElfMessage } = await import("../Message/index");
    ElfMessage.success("ok");
    ElfMessage.danger("err");
    ElfMessage.error("compat error");
    await tick();
    await tick();
    const els = document.body.querySelectorAll("elf-message");
    expect(els).toHaveLength(3);
    expect((els[0] as HTMLElement & { type?: string }).type).toBe("success");
    expect((els[1] as HTMLElement & { type?: string }).type).toBe("danger");
    expect((els[2] as HTMLElement & { type?: string }).type).toBe("danger");
  });

  it("does not auto close when duration is zero", async () => {
    const { ElfMessage } = await import("../Message/index");
    const handle = ElfMessage({ message: "permanent", duration: 0 });
    await tick();
    await wait(50);
    expect(document.body.querySelectorAll("elf-message").length).toBeGreaterThan(0);
    handle.close();
    await finishTransition(document.body.querySelector("elf-message"));
    expect(document.body.querySelectorAll("elf-message")).toHaveLength(0);
  });

  it("auto closes after duration", async () => {
    const { ElfMessage } = await import("../Message/index");
    ElfMessage({ message: "auto", duration: 50 });
    await tick();
    expect(document.body.querySelectorAll("elf-message").length).toBeGreaterThan(0);
    await wait(60);
    await finishTransition(document.body.querySelector("elf-message"));
    expect(document.body.querySelectorAll("elf-message")).toHaveLength(0);
  });

  it("supports bottom stacking, offset and z-index", async () => {
    const { ElfMessage } = await import("../Message/index");
    ElfMessage({ message: "bottom", duration: 0, position: "bottom", offset: 40, zIndex: 3100 });
    ElfMessage({ message: "second", duration: 0, position: "bottom", offset: 40 });
    await tick();
    await wait(50);

    const els = document.body.querySelectorAll("elf-message");
    expect(els).toHaveLength(2);
    expect(els[0]!.getAttribute("position")).toBe("bottom");
    expect((els[0] as HTMLElement).style.getPropertyValue("--_offset")).toBe("40px");
    expect((els[0] as HTMLElement).style.getPropertyValue("--_z-index")).toBe("3100");
    expect(parseInt((els[1] as HTMLElement).style.getPropertyValue("--_offset"))).toBeGreaterThan(
      40,
    );
  });

  it("supports click, close and custom class", async () => {
    const { ElfMessage } = await import("../Message/index");
    const onClick = vi.fn();
    const onClose = vi.fn();
    ElfMessage({
      message: "clickable",
      duration: 0,
      closable: true,
      customClass: "qa-message",
      onClick,
      onClose,
    });
    await tick();
    await tick();

    const el = document.body.querySelector("elf-message") as HTMLElement;
    expect(el.classList.contains("qa-message")).toBe(true);
    (el.shadowRoot!.querySelector(".message") as HTMLElement).click();
    expect(onClick).toHaveBeenCalledTimes(1);
    (el.shadowRoot!.querySelector(".close") as HTMLButtonElement).click();
    await finishTransition(el);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(document.body.querySelectorAll("elf-message")).toHaveLength(0);
  });

  it("emits an action without triggering the container click", async () => {
    const { ElfMessage } = await import("../Message/index");
    const onAction = vi.fn();
    const onClick = vi.fn();
    ElfMessage({ message: "saved", action: "Undo", duration: 0, onAction, onClick });
    await tick();
    await tick();

    const el = document.body.querySelector("elf-message") as HTMLElement;
    const action = el.shadowRoot!.querySelector(".action") as HTMLButtonElement;
    expect(action.textContent).toContain("Undo");
    action.click();
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("uses the document locale for a detached service close label", async () => {
    document.documentElement.lang = "en-US";
    const { ElfMessage } = await import("../Message/index");
    ElfMessage({ message: "Detached message", duration: 0, closable: true });
    await tick();
    await tick();

    const close = document.body.querySelector("elf-message")!.shadowRoot!.querySelector(".close");
    expect(close?.getAttribute("aria-label")).toBe("Close message");
  });

  it("settles one close transaction after leave even when close repeats", async () => {
    const { ElfMessage } = await import("../Message/index");
    const onClose = vi.fn();
    const handle = ElfMessage({ message: "one close", duration: 0, onClose });
    await tick();
    await tick();

    const message = document.body.querySelector<HTMLElement>("elf-message")!;
    const closeEvent = vi.fn();
    message.addEventListener("close", closeEvent);

    handle.close();
    handle.close();
    (message as HTMLElement & { close: () => void }).close();

    expect(message.isConnected).toBe(true);
    expect(onClose).not.toHaveBeenCalled();
    await finishTransition(message);

    expect(closeEvent).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(message.isConnected).toBe(false);
  });

  it("closeAll completes every top and bottom leave exactly once", async () => {
    const { ElfMessage } = await import("../Message/index");
    const closed = [vi.fn(), vi.fn(), vi.fn()];
    ElfMessage({ message: "top one", duration: 0, onClose: closed[0] });
    ElfMessage({ message: "bottom", position: "bottom", duration: 0, onClose: closed[1] });
    ElfMessage({ message: "top two", duration: 0, onClose: closed[2] });
    await tick();
    await tick();

    const messages = Array.from(document.body.querySelectorAll("elf-message"));
    ElfMessage.closeAll();
    ElfMessage.closeAll();
    await finishTransitions(messages);

    expect(document.body.querySelectorAll("elf-message")).toHaveLength(0);
    for (const callback of closed) expect(callback).toHaveBeenCalledTimes(1);
  });

  it("releases service ownership when its host is externally unmounted", async () => {
    const { ElfMessage } = await import("../Message/index");
    const onClose = vi.fn();
    const handle = ElfMessage({ message: "external unmount", duration: 0, onClose });
    await tick();
    await tick();

    document.body.querySelector("elf-message")!.remove();
    await tick();
    handle.close();

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.body.querySelectorAll("elf-message")).toHaveLength(0);
  });

  it("removes the host before invoking onClose after framework leave", async () => {
    const { ElfMessage } = await import("../Message/index");
    const observed: { message: HTMLElement | null } = { message: null };
    let connectedAtCallback = true;
    const handle = ElfMessage({
      message: "ordered close",
      duration: 0,
      onClose: () => {
        connectedAtCallback = Boolean(observed.message?.isConnected);
      },
    });
    await tick();
    await tick();
    observed.message = document.body.querySelector<HTMLElement>("elf-message");

    handle.close();
    await finishTransition(observed.message);

    expect(connectedAtCallback).toBe(false);
  });

  it("delegates structural motion to Core Transition with reduced-motion coverage", () => {
    const componentSource = readFileSync("src/components/Feedback/Message/component.ts", "utf8");
    const serviceSource = readFileSync("src/components/Feedback/Message/index.ts", "utf8");
    const styleSource = readFileSync("src/components/Feedback/Message/style.scss", "utf8");

    expect(componentSource).toContain('<Transition name="elf-message" appear');
    expect(componentSource).toContain("@after-leave=${onAfterLeave}");
    expect(componentSource).not.toContain("data-closing");
    expect(serviceSource).not.toContain("data-closing");
    expect(serviceSource).not.toContain("220");
    expect(serviceSource).toContain("timer = setTimeout(requestClose, duration)");
    expect(serviceSource).not.toContain("setTimeout(() =>");
    expect(styleSource).toContain(".elf-message-leave-active");
    expect(styleSource).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
