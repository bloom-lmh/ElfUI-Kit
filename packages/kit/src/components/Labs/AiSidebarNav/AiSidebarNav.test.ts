import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { AiSidebarNav } from "./index";

beforeAll(() => registerComponents(AiSidebarNav));

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface AiSidebarEl extends HTMLElement {
  workspace?: { name: string; subtitle?: string };
  sections?: Array<{
    label: string;
    items: Array<{ key: string; label: string; badge?: string | number }>;
  }>;
  activeKey?: string;
  focusSearch?: () => void;
  clearSearch?: () => void;
  getQuery?: () => string;
}

const createSidebar = async (overrides: Partial<AiSidebarEl> = {}): Promise<AiSidebarEl> => {
  const el = document.createElement("elf-ai-sidebar-nav") as AiSidebarEl;
  Object.assign(el, {
    workspace: { name: "Creamery Ops", subtitle: "Production Workspace" },
    sections: [
      {
        label: "Workspace",
        items: [
          { key: "home", label: "Home" },
          { key: "tasks", label: "Agent tasks", badge: 4 },
        ],
      },
      { label: "Objects", items: [{ key: "suppliers", label: "Suppliers" }] },
    ],
    activeKey: "home",
    ...overrides,
  });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-ai-sidebar-nav", () => {
  it("renders workspace, sections, and badges", async () => {
    const el = await createSidebar();
    const root = el.shadowRoot!;
    expect(root.textContent).toContain("Creamery Ops");
    expect(root.querySelectorAll(".item")).toHaveLength(3);
    expect(root.textContent).toContain("4");
  });

  it("marks the active item", async () => {
    const el = await createSidebar();
    expect(
      el.shadowRoot!.querySelectorAll<HTMLElement>(".item")[0]?.classList.contains("active"),
    ).toBe(true);
  });

  it("filters items by search and hides empty sections", async () => {
    const el = await createSidebar();
    const input = el.shadowRoot!.querySelector<HTMLInputElement>(".input")!;
    input.value = "suppliers";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".item")).toHaveLength(1);
    expect(el.getQuery!()).toBe("suppliers");
  });

  it("emits select and new-task", async () => {
    const el = await createSidebar();
    const onSelect = vi.fn();
    const onNewTask = vi.fn();
    el.addEventListener("select", onSelect as EventListener);
    el.addEventListener("new-task", onNewTask as EventListener);
    el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".item")[1]!.click();
    el.shadowRoot!.querySelector<HTMLButtonElement>(".new-task")!.click();
    expect(onSelect.mock.calls[0][0].detail).toMatchObject({ key: "tasks", label: "Agent tasks" });
    expect(onNewTask).toHaveBeenCalledTimes(1);
  });
});
