import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

let tablePaginationTag = "";
let tableActionTag = "";
let tableAdvancedTag = "";
let tableSpanTag = "";
let tableSortTag = "";
let tableFilterTag = "";
let tableResizeTag = "";
let tableTreeTag = "";
let tableRendererTag = "";
let tableTooltipTag = "";
let tableTitleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageTableEx2 } = await import("./ex2");
  const { PageTableEx9 } = await import("./ex9");
  const { PageTableEx13 } = await import("./ex13");
  const { PageTableEx14 } = await import("./ex14");
  const { PageTableEx15 } = await import("./ex15");
  const { PageTableEx16 } = await import("./ex16");
  const { PageTableEx17 } = await import("./ex17");
  const { PageTableEx18 } = await import("./ex18");
  const { PageTableEx19 } = await import("./ex19");
  const { PageTableEx20 } = await import("./ex20");
  const { PageTableEx22 } = await import("./ex22");
  tablePaginationTag = ensureCustomElement(PageTableEx2);
  tableActionTag = ensureCustomElement(PageTableEx9);
  tableAdvancedTag = ensureCustomElement(PageTableEx13);
  tableSpanTag = ensureCustomElement(PageTableEx14);
  tableSortTag = ensureCustomElement(PageTableEx15);
  tableFilterTag = ensureCustomElement(PageTableEx16);
  tableResizeTag = ensureCustomElement(PageTableEx17);
  tableTreeTag = ensureCustomElement(PageTableEx18);
  tableRendererTag = ensureCustomElement(PageTableEx19);
  tableTooltipTag = ensureCustomElement(PageTableEx20);
  tableTitleTag = ensureCustomElement(PageTableEx22);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

const collectText = (root: Node): string => {
  let text = "";

  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += `${node.textContent ?? ""}\n`;
      return;
    }

    if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot);
    node.childNodes.forEach(visit);
  };

  visit(root);
  return text.replace(/\s+/g, " ").trim();
};

