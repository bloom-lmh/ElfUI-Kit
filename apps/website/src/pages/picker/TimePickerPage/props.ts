import { defineHtml } from "@elfui/core";

import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();

const propsRows = () => [
  {
    name: "modelValue",
    type: "string | [string, string]",
    default: "''",
    desc: pick(
      "受控时间值；范围模式使用二元数组。",
      "Controlled time value; range mode uses a two-item tuple.",
    ),
  },
  {
    name: "isRange",
    type: "boolean",
    default: "false",
    desc: pick(
      "受控时间值；范围模式使用二元数组。",
      "Controlled time value; range mode uses a two-item tuple.",
    ),
  },
  {
    name: "endValue",
    type: "string",
    default: "''",
    desc: pick(
      "兼容独立结束值与旧范围开关。",
      "Compatibility aliases for a separate end value and the legacy range flag.",
    ),
  },
  {
    name: "range",
    type: "boolean",
    default: "false",
    desc: pick(
      "兼容独立结束值与旧范围开关。",
      "Compatibility aliases for a separate end value and the legacy range flag.",
    ),
  },
  {
    name: "format",
    type: "string",
    default: "HH:mm",
    desc: pick(
      "分别控制界面展示格式与对外值格式。",
      "Control the display format and external value format independently.",
    ),
  },
  {
    name: "valueFormat",
    type: "string",
    default: "HH:mm",
    desc: pick(
      "分别控制界面展示格式与对外值格式。",
      "Control the display format and external value format independently.",
    ),
  },
  {
    name: "step",
    type: "number",
    default: "60",
    desc: pick(
      "键盘调整与钟面刻度使用的秒级步进。",
      "Step in seconds used by keyboard adjustment and clock ticks.",
    ),
  },
  {
    name: "disabledHours",
    type: "Function",
    default: "-",
    desc: pick(
      "按当前范围端点禁用时、分、秒。",
      "Disable hours, minutes, and seconds for the active range endpoint.",
    ),
  },
  {
    name: "disabledMinutes",
    type: "Function",
    default: "-",
    desc: pick(
      "按当前范围端点禁用时、分、秒。",
      "Disable hours, minutes, and seconds for the active range endpoint.",
    ),
  },
  {
    name: "disabledSeconds",
    type: "Function",
    default: "-",
    desc: pick(
      "按当前范围端点禁用时、分、秒。",
      "Disable hours, minutes, and seconds for the active range endpoint.",
    ),
  },
  {
    name: "min",
    type: "string",
    default: "''",
    desc: pick("限制可提交的最小与最大时间。", "Limit the minimum and maximum committed times."),
  },
  {
    name: "max",
    type: "string",
    default: "''",
    desc: pick("限制可提交的最小与最大时间。", "Limit the minimum and maximum committed times."),
  },
  {
    name: "defaultValue",
    type: "string | [string, string]",
    default: "''",
    desc: pick(
      "空值打开时使用的钟面草稿，不会提前提交。",
      "Clock draft used when opening an empty field without committing it early.",
    ),
  },
  {
    name: "shortcuts",
    type: "TimeShortcut[]",
    default: "[]",
    desc: pick("单值或范围快捷项。", "Shortcuts for single values or ranges."),
  },
  {
    name: "readonly",
    type: "boolean",
    default: "false",
    desc: pick(
      "只读、编辑、禁用与清空状态。",
      "Read-only, editable, disabled, and clearable states.",
    ),
  },
  {
    name: "editable",
    type: "boolean",
    default: "true",
    desc: pick(
      "只读、编辑、禁用与清空状态。",
      "Read-only, editable, disabled, and clearable states.",
    ),
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: pick(
      "只读、编辑、禁用与清空状态。",
      "Read-only, editable, disabled, and clearable states.",
    ),
  },
  {
    name: "clearable",
    type: "boolean",
    default: "true",
    desc: pick(
      "只读、编辑、禁用与清空状态。",
      "Read-only, editable, disabled, and clearable states.",
    ),
  },
  {
    name: "variant",
    type: "FieldVariant",
    default: "filled",
    desc: pick(
      "共享字段表面、继承尺寸与浮动标签。",
      "Shared field surface, inherited size, and floating label.",
    ),
  },
  {
    name: "size",
    type: "string",
    default: "Form",
    desc: pick(
      "共享字段表面、继承尺寸与浮动标签。",
      "Shared field surface, inherited size, and floating label.",
    ),
  },
  {
    name: "label",
    type: "string",
    default: "''",
    desc: pick(
      "共享字段表面、继承尺寸与浮动标签。",
      "Shared field surface, inherited size, and floating label.",
    ),
  },
  {
    name: "placeholder",
    type: "string",
    default: "LocaleProvider",
    desc: pick(
      "单值与范围字段的本地化占位文本。",
      "Localized placeholders for single and range fields.",
    ),
  },
  {
    name: "startPlaceholder",
    type: "string",
    default: "LocaleProvider",
    desc: pick(
      "单值与范围字段的本地化占位文本。",
      "Localized placeholders for single and range fields.",
    ),
  },
  {
    name: "endPlaceholder",
    type: "string",
    default: "LocaleProvider",
    desc: pick(
      "单值与范围字段的本地化占位文本。",
      "Localized placeholders for single and range fields.",
    ),
  },
  {
    name: "rangeSeparator",
    type: "string",
    default: "LocaleProvider",
    desc: pick("范围字段之间的本地化分隔符。", "Localized separator between range fields."),
  },
  {
    name: "emptyValues",
    type: "unknown[]",
    default: "ConfigProvider",
    desc: pick(
      "复用全局判空与清空值策略。",
      "Reuse global empty-value and clear-value strategies.",
    ),
  },
  {
    name: "valueOnClear",
    type: "value | Function",
    default: "ConfigProvider",
    desc: pick(
      "复用全局判空与清空值策略。",
      "Reuse global empty-value and clear-value strategies.",
    ),
  },
  {
    name: "saveOnBlur",
    type: "boolean",
    default: "true",
    desc: pick("控制失焦提交与 FormItem 校验。", "Control blur commits and FormItem validation."),
  },
  {
    name: "validateEvent",
    type: "boolean",
    default: "true",
    desc: pick("控制失焦提交与 FormItem 校验。", "Control blur commits and FormItem validation."),
  },
  {
    name: "teleported",
    type: "boolean",
    default: "true",
    desc: pick(
      "Top Layer、首选方位与翻转候选方位。",
      "Top Layer behavior, preferred placement, and flip candidates.",
    ),
  },
  {
    name: "placement",
    type: "TimePickerPlacement",
    default: "bottom-start",
    desc: pick(
      "Top Layer、首选方位与翻转候选方位。",
      "Top Layer behavior, preferred placement, and flip candidates.",
    ),
  },
  {
    name: "fallbackPlacements",
    type: "TimePickerPlacement[]",
    default: "['top-start']",
    desc: pick(
      "Top Layer、首选方位与翻转候选方位。",
      "Top Layer behavior, preferred placement, and flip candidates.",
    ),
  },
  {
    name: "popperOptions",
    type: "TimePickerPopperOptions",
    default: "{}",
    desc: pick(
      "浮层定位策略与外观扩展。",
      "Overlay positioning strategy and appearance extensions.",
    ),
  },
  {
    name: "popperClass",
    type: "string",
    default: "''",
    desc: pick(
      "浮层定位策略与外观扩展。",
      "Overlay positioning strategy and appearance extensions.",
    ),
  },
  {
    name: "popperStyle",
    type: "CSSProperties",
    default: "{}",
    desc: pick(
      "浮层定位策略与外观扩展。",
      "Overlay positioning strategy and appearance extensions.",
    ),
  },
  {
    name: "id",
    type: "string | [string, string] | number",
    default: "''",
    desc: pick(
      "原生表单、键盘顺序与无障碍名称。",
      "Native form attributes, keyboard order, and accessible name.",
    ),
  },
  {
    name: "name",
    type: "string | [string, string] | number",
    default: "''",
    desc: pick(
      "原生表单、键盘顺序与无障碍名称。",
      "Native form attributes, keyboard order, and accessible name.",
    ),
  },
  {
    name: "tabindex",
    type: "string | [string, string] | number",
    default: "0",
    desc: pick(
      "原生表单、键盘顺序与无障碍名称。",
      "Native form attributes, keyboard order, and accessible name.",
    ),
  },
  {
    name: "ariaLabel",
    type: "string | [string, string] | number",
    default: "''",
    desc: pick(
      "原生表单、键盘顺序与无障碍名称。",
      "Native form attributes, keyboard order, and accessible name.",
    ),
  },
  {
    name: "prefixIcon",
    type: "string",
    default: "''",
    desc: pick("图标名称与方向键控制语义。", "Icon names and arrow-key control semantics."),
  },
  {
    name: "clearIcon",
    type: "string",
    default: "''",
    desc: pick("图标名称与方向键控制语义。", "Icon names and arrow-key control semantics."),
  },
  {
    name: "arrowControl",
    type: "boolean",
    default: "false",
    desc: pick("图标名称与方向键控制语义。", "Icon names and arrow-key control semantics."),
  },
];

