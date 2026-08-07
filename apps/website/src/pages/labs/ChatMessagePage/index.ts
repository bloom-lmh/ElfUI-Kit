import { defineHtml, defineStyle } from "@elfui/core";

import "@elfui/kit/labs";
import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "Chat Message 消息气泡", en: "Chat Message" },
  description: {
    zh: "带角色语义的单条对话气泡：用户、助手、系统与工具角色，支持流式光标、错误状态和一键复制。",
    en: "A single role-aware chat bubble: user, assistant, system, and tool roles with streaming caret, error state, and copy.",
  },
  warning: {
    zh: "实验性 API：角色与状态模型可能在稳定版前调整。",
    en: "Experimental API: role and status models may change before stabilization.",
  },

  demo: { zh: "角色与状态", en: "Roles and states" },
  status: { zh: "四种角色 · 三种状态", en: "Four roles · three states" },
  user: { zh: "帮我总结这份文档", en: "Summarize this document" },
  assistant: {
    zh: "文档包含 12 个组件类别，核心 API 围绕 Provider 与指令展开。",
    en: "The document covers 12 component categories built around Providers and directives.",
  },
  system: {
    zh: "系统提示：仅使用工具返回值作答",
    en: "System note: answer only from tool results",
  },
  streaming: { zh: "正在生成回答", en: "Generating the answer" },
  tool: { zh: "已调用 search_web 工具", en: "Called the search_web tool" },
  error: { zh: "请求超时，请稍后重试", en: "The request timed out, please retry." },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  expose: { zh: "方法", en: "Methods" },
  roleDesc: { zh: "消息角色", en: "Message role." },
  shapeDesc: {
    zh: "气泡形状：rounded / sharp / glass / terminal / outline",
    en: "Bubble shape: rounded / sharp / glass / terminal / outline.",
  },
  contentDesc: {
    zh: "纯文本内容（可用默认插槽替换）",
    en: "Plain-text content; replace via the default slot.",
  },
  nameDesc: { zh: "显示名称，缺省时使用角色名", en: "Display name; falls back to the role label." },
  timeDesc: { zh: "时间戳文本", en: "Timestamp text." },
  statusDesc: { zh: "消息状态", en: "Message status." },
  errorDesc: {
    zh: "错误详情（status=error 时显示）",
    en: "Error detail shown when status is error.",
  },
  copyableDesc: { zh: "显示复制按钮", en: "Shows the copy button." },
  avatarDesc: { zh: "自定义头像文本", en: "Custom avatar text." },
  labelsDesc: { zh: "文案覆盖", en: "Label overrides." },
  ariaLabelDesc: { zh: "无障碍标签", en: "Accessible label." },
  copyEvent: { zh: "复制成功后返回内容", en: "Returns content after a successful copy." },
  copyErrorEvent: { zh: "复制失败", en: "Emitted when copying fails." },
  copyMethod: { zh: "复制内容并返回是否成功", en: "Copies content and reports success." },
  shapes: { zh: "气泡形状", en: "Bubble shapes" },
  shapesStatus: { zh: "五种 AI 风格气泡", en: "Five AI-flavored bubble shapes" },
  glassText: {
    zh: "玻璃拟态让助手回答浮在界面上，适合沉浸式对话。",
    en: "Glassmorphism keeps assistant replies floating above the UI for immersive chats.",
  },
  terminalText: {
    zh: "等宽字体 + 左侧强调线，像终端里跑出来的回答。",
    en: "Monospace type with an accent edge, as if the answer came from a terminal.",
  },
  outlineText: {
    zh: "描边气泡：轻量、透明，适合嵌入表格或仪表盘。",
    en: "Outlined bubble: light and transparent, great inside tables or dashboards.",
  },
  sharpText: {
    zh: "锐利直角更紧凑，适合工具型消息流。",
    en: "Sharp corners stay compact for tool-oriented message streams.",
  },
});

