import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { AiToolChips } from "./index";

beforeAll(() => registerComponents(AiToolChips));

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface AiToolChipsEl extends HTMLElement {
  summary?: string;
  items?: Array<{
    id?: string | number;
    kind?: string;
    title: string;
    detail?: string;
    meta?: string;
    status?: string;
  }>;
  files?: Array<{ name: string; additions: number; deletions: number }>;
  defaultExpanded?: boolean;
  expand?: () => void;
  collapse?: () => void;
  isExpanded?: () => boolean;
}

const createChips = async (overrides: Partial<AiToolChipsEl> = {}): Promise<AiToolChipsEl> => {
  const el = document.createElement("elf-ai-tool-chips") as AiToolChipsEl;
  Object.assign(el, {
    summary: "4 tool calls, 2 messages",
    items: [
      { id: 1, kind: "think", title: "Planning the churn schedule…", status: "running" },
      {
        id: 2,
        kind: "edit",
        title: "Write 204 lines",
        detail: "ChurnSchedule.tsx",
        status: "success",
      },
    ],
    files: [{ name: "ChurnSchedule.tsx", additions: 74, deletions: 41 }],
    defaultExpanded: true,
    ...overrides,
  });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-ai-tool-chips", () => {
  it("renders the summary and expanded items with file deltas", async () => {
    const el = await createChips();
    const root = el.shadowRoot!;
    expect(root.textContent).toContain("4 tool calls, 2 messages");
    expect(root.querySelectorAll(".item")).toHaveLength(2);
    expect(root.textContent).toContain("ChurnSchedule.tsx");
    expect(root.textContent).toContain("+74");
    expect(root.textContent).toContain("41");
  });

  it("reflects kind and status on item rows", async () => {
    const el = await createChips();
    const items = el.shadowRoot!.querySelectorAll<HTMLElement>(".item");
    expect(items[0]?.dataset.kind).toBe("think");
    expect(items[0]?.dataset.status).toBe("running");
    expect(items[1]?.dataset.status).toBe("success");
  });

  it("emits item-click with the item", async () => {
    const el = await createChips();
    const onClick = vi.fn();
    el.addEventListener("item-click", onClick as EventListener);
    el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".item")[1]!.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0].detail).toMatchObject({
      kind: "edit",
      title: "Write 204 lines",
    });
  });

  it("toggles expansion and exposes methods", async () => {
    const el = await createChips({ defaultExpanded: false });
    el.expand!();
    expect(el.isExpanded!()).toBe(true);
    expect(el.hasAttribute("data-expanded")).toBe(true);
    el.collapse!();
    expect(el.isExpanded!()).toBe(false);
  });
});
