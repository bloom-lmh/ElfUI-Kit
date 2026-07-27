import { defineHtml, useRef } from "@elfui/core";


type Row = Record<string, unknown>;

const rows = useRef<Row[]>([
  { id: "api-1", name: "订单服务", owner: "林舟", status: "运行中" },
  { id: "api-2", name: "结算任务", owner: "周然", status: "排队中" },
  { id: "api-3", name: "库存同步", owner: "许宁", status: "告警" },
  { id: "api-4", name: "消息投递", owner: "陈安", status: "运行中" }
]);

const selectedKeys = useRef<string[]>([]);

const loading = useRef(false);

const message = useRef("等待操作");

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

const selectedCount = (): number => selectedKeys.value.length;

const deleteTitle = (): string => (deleteRows.value.length > 1 ? "确认批量删除" : "确认删除");

const deleteText = (): string => {
  if (deleteRows.value.length > 1) return `确定删除 ${deleteRows.value.length} 条后端记录吗？`;
  return `确定删除「${deleteRows.value[0]?.name ?? ""}」吗？`;
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
  await fakeApi(`后端已更新：${editName.value}`);
  rows.set(
    rows.value.map((item) =>
      rowId(item) === rowId(row) ? { ...item, name: editName.value } : item
    )
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
    message.set("请先选择要删除的行");
    return;
  }
  deleteRows.set(targets);
  deleteOpen.set(true);
};

const confirmDelete = async (): Promise<void> => {
  const ids = new Set(deleteRows.peek().map(rowId));
  if (ids.size === 0) return;
  await fakeApi(`后端已删除 ${ids.size} 条记录`);
  rows.set(rows.value.filter((row) => !ids.has(rowId(row))));
  selectedKeys.set([]);
  deleteRows.set([]);
  deleteOpen.set(false);
};

const closeEdit = (): void => {
  editOpen.set(false);
};

const closeDelete = (): void => {
  deleteOpen.set(false);
};

const columns = [
  { type: "selection", width: 48 },
  { prop: "name", label: "服务", minWidth: 160 },
  { prop: "owner", label: "负责人", width: 110 },
  { prop: "status", label: "状态", width: 110 },
  {
    type: "actions",
    label: "后端操作",
    width: 160,
    actions: [
      { label: "编辑", type: "primary", onClick: edit },
      { label: "删除", type: "danger", onClick: askDelete }
    ]
  }
];

const code = `<elf-table
  :data.prop="rowsData()"
  :columns.prop="columns"
  :selectedKeys.prop="selectedData()"
  @update:selectedKeys="onSelectedKeys"
/>

// action.onClick(row, index, action) 可以直接拿到当前行
// 批量删除通过 selection 列 + selectedKeys 完成`;

const script = `const rows = useRef([
    { id: "api-1", name: "订单服务", owner: "林舟", status: "运行中" },
    { id: "api-2", name: "结算任务", owner: "周然", status: "排队中" },
    { id: "api-3", name: "库存同步", owner: "许宁", status: "告警" },
    { id: "api-4", name: "消息投递", owner: "陈安", status: "运行中" }
]);
const selectedKeys = useRef([]);
const editOpen = useRef(false);
const deleteOpen = useRef(false);
const editRow = useRef(null);
const deleteRows = useRef([]);
const editName = useRef("");
const rowsData = () => rows.value.slice();
const selectedData = () => selectedKeys.value.slice();
const onSelectedKeys = (event) => {
    const detail = event.detail;
    if (Array.isArray(detail))
        selectedKeys.set(detail);
};
const edit = (row) => {
    editRow.set(row);
    editName.set(String(row.name ?? ""));
    editOpen.set(true);
};
const askDelete = (row) => {
    deleteRows.set([row]);
    deleteOpen.set(true);
};
const columns = [
    { type: "selection", width: 48 },
    { prop: "name", label: "服务", minWidth: 160 },
    { prop: "owner", label: "负责人", width: 110 },
    { prop: "status", label: "状态", width: 110 },
    {
        type: "actions",
        label: "后端操作",
        width: 160,
        actions: [
            { label: "编辑", type: "primary", onClick: edit },
            { label: "删除", type: "danger", onClick: askDelete }
        ]
    }
];`;

const PageTableEx11 = defineHtml(`
  <h2>模拟后端编辑与批量删除</h2>
  <elf-playground title="action 回调拿当前行，selection 支持批量删除" :code="code" :script=${script}>
    <div style="width:100%;display:grid;gap:12px">
      <div
        style="display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap"
      >
        <span slot="status" class="demo-state">已选择 {{ selectedCount() }} 条 · {{ message }}</span>
        <elf-button size="small" type="primary" @click="askBatchDelete()">批量删除</elf-button>
      </div>
      <elf-table
        :data.prop="rowsData()"
        :columns.prop="columns"
        :selectedKeys.prop="selectedData()"
        :loading="loading"
        border
        @update:selectedKeys="onSelectedKeys"
      ></elf-table>
      <elf-dialog v-model:open="editOpen" title="编辑后端记录" size="sm">
        <elf-input v-model="editName" placeholder="服务名称"></elf-input>
        <template #footer>
          <elf-button size="small" @click="closeEdit()">取消</elf-button>
          <elf-button size="small" type="primary" @click="saveEdit()">保存到后端</elf-button>
        </template>
      </elf-dialog>
      <elf-dialog v-model:open="deleteOpen" :title="deleteTitle()" size="sm">
        <p>{{ deleteText() }}</p>
        <template #footer>
          <elf-button size="small" @click="closeDelete()">取消</elf-button>
          <elf-button size="small" type="primary" @click="confirmDelete()">确认删除</elf-button>
        </template>
      </elf-dialog>
    </div>
  </elf-playground>
`);

export { PageTableEx11 };
