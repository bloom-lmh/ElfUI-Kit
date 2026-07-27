import { defineHtml, useRef } from "@elfui/core";
import type { TableColumn } from "../../../components/Data/Table";

const resizeState = useRef("拖动表头分隔线，或聚焦后按方向键");

const data = [
  { id: "1", product: "ElfUI Pro", sku: "ELF-PRO-01", category: "订阅服务", owner: "林舟", stock: 128, price: 1299 },
  { id: "2", product: "Design Token Pack", sku: "ELF-DT-02", category: "设计资产", owner: "周然", stock: 86, price: 399 },
  { id: "3", product: "Admin Starter", sku: "ELF-AS-03", category: "应用模板", owner: "许宁", stock: 42, price: 899 },
  { id: "4", product: "Icon Collection", sku: "ELF-IC-04", category: "图标资源", owner: "陈立", stock: 260, price: 199 }
];

const columns = [
  { prop: "product", label: "商品", width: 180, fixed: "left" },
  { prop: "sku", label: "SKU", width: 150 },
  { prop: "category", label: "分类", width: 150 },
  { prop: "owner", label: "负责人", width: 120 },
  { prop: "stock", label: "库存", width: 110, align: "right" },
  {
    prop: "price",
    label: "单价",
    width: 130,
    fixed: "right",
    align: "right",
    resizable: false,
    formatter: (row: Record<string, unknown>) => `¥${Number(row.price).toLocaleString("zh-CN")}`
  }
] satisfies TableColumn[];

const onHeaderDragend = (event: Event): void => {
  const [newWidth, oldWidth, column] = (event as CustomEvent).detail as [
    number,
    number,
    TableColumn
  ];
  resizeState.set(`${column.label || column.prop}：${oldWidth}px → ${newWidth}px`);
};

const code = `<elf-table
  :data.prop="data"
  :columns.prop="columns"
  border
  @header-dragend="onHeaderDragend"
/>`;

const script = `const resizeState = useRef("拖动表头分隔线，或聚焦后按方向键");
const data = [
    { id: "1", product: "ElfUI Pro", sku: "ELF-PRO-01", category: "订阅服务", owner: "林舟", stock: 128, price: 1299 },
    { id: "2", product: "Design Token Pack", sku: "ELF-DT-02", category: "设计资产", owner: "周然", stock: 86, price: 399 },
    { id: "3", product: "Admin Starter", sku: "ELF-AS-03", category: "应用模板", owner: "许宁", stock: 42, price: 899 },
    { id: "4", product: "Icon Collection", sku: "ELF-IC-04", category: "图标资源", owner: "陈立", stock: 260, price: 199 }
];
const columns = [
    { prop: "product", label: "商品", width: 180, fixed: "left" },
    { prop: "sku", label: "SKU", width: 150 },
    { prop: "category", label: "分类", width: 150 },
    { prop: "owner", label: "负责人", width: 120 },
    { prop: "stock", label: "库存", width: 110, align: "right" },
    {
        prop: "price",
        label: "单价",
        width: 130,
        fixed: "right",
        align: "right",
        resizable: false,
        formatter: (row) => \`¥\${Number(row.price).toLocaleString("zh-CN")}\`
    }
];
const onHeaderDragend = (event) => {
    const [newWidth, oldWidth, column] = event.detail;
    resizeState.set(\`\${column.label || column.prop}：\${oldWidth}px → \${newWidth}px\`);
};`;

const PageTableEx17 = defineHtml(`
  <h2>可调整列宽</h2>
  <elf-playground title="商品清单：拖动列宽并保持固定列位置" :code="code" :script=${script}>
    <span slot="status" class="demo-state">{{ resizeState }}</span>
    <div style="width: 100%; max-width: 760px">
      <elf-table
        :data.prop="data"
        :columns.prop="columns"
        border
        @header-dragend=${onHeaderDragend}
      ></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx17 };
