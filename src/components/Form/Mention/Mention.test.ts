import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Mention } from "./index";

beforeAll(() => {
  registerComponents(Mention);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface MentionEl extends HTMLElement {
  modelValue?: string;
  options?: unknown[];
  prefixes?: string[];
  whole?: boolean;
}

describe("elf-mention", () => {
  it("shows options after prefix and emits select", async () => {
    const el = document.createElement("elf-mention") as MentionEl;
    el.modelValue = "@";
    el.options = [{ value: "alice" }];
    const onSelect = vi.fn();
    el.addEventListener("select", onSelect as EventListener);
    document.body.appendChild(el);
    await tick();

    const textarea = el.shadowRoot!.querySelector("textarea") as HTMLTextAreaElement;
    textarea.value = "@a";
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();

    (el.shadowRoot!.querySelector(".option") as HTMLButtonElement).dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true })
    );
    expect(onSelect).toHaveBeenCalled();
  });

  it("opens below the input by default", async () => {
    const el = document.createElement("elf-mention") as MentionEl;
    el.options = [{ value: "alice" }];
    document.body.appendChild(el);
    await tick();
    const textarea = el.shadowRoot!.querySelector("textarea") as HTMLTextAreaElement;
    textarea.value = "@";
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();

    expect(el.shadowRoot!.querySelector(".mention")?.classList.contains("placement-bottom")).toBe(true);
  });

  it("selects an item whose source index changes after filtering", async () => {
    const el = document.createElement("elf-mention") as MentionEl;
    el.options = [
      { label: "林舟", value: "linzhou" },
      { label: "周然", value: "zhouran" },
      { label: "许宁", value: "xuning" }
    ];
    const onSelect = vi.fn();
    el.addEventListener("select", onSelect as EventListener);
    document.body.appendChild(el);
    await tick();

    const textarea = el.shadowRoot!.querySelector("textarea") as HTMLTextAreaElement;
    textarea.value = "@许";
    textarea.selectionStart = textarea.value.length;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();

    const option = el.shadowRoot!.querySelector(".option") as HTMLButtonElement;
    expect(option.textContent).toContain("许宁");
    option.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect((onSelect.mock.calls[0]![0] as CustomEvent).detail[0].value).toBe("xuning");
  });

  it("replaces only the active mention and supports keyboard selection", async () => {
    const el = document.createElement("elf-mention") as MentionEl;
    el.modelValue = "Hello @al world";
    el.options = [{ value: "alice" }, { value: "alex" }];
    const onSelect = vi.fn();
    el.addEventListener("select", onSelect as EventListener);
    document.body.appendChild(el);
    await tick();

    const textarea = el.shadowRoot!.querySelector("textarea") as HTMLTextAreaElement;
    textarea.value = "Hello @al world";
    textarea.setSelectionRange(9, 9);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    textarea.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await tick();

    expect(onSelect).toHaveBeenCalled();
    expect(el.shadowRoot!.querySelector("textarea")!.value).toBe("Hello @alice  world");
  });

  it("honors whole-word triggering and multiple prefixes", async () => {
    const el = document.createElement("elf-mention") as MentionEl;
    el.prefixes = ["@", "#"];
    el.whole = true;
    el.options = [{ value: "topic" }];
    document.body.appendChild(el);
    await tick();
    const textarea = el.shadowRoot!.querySelector("textarea") as HTMLTextAreaElement;

    textarea.value = "word#topic";
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    expect(el.shadowRoot!.querySelector(".panel")).toBeNull();

    textarea.value = "#topic";
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    expect(el.shadowRoot!.querySelector(".panel")).not.toBeNull();
  });

  it("uses the shared filled field surface by default", async () => {
    const el = document.createElement("elf-mention") as MentionEl;
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("variant")).toBe("filled");
    expect(el.shadowRoot!.querySelector("textarea")).toBeTruthy();
  });

  it("renders a real outlined label notch", async () => {
    const el = document.createElement("elf-mention") as MentionEl;
    el.setAttribute("variant", "outlined");
    el.setAttribute("label", "Members");
    document.body.appendChild(el);
    await tick();
    expect(el.shadowRoot!.querySelector(".field-outline legend")?.textContent).toBe("Members");
    expect(el.hasAttribute("data-has-label")).toBe(true);
  });
});
