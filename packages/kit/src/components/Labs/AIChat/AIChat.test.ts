import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { AiChat } from "./index";

beforeAll(() => registerComponents(AiChat));

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface AIChatEl extends HTMLElement {
  items?: Array<{
    id?: string | number;
    role: string;
    content?: string;
    name?: string;
    status?: string;
    error?: string;
    toolCalls?: Array<{
      id?: string | number;
      name: string;
      status?: string;
      result?: string;
    }>;
  }>;
  loading?: boolean;
  title?: string;
  placeholder?: string;
  clear?: () => void;
  scrollToBottom?: () => void;
  focus?: () => void;
  getItemCount?: () => number;
}

const createChat = async (overrides: Partial<AIChatEl> = {}): Promise<AIChatEl> => {
  const el = document.createElement("elf-ai-chat") as AIChatEl;
  Object.assign(el, { items: [], title: "Support Agent", ...overrides });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-ai-chat", () => {
  it("renders the header and an empty state", async () => {
    const el = await createChat({ title: "Support Agent", emptyText: "Start a conversation" });
    expect(el.shadowRoot!.textContent).toContain("Support Agent");
    expect(el.shadowRoot!.textContent).toContain("Start a conversation");
  });

  it("renders user and assistant messages", async () => {
    const el = await createChat({
      items: [
        { id: 1, role: "user", content: "What is ElfUI?" },
        { id: 2, role: "assistant", content: "A native component library." },
      ],
    });
    const messages = el.shadowRoot!.querySelectorAll("elf-chat-message");
    expect(messages).toHaveLength(2);
    expect(messages[0]?.shadowRoot?.textContent).toContain("What is ElfUI?");
    expect(messages[0]?.getAttribute("data-role")).toBe("user");
    expect(messages[1]?.getAttribute("data-role")).toBe("assistant");
    expect(el.getItemCount!()).toBe(2);
  });

  it("shows a typing indicator while loading", async () => {
    const el = await createChat({ loading: true });
    expect(el.shadowRoot!.querySelector(".typing")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".status-dot")?.classList.contains("active")).toBe(true);
  });

  it("scrolls the message log to the bottom when items change", async () => {
    const el = await createChat();
    const list = el.shadowRoot!.querySelector<HTMLElement>(".list")!;
    Object.defineProperty(list, "scrollHeight", { value: 640, configurable: true });
    el.items = [{ id: 1, role: "assistant", content: "Hello" }];
    await new Promise((resolve) => setTimeout(resolve, 40));
    expect(list.scrollTop).toBe(640);
  });

  it("renders tool calls and re-emits retry with the call", async () => {
    const call = { id: "c1", name: "search_web", status: "error", result: "[]" };
    const el = await createChat({
      items: [{ id: 1, role: "assistant", content: "Let me check.", toolCalls: [call] }],
    });
    const toolCall = el.shadowRoot!.querySelector("elf-chat-tool-call")!;
    expect(toolCall.shadowRoot?.textContent).toContain("search_web");

    const onRetry = vi.fn();
    el.addEventListener("retry", onRetry as EventListener);
    toolCall.shadowRoot!.querySelector<HTMLButtonElement>(".summary")!.click();
    toolCall.shadowRoot!.querySelector<HTMLButtonElement>(".retry")!.click();
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRetry.mock.calls[0][0].detail).toMatchObject({ name: "search_web" });
  });

  it("emits send from the built-in composer", async () => {
    const el = await createChat();
    const onSend = vi.fn();
    el.addEventListener("send", onSend as EventListener);
    const composer = el.shadowRoot!.querySelector("elf-chat-composer")!;
    const textarea = composer.shadowRoot!.querySelector<HTMLTextAreaElement>(".input")!;

    textarea.value = "Hello agent";
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    textarea.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await tick();
    expect(onSend).toHaveBeenCalledTimes(1);
    expect(onSend.mock.calls[0][0].detail).toBe("Hello agent");
  });

  it("emits clear from the header action and exposes chat methods", async () => {
    const el = await createChat({
      items: [{ id: 1, role: "user", content: "Hi" }],
    });
    const onClear = vi.fn();
    el.addEventListener("clear", onClear as EventListener);
    el.shadowRoot!.querySelector<HTMLButtonElement>(".clear")!.click();
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(typeof el.scrollToBottom).toBe("function");
    expect(typeof el.focus).toBe("function");
    el.focus!();
  });

  it("bubbles message copy events with the item", async () => {
    const item = { id: 2, role: "assistant", content: "Copyable answer" };
    const el = await createChat({ items: [item] });
    const onCopy = vi.fn();
    el.addEventListener("message-copy", onCopy as EventListener);

    const message = el.shadowRoot!.querySelector("elf-chat-message")!;
    const clipboard = { writeText: vi.fn().mockResolvedValue(undefined) };
    Object.defineProperty(navigator, "clipboard", { value: clipboard, configurable: true });
    await (message as unknown as { copy?: () => Promise<boolean> }).copy?.();
    await tick();
    expect(onCopy).toHaveBeenCalledTimes(1);
    expect(onCopy.mock.calls[0][0].detail.item).toMatchObject({ content: "Copyable answer" });
    expect(onCopy.mock.calls[0][0].detail.content).toBe("Copyable answer");
  });
});