describe("TablePage", () => {
  it("keeps every directory heading identical to its playground title", () => {
    for (let index = 1; index <= 22; index += 1) {
      const source = readFileSync(
        join(process.cwd(), "src", "pages", "data", "TablePage", `ex${index}.ts`),
        "utf8",
      );
      const heading = source.match(/<h2>([^<]+)<\/h2>/)?.[1]?.trim();
      const title = source.match(/<elf-playground\s+(?::title=\$\{([^}]+)\}|title="([^"]+)")/);
      const expected = title?.[1] ? `\${${title[1]}}` : title?.[2];
      expect(heading, `ex${index}.ts heading`).toBe(expected);
    }
  });

  it("表格示例可以和分页组件联动", async () => {
    const el = document.createElement(tablePaginationTag);
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(collectText(el)).toContain("显示 1-5 / 37 条");

    const pagination = el.shadowRoot!.querySelector("elf-pagination")!;
    const next = pagination.shadowRoot!.querySelector<HTMLButtonElement>(
      'button[aria-label="下一页"]'
    )!;
    next.click();
    await tick();
    await tick();

    const text = collectText(el);
    expect(text).toContain("显示 6-10 / 37 条");
    expect(text).toContain("ELF-2026006");
  });

  it("连续点击页码时直接更新表格并以最后一次选择为准", async () => {
    const el = document.createElement(tablePaginationTag);
    document.body.appendChild(el);
    await tick();
    await tick();

    const pagination = el.shadowRoot!.querySelector("elf-pagination")!;
    const pages = Array.from(pagination.shadowRoot!.querySelectorAll<HTMLButtonElement>(".page"));
    for (const page of [2, 3, 4]) {
      pages.find((button) => button.textContent?.trim() === String(page))!.click();
    }
    await tick();

    expect(collectText(el)).toContain("显示 16-20 / 37 条");
    expect(collectText(el)).toContain("ELF-2026016");
  });

  it("操作列删除按钮可以通过 Dialog 确认删除当前行", async () => {
    const el = document.createElement(tableActionTag);
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(collectText(el)).toContain("支付网关");

    const table = el.shadowRoot!.querySelector("elf-table")!;
    const deleteButton = Array.from(
      table.shadowRoot!.querySelectorAll<HTMLButtonElement>(".action-button")
    ).find((button) => button.textContent?.includes("删除"))!;
    deleteButton.click();
    await tick();
    await tick();

    expect(document.querySelector(".elf-dialog-mask")?.textContent).toContain("确认删除");
    const confirmButton = Array.from(
      document.querySelectorAll<HTMLButtonElement>("elf-button")
    ).find((button) => button.textContent?.includes("确认删除"))!;
    confirmButton.click();
    await tick();
    await tick();
    await tick();
    await tick();

    expect(collectText(table)).not.toContain("支付网关");
    expect(collectText(el)).toContain("已删除：支付网关");
  });

  it("高级案例展示汇总并把单元格事件状态保持在标题区", async () => {
    const el = document.createElement(tableAdvancedTag);
    document.body.appendChild(el);
    await tick();
    await tick();

    const table = el.shadowRoot!.querySelector("elf-table")!;
    expect(collectText(table)).toContain("116 h");

    const projectCell = table.shadowRoot!.querySelectorAll<HTMLTableCellElement>("tbody td")[1]!;
    projectCell.click();
    await tick();

    expect(collectText(el)).toContain("Design Token 语义层升级 · 项目");
    expect(el.shadowRoot!.querySelector('[slot="status"]')).toBeTruthy();
  });

  it("合并单元格案例按日期和班次纵向分组", async () => {
    const el = document.createElement(tableSpanTag);
    document.body.appendChild(el);
    await tick();
    await tick();

    const table = el.shadowRoot!.querySelector("elf-table")!;
    const rows = table.shadowRoot!.querySelectorAll<HTMLTableRowElement>("tbody tr");
    expect(rows[0]!.querySelectorAll("td")).toHaveLength(4);
    expect(rows[0]!.querySelector<HTMLTableCellElement>("td")!.rowSpan).toBe(2);
    expect(rows[1]!.querySelectorAll("td")).toHaveLength(2);
    expect(collectText(table)).toContain("7 月 16 日");
  });

  it("排序案例同时覆盖本地比较和远程数据回写", async () => {
    const el = document.createElement(tableSortTag);
    document.body.appendChild(el);
    await tick();
    await tick();

    const table = el.shadowRoot!.querySelector("elf-table")!;
    const buttons = table.shadowRoot!.querySelectorAll<HTMLButtonElement>(".sort-button");
    buttons[0]!.click();
    await tick();
    expect(table.shadowRoot!.querySelector("tbody tr")?.textContent).toContain("修复生产告警");
    expect(collectText(el)).toContain("优先级 · 降序");

    buttons[2]!.click();
    await tick();
    await tick();
    expect(table.shadowRoot!.querySelector("tbody tr")?.textContent).toContain("修复生产告警");
    expect(collectText(el)).toContain("更新时间 · 降序");
  });

  it("筛选案例展示默认条件，并可通过公开方法清除指定列", async () => {
    const el = document.createElement(tableFilterTag);
    document.body.appendChild(el);
    await tick();
    await tick();

    const table = el.shadowRoot!.querySelector("elf-table") as unknown as HTMLElement & {
      clearFilter(columnKeys?: string | string[]): void;
    };
    expect(table.shadowRoot!.querySelectorAll("tbody tr")).toHaveLength(4);
    expect(collectText(el)).toContain("默认展示：进行中、待验收");
    expect(table.shadowRoot!.querySelector(".filter-trigger.is-active")).toBeTruthy();

    table.clearFilter("status");
    await tick();
    expect(table.shadowRoot!.querySelectorAll("tbody tr")).toHaveLength(6);
  });

  it("列宽案例支持键盘调整，并把结果保持在案例标题区", async () => {
    const el = document.createElement(tableResizeTag);
    document.body.appendChild(el);
    await tick();
    await tick();

    const table = el.shadowRoot!.querySelector("elf-table")!;
    const handle = table.shadowRoot!.querySelector<HTMLElement>(".column-resizer")!;
    handle.dispatchEvent(new KeyboardEvent("keydown", {
      key: "ArrowRight",
      shiftKey: true,
      bubbles: true
    }));
    await tick();

    expect(collectText(el)).toContain("商品：180px → 204px");
    expect(el.shadowRoot!.querySelector('[slot="status"]')).toBeTruthy();
  });

  it("树形案例覆盖静态层级、懒加载入口和标题区状态", async () => {
    const el = document.createElement(tableTreeTag);
    document.body.appendChild(el);
    await tick();
    await tick();

    const table = el.shadowRoot!.querySelector("elf-table")!;
    expect(table.shadowRoot!.querySelectorAll("tbody > tr")).toHaveLength(2);
    table.shadowRoot!.querySelector<HTMLButtonElement>('.tree-toggle[data-tree-key="product"]')!.click();
    await tick();

    expect(table.shadowRoot!.querySelectorAll("tbody > tr")).toHaveLength(4);
    expect(collectText(el)).toContain("产品研发中心 · 已展开");
    expect(el.shadowRoot!.querySelector('[slot="status"]')).toBeTruthy();
  });

  it("自定义渲染案例覆盖表头、单元格、展开区和筛选图标", async () => {
    const el = document.createElement(tableRendererTag);
    document.body.appendChild(el);
    await tick();
    await tick();
    await tick();

    const table = el.shadowRoot!.querySelector("elf-table")!;
    expect(table.shadowRoot!.querySelector(".member-heading")?.textContent).toContain("成员档案");
    expect(table.shadowRoot!.querySelector(".member-profile")?.textContent).toContain("林舒");
    expect(table.shadowRoot!.querySelector(".custom-filter-icon")?.textContent).toBe("●");

    table.shadowRoot!.querySelector<HTMLButtonElement>(".expand-toggle")!.click();
    await tick();
    await tick();
    expect(table.shadowRoot!.querySelector(".member-detail")?.textContent).toContain("设计系统负责人");

    table.shadowRoot!.querySelector<HTMLButtonElement>(".profile-button")!.click();
    await tick();
    expect(collectText(el)).toContain("正在查看：林舒");
  });

  it("溢出提示案例公开浮层配置并保留标题区状态", async () => {
    const el = document.createElement(tableTooltipTag);
    document.body.appendChild(el);
    await tick();
    await tick();

    const table = el.shadowRoot!.querySelector("elf-table") as HTMLElement & {
      showOverflowTooltip: boolean;
      tooltipOptions: { placement: string; showAfter: number; maxWidth: number };
    };
    expect(table.showOverflowTooltip).toBe(true);
    expect(table.tooltipOptions).toMatchObject({
      placement: "top-start",
      showAfter: 120,
      maxWidth: 320
    });
    expect(el.shadowRoot!.querySelector('[slot="status"]')).toBeTruthy();
    expect(collectText(el)).toContain("悬停或使用 Tab 聚焦被截断的单元格");
  });

  it("标题栏案例使用 Table 的 title 与 title-variant", async () => {
    const el = document.createElement(tableTitleTag);
    document.body.appendChild(el);
    await tick();
    await tick();

    const table = el.shadowRoot!.querySelector("elf-table")!;
    expect(table.shadowRoot!.querySelector(".table-title")?.textContent).toContain("服务运行状态");
    expect(table.shadowRoot!.querySelector(".table-root")?.classList.contains("title-primary")).toBe(true);
  });

});
