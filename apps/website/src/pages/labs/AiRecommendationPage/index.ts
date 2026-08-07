import { defineHtml, defineStyle, useRef } from "@elfui/core";

import "@elfui/kit/labs";
import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "AI Recommendation 推荐卡片", en: "AI Recommendation" },
  description: {
    zh: "Agent 建议卡片：内联代码片段、备选方案与信号徽标、置信度仪表和 Accept 操作。",
    en: "Agent recommendation card with inline code, alternative signals, a confidence meter, and an accept action.",
  },
  warning: {
    zh: "实验性 API：建议模型与事件名可能在稳定版前调整。",
    en: "Experimental API: the recommendation model and event names may change before stabilization.",
  },
  demo: { zh: "补货建议", en: "Restock recommendation" },

  status: { zh: "状态", en: "Status" },
  accepted: { zh: "已接受", en: "Accepted" },
  idle: { zh: "待决策", en: "Awaiting decision" },
  lastAlternative: { zh: "最近选择的备选方案", en: "Last chosen alternative" },
  none: { zh: "无", en: "None" },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  titleDesc: { zh: "建议标题。", en: "Recommendation title." },
  segmentsDesc: {
    zh: "正文片段，code 片段以行内代码渲染。",
    en: "Body segments; code segments render inline.",
  },
  confidenceDesc: { zh: "置信度：high / medium / low。", en: "Confidence: high / medium / low." },
  alternativesDesc: { zh: "备选方案（标签 + 信号）。", en: "Alternatives with label and signal." },
  acceptLabelDesc: { zh: "覆盖 Accept 按钮文案。", en: "Overrides the accept button label." },
  alternativesLabelDesc: {
    zh: "覆盖 Alternatives 按钮文案。",
    en: "Overrides the alternatives button label.",
  },
  showConfidenceDesc: { zh: "显示置信度仪表。", en: "Shows the confidence meter." },
  labelsDesc: { zh: "文案覆盖。", en: "Label overrides." },
  ariaLabelDesc: { zh: "无障碍标签。", en: "Accessible label." },
  acceptEvent: { zh: "用户接受建议。", en: "The recommendation is accepted." },
  alternativesEvent: { zh: "请求查看全部备选方案。", en: "All alternatives are requested." },
  alternativeSelectEvent: { zh: "选中某个备选方案。", en: "An alternative is selected." },
});

const accepted = useRef(false);
const lastAlternative = useRef("");
const onAlternativeSelect = (event: CustomEvent<{ label: string }>): void => {
  lastAlternative.set(event.detail.label);
};
const segments = [
  { text: "Reorder waffle cones from " },
  { text: "cone_king", code: true },
  { text: " with lead time " },
  { text: "7_days", code: true },
  { text: "." },
];
const alternatives = [
  { label: "Switch to vanilla_madagascar", signal: "Needs review", signalKind: "review" },
  { label: "Full restock across every SKU", signal: "No signal", signalKind: "none" },
];

const code = `<elf-ai-recommendation-card
  title="Want me to place this restock order?"
  :segments="segments"
  confidence="high"
  :alternatives="alternatives"
  @accept="onAccept"
/>`;
const script = `const segments = [
  { text: "Reorder waffle cones from " },
  { text: "cone_king", code: true },
];
const onAccept = () => {
  // 执行补货
};`;

const propRows = () => [
  { name: "title", type: "string", default: "''", desc: t("titleDesc") },
  { name: "segments", type: "AiRecommendationSegment[]", default: "[]", desc: t("segmentsDesc") },
  {
    name: "confidence",
    type: "'high' | 'medium' | 'low'",
    default: "'high'",
    desc: t("confidenceDesc"),
  },
  {
    name: "alternatives",
    type: "AiRecommendationAlternative[]",
    default: "[]",
    desc: t("alternativesDesc"),
  },
  { name: "accept-label", type: "string", default: "''", desc: t("acceptLabelDesc") },
  { name: "alternatives-label", type: "string", default: "''", desc: t("alternativesLabelDesc") },
  { name: "show-confidence", type: "boolean", default: "true", desc: t("showConfidenceDesc") },
  { name: "labels", type: "Partial<AiRecommendationLabels>", default: "{}", desc: t("labelsDesc") },
  { name: "aria-label", type: "string", default: "''", desc: t("ariaLabelDesc") },
];

const eventRows = () => [
  { name: "accept", type: "CustomEvent<void>", default: "—", desc: t("acceptEvent") },
  { name: "alternatives", type: "CustomEvent<void>", default: "—", desc: t("alternativesEvent") },
  {
    name: "alternative-select",
    type: "CustomEvent<AiRecommendationAlternative>",
    default: "—",
    desc: t("alternativeSelectEvent"),
  },
];

defineStyle(
  articleStyles,
  `
  .ai-recommendation-stage { width: min(100%, 640px); }
  .ai-recommendation-note {
    margin: 10px 0 0;
    color: var(--elf-text-secondary, #64748b);
    font-size: 12.5px;
  }
  `,
);

const PageLabsAiRecommendation = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="AI Recommendation" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status">${t("status")}: ${accepted ? t("accepted") : t("idle")}</span>
      <div class="ai-recommendation-stage">
        <elf-ai-recommendation-card
          title="Want me to place this restock order?"
          :segments=${segments}
          confidence="high"
          :alternatives=${alternatives}
          @accept=${() => accepted.set(true)}
          @alternative-select=${onAlternativeSelect}
        ></elf-ai-recommendation-card>
        <p class="ai-recommendation-note">${t("lastAlternative")}: ${lastAlternative || t("none")}</p>
      </div>
    </elf-playground>
    <elf-api-builder component="elf-ai-recommendation-card" title="API">
    <elf-props-table role="props" :title=${t("props")} :rows=${propRows()}></elf-props-table>
    <elf-props-table role="events" :title=${t("events")} :rows=${eventRows()}></elf-props-table>
  </elf-api-builder>
  </elf-container>
`);

export { PageLabsAiRecommendation };
