import { defineHtml } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  slots: { zh: "插槽", en: "Slots" },
  expose: { zh: "暴露方法", en: "Expose" },
});
const pick = createDocsPicker();

const propsRows = [
  {
    name: "modelValue",
    type: "number | [number, number]",
    default: "0",
    desc: pick("当前值", "Current value."),
  },
  { name: "min", type: "number", default: "0", desc: pick("最小值", "Minimum value.") },
  { name: "max", type: "number", default: "100", desc: pick("最大值", "Maximum value.") },
  { name: "step", type: "number", default: "1", desc: pick("步长", "Step interval.") },
  {
    name: "range",
    type: "boolean",
    default: "false",
    desc: pick("范围选择", "Enables range selection."),
  },
  {
    name: "vertical",
    type: "boolean",
    default: "false",
    desc: pick("垂直滑块", "Uses vertical orientation."),
  },
  {
    name: "height",
    type: "string | number",
    default: "240",
    desc: pick("垂直滑块高度", "Vertical slider height."),
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: pick("禁用状态", "Disables interaction."),
  },
  {
    name: "readonly",
    type: "boolean",
    default: "false",
    desc: pick("只读状态", "Makes the value read-only."),
  },
  {
    name: "showTooltip",
    type: "boolean",
    default: "true",
    desc: pick("显示数值提示", "Shows the value tooltip."),
  },
  {
    name: "tooltipClass",
    type: "string",
    default: "''",
    desc: pick("数值提示的附加 CSS 类", "Additional CSS class for the value tooltip."),
  },
  {
    name: "placement",
    type: "top | bottom | left | right",
    default: "top",
    desc: pick("数值提示的位置", "Value tooltip placement."),
  },
  {
    name: "persistent",
    type: "boolean",
    default: "true",
    desc: pick(
      "保留提示节点渲染的兼容属性",
      "Compatibility prop that keeps the tooltip node rendered.",
    ),
  },
  {
    name: "showStops",
    type: "boolean",
    default: "false",
    desc: pick("显示步进点", "Shows step stops."),
  },
  {
    name: "segmented",
    type: "boolean",
    default: "false",
    desc: pick("按 step 或 marks 分段展示轨道", "Segments the track using step or marks."),
  },
  {
    name: "showInput",
    type: "boolean",
    default: "false",
    desc: pick("显示数字输入框；范围模式下无效", "Shows numeric input; ignored in range mode."),
  },
  {
    name: "showInputControls",
    type: "boolean",
    default: "true",
    desc: pick("显示数字输入框的原生调节按钮", "Shows native numeric-input controls."),
  },
  {
    name: "inputSize",
    type: "sm | md | lg | small | default | large",
    default: "''",
    desc: pick("数字输入框尺寸", "Numeric-input size."),
  },
  {
    name: "marks",
    type: "SliderMark[] | Record<string, string | number>",
    default: "[]",
    desc: pick("刻度标记", "Track marks."),
  },
  {
    name: "formatTooltip",
    type: "(value) => string",
    default: "undefined",
    desc: pick("格式化提示文案", "Formats tooltip content."),
  },
  {
    name: "formatValueText",
    type: "(value) => string",
    default: "undefined",
    desc: pick("辅助技术读取的值文本", "Formats value text for assistive technology."),
  },
  {
    name: "ariaLabel",
    type: "string",
    default: "''",
    desc: pick("滑块的无障碍标签", "Accessible slider label."),
  },
  {
    name: "rangeStartLabel",
    type: "string",
    default: "''",
    desc: pick("范围起点的无障碍标签", "Accessible label for the range start."),
  },
  {
    name: "rangeEndLabel",
    type: "string",
    default: "''",
    desc: pick("范围终点的无障碍标签", "Accessible label for the range end."),
  },
  {
    name: "label",
    type: "string",
    default: "''",
    desc: pick(
      "滑块及数字输入框的无障碍标签",
      "Accessible label for the slider and numeric input.",
    ),
  },
  {
    name: "validateEvent",
    type: "boolean",
    default: "true",
    desc: pick("变更时是否触发表单校验", "Whether changes trigger form validation."),
  },
  {
    name: "color",
    type: "string",
    default: "''",
    desc: pick("激活轨道颜色", "Active track color."),
  },
  { name: "size", type: "sm | md | lg", default: "md", desc: pick("滑块尺寸", "Slider size.") },
];

propsRows.push({
  name: "tickLabels",
  type: "Array<string | number>",
  default: "[]",
  desc: pick("均匀分布的刻度标签", "Evenly distributed tick labels."),
});

const eventsRows = [
  {
    name: "update:modelValue",
    type: "(value) => void",
    desc: pick("值变化时触发", "Emitted when the value changes."),
  },
  {
    name: "input",
    type: "(value) => void",
    desc: pick("拖动或输入时触发", "Emitted while dragging or typing."),
  },
  {
    name: "change",
    type: "(value) => void",
    desc: pick("提交变化时触发", "Emitted when a change is committed."),
  },
];

const methodsRows = [
  {
    name: "setValue(value)",
    desc: pick("主动设置值并触发 change", "Sets the value and emits change."),
  },
  {
    name: "clear()",
    desc: pick(
      "单值清空为最小值；范围清空为 [min, min]",
      "Resets a single value to min or a range to [min, min].",
    ),
  },
];

const slotsRows = [
  {
    name: "thumb-label",
    type: "{ value }",
    desc: pick("单值滑块的提示内容", "Tooltip content for a single-value slider."),
  },
  {
    name: "thumb-label-start",
    type: "{ value }",
    desc: pick("范围起点的提示内容", "Tooltip content for the range start."),
  },
  {
    name: "thumb-label-end",
    type: "{ value }",
    desc: pick("范围终点的提示内容", "Tooltip content for the range end."),
  },
];

const PageSliderProps = defineHtml(`
  <elf-api-builder component="elf-slider" title="API">
  <elf-props-table role="props" :title=${t("props")} :rows.prop=${propsRows}></elf-props-table>
  <elf-props-table role="events" :title=${t("events")} :rows.prop=${eventsRows}></elf-props-table>
  <elf-props-table role="slots" :title=${t("slots")} :rows.prop=${slotsRows}></elf-props-table>
  <elf-props-table role="methods" :title=${t("expose")} :rows.prop=${methodsRows}></elf-props-table>
  </elf-api-builder>
`);

export { PageSliderProps };
