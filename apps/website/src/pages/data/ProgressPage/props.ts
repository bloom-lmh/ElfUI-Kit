import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  percentage: {
    zh: "当前百分比，优先于 value/max",
    en: "Current percentage; takes priority over value/max",
  },
  type: { zh: "进度条类型", en: "Progress type" },
  value: { zh: "当前值", en: "Current value" },
  max: { zh: "最大值", en: "Maximum value" },
  status: { zh: "状态色", en: "Status color" },
  color: { zh: "自定义进度色", en: "Custom progress color" },
  track: { zh: "自定义轨道色", en: "Custom track color" },
  duration: {
    zh: "不确定或条纹动画时长（秒）",
    en: "Indeterminate or stripe animation duration in seconds",
  },
  size: { zh: "圆形或仪表盘尺寸", en: "Circle or dashboard size" },
  stroke: { zh: "进度线宽度", en: "Progress stroke width" },
  linecap: { zh: "圆形路径端点形状", en: "Circular path line cap" },
  label: { zh: "进度标签", en: "Progress label" },
  labelPosition: { zh: "标签位置", en: "Label position" },
  showText: { zh: "显示文字", en: "Show progress text" },
  hideValue: { zh: "隐藏数值但保留标签", en: "Hide the value while keeping the label" },
  inside: { zh: "条形文字内置", en: "Place text inside the linear bar" },
  reverse: { zh: "反转线性布局", en: "Reverse the linear layout" },
  striped: { zh: "显示条纹", en: "Show stripes" },
  flow: { zh: "让条纹流动", en: "Animate stripes" },
  indeterminate: { zh: "不确定进度", en: "Indeterminate progress" },
  format: { zh: "自定义文字格式", en: "Custom text formatter" },
  defaultSlot: { zh: "环形中心内容", en: "Circular center content" },
  labelSlot: { zh: "自定义标签", en: "Custom label" },
  valueSlot: { zh: "自定义格式化数值", en: "Custom formatted value" },
});
const rows = () => [
  { name: "percentage", type: "number", default: "0", desc: t("percentage") },
  { name: "type", type: "line | circle | dashboard", default: "line", desc: t("type") },
  { name: "value", type: "number", default: "0", desc: t("value") },
  { name: "max", type: "number", default: "100", desc: t("max") },
  {
    name: "status",
    type: "primary | success | warning | danger | info",
    default: "''",
    desc: t("status"),
  },
  { name: "color", type: "string", default: "''", desc: t("color") },
  { name: "track-color", type: "string", default: "''", desc: t("track") },
  { name: "duration", type: "number", default: "3", desc: t("duration") },
  { name: "width / size", type: "number", default: "126", desc: t("size") },
  { name: "stroke-width", type: "number", default: "6", desc: t("stroke") },
  { name: "stroke-linecap", type: "butt | round | square", default: "round", desc: t("linecap") },
  { name: "show-text", type: "boolean", default: "true", desc: t("showText") },
  {
    name: "label / label-position",
    type: "string / top | bottom | start | end",
    default: "'' / top",
    desc: `${t("label")} / ${t("labelPosition")}`,
  },
  { name: "hide-value", type: "boolean", default: "false", desc: t("hideValue") },
  {
    name: "text-inside / reverse",
    type: "boolean",
    default: "false",
    desc: `${t("inside")} / ${t("reverse")}`,
  },
  { name: "striped", type: "boolean", default: "false", desc: t("striped") },
  { name: "striped-flow", type: "boolean", default: "false", desc: t("flow") },
  { name: "indeterminate", type: "boolean", default: "false", desc: t("indeterminate") },
  {
    name: "format / value-format",
    type: "function / string template",
    default: "-",
    desc: t("format"),
  },
];
const slotRows = () => [
  { name: "default", desc: t("defaultSlot") },
  { name: "label", desc: t("labelSlot") },
  { name: "value", desc: t("valueSlot") },
];
const PageProgressProps = defineHtml(
  `<h2>API</h2><elf-props-table title="Props" :rows.prop=${rows()}></elf-props-table><elf-props-table title="Slots" :rows.prop=${slotRows()}></elf-props-table>`,
);
export { PageProgressProps };
