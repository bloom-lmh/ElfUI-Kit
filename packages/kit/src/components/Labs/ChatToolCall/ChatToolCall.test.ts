import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { ChatToolCall } from "./index";

beforeAll(() => registerComponents(ChatToolCall));

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface ChatToolCallEl extends HTMLElement {
  name?: string;
  status?: string;
  duration?: string;
  arguments?: string;
  result?: string;
  error?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  expand?: () => void;
  collapse?: () => void;
  toggle?: () => void;
  isExpanded?: () => boolean;
}

const createToolCall = async (overrides: Partial<ChatToolCallEl> = {}): Promise<ChatToolCallEl> => {
  const el = document.createElement("elf-chat-tool-call") as ChatToolCallEl;
  Object.assign(el, { name: "search_web", status: "running", ...overrides });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-chat-tool-call", () => {
  it("renders the tool name and status label", async () => {
    const el = await createToolCall({ name: "search_web", status: "running" });
    expect(el.shadowRoot!.textContent).toContain("search_web");
    expect(el.shadowRoot!.textContent).toContain("Running");
    expect(el.getAttribute("data-status")).toBe("running");
  });

  it("reflects success and error states", async () => {
    const success = await createToolCall({
      status: "success",
      result: "42",
      defaultExpanded: true,
    });
    expect(success.shadowRoot!.textContent).toContain("Done");
    expect(success.shadowRoot!.textContent).toContain("42");

    const failed = await createToolCall({
      status: "error",
      error: "timeout",
      defaultExpanded: true,
    });
    expect(failed.shadowRoot!.textContent).toContain("Failed");
    expect(failed.shadowRoot!.textContent).toContain("timeout");
  });

  it("toggles details and updates aria-expanded", async () => {
    const el = await createToolCall({
      arguments: '{"q":"elfui"}',
      result: "3 results",
    });
    const summary = el.shadowRoot!.querySelector<HTMLButtonElement>(".summary")!;
    expect(el.shadowRoot!.querySelector(".details")).toBeFalsy();
    expect(summary.getAttribute("aria-expanded")).toBe("false");

    summary.click();
    await tick();
    expect(el.shadowRoot!.querySelector(".details")).toBeTruthy();
    expect(el.shadowRoot!.textContent).toContain('{"q":"elfui"}');
    expect(summary.getAttribute("aria-expanded")).toBe("true");
  });

  it("exposes expand, collapse, toggle, and isExpanded", async () => {
    const el = await createToolCall();
    expect(el.isExpanded!()).toBe(false);
    el.expand!();
    expect(el.isExpanded!()).toBe(true);
    el.collapse!();
    expect(el.isExpanded!()).toBe(false);
    el.toggle!();
    expect(el.isExpanded!()).toBe(true);
  });

  it("keeps details visible when collapsible is false", async () => {
    const el = await createToolCall({ collapsible: false, result: "always" });
    expect(el.shadowRoot!.querySelector(".details")).toBeTruthy();
    const summary = el.shadowRoot!.querySelector<HTMLButtonElement>(".summary")!;
    expect(summary.disabled).toBe(true);
    expect(summary.getAttribute("aria-expanded")).toBe("true");
  });

  it("emits retry from the error state", async () => {
    const el = await createToolCall({ status: "error", error: "boom", defaultExpanded: true });
    const onRetry = vi.fn();
    el.addEventListener("retry", onRetry as EventListener);
    el.shadowRoot!.querySelector<HTMLButtonElement>(".retry")!.click();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
