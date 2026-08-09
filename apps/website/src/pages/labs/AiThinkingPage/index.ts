import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "AI Thinking 思考轨迹", en: "AI Thinking" },
  description: {
    zh: "可展开的 Agent 思考轨迹：steps / reasoning / search / coding 四类步骤，带类型筛选与运行态动画。",
    en: "Expandable agent traces with steps, reasoning, search, and coding kinds, kind filters, and running-state animation.",
  },
  warning: {
    zh: "实验性 API：步骤模型与事件名可能在稳定版前调整。",
    en: "Experimental API: the step model and event names may change before stabilization.",
  },
  demo: { zh: "Agent 思考过程", en: "Agent trace" },

  status: { zh: "状态", en: "Status" },
  thinking: { zh: "思考中", en: "Thinking" },
  done: { zh: "已完成", en: "Done" },
  reset: { zh: "重置为运行中", en: "Reset to running" },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  expose: { zh: "方法", en: "Methods" },
  titleDesc: { zh: "轨迹标题。", en: "Trace title." },
  stepsDesc: {
    zh: "步骤列表（标题、类型、详情、耗时）。",
    en: "Step list with title, kind, detail, and duration.",
  },
  statusDesc: { zh: "running 或 done。", en: "running or done." },
  collapsibleDesc: { zh: "允许展开/收起。", en: "Allows expand and collapse." },
  expandedDesc: { zh: "初始展开状态。", en: "Initial expanded state." },
  showHeaderDesc: { zh: "显示摘要行。", en: "Shows the summary row." },
  labelsDesc: { zh: "文案覆盖。", en: "Label overrides." },
  ariaLabelDesc: { zh: "无障碍标签。", en: "Accessible label." },
  toggleEvent: { zh: "展开状态变化。", en: "Expanded state changes." },
  toggleMethod: { zh: "切换展开状态。", en: "Toggles the expanded state." },
});

const thinkingStatus = useRef<"running" | "done">("running");

const steps = [
  { id: 1, title: "Reading flavor briefs", kind: "steps" },
  { id: 2, title: "Scanning supplier lists", kind: "search" },
  { id: 3, title: "Comparing tasting notes", kind: "reasoning", detail: "6 flavors" },
  {
    id: 4,
    title: "Writing the scoop report",
    kind: "coding",
    detail: "report.md",
    duration: "1.2s",
  },
];

const code = `<elf-ai-thinking
  title="Thought for 4 seconds"
  :steps="steps"
  status="running"
  default-expanded
/>`;
const script = `const steps = [
  { id: 1, title: "Reading flavor briefs", kind: "steps" },
  { id: 2, title: "Comparing tasting notes", kind: "reasoning", detail: "6 flavors" },
  { id: 3, title: "Writing the report", kind: "coding", duration: "1.2s" },
];`;

const propRows = () => [
  { name: "title", type: "string", default: "'Thought'", desc: t("titleDesc") },
  { name: "steps", type: "AiThinkingStep[]", default: "[]", desc: t("stepsDesc") },
  { name: "status", type: "'running' | 'done'", default: "'running'", desc: t("statusDesc") },
  { name: "collapsible", type: "boolean", default: "true", desc: t("collapsibleDesc") },
  { name: "default-expanded", type: "boolean", default: "false", desc: t("expandedDesc") },
  { name: "show-header", type: "boolean", default: "true", desc: t("showHeaderDesc") },
  { name: "labels", type: "Partial<AiThinkingLabels>", default: "{}", desc: t("labelsDesc") },
  { name: "aria-label", type: "string", default: "''", desc: t("ariaLabelDesc") },
];

const eventRows = () => [
  { name: "toggle", type: "CustomEvent<boolean>", default: "—", desc: t("toggleEvent") },
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
  .ai-thinking-stage { width: min(100%, 640px); }
  .ai-thinking-actions {
    display: flex;
    gap: 8px;
    margin-top: 10px;
  }
  .ai-thinking-actions button {
    padding: 6px 12px;
    border: 1px solid var(--elf-border, #d7dee8);
    border-radius: 8px;
    background: var(--elf-bg-paper, #fff);
    color: var(--elf-text-secondary, #64748b);
    cursor: pointer;
    font: 600 12px/1.4 var(--elf-font-family, sans-serif);
  }
  `,
);

const PageLabsAiThinking = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="AI Thinking" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status">${t("status")}: ${thinkingStatus.value === "running" ? t("thinking") : t("done")}</span>
      <div class="ai-thinking-stage">
        <elf-ai-thinking
          title="Thought for 4 seconds"
          :steps=${steps}
          :status=${thinkingStatus.value}
          :default-expanded.prop=${true}
        ></elf-ai-thinking>
        <div class="ai-thinking-actions">
          <button @click=${() => thinkingStatus.set("running")}>${t("thinking")}</button>
          <button @click=${() => thinkingStatus.set("done")}>${t("done")}</button>
        </div>
      </div>
    </elf-playground>
    <elf-api-builder component="elf-ai-thinking" title="API">
    <elf-props-table role="props" :title=${t("props")} :rows=${propRows()}></elf-props-table>
    <elf-props-table role="events" :title=${t("events")} :rows=${eventRows()}></elf-props-table>
    <elf-props-table role="methods" :title=${t("expose")} :rows=${exposeRows()}></elf-props-table>
  </elf-api-builder>
  </elf-container>
`);

export { PageLabsAiThinking };
