import { defineHtml, defineStyle, useRef, useTemplateRef } from "@elfui/core";

import "@elfui/kit/labs";
import type { AiStreamingTextElement } from "@elfui/kit/labs";
import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "AI Streaming Text 流式回答", en: "AI Streaming Text" },
  description: {
    zh: "带内联来源、操作按钮与追问建议的流式 AI 回答，可整段替换或逐词流式展示。",
    en: "Streamed AI answers with inline sources, action chips, and follow-up suggestions, fully replaceable via slots.",
  },
  warning: {
    zh: "实验性 API：流式状态机与事件名可能在稳定版前调整。",
    en: "Experimental API: the streaming state machine and event names may change.",
  },
  demo: { zh: "流式回答 + 来源 + 追问", en: "Streamed answer with sources and follow-ups" },

  status: { zh: "状态", en: "Status" },
  streaming: { zh: "流式中", en: "Streaming" },
  complete: { zh: "已完成", en: "Complete" },
  replay: { zh: "重新播放", en: "Replay" },
  lastAction: { zh: "最近操作", en: "Last action" },
  lastFollowUp: { zh: "最近追问", en: "Last follow-up" },
  none: { zh: "无", en: "None" },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  expose: { zh: "方法", en: "Methods" },
  contentDesc: { zh: "回答正文。", en: "Answer content." },
  sourcesDesc: {
    zh: "来源列表（label / url / domain）。",
    en: "Source list with label, url, and domain.",
  },
  actionsDesc: {
    zh: "操作按钮列表（label / value / tone）。",
    en: "Action chips with label, value, and tone.",
  },
  followUpsDesc: { zh: "追问建议列表。", en: "Follow-up suggestions." },
  streamingDesc: { zh: "启用逐词流式展示。", en: "Enables word-by-word streaming." },
  speedDesc: { zh: "每个词之间的毫秒数。", en: "Milliseconds between revealed words." },
  showDesc: { zh: "分别控制来源 / 操作 / 追问区域。", en: "Toggles each region independently." },
  labelsDesc: { zh: "文案覆盖。", en: "Label overrides." },
  ariaLabelDesc: { zh: "无障碍标签。", en: "Accessible label." },
  actionEvent: { zh: "点击操作按钮。", en: "An action chip is clicked." },
  followUpEvent: { zh: "点击追问建议。", en: "A follow-up is clicked." },
  completeEvent: { zh: "全部内容已展示。", en: "All words are revealed." },
  revealMethod: { zh: "立即展示全文。", en: "Reveals the full answer immediately." },
  resetMethod: { zh: "重置到开头。", en: "Resets to the start." },
});

const streamStatus = useRef<"streaming" | "complete">("streaming");
const lastAction = useRef("");
const lastFollowUp = useRef("");
const streamEl = useTemplateRef<AiStreamingTextElement>("stream");
const onActionClick = (event: CustomEvent<{ value: string }>): void => {
  lastAction.set(event.detail.value);
};
const onFollowUpClick = (event: CustomEvent<string>): void => {
  lastFollowUp.set(event.detail);
};

const sources = [
  { label: "Scoop Data", url: "https://scoopdata.io/", domain: "scoopdata.io" },
  { label: "Trends Index", url: "https://trends.google.com/", domain: "trends.google.com" },
  { label: "Market Basket", url: "https://marketbasket.io/", domain: "marketbasket.io" },
];
const actions = [
  { label: "View chart", value: "chart", tone: "primary" },
  { label: "Export", value: "export" },
  { label: "Share", value: "share", tone: "ghost" },
];
const followUps = ["Which flavors sell best in winter?", "Compare gelato and soft serve margins"];
const answer =
  "Pistachio is your fastest-growing flavor — sales are up 23% this month and margins beat vanilla by 8 points. Stone-fruit flavors are trending in the same range.";

const code = `<elf-ai-streaming-text
  content="Pistachio is your fastest-growing flavor…"
  :sources="sources"
  :actions="actions"
  :follow-ups="followUps"
  streaming
  @action="onAction"
  @follow-up="onFollowUp"
/>`;
const script = `const sources = [
  { label: "Scoop Data", url: "https://scoopdata.io", domain: "scoopdata.io" },
];
const onAction = (event) => console.log(event.detail);`;

