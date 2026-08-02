import { defineHtml } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  columns: { zh: "总列数", en: "Total number of columns" },
  gutter: {
    zh: "栅格间隔；设置后优先于 gap",
    en: "Grid spacing; takes priority over gap when set",
  },
  autoFit: {
    zh: "按可用空间自动生成列",
    en: "Generate columns automatically from the available space",
  },
  minColumnWidth: {
    zh: "自动列的最小宽度",
    en: "Minimum width of an automatically generated column",
  },
  span: { zh: "占用列数", en: "Number of columns occupied" },
  offset: { zh: "左侧间隔列数", en: "Number of empty columns on the left" },
  push: { zh: "向右移动列数", en: "Number of columns to move right" },
  pull: { zh: "向左移动列数", en: "Number of columns to move left" },
  responsive: { zh: "响应式栅格配置", en: "Responsive grid configuration" },
  maxWidth: { zh: "页面内容的最大宽度档位", en: "Maximum width preset for page content" },
});

const containerRows = () => [
  { name: "max-width", type: "xs|sm|md|lg|xl|full", default: "lg", desc: t("maxWidth") },
  { name: "padding", type: "0|sm|md|lg", default: "md" },
  { name: "fluid", type: "boolean", default: "false" },
];

const gridRows = () => [
  { name: "columns", type: "number", default: "12", desc: t("columns") },
  { name: "gap", type: "0|xs|sm|md|lg|xl", default: "0" },
  { name: "gutter", type: "number|string", default: "—", desc: t("gutter") },
  {
    name: "justify",
    type: "start|end|center|space-between|space-around|space-evenly",
    default: "start",
  },
  { name: "align", type: "stretch|start|center|end", default: "stretch" },
  { name: "auto-fit", type: "boolean", default: "false", desc: t("autoFit") },
  { name: "min-column-width", type: "string", default: "220px", desc: t("minColumnWidth") },
];

const itemRows = () => [
  { name: "span", type: "number", default: "1", desc: t("span") },
  { name: "offset", type: "number", default: "0", desc: t("offset") },
  { name: "push", type: "number", default: "0", desc: t("push") },
  { name: "pull", type: "number", default: "0", desc: t("pull") },
  {
    name: "xs / sm / md / lg / xl",
    type: "number | { span, offset, push, pull }",
    default: "—",
    desc: t("responsive"),
  },
];

const PageGridProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="elf-container Props" :rows=${containerRows()} />
  <elf-props-table title="elf-grid Props" :rows=${gridRows()} /><elf-props-table
    title="elf-grid-item Props"
    :rows=${itemRows()}
  />
`);

export { PageGridProps };
