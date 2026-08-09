import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "Chat Tool Call 工具调用", en: "Chat Tool Call" },
  description: {
    zh: "展示 Agent 的工具调用活动：排队、执行中、成功与失败状态，支持参数/结果折叠查看与失败重试。",
    en: "Show agent tool-call activity: queued, running, success, and error states with collapsible arguments/results and retry.",
  },
  warning: {
    zh: "实验性 API：状态机与事件可能在稳定版前调整。",
    en: "Experimental API: state machine and events may change before stabilization.",
  },

  demo: { zh: "状态与折叠", en: "States and collapse" },
  status: { zh: "四种状态 · 可折叠详情", en: "Four states · collapsible details" },
  pending: { zh: "正在排队", en: "Queued" },
  running: { zh: "正在搜索", en: "Searching" },
  success: { zh: "查询完成", en: "Query finished" },
  failed: { zh: "调用失败", en: "Call failed" },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  expose: { zh: "方法", en: "Methods" },
  nameDesc: { zh: "工具名称", en: "Tool name." },
  statusDesc: { zh: "调用状态", en: "Call status." },
  durationDesc: { zh: "耗时文本", en: "Duration text." },
  argumentsDesc: { zh: "调用参数（JSON 文本）", en: "Call arguments as JSON text." },
  resultDesc: { zh: "返回结果文本", en: "Result text." },
  errorDesc: { zh: "错误信息", en: "Error message." },
  collapsibleDesc: { zh: "允许折叠详情", en: "Allows collapsing details." },
  defaultExpandedDesc: { zh: "默认展开详情", en: "Expands details by default." },
  labelsDesc: { zh: "文案覆盖", en: "Label overrides." },
  ariaLabelDesc: { zh: "无障碍标签", en: "Accessible label." },
  toggleEvent: { zh: "折叠状态变化时返回布尔值", en: "Returns the new expanded state." },
  retryEvent: { zh: "点击重试按钮", en: "Emitted when retry is clicked." },
  expandMethod: { zh: "展开详情", en: "Expands details." },
  collapseMethod: { zh: "折叠详情", en: "Collapses details." },
  toggleMethod: { zh: "切换展开状态", en: "Toggles the expanded state." },
  isExpandedMethod: { zh: "是否展开", en: "Reports whether details are expanded." },
});

const code = `<elf-chat-tool-call
  name="search_web"
  status="success"
  duration="320ms"
  :arguments='{"q":"elfui components"}'
  :result='{"count": 3}'
/>`;
const script = `import { registerAllComponents } from "@elfui/kit";

registerAllComponents();`;

const propRows = () => [
  { name: "name", type: "string", default: "''", desc: t("nameDesc") },
  {
    name: "status",
    type: "pending | running | success | error",
    default: "running",
    desc: t("statusDesc"),
  },
  { name: "duration", type: "string", default: "''", desc: t("durationDesc") },
  { name: "arguments", type: "string", default: "''", desc: t("argumentsDesc") },
  { name: "result", type: "string", default: "''", desc: t("resultDesc") },
  { name: "error", type: "string", default: "''", desc: t("errorDesc") },
  { name: "collapsible", type: "boolean", default: "true", desc: t("collapsibleDesc") },
  { name: "default-expanded", type: "boolean", default: "false", desc: t("defaultExpandedDesc") },
  { name: "labels", type: "Partial<ChatToolCallLabels>", default: "{}", desc: t("labelsDesc") },
  { name: "aria-label", type: "string", default: "''", desc: t("ariaLabelDesc") },
];

const eventRows = () => [
  { name: "toggle", type: "CustomEvent<boolean>", default: "—", desc: t("toggleEvent") },
  { name: "retry", type: "CustomEvent<void>", default: "—", desc: t("retryEvent") },
];

const exposeRows = () => [
  { name: "expand", desc: t("expandMethod") },
  { name: "collapse", desc: t("collapseMethod") },
  { name: "toggle", desc: t("toggleMethod") },
  { name: "isExpanded", desc: t("isExpandedMethod") },
];

defineStyle(
  articleStyles,
  `.tool-call-stage {
    display: grid;
    width: min(100%, 720px);
    gap: 12px;
    margin-inline: auto;
  }`,
);

const PageChatToolCall = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="Chat Tool Call" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status">${t("status")}</span>
      <div class="tool-call-stage">
        <elf-chat-tool-call name="queue_job" status="pending" :arguments='{"job":"report"}'></elf-chat-tool-call>
        <elf-chat-tool-call name="search_web" status="running" :arguments='{"q":"elfui"}' :default-expanded.prop=${true}></elf-chat-tool-call>
        <elf-chat-tool-call name="query_sales" status="success" duration="320ms" :arguments='{"range":"last_week"}' :result='{"total":128400}' :default-expanded.prop=${true}></elf-chat-tool-call>
        <elf-chat-tool-call name="send_email" status="error" :error=${t("failed")} :default-expanded.prop=${true}></elf-chat-tool-call>
      </div>
    </elf-playground>
    <elf-api-builder component="elf-chat-tool-call" title="API">
    <elf-props-table role="props" :title=${t("props")} :rows=${propRows()}></elf-props-table>
    <elf-props-table role="events" :title=${t("events")} :rows=${eventRows()}></elf-props-table>
    <elf-props-table role="methods" :title=${t("expose")} :rows=${exposeRows()}></elf-props-table>
  </elf-api-builder>
  </elf-container>
`);

export { PageChatToolCall };
