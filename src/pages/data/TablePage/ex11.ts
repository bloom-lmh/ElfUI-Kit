import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

type Row = Record<string, unknown>;

const t = createDocsTranslator({
  title: { zh: "批量操作", en: "Batch actions" },
  idle: { zh: "等待操作", en: "Waiting for an action" },
  selection: { zh: "已选择 {count} 条 · {message}", en: "{count} selected · {message}" },
  batchDelete: { zh: "批量删除", en: "Delete selected" },
  chooseRows: { zh: "请先选择要删除的行", en: "Select rows to delete first" },
  updated: { zh: "后端已更新：{name}", en: "Backend updated: {name}" },
  deleted: { zh: "后端已删除 {count} 条记录", en: "Backend deleted {count} records" },
  editTitle: { zh: "编辑后端记录", en: "Edit backend record" },
  deleteTitle: { zh: "确认删除", en: "Confirm deletion" },
  batchDeleteTitle: { zh: "确认批量删除", en: "Confirm batch deletion" },
  deleteOne: { zh: "确定删除「{name}」吗？", en: "Delete {name}?" },
  deleteMany: { zh: "确定删除 {count} 条后端记录吗？", en: "Delete {count} backend records?" },
  servicePlaceholder: { zh: "服务名称", en: "Service name" },
  cancel: { zh: "取消", en: "Cancel" },
  save: { zh: "保存到后端", en: "Save to backend" },
  confirmDelete: { zh: "确认删除", en: "Delete" },
  edit: { zh: "编辑", en: "Edit" },
  remove: { zh: "删除", en: "Delete" },
});
const pick = createDocsPicker();

const rows = useRef<Row[]>([
  {
    id: "api-1",
    name: pick("订单服务", "Order service"),
    owner: pick("林舟", "Lin Zhou"),
    status: pick("运行中", "Running"),
  },
  {
    id: "api-2",
    name: pick("结算任务", "Settlement job"),
    owner: pick("周然", "Zhou Ran"),
    status: pick("排队中", "Queued"),
  },
  {
    id: "api-3",
    name: pick("库存同步", "Inventory sync"),
    owner: pick("许宁", "Xu Ning"),
    status: pick("告警", "Alert"),
  },
  {
    id: "api-4",
    name: pick("消息投递", "Message delivery"),
    owner: pick("陈安", "Chen An"),
    status: pick("运行中", "Running"),
  },
]);
const selectedKeys = useRef<string[]>([]);
const loading = useRef(false);
const message = useRef(t("idle"));
const editOpen = useRef(false);
const deleteOpen = useRef(false);
const editRow = useRef<Row | null>(null);
const deleteRows = useRef<Row[]>([]);
const editName = useRef("");

const fakeApi = async (text: string): Promise<void> => {
  loading.set(true);
  await Promise.resolve();
  message.set(text);
  loading.set(false);
};
const rowId = (row: Row): string => String(row.id ?? "");
const rowsData = (): Row[] => rows.value.slice();
const selectedData = (): string[] => selectedKeys.value.slice();
const selectionStatus = (): string =>
  t("selection")
    .replace("{count}", String(selectedKeys.value.length))
    .replace("{message}", message.value);
const deleteTitle = (): string =>
  deleteRows.value.length > 1 ? t("batchDeleteTitle") : t("deleteTitle");
