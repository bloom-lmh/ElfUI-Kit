import { defineHtml } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  props: { zh: "文本属性", en: "Text props" },
  slots: { zh: "文本插槽", en: "Text slots" },
  type: { zh: "语义颜色", en: "Semantic color" },
  size: {
    zh: "文字尺寸；同时支持 sm / md / lg 别名",
    en: "Text size; sm / md / lg aliases are also supported",
  },
  truncated: {
    zh: "单行省略；容器需要提供可计算宽度",
    en: "Single-line ellipsis; the container must provide a computable width",
  },
  lineClamp: {
    zh: "最多显示行数，非法值与小于 1 的值归一为 1",
    en: "Maximum visible lines; invalid values and values below 1 normalize to 1",
  },
  tag: {
    zh: "Shadow DOM 内渲染的安全原生语义标签",
    en: "Safe native semantic element rendered inside the Shadow DOM",
  },
  mark: { zh: "标记内容", en: "Marks content" },
  deleted: { zh: "显示删除线", en: "Shows deleted content" },
  inserted: { zh: "显示插入内容", en: "Shows inserted content" },
  strong: { zh: "使用粗体强调", en: "Uses strong visual emphasis" },
  italic: { zh: "使用斜体样式", en: "Uses italic styling" },
  content: { zh: "文本、图标或其他行内内容", en: "Text, icons, or other inline content" },
});

const propsRows = () => [
  {
    name: "type",
    type: "'' | primary | success | warning | danger | info",
    default: "''",
    desc: t("type"),
  },
  {
    name: "size",
    type: "'' | small | default | large | sm | md | lg",
    default: "''",
    desc: t("size"),
  },
  { name: "truncated", type: "boolean", default: "false", desc: t("truncated") },
  { name: "line-clamp", type: "number | string", default: "undefined", desc: t("lineClamp") },
  { name: "tag", type: "TextTag | string", default: "span", desc: t("tag") },
  { name: "mark", type: "boolean", default: "false", desc: t("mark") },
  { name: "deleted", type: "boolean", default: "false", desc: t("deleted") },
  { name: "inserted", type: "boolean", default: "false", desc: t("inserted") },
  { name: "strong", type: "boolean", default: "false", desc: t("strong") },
  { name: "italic", type: "boolean", default: "false", desc: t("italic") },
];

const slotsRows = () => [{ name: "default", desc: t("content") }];

const PageTextProps = defineHtml(`
  <elf-api-builder component="elf-text" title="API">
  <elf-props-table role="props" :title=${t("props")} :rows=${propsRows()} />
  <elf-props-table role="slots" :title=${t("slots")} :rows=${slotsRows()} />
  </elf-api-builder>
`);

export { PageTextProps };
