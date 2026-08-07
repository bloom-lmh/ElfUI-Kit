import { defineHtml, useComponents } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import { PageVirtualListEx2 } from "./ex2";
import { PageVirtualListEx3 } from "./ex3";

useComponents({
  "page-virtual-list-ex2": PageVirtualListEx2,
  "page-virtual-list-ex3": PageVirtualListEx3,
});
const pick = createDocsPicker();
const t = createDocsTranslator({
  title: { zh: "虚拟列表", en: "VirtualList" },
  description: {
    zh: "只渲染视口附近的项目，适用于万级固定高度数据。",
    en: "Render only rows near the viewport for large fixed-height data sets.",
  },
  section: { zh: "大数据列表", en: "Large data list" },
  api: { zh: "组件 API", en: "Component API" },
  props: { zh: "属性", en: "VirtualList Props" },
});
const rows = () => [
  { name: "items", type: "unknown[]", default: "[]", desc: pick("列表数据", "List data") },
  {
    name: "item-key",
    type: "string | function",
    default: "id",
    desc: pick("稳定项目标识", "Stable item identity"),
  },
  {
    name: "render-item",
    type: "function",
    default: "-",
    desc: pick("项目渲染器", "Item renderer"),
  },
  {
    name: "list-item-class",
    type: "string",
    default: "''",
    desc: pick("虚拟行 class", "Virtual row class"),
  },
  {
    name: "list-item-style",
    type: "string | object",
    default: "''",
    desc: pick("虚拟行样式", "Virtual row style"),
  },
  {
    name: "height",
    type: "string | number",
    default: "320",
    desc: pick("视口高度", "Viewport height"),
  },
  {
    name: "item-height",
    type: "number",
    default: "48",
    desc: pick("固定项目高度", "Fixed item height"),
  },
  {
    name: "overscan",
    type: "number",
    default: "10",
    desc: pick("视口外预渲染行数", "Overscan rows"),
  },
  {
    name: "dynamic",
    type: "boolean",
    default: "false",
    desc: pick("测量并虚拟化动态高度行", "Variable-height measurement"),
  },
  {
    name: "estimated-item-height",
    type: "number",
    default: "48",
    desc: pick("测量前的行高估值", "Pre-measurement estimate"),
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    desc: pick("追加数据加载状态", "Append loading state"),
  },
  {
    name: "loading-text",
    type: "string",
    default: "'Loading…'",
    desc: pick("加载提示", "Loading message"),
  },
];
const PageVirtualList = defineHtml(`
  <elf-container>
    <elf-docs-hero category="data" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <h2>${t("section")}</h2>
    <page-virtual-list-ex2></page-virtual-list-ex2>
    <page-virtual-list-ex3></page-virtual-list-ex3>
    <elf-api-builder component="elf-virtual-list" title="API">
    <elf-props-table role="props" :title=${t("props")} :rows.prop=${rows()}></elf-props-table>
  </elf-api-builder>
  </elf-container>
`);
export { PageVirtualList };
