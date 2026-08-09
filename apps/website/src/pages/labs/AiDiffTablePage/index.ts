import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "AI Diff Table 表格差异", en: "AI Diff Table" },
  description: {
    zh: "展示 Agent 对表格数据提出的增删改建议，单元格级 diff 标记与原文划线。",
    en: "Show AI-proposed edits sweeping through tabular data with cell-level diff treatments and struck originals.",
  },
  warning: {
    zh: "实验性 API：单元格模型可能在稳定版前调整。",
    en: "Experimental API: the cell model may change before stabilization.",
  },
  demo: { zh: "菜单清理建议", en: "Proposed menu cleanup" },

  status: { zh: "状态", en: "Status" },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  titleDesc: { zh: "表格标题。", en: "Table title." },
  columnsDesc: { zh: "列定义（key / label）。", en: "Column definitions with key and label." },
  rowsDesc: {
    zh: "行数据，单元格含 value / status / original。",
    en: "Rows whose cells carry value, status, and original.",
  },
  summaryDesc: { zh: "可选的摘要文案。", en: "Optional summary text." },
  labelsDesc: { zh: "文案覆盖。", en: "Label overrides." },
  ariaLabelDesc: { zh: "无障碍标签。", en: "Accessible label." },
  rowClickEvent: { zh: "点击某一行。", en: "A row is clicked." },
});

const diffColumns = [
  { key: "flavor", label: "Flavor" },
  { key: "category", label: "Category" },
  { key: "supplier", label: "Supplier" },
];
const diffRows = [
  {
    id: 1,
    cells: {
      flavor: { value: "Rocky Road", status: "same" },
      category: { value: "Classic", status: "same" },
      supplier: { value: "aurora-scoops", status: "same" },
    },
  },
  {
    id: 2,
    cells: {
      flavor: { value: "Bubblegum", status: "same" },
      category: { value: "Retro", status: "remove" },
      supplier: { value: "kumo-creamery", status: "same" },
    },
  },
  {
    id: 3,
    cells: {
      flavor: { value: "Pistachio", status: "change", original: "Mint Chip" },
      category: { value: "Seasonal", status: "add" },
      supplier: { value: "maple-orbit", status: "same" },
    },
  },
];

const code = `<elf-ai-diff-table
  title="Proposed menu cleanup"
  :columns="columns"
  :rows="rows"
  @row-click="onRowClick"
/>`;
const script = `const rows = [
  {
    cells: {
      flavor: { value: "Pistachio", status: "change", original: "Mint Chip" },
      category: { value: "Seasonal", status: "add" },
    },
  },
];`;

const propRows = () => [
  { name: "title", type: "string", default: "''", desc: t("titleDesc") },
  { name: "columns", type: "AiTableColumn[]", default: "[]", desc: t("columnsDesc") },
  { name: "rows", type: "AiDiffRow[]", default: "[]", desc: t("rowsDesc") },
  { name: "summary", type: "string", default: "''", desc: t("summaryDesc") },
  { name: "labels", type: "Partial<AiDiffTableLabels>", default: "{}", desc: t("labelsDesc") },
  { name: "aria-label", type: "string", default: "''", desc: t("ariaLabelDesc") },
];

const eventRows = () => [
  { name: "row-click", type: "CustomEvent<AiDiffRow>", default: "—", desc: t("rowClickEvent") },
];

defineStyle(
  articleStyles,
  `
  .ai-diff-stage { width: min(100%, 720px); }
  `,
);

const PageLabsAiDiffTable = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="AI Diff Table" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status">${t("status")}</span>
      <div class="ai-diff-stage">
        <elf-ai-diff-table
          title="Proposed menu cleanup"
          :columns=${diffColumns}
          :rows=${diffRows}
        ></elf-ai-diff-table>
      </div>
    </elf-playground>
    <elf-api-builder component="elf-ai-diff-table" title="API">
    <elf-props-table role="props" :title=${t("props")} :rows=${propRows()}></elf-props-table>
    <elf-props-table role="events" :title=${t("events")} :rows=${eventRows()}></elf-props-table>
  </elf-api-builder>
  </elf-container>
`);

export { PageLabsAiDiffTable };
