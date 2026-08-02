import { defineHtml, defineStyle, useRef, useTemplateRef } from "@elfui/core";
import type { TableColumn } from "@elfui/kit-src/components/Data/Table";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

interface TableElement extends HTMLElement {
  clearFilter(columnKeys?: string | string[]): void;
}
type Row = Record<string, unknown>;

const t = createDocsTranslator({
  title: { zh: "筛选与选择", en: "Filtering and selection" },
  initial: { zh: "默认展示：进行中、待验收", en: "Default: In progress and Pending review" },
  allOrders: { zh: "已显示全部订单", en: "Showing all orders" },
  clearedStatus: { zh: "已清除状态筛选", en: "Status filter cleared" },
  clearStatus: { zh: "清除状态筛选", en: "Clear status filter" },
  clearAll: { zh: "清除全部筛选", en: "Clear all filters" },
});
const pick = createDocsPicker();
const tableRef = useTemplateRef<TableElement>("table");
const filterState = useRef(t("initial"));
const data = () => [
  {
    id: "1",
    order: "ELF-6101",
    customer: pick("星环科技", "Starring Technology"),
    owner: pick("林舟", "Lin Zhou"),
    status: pick("进行中", "In progress"),
    amount: 12800,
  },
  {
    id: "2",
    order: "ELF-6102",
    customer: pick("远山设计", "Far Mountain Design"),
    owner: pick("周然", "Zhou Ran"),
    status: pick("待验收", "Pending review"),
    amount: 8600,
  },
  {
    id: "3",
    order: "ELF-6103",
    customer: pick("云图数据", "Cloud Atlas Data"),
    owner: pick("林舟", "Lin Zhou"),
    status: pick("已完成", "Completed"),
    amount: 24500,
  },
  {
    id: "4",
    order: "ELF-6104",
    customer: pick("青禾零售", "Greenfield Retail"),
    owner: pick("许宁", "Xu Ning"),
    status: pick("进行中", "In progress"),
    amount: 9600,
  },
  {
    id: "5",
    order: "ELF-6105",
    customer: pick("深蓝制造", "Deep Blue Manufacturing"),
    owner: pick("周然", "Zhou Ran"),
    status: pick("已暂停", "Paused"),
    amount: 17300,
  },
  {
    id: "6",
    order: "ELF-6106",
    customer: pick("北辰物流", "Northern Star Logistics"),
    owner: pick("许宁", "Xu Ning"),
    status: pick("待验收", "Pending review"),
    amount: 11200,
  },
];
const matchColumnValue = (value: unknown, row: Row, column: Row): boolean =>
  row[String(column.prop)] === value;
const ownerValues = () => [
  pick("林舟", "Lin Zhou"),
  pick("周然", "Zhou Ran"),
  pick("许宁", "Xu Ning"),
];
const statusValues = () => [
  pick("进行中", "In progress"),
  pick("待验收", "Pending review"),
  pick("已完成", "Completed"),
  pick("已暂停", "Paused"),
];
const columns = () =>
  [
    { prop: "order", label: pick("订单号", "Order"), width: 120 },
    { prop: "customer", label: pick("客户", "Customer"), minWidth: 150 },
    {
      prop: "owner",
      columnKey: "owner",
      label: pick("负责人", "Owner"),
      width: 110,
      filterMultiple: false,
      filterPlacement: "bottom-end",
      filters: ownerValues().map((value) => ({ text: value, value })),
      filterMethod: matchColumnValue,
    },
    {
      prop: "status",
      columnKey: "status",
      label: pick("状态", "Status"),
      width: 120,
      filters: statusValues().map((value) => ({ text: value, value })),
      filteredValue: statusValues().slice(0, 2),
      filterMethod: matchColumnValue,
    },
    {
      prop: "amount",
      label: pick("金额", "Amount"),
      width: 120,
      align: "right",
      formatter: (row: Row) => `$${Number(row.amount).toLocaleString("en-US")}`,
    },
  ] satisfies TableColumn[];
const onFilterChange = (event: Event): void => {
  const filters = (event as CustomEvent).detail as Record<string, unknown[]>;
  const active = Object.entries(filters)
    .filter(([, values]) => values.length > 0)
    .map(([key, values]) => `${key}: ${values.join(", ")}`);
  filterState.set(active.length > 0 ? active.join(" · ") : t("allOrders"));
};
const clearStatus = (): void => {
  tableRef.value?.clearFilter("status");
  filterState.set(t("clearedStatus"));
};
const clearAll = (): void => {
  tableRef.value?.clearFilter();
  filterState.set(t("allOrders"));
};

const code = `<elf-table :data.prop="data" :columns.prop="columns" border @filter-change="onFilterChange" />

table.clearFilter("status");
table.clearFilter();`;
const script = (): string => `const filterState = useRef("${t("initial")}");
const data = ${JSON.stringify(data(), null, 2)};
const columns = ${JSON.stringify(
  columns().map(({ filterMethod: _filterMethod, formatter: _formatter, ...column }) => column),
  null,
  2,
)};`;

defineStyle(demoStyles);

const PageTableEx16 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <span slot="status" role="status" aria-live="polite">${filterState}</span>
    <div class="table-demo-stage">
      <div class="table-demo-stack">
        <div class="table-demo-toolbar">
          <elf-button size="small" @click=${clearStatus}>${t("clearStatus")}</elf-button>
          <elf-button size="small" @click=${clearAll}>${t("clearAll")}</elf-button>
        </div>
        <elf-table ref="table" :data.prop=${data()} :columns.prop=${columns()} border @filter-change=${onFilterChange}></elf-table>
      </div>
    </div>
  </elf-playground>
`);

export { PageTableEx16 };