const deleteText = (): string => {
  if (deleteRows.value.length > 1) {
    return t("deleteMany").replace("{count}", String(deleteRows.value.length));
  }
  return t("deleteOne").replace("{name}", String(deleteRows.value[0]?.name ?? ""));
};
const onSelectedKeys = (event: Event): void => {
  const detail = (event as CustomEvent).detail;
  if (Array.isArray(detail)) selectedKeys.set(detail);
};
const edit = (row: Row): void => {
  editRow.set(row);
  editName.set(String(row.name ?? ""));
  editOpen.set(true);
};
const saveEdit = async (): Promise<void> => {
  const row = editRow.peek();
  if (!row) return;
  await fakeApi(t("updated").replace("{name}", editName.value));
  rows.set(
    rows.value.map((item) =>
      rowId(item) === rowId(row) ? { ...item, name: editName.value } : item,
    ),
  );
  editOpen.set(false);
  editRow.set(null);
};
const askDelete = (row: Row): void => {
  deleteRows.set([row]);
  deleteOpen.set(true);
};
const askBatchDelete = (): void => {
  const keys = new Set(selectedKeys.value);
  const targets = rows.value.filter((row) => keys.has(rowId(row)));
  if (targets.length === 0) {
    message.set(t("chooseRows"));
    return;
  }
  deleteRows.set(targets);
  deleteOpen.set(true);
};
const confirmDelete = async (): Promise<void> => {
  const ids = new Set(deleteRows.peek().map(rowId));
  if (ids.size === 0) return;
  await fakeApi(t("deleted").replace("{count}", String(ids.size)));
  rows.set(rows.value.filter((row) => !ids.has(rowId(row))));
  selectedKeys.set([]);
  deleteRows.set([]);
  deleteOpen.set(false);
};
const closeEdit = (): void => editOpen.set(false);
const closeDelete = (): void => deleteOpen.set(false);
const columns = () => [
  { type: "selection", width: 48 },
  { prop: "name", label: pick("服务", "Service"), minWidth: 160 },
  { prop: "owner", label: pick("负责人", "Owner"), width: 110 },
  { prop: "status", label: pick("状态", "Status"), width: 110 },
  {
    type: "actions",
    label: pick("后端操作", "Backend actions"),
    width: 160,
    actions: [
      { label: t("edit"), type: "primary", onClick: edit },
      { label: t("remove"), type: "danger", onClick: askDelete },
    ],
  },
];

const code = `<elf-table
  :data.prop="rowsData()"
  :columns.prop="columns"
  :selectedKeys.prop="selectedData()"
  @update:selectedKeys="onSelectedKeys"
/>

// action.onClick(row, index, action) receives the current row.
// Batch deletion composes the selection column with selectedKeys.`;
const script = (): string => `const rows = useRef(${JSON.stringify(rows.value, null, 2)});
const selectedKeys = useRef([]);
const editOpen = useRef(false);
const deleteOpen = useRef(false);
const columns = [
  { type: "selection", width: 48 },
  { prop: "name", label: "${pick("服务", "Service")}", minWidth: 160 },
  { prop: "owner", label: "${pick("负责人", "Owner")}", width: 110 },
  { prop: "status", label: "${pick("状态", "Status")}", width: 110 },
  { type: "actions", label: "${pick("后端操作", "Backend actions")}", actions: [
    { label: "${t("edit")}", type: "primary", onClick: edit },
    { label: "${t("remove")}", type: "danger", onClick: askDelete }
  ] }
];`;

defineStyle(demoStyles);

const PageTableEx11 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <span slot="status" role="status" aria-live="polite">${selectionStatus()}</span>
    <div class="table-demo-stage">
      <div class="table-demo-stack">
        <div class="table-demo-toolbar is-split">
          <span></span>
          <elf-button size="small" type="primary" @click=${askBatchDelete}>${t("batchDelete")}</elf-button>
        </div>
        <elf-table
          :data.prop=${rowsData()}
          :columns.prop=${columns()}
          :selectedKeys.prop=${selectedData()}
          :loading=${loading}
          border
          @update:selectedKeys=${onSelectedKeys}
        ></elf-table>
        <elf-dialog v-model:open=${editOpen} :title=${t("editTitle")} size="sm">
          <elf-input v-model=${editName} :placeholder=${t("servicePlaceholder")}></elf-input>
          <template #footer>
            <elf-button size="small" @click=${closeEdit}>${t("cancel")}</elf-button>
            <elf-button size="small" type="primary" @click=${saveEdit}>${t("save")}</elf-button>
          </template>
        </elf-dialog>
        <elf-dialog v-model:open=${deleteOpen} :title=${deleteTitle()} size="sm">
          <p>${deleteText()}</p>
          <template #footer>
            <elf-button size="small" @click=${closeDelete}>${t("cancel")}</elf-button>
            <elf-button size="small" type="primary" @click=${confirmDelete}>${t("confirmDelete")}</elf-button>
          </template>
        </elf-dialog>
      </div>
    </div>
  </elf-playground>
`);

export { PageTableEx11 };
