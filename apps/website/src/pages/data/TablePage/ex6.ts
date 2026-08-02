import { defineHtml, defineStyle } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const t = createDocsTranslator({ title: { zh: "固定表头", en: "Fixed header" } });
const pick = createDocsPicker();

const columns = () => [
  { prop: "orderNo", label: pick("订单号", "Order"), minWidth: 150 },
  { prop: "customer", label: pick("客户", "Customer"), width: 120 },
  { prop: "amount", label: pick("金额", "Amount"), width: 100, align: "right" },
];

const data = () =>
  Array.from({ length: 12 }, (_, index) => ({
    id: String(index + 1),
    orderNo: `ELF-${2026100 + index}`,
    customer: `${pick("客户", "Customer")} ${String.fromCharCode(65 + (index % 6))}`,
    amount: 180 + index * 23,
  }));

const code = `<elf-table :data.prop="data" :columns.prop="columns" max-height="220px" />`;
const script = (): string => `const columns = ${JSON.stringify(columns(), null, 2)};
const data = Array.from({ length: 12 }, (_, index) => ({
  id: String(index + 1),
  orderNo: \`ELF-\${2026100 + index}\`,
  customer: \`${pick("客户", "Customer")} \${String.fromCharCode(65 + (index % 6))}\`,
  amount: 180 + index * 23
}));`;

defineStyle(demoStyles);

const PageTableEx6 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <div class="table-demo-stage">
      <elf-table class="table-demo-surface" :data.prop=${data()} :columns.prop=${columns()} max-height="220px"></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx6 };
