import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageSparklineEx1 } from "./ex1";
import { PageSparklineEx2 } from "./ex2";
import { PageSparklineEx3 } from "./ex3";
import { PageSparklineEx4 } from "./ex4";
import { PageSparklineEx5 } from "./ex5";
import { PageSparklineEx6 } from "./ex6";
import { PageSparklineEx7 } from "./ex7";
import { PageSparklineEx8 } from "./ex8";

const t = createDocsTranslator({
  title: { zh: "Sparkline 迷你图表", en: "Sparkline" },
  description: {
    zh: "以紧凑折线与柱状展示趋势，支持渐变、标签、标记、悬停交互、单调平滑、首次绘制与数据切换动画。",
    en: "Show trends as compact lines or bars with gradients, labels, markers, hover interaction, monotone smoothing, initial-draw, and data-transition animation.",
  },
  modelValue: { zh: "数据序列", en: "Data series" },
  itemValue: { zh: "对象数据中取值字段名", en: "Property used to read object items" },
  type: { zh: "图表类型", en: "Chart type" },
  width: {
    zh: "图表宽度（宽高比与坐标空间）",
    en: "Chart width (aspect ratio and coordinate space)",
  },
  height: {
    zh: "图表高度（宽高比与坐标空间）",
    en: "Chart height (aspect ratio and coordinate space)",
  },
  color: { zh: "图表颜色", en: "Chart color" },
  fill: { zh: "显示面积填充", en: "Fill the area under the line" },
  fillColor: { zh: "面积填充色", en: "Area fill color" },
  lineWidth: { zh: "线宽或柱宽", en: "Stroke or bar width" },
  smooth: { zh: "折线平滑度或柱角圆角（0-10）", en: "Line smoothing or bar radius (0-10)" },
  strokeLinecap: { zh: "线条端点形状", en: "Stroke line cap" },
  animation: { zh: "数据变化时插值动画", en: "Interpolate data changes" },
  animationDuration: { zh: "插值动画时长（毫秒）", en: "Interpolation duration in milliseconds" },
  autoDraw: { zh: "首次渲染描线动画", en: "Animate the initial draw" },
  autoDrawDuration: {
    zh: "首次绘制动画时长（毫秒）",
    en: "Initial draw duration in milliseconds",
  },
  autoDrawEasing: { zh: "首次绘制缓动函数", en: "Initial draw easing function" },
  gradient: { zh: "线性渐变色数组", en: "Linear gradient color array" },
  gradientDirection: { zh: "渐变方向", en: "Gradient direction" },
  labels: { zh: "与数据点对应的标签文本", en: "Labels aligned to data points" },
  showLabels: { zh: "在每个数据点下方显示标签", en: "Show labels below each data point" },
  labelSize: { zh: "标签字号（像素）", en: "Label font size in pixels" },
  autoLineWidth: { zh: "柱状图自动扩展柱宽以填满空间", en: "Auto-expand bars to fill the space" },
  showMarkers: { zh: "在数据点显示圆点标记", en: "Show markers at data points" },
  markerSize: { zh: "标记尺寸（像素）", en: "Marker size in pixels" },
  markerStroke: { zh: "标记描边颜色", en: "Marker stroke color" },
  inset: { zh: "将趋势线延伸到图表边缘", en: "Extend the trend line to chart edges" },
  smoothMode: {
    zh: "平滑算法：默认或单调（避免局部极值过冲）",
    en: "Smoothing algorithm: default or monotone (no overshoot at extrema)",
  },
  interactive: {
    zh: "悬停与键盘交互，并派发 update:currentIndex",
    en: "Enable hover and keyboard interaction and emit update:currentIndex",
  },
  padding: { zh: "趋势图内边距，防止线条被裁剪", en: "Trend padding to avoid clipping" },
  min: { zh: "纵轴最小值（默认取数据最小值）", en: "Minimum y value (defaults to data minimum)" },
  max: { zh: "纵轴最大值（默认取数据最大值）", en: "Maximum y value (defaults to data maximum)" },
  ariaLabel: { zh: "图表可访问名称", en: "Accessible chart name" },
  currentIndex: {
    zh: "当前悬停或键盘选中的数据点索引，离开时为 null",
    en: "Index of the hovered or focused data point, or null on leave",
  },
});

