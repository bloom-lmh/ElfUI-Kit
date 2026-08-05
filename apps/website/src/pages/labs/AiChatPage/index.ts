import { defineHtml, defineStyle, useRef } from "@elfui/core";

import type { AIChatMessageItem } from "@elfui/kit/labs";
import "@elfui/kit/labs";
import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "AI Chat 智能对话", en: "AI Chat" },
  description: {
    zh: "快速搭建 AI Agent 客户端：消息流、流式输出、工具调用卡片与输入区一体化的对话面板。",
    en: "Build AI agent clients fast: a conversation panel with message flow, streaming output, tool-call cards, and a composer.",
  },
  warning: {
    zh: "实验性 API：消息模型与事件名称可能在稳定版前调整。",
    en: "Experimental API: the message model and event names may change before stabilization.",
  },

  demo: { zh: "Agent 对话工作台", en: "Agent chat workbench" },
  status: { zh: "状态", en: "Status" },
  ready: { zh: "等待输入", en: "Ready" },
  thinking: { zh: "Agent 正在思考…", en: "Agent is thinking…" },
  userMessage: { zh: "帮我查一下上周的销售额", en: "Look up last week's revenue" },
  welcome: {
    zh: "你好，我是 ElfUI Agent。试着让我查询数据或执行工具。",
    en: "Hi, I'm the ElfUI Agent. Ask me to query data or run a tool.",
  },
  assistantReply: {
    zh: "我查询了销售数据库，上周总销售额为 128,400 元，环比增长 12%。",
    en: "I queried the sales database: last week's revenue was 128,400, up 12% week over week.",
  },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  slots: { zh: "插槽", en: "Slots" },
  expose: { zh: "方法", en: "Methods" },
  itemsDesc: {
    zh: "消息列表（用户、助手、系统与工具调用）",
    en: "Message list with user, assistant, system, and tool calls.",
  },
  loadingDesc: {
    zh: "显示输入中指示器并禁用发送",
    en: "Shows the typing indicator and disables sending.",
  },
  titleDesc: { zh: "面板标题", en: "Panel title." },
  subtitleDesc: { zh: "面板副标题", en: "Panel subtitle." },
  placeholderDesc: { zh: "输入框占位文案", en: "Composer placeholder text." },
  disabledDesc: { zh: "禁用输入", en: "Disables the composer." },
  heightDesc: { zh: "面板高度（CSS 尺寸）", en: "Panel height as a CSS size." },
  emptyTextDesc: { zh: "空状态文案", en: "Empty-state text." },
  showHeaderDesc: { zh: "显示头部", en: "Shows the header." },
  autofocusDesc: { zh: "挂载后聚焦输入框", en: "Focuses the composer on mount." },
  labelsDesc: { zh: "文案覆盖（clear/empty/typing）", en: "Label overrides (clear/empty/typing)." },
  ariaLabelDesc: { zh: "无障碍标签", en: "Accessible label." },
  sendDesc: { zh: "发送消息时返回内容", en: "Returns content when a message is sent." },
  stopDesc: { zh: "点击停止生成按钮", en: "Emitted when stop is requested." },
  clearDesc: { zh: "点击清空按钮", en: "Emitted when the conversation is cleared." },
  messageCopyDesc: { zh: "复制某条消息", en: "Emitted when a message is copied." },
  retryDesc: { zh: "重试失败的工具调用", en: "Emitted when a failed tool call is retried." },
  welcomeSlot: { zh: "空状态欢迎内容", en: "Welcome content for the empty state." },
  headerExtraSlot: { zh: "头部右侧扩展", en: "Extra header actions." },
  composerSlot: { zh: "替换内置输入区", en: "Replaces the built-in composer." },
  clearMethod: { zh: "发出 clear 事件", en: "Emits the clear event." },
  scrollMethod: { zh: "滚动到底部", en: "Scrolls the message log to the bottom." },
  focusMethod: { zh: "聚焦输入框", en: "Focuses the composer." },
  countMethod: { zh: "返回消息数量", en: "Returns the number of messages." },
});

const initialItems = (): AIChatMessageItem[] => [
  { id: 1, role: "assistant", content: t("welcome") },
];

const items = useRef<AIChatMessageItem[]>(initialItems());
const loading = useRef(false);
let replyTimer: ReturnType<typeof setTimeout> | null = null;

