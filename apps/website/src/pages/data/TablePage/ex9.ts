import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

type Row = Record<string, unknown>;

const t = createDocsTranslator({
  title: { zh: "行操作与样式", en: "Row actions and styling" },
  idle: { zh: "点击操作按钮查看反馈", en: "Choose a row action to see feedback" },
  editFeedback: { zh: "编辑：{name}", en: "Editing: {name}" },
  deleteFeedback: { zh: "已删除：{name}", en: "Deleted: {name}" },
  dialogTitle: { zh: "确认删除", en: "Confirm deletion" },
  dialogText: {
    zh: "确定删除「{name}」吗？这个操作会从当前表格中移除该行。",
    en: "Delete {name}? This removes the row from the current table.",
  },
  cancel: { zh: "取消", en: "Cancel" },
  confirm: { zh: "确认删除", en: "Delete" },
  edit: { zh: "编辑", en: "Edit" },
  remove: { zh: "删除", en: "Delete" },
});
const pick = createDocsPicker();

const message = useRef(t("idle"));
const dialogOpen = useRef(false);
const pendingDelete = useRef<Row | null>(null);
const rows = useRef<Row[]>([
  {
    id: "1",
    name: pick("支付网关", "Payment gateway"),
    owner: pick("林舟", "Lin Zhou"),
    status: pick("运行中", "Running"),
    statusCode: "running",
    health: 98,
  },
  {
    id: "2",
    name: pick("权限中心", "Permission center"),
    owner: pick("周然", "Zhou Ran"),
    status: pick("维护中", "Maintenance"),
    statusCode: "maintenance",
    health: 76,
  },
  {
    id: "3",
    name: pick("审计日志", "Audit log"),
    owner: pick("许宁", "Xu Ning"),
    status: pick("告警", "Alert"),
    statusCode: "alert",
    health: 43,
  },
]);

const statusStyle = (row: Row): Record<string, string | number> => {
  if (row.statusCode === "alert") return { color: "#d32f2f", fontWeight: 700 };
  if (row.statusCode === "maintenance") return { color: "#ed6c02", fontWeight: 700 };
  return { color: "#2e7d32", fontWeight: 700 };
};
const edit = (row: Row): void => message.set(t("editFeedback").replace("{name}", String(row.name)));
const rowIdentity = (row: Row): string => String(row.id ?? row.name ?? "");
const askRemove = (row: Row): void => {
  pendingDelete.set(row);
  dialogOpen.set(true);
};
const closeDialog = (): void => dialogOpen.set(false);
const confirmRemove = (): void => {
  const row = pendingDelete.peek();
  if (!row) return;
  const target = rowIdentity(row);
  rows.set(rows.value.filter((item) => rowIdentity(item) !== target));
  message.set(t("deleteFeedback").replace("{name}", String(row.name)));
  pendingDelete.set(null);
  dialogOpen.set(false);
};
const pendingName = (): string => String(pendingDelete.value?.name ?? "");
const dialogText = (): string => t("dialogText").replace("{name}", pendingName());
const rowsData = (): Row[] => rows.value.slice();
const columns = () => [
  { prop: "name", label: pick("服务", "Service"), minWidth: 160 },
  { prop: "owner", label: pick("负责人", "Owner"), width: 110 },
  { prop: "status", label: pick("状态", "Status"), width: 110, cellStyle: statusStyle },
  {
    prop: "health",
    label: pick("健康度", "Health"),
    width: 100,
    align: "right",
    formatter: (row: Row) => `${row.health}%`,
  },
  {
    type: "actions",
    label: pick("操作", "Actions"),
    width: 150,
    actions: [
      { label: t("edit"), type: "primary", onClick: edit },
      { label: t("remove"), type: "danger", onClick: askRemove },
    ],
  },
];

const code = (): string => `<elf-table :data.prop="rowsData()" :columns.prop="columns" border />
<elf-dialog v-model:open="dialogOpen" title="${t("dialogTitle")}">
  <elf-button slot="footer" @click="closeDialog()">${t("cancel")}</elf-button>
  <elf-button slot="footer" type="primary" @click="confirmRemove()">${t("confirm")}</elf-button>
</elf-dialog>`;
const script = (): string => `const message = useRef("${t("idle")}");
const rows = useRef(${JSON.stringify(rows.value, null, 2)});
const columns = [
  { prop: "name", label: "${pick("服务", "Service")}", minWidth: 160 },
  { prop: "owner", label: "${pick("负责人", "Owner")}", width: 110 },
  { prop: "status", label: "${pick("状态", "Status")}", width: 110, cellStyle: statusStyle },
  { prop: "health", label: "${pick("健康度", "Health")}", formatter: (row) => \`\${row.health}%\` },
  { type: "actions", label: "${pick("操作", "Actions")}", actions: [
    { label: "${t("edit")}", type: "primary", onClick: edit },
    { label: "${t("remove")}", type: "danger", onClick: askRemove }
  ] }
];`;

defineStyle(demoStyles);

const PageTableEx9 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code()} :script=${script()}>
    <span slot="status" role="status" aria-live="polite">${message}</span>
    <div class="table-demo-stage">
      <div class="table-demo-stack">
        <elf-table :data.prop=${rowsData()} :columns.prop=${columns()} border></elf-table>
        <elf-dialog v-model:open=${dialogOpen} :title=${t("dialogTitle")} size="sm">
          <p>${dialogText()}</p>
          <elf-button slot="footer" size="small" @click=${closeDialog}>${t("cancel")}</elf-button>
          <elf-button slot="footer" size="small" type="primary" @click=${confirmRemove}>${t("confirm")}</elf-button>
        </elf-dialog>
      </div>
    </div>
  </elf-playground>
`);

export { PageTableEx9 };
