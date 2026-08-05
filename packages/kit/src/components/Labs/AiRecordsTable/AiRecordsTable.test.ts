import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { AiRecordsTable } from "./index";

beforeAll(() => registerComponents(AiRecordsTable));

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface AiRecordsEl extends HTMLElement {
  columns?: Array<{ key: string; label: string; sortable?: boolean }>;
  rows?: Array<{
    id?: string | number;
    cells: Record<string, unknown>;
    tags?: string[];
    href?: string;
  }>;
  selectable?: boolean;
  sortBy?: string;
  sortOrder?: string;
  getSelectedIds?: () => (string | number)[];
  clearSelection?: () => void;
  toggleRow?: (id: string | number) => void;
}

const createTable = async (overrides: Partial<AiRecordsEl> = {}): Promise<AiRecordsEl> => {
  const el = document.createElement("elf-ai-records-table") as AiRecordsEl;
  Object.assign(el, {
    columns: [
      { key: "company", label: "Company", sortable: true },
      { key: "category", label: "Categories" },
    ],
    rows: [
      {
        id: 1,
        cells: { company: "Aurora Scoops — Reykjavík", category: "Gelato" },
        tags: ["Gelato", "Seasonal"],
      },
      { id: 2, cells: { company: "Blue Fig — Florence", category: "Gelato" } },
    ],
    ...overrides,
  });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-ai-records-table", () => {
  it("renders rows, tags, and avatars", async () => {
    const el = await createTable();
    const root = el.shadowRoot!;
    expect(root.querySelectorAll("tbody tr")).toHaveLength(2);
    expect(root.textContent).toContain("Aurora Scoops — Reykjavík");
    expect(root.textContent).toContain("Gelato");
  });

  it("emits sort-change on sortable headers", async () => {
    const el = await createTable();
    const onSort = vi.fn();
    el.addEventListener("sort-change", onSort as EventListener);
    el.shadowRoot!.querySelectorAll<HTMLTableHeaderCellElement>("th")[1]!.click();
    expect(onSort).toHaveBeenCalledTimes(1);
    expect(onSort.mock.calls[0][0].detail).toEqual({ key: "company", order: "asc" });
    el.shadowRoot!.querySelectorAll<HTMLTableHeaderCellElement>("th")[1]!.click();
    expect(onSort.mock.calls[1][0].detail).toEqual({ key: "company", order: "desc" });
  });

  it("tracks selection and exposes helpers", async () => {
    const el = await createTable();
    const onSelection = vi.fn();
    el.addEventListener("selection-change", onSelection as EventListener);
    el.shadowRoot!.querySelectorAll<HTMLInputElement>(".checkbox input")[1]!.click();
    expect(el.getSelectedIds!()).toEqual([1]);
    el.clearSelection!();
    expect(el.getSelectedIds!()).toEqual([]);
    expect(onSelection).toHaveBeenCalled();
  });

  it("emits row-click with the row", async () => {
    const el = await createTable();
    const onClick = vi.fn();
    el.addEventListener("row-click", onClick as EventListener);
    el.shadowRoot!.querySelectorAll<HTMLTableRowElement>("tbody tr")[0]!.click();
    expect(onClick.mock.calls[0][0].detail.id).toBe(1);
  });
});
