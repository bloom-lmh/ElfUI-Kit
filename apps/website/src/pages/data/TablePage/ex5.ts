import { defineHtml, defineStyle } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const t = createDocsTranslator({ title: { zh: "边框表格", en: "Bordered table" } });
const pick = createDocsPicker();

const columns = () => [
  { prop: "module", label: pick("模块", "Module"), minWidth: 150 },
  { prop: "owner", label: pick("负责人", "Owner"), width: 120 },
  { prop: "issues", label: pick("问题数", "Issues"), width: 100, align: "right" },
];

const data = () => [
  { id: "1", module: "Data", owner: pick("林舟", "Lin Zhou"), issues: 3 },
  { id: "2", module: "Form", owner: pick("周然", "Zhou Ran"), issues: 1 },
  { id: "3", module: "Navigation", owner: pick("许宁", "Xu Ning"), issues: 2 },
];

const code = `<elf-table :data.prop="data" :columns.prop="columns" border />`;
const script = (): string => `const columns = ${JSON.stringify(columns(), null, 2)};
const data = ${JSON.stringify(data(), null, 2)};`;

defineStyle(demoStyles);

const PageTableEx5 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <div class="table-demo-stage">
      <elf-table class="table-demo-surface" :data.prop=${data()} :columns.prop=${columns()} border></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx5 };
