import { defineHtml, defineStyle, useRef } from "@elfui/core";

import "@elfui/kit/labs";
import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "AI Insight Card 洞察卡片", en: "AI Insight Card" },
  description: {
    zh: "分页的 Agent 洞察：提及与代码片段、指标火花行、追问 CTA，图表区可整体替换。",
    en: "Paged agent insights with mentions, inline code, metric sparks, and a follow-up CTA; the chart area is replaceable.",
  },
  warning: {
    zh: "实验性 API：洞察模型可能在稳定版前调整。",
    en: "Experimental API: the insight model may change before stabilization.",
  },
  demo: { zh: "销售洞察", en: "Sales insights" },

  status: { zh: "状态", en: "Status" },
  index: { zh: "当前", en: "Current" },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  expose: { zh: "方法", en: "Methods" },
  insightsDesc: {
    zh: "洞察列表（segments / sparks / cta）。",
    en: "Insights with segments, sparks, and CTA.",
  },
  defaultIndexDesc: { zh: "初始洞察下标。", en: "Initial insight index." },
  titleDesc: { zh: "标题，默认 Insights。", en: "Title; defaults to Insights." },
  showPagerDesc: { zh: "显示上一页/下一页。", en: "Shows the pager." },
  labelsDesc: { zh: "文案覆盖。", en: "Label overrides." },
  ariaLabelDesc: { zh: "无障碍标签。", en: "Accessible label." },
  changeEvent: { zh: "切换洞察下标。", en: "The insight index changes." },
  ctaEvent: { zh: "点击追问 CTA。", en: "The follow-up CTA fires." },
  nextMethod: { zh: "下一条洞察。", en: "Moves to the next insight." },
  previousMethod: { zh: "上一条洞察。", en: "Moves to the previous insight." },
  goToMethod: { zh: "跳转到指定下标。", en: "Jumps to a specific index." },
});

const currentIndex = useRef(0);
const onInsightChange = (event: CustomEvent<number>): void => {
  currentIndex.set(event.detail);
};
const insights = [
  {
    id: 1,
    segments: [
      { text: "The worst performer in your " },
      { text: "@Creamery", mention: true },
      { text: " is Rocky Road — down " },
      { text: "-6%", code: true },
      { text: " or " },
      { text: "-$2,453.44", code: true },
      { text: "." },
    ],
    sparks: [
      { label: "Mint Chip", change: "-4.41%", amount: "-$2,377.66", tone: "bad" },
      { label: "Pistachio", change: "+1.15%", amount: "+$617.22", tone: "good" },
    ],
    cta: "Should I rebalance flavors?",
  },
  {
    id: 2,
    segments: [{ text: "Weekend peaks are strongest for mint chip across all three summers." }],
    sparks: [{ label: "Weekend lift", change: "+12%", tone: "good" }],
    cta: "Draft a weekend promotion",
  },
];

const code = `<elf-ai-insight-card
  :insights="insights"
  @cta="onCta"
/>`;
const script = `const insights = [
  {
    segments: [{ text: "The worst performer is " }, { text: "Rocky Road", code: true }],
    sparks: [{ label: "Mint Chip", change: "-4.41%", tone: "bad" }],
    cta: "Should I rebalance flavors?",
  },
];
const onCta = (event) => console.log(event.detail);`;

const propRows = () => [
  { name: "insights", type: "AiInsight[]", default: "[]", desc: t("insightsDesc") },
  { name: "default-index", type: "number", default: "0", desc: t("defaultIndexDesc") },
  { name: "title", type: "string", default: "'Insights'", desc: t("titleDesc") },
  { name: "show-pager", type: "boolean", default: "true", desc: t("showPagerDesc") },
  { name: "labels", type: "Partial<AiInsightCardLabels>", default: "{}", desc: t("labelsDesc") },
  { name: "aria-label", type: "string", default: "''", desc: t("ariaLabelDesc") },
];

const eventRows = () => [
  { name: "change", type: "CustomEvent<number>", default: "—", desc: t("changeEvent") },
  { name: "cta", type: "CustomEvent<{ index, cta }>", default: "—", desc: t("ctaEvent") },
];

const exposeRows = () => [
  { name: "next", desc: t("nextMethod") },
  { name: "previous", desc: t("previousMethod") },
  { name: "goTo", desc: t("goToMethod") },
];

defineStyle(
  articleStyles,
  `
  .ai-insight-stage { width: min(100%, 640px); }
  `,
);

const PageLabsAiInsightCard = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="AI Insight Card" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status">${t("index")}: ${currentIndex.value + 1} / ${insights.length}</span>
      <div class="ai-insight-stage">
        <elf-ai-insight-card
          :insights=${insights}
          @change=${onInsightChange}
        ></elf-ai-insight-card>
      </div>
    </elf-playground>
    <h2>${t("api")}</h2>
    <elf-props-table :title=${t("props")} :rows=${propRows()}></elf-props-table>
    <elf-props-table :title=${t("events")} :rows=${eventRows()}></elf-props-table>
    <elf-props-table :title=${t("expose")} :rows=${exposeRows()}></elf-props-table>
  </elf-container>
`);

export { PageLabsAiInsightCard };
