import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { ChatComposer } from "./index";

beforeAll(() => registerComponents(ChatComposer));

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface ChatComposerEl extends HTMLElement {
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  maxlength?: number;
  rows?: number;
  maxRows?: number;
  submitOnEnter?: boolean;
  modelValue?: string;
  autofocus?: boolean;
  focus?: () => void;
  blur?: () => void;
  clear?: () => void;
  getValue?: () => string;
}

const createComposer = async (overrides: Partial<ChatComposerEl> = {}): Promise<ChatComposerEl> => {
  const el = document.createElement("elf-chat-composer") as ChatComposerEl;
  Object.assign(el, { placeholder: "Ask anything", ...overrides });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

const textareaOf = (el: HTMLElement): HTMLTextAreaElement =>
  el.shadowRoot!.querySelector<HTMLTextAreaElement>(".input")!;

const type = (textarea: HTMLTextAreaElement, value: string): void => {
  textarea.value = value;
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
};

describe("elf-chat-composer", () => {
  it("renders a labelled textarea and updates the model", async () => {
    const el = await createComposer();
    const textarea = textareaOf(el);
    expect(textarea.getAttribute("placeholder")).toBe("Ask anything");

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    type(textarea, "Hello");
    await tick();
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate.mock.calls[0][0].detail).toBe("Hello");
  });

  it("sends the trimmed content on Enter and clears the draft", async () => {
    const el = await createComposer();
    const onSend = vi.fn();
    el.addEventListener("send", onSend as EventListener);
    const textarea = textareaOf(el);

    type(textarea, "  Hello  ");
    textarea.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await tick();
    expect(onSend).toHaveBeenCalledTimes(1);
    expect(onSend.mock.calls[0][0].detail).toBe("Hello");
    expect(el.getValue!()).toBe("");
  });

  it("inserts a newline on Shift+Enter instead of sending", async () => {
    const el = await createComposer();
    const onSend = vi.fn();
    el.addEventListener("send", onSend as EventListener);
    const textarea = textareaOf(el);

    type(textarea, "Line one");
    textarea.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", shiftKey: true, bubbles: true }),
    );
    await tick();
    expect(onSend).not.toHaveBeenCalled();
  });

  it("does not send while an IME composition is active", async () => {
    const el = await createComposer();
    const onSend = vi.fn();
    el.addEventListener("send", onSend as EventListener);
    const textarea = textareaOf(el);

    type(textarea, "nǐ");
    textarea.dispatchEvent(new Event("compositionstart", { bubbles: true }));
    textarea.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    textarea.dispatchEvent(new Event("compositionend", { bubbles: true }));
    await tick();
    expect(onSend).not.toHaveBeenCalled();
  });

  it("shows a stop button while loading and emits stop", async () => {
    const el = await createComposer({ loading: true });
    const onStop = vi.fn();
    el.addEventListener("stop", onStop as EventListener);
    expect(el.shadowRoot!.querySelector(".stop")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".send")).toBeFalsy();
    el.shadowRoot!.querySelector<HTMLButtonElement>(".stop")!.click();
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it("blocks sending when disabled or empty", async () => {
    const disabled = await createComposer({ disabled: true });
    const onSendDisabled = vi.fn();
    disabled.addEventListener("send", onSendDisabled as EventListener);
    type(textareaOf(disabled), "Still disabled");
    textareaOf(disabled).dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    await tick();
    expect(onSendDisabled).not.toHaveBeenCalled();
    expect(disabled.shadowRoot!.querySelector<HTMLButtonElement>(".send")!.disabled).toBe(true);

    const empty = await createComposer();
    const onSendEmpty = vi.fn();
    empty.addEventListener("send", onSendEmpty as EventListener);
    empty.shadowRoot!.querySelector<HTMLButtonElement>(".send")!.click();
    expect(onSendEmpty).not.toHaveBeenCalled();
  });

  it("exposes clear, getValue, focus, and blur", async () => {
    const el = await createComposer();
    type(textareaOf(el), "Draft");
    await tick();
    expect(el.getValue!()).toBe("Draft");
    el.clear!();
    await tick();
    expect(el.getValue!()).toBe("");
    el.focus!();
    expect(el.shadowRoot!.activeElement).toBe(textareaOf(el));
    el.blur!();
    expect(el.shadowRoot!.activeElement).not.toBe(textareaOf(el));
  });
});