const code = `<elf-chat-message
  role="assistant"
  content="Hello! How can I help?"
  status="streaming"
  shape="glass"
/>`;
const script = `import "@elfui/kit/labs";`;

const propRows = () => [
  {
    name: "role",
    type: "user | assistant | system | tool",
    default: "assistant",
    desc: t("roleDesc"),
  },
  {
    name: "shape",
    type: "rounded | sharp | glass | terminal | outline",
    default: "rounded",
    desc: t("shapeDesc"),
  },
  { name: "content", type: "string", default: "''", desc: t("contentDesc") },
  { name: "name", type: "string", default: "''", desc: t("nameDesc") },
  { name: "time", type: "string", default: "''", desc: t("timeDesc") },
  {
    name: "status",
    type: "complete | streaming | error",
    default: "complete",
    desc: t("statusDesc"),
  },
  { name: "error", type: "string", default: "''", desc: t("errorDesc") },
  { name: "copyable", type: "boolean", default: "true", desc: t("copyableDesc") },
  { name: "avatar", type: "string", default: "''", desc: t("avatarDesc") },
  { name: "labels", type: "Partial<ChatMessageLabels>", default: "{}", desc: t("labelsDesc") },
  { name: "aria-label", type: "string", default: "''", desc: t("ariaLabelDesc") },
];

const eventRows = () => [
  { name: "copy", type: "CustomEvent<{ content: string }>", default: "—", desc: t("copyEvent") },
  { name: "copy-error", type: "CustomEvent<unknown>", default: "—", desc: t("copyErrorEvent") },
];

const exposeRows = () => [{ name: "copy", desc: t("copyMethod") }];

defineStyle(
  articleStyles,
  `.chat-message-stage {
    display: grid;
    width: min(100%, 720px);
    gap: 14px;
    margin-inline: auto;
  }
  .chat-message-shapes {
    display: grid;
    width: min(100%, 720px);
    gap: 14px;
    margin-inline: auto;
  }`,
);

const PageChatMessage = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="Chat Message" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status">${t("status")}</span>
      <div class="chat-message-stage">
        <elf-chat-message role="user" :content=${t("user")} name="Alex" time="10:24"></elf-chat-message>
        <elf-chat-message role="assistant" :content=${t("assistant")} time="10:24"></elf-chat-message>
        <elf-chat-message role="system" :content=${t("system")} time="10:24"></elf-chat-message>
        <elf-chat-message role="assistant" :content=${t("streaming")} status="streaming"></elf-chat-message>
        <elf-chat-message role="tool" :content=${t("tool")}></elf-chat-message>
        <elf-chat-message role="assistant" :content=${t("error")} status="error" :error=${t("error")}></elf-chat-message>
      </div>
    </elf-playground>
    <elf-playground :title=${t("shapes")} :code=${code} :script=${script}>
      <span slot="status">${t("shapesStatus")}</span>
      <div class="chat-message-shapes">
        <elf-chat-message role="assistant" :content=${t("assistant")} name="Echo" shape="rounded"></elf-chat-message>
        <elf-chat-message role="assistant" :content=${t("sharpText")} name="Razor" shape="sharp"></elf-chat-message>
        <elf-chat-message role="assistant" :content=${t("glassText")} name="Halo" shape="glass"></elf-chat-message>
        <elf-chat-message role="assistant" :content=${t("terminalText")} name="Term" shape="terminal"></elf-chat-message>
        <elf-chat-message role="user" :content=${t("outlineText")} name="Mina" shape="outline"></elf-chat-message>
      </div>
    </elf-playground>
    <elf-api-builder component="elf-chat-message" title="API">
    <elf-props-table role="props" :title=${t("props")} :rows=${propRows()}></elf-props-table>
    <elf-props-table role="events" :title=${t("events")} :rows=${eventRows()}></elf-props-table>
    <elf-props-table role="methods" :title=${t("expose")} :rows=${exposeRows()}></elf-props-table>
  </elf-api-builder>
  </elf-container>
`);

export { PageChatMessage };