const onSend = (event: CustomEvent<string>): void => {
  const content = event.detail;
  if (!content) return;
  items.set([
    ...items.value,
    { id: `user-${Date.now()}`, role: "user", content, time: new Date().toLocaleTimeString() },
  ]);
  loading.set(true);
  if (replyTimer) clearTimeout(replyTimer);
  replyTimer = setTimeout(() => {
    items.set([
      ...items.value,
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: t("assistantReply"),
        time: new Date().toLocaleTimeString(),
        toolCalls: [
          {
            id: `tool-${Date.now()}`,
            name: "query_sales",
            status: "success",
            duration: "320ms",
            arguments: '{"range":"last_week","metric":"revenue"}',
            result: '{"total":128400,"growth":0.12}',
          },
        ],
      },
    ]);
    loading.set(false);
  }, 1100);
};

const onStop = (): void => {
  if (replyTimer) clearTimeout(replyTimer);
  loading.set(false);
};

const onClear = (): void => {
  items.set(initialItems());
  loading.set(false);
};

const onRetry = (): void => {
  loading.set(true);
  if (replyTimer) clearTimeout(replyTimer);
  replyTimer = setTimeout(() => loading.set(false), 700);
};

const code = `<elf-ai-chat
  :items="items"
  :loading="loading"
  title="Support Agent"
  placeholder="Ask anything..."
  @send="onSend"
  @stop="onStop"
  @retry="onRetry"
/>`;
const script = `const items = ref([
  { id: 1, role: "assistant", content: "Hi, I'm your agent." }
]);
const loading = ref(false);
const onSend = (content) => {
  items.value.push({ id: Date.now(), role: "user", content });
  loading.value = true;
  // call your agent runtime, then push the reply
};`;

const propRows = () => [
  { name: "items", type: "AIChatMessageItem[]", default: "[]", desc: t("itemsDesc") },
  { name: "loading", type: "boolean", default: "false", desc: t("loadingDesc") },
  { name: "title", type: "string", default: "AI Assistant", desc: t("titleDesc") },
  { name: "subtitle", type: "string", default: "''", desc: t("subtitleDesc") },
  { name: "placeholder", type: "string", default: "Type a message...", desc: t("placeholderDesc") },
  { name: "disabled", type: "boolean", default: "false", desc: t("disabledDesc") },
  { name: "height", type: "string", default: "560px", desc: t("heightDesc") },
  { name: "empty-text", type: "string", default: "''", desc: t("emptyTextDesc") },
  { name: "show-header", type: "boolean", default: "true", desc: t("showHeaderDesc") },
  { name: "autofocus", type: "boolean", default: "false", desc: t("autofocusDesc") },
  { name: "labels", type: "Partial<AIChatLabels>", default: "{}", desc: t("labelsDesc") },
  { name: "aria-label", type: "string", default: "''", desc: t("ariaLabelDesc") },
];

const eventRows = () => [
  { name: "send", type: "CustomEvent<string>", default: "—", desc: t("sendDesc") },
  { name: "stop", type: "CustomEvent<void>", default: "—", desc: t("stopDesc") },
  { name: "clear", type: "CustomEvent<void>", default: "—", desc: t("clearDesc") },
  {
    name: "message-copy",
    type: "CustomEvent<{ item, content }>",
    default: "—",
    desc: t("messageCopyDesc"),
  },
  { name: "retry", type: "CustomEvent<AIChatToolCallItem>", default: "—", desc: t("retryDesc") },
];

const slotRows = () => [
  { name: "welcome", desc: t("welcomeSlot") },
  { name: "header-extra", desc: t("headerExtraSlot") },
  { name: "composer", desc: t("composerSlot") },
];

const exposeRows = () => [
  { name: "clear", desc: t("clearMethod") },
  { name: "scrollToBottom", desc: t("scrollMethod") },
  { name: "focus", desc: t("focusMethod") },
  { name: "getItemCount", desc: t("countMethod") },
];

defineStyle(articleStyles, `.ai-chat-stage { width: min(100%, 760px); margin-inline: auto; }`);

const PageAiChat = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="AI Chat" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status">${t("status")}: ${loading ? t("thinking") : t("ready")}</span>
      <div class="ai-chat-stage">
        <elf-ai-chat
          :items=${items.value}
          :loading=${loading}
          title="ElfUI Agent"
          subtitle="sales · analytics"
          height="520px"
          :autofocus.prop=${false}
          @send=${onSend}
          @stop=${onStop}
          @clear=${onClear}
          @retry=${onRetry}
        ></elf-ai-chat>
      </div>
    </elf-playground>
    <h2>${t("api")}</h2>
    <elf-props-table :title=${t("props")} :rows=${propRows()}></elf-props-table>
    <elf-props-table :title=${t("events")} :rows=${eventRows()}></elf-props-table>
    <elf-props-table :title=${t("slots")} :rows=${slotRows()}></elf-props-table>
    <elf-props-table :title=${t("expose")} :rows=${exposeRows()}></elf-props-table>
  </elf-container>
`);

export { PageAiChat };
