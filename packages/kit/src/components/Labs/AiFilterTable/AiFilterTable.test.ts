import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { AiFilterTable } from "./index";

beforeAll(() => registerComponents(AiFilterTable));

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface AiFilterEl extends HTMLElement {
  columns?: Array<{ key: string; label: string }>;
  rows?: Array<{ id?: string | number; cells: Record<string, unknown> }>;
  filters?: Array<{ key: string; label: string; value?: string }>;
  defaultFilter?: string;
  matchKey?: string;
  setFilter?: (key: string) => void;
  clearFilter?: () => void;
  getFilter?: () => string;
}

const createTable = async (overrides: Partial<AiFilterEl> = {}): Promise<AiFilterEl> => {
  const el = document.createElement("elf-ai-filter-table") as AiFilterEl;
  Object.assign(el, {
    columns: [
      { key: "task", label: "Task name" },
      { key: "status", label: "Status" },
    ],
    rows: [
      { id: 1, cells: { task: "Restock mango sorbet", status: "To do" } },
      { id: 2, cells: { task: "Churn black sesame", status: "In Progress" } },
      { id: 3, cells: { task: "Order waffle cones", status: "Completed" } },
    ],
    filters: [
      { key: "all", label: "All" },
      { key: "todo", label: "To do", value: "To do" },
      { key: "progress", label: "In Progress", value: "In Progress" },
      { key: "done", label: "Completed", value: "Completed" },
    ],
    matchKey: "status",
    ...overrides,
  });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-ai-filter-table", () => {
  it("renders all rows and chip counts", async () => {
    const el = await createTable();
    const root = el.shadowRoot!;
    expect(root.querySelectorAll("tbody tr")).toHaveLength(3);
    expect(root.querySelectorAll(".count")[1]?.textContent).toBe("1");
  });

  it("filters rows by chip and emits filter-change", async () => {
    const el = await createTable();
    const onChange = vi.fn();
    el.addEventListener("filter-change", onChange as EventListener);
    el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".chip")[2]!.click();
    await tick();
    expect(el.shadowRoot!.querySelectorAll("tbody tr")).toHaveLength(1);
    expect(el.shadowRoot!.textContent).toContain("Churn black sesame");
    expect(onChange.mock.calls[0][0].detail).toBe("In Progress");
  });

  it("exposes filter helpers", async () => {
    const el = await createTable();
    el.setFilter!("Completed");
    await tick();
    expect(el.getFilter!()).toBe("Completed");
    expect(el.shadowRoot!.querySelectorAll("tbody tr")).toHaveLength(1);
    el.clearFilter!();
    expect(el.getFilter!()).toBe("");
  });
});
