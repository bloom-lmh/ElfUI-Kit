import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface TableEl extends HTMLElement {
  data?: unknown[];
  columns?: unknown[];
  title?: string;
  titleVariant?: "default" | "primary" | "muted";
  rowKey?: string;
  stripe?: boolean;
  border?: boolean;
  stickyHeader?: boolean;
  highlightCurrentRow?: boolean;
  defaultSelectedKeys?: string[];
  defaultExpandedRowKeys?: string[];
  defaultExpandAll?: boolean;
  treeProps?: { children?: string; hasChildren?: string; checkStrictly?: boolean };
  indent?: number;
  lazy?: boolean;
  load?: (
    row: Record<string, unknown>,
    treeNode: { key: string; level: number; expanded: boolean; loading: boolean },
    resolve: (children: Record<string, unknown>[]) => void
  ) => void | Record<string, unknown>[] | Promise<void | Record<string, unknown>[]>;
  defaultSort?: { prop: string; order?: "ascending" | "descending" };
  sortProp?: string;
  sortOrder?: "" | "ascending" | "descending";
  rowClassName?: string | ((context: { row: Record<string, unknown>; rowIndex: number }) => string);
  rowStyle?: (context: { row: Record<string, unknown>; rowIndex: number }) => Record<string, string>;
  cellClassName?: (context: {
    row: Record<string, unknown>;
    column: Record<string, unknown>;
    rowIndex: number;
    columnIndex: number;
  }) => string;
  headerCellStyle?: (context: {
    column: Record<string, unknown>;
    columnIndex: number;
  }) => Record<string, string>;
  showSummary?: boolean;
  spanMethod?: (context: {
    row: Record<string, unknown>;
    column: Record<string, unknown>;
    rowIndex: number;
    columnIndex: number;
  }) => [number, number] | { rowspan: number; colspan: number } | undefined;
  showOverflowTooltip?: boolean;
  virtual?: boolean;
  virtualThreshold?: number;
  height?: string | number;
  rowHeight?: number;
  overscan?: number;
  tooltipOptions?: {
    placement?: string;
    offset?: number;
    showAfter?: number;
    hideAfter?: number;
    maxWidth?: string | number;
  };
  selectOnIndeterminate?: boolean;
  expandFormatter?: (row: Record<string, unknown>, index: number) => unknown;
  setScrollTop(value: number): void;
  setScrollLeft(value: number): void;
  scrollTableTo(x: number, y?: number): void;
  sort(prop: string, order?: "" | "ascending" | "descending"): void;
  toggleAllSelection(): void;
  getSelectionRows(): Record<string, unknown>[];
  clearFilter(columnKeys?: string | string[]): void;
  toggleRowExpansion(rowOrKey: Record<string, unknown> | string | number, expanded?: boolean): void;
  updateKeyChildren(key: string | number, children: Record<string, unknown>[]): void;
}

const rows = [
  { id: "1", name: "Alice", role: "Admin", score: 96 },
  { id: "2", name: "Bob", role: "Editor", score: 82 },
  { id: "3", name: "Carol", role: "Viewer", score: 90 }
];

const columns = [
  { type: "selection", width: 48 },
  { type: "index", label: "#", width: 56 },
  { prop: "name", label: "姓名" },
  { prop: "role", label: "角色" },
  { prop: "score", label: "分数", sortable: true, align: "right" }
];

