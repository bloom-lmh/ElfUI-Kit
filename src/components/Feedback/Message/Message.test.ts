import { readFileSync } from "node:fs";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(async () => {
  const { ElfMessage } = await import("../Message/index");
  ElfMessage.closeAll();
  document.body.innerHTML = "";
  delete document.documentElement.dataset.theme;
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

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

    const content = document.body.querySelector("elf-message")!.shadowRoot!.querySelector(".content");
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
      themeTokens: { primary: "#80cbc4", bgPaper: "#172525", textPrimary: "#ffffff" }
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
    await wait(250);
    expect(document.body.querySelectorAll("elf-message")).toHaveLength(0);
  });

  it("auto closes after duration", async () => {
    const { ElfMessage } = await import("../Message/index");
    ElfMessage({ message: "auto", duration: 50 });
    await tick();
    expect(document.body.querySelectorAll("elf-message").length).toBeGreaterThan(0);
    await wait(300);
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
    expect(parseInt((els[1] as HTMLElement).style.getPropertyValue("--_offset"))).toBeGreaterThan(40);
  });

  it("supports click, close and custom class", async () => {
    const { ElfMessage } = await import("../Message/index");
    const onClick = vi.fn();
    const onClose = vi.fn();
    ElfMessage({ message: "clickable", duration: 0, closable: true, customClass: "qa-message", onClick, onClose });
    await tick();
    await tick();

    const el = document.body.querySelector("elf-message") as HTMLElement;
    expect(el.classList.contains("qa-message")).toBe(true);
    (el.shadowRoot!.querySelector(".message") as HTMLElement).click();
    expect(onClick).toHaveBeenCalledTimes(1);
    (el.shadowRoot!.querySelector(".close") as HTMLButtonElement).click();
    await wait(260);
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
});
