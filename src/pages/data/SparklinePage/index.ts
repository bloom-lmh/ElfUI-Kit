import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageSparklineEx1 } from "./ex1";

const t = createDocsTranslator({
  title: { zh: "Sparkline 迷你图表", en: "Sparkline" },
  description: {
    zh: "以紧凑折线展示趋势，支持首次绘制和数据切换动画。",
    en: "Show trends in a compact line with initial-draw and data-transition animation.",
  },
});

const propsRows = [
  { name: "modelValue", type: "number[]", default: "[]", desc: t("description") },
  { name: "smooth", type: "number", default: "0", desc: "0-10" },
  { name: "lineWidth", type: "number", default: "2", desc: "SVG stroke width" },
  { name: "animation", type: "boolean", default: "false", desc: "Animate data changes" },
  {
    name: "autoDraw",
    type: "boolean | once | always",
    default: "false",
    desc: "Animate the initial stroke",
  },
  {
    name: "autoDrawDuration",
    type: "number",
    default: "800",
    desc: "Initial draw duration in milliseconds",
  },
  { name: "ariaLabel", type: "string", default: "Sparkline", desc: "Accessible chart name" },
];

useComponents({ "page-sparkline-ex1": PageSparklineEx1 });

const PageSparkline = defineHtml(`
  <elf-container>
    <elf-docs-hero category="data" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-sparkline-ex1></page-sparkline-ex1>
    <h2>API</h2>
    <elf-props-table title="Sparkline Props" :rows.prop=${propsRows}></elf-props-table>
  </elf-container>
`);

export { PageSparkline };
