import { defineHtml, defineStyle } from "@elfui/core";

import "@elfui/kit/labs";
import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "AI Filter Table 筛选表格", en: "AI Filter Table" },
  description: {
    zh: "状态胶囊实时重组表格数据：带计数的筛选 chips、空状态与可扩展的匹配字段。",
    en: "Status chips that reorganize live table data with counts, an empty state, and a configurable match field.",
  },
  warning: {
    zh: "实验性 API：筛选模型可能在稳定版前调整。",
    en: "Experimental API: the filter model may change before stabilization.",
  },
  demo: { zh: "任务筛选", en: "Task filters" },

  status: { zh: "状态", en: "Status" },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  expose: { zh: "方法", en: "Methods" },
  columnsDesc: { zh: "列定义（key / label）。", en: "Column definitions." },
  rowsDesc: { zh: "行数据（cells 任意值）。", en: "Rows with arbitrary cell values." },
  filtersDesc: {
    zh: "筛选 chips（key / label / value）。",
    en: "Filter chips with key, label, and value.",
  },
  defaultFilterDesc: { zh: "默认选中的筛选值。", en: "Default active filter value." },
  matchKeyDesc: {
    zh: "用于匹配筛选值的单元格键。",
    en: "Cell key compared against filter values.",
  },
  showCountsDesc: { zh: "显示每个筛选的计数。", en: "Shows per-filter counts." },
  labelsDesc: { zh: "文案覆盖。", en: "Label overrides." },
  ariaLabelDesc: { zh: "无障碍标签。", en: "Accessible label." },
  filterEvent: { zh: "筛选值变化。", en: "The active filter changes." },
  rowClickEvent: { zh: "点击某一行。", en: "A row is clicked." },
  setMethod: { zh: "设置筛选值。", en: "Sets the active filter." },
  clearMethod: { zh: "清空筛选。", en: "Clears the active filter." },
  getMethod: { zh: "返回当前筛选值。", en: "Returns the active filter." },
});

const filterColumns = [
  { key: "task", label: "Task name" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
  { key: "advisor", label: "Advisor" },
];
const filterRows = [
  {
    id: 1,
    cells: {
      task: "Restock mango sorbet",
      date: "Dec 03",
      status: "To do",
      advisor: "Mango Moon Gelato",
    },
  },
  {
    id: 2,
    cells: {
      task: "Churn black sesame",
      date: "Sep 22",
      status: "In Progress",
      advisor: "Kumo Creamery",
    },
  },
  {
    id: 3,
    cells: {
      task: "Print summer menu",
      date: "Jan 02",
      status: "To do",
      advisor: "Coral Coast Sorbet",
    },
  },
  {
    id: 4,
    cells: {
      task: "Taste-test batch 42",
      date: "Nov 08",
      status: "In Progress",
      advisor: "Maple Orbit",
    },
  },
  {
    id: 5,
    cells: {
      task: "Order waffle cones",
      date: "Apr 14",
      status: "Completed",
      advisor: "Aurora Scoops",
    },
  },
];
const filters = [
  { key: "all", label: "All" },
  { key: "todo", label: "To do", value: "To do" },
  { key: "progress", label: "In Progress", value: "In Progress" },
  { key: "done", label: "Completed", value: "Completed" },
];

const code = `<elf-ai-filter-table
  :columns="columns"
  :rows="rows"
  :filters="filters"
  match-key="status"
  @filter-change="onFilter"
/>`;
const script = `const filters = [
  { key: "all", label: "All" },
  { key: "todo", label: "To do", value: "To do" },
];
const onFilter = (event) => console.log(event.detail);`;

const propRows = () => [
  { name: "columns", type: "AiTableColumn[]", default: "[]", desc: t("columnsDesc") },
  { name: "rows", type: "AiFilterRow[]", default: "[]", desc: t("rowsDesc") },
  { name: "filters", type: "AiFilterChip[]", default: "[]", desc: t("filtersDesc") },
  { name: "default-filter", type: "string", default: "''", desc: t("defaultFilterDesc") },
  { name: "match-key", type: "string", default: "'status'", desc: t("matchKeyDesc") },
  { name: "show-counts", type: "boolean", default: "true", desc: t("showCountsDesc") },
  { name: "labels", type: "Partial<AiFilterTableLabels>", default: "{}", desc: t("labelsDesc") },
  { name: "aria-label", type: "string", default: "''", desc: t("ariaLabelDesc") },
];

const eventRows = () => [
  { name: "filter-change", type: "CustomEvent<string>", default: "—", desc: t("filterEvent") },
  { name: "row-click", type: "CustomEvent<AiFilterRow>", default: "—", desc: t("rowClickEvent") },
];

const exposeRows = () => [
  { name: "setFilter", desc: t("setMethod") },
  { name: "clearFilter", desc: t("clearMethod") },
  { name: "getFilter", desc: t("getMethod") },
];

defineStyle(
  articleStyles,
  `
  .ai-filter-stage { width: min(100%, 760px); }
  `,
);

const PageLabsAiFilterTable = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="AI Filter Table" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status">${t("status")}</span>
      <div class="ai-filter-stage">
        <elf-ai-filter-table
          :columns=${filterColumns}
          :rows=${filterRows}
          :filters=${filters}
          match-key="status"
        ></elf-ai-filter-table>
      </div>
    </elf-playground>
    <elf-api-builder component="elf-ai-filter-table" title="API">
    <elf-props-table role="props" :title=${t("props")} :rows=${propRows()}></elf-props-table>
    <elf-props-table role="events" :title=${t("events")} :rows=${eventRows()}></elf-props-table>
    <elf-props-table role="methods" :title=${t("expose")} :rows=${exposeRows()}></elf-props-table>
  </elf-api-builder>
  </elf-container>
`);

export { PageLabsAiFilterTable };
