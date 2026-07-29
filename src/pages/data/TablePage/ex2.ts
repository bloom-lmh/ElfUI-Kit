import { defineHtml, useComputed, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "分页联动", en: "Pagination" },
  title: { zh: "即时分页与页大小切换", en: "Immediate paging and page-size changes" },
  order: { zh: "订单号", en: "Order" },
  customer: { zh: "客户", en: "Customer" },
  amount: { zh: "金额", en: "Amount" },
  state: { zh: "状态", en: "Status" },
  created: { zh: "创建时间", en: "Created" },
  pending: { zh: "待付款", en: "Pending" },
  processing: { zh: "处理中", en: "Processing" },
  shipped: { zh: "已发货", en: "Shipped" },
  completed: { zh: "已完成", en: "Completed" },
  customerName: { zh: "客户", en: "Customer" },
  showing: { zh: "显示 {start}-{end} / {total} 条", en: "Showing {start}-{end} of {total}" }
});

const currentPage = useRef(1);
const pageSize = useRef(5);
const columns = () => [
  { prop: "orderNo", label: t("order"), minWidth: 150 },
  { prop: "customer", label: t("customer"), minWidth: 120 },
  { prop: "amount", label: t("amount"), width: 110, align: "right", sortable: true },
  { prop: "state", label: t("state"), width: 110 },
  { prop: "createdAt", label: t("created"), width: 130 }
];
const stateKeys = ["pending", "processing", "shipped", "completed"] as const;
const orders = Array.from({ length: 37 }, (_, index) => ({
  id: String(index + 1),
  orderNo: `ELF-${String(2026001 + index)}`,
  customer: `${t("customerName")} ${String.fromCharCode(65 + (index % 8))}`,
  amount: 128 + index * 17,
  state: t(stateKeys[index % stateKeys.length]!),
  createdAt: `06-${String((index % 18) + 1).padStart(2, "0")}`
}));

const pageRows = useComputed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return orders.slice(start, start + pageSize.value);
});
const eventValue = (event: CustomEvent<number | number[]>): number =>
  Number(Array.isArray(event.detail) ? event.detail[0] : event.detail);
const onPageChange = (event: CustomEvent<number>): void => currentPage.set(eventValue(event));
const onSizeChange = (event: CustomEvent<number>): void => {
  pageSize.set(eventValue(event));
  const lastPage = Math.max(1, Math.ceil(orders.length / pageSize.value));
  if (currentPage.value > lastPage) currentPage.set(lastPage);
};
const rangeText = (): string => {
  const start = Math.min(orders.length, (currentPage.value - 1) * pageSize.value + 1);
  const end = Math.min(orders.length, currentPage.value * pageSize.value);
  return t("showing")
    .replace("{start}", String(start))
    .replace("{end}", String(end))
    .replace("{total}", String(orders.length));
};

const code = `<elf-table :data.prop="pageRows" :columns.prop="columns" />
<elf-pagination
  :total="orders.length"
  :current-page="currentPage"
  :page-size="pageSize"
  @current-change="onPageChange"
  @size-change="onSizeChange"
/>`;
const script = `const currentPage = useRef(1);
const pageSize = useRef(5);
const pageRows = useComputed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return orders.slice(start, start + pageSize.value);
});

const t = createDocsTranslator({
    section: { zh: "分页联动", en: "Pagination" },
    title: { zh: "即时分页与页大小切换", en: "Immediate paging and page-size changes" },
    order: { zh: "订单号", en: "Order" },
    customer: { zh: "客户", en: "Customer" },
    amount: { zh: "金额", en: "Amount" },
    state: { zh: "状态", en: "Status" },
    created: { zh: "创建时间", en: "Created" },
    pending: { zh: "待付款", en: "Pending" },
    processing: { zh: "处理中", en: "Processing" },
    shipped: { zh: "已发货", en: "Shipped" },
    completed: { zh: "已完成", en: "Completed" },
    customerName: { zh: "客户", en: "Customer" },
    showing: { zh: "显示 {start}-{end} / {total} 条", en: "Showing {start}-{end} of {total}" }
});
const columns = () => [
    { prop: "orderNo", label: t("order"), minWidth: 150 },
    { prop: "customer", label: t("customer"), minWidth: 120 },
    { prop: "amount", label: t("amount"), width: 110, align: "right", sortable: true },
    { prop: "state", label: t("state"), width: 110 },
    { prop: "createdAt", label: t("created"), width: 130 }
];
const eventValue = (event) => Number(Array.isArray(event.detail) ? event.detail[0] : event.detail);
const onPageChange = (event) => currentPage.set(eventValue(event));
const onSizeChange = (event) => {
    pageSize.set(eventValue(event));
    const lastPage = Math.max(1, Math.ceil(orders.length / pageSize.value));
    if (currentPage.value > lastPage)
        currentPage.set(lastPage);
};`;

const PageTableEx2 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${rangeText()}</span>
    <div style="width:100%;display:grid;gap:14px">
      <elf-table :data.prop=${pageRows.value} :columns.prop=${columns()} border hover></elf-table>
      <elf-pagination
        background
        :total=${orders.length}
        :currentPage=${currentPage.value}
        :pageSize=${pageSize.value}
        :pageSizes.prop=${[5, 10, 20]}
        @current-change=${onPageChange}
        @size-change=${onSizeChange}
      ></elf-pagination>
    </div>
  </elf-playground>
`);

export { PageTableEx2 };
