import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { ChatMessage } from "./index";

beforeAll(() => registerComponents(ChatMessage));

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface ChatMessageEl extends HTMLElement {
  role?: string;
  content?: string;
  name?: string;
  time?: string;
  status?: string;
  error?: string;
  copyable?: boolean;
  avatar?: string;
  copy?: () => Promise<boolean>;
}

const createMessage = async (overrides: Partial<ChatMessageEl> = {}): Promise<ChatMessageEl> => {
  const el = document.createElement("elf-chat-message") as ChatMessageEl;
  Object.assign(el, { role: "assistant", content: "Hello", copyable: true, ...overrides });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-chat-message", () => {
  it("renders content, role label, and host role state", async () => {
    const el = await createMessage({ role: "assistant", content: "Hello there" });
    expect(el.shadowRoot!.textContent).toContain("Hello there");
    expect(el.shadowRoot!.textContent).toContain("Assistant");
    expect(el.getAttribute("data-role")).toBe("assistant");
    expect(el.getAttribute("data-status")).toBe("complete");
  });

  it("uses the user label, avatar initial, and time when provided", async () => {
    const el = await createMessage({
      role: "user",
      content: "Sum it up",
      name: "Alex",
      time: "12:30",
    });
    expect(el.shadowRoot!.textContent).toContain("Alex");
    expect(el.shadowRoot!.textContent).toContain("You");
    expect(el.shadowRoot!.textContent).toContain("12:30");
    expect(el.shadowRoot!.querySelector(".avatar")?.textContent).toBe("A");
    expect(el.getAttribute("data-role")).toBe("user");
  });

  it("reflects the bubble shape and falls back to rounded", async () => {
    const glass = await createMessage({ shape: "glass" });
    expect(glass.getAttribute("data-shape")).toBe("glass");
    const unknown = await createMessage({ shape: "bouncy" });
    expect(unknown.getAttribute("data-shape")).toBe("rounded");
  });

  it("shows the streaming caret while status is streaming", async () => {
    const el = await createMessage({ status: "streaming" });
    expect(el.shadowRoot!.querySelector(".caret")).toBeTruthy();
    expect(el.hasAttribute("streaming")).toBe(true);
  });

  it("renders an alert for error messages", async () => {
    const el = await createMessage({ status: "error", error: "Request failed" });
    const alert = el.shadowRoot!.querySelector('[role="alert"]');
    expect(alert?.textContent).toContain("Request failed");
    expect(el.hasAttribute("data-error")).toBe(true);
  });

  it("copies content to the clipboard and emits copy", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    const el = await createMessage({ content: "Copy me" });
    const onCopy = vi.fn();
    el.addEventListener("copy", onCopy as EventListener);

    expect(await el.copy!()).toBe(true);
    expect(writeText).toHaveBeenCalledWith("Copy me");
    expect(onCopy).toHaveBeenCalledTimes(1);
    expect(onCopy.mock.calls[0][0].detail).toEqual({ content: "Copy me" });
  });

  it("renders custom slot content instead of plain text", async () => {
    const el = document.createElement("elf-chat-message") as ChatMessageEl;
    el.role = "assistant";
    el.content = "Fallback";
    el.innerHTML = "<strong>Rich content</strong>";
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(el.querySelector("strong")?.textContent).toBe("Rich content");
  });
});
