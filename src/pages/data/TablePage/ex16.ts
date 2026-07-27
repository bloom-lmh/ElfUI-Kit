import { defineHtml, useHost, useRef, useTemplateRef } from "@elfui/core";
import type { TableColumn } from "../../../components/Data/Table";

interface TableElement extends HTMLElement {
  clearFilter(columnKeys?: string | string[]): void;
}

const tableRef = useTemplateRef<TableElement>("table");
const host = useHost();
const filterState = useRef("默认展示：进行中、待验收");

const data = [
  { id: "1", order: "ELF-6101", customer: "星环科技", owner: "林舟", status: "进行中", amount: 12800 },
  { id: "2", order: "ELF-6102", customer: "远山设计", owner: "周然", status: "待验收", amount: 8600 },
  { id: "3", order: "ELF-6103", customer: "云图数据", owner: "林舟", status: "已完成", amount: 24500 },
  { id: "4", order: "ELF-6104", customer: "青禾零售", owner: "许宁", status: "进行中", amount: 9600 },
  { id: "5", order: "ELF-6105", customer: "深蓝制造", owner: "周然", status: "已暂停", amount: 17300 },
  { id: "6", order: "ELF-6106", customer: "北辰物流", owner: "许宁", status: "待验收", amount: 11200 }
];

const matchColumnValue = (
  value: unknown,
  row: Record<string, unknown>,
  column: Record<string, unknown>
): boolean => row[String(column.prop)] === value;

const columns = [
  { prop: "order", label: "订单号", width: 120 },
  { prop: "customer", label: "客户", minWidth: 150 },
  {
    prop: "owner",
    columnKey: "owner",
    label: "负责人",
    width: 110,
    filterMultiple: false,
    filterPlacement: "bottom-end",
    filters: ["林舟", "周然", "许宁"].map((value) => ({ text: value, value })),
    filterMethod: matchColumnValue
  },
  {
    prop: "status",
    columnKey: "status",
    label: "状态",
    width: 120,
    filters: ["进行中", "待验收", "已完成", "已暂停"].map((value) => ({ text: value, value })),
    filteredValue: ["进行中", "待验收"],
    filterMethod: matchColumnValue
  },
  {
    prop: "amount",
    label: "金额",
    width: 120,
    align: "right",
    formatter: (row: Record<string, unknown>) => `¥${Number(row.amount).toLocaleString("zh-CN")}`
  }
] satisfies TableColumn[];

const getTable = (): TableElement | null =>
  tableRef.value ?? host.shadowRoot?.querySelector<TableElement>("elf-table") ?? null;

const onFilterChange = (event: Event): void => {
  const filters = (event as CustomEvent).detail as Record<string, unknown[]>;
  const active = Object.entries(filters)
    .filter(([, values]) => values.length > 0)
    .map(([key, values]) => `${key}：${values.join("、")}`);
  filterState.set(active.length > 0 ? active.join(" · ") : "已显示全部订单");
};

const clearStatus = (): void => {
  getTable()?.clearFilter("status");
  filterState.set("已清除状态筛选");
};

const clearAll = (): void => {
  getTable()?.clearFilter();
  filterState.set("已显示全部订单");
};

const code = `<elf-table
  :data.prop="data"
  :columns.prop="columns"
  border
  @filter-change="onFilterChange"
/>

table.clearFilter("status");
table.clearFilter();`;

const script = `const filterState = useRef("默认展示：进行中、待验收");
const data = [
    { id: "1", order: "ELF-6101", customer: "星环科技", owner: "林舟", status: "进行中", amount: 12800 },
    { id: "2", order: "ELF-6102", customer: "远山设计", owner: "周然", status: "待验收", amount: 8600 },
    { id: "3", order: "ELF-6103", customer: "云图数据", owner: "林舟", status: "已完成", amount: 24500 },
    { id: "4", order: "ELF-6104", customer: "青禾零售", owner: "许宁", status: "进行中", amount: 9600 },
    { id: "5", order: "ELF-6105", customer: "深蓝制造", owner: "周然", status: "已暂停", amount: 17300 },
    { id: "6", order: "ELF-6106", customer: "北辰物流", owner: "许宁", status: "待验收", amount: 11200 }
];
const matchColumnValue = (value, row, column) => row[String(column.prop)] === value;
const columns = [
    { prop: "order", label: "订单号", width: 120 },
    { prop: "customer", label: "客户", minWidth: 150 },
    {
        prop: "owner",
        columnKey: "owner",
        label: "负责人",
        width: 110,
        filterMultiple: false,
        filterPlacement: "bottom-end",
        filters: ["林舟", "周然", "许宁"].map((value) => ({ text: value, value })),
        filterMethod: matchColumnValue
    },
    {
        prop: "status",
        columnKey: "status",
        label: "状态",
        width: 120,
        filters: ["进行中", "待验收", "已完成", "已暂停"].map((value) => ({ text: value, value })),
        filteredValue: ["进行中", "待验收"],
        filterMethod: matchColumnValue
    },
    {
        prop: "amount",
        label: "金额",
        width: 120,
        align: "right",
        formatter: (row) => \`¥\${Number(row.amount).toLocaleString("zh-CN")}\`
    }
];
const onFilterChange = (event) => {
    const filters = event.detail;
    const active = Object.entries(filters)
        .filter(([, values]) => values.length > 0)
        .map(([key, values]) => \`\${key}：\${values.join("、")}\`);
    filterState.set(active.length > 0 ? active.join(" · ") : "已显示全部订单");
};`;

const PageTableEx16 = defineHtml(`
  <h2>列筛选</h2>
  <elf-playground title="订单工作台：多选状态与单选负责人" :code="code" :script=${script}>
    <span slot="status" class="demo-state">{{ filterState }}</span>
    <div style="width: 100%; display: grid; gap: 12px">
      <div style="display: flex; gap: 8px; flex-wrap: wrap">
        <elf-button size="small" @click=${clearStatus}>清除状态筛选</elf-button>
        <elf-button size="small" @click=${clearAll}>清除全部筛选</elf-button>
      </div>
      <elf-table
        ref="table"
        :data.prop="data"
        :columns.prop="columns"
        border
        @filter-change=${onFilterChange}
      ></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx16 };