const propRows = () => [
  { name: "content", type: "string", default: "''", desc: t("contentDesc") },
  { name: "sources", type: "AiStreamSource[]", default: "[]", desc: t("sourcesDesc") },
  { name: "actions", type: "AiStreamAction[]", default: "[]", desc: t("actionsDesc") },
  { name: "follow-ups", type: "string[]", default: "[]", desc: t("followUpsDesc") },
  { name: "streaming", type: "boolean", default: "false", desc: t("streamingDesc") },
  { name: "stream-speed", type: "number", default: "40", desc: t("speedDesc") },
  {
    name: "show-sources",
    type: "boolean",
    default: "true",
    desc: t("showDesc"),
  },
  {
    name: "show-actions",
    type: "boolean",
    default: "true",
    desc: t("showDesc"),
  },
  {
    name: "show-follow-ups",
    type: "boolean",
    default: "true",
    desc: t("showDesc"),
  },
  { name: "labels", type: "Partial<AiStreamingTextLabels>", default: "{}", desc: t("labelsDesc") },
  { name: "aria-label", type: "string", default: "''", desc: t("ariaLabelDesc") },
];

const eventRows = () => [
  { name: "action", type: "CustomEvent<AiStreamAction>", default: "—", desc: t("actionEvent") },
  { name: "follow-up", type: "CustomEvent<string>", default: "—", desc: t("followUpEvent") },
  { name: "complete", type: "CustomEvent<void>", default: "—", desc: t("completeEvent") },
];

const exposeRows = () => [
  { name: "revealAll", desc: t("revealMethod") },
  { name: "reset", desc: t("resetMethod") },
];

defineStyle(
  articleStyles,
  `
  .ai-stream-stage {
    display: grid;
    gap: 12px;
    width: min(100%, 720px);
    padding: 18px;
    border: 1px solid var(--elf-border, #d7dee8);
    border-radius: 14px;
    background: var(--elf-bg-paper, #fff);
  }
  .ai-stream-actions {
    display: flex;
    gap: 8px;
  }
  .ai-stream-actions button {
    padding: 6px 12px;
    border: 1px solid var(--elf-border, #d7dee8);
    border-radius: 8px;
    background: transparent;
    color: var(--elf-text-secondary, #64748b);
    cursor: pointer;
    font: 600 12px/1.4 var(--elf-font-family, sans-serif);
  }
  `,
);

const PageLabsAiStreamingText = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="AI Streaming Text" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status">${t("status")}: ${streamStatus.value === "streaming" ? t("streaming") : t("complete")}</span>
      <div class="ai-stream-stage">
        <elf-ai-streaming-text
          ref="stream"
          :content=${answer}
          :sources=${sources}
          :actions=${actions}
          :follow-ups=${followUps}
          :streaming.prop=${streamStatus.value === "streaming"}
          :stream-speed.prop=${35}
          @action=${onActionClick}
          @follow-up=${onFollowUpClick}
          @complete=${() => streamStatus.set("complete")}
        ></elf-ai-streaming-text>
        <div class="ai-stream-actions">
          <button @click=${() => {
            streamStatus.set("streaming");
            streamEl.value?.reset?.();
          }}>${t("replay")}</button>
        </div>
        <p class="ai-stream-note">${t("lastAction")}: ${lastAction || t("none")} · ${t("lastFollowUp")}: ${lastFollowUp || t("none")}</p>
      </div>
    </elf-playground>
    <elf-api-builder component="elf-ai-streaming-text" title="API">
    <elf-props-table role="props" :title=${t("props")} :rows=${propRows()}></elf-props-table>
    <elf-props-table role="events" :title=${t("events")} :rows=${eventRows()}></elf-props-table>
    <elf-props-table role="methods" :title=${t("expose")} :rows=${exposeRows()}></elf-props-table>
  </elf-api-builder>
  </elf-container>
`);

export { PageLabsAiStreamingText };
