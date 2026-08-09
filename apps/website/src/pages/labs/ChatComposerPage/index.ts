import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "Chat Composer 消息输入", en: "Chat Composer" },
  description: {
    zh: "自动撑高的消息输入区：Enter 发送、Shift+Enter 换行、IME 安全、加载时切换为停止按钮。",
    en: "Autosizing message composer: Enter to send, Shift+Enter for a newline, IME-safe, with a stop button while loading.",
  },
  warning: {
    zh: "实验性 API：键盘与模型约定可能在稳定版前调整。",
    en: "Experimental API: keyboard and model conventions may change before stabilization.",
  },

  demo: { zh: "输入与发送", en: "Compose and send" },
  status: { zh: "状态", en: "Status" },
  ready: { zh: "输入后回车发送", en: "Type and press Enter to send" },
  sent: { zh: "已发送：", en: "Sent: " },
  stopHint: { zh: "点击停止可中断生成", en: "Click stop to interrupt generation" },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  expose: { zh: "方法", en: "Methods" },
  modelDesc: { zh: "输入值（v-model）", en: "Input value (v-model)." },
  placeholderDesc: { zh: "占位文案", en: "Placeholder text." },
  disabledDesc: { zh: "禁用输入", en: "Disables input." },
  loadingDesc: { zh: "显示停止按钮并禁用发送", en: "Shows stop and disables sending." },
  maxlengthDesc: { zh: "最大长度，0 表示不限", en: "Maximum length; 0 means unlimited." },
  rowsDesc: { zh: "初始行数", en: "Initial row count." },
  maxRowsDesc: { zh: "自动撑高上限（行数）", en: "Autosize cap in rows." },
  submitOnEnterDesc: {
    zh: "Enter 发送，Shift+Enter 换行",
    en: "Enter sends; Shift+Enter inserts a newline.",
  },
  labelsDesc: { zh: "文案覆盖", en: "Label overrides." },
  ariaLabelDesc: { zh: "无障碍标签", en: "Accessible label." },
  autofocusDesc: { zh: "挂载后聚焦", en: "Focuses on mount." },
  sendEvent: { zh: "发送时返回内容", en: "Returns content when sent." },
  stopEvent: { zh: "点击停止", en: "Emitted when stop is clicked." },
  focusEvent: { zh: "获得焦点", en: "Emitted on focus." },
  blurEvent: { zh: "失去焦点", en: "Emitted on blur." },
  focusMethod: { zh: "聚焦输入框", en: "Focuses the textarea." },
  blurMethod: { zh: "移出焦点", en: "Blurs the textarea." },
  clearMethod: { zh: "清空输入", en: "Clears the draft." },
  getValueMethod: { zh: "返回当前输入", en: "Returns the current draft." },
});

const lastSent = useRef("");
const stopVisible = useRef(false);

const onSend = (event: CustomEvent<string>): void => {
  lastSent.set(event.detail);
  stopVisible.set(true);
  setTimeout(() => stopVisible.set(false), 1200);
};

const code = `<elf-chat-composer
  placeholder="Ask anything..."
  @send="onSend"
  @stop="onStop"
/>`;
const script = `import { registerAllComponents } from "@elfui/kit";

registerAllComponents();

const onSend = (content) => streamToAgent(content);
const onStop = () => abortGeneration();`;

const propRows = () => [
  { name: "model-value", type: "string", default: "''", desc: t("modelDesc") },
  { name: "placeholder", type: "string", default: "Type a message...", desc: t("placeholderDesc") },
  { name: "disabled", type: "boolean", default: "false", desc: t("disabledDesc") },
  { name: "loading", type: "boolean", default: "false", desc: t("loadingDesc") },
  { name: "maxlength", type: "number", default: "0", desc: t("maxlengthDesc") },
  { name: "rows", type: "number", default: "1", desc: t("rowsDesc") },
  { name: "max-rows", type: "number", default: "8", desc: t("maxRowsDesc") },
  { name: "submit-on-enter", type: "boolean", default: "true", desc: t("submitOnEnterDesc") },
  { name: "labels", type: "Partial<ChatComposerLabels>", default: "{}", desc: t("labelsDesc") },
  { name: "aria-label", type: "string", default: "Message input", desc: t("ariaLabelDesc") },
  { name: "autofocus", type: "boolean", default: "false", desc: t("autofocusDesc") },
];

const eventRows = () => [
  { name: "send", type: "CustomEvent<string>", default: "—", desc: t("sendEvent") },
  { name: "stop", type: "CustomEvent<void>", default: "—", desc: t("stopEvent") },
  { name: "focus", type: "CustomEvent<void>", default: "—", desc: t("focusEvent") },
  { name: "blur", type: "CustomEvent<void>", default: "—", desc: t("blurEvent") },
];

const exposeRows = () => [
  { name: "focus", desc: t("focusMethod") },
  { name: "blur", desc: t("blurMethod") },
  { name: "clear", desc: t("clearMethod") },
  { name: "getValue", desc: t("getValueMethod") },
];

defineStyle(
  articleStyles,
  `.composer-stage {
    width: min(100%, 720px);
    margin-inline: auto;
  }
  .composer-sent {
    display: block;
    margin-top: var(--elf-space-2);
    color: var(--elf-text-secondary);
    font-size: 12px;
    line-height: 1.5;
  }`,
);

const PageChatComposer = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="Chat Composer" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status">${t("status")}: ${stopVisible ? t("stopHint") : t("ready")}</span>
      <div class="composer-stage">
        <elf-chat-composer placeholder="Ask anything..." @send=${onSend}></elf-chat-composer>
        <span class="composer-sent" role="status" aria-live="polite">${lastSent ? `${t("sent")} ${lastSent}` : ""}</span>
      </div>
    </elf-playground>
    <elf-api-builder component="elf-chat-composer" title="API">
    <elf-props-table role="props" :title=${t("props")} :rows=${propRows()}></elf-props-table>
    <elf-props-table role="events" :title=${t("events")} :rows=${eventRows()}></elf-props-table>
    <elf-props-table role="methods" :title=${t("expose")} :rows=${exposeRows()}></elf-props-table>
  </elf-api-builder>
  </elf-container>
`);

export { PageChatComposer };
