import { defineHtml, useRef } from "@elfui/core";

const priorityRank: Record<string, number> = { 紧急: 3, 高: 2, 普通: 1 };

const sourceData = [
  { id: "1", task: "发布组件版本", priority: "高", owner: "林舟", updatedAt: "2026-07-13" },
  { id: "2", task: "修复生产告警", priority: "紧急", owner: "周然", updatedAt: "2026-07-15" },
  { id: "3", task: "整理迁移文档", priority: "普通", owner: "许宁", updatedAt: "2026-07-12" },
  { id: "4", task: "完成视觉回归", priority: "高", owner: "陈立", updatedAt: "2026-07-14" }
];

const data = useRef([...sourceData]);
const sortState = useRef("点击列标题切换排序");

const columns = [
  { prop: "task", label: "任务", minWidth: 210 },
  {
    prop: "priority",
    label: "优先级",
    width: 110,
    sortable: true,
    sortMethod: (left: Record<string, unknown>, right: Record<string, unknown>) =>
      (priorityRank[String(left.priority)] ?? 0) - (priorityRank[String(right.priority)] ?? 0),
    sortOrders: ["descending", "ascending"]
  },
  { prop: "owner", label: "负责人", width: 110, sortable: true, sortBy: ["owner", "task"] },
  {
    prop: "updatedAt",
    label: "更新时间",
    width: 140,
    sortable: "custom",
    sortOrders: ["descending", "ascending", null]
  }
];

const onSortChange = (event: Event): void => {
  const detail = (event as CustomEvent).detail as {
    prop: string;
    order: "" | "ascending" | "descending";
  };
  const label = columns.find((column) => column.prop === detail.prop)?.label || detail.prop;
  const orderText = detail.order === "ascending" ? "升序" : detail.order === "descending" ? "降序" : "默认顺序";
  sortState.set(`${label} · ${orderText}`);

  if (detail.prop !== "updatedAt") return;
  if (!detail.order) {
    data.set([...sourceData]);
    return;
  }
  const direction = detail.order === "ascending" ? 1 : -1;
  data.set(
    [...sourceData].sort(
      (left, right) => left.updatedAt.localeCompare(right.updatedAt) * direction
    )
  );
};

const code = `<elf-table
  :data.prop="data"
  :columns.prop="columns"
  border
  @sort-change="onSortChange"
/>`;

const script = `const priorityRank = { 紧急: 3, 高: 2, 普通: 1 };
const sourceData = [
    { id: "1", task: "发布组件版本", priority: "高", owner: "林舟", updatedAt: "2026-07-13" },
    { id: "2", task: "修复生产告警", priority: "紧急", owner: "周然", updatedAt: "2026-07-15" },
    { id: "3", task: "整理迁移文档", priority: "普通", owner: "许宁", updatedAt: "2026-07-12" },
    { id: "4", task: "完成视觉回归", priority: "高", owner: "陈立", updatedAt: "2026-07-14" }
];
const data = useRef([...sourceData]);
const sortState = useRef("点击列标题切换排序");
const columns = [
    { prop: "task", label: "任务", minWidth: 210 },
    {
        prop: "priority",
        label: "优先级",
        width: 110,
        sortable: true,
        sortMethod: (left, right) => (priorityRank[String(left.priority)] ?? 0) - (priorityRank[String(right.priority)] ?? 0),
        sortOrders: ["descending", "ascending"]
    },
    { prop: "owner", label: "负责人", width: 110, sortable: true, sortBy: ["owner", "task"] },
    {
        prop: "updatedAt",
        label: "更新时间",
        width: 140,
        sortable: "custom",
        sortOrders: ["descending", "ascending", null]
    }
];
const onSortChange = (event) => {
    const detail = event.detail;
    const label = columns.find((column) => column.prop === detail.prop)?.label || detail.prop;
    const orderText = detail.order === "ascending" ? "升序" : detail.order === "descending" ? "降序" : "默认顺序";
    sortState.set(\`\${label} · \${orderText}\`);
    if (detail.prop !== "updatedAt")
        return;
    if (!detail.order) {
        data.set([...sourceData]);
        return;
    }
    const direction = detail.order === "ascending" ? 1 : -1;
    data.set([...sourceData].sort((left, right) => left.updatedAt.localeCompare(right.updatedAt) * direction));
};`;

const PageTableEx15 = defineHtml(`
  <h2>优先级比较、多字段排序与服务端排序</h2>
  <elf-playground title="优先级比较、多字段排序与服务端排序" :code="code" :script=${script}>
    <span slot="status" class="demo-state">{{ sortState }}</span>
    <div style="width: 100%">
      <elf-table
        :data.prop="data"
        :columns.prop="columns"
        border
        @sort-change=${onSortChange}
      ></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx15 };
