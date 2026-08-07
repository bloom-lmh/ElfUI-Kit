import { defineHtml } from "@elfui/core";

import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();

const propsRows = () => [
  {
    name: "modelValue",
    type: "string",
    default: "''",
    desc: pick("受控时间值，固定为 HH:mm。", "Controlled time value in canonical HH:mm form."),
  },
  {
    name: "start",
    type: "string",
    default: "09:00",
    desc: pick("固定选项的起点、终点与步长。", "Start, end, and interval of fixed options."),
  },
  {
    name: "end",
    type: "string",
    default: "18:00",
    desc: pick("固定选项的起点、终点与步长。", "Start, end, and interval of fixed options."),
  },
  {
    name: "step",
    type: "string",
    default: "00:30",
    desc: pick("固定选项的起点、终点与步长。", "Start, end, and interval of fixed options."),
  },
  {
    name: "includeEndTime",
    type: "boolean",
    default: "false",
    desc: pick("把精确结束时刻加入选项。", "Append the exact end time to the options."),
  },
  {
    name: "minTime",
    type: "string",
    default: "''",
    desc: pick(
      "禁用边界外的时间，用于范围联动。",
      "Disable times outside linked range boundaries.",
    ),
  },
  {
    name: "maxTime",
    type: "string",
    default: "''",
    desc: pick(
      "禁用边界外的时间，用于范围联动。",
      "Disable times outside linked range boundaries.",
    ),
  },
  {
    name: "format",
    type: "string",
    default: "HH:mm",
    desc: pick(
      "选项展示格式，不改变受控值。",
      "Option label format; does not change the controlled value.",
    ),
  },
  {
    name: "editable",
    type: "boolean",
    default: "true",
    desc: pick("允许输入筛选固定时间。", "Allow typing to filter fixed time options."),
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: pick("禁用状态与清空能力。", "Disabled state and clear behavior."),
  },
  {
    name: "clearable",
    type: "boolean",
    default: "true",
    desc: pick("禁用状态与清空能力。", "Disabled state and clear behavior."),
  },
  {
    name: "variant",
    type: "FieldVariant / string",
    default: "filled",
    desc: pick(
      "共享字段表面、尺寸与背景配置。",
      "Shared field surface, size, and background configuration.",
    ),
  },
  {
    name: "size",
    type: "FieldVariant / string",
    default: "md",
    desc: pick(
      "共享字段表面、尺寸与背景配置。",
      "Shared field surface, size, and background configuration.",
    ),
  },
  {
    name: "backgroundColor",
    type: "FieldVariant / string",
    default: "''",
    desc: pick(
      "共享字段表面、尺寸与背景配置。",
      "Shared field surface, size, and background configuration.",
    ),
  },
  {
    name: "label",
    type: "string",
    default: "''",
    desc: pick("浮动标签与占位文本。", "Floating label and placeholder."),
  },
  {
    name: "placeholder",
    type: "string",
    default: "''",
    desc: pick("浮动标签与占位文本。", "Floating label and placeholder."),
  },
  {
    name: "valueOnClear",
    type: "unknown",
    default: "ConfigProvider",
    desc: pick("复用全局清空值与判空协议。", "Reuse global clear-value and empty-value protocols."),
  },
  {
    name: "emptyValues",
    type: "unknown",
    default: "ConfigProvider",
    desc: pick("复用全局清空值与判空协议。", "Reuse global clear-value and empty-value protocols."),
  },
  {
    name: "effect",
    type: "string / object",
    default: "light",
    desc: pick("下拉面板主题与样式扩展点。", "Dropdown theme and styling extension points."),
  },
  {
    name: "popperClass",
    type: "string / object",
    default: "''",
    desc: pick("下拉面板主题与样式扩展点。", "Dropdown theme and styling extension points."),
  },
  {
    name: "popperStyle",
    type: "string / object",
    default: "''",
    desc: pick("下拉面板主题与样式扩展点。", "Dropdown theme and styling extension points."),
  },
  {
    name: "id",
    type: "string | number",
    default: "-",
    desc: pick("原生表单与键盘属性。", "Native form and keyboard attributes."),
  },
  {
    name: "name",
    type: "string | number",
    default: "-",
    desc: pick("原生表单与键盘属性。", "Native form and keyboard attributes."),
  },
  {
    name: "tabindex",
    type: "string | number",
    default: "-",
    desc: pick("原生表单与键盘属性。", "Native form and keyboard attributes."),
  },
  {
    name: "prefixIcon",
    type: "string",
    default: "''",
    desc: pick("前置与清空图标。", "Prefix and clear icons."),
  },
  {
    name: "clearIcon",
    type: "string",
    default: "''",
    desc: pick("前置与清空图标。", "Prefix and clear icons."),
  },
  {
    name: "validateEvent",
    type: "boolean",
    default: "true",
    desc: pick("是否触发 FormItem 校验。", "Whether to trigger FormItem validation."),
  },
];

const eventsRows = () => [
  {
    name: "update:modelValue",
    type: "(value: string) => void",
    desc: pick(
      "提交受控值并报告语义变化。",
      "Commit the controlled value and report semantic change.",
    ),
  },
  {
    name: "change",
    type: "(value: string) => void",
    desc: pick(
      "提交受控值并报告语义变化。",
      "Commit the controlled value and report semantic change.",
    ),
  },
  {
    name: "clear",
    type: "() => void",
    desc: pick("清空按钮被激活。", "The clear action was activated."),
  },
  {
    name: "focus",
    type: "(event: FocusEvent) => void",
    desc: pick("字段焦点变化。", "Field focus changed."),
  },
  {
    name: "blur",
    type: "(event: FocusEvent) => void",
    desc: pick("字段焦点变化。", "Field focus changed."),
  },
  {
    name: "visible-change",
    type: "(visible: boolean) => void",
    desc: pick("下拉面板可见状态变化。", "Dropdown visibility changed."),
  },
];

const methodsRows = () => [
  {
    name: "open()",
    type: "Function",
    default: "-",
    desc: pick("控制时间列表。", "Control the time list."),
  },
  {
    name: "close()",
    type: "Function",
    default: "-",
    desc: pick("控制时间列表。", "Control the time list."),
  },
  {
    name: "focus()",
    type: "Function",
    default: "-",
    desc: pick("控制字段焦点。", "Control field focus."),
  },
  {
    name: "blur()",
    type: "Function",
    default: "-",
    desc: pick("控制字段焦点。", "Control field focus."),
  },
];

const PageTimeSelectProps = defineHtml(`
  <elf-api-builder component="elf-time-select" title="API">
  <elf-props-table role="props" title="elf-time-select Props" :rows=${propsRows()}></elf-props-table>
  <elf-props-table role="events" title="elf-time-select Events" :rows=${eventsRows()}></elf-props-table>
  <elf-props-table role="methods" title="elf-time-select Methods" :rows=${methodsRows()}></elf-props-table>
  </elf-api-builder>
`);

export { PageTimeSelectProps };