const mount = async (setup?: (el: TableEl) => void): Promise<TableEl> => {
  const el = document.createElement("elf-table") as TableEl;
  el.data = rows;
  el.columns = columns;
  setup?.(el);
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-table", () => {
  it("渲染表头和数据行", async () => {
    const el = await mount();

    expect(el.shadowRoot!.textContent).toContain("姓名");
    expect(el.shadowRoot!.textContent).toContain("Alice");
    expect(el.shadowRoot!.querySelectorAll("tbody tr")).toHaveLength(3);
  });

  it("支持 stripe 和 border 样式", async () => {
    const el = await mount((table) => {
      table.stripe = true;
      table.border = true;
    });

    const root = el.shadowRoot!.querySelector(".table-root")!;
    expect(root.classList.contains("is-stripe")).toBe(true);
    expect(root.classList.contains("is-border")).toBe(true);
  });

  it("renders the optional title surface and variant", async () => {
    const el = await mount((table) => {
      table.title = "Component API";
      table.titleVariant = "primary";
    });

    const root = el.shadowRoot!.querySelector(".table-root")!;
    expect(root.classList.contains("has-title")).toBe(true);
    expect(root.classList.contains("title-primary")).toBe(true);
    expect(el.shadowRoot!.querySelector('[part="title"]')?.textContent).toBe("Component API");
    expect(el.shadowRoot!.querySelector("table")?.getAttribute("aria-label")).toBe("Component API");
  });

  it("点击排序列触发 sort-change 并重排行", async () => {
    const el = await mount();
    const onSort = vi.fn();
    el.addEventListener("sort-change", onSort as EventListener);

    const sortButton = el.shadowRoot!.querySelector(".sort-button") as HTMLButtonElement;
    sortButton.click();
    await tick();

    expect(onSort).toHaveBeenCalled();
    expect((onSort.mock.calls[0]![0] as CustomEvent).detail).toEqual({
      column: expect.objectContaining({ prop: "score" }),
      prop: "score",
      order: "ascending"
    });
    expect(el.shadowRoot!.querySelector("tbody tr")?.textContent).toContain("Bob");
  });

  it("支持行选择和 selection-change", async () => {
    const el = await mount();
    const onSelection = vi.fn();
    el.addEventListener("selection-change", onSelection as EventListener);

    const checkbox = el.shadowRoot!.querySelector("tbody .table-checkbox") as HTMLButtonElement;
    checkbox.click();
    await tick();

    expect(onSelection).toHaveBeenCalled();
    expect((onSelection.mock.calls[0]![0] as CustomEvent).detail[0].id).toBe("1");
  });

  it("快速连续选择会同步反馈 DOM，并在合并提交后保持最终状态", async () => {
    const el = await mount((table) => {
      table.data = Array.from({ length: 24 }, (_, index) => ({ id: String(index), name: `Row ${index}` }));
      table.columns = [{ type: "selection", width: 48 }, { prop: "name", label: "Name" }];
    });
    const checkbox = el.shadowRoot!.querySelector<HTMLButtonElement>("tbody .table-checkbox")!;

    for (let index = 0; index < 10; index += 1) {
      checkbox.click();
      expect(checkbox.getAttribute("aria-checked")).toBe(index % 2 === 0 ? "true" : "false");
    }
    expect(el.getSelectionRows()).toEqual([]);

    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => setTimeout(resolve, 0));
    await tick();
    expect(el.getSelectionRows()).toEqual([]);
    expect(el.shadowRoot!.querySelector("tbody tr")?.classList.contains("is-selected")).toBe(false);
  });

  it("默认选中 key 可回显", async () => {
    const el = await mount((table) => {
      table.defaultSelectedKeys = ["2"];
    });

    expect(el.shadowRoot!.querySelector("tbody tr.is-selected")?.textContent).toContain("Bob");
  });

  it("点击行触发 current-change 和 row-click", async () => {
    const el = await mount((table) => {
      table.highlightCurrentRow = true;
    });
    const onCurrent = vi.fn();
    const onRow = vi.fn();
    el.addEventListener("current-change", onCurrent as EventListener);
    el.addEventListener("row-click", onRow as EventListener);

    const secondRow = el.shadowRoot!.querySelectorAll("tbody tr")[1] as HTMLTableRowElement;
    secondRow.click();
    await tick();

    expect(onCurrent).toHaveBeenCalled();
    expect(onRow).toHaveBeenCalled();
    expect(secondRow.classList.contains("is-current")).toBe(true);
  });

  it("无数据时显示空状态", async () => {
    const el = await mount((table) => {
      table.data = [];
    });

    expect(el.shadowRoot!.querySelector(".empty")?.textContent).toContain("暂无数据");
  });

  it("支持操作列并触发 action-click 与 onClick", async () => {
    const onAction = vi.fn();
    const onClick = vi.fn();
    const el = await mount((table) => {
      table.columns = [
        { prop: "name", label: "姓名" },
        {
          type: "actions",
          label: "操作",
          actions: [{ label: "编辑", type: "primary", onClick }]
        }
      ];
    });
    el.addEventListener("action-click", onAction as EventListener);

    const edit = el.shadowRoot!.querySelector(".action-button") as HTMLButtonElement;
    edit.click();
    await tick();

    expect(onClick).toHaveBeenCalledWith(rows[0], 0, expect.objectContaining({ label: "编辑" }));
    expect(onAction).toHaveBeenCalled();
    expect((onAction.mock.calls[0]![0] as CustomEvent).detail[1].name).toBe("Alice");
  });

  it("支持单元格样式函数", async () => {
    const el = await mount((table) => {
      table.columns = [
        { prop: "name", label: "姓名" },
        {
          prop: "score",
          label: "分数",
          cellStyle: (row: Record<string, unknown>) => ({
            color: Number(row.score) > 90 ? "rgb(46, 125, 50)" : "rgb(211, 47, 47)"
          })
        }
      ];
    });

    const scoreCell =
      el.shadowRoot!.querySelectorAll<HTMLTableCellElement>("tbody tr:first-child td")[1]!;
    expect(scoreCell.style.color).toBe("rgb(46, 125, 50)");
  });

  it("支持展开行详情", async () => {
    const el = await mount((table) => {
      table.columns = [
        { type: "expand", width: 48 },
        { prop: "name", label: "姓名" }
      ];
      table.expandFormatter = (row) => `详情：${row.name}`;
    });
    const onExpand = vi.fn();
    el.addEventListener("expand-change", onExpand as EventListener);

    const toggle = el.shadowRoot!.querySelector(".expand-toggle") as HTMLButtonElement;
    toggle.click();
    await tick();

    expect(onExpand).toHaveBeenCalled();
    expect(el.shadowRoot!.querySelector(".expand-row")?.textContent).toContain("详情：Alice");
    expect(toggle.classList.contains("is-expanded")).toBe(true);
  });

  it("支持固定列和 sticky 表头", async () => {
    const el = await mount((table) => {
      table.columns = [
        { prop: "name", label: "姓名", width: 120, fixed: "left" },
        { prop: "role", label: "角色", width: 120 },
        { prop: "score", label: "分数", width: 100, fixed: "right" }
      ];
    });

    const root = el.shadowRoot!.querySelector(".table-root")!;
    const fixedLeft = el.shadowRoot!.querySelector("th.is-fixed-left") as HTMLElement;
    const fixedRight = el.shadowRoot!.querySelector("th.is-fixed-right") as HTMLElement;

    expect(root.classList.contains("is-sticky-header")).toBe(true);
    expect(fixedLeft.style.left).toBe("0px");
    expect(fixedRight.style.right).toBe("0px");
    expect(el.shadowRoot!.querySelector("td.is-fixed-left")).toBeTruthy();
  });

  it("固定列同步显式列宽，避免横向滚动时宽度抖动", async () => {
    const el = await mount((table) => {
      table.columns = [
        { type: "selection", width: 48, fixed: "left" },
        { type: "index", label: "编号", width: 56, fixed: "left" },
        { prop: "name", label: "姓名", width: 180 },
        { prop: "role", label: "角色", width: 160 },
        { prop: "score", label: "分数", width: 120, fixed: "right" }
      ];
    });

    const table = el.shadowRoot!.querySelector("table") as HTMLTableElement;
    const indexHeader = el.shadowRoot!.querySelector("th.is-index") as HTMLElement;
    const indexCell = el.shadowRoot!.querySelector("td.is-index") as HTMLElement;

    expect(table.style.minWidth).toBe("564px");
    expect(indexHeader.style.left).toBe("48px");
    expect(indexHeader.style.width).toBe("56px");
    expect(indexHeader.style.minWidth).toBe("56px");
    expect(indexHeader.style.maxWidth).toBe("56px");
    expect(indexCell.style.width).toBe("56px");
    expect(indexCell.style.minWidth).toBe("56px");
    expect(indexCell.style.maxWidth).toBe("56px");
  });

  it("使用 Element Plus 风格上下文设置行、单元格与表头样式", async () => {
    const rowStyle = vi.fn(({ rowIndex }) => ({
      backgroundColor: rowIndex === 1 ? "rgb(255, 248, 225)" : ""
    }));
    const cellClassName = vi.fn(({ columnIndex }) => (columnIndex === 2 ? "name-cell" : ""));
    const el = await mount((table) => {
      table.rowClassName = ({ row }) => (row.role === "Admin" ? "admin-row" : "");
      table.rowStyle = rowStyle;
      table.cellClassName = cellClassName;
      table.headerCellStyle = ({ columnIndex }) => ({
        color: columnIndex === 2 ? "rgb(25, 118, 210)" : ""
      });
    });

    const bodyRows = el.shadowRoot!.querySelectorAll<HTMLTableRowElement>("tbody tr");
    const nameHeader = el.shadowRoot!.querySelectorAll<HTMLTableCellElement>("thead th")[2]!;
    const nameCell = bodyRows[0]!.querySelectorAll<HTMLTableCellElement>("td")[2]!;

    expect(bodyRows[0]!.classList.contains("admin-row")).toBe(true);
    expect(bodyRows[1]!.style.backgroundColor).toBe("rgb(255, 248, 225)");
    expect(nameCell.classList.contains("name-cell")).toBe(true);
    expect(nameHeader.style.color).toBe("rgb(25, 118, 210)");
    expect(rowStyle).toHaveBeenCalledWith(expect.objectContaining({ row: rows[0], rowIndex: 0 }));
    expect(cellClassName).toHaveBeenCalledWith(
      expect.objectContaining({ row: rows[0], column: columns[2], columnIndex: 2 })
    );
  });

  it("补齐表头、单元格与行级鼠标事件参数", async () => {
    const el = await mount();
    const onHeader = vi.fn();
    const onCell = vi.fn();
    const onDblClick = vi.fn();
    el.addEventListener("header-click", onHeader as EventListener);
    el.addEventListener("cell-click", onCell as EventListener);
    el.addEventListener("row-dblclick", onDblClick as EventListener);

    const header = el.shadowRoot!.querySelectorAll<HTMLTableCellElement>("thead th")[2]!;
    const cell = el.shadowRoot!.querySelectorAll<HTMLTableCellElement>("tbody td")[2]!;
    header.click();
    cell.click();
    cell.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    await tick();

    expect((onHeader.mock.calls[0]![0] as CustomEvent).detail[0]).toEqual(columns[2]);
    expect((onCell.mock.calls[0]![0] as CustomEvent).detail.slice(0, 2)).toEqual([
      rows[0],
      columns[2]
    ]);
    expect((onDblClick.mock.calls[0]![0] as CustomEvent).detail.slice(0, 2)).toEqual([
      rows[0],
      columns[2]
    ]);
  });

  it("遵守 selectable 与 select-on-indeterminate，并触发 select/select-all", async () => {
    const el = await mount((table) => {
      table.columns = [
        { type: "selection", selectable: (row: Record<string, unknown>) => row.role !== "Viewer" },
        { prop: "name", label: "姓名" }
      ];
      table.selectOnIndeterminate = false;
    });
    const onSelect = vi.fn();
    const onSelectAll = vi.fn();
    el.addEventListener("select", onSelect as EventListener);
    el.addEventListener("select-all", onSelectAll as EventListener);

    const checkboxes = el.shadowRoot!.querySelectorAll<HTMLButtonElement>("tbody .table-checkbox");
    expect(checkboxes[2]!.disabled).toBe(true);
    checkboxes[0]!.click();
    await tick();
    expect(onSelect).toHaveBeenCalled();
    expect(el.getSelectionRows()).toEqual([rows[0]]);

    el.shadowRoot!.querySelector<HTMLButtonElement>("thead .table-checkbox")!.click();
    await tick();
    expect(onSelectAll).toHaveBeenCalled();
    expect(el.getSelectionRows()).toEqual([]);
  });

  it("支持默认排序、默认展开、汇总行和溢出提示", async () => {
    const el = await mount((table) => {
      table.columns = [
        { type: "expand", width: 48 },
        { prop: "name", label: "姓名", width: 120 },
        { prop: "score", label: "分数", width: 100 }
      ];
      table.defaultSort = { prop: "score", order: "descending" };
      table.defaultExpandAll = true;
      table.showSummary = true;
      table.showOverflowTooltip = true;
    });

    expect(el.shadowRoot!.querySelector("tbody tr")?.textContent).toContain("Alice");
    expect(el.shadowRoot!.querySelectorAll(".expand-row")).toHaveLength(3);
    expect(el.shadowRoot!.querySelector("tfoot")?.textContent).toContain("268");
    expect(el.shadowRoot!.querySelectorAll<HTMLTableCellElement>("tfoot td")[1]!.textContent).toContain(
      "合计"
    );
    const tooltipCell = el.shadowRoot!.querySelectorAll<HTMLTableCellElement>("tbody td")[1]!;
    expect(tooltipCell.title).toBe("");
    expect(tooltipCell.tabIndex).toBe(0);
  });

  it("溢出提示使用可访问浮层并支持 tooltipFormatter", async () => {
    const formatter = vi.fn((row: Record<string, unknown>) => `${row.name} 的完整档案`);
    const el = await mount((table) => {
      table.columns = [{
        prop: "name",
        label: "姓名",
        width: 80,
        showOverflowTooltip: true,
        tooltipFormatter: formatter
      }];
      table.tooltipOptions = {
        placement: "bottom-start",
        offset: 4,
        showAfter: 0,
        hideAfter: 0,
        maxWidth: 240
      };
    });
    const cell = el.shadowRoot!.querySelector<HTMLTableCellElement>("tbody td")!;
    const content = cell.querySelector<HTMLElement>(".cell-text")!;
    Object.defineProperty(content, "clientWidth", { value: 80, configurable: true });
    Object.defineProperty(content, "scrollWidth", { value: 180, configurable: true });

    cell.dispatchEvent(new MouseEvent("mouseenter"));
    await tick();
    const tooltip = el.shadowRoot!.querySelector<HTMLElement>('[role="tooltip"]')!;
    expect(tooltip.textContent).toContain("Alice 的完整档案");
    expect(tooltip.dataset.placement).toBe("bottom-start");
    expect(tooltip.style.maxWidth).toBe("240px");
    expect(tooltip.getAttribute("popover")).toBe("manual");
    expect(cell.getAttribute("aria-describedby")).toBe(tooltip.id);
    expect(formatter).toHaveBeenCalledWith(rows[0], expect.objectContaining({ prop: "name" }), 0);

    cell.dispatchEvent(new MouseEvent("mouseleave"));
    await tick();
    expect(el.shadowRoot!.querySelector('[role="tooltip"]')).toBeNull();
  });

  it("溢出单元格可通过键盘聚焦查看提示并按 Escape 关闭", async () => {
    const el = await mount((table) => {
      table.columns = [{ prop: "name", label: "姓名", width: 80, showOverflowTooltip: true }];
      table.tooltipOptions = { showAfter: 0, hideAfter: 0 };
    });
    const cell = el.shadowRoot!.querySelector<HTMLTableCellElement>("tbody td")!;
    const content = cell.querySelector<HTMLElement>(".cell-text")!;
    Object.defineProperty(content, "clientWidth", { value: 60, configurable: true });
    Object.defineProperty(content, "scrollWidth", { value: 160, configurable: true });

    cell.focus();
    await tick();
    expect(el.shadowRoot!.querySelector('[role="tooltip"]')?.textContent).toContain("Alice");

    cell.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();
    expect(el.shadowRoot!.querySelector('[role="tooltip"]')).toBeNull();
    expect(document.activeElement).toBe(el);
    expect(el.shadowRoot!.activeElement).toBe(cell);
  });

  it("溢出提示在外部滚动时跟随锚点更新位置", async () => {
    const el = await mount((table) => {
      table.columns = [{ prop: "name", label: "姓名", width: 80, showOverflowTooltip: true }];
      table.tooltipOptions = { placement: "bottom-start", showAfter: 0, hideAfter: 0 };
    });
    const scrollParent = document.createElement("div");
    Object.defineProperties(scrollParent, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 300 }
    });
    scrollParent.style.overflowY = "auto";
    document.body.append(scrollParent);
    scrollParent.append(el);
    const cell = el.shadowRoot!.querySelector<HTMLTableCellElement>("tbody td")!;
    const content = cell.querySelector<HTMLElement>(".cell-text")!;
    Object.defineProperty(content, "clientWidth", { value: 60, configurable: true });
    Object.defineProperty(content, "scrollWidth", { value: 160, configurable: true });
    let anchorTop = 80;
    cell.getBoundingClientRect = vi.fn(() => ({
      left: 100,
      top: anchorTop,
      right: 180,
      bottom: anchorTop + 40,
      width: 80,
      height: 40,
      x: 100,
      y: anchorTop,
      toJSON: () => ({})
    })) as unknown as Element["getBoundingClientRect"];

    cell.dispatchEvent(new MouseEvent("mouseenter"));
    await tick();
    const tooltip = el.shadowRoot!.querySelector<HTMLElement>('[role="tooltip"]')!;
    const firstTop = tooltip.style.top;

    anchorTop = 180;
    scrollParent.dispatchEvent(new Event("scroll"));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    expect(tooltip.style.top).not.toBe(firstTop);
    scrollParent.remove();
  });

  it("支持 empty/append 插槽、scroll 事件与滚动公开方法", async () => {
    const el = document.createElement("elf-table") as TableEl;
    el.data = [];
    el.columns = [{ prop: "name", label: "姓名", width: 240 }];
    el.innerHTML = '<strong slot="empty">没有匹配结果</strong><span slot="append">加载更多</span>';
    const onScroll = vi.fn();
    el.addEventListener("scroll", onScroll as EventListener);
    document.body.appendChild(el);
    await tick();
    await tick();

    const wrap = el.shadowRoot!.querySelector<HTMLElement>(".table-wrap")!;
    Object.defineProperty(wrap, "scrollTop", { value: 0, configurable: true, writable: true });
    Object.defineProperty(wrap, "scrollLeft", { value: 0, configurable: true, writable: true });
    el.setScrollTop(40);
    el.setScrollLeft(18);
    expect(wrap.scrollTop).toBe(40);
    expect(wrap.scrollLeft).toBe(18);
    el.scrollTableTo(7, 12);
    expect(wrap.scrollLeft).toBe(7);
    expect(wrap.scrollTop).toBe(12);

    wrap.dispatchEvent(new Event("scroll"));
    await tick();
    expect((onScroll.mock.calls[0]![0] as CustomEvent).detail).toEqual({
      scrollLeft: 7,
      scrollTop: 12
    });
    expect(el.shadowRoot!.querySelector("slot[name='empty']")).toBeTruthy();
    expect(el.shadowRoot!.querySelector("slot[name='append']")).toBeTruthy();
  });

  it("虚拟滚动同步换窗、合并公开事件并保持渲染行数有界", async () => {
    const el = document.createElement("elf-table") as TableEl;
    el.data = Array.from({ length: 10_000 }, (_, index) => ({
      id: index + 1,
      name: `任务 #${String(index + 1).padStart(5, "0")}`
    }));
    el.columns = [{ prop: "name", label: "任务" }];
    el.virtual = true;
    el.virtualThreshold = 1;
    el.height = 396;
    el.rowHeight = 44;
    el.overscan = 6;
    const onScroll = vi.fn();
    el.addEventListener("scroll", onScroll as EventListener);
    document.body.appendChild(el);
    await tick();
    await tick();

    const wrap = el.shadowRoot!.querySelector<HTMLElement>(".table-wrap")!;
    Object.defineProperty(wrap, "scrollTop", { value: 0, configurable: true, writable: true });
    Object.defineProperty(wrap, "scrollLeft", { value: 0, configurable: true, writable: true });
    expect(el.shadowRoot!.textContent).toContain("任务 #00001");
    expect(el.shadowRoot!.querySelectorAll("tbody tr").length).toBeLessThanOrEqual(20);
    expect((el.shadowRoot!.querySelector("tbody") as HTMLElement).style.height).toBe("440000px");

    wrap.scrollTop = 120_000;
    wrap.dispatchEvent(new Event("scroll"));
    wrap.scrollTop = 240_000;
    wrap.dispatchEvent(new Event("scroll"));
    wrap.scrollTop = 439_604;
    wrap.dispatchEvent(new Event("scroll"));
    await tick();

    expect(onScroll).toHaveBeenCalledTimes(1);
    expect((onScroll.mock.calls[0]![0] as CustomEvent).detail.scrollTop).toBe(439_604);
    expect(el.shadowRoot!.textContent).toContain("任务 #10000");
    expect(el.shadowRoot!.querySelectorAll("tbody tr").length).toBeLessThanOrEqual(20);
    expect(el.shadowRoot!.querySelector("tbody tr[data-virtual-key]")).toBeTruthy();

    wrap.scrollTop = -160;
    wrap.dispatchEvent(new Event("scroll"));
    await tick();
    expect(el.shadowRoot!.textContent).toContain("任务 #00001");
    expect(el.shadowRoot!.textContent).not.toContain("任务 #10000");
    expect((el.shadowRoot!.querySelector("tbody") as HTMLElement).style.paddingBlockStart).toBe("0px");
  });

  it("快速虚拟路径在排序后立即重绘当前窗口", async () => {
    const el = document.createElement("elf-table") as TableEl;
    el.data = Array.from({ length: 300 }, (_, index) => ({ id: index + 1, score: index + 1 }));
    el.columns = [{ prop: "score", label: "分数", sortable: true }];
    el.virtual = true;
    el.virtualThreshold = 1;
    el.height = 240;
    el.rowHeight = 40;
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelector("tbody tr")?.textContent).toContain("1");
    el.sort("score", "descending");
    await tick();

    expect(el.shadowRoot!.querySelector("tbody tr")?.textContent).toContain("300");
  });

  it("span-method 支持数组和对象结果，并隐藏被合并单元格", async () => {
    const spanMethod = vi.fn(({ rowIndex, columnIndex }) => {
      if (columnIndex !== 1) return undefined;
      if (rowIndex === 0) return { rowspan: 2, colspan: 1 };
      if (rowIndex === 1) return [0, 0] as [number, number];
      return undefined;
    });
    const el = await mount((table) => {
      table.columns = [
        { prop: "name", label: "姓名" },
        { prop: "role", label: "角色" },
        { prop: "score", label: "分数" }
      ];
      table.spanMethod = spanMethod;
    });

    const bodyRows = el.shadowRoot!.querySelectorAll<HTMLTableRowElement>("tbody tr");
    const mergedCell = bodyRows[0]!.querySelectorAll<HTMLTableCellElement>("td")[1]!;
    expect(mergedCell.rowSpan).toBe(2);
    expect(mergedCell.textContent).toContain("Admin");
    expect(bodyRows[1]!.querySelectorAll("td")).toHaveLength(2);
    expect(bodyRows[1]!.textContent).not.toContain("Editor");
    expect(spanMethod).toHaveBeenCalledWith(
      expect.objectContaining({ row: rows[0], columnIndex: 1, rowIndex: 0 })
    );
  });

  it("default-sort 未指定 order 时默认升序，且不会被空受控属性重置", async () => {
    const el = await mount((table) => {
      table.columns = [
        { prop: "name", label: "姓名" },
        { prop: "score", label: "分数", sortable: true }
      ];
      table.defaultSort = { prop: "score" };
    });

    expect(el.shadowRoot!.querySelector("tbody tr")?.textContent).toContain("Bob");
    expect(el.shadowRoot!.querySelector("th[aria-sort='ascending']")?.textContent).toContain("分数");
  });

  it("受控 sort-prop/sort-order 可以更新并清除排序", async () => {
    const el = await mount();
    el.sortProp = "score";
    el.sortOrder = "ascending";
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector("tbody tr")?.textContent).toContain("Bob");

    el.sortProp = "";
    el.sortOrder = "";
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector("tbody tr")?.textContent).toContain("Alice");
  });

  it("sort-method 优先于 sort-by 执行本地自定义比较", async () => {
    const sortMethod = vi.fn(
      (left: Record<string, unknown>, right: Record<string, unknown>) =>
        Number(left.score) % 10 - (Number(right.score) % 10)
    );
    const sortBy = vi.fn(() => 0);
    const el = await mount((table) => {
      table.columns = [
        { prop: "name", label: "姓名" },
        { prop: "score", label: "分数", sortable: true, sortMethod, sortBy }
      ];
    });

    el.shadowRoot!.querySelector<HTMLButtonElement>(".sort-button")!.click();
    await tick();

    expect(el.shadowRoot!.querySelector("tbody tr")?.textContent).toContain("Carol");
    expect(sortMethod).toHaveBeenCalled();
    expect(sortBy).not.toHaveBeenCalled();
  });

  it("sort-by 数组按多个字段依次比较", async () => {
    const el = await mount((table) => {
      table.data = [
        { id: "1", team: "B", name: "Alice" },
        { id: "2", team: "A", name: "Carol" },
        { id: "3", team: "A", name: "Bob" }
      ];
      table.columns = [
        { prop: "name", label: "成员", sortable: true, sortBy: ["team", "name"] },
        { prop: "team", label: "团队" }
      ];
    });

    el.shadowRoot!.querySelector<HTMLButtonElement>(".sort-button")!.click();
    await tick();

    const bodyRows = el.shadowRoot!.querySelectorAll<HTMLTableRowElement>("tbody tr");
    expect(bodyRows[0]!.textContent).toContain("Bob");
    expect(bodyRows[1]!.textContent).toContain("Carol");
    expect(bodyRows[2]!.textContent).toContain("Alice");
  });

  it("sortable=custom 只更新排序状态并按 sort-orders 循环，不改动数据顺序", async () => {
    const el = await mount((table) => {
      table.columns = [
        {
          prop: "score",
          label: "分数",
          sortable: "custom",
          sortOrders: ["descending", null]
        },
        { prop: "name", label: "姓名" }
      ];
    });
    const onSort = vi.fn();
    el.addEventListener("sort-change", onSort as EventListener);
    const button = el.shadowRoot!.querySelector<HTMLButtonElement>(".sort-button")!;

    button.click();
    await tick();
    expect(el.shadowRoot!.querySelector("tbody tr")?.textContent).toContain("Alice");
    expect((onSort.mock.calls[0]![0] as CustomEvent).detail).toEqual(
      expect.objectContaining({ prop: "score", order: "descending" })
    );
    expect(button.closest("th")?.getAttribute("aria-sort")).toBe("descending");

    button.click();
    await tick();
    expect((onSort.mock.calls[1]![0] as CustomEvent).detail).toEqual(
      expect.objectContaining({ prop: "score", order: "" })
    );
    expect(button.closest("th")?.getAttribute("aria-sort")).toBe("none");
  });

  it("filtered-value 初始化筛选，并按同列任一条件匹配", async () => {
    const filterMethod = vi.fn(
      (value: unknown, row: Record<string, unknown>) => row.role === value
    );
    const el = await mount((table) => {
      table.columns = [
        { prop: "name", label: "姓名" },
        {
          prop: "role",
          columnKey: "role-key",
          label: "角色",
          filters: [
            { text: "管理员", value: "Admin" },
            { text: "访客", value: "Viewer" }
          ],
          filteredValue: ["Admin", "Viewer"],
          filterMethod
        }
      ];
    });

    const bodyRows = el.shadowRoot!.querySelectorAll<HTMLTableRowElement>("tbody tr");
    expect(bodyRows).toHaveLength(2);
    expect(bodyRows[0]!.textContent).toContain("Alice");
    expect(bodyRows[1]!.textContent).toContain("Carol");
    expect(filterMethod).toHaveBeenCalledWith(
      "Admin",
      rows[0],
      expect.objectContaining({ columnKey: "role-key" })
    );
    expect(el.shadowRoot!.querySelector(".filter-trigger")?.classList).toContain("is-active");

    el.shadowRoot!.querySelector<HTMLButtonElement>(".filter-trigger")!.click();
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".filter-option.is-selected")).toHaveLength(2);
  });

  it("多选筛选面板支持草稿确认、filter-change 与指定列 clearFilter", async () => {
    const el = await mount((table) => {
      table.columns = [
        { type: "selection", width: 48 },
        { prop: "name", label: "姓名" },
        {
          prop: "role",
          columnKey: "role-key",
          label: "角色",
          filters: [
            { text: "管理员", value: "Admin" },
            { text: "编辑", value: "Editor" }
          ],
          filterMethod: (value: unknown, row: Record<string, unknown>) => row.role === value
        }
      ];
    });
    const onFilter = vi.fn();
    el.addEventListener("filter-change", onFilter as EventListener);

    const checkboxes = el.shadowRoot!.querySelectorAll<HTMLButtonElement>("tbody .table-checkbox");
    checkboxes[1]!.click();
    await tick();
    el.shadowRoot!.querySelector<HTMLButtonElement>(".filter-trigger")!.click();
    await tick();
    await tick();
    const panel = el.shadowRoot!.querySelector<HTMLElement>(".filter-panel")!;
    expect(panel.getAttribute("popover")).toBe("manual");
    panel.querySelectorAll<HTMLButtonElement>(".filter-option")[0]!.click();
    panel.querySelector<HTMLButtonElement>(".filter-actions .is-primary")!.click();
    await tick();

    expect(el.shadowRoot!.querySelectorAll("tbody tr")).toHaveLength(1);
    expect(el.shadowRoot!.querySelector("tbody tr")?.textContent).toContain("Alice");
    expect((onFilter.mock.calls[0]![0] as CustomEvent).detail).toEqual({
      "role-key": ["Admin"]
    });
    expect(el.getSelectionRows()).toEqual([rows[1]]);

    el.clearFilter("role-key");
    await tick();
    expect(el.shadowRoot!.querySelectorAll("tbody tr")).toHaveLength(3);
    expect((onFilter.mock.calls[1]![0] as CustomEvent).detail).toEqual({
      "role-key": []
    });
  });

  it("单选筛选立即生效，Escape 关闭面板并把焦点还给触发器", async () => {
    const el = await mount((table) => {
      table.columns = [
        { prop: "name", label: "姓名" },
        {
          prop: "role",
          label: "角色",
          filterMultiple: false,
          filters: [
            { text: "管理员", value: "Admin" },
            { text: "编辑", value: "Editor" }
          ]
        }
      ];
    });
    const trigger = el.shadowRoot!.querySelector<HTMLButtonElement>(".filter-trigger")!;
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await tick();
    await tick();
    const panel = el.shadowRoot!.querySelector<HTMLElement>(".filter-panel")!;
    panel.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();
    expect(el.shadowRoot!.querySelector(".filter-panel")).toBeNull();
    expect(el.shadowRoot!.activeElement).toBe(trigger);

    trigger.click();
    await tick();
    await tick();
    el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".filter-option")[1]!.click();
    await tick();
    expect(el.shadowRoot!.querySelectorAll("tbody tr")).toHaveLength(1);
    expect(el.shadowRoot!.querySelector("tbody tr")?.textContent).toContain("Bob");
  });

  it("border 表格可拖动列宽，并触发 header-dragend 后重算固定列偏移", async () => {
    const el = await mount((table) => {
      table.border = true;
      table.columns = [
        { prop: "name", label: "姓名", width: 120, fixed: "left" },
        { prop: "role", label: "角色", width: 110, fixed: "left" },
        { prop: "score", label: "分数", width: 100, resizable: false }
      ];
    });
    const onDragEnd = vi.fn();
    el.addEventListener("header-dragend", onDragEnd as EventListener);
    const handles = el.shadowRoot!.querySelectorAll<HTMLElement>(".column-resizer");
    expect(handles).toHaveLength(2);

    handles[0]!.dispatchEvent(new PointerEvent("pointerdown", {
      bubbles: true,
      button: 0,
      clientX: 100,
      pointerId: 7
    }));
    document.dispatchEvent(new PointerEvent("pointermove", {
      bubbles: true,
      clientX: 144,
      pointerId: 7
    }));
    document.dispatchEvent(new PointerEvent("pointerup", {
      bubbles: true,
      clientX: 144,
      pointerId: 7
    }));
    await tick();

    const cols = el.shadowRoot!.querySelectorAll<HTMLTableColElement>("col");
    const headers = el.shadowRoot!.querySelectorAll<HTMLTableCellElement>("thead th");
    expect(cols[0]!.style.width).toBe("164px");
    expect(headers[1]!.style.left).toBe("164px");
    expect((onDragEnd.mock.calls[0]![0] as CustomEvent).detail.slice(0, 3)).toEqual([
      164,
      120,
      expect.objectContaining({ prop: "name" })
    ]);
  });

  it("列宽分隔符支持键盘微调，且无边框表格不启用调整", async () => {
    const plain = await mount((table) => {
      table.columns = [{ prop: "name", label: "姓名", width: 120 }];
    });
    expect(plain.shadowRoot!.querySelector(".column-resizer")).toBeNull();
    plain.remove();

    const el = await mount((table) => {
      table.border = true;
      table.columns = [{ prop: "name", label: "姓名", width: 120 }];
    });
    const onDragEnd = vi.fn();
    el.addEventListener("header-dragend", onDragEnd as EventListener);
    const handle = el.shadowRoot!.querySelector<HTMLElement>(".column-resizer")!;
    handle.dispatchEvent(new KeyboardEvent("keydown", {
      key: "ArrowRight",
      bubbles: true,
      shiftKey: true
    }));
    await tick();

    expect(el.shadowRoot!.querySelector<HTMLTableColElement>("col")!.style.width).toBe("144px");
    expect(handle.getAttribute("aria-valuenow")).toBe("144");
    expect((onDragEnd.mock.calls[0]![0] as CustomEvent).detail.slice(0, 2)).toEqual([144, 120]);
  });

  it("树形数据按层级折叠，并提供缩进与 treegrid 语义", async () => {
    const treeRows = [{
      id: "platform",
      name: "平台组",
      children: [
        { id: "frontend", name: "前端组" },
        { id: "backend", name: "后端组" }
      ]
    }];
    const el = await mount((table) => {
      table.data = treeRows;
      table.columns = [{ prop: "name", label: "团队" }];
      table.indent = 24;
    });
    const onExpand = vi.fn();
    el.addEventListener("expand-change", onExpand as EventListener);

    expect(el.shadowRoot!.querySelector("table")?.getAttribute("role")).toBe("treegrid");
    expect(el.shadowRoot!.querySelectorAll("tbody > tr")).toHaveLength(1);
    const toggle = el.shadowRoot!.querySelector<HTMLButtonElement>(".tree-toggle")!;
    expect(toggle.getAttribute("aria-expanded")).toBe("false");

    toggle.click();
    await tick();
    expect(el.shadowRoot!.querySelectorAll("tbody > tr")).toHaveLength(3);
    expect(el.shadowRoot!.querySelectorAll<HTMLSpanElement>(".tree-cell")[1]!.style.paddingInlineStart)
      .toBe("24px");
    expect((onExpand.mock.calls[0]![0] as CustomEvent).detail).toEqual([treeRows[0], true]);
  });

  it("tree-props 支持自定义 children/hasChildren 字段和默认展开", async () => {
    const el = await mount((table) => {
      table.data = [{ id: "root", name: "根节点", nodes: [{ id: "leaf", name: "叶节点" }] }];
      table.columns = [{ prop: "name", label: "名称" }];
      table.treeProps = { children: "nodes", hasChildren: "expandable" };
      table.defaultExpandedRowKeys = ["root"];
    });

    expect(el.shadowRoot!.querySelectorAll("tbody > tr")).toHaveLength(2);
    expect(el.shadowRoot!.querySelector("tbody > tr:nth-child(2)")?.getAttribute("aria-level"))
      .toBe("2");
  });

  it("lazy/load 解析子节点后展开，并公开准确的加载上下文", async () => {
    let resolveChildren: ((children: Record<string, unknown>[]) => void) | undefined;
    const load = vi.fn((_row, _treeNode, resolve) => {
      resolveChildren = resolve;
    });
    const el = await mount((table) => {
      table.data = [{ id: "async", name: "异步部门", hasChildren: true }];
      table.columns = [{ prop: "name", label: "名称" }];
      table.lazy = true;
      table.load = load;
    });

    el.shadowRoot!.querySelector<HTMLButtonElement>(".tree-toggle")!.click();
    await tick();
    expect(load).toHaveBeenCalledWith(
      expect.objectContaining({ id: "async" }),
      { key: "async", level: 0, expanded: false, loading: true },
      expect.any(Function)
    );
    expect(el.shadowRoot!.querySelector(".tree-toggle.is-loading")).toBeTruthy();

    resolveChildren?.([{ id: "child", name: "异步子部门" }]);
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelectorAll("tbody > tr")).toHaveLength(2);
    expect(el.shadowRoot!.textContent).toContain("异步子部门");
  });

  it("updateKeyChildren 可替换已加载子节点", async () => {
    const el = await mount((table) => {
      table.data = [{ id: "root", name: "根节点", hasChildren: true }];
      table.columns = [{ prop: "name", label: "名称" }];
      table.lazy = true;
      table.load = () => undefined;
    });

    el.updateKeyChildren("root", [{ id: "manual", name: "手动注入节点" }]);
    el.toggleRowExpansion("root", true);
    await tick();
    expect(el.shadowRoot!.textContent).toContain("手动注入节点");
  });

  it("树节点支持 Enter、Space 和方向键展开收起", async () => {
    const el = await mount((table) => {
      table.data = [{ id: "root", name: "根节点", children: [{ id: "child", name: "子节点" }] }];
      table.columns = [{ prop: "name", label: "名称" }];
    });
    const toggle = el.shadowRoot!.querySelector<HTMLButtonElement>(".tree-toggle")!;

    toggle.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await tick();
    expect(el.shadowRoot!.querySelectorAll("tbody > tr")).toHaveLength(2);

    toggle.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    await tick();
    expect(el.shadowRoot!.querySelectorAll("tbody > tr")).toHaveLength(1);

    toggle.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await tick();
    expect(el.shadowRoot!.querySelectorAll("tbody > tr")).toHaveLength(2);
  });

  it("树形选择默认级联，checkStrictly 可切换为独立选择", async () => {
    const treeData = [{ id: "root", name: "根节点", children: [{ id: "leaf", name: "叶节点" }] }];
    const el = await mount((table) => {
      table.data = treeData;
      table.columns = [{ type: "selection" }, { prop: "name", label: "名称" }];
      table.defaultExpandedRowKeys = ["root"];
    });
    el.shadowRoot!.querySelector<HTMLButtonElement>("tbody .table-checkbox")!.click();
    await tick();
    expect(el.getSelectionRows().map((row) => row.id)).toEqual(["root", "leaf"]);

    el.remove();
    const strict = await mount((table) => {
      table.data = treeData;
      table.columns = [{ type: "selection" }, { prop: "name", label: "名称" }];
      table.treeProps = { checkStrictly: true };
      table.defaultExpandedRowKeys = ["root"];
    });
    strict.shadowRoot!.querySelector<HTMLButtonElement>("tbody .table-checkbox")!.click();
    await tick();
    expect(strict.getSelectionRows().map((row) => row.id)).toEqual(["root"]);
  });

  it("allows selecting a tree child without implicitly selecting its parent", async () => {
    const el = await mount((table) => {
      table.data = [{ id: "root", name: "Parent", children: [{ id: "leaf", name: "Child" }] }];
      table.columns = [{ type: "selection" }, { prop: "name", label: "Name" }];
      table.defaultExpandedRowKeys = ["root"];
    });
    const checkboxes = el.shadowRoot!.querySelectorAll<HTMLButtonElement>("tbody .table-checkbox");

    checkboxes[1]!.click();
    await tick();

    expect(el.getSelectionRows().map((row) => row.id)).toEqual(["leaf"]);
    expect(checkboxes[0]!.getAttribute("aria-checked")).toBe("mixed");
    expect(checkboxes[1]!.getAttribute("aria-checked")).toBe("true");
  });

  it("renderHeader/renderCell 可安全挂载真实 DOM 节点并接收完整上下文", async () => {
    const onAction = vi.fn();
    const formatter = vi.fn(() => "不应显示");
    const renderHeader = vi.fn(() => {
      const strong = document.createElement("strong");
      strong.className = "custom-heading";
      strong.textContent = "成员档案";
      return strong;
    });
    const renderCell = vi.fn(({ row }: { row: Record<string, unknown> }) => {
      const button = document.createElement("button");
      button.className = "profile-action";
      button.textContent = `查看 ${row.name}`;
      button.addEventListener("click", onAction);
      return button;
    });
    const el = await mount((table) => {
      table.columns = [{
        prop: "name",
        label: "姓名",
        formatter,
        renderHeader,
        renderCell
      }];
    });
    await tick();

    expect(el.shadowRoot!.querySelector(".custom-heading")?.textContent).toBe("成员档案");
    const button = el.shadowRoot!.querySelector<HTMLButtonElement>(".profile-action")!;
    expect(button.textContent).toBe("查看 Alice");
    button.click();
    expect(onAction).toHaveBeenCalledOnce();
    expect(renderHeader).toHaveBeenCalledWith(expect.objectContaining({ columnIndex: 0 }));
    expect(renderCell).toHaveBeenCalledWith(expect.objectContaining({ row: rows[0], rowIndex: 0 }));
    expect(formatter).not.toHaveBeenCalled();
  });

  it("renderExpand 可渲染交互内容，并优先于 expandFormatter", async () => {
    const expandFormatter = vi.fn(() => "旧详情");
    const renderExpand = vi.fn(({ row }: { row: Record<string, unknown> }) => {
      const section = document.createElement("section");
      section.className = "custom-expand";
      section.textContent = `${row.name} 的权限详情`;
      return section;
    });
    const el = await mount((table) => {
      table.columns = [
        { type: "expand", width: 48, renderExpand },
        { prop: "name", label: "姓名" }
      ];
      table.expandFormatter = expandFormatter;
    });

    el.shadowRoot!.querySelector<HTMLButtonElement>(".expand-toggle")!.click();
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector(".custom-expand")?.textContent)
      .toBe("Alice 的权限详情");
    expect(renderExpand).toHaveBeenCalledWith(expect.objectContaining({ row: rows[0], rowIndex: 0 }));
    expect(expandFormatter).not.toHaveBeenCalled();
  });

  it("renderFilterIcon 可根据筛选状态替换默认图标", async () => {
    const renderFilterIcon = vi.fn(({ filtered }: { filtered: boolean }) => {
      const icon = document.createElement("span");
      icon.className = "custom-filter-icon";
      icon.textContent = filtered ? "●" : "○";
      return icon;
    });
    const el = await mount((table) => {
      table.columns = [{
        prop: "role",
        label: "角色",
        filters: [{ text: "管理员", value: "Admin" }],
        filteredValue: ["Admin"],
        renderFilterIcon
      }];
    });
    await tick();

    expect(el.shadowRoot!.querySelector(".filter-trigger.has-custom-icon")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".custom-filter-icon")?.textContent).toBe("●");
    expect(renderFilterIcon).toHaveBeenCalledWith(expect.objectContaining({ filtered: true }));
  });
});
