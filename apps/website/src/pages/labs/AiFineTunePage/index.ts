import { defineHtml, defineStyle, useRef } from "@elfui/core";

import "@elfui/kit/labs";
import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "AI Fine-tune Card 微调卡片", en: "AI Fine-tune Card" },
  description: {
    zh: "Agent 调整设计属性的 Inspector：数值滑杆、分段选项与文本输入，change 事件实时通知父级。",
    en: "Inspector where the agent adjusts design properties: number sliders, segmented options, and text inputs with live change events.",
  },
  warning: {
    zh: "实验性 API：属性模型可能在稳定版前调整。",
    en: "Experimental API: the property model may change before stabilization.",
  },
  demo: { zh: "Flavor card 属性检查器", en: "Flavor card inspector" },

  status: { zh: "状态", en: "Status" },
  lastChange: { zh: "最近变更", en: "Last change" },
  none: { zh: "无", en: "None" },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  expose: { zh: "方法", en: "Methods" },
  titleDesc: { zh: "卡片标题。", en: "Card title." },
  adjustLabelDesc: { zh: "Adjust 徽标文案。", en: "Adjust badge text." },
  propertiesDesc: {
    zh: "属性列表（number / select / text）。",
    en: "Properties with number, select, or text kinds.",
  },
  labelsDesc: { zh: "文案覆盖。", en: "Label overrides." },
  ariaLabelDesc: { zh: "无障碍标签。", en: "Accessible label." },
  changeEvent: { zh: "属性值变化。", en: "A property value changes." },
  getMethod: { zh: "返回全部属性值。", en: "Returns all property values." },
  setMethod: { zh: "设置某个属性值。", en: "Sets a property value." },
});

const lastChange = useRef("");
const onPropertyChange = (event: CustomEvent<{ key: string; value: number | string }>): void => {
  lastChange.set(`${event.detail.key} = ${event.detail.value}`);
};
const fineTuneProperties = [
  {
    key: "layout",
    label: "Layout",
    kind: "select",
    value: "row",
    options: [
      { label: "row", value: "row" },
      { label: "col", value: "col" },
      { label: "grid", value: "grid" },
    ],
  },
  { key: "w", label: "W", kind: "number", value: 324, min: 120, max: 640, step: 2 },
  { key: "h", label: "H", kind: "number", value: 96, min: 48, max: 320, step: 2 },
  {
    key: "radius",
    label: "Radius",
    kind: "number",
    value: 28,
    min: 0,
    max: 64,
    step: 2,
    unit: "px",
  },
  {
    key: "opacity",
    label: "Opacity",
    kind: "number",
    value: 100,
    min: 0,
    max: 100,
    step: 5,
    unit: "%",
  },
  { key: "label", label: "Label", kind: "text", value: "Pistachio" },
];

const code = `<elf-ai-fine-tune-card
  title="Flavor card"
  :properties="properties"
  @change="onChange"
/>`;
const script = `const properties = [
  { key: "w", label: "W", kind: "number", value: 324, min: 120, max: 640 },
  { key: "layout", label: "Layout", kind: "select", value: "row", options: [
    { label: "row", value: "row" },
    { label: "col", value: "col" },
  ]},
];
const onChange = (event) => console.log(event.detail);`;

const propRows = () => [
  { name: "title", type: "string", default: "''", desc: t("titleDesc") },
  { name: "adjust-label", type: "string", default: "''", desc: t("adjustLabelDesc") },
  { name: "properties", type: "AiFineTuneProperty[]", default: "[]", desc: t("propertiesDesc") },
  { name: "labels", type: "Partial<AiFineTuneLabels>", default: "{}", desc: t("labelsDesc") },
  { name: "aria-label", type: "string", default: "''", desc: t("ariaLabelDesc") },
];

const eventRows = () => [
  {
    name: "change",
    type: "CustomEvent<{ key, value, property }>",
    default: "—",
    desc: t("changeEvent"),
  },
];

const exposeRows = () => [
  { name: "getValues", desc: t("getMethod") },
  { name: "setValue", desc: t("setMethod") },
];

defineStyle(
  articleStyles,
  `
  .ai-fine-stage { width: min(100%, 480px); }
  .ai-fine-note {
    margin: 10px 0 0;
    color: var(--elf-text-secondary, #64748b);
    font-size: 12.5px;
  }
  `,
);

const PageLabsAiFineTune = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="AI Fine-tune Card" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status">${t("status")}</span>
      <div class="ai-fine-stage">
        <elf-ai-fine-tune-card
          title="Flavor card"
          :properties=${fineTuneProperties}
          @change=${onPropertyChange}
        ></elf-ai-fine-tune-card>
        <p class="ai-fine-note">${t("lastChange")}: ${lastChange || t("none")}</p>
      </div>
    </elf-playground>
    <elf-api-builder component="elf-ai-fine-tune-card" title="API">
    <elf-props-table role="props" :title=${t("props")} :rows=${propRows()}></elf-props-table>
    <elf-props-table role="events" :title=${t("events")} :rows=${eventRows()}></elf-props-table>
    <elf-props-table role="methods" :title=${t("expose")} :rows=${exposeRows()}></elf-props-table>
  </elf-api-builder>
  </elf-container>
`);

export { PageLabsAiFineTune };
