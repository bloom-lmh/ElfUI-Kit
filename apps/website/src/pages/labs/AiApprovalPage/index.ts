import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "AI Approval Card 确认卡片", en: "AI Approval Card" },
  description: {
    zh: "人类在环确认卡片：Agent 在执行前向用户提问，支持预设选项、自定义答案与多问题分页。",
    en: "Human-in-the-loop approvals: the agent asks before acting, with preset options, custom answers, and paged questions.",
  },
  warning: {
    zh: "实验性 API：答案模型与事件名可能在稳定版前调整。",
    en: "Experimental API: the answer model and event names may change before stabilization.",
  },
  demo: { zh: "Agent 执行前确认", en: "Pre-action approval" },

  status: { zh: "状态", en: "Status" },
  waiting: { zh: "等待确认", en: "Waiting for approval" },
  confirmed: { zh: "已确认", en: "Confirmed" },
  lastAnswer: { zh: "最近确认", en: "Last confirmed" },
  none: { zh: "无", en: "None" },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  expose: { zh: "方法", en: "Methods" },
  questionsDesc: {
    zh: "问题列表（标题、选项、自定义占位符）。",
    en: "Question list with title, options, and custom placeholder.",
  },
  defaultIndexDesc: { zh: "初始问题下标。", en: "Initial question index." },
  confirmLabelDesc: { zh: "覆盖确认按钮文案。", en: "Overrides the confirm button label." },
  dismissLabelDesc: { zh: "覆盖关闭按钮文案。", en: "Overrides the dismiss button label." },
  requiredDesc: { zh: "必须选择或填写后才能确认。", en: "Requires an answer before confirming." },
  showProgressDesc: { zh: "显示上一步/下一步与页码。", en: "Shows previous/next and page count." },
  labelsDesc: { zh: "文案覆盖。", en: "Label overrides." },
  ariaLabelDesc: { zh: "无障碍标签。", en: "Accessible label." },
  confirmEvent: { zh: "确认答案，返回答案详情。", en: "An answer is confirmed with details." },
  dismissEvent: { zh: "用户关闭当前问题。", en: "The current question is dismissed." },
  changeEvent: { zh: "选择或输入变化。", en: "Selection or custom input changes." },
  questionChangeEvent: { zh: "切换问题下标。", en: "The question index changes." },
  nextMethod: { zh: "前往下一个问题。", en: "Moves to the next question." },
  previousMethod: { zh: "返回上一个问题。", en: "Moves to the previous question." },
  confirmMethod: { zh: "尝试确认当前答案。", en: "Attempts to confirm the current answer." },
  resetMethod: {
    zh: "重置到初始问题并清空答案。",
    en: "Resets to the initial question and clears answers.",
  },
});

const lastAnswer = useRef("");
const onConfirmAnswer = (event: CustomEvent<{ value: string }>): void => {
  lastAnswer.set(event.detail.value);
};
const questions = [
  {
    id: 1,
    title: "How many flavors should we launch?",
    description:
      "Your weekly sales data supports a small core line, but the full case hedges against weekend spikes.",
    options: [
      { label: "Three (core line)", value: "three" },
      { label: "Five (full case)", value: "five" },
      { label: "Just one hero", value: "one" },
    ],
    customPlaceholder: "Type something…",
  },
  {
    id: 2,
    title: "Which market should launch first?",
    options: [
      { label: "Home city", value: "home" },
      { label: "Tourist district", value: "tourist" },
    ],
  },
];

const code = `<elf-ai-approval-card
  :questions="questions"
  @confirm="onConfirm"
  @dismiss="onDismiss"
/>`;
const script = `const questions = [
  {
    title: "How many flavors should we launch?",
    options: [
      { label: "Three (core line)", value: "three" },
      { label: "Five (full case)", value: "five" },
    ],
  },
];
const onConfirm = (event) => {
  console.log(event.detail); // { index, question, value, custom }
};`;

const propRows = () => [
  { name: "questions", type: "AiApprovalQuestion[]", default: "[]", desc: t("questionsDesc") },
  { name: "default-index", type: "number", default: "0", desc: t("defaultIndexDesc") },
  { name: "confirm-label", type: "string", default: "''", desc: t("confirmLabelDesc") },
  { name: "dismiss-label", type: "string", default: "''", desc: t("dismissLabelDesc") },
  { name: "required", type: "boolean", default: "true", desc: t("requiredDesc") },
  { name: "show-progress", type: "boolean", default: "true", desc: t("showProgressDesc") },
  { name: "labels", type: "Partial<AiApprovalLabels>", default: "{}", desc: t("labelsDesc") },
  { name: "aria-label", type: "string", default: "''", desc: t("ariaLabelDesc") },
];

const eventRows = () => [
  {
    name: "confirm",
    type: "CustomEvent<AiApprovalAnswerDetail>",
    default: "—",
    desc: t("confirmEvent"),
  },
  {
    name: "dismiss",
    type: "CustomEvent<{ index: number }>",
    default: "—",
    desc: t("dismissEvent"),
  },
  { name: "change", type: "CustomEvent<{ index, value }>", default: "—", desc: t("changeEvent") },
  {
    name: "question-change",
    type: "CustomEvent<number>",
    default: "—",
    desc: t("questionChangeEvent"),
  },
];

const exposeRows = () => [
  { name: "next", desc: t("nextMethod") },
  { name: "previous", desc: t("previousMethod") },
  { name: "confirm", desc: t("confirmMethod") },
  { name: "reset", desc: t("resetMethod") },
];

defineStyle(
  articleStyles,
  `
  .ai-approval-stage { width: min(100%, 620px); }
  .ai-approval-note {
    margin: 10px 0 0;
    color: var(--elf-text-secondary, #64748b);
    font-size: 12.5px;
  }
  `,
);

const PageLabsAiApproval = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="AI Approval" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status">${t("status")}: ${lastAnswer ? t("confirmed") : t("waiting")}</span>
      <div class="ai-approval-stage">
        <elf-ai-approval-card
          :questions=${questions}
          @confirm=${onConfirmAnswer}
        ></elf-ai-approval-card>
        <p class="ai-approval-note">${t("lastAnswer")}: ${lastAnswer || t("none")}</p>
      </div>
    </elf-playground>
    <elf-api-builder component="elf-ai-approval-card" title="API">
    <elf-props-table role="props" :title=${t("props")} :rows=${propRows()}></elf-props-table>
    <elf-props-table role="events" :title=${t("events")} :rows=${eventRows()}></elf-props-table>
    <elf-props-table role="methods" :title=${t("expose")} :rows=${exposeRows()}></elf-props-table>
  </elf-api-builder>
  </elf-container>
`);

export { PageLabsAiApproval };
