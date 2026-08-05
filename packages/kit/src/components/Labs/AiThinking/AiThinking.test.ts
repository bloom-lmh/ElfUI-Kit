import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { AiThinking } from "./index";

beforeAll(() => registerComponents(AiThinking));

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface AiThinkingEl extends HTMLElement {
  title?: string;
  steps?: Array<{ id?: string | number; title: string; kind?: string; detail?: string }>;
  status?: string;
  defaultExpanded?: boolean;
  expand?: () => void;
  collapse?: () => void;
  toggle?: () => void;
  isExpanded?: () => boolean;
}

const createThinking = async (overrides: Partial<AiThinkingEl> = {}): Promise<AiThinkingEl> => {
  const el = document.createElement("elf-ai-thinking") as AiThinkingEl;
  Object.assign(el, {
    title: "Thought for 4 seconds",
    steps: [
      { id: 1, title: "Reading flavor briefs", kind: "steps" },
      { id: 2, title: "Comparing tasting notes", kind: "reasoning", detail: "6 flavors" },
      { id: 3, title: "Scanning supplier lists", kind: "search" },
      { id: 4, title: "Writing the report", kind: "coding", detail: "churn.ts" },
    ],
    status: "running",
    defaultExpanded: true,
    ...overrides,
  });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-ai-thinking", () => {
  it("renders the summary and expanded steps", async () => {
    const el = await createThinking();
    const root = el.shadowRoot!;
    expect(root.textContent).toContain("Thought for 4 seconds");
    expect(root.querySelectorAll(".step")).toHaveLength(4);
    expect(root.querySelectorAll(".kind-tab")).toHaveLength(5);
  });

  it("filters steps by kind", async () => {
    const el = await createThinking();
    const tabs = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".kind-tab");
    tabs[2]?.click();
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".step")).toHaveLength(1);
    expect(el.shadowRoot!.textContent).toContain("Comparing tasting notes");
  });

  it("toggles expansion and emits toggle", async () => {
    const el = await createThinking({ defaultExpanded: false });
    const onToggle = vi.fn();
    el.addEventListener("toggle", onToggle as EventListener);
    el.expand!();
    expect(el.isExpanded!()).toBe(true);
    expect(el.hasAttribute("data-expanded")).toBe(true);
    el.collapse!();
    expect(el.isExpanded!()).toBe(false);
    expect(onToggle).toHaveBeenCalledTimes(2);
  });

  it("reflects status on the host", async () => {
    const el = await createThinking({ status: "done" });
    expect(el.getAttribute("data-status")).toBe("done");
    expect(el.shadowRoot!.textContent).toContain("Done");
  });
});
