import { defineHtml, defineStyle } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const t = createDocsTranslator({ title: { zh: "紧凑表格", en: "Compact table" } });
const pick = createDocsPicker();

const columns = () => [
  { prop: "name", label: pick("名称", "Name"), minWidth: 160 },
  { prop: "type", label: pick("类型", "Type"), width: 100 },
  { prop: "count", label: pick("数量", "Count"), width: 90, align: "right" },
];

const data = () => [
  { id: "1", name: "Material token", type: pick("设计", "Design"), count: 32 },
  { id: "2", name: pick("表单规则", "Form rules"), type: pick("工程", "Engineering"), count: 18 },
  {
    id: "3",
    name: pick("可访问性清单", "Accessibility checklist"),
    type: pick("质量", "Quality"),
    count: 12,
  },
];

const code = `<elf-table :data.prop="data" :columns.prop="columns" size="small" />`;
const script = (): string => `const columns = [
  { prop: "name", label: "${pick("名称", "Name")}", minWidth: 160 },
  { prop: "type", label: "${pick("类型", "Type")}", width: 100 },
  { prop: "count", label: "${pick("数量", "Count")}", width: 90, align: "right" }
];
const data = ${JSON.stringify(data(), null, 2)};`;

defineStyle(demoStyles);

const PageTableEx3 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <div class="table-demo-stage">
      <elf-table class="table-demo-surface" :data.prop=${data()} :columns.prop=${columns()} size="small"></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx3 };
