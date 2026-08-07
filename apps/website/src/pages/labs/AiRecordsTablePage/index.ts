import { defineHtml, defineStyle, useRef } from "@elfui/core";

import "@elfui/kit/labs";
import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "AI Records Table 记录表格", en: "AI Records Table" },
  description: {
    zh: "CRM 风格记录表格：标签、排序、勾选、行链接与底部统计，数据模型宽泛便于对接任意 Agent 数据。",
    en: "CRM-style records grid with tags, sorting, selection, links, and footer stats over a wide data model.",
  },
  warning: {
    zh: "实验性 API：排序模型可能在稳定版前调整。",
    en: "Experimental API: the sort model may change before stabilization.",
  },
  demo: { zh: "供应商记录表", en: "Supplier records" },

  status: { zh: "状态", en: "Status" },
  selected: { zh: "已选", en: "Selected" },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  expose: { zh: "方法", en: "Methods" },
  columnsDesc: {
    zh: "列定义（sortable / align / width）。",
    en: "Column definitions with sortable, align, and width.",
  },
  rowsDesc: {
    zh: "行数据（cells / tags / href / avatar）。",
    en: "Rows with cells, tags, href, and avatar.",
  },
  selectableDesc: { zh: "显示勾选列。", en: "Shows the selection column." },
  sortDesc: { zh: "排序键与方向（可受控）。", en: "Sort key and order (controllable)." },
  footerDesc: { zh: "底部统计开关与文案。", en: "Footer toggle and text." },
  formatCellDesc: { zh: "单元格格式化函数。", en: "Optional cell formatter." },
  labelsDesc: { zh: "文案覆盖。", en: "Label overrides." },
  ariaLabelDesc: { zh: "无障碍标签。", en: "Accessible label." },
  sortEvent: { zh: "排序变化。", en: "Sorting changes." },
  selectionEvent: { zh: "勾选集合变化。", en: "The selected set changes." },
  rowClickEvent: { zh: "点击某一行。", en: "A row is clicked." },
  getMethod: { zh: "返回已选行 id。", en: "Returns selected row ids." },
  clearMethod: { zh: "清空选择。", en: "Clears the selection." },
  toggleMethod: { zh: "切换某行选择。", en: "Toggles one row." },
});

const selectedIds = useRef<(string | number)[]>([]);
const onSelectionChange = (event: CustomEvent<(string | number)[]>): void => {
  selectedIds.set(event.detail);
};
const recordsColumns = [
  { key: "company", label: "Company", sortable: true },
  { key: "category", label: "Categories" },
  { key: "last", label: "Last interaction", sortable: true },
  { key: "links", label: "Links" },
];
const recordsRows = [
  {
    id: 1,
    avatar: "A",
    cells: {
      company: "Aurora Scoops — Reykjavík",
      category: "Gelato",
      last: "9 days ago",
      links: "aurora-scoops.example.com",
    },
    tags: ["Gelato", "Seasonal"],
    href: "https://aurora-scoops.example.com",
  },
  {
    id: 2,
    avatar: "B",
    cells: {
      company: "Blue Fig Gelato — Florence",
      category: "Gelato",
      last: "over 1 year ago",
      links: "blue-fig.example.com",
    },
    tags: ["Gelato", "Cafe"],
    href: "https://blue-fig.example.com",
  },
  {
    id: 3,
    avatar: "C",
    cells: {
      company: "Cacao Norte — Oaxaca",
      category: "B2B",
      last: "about 2 years ago",
      links: "cacao-norte.example.com",
    },
    tags: ["B2B", "Local", "Wholesale"],
    href: "https://cacao-norte.example.com",
  },
];

const code = `<elf-ai-records-table
  :columns="columns"
  :rows="rows"
  sort-by="company"
  sort-order="asc"
  footer-text="3 count · 3 links"
  @selection-change="onSelection"
/>`;
const script = `const onSelection = (event) => {
  console.log(event.detail); // [1, 2]
};`;

const propRows = () => [
  { name: "columns", type: "AiTableColumn[]", default: "[]", desc: t("columnsDesc") },
  { name: "rows", type: "AiRecordRow[]", default: "[]", desc: t("rowsDesc") },
  { name: "selectable", type: "boolean", default: "true", desc: t("selectableDesc") },
  {
    name: "sort-by",
    type: "string",
    default: "''",
    desc: t("sortDesc"),
  },
  {
    name: "sort-order",
    type: "'asc' | 'desc'",
    default: "'asc'",
    desc: t("sortDesc"),
  },
  {
    name: "show-footer",
    type: "boolean",
    default: "true",
    desc: t("footerDesc"),
  },
  {
    name: "footer-text",
    type: "string",
    default: "''",
    desc: t("footerDesc"),
  },
  {
    name: "format-cell",
    type: "(value, row, key) => string",
    default: "null",
    desc: t("formatCellDesc"),
  },
  { name: "labels", type: "Partial<AiRecordsTableLabels>", default: "{}", desc: t("labelsDesc") },
  { name: "aria-label", type: "string", default: "''", desc: t("ariaLabelDesc") },
];

const eventRows = () => [
  { name: "sort-change", type: "CustomEvent<{ key, order }>", default: "—", desc: t("sortEvent") },
  {
    name: "selection-change",
    type: "CustomEvent<(string | number)[]>",
    default: "—",
    desc: t("selectionEvent"),
  },
  { name: "row-click", type: "CustomEvent<AiRecordRow>", default: "—", desc: t("rowClickEvent") },
];

const exposeRows = () => [
  { name: "getSelectedIds", desc: t("getMethod") },
  { name: "clearSelection", desc: t("clearMethod") },
  { name: "toggleRow", desc: t("toggleMethod") },
];

defineStyle(
  articleStyles,
  `
  .ai-records-stage { width: min(100%, 860px); }
  .ai-records-note {
    margin: 10px 0 0;
    color: var(--elf-text-secondary, #64748b);
    font-size: 12.5px;
  }
  `,
);

const PageLabsAiRecordsTable = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="AI Records Table" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status">${t("selected")}: ${selectedIds.value.length}</span>
      <div class="ai-records-stage">
        <elf-ai-records-table
          :columns=${recordsColumns}
          :rows=${recordsRows}
          sort-by="company"
          sort-order="asc"
          footer-text="3 count · 3 links"
          @selection-change=${onSelectionChange}
        ></elf-ai-records-table>
        <p class="ai-records-note">${t("selected")}: ${selectedIds.value.length} · Aurora, Blue Fig, Cacao Norte</p>
      </div>
    </elf-playground>
    <elf-api-builder component="elf-ai-records-table" title="API">
    <elf-props-table role="props" :title=${t("props")} :rows=${propRows()}></elf-props-table>
    <elf-props-table role="events" :title=${t("events")} :rows=${eventRows()}></elf-props-table>
    <elf-props-table role="methods" :title=${t("expose")} :rows=${exposeRows()}></elf-props-table>
  </elf-api-builder>
  </elf-container>
`);

export { PageLabsAiRecordsTable };
