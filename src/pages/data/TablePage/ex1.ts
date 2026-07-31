import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

type Row = Record<string, unknown>;

const t = createDocsTranslator({
  title: { zh: "基础交互", en: "Basic interaction" },
  none: { zh: "暂无", en: "None" },
  selected: {
    zh: "已选：{selected}；当前行：{current}",
    en: "Selected: {selected}; current row: {current}",
  },
});
const pick = createDocsPicker();

const defaultSelectedKeys = ["2"];
const columns = () => [
  { type: "selection", width: 48, align: "center" },
  { type: "index", label: "#", width: 56, align: "center" },
  { prop: "name", label: pick("项目", "Project"), minWidth: 160, sortable: true },
  { prop: "owner", label: pick("负责人", "Owner"), width: 120 },
  { prop: "progress", label: pick("进度", "Progress"), width: 110, align: "right", sortable: true },
  { prop: "status", label: pick("状态", "Status"), width: 120 },
];
const data = () => [
  {
    id: "1",
    name: pick("组件规范整理", "Component guidelines"),
    owner: pick("林舟", "Lin Zhou"),
    progress: 72,
    status: pick("进行中", "In progress"),
  },
  {
    id: "2",
    name: pick("表单校验补齐", "Complete form validation"),
    owner: pick("周然", "Zhou Ran"),
    progress: 94,
    status: pick("已完成", "Completed"),
  },
  {
    id: "3",
    name: pick("主题变量审计", "Theme token audit"),
    owner: pick("许宁", "Xu Ning"),
    progress: 48,
    status: pick("进行中", "In progress"),
  },
  {
    id: "4",
    name: pick("文档示例回归", "Documentation regression"),
    owner: pick("陈立", "Chen Li"),
    progress: 61,
    status: pick("待验收", "Pending review"),
  },
];

const rows = data();
const selectedRows = useRef<Row[]>([rows[1]!]);
const currentRow = useRef(t("none"));

const first = <T>(event: Event, fallback: T): T => {
  const detail = (event as CustomEvent).detail;
  return (Array.isArray(detail) ? detail[0] : detail) ?? fallback;
};
const onSelectionChange = (event: Event): void => {
  const detail = (event as CustomEvent).detail;
  if (Array.isArray(detail)) selectedRows.set(detail);
};
const onRowClick = (event: Event): void => {
  const row = first<Row | null>(event, null);
  currentRow.set(row ? String(row.name) : t("none"));
};
const statusText = (): string => {
  const selected = selectedRows.value.map((row) => String(row.name)).join(", ") || t("none");
  return t("selected").replace("{selected}", selected).replace("{current}", currentRow.value);
};

const code = `<elf-table
  :data.prop="data"
  :columns.prop="columns"
  :defaultSelectedKeys.prop="defaultSelectedKeys"
  stripe
  border
  highlight-current-row
  @selection-change="onSelectionChange"
  @row-click="onRowClick"
/>`;
const script = (): string => `const defaultSelectedKeys = ["2"];
const columns = ${JSON.stringify(columns(), null, 2)};
const data = ${JSON.stringify(rows, null, 2)};
const selectedRows = useRef([data[1]]);
const currentRow = useRef("${t("none")}");

const onSelectionChange = (event) => {
  if (Array.isArray(event.detail)) selectedRows.set(event.detail);
};
const onRowClick = (event) => {
  const row = Array.isArray(event.detail) ? event.detail[0] : event.detail;
  currentRow.set(row?.name ?? "${t("none")}");
};`;

defineStyle(demoStyles);

const PageTableEx1 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <span slot="status" role="status" aria-live="polite">${statusText()}</span>
    <div class="table-demo-stage">
      <elf-table
        class="table-demo-surface"
        :data.prop=${rows}
        :columns.prop=${columns()}
        :defaultSelectedKeys.prop=${defaultSelectedKeys}
        stripe
        border
        highlight-current-row
        @selection-change=${onSelectionChange}
        @row-click=${onRowClick}
      ></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx1 };
