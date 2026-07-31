import { defineHtml, defineStyle, useRef, useTemplateRef } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

type Row = Record<string, unknown>;
interface TableElement extends HTMLElement {
  setScrollTop(value: number): void;
  setScrollLeft(value: number): void;
}

const t = createDocsTranslator({
  title: { zh: "排序与汇总", en: "Sorting and summary" },
  idle: { zh: "点击单元格查看事件参数", en: "Choose a cell to inspect its event payload" },
  scrollEnd: { zh: "已横向滚动到右侧", en: "Scrolled to the right" },
  scrollStart: { zh: "已回到表格起点", en: "Returned to the table origin" },
  viewRight: { zh: "查看右侧", en: "View right" },
  returnStart: { zh: "回到起点", en: "Return to start" },
  total: { zh: "合计", en: "Total" },
});
const pick = createDocsPicker();
const tableRef = useTemplateRef<TableElement>("table");
const interaction = useRef(t("idle"));
const columns = () => [
  { type: "selection", width: 48, selectable: (row: Row) => row.statusCode !== "archived" },
  { prop: "project", label: pick("项目", "Project"), width: 220, showOverflowTooltip: true },
  { prop: "owner", label: pick("负责人", "Owner"), width: 120 },
  { prop: "status", label: pick("状态", "Status"), width: 120 },
  { prop: "hours", label: pick("工时", "Hours"), width: 100, align: "right", sortable: true },
  { prop: "updatedAt", label: pick("更新时间", "Updated"), width: 150 },
];
const data = () => [
  {
    id: "1",
    project: pick("Design Token 语义层升级", "Design token semantic layer"),
    owner: pick("林舟", "Lin Zhou"),
    status: pick("进行中", "In progress"),
    statusCode: "active",
    hours: 36,
    updatedAt: "07-15 09:20",
  },
  {
    id: "2",
    project: pick("表格交互契约补齐", "Complete table interaction contracts"),
    owner: pick("周然", "Zhou Ran"),
    status: pick("待验收", "Pending review"),
    statusCode: "review",
    hours: 28,
    updatedAt: "07-15 08:45",
  },
  {
    id: "3",
    project: pick("暗色主题视觉回归", "Dark theme visual regression"),
    owner: pick("许宁", "Xu Ning"),
    status: pick("进行中", "In progress"),
    statusCode: "active",
    hours: 22,
    updatedAt: "07-14 18:30",
  },
  {
    id: "4",
    project: pick("历史文档归档", "Archive historical documentation"),
    owner: pick("陈立", "Chen Li"),
    status: pick("已归档", "Archived"),
    statusCode: "archived",
    hours: 12,
    updatedAt: "07-14 16:10",
  },
  {
    id: "5",
    project: pick("组件 API 完整度审计", "Component API completeness audit"),
    owner: pick("林舟", "Lin Zhou"),
    status: pick("待排期", "Unscheduled"),
    statusCode: "planned",
    hours: 18,
    updatedAt: "07-14 14:05",
  },
];
const defaultSort = { prop: "hours", order: "descending" };
const rowStyle = ({ row }: { row: Row }): Record<string, string> =>
  row.statusCode === "archived" ? { opacity: "0.58" } : {};
const headerCellStyle = (): Record<string, string> => ({
  background: "var(--elf-bg-paper)",
  color: "var(--elf-text-primary)",
});
const summaryMethod = ({
  columns: tableColumns,
  data: rows,
}: {
  columns: Row[];
  data: Row[];
}): string[] =>
  tableColumns.map((column, index) => {
    if (index === 1) return t("total");
    if (column.prop === "hours")
      return `${rows.reduce((sum, row) => sum + Number(row.hours), 0)} h`;
    return "";
  });
const onCellClick = (event: Event): void => {
  const [row, column] = (event as CustomEvent).detail as [Row, Row];
  interaction.set(`${String(row.project)} · ${String(column.label)}`);
};
const scrollToEnd = (): void => {
  interaction.set(t("scrollEnd"));
  tableRef.value?.setScrollLeft(240);
};
const scrollToTop = (): void => {
  interaction.set(t("scrollStart"));
  tableRef.value?.setScrollTop(0);
  tableRef.value?.setScrollLeft(0);
};

const code = `<elf-table
  :data.prop="data"
  :columns.prop="columns"
  :defaultSort.prop="defaultSort"
  :summaryMethod.prop="summaryMethod"
  height="280px"
  show-summary
  border
  @cell-click="onCellClick"
/>`;
const script = (): string => `const interaction = useRef("${t("idle")}");
const columns = ${JSON.stringify(
  columns().map(({ selectable: _selectable, ...column }) => column),
  null,
  2,
)};
const data = ${JSON.stringify(data(), null, 2)};
const defaultSort = { prop: "hours", order: "descending" };
const summaryMethod = ({ columns, data }) => columns.map((column, index) => {
  if (index === 1) return "${t("total")}";
  if (column.prop === "hours") return \`\${data.reduce((sum, row) => sum + Number(row.hours), 0)} h\`;
  return "";
});`;

defineStyle(demoStyles);

const PageTableEx13 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <span slot="status" role="status" aria-live="polite">${interaction}</span>
    <div class="table-demo-stage is-tall">
      <div class="table-demo-stack is-compact">
        <div class="table-demo-toolbar">
          <elf-button size="small" @click=${scrollToEnd}>${t("viewRight")}</elf-button>
          <elf-button size="small" @click=${scrollToTop}>${t("returnStart")}</elf-button>
        </div>
        <elf-table
          ref="table"
          :data.prop=${data()}
          :columns.prop=${columns()}
          :defaultSort.prop=${defaultSort}
          :rowStyle.prop=${rowStyle}
          :headerCellStyle.prop=${headerCellStyle}
          :summaryMethod.prop=${summaryMethod}
          height="280px"
          show-summary
          show-overflow-tooltip
          border
          @cell-click=${onCellClick}
        ></elf-table>
      </div>
    </div>
  </elf-playground>
`);

export { PageTableEx13 };