const eventsRows = () => [
  {
    name: "update:modelValue",
    type: "(value) => void",
    desc: pick(
      "提交受控单值、范围值或兼容结束值。",
      "Commit the controlled single value, range value, or compatibility end value.",
    ),
  },
  {
    name: "update:endValue",
    type: "(value) => void",
    desc: pick(
      "提交受控单值、范围值或兼容结束值。",
      "Commit the controlled single value, range value, or compatibility end value.",
    ),
  },
  {
    name: "change",
    type: "(value: TimePickerModelValue) => void",
    desc: pick("值完成一次语义变化。", "The value completed one semantic change."),
  },
  {
    name: "clear",
    type: "() => void",
    desc: pick("清空按钮已提交清空值。", "The clear button committed the configured clear value."),
  },
  {
    name: "focus",
    type: "(event: FocusEvent) => void",
    desc: pick("开始或结束触发器的焦点变化。", "Focus changes on the start or end trigger."),
  },
  {
    name: "blur",
    type: "(event: FocusEvent) => void",
    desc: pick("开始或结束触发器的焦点变化。", "Focus changes on the start or end trigger."),
  },
  {
    name: "visible-change",
    type: "(visible: boolean) => void",
    desc: pick("钟面浮层显示状态变化。", "The clock overlay changed visibility."),
  },
];

const methodsRows = () => [
  {
    name: "focusInput(target?)",
    type: "Function",
    default: "-",
    desc: pick("控制开始或结束触发器焦点。", "Control focus for the start or end trigger."),
  },
  {
    name: "blurInput()",
    type: "Function",
    default: "-",
    desc: pick("控制开始或结束触发器焦点。", "Control focus for the start or end trigger."),
  },
  {
    name: "handleOpen(target?)",
    type: "Function",
    default: "-",
    desc: pick("以公开命令打开或关闭钟面。", "Open or close the clock through public commands."),
  },
  {
    name: "handleClose()",
    type: "Function",
    default: "-",
    desc: pick("以公开命令打开或关闭钟面。", "Open or close the clock through public commands."),
  },
];

const PageTimePickerProps = defineHtml(`
  <elf-api-builder component="elf-time-picker" title="API">
  <elf-props-table role="props" title="elf-time-picker Props" :rows=${propsRows()}></elf-props-table>
  <elf-props-table role="events" title="elf-time-picker Events" :rows=${eventsRows()}></elf-props-table>
  <elf-props-table role="methods" title="elf-time-picker Methods" :rows=${methodsRows()}></elf-props-table>
  </elf-api-builder>
`);

export { PageTimePickerProps };
