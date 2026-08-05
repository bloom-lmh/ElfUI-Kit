import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { AiCommandSearch } from "./index";

beforeAll(() => registerComponents(AiCommandSearch));

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface AiCommandEl extends HTMLElement {
  items?: Array<{ id?: string | number; title: string; description?: string; keywords?: string }>;
  focus?: () => void;
  blur?: () => void;
  clear?: () => void;
  getQuery?: () => string;
}

const createSearch = async (overrides: Partial<AiCommandEl> = {}): Promise<AiCommandEl> => {
  const el = document.createElement("elf-ai-command-search") as AiCommandEl;
  Object.assign(el, {
    items: [
      { id: 1, title: "Forecast summer demand", description: "Ice cream", keywords: "summer" },
      { id: 2, title: "Find waffle cone suppliers", keywords: "supplier" },
      { id: 3, title: "Draft flavor launch plan", keywords: "launch" },
    ],
    ...overrides,
  });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-ai-command-search", () => {
  it("renders all commands when the query is empty", async () => {
    const el = await createSearch();
    expect(el.shadowRoot!.querySelectorAll(".option")).toHaveLength(3);
  });

  it("filters live by query", async () => {
    const el = await createSearch();
    const input = el.shadowRoot!.querySelector<HTMLInputElement>(".input")!;
    input.value = "supplier";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".option")).toHaveLength(1);
    expect(el.shadowRoot!.textContent).toContain("Find waffle cone suppliers");
  });

  it("shows the empty state when nothing matches", async () => {
    const el = await createSearch();
    const input = el.shadowRoot!.querySelector<HTMLInputElement>(".input")!;
    input.value = "zzz";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".option")).toHaveLength(0);
    expect(el.shadowRoot!.querySelector(".empty")).toBeTruthy();
    expect(el.hasAttribute("data-empty")).toBe(true);
  });

  it("selects the active item with Enter", async () => {
    const el = await createSearch();
    const input = el.shadowRoot!.querySelector<HTMLInputElement>(".input")!;
    const onSelect = vi.fn();
    el.addEventListener("select", onSelect as EventListener);
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0].detail.title).toBe("Forecast summer demand");
  });

  it("clears the query with Escape and exposes helpers", async () => {
    const el = await createSearch();
    const input = el.shadowRoot!.querySelector<HTMLInputElement>(".input")!;
    input.value = "summer";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();
    expect(el.getQuery!()).toBe("");
    expect(typeof el.focus).toBe("function");
    el.clear!();
  });
});
