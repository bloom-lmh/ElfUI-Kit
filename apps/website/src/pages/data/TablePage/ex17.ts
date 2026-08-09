import { defineHtml, defineStyle, useRef } from "@elfui/core";
import type { TableColumn } from "@elfui/kit";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

type Row = Record<string, unknown>;

const t = createDocsTranslator({
  title: { zh: "列宽调整", en: "Column resizing" },
  idle: {
    zh: "拖动表头分隔线，或聚焦后按方向键",
    en: "Drag a header separator or focus it and use the arrow keys",
  },
});
const pick = createDocsPicker();
const resizeState = useRef(t("idle"));
const data = () => [
  {
    id: "1",
    product: "ElfUI Pro",
    sku: "ELF-PRO-01",
    category: pick("订阅服务", "Subscription"),
    owner: pick("林舟", "Lin Zhou"),
    stock: 128,
    price: 1299,
  },
  {
    id: "2",
    product: "Design Token Pack",
    sku: "ELF-DT-02",
    category: pick("设计资产", "Design asset"),
    owner: pick("周然", "Zhou Ran"),
    stock: 86,
    price: 399,
  },
  {
    id: "3",
    product: "Admin Starter",
    sku: "ELF-AS-03",
    category: pick("应用模板", "Application template"),
    owner: pick("许宁", "Xu Ning"),
    stock: 42,
    price: 899,
  },
  {
    id: "4",
    product: "Icon Collection",
    sku: "ELF-IC-04",
    category: pick("图标资源", "Icon resource"),
    owner: pick("陈立", "Chen Li"),
    stock: 260,
    price: 199,
  },
];
const columns = () =>
  [
    { prop: "product", label: pick("商品", "Product"), width: 180, fixed: "left" },
    { prop: "sku", label: "SKU", width: 150 },
    { prop: "category", label: pick("分类", "Category"), width: 150 },
    { prop: "owner", label: pick("负责人", "Owner"), width: 120 },
    { prop: "stock", label: pick("库存", "Stock"), width: 110, align: "right" },
    {
      prop: "price",
      label: pick("单价", "Price"),
      width: 130,
      fixed: "right",
      align: "right",
      resizable: false,
      formatter: (row: Row) => `$${Number(row.price).toLocaleString("en-US")}`,
    },
  ] satisfies TableColumn[];
const onHeaderDragend = (event: Event): void => {
  const [newWidth, oldWidth, column] = (event as CustomEvent).detail as [
    number,
    number,
    TableColumn,
  ];
  resizeState.set(`${column.label || column.prop}${pick("：", ": ")}${oldWidth}px → ${newWidth}px`);
};

const code = `<elf-table :data.prop="data" :columns.prop="columns" border @header-dragend="onHeaderDragend" />`;
const script = (): string => `const resizeState = useRef("${t("idle")}");
const data = ${JSON.stringify(data(), null, 2)};
const columns = ${JSON.stringify(
  columns().map(({ formatter: _formatter, ...column }) => column),
  null,
  2,
)};`;

defineStyle(demoStyles);

const PageTableEx17 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <span slot="status" role="status" aria-live="polite">${resizeState}</span>
    <div class="table-demo-stage">
      <elf-table class="table-demo-surface is-medium" :data.prop=${data()} :columns.prop=${columns()} border @header-dragend=${onHeaderDragend}></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx17 };
