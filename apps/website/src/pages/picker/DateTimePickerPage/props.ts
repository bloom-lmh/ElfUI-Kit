import { defineHtml } from "@elfui/core";

import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();

const propsRows = () => [
  {
    name: "modelValue / range",
    type: "string | [string, string] / boolean",
    default: "'' / false",
    desc: pick("受控日期时间值与范围模式。", "Controlled date-time value and range mode."),
  },
  {
    name: "format / valueFormat",
    type: "string",
    default: "YYYY-MM-DD HH:mm:ss",
    desc: pick("分别控制界面展示与对外值格式。", "Control display and external value formats."),
  },
  {
    name: "dateFormat / timeFormat",
    type: "string",
    default: pick("由 format 推导", "Derived from format"),
    desc: pick(
      "单独覆盖日期或时间区域的展示格式。",
      "Override date or time display format independently.",
    ),
  },
  {
    name: "defaultTime",
    type: "string | [string, string]",
    default: "00:00:00",
    desc: pick("只选择日期时用于补齐时间。", "Fill the time when only a date is selected."),
  },
  {
    name: "min / max",
    type: "string",
    default: "''",
    desc: pick(
      "日期时间整体边界；同一天时会继续约束时间。",
      "Combined boundaries that also constrain time on matching dates.",
    ),
  },
  {
    name: "disabledDate",
    type: "(date: Date) => boolean",
    default: "-",
    desc: pick("禁用符合条件的日期。", "Disable matching dates."),
  },
  {
    name: "disabledHours / disabledMinutes / disabledSeconds",
    type: "Function",
    default: "-",
    desc: pick("按范围角色禁用钟面单位。", "Disable clock units for each range role."),
  },
  {
    name: "shortcuts",
    type: "DateTimeShortcut[]",
    default: "[]",
    desc: pick(
      "日期时间快捷项；范围项可同时提供 endValue。",
      "Date-time shortcuts; range entries may include endValue.",
    ),
  },
  {
    name: "label / dateLabel / timeLabel",
    type: "string",
    default: "''",
    desc: pick(
      "组合字段及两个子字段的浮动标签。",
      "Floating labels for the compound and child fields.",
    ),
  },
  {
    name: "placeholder / startPlaceholder / endPlaceholder",
    type: "string",
    default: "LocaleProvider",
    desc: pick("单值与范围占位文本。", "Single and range placeholder text."),
  },
  {
    name: "variant / size",
    type: "FieldVariant / string",
    default: "filled / md",
    desc: pick("共享字段表面与尺寸协议。", "Shared field-surface and size protocols."),
  },
  {
    name: "disabled / readonly / editable / clearable",
    type: "boolean",
    default: "false / false / true / true",
    desc: pick("交互状态与清空能力。", "Interaction states and clear behavior."),
  },
  {
    name: "teleported / placement / popperOptions",
    type: "boolean / string / object",
    default: "true / bottom-start / {}",
    desc: pick("日期和时间浮层的定位配置。", "Positioning configuration for both overlays."),
  },
  {
    name: "valueOnClear / emptyValues",
    type: "unknown",
    default: "ConfigProvider",
    desc: pick(
      "复用全局清空值与判空策略。",
      "Reuse global clear-value and empty-value strategies.",
    ),
  },
  {
    name: "id / name / tabindex / ariaLabel",
    type: "string | number",
    default: "-",
    desc: pick(
      "原生表单、键盘与无障碍属性。",
      "Native form, keyboard, and accessibility attributes.",
    ),
  },
  {
    name: "validateEvent",
    type: "boolean",
    default: "true",
    desc: pick(
      "是否由组合字段触发 FormItem 校验。",
      "Whether the compound field triggers FormItem validation.",
    ),
  },
];

const eventsRows = () => [
  {
    name: "update:modelValue / change",
    type: "(value: DateTimePickerValue) => void",
    desc: pick(
      "提交受控值并报告一次语义变化。",
      "Commit the controlled value and report one semantic change.",
    ),
  },
  {
    name: "clear",
    type: "() => void",
    desc: pick("组合值已清空。", "The compound value was cleared."),
  },
  {
    name: "focus / blur",
    type: "(event: FocusEvent) => void",
    desc: pick("子字段焦点发生变化。", "A child field changed focus."),
  },
  {
    name: "calendar-change",
    type: "(value: DateTimePickerValue) => void",
    desc: pick("日历草稿发生变化。", "The calendar draft changed."),
  },
  {
    name: "visible-change",
    type: "(visible: boolean) => void",
    desc: pick("任一浮层可见性变化。", "Either overlay changed visibility."),
  },
];

const methodsRows = () => [
  {
    name: "openDate() / openTime() / close()",
    type: "Function",
    default: "-",
    desc: pick("控制日期和时间浮层。", "Control the date and time overlays."),
  },
  {
    name: "focus() / blur()",
    type: "Function",
    default: "-",
    desc: pick("控制组合字段焦点。", "Control compound-field focus."),
  },
];

const PageDateTimePickerProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="elf-date-time-picker Props" :rows=${propsRows()}></elf-props-table>
  <elf-props-table title="elf-date-time-picker Events" :rows=${eventsRows()}></elf-props-table>
  <elf-props-table title="elf-date-time-picker Methods" :rows=${methodsRows()}></elf-props-table>
`);

export { PageDateTimePickerProps };
