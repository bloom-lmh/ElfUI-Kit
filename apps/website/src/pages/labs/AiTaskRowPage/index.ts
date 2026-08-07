import { defineHtml, defineStyle } from "@elfui/core";

import "@elfui/kit/labs";
import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "AI Task Row 任务状态", en: "AI Task Row" },
  description: {
    zh: "Agent 任务状态行：running / completed / failed 三种状态，支持子步骤展开与胶囊形态。",
    en: "Live agent task rows with running / completed / failed states, expandable sub-steps, and a capsule variant.",
  },
  warning: {
    zh: "实验性 API：任务模型与事件名可能在稳定版前调整。",
    en: "Experimental API: the task model and event names may change before stabilization.",
  },
  demo: { zh: "任务队列", en: "Task queue" },

  status: { zh: "状态", en: "Status" },
  retried: { zh: "已触发重试", en: "Retry triggered" },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  expose: { zh: "方法", en: "Methods" },
  taskDesc: {
    zh: "任务数据（标题、副标题、状态、步骤）。",
    en: "Task data with title, subtitle, status, and steps.",
  },
  variantDesc: { zh: "list 或 capsule。", en: "list or capsule." },
  collapsibleDesc: { zh: "允许展开/收起。", en: "Allows expand and collapse." },
  expandedDesc: { zh: "初始展开状态。", en: "Initial expanded state." },
  showRetryDesc: { zh: "失败时显示重试按钮。", en: "Shows retry for failed tasks." },
  labelsDesc: { zh: "文案覆盖。", en: "Label overrides." },
  ariaLabelDesc: { zh: "无障碍标签。", en: "Accessible label." },
  toggleEvent: { zh: "展开状态变化。", en: "Expanded state changes." },
  retryEvent: { zh: "点击重试。", en: "Retry is requested." },
  selectEvent: { zh: "任务被选中。", en: "The task is selected." },
  toggleMethod: { zh: "切换展开状态。", en: "Toggles the expanded state." },
});

const tasks = [
  {
    id: 1,
    title: "Verified vendor records",
    subtitle: "12 suppliers",
    status: "completed",
    steps: [
      { label: "Matched tax and contact IDs", detail: "12/12" },
      { label: "Flagged stale records", detail: "0" },
    ],
  },
  {
    id: 2,
    title: "Build reorder task list",
    subtitle: "7 SKUs",
    status: "running",
    steps: [
      { label: "Reading POS export", detail: "3 files" },
      { label: "Scoring stockout risk", detail: "68%" },
    ],
  },
  {
    id: 3,
    title: "Draft supplier emails",
    subtitle: "2 messages",
    status: "failed",
    steps: [
      { label: "Cone supplier follow-up", detail: "draft" },
      { label: "Pistachio reorder note", detail: "draft" },
    ],
  },
];

const code = `<elf-ai-task-row
  :task="task"
  default-expanded
  @retry="onRetry"
/>`;
const script = `const task = {
  title: "Build reorder task list",
  subtitle: "7 SKUs",
  status: "running",
  steps: [
    { label: "Reading POS export", detail: "3 files" },
    { label: "Scoring stockout risk", detail: "68%" },
  ],
};`;

const propRows = () => [
  { name: "task", type: "AiTaskItem", default: "{}", desc: t("taskDesc") },
  { name: "variant", type: "'list' | 'capsule'", default: "'list'", desc: t("variantDesc") },
  { name: "collapsible", type: "boolean", default: "true", desc: t("collapsibleDesc") },
  { name: "default-expanded", type: "boolean", default: "false", desc: t("expandedDesc") },
  { name: "show-retry", type: "boolean", default: "true", desc: t("showRetryDesc") },
  { name: "labels", type: "Partial<AiTaskRowLabels>", default: "{}", desc: t("labelsDesc") },
  { name: "aria-label", type: "string", default: "''", desc: t("ariaLabelDesc") },
];

const eventRows = () => [
  { name: "toggle", type: "CustomEvent<boolean>", default: "—", desc: t("toggleEvent") },
  { name: "retry", type: "CustomEvent<void>", default: "—", desc: t("retryEvent") },
  { name: "select", type: "CustomEvent<void>", default: "—", desc: t("selectEvent") },
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
  .ai-task-stage {
    display: grid;
    gap: 10px;
    width: min(100%, 640px);
  }
  .ai-task-note {
    margin: 0;
    color: var(--elf-text-secondary, #64748b);
    font-size: 12.5px;
  }
  `,
);

const PageLabsAiTaskRow = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="AI Task Row" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status">${t("status")}</span>
      <div class="ai-task-stage">
        <elf-ai-task-row
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          :default-expanded.prop=${true}
        ></elf-ai-task-row>
      </div>
    </elf-playground>
    <elf-api-builder component="elf-ai-task-row" title="API">
    <elf-props-table role="props" :title=${t("props")} :rows=${propRows()}></elf-props-table>
    <elf-props-table role="events" :title=${t("events")} :rows=${eventRows()}></elf-props-table>
    <elf-props-table role="methods" :title=${t("expose")} :rows=${exposeRows()}></elf-props-table>
  </elf-api-builder>
  </elf-container>
`);

export { PageLabsAiTaskRow };
