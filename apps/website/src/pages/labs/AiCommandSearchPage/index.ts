import { defineHtml, defineStyle, useRef } from "@elfui/core";

import "@elfui/kit/labs";
import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "AI Command Search 命令搜索", en: "AI Command Search" },
  description: {
    zh: "Agent 命令面板：实时过滤、键盘导航、空状态与提交事件，可快速搭建 / 快捷键搜索。",
    en: "Agent command palette with live filtering, keyboard navigation, an empty state, and submit events.",
  },
  warning: {
    zh: "实验性 API：命令模型与事件名可能在稳定版前调整。",
    en: "Experimental API: the command model and event names may change before stabilization.",
  },
  demo: { zh: "命令面板", en: "Command palette" },

  status: { zh: "状态", en: "Status" },
  lastCommand: { zh: "最近命令", en: "Last command" },
  none: { zh: "无", en: "None" },
  hintLine: {
    zh: "↑↓ 选择 · Enter 执行 · Esc 清空",
    en: "↑↓ to navigate · Enter to run · Esc to clear",
  },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  expose: { zh: "方法", en: "Methods" },
  itemsDesc: {
    zh: "命令列表（标题、描述、提示、关键词）。",
    en: "Command items with title, description, hint, and keywords.",
  },
  placeholderDesc: { zh: "输入占位文案。", en: "Input placeholder." },
  emptyTextDesc: { zh: "空状态文案。", en: "Empty-state text." },
  maxResultsDesc: { zh: "最大结果数。", en: "Maximum result count." },
  autofocusDesc: { zh: "挂载后聚焦。", en: "Focuses on mount." },
  labelsDesc: { zh: "文案覆盖。", en: "Label overrides." },
  ariaLabelDesc: { zh: "无障碍标签。", en: "Accessible label." },
  selectEvent: { zh: "选中某个命令。", en: "A command is selected." },
  queryChangeEvent: { zh: "查询文本变化。", en: "The query text changes." },
  submitEvent: {
    zh: "回车提交（含选中的命令或原始查询）。",
    en: "Enter submits the query with the active command.",
  },
  focusMethod: { zh: "聚焦输入框。", en: "Focuses the input." },
  blurMethod: { zh: "失焦。", en: "Blurs the input." },
  clearMethod: { zh: "清空查询并聚焦。", en: "Clears the query and focuses." },
  getQueryMethod: { zh: "返回当前查询。", en: "Returns the current query." },
});

const lastCommand = useRef("");
const onSelectCommand = (event: CustomEvent<{ title: string }>): void => {
  lastCommand.set(event.detail.title);
};
const commandItems = [
  { id: 1, title: "Forecast summer demand", description: "Seasonal ice cream", hint: "forecast" },
  {
    id: 2,
    title: "Find waffle cone suppliers",
    description: "Cold-chain verified",
    hint: "supplier",
  },
  {
    id: 3,
    title: "Compare seasonal flavors",
    description: "Mint chip vs pistachio",
    hint: "compare",
  },
  {
    id: 4,
    title: "Draft flavor launch plan",
    description: "Three-flavor core line",
    hint: "launch",
  },
  { id: 5, title: "Check cold-chain status", description: "Dairy onboarding SOP", hint: "status" },
];

const code = `<elf-ai-command-search
  :items="items"
  placeholder="Search flavors…"
  @select="onSelect"
/>`;
const script = `const items = [
  { id: 1, title: "Forecast summer demand", keywords: "summer" },
];
const onSelect = (event) => {
  console.log(event.detail);
};`;

const propRows = () => [
  { name: "items", type: "AiCommandItem[]", default: "[]", desc: t("itemsDesc") },
  { name: "placeholder", type: "string", default: "''", desc: t("placeholderDesc") },
  { name: "empty-text", type: "string", default: "''", desc: t("emptyTextDesc") },
  { name: "max-results", type: "number", default: "8", desc: t("maxResultsDesc") },
  { name: "autofocus", type: "boolean", default: "false", desc: t("autofocusDesc") },
  { name: "labels", type: "Partial<AiCommandLabels>", default: "{}", desc: t("labelsDesc") },
  { name: "aria-label", type: "string", default: "'Command search'", desc: t("ariaLabelDesc") },
];

const eventRows = () => [
  { name: "select", type: "CustomEvent<AiCommandItem>", default: "—", desc: t("selectEvent") },
  { name: "query-change", type: "CustomEvent<string>", default: "—", desc: t("queryChangeEvent") },
  { name: "submit", type: "CustomEvent<{ query, item }>", default: "—", desc: t("submitEvent") },
];

const exposeRows = () => [
  { name: "focus", desc: t("focusMethod") },
  { name: "blur", desc: t("blurMethod") },
  { name: "clear", desc: t("clearMethod") },
  { name: "getQuery", desc: t("getQueryMethod") },
];

defineStyle(
  articleStyles,
  `
  .ai-search-stage {
    display: grid;
    gap: 14px;
    width: min(100%, 560px);
  }
  .ai-search-note {
    margin: 0;
    color: var(--elf-text-secondary, #64748b);
    font-size: 12.5px;
  }
  `,
);

const PageLabsAiCommandSearch = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="AI Command Search" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status">${t("lastCommand")}: ${lastCommand || t("none")}</span>
      <div class="ai-search-stage">
        <elf-ai-command-search
          :items=${commandItems}
          placeholder="Search flavors…"
          :autofocus.prop=${true}
          @select=${onSelectCommand}
        ></elf-ai-command-search>
        <p class="ai-search-note">${t("hintLine")}</p>
      </div>
    </elf-playground>
    <h2>${t("api")}</h2>
    <elf-props-table :title=${t("props")} :rows=${propRows()}></elf-props-table>
    <elf-props-table :title=${t("events")} :rows=${eventRows()}></elf-props-table>
    <elf-props-table :title=${t("expose")} :rows=${exposeRows()}></elf-props-table>
  </elf-container>
`);

export { PageLabsAiCommandSearch };
