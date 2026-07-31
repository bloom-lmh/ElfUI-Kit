import { defineHtml, defineStyle } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "空状态", en: "Empty state" },
  empty: { zh: "没有匹配记录", en: "No matching records" },
});
const pick = createDocsPicker();

const columns = () => [
  { prop: "name", label: pick("名称", "Name"), minWidth: 160 },
  { prop: "state", label: pick("状态", "Status"), width: 120 },
];

const code = (): string =>
  `<elf-table :data.prop="[]" :columns.prop="columns" empty-text="${t("empty")}" />`;
const script = (): string => `const columns = ${JSON.stringify(columns(), null, 2)};`;

defineStyle(demoStyles);

const PageTableEx8 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code()} :script=${script()}>
    <div class="table-demo-stage">
      <elf-table class="table-demo-surface" :data.prop=${[]} :columns.prop=${columns()} :emptyText=${t("empty")}></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx8 };
