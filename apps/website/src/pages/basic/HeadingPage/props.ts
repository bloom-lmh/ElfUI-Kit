import { defineHtml } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  props: { zh: "标题属性", en: "Heading props" },
  slots: { zh: "标题插槽", en: "Heading slots" },
  family: {
    zh: "标题套装：guide 文档指南 / editorial 编辑杂志 / terminal 开发者终端",
    en: "Heading suite: guide documentation / editorial magazine / developer terminal",
  },
  level: { zh: "语义层级，渲染 h1-h6", en: "Semantic level rendered as h1-h6" },
  align: { zh: "文本对齐", en: "Text alignment" },
  color: { zh: "语义颜色", en: "Semantic color" },
  weight: { zh: "字重覆盖，默认跟随套装", en: "Weight override; defaults to the suite scale" },
  truncated: {
    zh: "单行省略，容器需要提供可计算宽度",
    en: "Single-line ellipsis; the container must provide a computable width",
  },
  lineClamp: {
    zh: "最多显示行数，非法值与小于 1 的值归一化为 1",
    en: "Maximum visible lines; invalid values and values below 1 normalize to 1",
  },
  eyebrow: { zh: "眉题小字，显示在标题上方", en: "Small overline displayed above the heading" },
  numbered: {
    zh: "自动序号：同一页面/容器内按层级递增，格式随套装（01、1、1.1）",
    en: "Auto numbering: increments by level within a page or container; the format follows the suite (01, 1, 1.1)",
  },
  index: { zh: "手动编号，优先于自动序号", en: "Manual number that overrides the auto counter" },
  markdown: {
    zh: "Markdown 列表标题：bullet 渲染 - 前缀，ordered 渲染 1. 2. 自动编号；guide 的 level 3 在 markdown 模式下不套胶囊",
    en: "Markdown list heading: bullet renders a - prefix, ordered renders 1. 2. auto numbers; guide level 3 skips the chip default in markdown mode",
  },
  accent: {
    zh: "在标题左侧绘制强调条；guide 的 level 2 默认开启，传 false 可关闭",
    en: "Draws an accent bar at the heading start; on by default for guide level 2, pass false to disable",
  },
  chip: {
    zh: "将标题渲染为软色标签式表面；guide 的 level 3 默认开启，传 false 可关闭",
    en: "Renders a soft colored label surface; on by default for guide level 3, pass false to disable",
  },
  gradient: {
    zh: "渐变文字；brand 的 level 1 默认开启，传 false 可关闭",
    en: "Gradient text; on by default for brand level 1, pass false to disable",
  },
  lineHeight: {
    zh: "行高覆盖；数字作为倍率（如 1.6），字符串原样传入",
    en: "Line-height override; numeric values are unitless multipliers (e.g. 1.6), strings pass through",
  },
  marginTop: {
    zh: "上边距覆盖；数字换算为 px，字符串原样传入",
    en: "Margin-top override; numeric values become px, strings pass through",
  },
  marginBottom: {
    zh: "下边距覆盖；数字换算为 px，字符串原样传入",
    en: "Margin-bottom override; numeric values become px, strings pass through",
  },
  fontSize: {
    zh: "字号覆盖；数字换算为 px，字符串原样传入",
    en: "Font-size override; numeric values become px, strings pass through",
  },
  letterSpacing: {
    zh: "字距覆盖；数字换算为 px，字符串原样传入",
    en: "Letter-spacing override; numeric values become px, strings pass through",
  },
  content: { zh: "标题文本、图标或其他行内内容", en: "Text, icons, or other inline content" },
});

const propsRows = () => [
  {
    name: "family",
    type: "HeadingFamily",
    default: "'guide'",
    desc: t("family"),
  },
  { name: "level", type: "1 | 2 | 3 | 4 | 5 | 6", default: "2", desc: t("level") },
  { name: "align", type: "'start' | 'center' | 'end'", default: "'start'", desc: t("align") },
  { name: "color", type: "HeadingColor", default: "'default'", desc: t("color") },
  { name: "weight", type: "'' | 'regular' | 'medium' | 'bold'", default: "''", desc: t("weight") },
  { name: "truncated", type: "boolean", default: "false", desc: t("truncated") },
  { name: "line-clamp", type: "number | string", default: "undefined", desc: t("lineClamp") },
  { name: "eyebrow", type: "string", default: "''", desc: t("eyebrow") },
  { name: "numbered", type: "boolean", default: "false", desc: t("numbered") },
  { name: "index", type: "number | string", default: "''", desc: t("index") },
  { name: "markdown", type: "'' | 'bullet' | 'ordered'", default: "''", desc: t("markdown") },
  { name: "accent", type: "boolean", default: "undefined", desc: t("accent") },
  { name: "chip", type: "boolean", default: "undefined", desc: t("chip") },
  { name: "gradient", type: "boolean", default: "undefined", desc: t("gradient") },
  { name: "line-height", type: "number | string", default: "undefined", desc: t("lineHeight") },
  { name: "margin-top", type: "number | string", default: "undefined", desc: t("marginTop") },
  { name: "margin-bottom", type: "number | string", default: "undefined", desc: t("marginBottom") },
  { name: "font-size", type: "number | string", default: "undefined", desc: t("fontSize") },
  {
    name: "letter-spacing",
    type: "number | string",
    default: "undefined",
    desc: t("letterSpacing"),
  },
];

const slotsRows = () => [{ name: "default", desc: t("content") }];

const PageHeadingProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table :title=${t("props")} :rows=${propsRows()} />
  <elf-props-table :title=${t("slots")} :rows=${slotsRows()} />
`);

export { PageHeadingProps };