const propsRows = () => [
  { name: "modelValue", type: "number[]", default: "[]", desc: t("modelValue") },
  { name: "itemValue", type: "string", default: "value", desc: t("itemValue") },
  { name: "type", type: "trend | bar", default: "trend", desc: t("type") },
  {
    name: "width",
    type: "number",
    default: "300",
    desc: `${t("width")} / ${t("height")}`,
  },
  {
    name: "height",
    type: "number",
    default: "100",
    desc: `${t("width")} / ${t("height")}`,
  },
  { name: "color", type: "string", default: "var(--elf-primary)", desc: t("color") },
  { name: "fill", type: "boolean", default: "false", desc: t("fill") },
  { name: "fillColor", type: "string", default: "primary 18%", desc: t("fillColor") },
  { name: "lineWidth", type: "number", default: "2", desc: t("lineWidth") },
  { name: "smooth", type: "number", default: "0", desc: t("smooth") },
  {
    name: "strokeLinecap",
    type: "butt | round | square",
    default: "round",
    desc: t("strokeLinecap"),
  },
  { name: "animation", type: "boolean", default: "false", desc: t("animation") },
  {
    name: "animationDuration",
    type: "number",
    default: "300",
    desc: t("animationDuration"),
  },
  {
    name: "autoDraw",
    type: "boolean | once | always",
    default: "false",
    desc: t("autoDraw"),
  },
  {
    name: "autoDrawDuration",
    type: "number",
    default: "800",
    desc: t("autoDrawDuration"),
  },
  {
    name: "autoDrawEasing",
    type: "string",
    default: "ease",
    desc: t("autoDrawEasing"),
  },
  { name: "gradient", type: "string[]", default: "[]", desc: t("gradient") },
  {
    name: "gradientDirection",
    type: "top | bottom | left | right",
    default: "top",
    desc: t("gradientDirection"),
  },
  { name: "labels", type: "string[]", default: "[]", desc: t("labels") },
  { name: "showLabels", type: "boolean", default: "false", desc: t("showLabels") },
  { name: "labelSize", type: "number", default: "7", desc: t("labelSize") },
  { name: "autoLineWidth", type: "boolean", default: "false", desc: t("autoLineWidth") },
  { name: "showMarkers", type: "boolean", default: "false", desc: t("showMarkers") },
  { name: "markerSize", type: "number", default: "8", desc: t("markerSize") },
  { name: "markerStroke", type: "string", default: "#fff", desc: t("markerStroke") },
  { name: "inset", type: "boolean", default: "false", desc: t("inset") },
  {
    name: "smoothMode",
    type: "default | monotone",
    default: "default",
    desc: t("smoothMode"),
  },
  { name: "interactive", type: "boolean", default: "false", desc: t("interactive") },
  { name: "padding", type: "number", default: "0", desc: t("padding") },
  { name: "min", type: "number", default: "-", desc: t("min") },
  { name: "max", type: "number", default: "-", desc: t("max") },
  { name: "ariaLabel", type: "string", default: "Sparkline", desc: t("ariaLabel") },
];

const eventRows = () => [
  {
    name: "update:currentIndex",
    type: "number | null",
    desc: t("currentIndex"),
  },
];

useComponents({
  "page-sparkline-ex1": PageSparklineEx1,
  "page-sparkline-ex2": PageSparklineEx2,
  "page-sparkline-ex3": PageSparklineEx3,
  "page-sparkline-ex4": PageSparklineEx4,
  "page-sparkline-ex5": PageSparklineEx5,
  "page-sparkline-ex6": PageSparklineEx6,
  "page-sparkline-ex7": PageSparklineEx7,
  "page-sparkline-ex8": PageSparklineEx8,
});

const PageSparkline = defineHtml(`
  <elf-container>
    <elf-docs-hero category="data" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-sparkline-ex1></page-sparkline-ex1>
    <page-sparkline-ex2></page-sparkline-ex2>
    <page-sparkline-ex3></page-sparkline-ex3>
    <page-sparkline-ex4></page-sparkline-ex4>
    <page-sparkline-ex5></page-sparkline-ex5>
    <page-sparkline-ex6></page-sparkline-ex6>
    <page-sparkline-ex7></page-sparkline-ex7>
    <page-sparkline-ex8></page-sparkline-ex8>
    <elf-api-builder component="elf-sparkline" title="API">
    <elf-props-table role="props" title="Sparkline Props" :rows.prop=${propsRows()}></elf-props-table>
    <elf-props-table role="events" title="Sparkline Events" :rows.prop=${eventRows()}></elf-props-table>
  </elf-api-builder>
  </elf-container>
`);

export { PageSparkline };
