import { defineHtml, useHost, useRef, useTemplateRef } from "@elfui/core";

interface TableElement extends HTMLElement {
  setScrollTop(value: number): void;
  setScrollLeft(value: number): void;
}

const tableRef = useTemplateRef<TableElement>("table");
const host = useHost();
const interaction = useRef("点击单元格查看事件参数");

const getTable = (): TableElement | null =>
  tableRef.value ?? host.shadowRoot?.querySelector<TableElement>("elf-table") ?? null;

const columns = [
  {
    type: "selection",
    width: 48,
    selectable: (row: Record<string, unknown>) => row.status !== "已归档"
  },
  { prop: "project", label: "项目", width: 220, showOverflowTooltip: true },
  { prop: "owner", label: "负责人", width: 120 },
  { prop: "status", label: "状态", width: 120 },
  { prop: "hours", label: "工时", width: 100, align: "right", sortable: true },
  { prop: "updatedAt", label: "更新时间", width: 150 }
];

const data = [
  { id: "1", project: "Design Token 语义层升级", owner: "林舟", status: "进行中", hours: 36, updatedAt: "07-15 09:20" },
  { id: "2", project: "表格交互契约补齐", owner: "周然", status: "待验收", hours: 28, updatedAt: "07-15 08:45" },
  { id: "3", project: "暗色主题视觉回归", owner: "许宁", status: "进行中", hours: 22, updatedAt: "07-14 18:30" },
  { id: "4", project: "历史文档归档", owner: "陈立", status: "已归档", hours: 12, updatedAt: "07-14 16:10" },
  { id: "5", project: "组件 API 完整度审计", owner: "林舟", status: "待排期", hours: 18, updatedAt: "07-14 14:05" }
];

const defaultSort = { prop: "hours", order: "descending" };

const rowStyle = ({ row }: { row: Record<string, unknown> }): Record<string, string> =>
  row.status === "已归档" ? { opacity: "0.58" } : {};

const headerCellStyle = (): Record<string, string> => ({
  background: "var(--elf-bg-paper)",
  color: "var(--elf-text-primary)"
});

const summaryMethod = ({ columns: tableColumns, data: rows }: {
  columns: Record<string, unknown>[];
  data: Record<string, unknown>[];
}): string[] =>
  tableColumns.map((column, index) => {
    if (index === 1) return "合计";
    if (column.prop === "hours") {
      return `${rows.reduce((sum, row) => sum + Number(row.hours), 0)} h`;
    }
    return "";
  });

const onCellClick = (event: Event): void => {
  const [row, column] = (event as CustomEvent).detail as [
    Record<string, unknown>,
    Record<string, unknown>
  ];
  interaction.set(`${String(row.project)} · ${String(column.label)}`);
};

const scrollToEnd = (): void => {
  interaction.set("已横向滚动到右侧");
  queueMicrotask(() => getTable()?.setScrollLeft(240));
};

const scrollToTop = (): void => {
  interaction.set("已回到表格起点");
  queueMicrotask(() => {
    getTable()?.setScrollTop(0);
    getTable()?.setScrollLeft(0);
  });
};

const code = `<elf-table
  :data.prop="data"
  :columns.prop="columns"
  :defaultSort.prop="defaultSort"
  :rowStyle.prop="rowStyle"
  :headerCellStyle.prop="headerCellStyle"
  :summaryMethod.prop="summaryMethod"
  height="280px"
  show-summary
  show-overflow-tooltip
  border
  @cell-click="onCellClick"
/>`;

const script = `const interaction = useRef("点击单元格查看事件参数");
const columns = [
    {
        type: "selection",
        width: 48,
        selectable: (row) => row.status !== "已归档"
    },
    { prop: "project", label: "项目", width: 220, showOverflowTooltip: true },
    { prop: "owner", label: "负责人", width: 120 },
    { prop: "status", label: "状态", width: 120 },
    { prop: "hours", label: "工时", width: 100, align: "right", sortable: true },
    { prop: "updatedAt", label: "更新时间", width: 150 }
];
const data = [
    { id: "1", project: "Design Token 语义层升级", owner: "林舟", status: "进行中", hours: 36, updatedAt: "07-15 09:20" },
    { id: "2", project: "表格交互契约补齐", owner: "周然", status: "待验收", hours: 28, updatedAt: "07-15 08:45" },
    { id: "3", project: "暗色主题视觉回归", owner: "许宁", status: "进行中", hours: 22, updatedAt: "07-14 18:30" },
    { id: "4", project: "历史文档归档", owner: "陈立", status: "已归档", hours: 12, updatedAt: "07-14 16:10" },
    { id: "5", project: "组件 API 完整度审计", owner: "林舟", status: "待排期", hours: 18, updatedAt: "07-14 14:05" }
];
const defaultSort = { prop: "hours", order: "descending" };
const rowStyle = ({ row }) => row.status === "已归档" ? { opacity: "0.58" } : {};
const headerCellStyle = () => ({
    background: "var(--elf-bg-paper)",
    color: "var(--elf-text-primary)"
});
const summaryMethod = ({ columns: tableColumns, data: rows }) => tableColumns.map((column, index) => {
    if (index === 1)
        return "合计";
    if (column.prop === "hours") {
        return \`\${rows.reduce((sum, row) => sum + Number(row.hours), 0)} h\`;
    }
    return "";
});
const onCellClick = (event) => {
    const [row, column] = event.detail;
    interaction.set(\`\${String(row.project)} · \${String(column.label)}\`);
};`;

const PageTableEx13 = defineHtml(`
  <h2>样式回调、汇总与公开方法</h2>
  <elf-playground title="业务报表：可选行、默认排序、汇总与滚动控制" :code="code" :script=${script}>
    <span slot="status" class="demo-state">{{ interaction }}</span>
    <div style="width: 100%; max-width: 680px; display: grid; gap: 12px">
      <div style="display: flex; gap: 8px">
        <elf-button size="small" @click=${scrollToEnd}>查看右侧</elf-button>
        <elf-button size="small" @click=${scrollToTop}>回到起点</elf-button>
      </div>
      <elf-table
        ref="table"
        :data.prop="data"
        :columns.prop="columns"
        :defaultSort.prop="defaultSort"
        :rowStyle.prop="rowStyle"
        :headerCellStyle.prop="headerCellStyle"
        :summaryMethod.prop="summaryMethod"
        height="280px"
        show-summary
        show-overflow-tooltip
        border
        @cell-click=${onCellClick}
      ></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx13 };
