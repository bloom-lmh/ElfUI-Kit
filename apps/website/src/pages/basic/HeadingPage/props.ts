import { defineHtml } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  props: { zh: "标题属性", en: "Heading props" },
  slots: { zh: "标题插槽", en: "Heading slots" },
  level: { zh: "语义层级，渲染 h1-h6", en: "Semantic level rendered as h1-h6" },
  variant: {
    zh: "Material 标题变体，决定字号、行高与字重",
    en: "Material title variant controlling scale, line height, and weight",
  },
  align: { zh: "文本对齐", en: "Text alignment" },
  color: { zh: "语义颜色", en: "Semantic color" },
  weight: { zh: "字重覆盖，默认跟随变体", en: "Weight override; defaults to the variant scale" },
  truncated: {
    zh: "单行省略，容器需要提供可计算宽度",
    en: "Single-line ellipsis; the container must provide a computable width",
  },
  lineClamp: {
    zh: "最多显示行数，非法值与小于 1 的值归一化为 1",
    en: "Maximum visible lines; invalid values and values below 1 normalize to 1",
  },
  eyebrow: { zh: "眉题小字，显示在标题上方", en: "Small overline displayed above the heading" },
  index: { zh: "编号徽标，显示在标题文本前", en: "Numbered badge displayed before the title text" },
  accent: { zh: "在标题左侧绘制主色强调条", en: "Draws a primary accent bar on the heading start" },
  chip: {
    zh: "将小标题渲染为软色标签式表面",
    en: "Renders a small title as a soft colored label surface",
  },
  content: { zh: "标题文本、图标或其他行内内容", en: "Text, icons, or other inline content" },
});

const propsRows = () => [
  { name: "level", type: "1 | 2 | 3 | 4 | 5 | 6", default: "2", desc: t("level") },
  {
    name: "variant",
    type: "HeadingVariant",
    default: "'section'",
    desc: t("variant"),
  },
  { name: "align", type: "'start' | 'center' | 'end'", default: "'start'", desc: t("align") },
  { name: "color", type: "HeadingColor", default: "'default'", desc: t("color") },
  { name: "weight", type: "'' | 'regular' | 'medium' | 'bold'", default: "''", desc: t("weight") },
  { name: "truncated", type: "boolean", default: "false", desc: t("truncated") },
  { name: "line-clamp", type: "number | string", default: "undefined", desc: t("lineClamp") },
  { name: "eyebrow", type: "string", default: "''", desc: t("eyebrow") },
  { name: "index", type: "number | string", default: "''", desc: t("index") },
  { name: "accent", type: "boolean", default: "false", desc: t("accent") },
  { name: "chip", type: "boolean", default: "false", desc: t("chip") },
];

const slotsRows = () => [{ name: "default", desc: t("content") }];

const PageHeadingProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table :title=${t("props")} :rows=${propsRows()} />
  <elf-props-table :title=${t("slots")} :rows=${slotsRows()} />
`);

export { PageHeadingProps };
