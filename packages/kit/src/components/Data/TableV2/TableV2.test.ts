import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../register-all").then(({ registerAllComponents }) =>
    registerAllComponents(),
  );
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface TableV2El extends HTMLElement {
  data?: Array<Record<string, unknown>>;
  fixedData?: Array<Record<string, unknown>>;
  columns?: Array<Record<string, unknown>>;
  height?: number;
  rowHeight?: number | ((row: Record<string, unknown>, rowIndex: number) => number);
  footerHeight?: number;
  loading?: boolean;
  overscan?: number;
  expandColumnKey?: string;
  expandedRowKeys?: string[];
  defaultExpandedRowKeys?: string[];
  scrollToRow?: (row: number, strategy?: "auto" | "start" | "center" | "end") => void;
}

const rows = Array.from({ length: 2000 }, (_, index) => ({
  id: index + 1,
  task: `Task ${index + 1}`,
  duration: 20 + (index % 70),
}));

describe("elf-table-v2", () => {
  it("reuses the Table virtual window and fixed columns for large data", async () => {
    const el = document.createElement("elf-table-v2") as TableV2El;
    el.data = rows;
    el.columns = [
      { key: "id", title: "ID", width: 80, fixed: "left" },
      { key: "task", title: "Task", width: 300 },
      { key: "duration", title: "Duration", width: 120, fixed: "right", sortable: true },
    ];
    el.height = 320;
    el.rowHeight = 40;
    el.overscan = 4;
    document.body.appendChild(el);
    await tick();
    await tick();
    await tick();

    const table = el.shadowRoot!.querySelector("elf-table")!;
    expect((table as HTMLElement & { virtualThreshold: number }).virtualThreshold).toBe(0);
    expect(table.shadowRoot!.querySelectorAll("tbody tr").length).toBeLessThan(30);
    expect(table.shadowRoot!.querySelector("th.is-fixed-left")).toBeTruthy();
    expect(table.shadowRoot!.querySelector("th.is-fixed-right")).toBeTruthy();
  });

  it("forwards sort state and reports the rendered row window", async () => {
    const el = document.createElement("elf-table-v2") as TableV2El;
    el.data = rows;
    el.columns = [
      { key: "task", title: "Task", width: 240 },
      { key: "duration", title: "Duration", width: 120, sortable: true },
    ];
    const onSort = vi.fn();
    const onRows = vi.fn();
    el.addEventListener("column-sort", onSort as EventListener);
    el.addEventListener("rows-rendered", onRows as EventListener);
    document.body.appendChild(el);
    await tick();
    await tick();
    await tick();

    const table = el.shadowRoot!.querySelector("elf-table")!;
    (table.shadowRoot!.querySelector(".sort-button") as HTMLButtonElement).click();
    await tick();
    expect((onSort.mock.calls.at(-1)![0] as CustomEvent).detail).toEqual({
      key: "duration",
      order: "ascending",
    });
    expect((onRows.mock.calls[0]![0] as CustomEvent).detail.rowVisibleStart).toBe(0);
  });

  it("scrollToRow delegates to the shared Table viewport", async () => {
    const el = document.createElement("elf-table-v2") as TableV2El;
    el.data = rows;
    el.columns = [{ key: "task", title: "Task", width: 300 }];
    el.height = 300;
    el.rowHeight = 40;
    document.body.appendChild(el);
    await tick();
    await tick();

    el.scrollToRow?.(120, "start");
    await tick();
    const table = el.shadowRoot!.querySelector("elf-table")!;
    expect((table.shadowRoot!.querySelector(".table-wrap") as HTMLElement).scrollTop).toBe(4800);
  });

  it("supports pinned data, variable row heights, and overlay/footer slots", async () => {
    const el = document.createElement("elf-table-v2") as TableV2El;
    el.fixedData = [{ id: "summary", task: "Pinned summary", duration: 42 }];
    el.data = rows.slice(0, 300);
    el.columns = [
      { key: "task", title: "Task", width: 260 },
      { key: "duration", title: "Duration", width: 120 },
    ];
    el.height = 360;
    el.rowHeight = (_row, index) => (index % 3 === 0 ? 64 : 40);
    el.footerHeight = 48;
    el.loading = true;
    const overlay = document.createElement("span");
    overlay.slot = "overlay";
    overlay.textContent = "Refreshing metrics";
    const footer = document.createElement("span");
    footer.slot = "footer";
    footer.textContent = "300 records";
    el.append(overlay, footer);
    document.body.appendChild(el);
    await tick();
    await tick();
    await tick();

    const fixed = el.shadowRoot!.querySelector("elf-table[data-fixed-table]")!;
    const body = el.shadowRoot!.querySelector("elf-table[data-scroll-table]")!;
    const root = el.shadowRoot!.querySelector(".table-v2")!;
    expect(root.classList.contains("has-fixed-data")).toBe(true);
    expect(root.classList.contains("has-footer")).toBe(true);
    expect(fixed.shadowRoot!.querySelector("thead")).toBeTruthy();
    expect(fixed.shadowRoot!.querySelector("tbody")?.textContent).toContain("Pinned summary");
    expect(fixed.shadowRoot!.querySelector("tbody tr")?.getAttribute("style")).toContain("64px");
    expect(body.shadowRoot!.querySelector("thead")).toBeNull();
    expect(body.shadowRoot!.querySelectorAll("tbody tr").length).toBeLessThan(30);
    expect(body.shadowRoot!.querySelector("tbody tr")?.getAttribute("style")).toContain("64px");
    const bodyScroll = body.shadowRoot!.querySelector<HTMLElement>(".table-wrap")!;
    bodyScroll.scrollTop = 180;
    bodyScroll.dispatchEvent(new Event("scroll"));
    await tick();
    expect(fixed.shadowRoot!.querySelector("thead")).toBeTruthy();
    expect(body.shadowRoot!.querySelector("thead")).toBeNull();
    expect(
      body.shadowRoot!.querySelector(".table-root")?.classList.contains("is-sticky-header"),
    ).toBe(true);
    const overlaySlot = el.shadowRoot!.querySelector<HTMLSlotElement>(
      '.overlay slot[name="overlay"]',
    )!;
    const footerSlot = el.shadowRoot!.querySelector<HTMLSlotElement>(
      '.footer slot[name="footer"]',
    )!;
    expect(overlaySlot.assignedElements()[0]?.textContent).toContain("Refreshing metrics");
    expect(footerSlot.assignedElements()[0]?.textContent).toContain("300 records");
  });

  it("synchronizes resized columns between pinned and virtual tables", async () => {
    const el = document.createElement("elf-table-v2") as TableV2El;
    el.fixedData = [{ id: "summary", task: "Pinned summary", owner: "Platform" }];
    el.data = Array.from({ length: 200 }, (_, index) => ({
      id: index + 1,
      task: `Task ${index + 1}`,
      owner: "ElfUI",
    }));
    el.columns = [
      { key: "task", title: "Task", width: 260 },
      { key: "owner", title: "Owner", width: 120 },
    ];
    el.height = 320;
    el.border = true;
    document.body.appendChild(el);
    await tick();
    await tick();
    await tick();

    const fixed = el.shadowRoot!.querySelector("elf-table[data-fixed-table]")!;
    const handle = fixed.shadowRoot!.querySelector<HTMLElement>(".column-resizer")!;
    handle.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "ArrowRight",
        shiftKey: true,
        bubbles: true,
      }),
    );
    await tick();
    await tick();

    const body = el.shadowRoot!.querySelector("elf-table[data-scroll-table]")!;
    expect(fixed.shadowRoot!.querySelector<HTMLTableCellElement>("thead th")!.style.width).toBe(
      "284px",
    );
    expect(body.shadowRoot!.querySelector<HTMLTableCellElement>("tbody tr td")!.style.width).toBe(
      "284px",
    );
  });

  it("supports uncontrolled virtual tree expansion with keyboard and ARIA", async () => {
    const el = document.createElement("elf-table-v2") as TableV2El;
    el.data = [
      {
        id: "platform",
        task: "Platform",
        children: [
          { id: "runtime", task: "Runtime" },
          { id: "compiler", task: "Compiler" },
        ],
      },
      { id: "docs", task: "Docs" },
    ];
    el.columns = [{ key: "task", title: "Task", width: 320 }];
    el.expandColumnKey = "task";
    const onExpanded = vi.fn();
    const onRowExpand = vi.fn();
    el.addEventListener("expanded-rows-change", onExpanded as EventListener);
    el.addEventListener("row-expand", onRowExpand as EventListener);
    document.body.appendChild(el);
    await tick();
    await tick();
    await tick();

    const table = el.shadowRoot!.querySelector("elf-table")!;
    expect(table.shadowRoot!.querySelectorAll("tbody tr")).toHaveLength(2);
    const toggle = table.shadowRoot!.querySelector<HTMLButtonElement>(
      '[part~="table-v2-expand-toggle"]',
    )!;
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    toggle.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await tick();
    await tick();

    expect(table.shadowRoot!.querySelectorAll("tbody tr")).toHaveLength(4);
    expect((onExpanded.mock.calls[0]![0] as CustomEvent).detail).toEqual(["platform"]);
    expect((onRowExpand.mock.calls[0]![0] as CustomEvent).detail).toEqual([el.data![0], true]);
    expect(
      table
        .shadowRoot!.querySelector<HTMLButtonElement>('[part~="table-v2-expand-toggle"]')!
        .getAttribute("aria-expanded"),
    ).toBe("true");
  });

  it("keeps controlled expansion parent-owned", async () => {
    const el = document.createElement("elf-table-v2") as TableV2El;
    el.data = [{ id: "root", task: "Root", children: [{ id: "leaf", task: "Leaf" }] }];
    el.columns = [{ key: "task", title: "Task" }];
    el.expandColumnKey = "task";
    el.expandedRowKeys = [];
    const onExpanded = vi.fn();
    el.addEventListener("expanded-rows-change", onExpanded as EventListener);
    document.body.appendChild(el);
    await tick();
    await tick();
    await tick();

    const table = el.shadowRoot!.querySelector("elf-table")!;
    table.shadowRoot!.querySelector<HTMLButtonElement>('[part~="table-v2-expand-toggle"]')!.click();
    await tick();
    expect((onExpanded.mock.calls[0]![0] as CustomEvent).detail).toEqual(["root"]);
    expect(table.shadowRoot!.querySelectorAll("tbody tr")).toHaveLength(1);

    el.expandedRowKeys = ["root"];
    await tick();
    await tick();
    expect(table.shadowRoot!.querySelectorAll("tbody tr")).toHaveLength(2);
  });
});
