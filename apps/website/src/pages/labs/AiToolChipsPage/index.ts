import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "AI Tool Chips 工具胶囊", en: "AI Tool Chips" },
  description: {
    zh: "把 Agent 的工具调用与代码编辑折叠成紧凑胶囊：思考、写代码、构建验证、读图一目了然。",
    en: "Fold tool calls and code edits into compact chips: thinking, writing, building, and reading images at a glance.",
  },
  warning: {
    zh: "实验性 API：条目模型可能在稳定版前调整。",
    en: "Experimental API: the item model may change before stabilization.",
  },
  demo: { zh: "工具调用胶囊组", en: "Tool call chips" },

  status: { zh: "状态", en: "Status" },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  expose: { zh: "方法", en: "Methods" },
  summaryDesc: {
    zh: "摘要文案，如「4 tool calls, 2 messages」。",
    en: "Summary text such as “4 tool calls, 2 messages”.",
  },
  itemsDesc: {
    zh: "条目列表（kind / status / detail / meta）。",
    en: "Items with kind, status, detail, and meta.",
  },
  filesDesc: {
    zh: "文件变更列表（name / additions / deletions）。",
    en: "File changes with name, additions, and deletions.",
  },
  collapsibleDesc: { zh: "允许展开/收起。", en: "Allows expand and collapse." },
  expandedDesc: { zh: "初始展开状态。", en: "Initial expanded state." },
  labelsDesc: { zh: "文案覆盖。", en: "Label overrides." },
  ariaLabelDesc: { zh: "无障碍标签。", en: "Accessible label." },
  toggleEvent: { zh: "展开状态变化。", en: "Expanded state changes." },
  itemClickEvent: { zh: "点击某个条目。", en: "An item is clicked." },
  toggleMethod: { zh: "切换展开状态。", en: "Toggles the expanded state." },
});

const toolItems = [
  { id: 1, kind: "think", title: "Planning the churn schedule…", meta: "Thinking" },
  {
    id: 2,
    kind: "edit",
    title: "Write 204 lines",
    detail: "ChurnSchedule.tsx",
    meta: "Done",
    status: "success",
  },
  {
    id: 3,
    kind: "shell",
    title: "Rebuild and verify",
    detail: "npm run freeze",
    meta: "1.2s",
    status: "success",
  },
  { id: 4, kind: "image", title: "Read image", detail: "flavor-chart.png", meta: "1280 × 720" },
];
const toolFiles = [
  { name: "flavors.css", additions: 13, deletions: 0 },
  { name: "ChurnSchedule.tsx", additions: 74, deletions: 41 },
  { name: "menu.ts", additions: 8, deletions: 2 },
];

const code = `<elf-ai-tool-chips
  summary="4 tool calls, 2 messages"
  :items="items"
  :files="files"
  default-expanded
  @item-click="onItemClick"
/>`;
const script = `const items = [
  { kind: "edit", title: "Write 204 lines", detail: "ChurnSchedule.tsx", status: "success" },
];
const onItemClick = (event) => console.log(event.detail);`;

const propRows = () => [
  { name: "summary", type: "string", default: "''", desc: t("summaryDesc") },
  { name: "items", type: "AiToolChipItem[]", default: "[]", desc: t("itemsDesc") },
  { name: "files", type: "AiToolChipFile[]", default: "[]", desc: t("filesDesc") },
  { name: "collapsible", type: "boolean", default: "true", desc: t("collapsibleDesc") },
  { name: "default-expanded", type: "boolean", default: "false", desc: t("expandedDesc") },
  { name: "labels", type: "Partial<AiToolChipsLabels>", default: "{}", desc: t("labelsDesc") },
  { name: "aria-label", type: "string", default: "''", desc: t("ariaLabelDesc") },
];

const eventRows = () => [
  { name: "toggle", type: "CustomEvent<boolean>", default: "—", desc: t("toggleEvent") },
  {
    name: "item-click",
    type: "CustomEvent<AiToolChipItem>",
    default: "—",
    desc: t("itemClickEvent"),
  },
];

const exposeRows = () => [
  { name: "expand", desc: t("expandedDesc") },
  { name: "collapse", desc: t("expandedDesc") },
  { name: "toggle", desc: t("toggleMethod") },
  { name: "isExpanded", desc: t("toggleMethod") },
];

defineStyle(
  articleStyles,
  `
  .ai-tool-stage { width: min(100%, 640px); }
  `,
);

const PageLabsAiToolChips = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="AI Tool Chips" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status">${t("status")}</span>
      <div class="ai-tool-stage">
        <elf-ai-tool-chips
          summary="4 tool calls, 2 messages"
          :items=${toolItems}
          :files=${toolFiles}
          :default-expanded.prop=${true}
        ></elf-ai-tool-chips>
      </div>
    </elf-playground>
    <elf-api-builder component="elf-ai-tool-chips" title="API">
    <elf-props-table role="props" :title=${t("props")} :rows=${propRows()}></elf-props-table>
    <elf-props-table role="events" :title=${t("events")} :rows=${eventRows()}></elf-props-table>
    <elf-props-table role="methods" :title=${t("expose")} :rows=${exposeRows()}></elf-props-table>
  </elf-api-builder>
  </elf-container>
`);

export { PageLabsAiToolChips };
