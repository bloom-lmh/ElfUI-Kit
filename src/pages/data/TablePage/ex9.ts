import { defineHtml, useRef } from "@elfui/core";


const message = useRef("点击操作按钮查看反馈");

const dialogOpen = useRef(false);

const pendingDelete = useRef<Record<string, unknown> | null>(null);

const rows = useRef([
  { id: "1", name: "支付网关", owner: "林舟", status: "运行中", health: 98 },
  { id: "2", name: "权限中心", owner: "周然", status: "维护中", health: 76 },
  { id: "3", name: "审计日志", owner: "许宁", status: "告警", health: 43 }
]);

const statusStyle = (row: Record<string, unknown>) => {
  if (row.status === "告警") return { color: "#d32f2f", fontWeight: 700 };
  if (row.status === "维护中") return { color: "#ed6c02", fontWeight: 700 };
  return { color: "#2e7d32", fontWeight: 700 };
};

const edit = (row: Record<string, unknown>): void => {
  message.set(`编辑：${row.name}`);
};

const rowIdentity = (row: Record<string, unknown>): string => String(row.id ?? row.name ?? "");

const askRemove = (row: Record<string, unknown>): void => {
  pendingDelete.set(row);
  dialogOpen.set(true);
};

const closeDialog = (): void => {
  dialogOpen.set(false);
};

const confirmRemove = (): void => {
  const row = pendingDelete.peek();
  if (!row) return;
  const target = rowIdentity(row);
  rows.set(rows.value.filter((item) => rowIdentity(item) !== target));
  message.set(`已删除：${row.name}`);
  pendingDelete.set(null);
  dialogOpen.set(false);
};

const pendingName = (): string => String(pendingDelete.value?.name ?? "");

const rowsData = (): Record<string, unknown>[] => rows.value.slice();

const columns = [
  { prop: "name", label: "服务", minWidth: 160 },
  { prop: "owner", label: "负责人", width: 110 },
  { prop: "status", label: "状态", width: 110, cellStyle: statusStyle },
  {
    prop: "health",
    label: "健康度",
    width: 100,
    align: "right",
    formatter: (row: Record<string, unknown>) => `${row.health}%`
  },
  {
    type: "actions",
    label: "操作",
    width: 150,
    actions: [
      { label: "编辑", type: "primary", onClick: edit },
      { label: "删除", type: "danger", onClick: askRemove }
    ]
  }
];

const code = `const rowsData = () => rows.value.slice()

const askRemove = (row) => {
  pendingDelete.set(row)
  dialogOpen.set(true)
}

const confirmRemove = () => {
  const row = pendingDelete.peek()
  rows.set(rows.value.filter((item) => item.id !== row.id))
  dialogOpen.set(false)
}

const columns = [
  { prop: "status", label: "状态", cellStyle: statusStyle },
  {
    type: "actions",
    label: "操作",
    actions: [
      { label: "编辑", type: "primary", onClick: edit },
      { label: "删除", type: "danger", onClick: askRemove }
    ]
  }
]

<elf-table :data.prop="rowsData()" :columns.prop="columns" />
<elf-dialog v-model:open="dialogOpen" title="确认删除">
  <elf-button slot="footer" @click="closeDialog()">取消</elf-button>
  <elf-button slot="footer" type="primary" @click="confirmRemove()">确认删除</elf-button>
</elf-dialog>`;

const script = `const message = useRef("点击操作按钮查看反馈");
const dialogOpen = useRef(false);
const pendingDelete = useRef(null);
const rows = useRef([
    { id: "1", name: "支付网关", owner: "林舟", status: "运行中", health: 98 },
    { id: "2", name: "权限中心", owner: "周然", status: "维护中", health: 76 },
    { id: "3", name: "审计日志", owner: "许宁", status: "告警", health: 43 }
]);
const statusStyle = (row) => {
    if (row.status === "告警")
        return { color: "#d32f2f", fontWeight: 700 };
    if (row.status === "维护中")
        return { color: "#ed6c02", fontWeight: 700 };
    return { color: "#2e7d32", fontWeight: 700 };
};
const edit = (row) => {
    message.set(\`编辑：\${row.name}\`);
};
const rowIdentity = (row) => String(row.id ?? row.name ?? "");
const askRemove = (row) => {
    pendingDelete.set(row);
    dialogOpen.set(true);
};
const closeDialog = () => {
    dialogOpen.set(false);
};
const confirmRemove = () => {
    const row = pendingDelete.peek();
    if (!row)
        return;
    const target = rowIdentity(row);
    rows.set(rows.value.filter((item) => rowIdentity(item) !== target));
    message.set(\`已删除：\${row.name}\`);
    pendingDelete.set(null);
    dialogOpen.set(false);
};
const rowsData = () => rows.value.slice();
const columns = [
    { prop: "name", label: "服务", minWidth: 160 },
    { prop: "owner", label: "负责人", width: 110 },
    { prop: "status", label: "状态", width: 110, cellStyle: statusStyle },
    {
        prop: "health",
        label: "健康度",
        width: 100,
        align: "right",
        formatter: (row) => \`\${row.health}%\`
    },
    {
        type: "actions",
        label: "操作",
        width: 150,
        actions: [
            { label: "编辑", type: "primary", onClick: edit },
            { label: "删除", type: "danger", onClick: askRemove }
        ]
    }
];`;

const PageTableEx9 = defineHtml(`
  <h2>行操作与样式</h2>
  <elf-playground title="行操作与样式" :code="code" :script=${script}>
    <div style="width: 100%; display: grid; gap: 12px">
      <elf-table :data.prop="rowsData()" :columns.prop="columns" border></elf-table>
      <p slot="status" class="demo-state">{{ message }}</p>
      <elf-dialog v-model:open="dialogOpen" title="确认删除" size="sm">
        <p>确定删除「{{ pendingName() }}」吗？这个操作会从当前表格中移除该行。</p>
        <elf-button slot="footer" size="small" @click=${closeDialog}>取消</elf-button>
        <elf-button slot="footer" size="small" type="primary" @click=${confirmRemove}>确认删除</elf-button>
      </elf-dialog>
    </div>
  </elf-playground>
`);

export { PageTableEx9 };
