import { defineHtml } from "@elfui/core";

const columns = [
  { prop: "orderNo", label: "订单号", minWidth: 150 },
  { prop: "customer", label: "客户", width: 120 },
  { prop: "amount", label: "金额", width: 100, align: "right" }
];

const data = Array.from({ length: 12 }, (_, index) => ({
  id: String(index + 1),
  orderNo: `ELF-${2026100 + index}`,
  customer: `客户 ${String.fromCharCode(65 + (index % 6))}`,
  amount: 180 + index * 23
}));

const code = `<elf-table :data.prop="data" :columns.prop="columns" max-height="220px" />`;

const script = `const columns = [
    { prop: "orderNo", label: "订单号", minWidth: 150 },
    { prop: "customer", label: "客户", width: 120 },
    { prop: "amount", label: "金额", width: 100, align: "right" }
];
const data = Array.from({ length: 12 }, (_, index) => ({
    id: String(index + 1),
    orderNo: \`ELF-\${2026100 + index}\`,
    customer: \`客户 \${String.fromCharCode(65 + (index % 6))}\`,
    amount: 180 + index * 23
}));`;

const PageTableEx6 = defineHtml(`
  <h2>固定表头</h2>
  <elf-playground title="固定表头" :code="code" :script=${script}>
    <div style="width: 100%">
      <elf-table :data.prop="data" :columns.prop="columns" max-height="220px"></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx6 };
