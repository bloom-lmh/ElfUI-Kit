import { defineHtml, onMounted, onUnmounted, useHost } from "@elfui/core";


const host = useHost();
const defaultSelectedKeys = ["2"];
let selectedRows: Record<string, unknown>[] = [
  { id: "2", name: "表单校验补齐", owner: "周然", progress: 94, status: "已完成" }
];
let currentRow = "暂无";

const columns = [
  { type: "selection", width: 48, align: "center" },
  { type: "index", label: "#", width: 56, align: "center" },
  { prop: "name", label: "项目", minWidth: 160, sortable: true },
  { prop: "owner", label: "负责人", width: 120 },
  { prop: "progress", label: "进度", width: 110, align: "right", sortable: true },
  { prop: "status", label: "状态", width: 120 }
];

const data = [
  { id: "1", name: "组件规范整理", owner: "林舟", progress: 72, status: "进行中" },
  { id: "2", name: "表单校验补齐", owner: "周然", progress: 94, status: "已完成" },
  { id: "3", name: "主题变量审计", owner: "许宁", progress: 48, status: "进行中" },
  { id: "4", name: "文档示例回归", owner: "陈立", progress: 61, status: "待验收" }
];

const first = <T>(event: Event, fallback: T): T => {
  const detail = (event as CustomEvent).detail;
  return (Array.isArray(detail) ? detail[0] : detail) ?? fallback;
};

const updateStatus = (): void => {
  const status = host.shadowRoot?.querySelector<HTMLElement>(".table-selection-status");
  if (!status) return;
  const selected = selectedRows.map((row) => String(row.name)).join("、") || "暂无";
  status.textContent = `已选：${selected}；当前行：${currentRow}`;
};

let tableElement: HTMLElement | null = null;
onMounted(() => {
  tableElement = host.shadowRoot?.querySelector("elf-table") ?? null;
  tableElement?.addEventListener("selection-change", onSelectionChange);
  tableElement?.addEventListener("row-click", onRowClick);
});
onUnmounted(() => {
  tableElement?.removeEventListener("selection-change", onSelectionChange);
  tableElement?.removeEventListener("row-click", onRowClick);
  tableElement = null;
});

const onSelectionChange = (event: Event): void => {
  const detail = (event as CustomEvent).detail;
  if (Array.isArray(detail)) selectedRows = detail;
  updateStatus();
};

const onRowClick = (event: Event): void => {
  const row = first<Record<string, unknown> | null>(event, null);
  currentRow = row ? String(row.name) : "暂无";
  updateStatus();
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

const script = `const host = useHost();
const defaultSelectedKeys = ["2"];
let selectedRows = [
    { id: "2", name: "表单校验补齐", owner: "周然", progress: 94, status: "已完成" }
];
let currentRow = "暂无";
const columns = [
    { type: "selection", width: 48, align: "center" },
    { type: "index", label: "#", width: 56, align: "center" },
    { prop: "name", label: "项目", minWidth: 160, sortable: true },
    { prop: "owner", label: "负责人", width: 120 },
    { prop: "progress", label: "进度", width: 110, align: "right", sortable: true },
    { prop: "status", label: "状态", width: 120 }
];
const data = [
    { id: "1", name: "组件规范整理", owner: "林舟", progress: 72, status: "进行中" },
    { id: "2", name: "表单校验补齐", owner: "周然", progress: 94, status: "已完成" },
    { id: "3", name: "主题变量审计", owner: "许宁", progress: 48, status: "进行中" },
    { id: "4", name: "文档示例回归", owner: "陈立", progress: 61, status: "待验收" }
];
const first = (event, fallback) => {
    const detail = event.detail;
    return (Array.isArray(detail) ? detail[0] : detail) ?? fallback;
};
const updateStatus = () => {
    const status = host.shadowRoot?.querySelector(".table-selection-status");
    if (!status)
        return;
    const selected = selectedRows.map((row) => String(row.name)).join("、") || "暂无";
    status.textContent = \`已选：\${selected}；当前行：\${currentRow}\`;
};
const onSelectionChange = (event) => {
    const detail = event.detail;
    if (Array.isArray(detail))
        selectedRows = detail;
    updateStatus();
};
const onRowClick = (event) => {
    const row = first(event, null);
    currentRow = row ? String(row.name) : "暂无";
    updateStatus();
};`;

const PageTableEx1 = defineHtml(`
  <h2>选择、排序和当前行高亮</h2>
  <elf-playground title="选择、排序和当前行高亮" :code="code" :script=${script}>
    <div style="width: 100%; display: grid; gap: 12px">
      <elf-table
        :data.prop="data"
        :columns.prop="columns"
        :defaultSelectedKeys.prop="defaultSelectedKeys"
        stripe
        border
        highlight-current-row
      ></elf-table>
      <p slot="status" class="demo-state table-selection-status">已选：表单校验补齐；当前行：暂无</p>
    </div>
  </elf-playground>
`);

export { PageTableEx1 };
