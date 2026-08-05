import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { AiDiffTable } from "./index";

beforeAll(() => registerComponents(AiDiffTable));

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface AiDiffEl extends HTMLElement {
  title?: string;
  columns?: Array<{ key: string; label: string }>;
  rows?: Array<{
    id?: string | number;
    cells: Record<string, { value: string; status?: string; original?: string }>;
  }>;
}

const createTable = async (overrides: Partial<AiDiffEl> = {}): Promise<AiDiffEl> => {
  const el = document.createElement("elf-ai-diff-table") as AiDiffEl;
  Object.assign(el, {
    title: "Proposed menu cleanup",
    columns: [
      { key: "flavor", label: "Flavor" },
      { key: "category", label: "Category" },
    ],
    rows: [
      {
        id: 1,
        cells: {
          flavor: { value: "Rocky Road", status: "same" },
          category: { value: "Classic", status: "same" },
        },
      },
      {
        id: 2,
        cells: {
          flavor: { value: "Pistachio", status: "change", original: "Mint Chip" },
          category: { value: "Seasonal", status: "add" },
        },
      },
    ],
    ...overrides,
  });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-ai-diff-table", () => {
  it("renders headers and diff cell treatments", async () => {
    const el = await createTable();
    const root = el.shadowRoot!;
    expect(root.textContent).toContain("Proposed menu cleanup");
    expect(root.querySelectorAll("th")).toHaveLength(2);
    expect(root.querySelectorAll(".cell.is-change")).toHaveLength(1);
    expect(root.querySelectorAll(".cell.is-add")).toHaveLength(1);
    expect(root.textContent).toContain("Mint Chip");
  });

  it("emits row-click with the row", async () => {
    const el = await createTable();
    const onClick = vi.fn();
    el.addEventListener("row-click", onClick as EventListener);
    el.shadowRoot!.querySelectorAll<HTMLTableRowElement>("tbody tr")[1]!.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0].detail.id).toBe(2);
  });

  it("shows the empty flag without rows", async () => {
    const el = await createTable({ rows: [] });
    expect(el.hasAttribute("data-empty")).toBe(true);
  });
});
