import { defineHtml } from "@elfui/core";

import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();

const propsRows = () => [
  {
    name: "modelValue",
    type: "DatePickerValue",
    default: "''",
    desc: pick(
      "受控单值、多选值和兼容范围结束值。",
      "Controlled single, multiple, and compatibility range-end values.",
    ),
  },
  {
    name: "endValue",
    type: "string",
    default: "''",
    desc: pick(
      "受控单值、多选值和兼容范围结束值。",
      "Controlled single, multiple, and compatibility range-end values.",
    ),
  },
  {
    name: "type",
    type: "DatePickerType",
    default: "date",
    desc: pick(
      "选择日期、日期时间、月份或周，并切换范围与多选模式。",
      "Select dates, date-times, months, or weeks and enable range or multiple mode.",
    ),
  },
  {
    name: "range",
    type: "boolean",
    default: "false",
    desc: pick(
      "选择日期、日期时间、月份或周，并切换范围与多选模式。",
      "Select dates, date-times, months, or weeks and enable range or multiple mode.",
    ),
  },
  {
    name: "multiple",
    type: "boolean",
    default: "false",
    desc: pick(
      "选择日期、日期时间、月份或周，并切换范围与多选模式。",
      "Select dates, date-times, months, or weeks and enable range or multiple mode.",
    ),
  },
  {
    name: "variant",
    type: "FieldVariant",
    default: "filled",
    desc: pick(
      "复用共享字段表面、Form 尺寸继承与浮动标签。",
      "Reuse shared field surfaces, inherited Form size, and floating labels.",
    ),
  },
  {
    name: "size",
    type: "DatePickerSize",
    default: "Form",
    desc: pick(
      "复用共享字段表面、Form 尺寸继承与浮动标签。",
      "Reuse shared field surfaces, inherited Form size, and floating labels.",
    ),
  },
  {
    name: "label",
    type: "string",
    default: "''",
    desc: pick(
      "复用共享字段表面、Form 尺寸继承与浮动标签。",
      "Reuse shared field surfaces, inherited Form size, and floating labels.",
    ),
  },
  {
    name: "format",
    type: "string",
    default: "''",
    desc: pick(
      "分别控制界面展示格式与对外绑定值格式。",
      "Control the display format and external bound-value format independently.",
    ),
  },
  {
    name: "valueFormat",
    type: "string",
    default: "''",
    desc: pick(
      "分别控制界面展示格式与对外绑定值格式。",
      "Control the display format and external bound-value format independently.",
    ),
  },
  {
    name: "min",
    type: "string",
    default: "''",
    desc: pick(
      "限制可选边界，并通过纯函数禁用具体日期。",
      "Limit selectable boundaries and disable individual dates with a pure function.",
    ),
  },
  {
    name: "max",
    type: "string",
    default: "''",
    desc: pick(
      "限制可选边界，并通过纯函数禁用具体日期。",
      "Limit selectable boundaries and disable individual dates with a pure function.",
    ),
  },
  {
    name: "disabledDate",
    type: "(date: Date) => boolean",
    default: "-",
    desc: pick(
      "限制可选边界，并通过纯函数禁用具体日期。",
      "Limit selectable boundaries and disable individual dates with a pure function.",
    ),
  },
  {
    name: "actions",
    type: "boolean",
    default: "false",
    desc: pick(
      "启用草稿确认流程和可选的面板摘要头部。",
      "Enable the draft confirmation flow and an optional panel summary header.",
    ),
  },
  {
    name: "showHeader",
    type: "boolean",
    default: "false",
    desc: pick(
      "启用草稿确认流程和可选的面板摘要头部。",
      "Enable the draft confirmation flow and an optional panel summary header.",
    ),
  },
  {
    name: "header",
    type: "string",
    default: "''",
    desc: pick(
      "启用草稿确认流程和可选的面板摘要头部。",
      "Enable the draft confirmation flow and an optional panel summary header.",
    ),
  },
  {
    name: "showFooter",
    type: "boolean",
    default: "false",
    desc: pick(
      "动作栏兼容开关，与 actions 共用同一提交语义。",
      "Action-bar compatibility switches that share the actions commit semantics.",
    ),
  },
  {
    name: "showConfirm",
    type: "boolean",
    default: "false",
    desc: pick(
      "动作栏兼容开关，与 actions 共用同一提交语义。",
      "Action-bar compatibility switches that share the actions commit semantics.",
    ),
  },
  {
    name: "placeholder",
    type: "string",
    default: "LocaleProvider",
    desc: pick(
      "单值与范围字段的本地化占位文本和分隔内容。",
      "Localized placeholders and separator copy for single and range fields.",
    ),
  },
  {
    name: "startPlaceholder",
    type: "string",
    default: "LocaleProvider",
    desc: pick(
      "单值与范围字段的本地化占位文本和分隔内容。",
      "Localized placeholders and separator copy for single and range fields.",
    ),
  },
  {
    name: "endPlaceholder",
    type: "string",
    default: "LocaleProvider",
    desc: pick(
      "单值与范围字段的本地化占位文本和分隔内容。",
      "Localized placeholders and separator copy for single and range fields.",
    ),
  },
  {
    name: "rangeSeparator",
    type: "string",
    default: "LocaleProvider",
    desc: pick(
      "单值与范围字段的本地化占位文本和分隔内容。",
      "Localized placeholders and separator copy for single and range fields.",
    ),
  },
  {
    name: "defaultValue",
    type: "string",
    default: "''",
    desc: pick(
      "空值打开时的面板日期和日期时间默认时刻。",
      "Initial panel date and date-time values used when opening an empty field.",
    ),
  },
  {
    name: "defaultTime",
    type: "string | [string, string]",
    default: "''",
    desc: pick(
      "空值打开时的面板日期和日期时间默认时刻。",
      "Initial panel date and date-time values used when opening an empty field.",
    ),
  },
  {
    name: "singlePanel",
    type: "boolean",
    default: "true",
    desc: pick(
      "控制范围模式的单双面板以及两个面板是否独立翻月。",
      "Control single or dual range panels and whether their navigation is linked.",
    ),
  },
  {
    name: "unlinkPanels",
    type: "boolean",
    default: "false",
    desc: pick(
      "控制范围模式的单双面板以及两个面板是否独立翻月。",
      "Control single or dual range panels and whether their navigation is linked.",
    ),
  },
  {
    name: "cellClassName",
    type: "(date: Date) => string",
    default: "-",
    desc: pick(
      "为日期单元格附加状态类并显示 ISO 周序号。",
      "Attach state classes to date cells and show ISO week numbers.",
    ),
  },
  {
    name: "showWeekNumber",
    type: "boolean",
    default: "false",
    desc: pick(
      "为日期单元格附加状态类并显示 ISO 周序号。",
      "Attach state classes to date cells and show ISO week numbers.",
    ),
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: pick(
      "统一禁用、只读、编辑和清空行为。",
      "Unify disabled, read-only, editable, and clearable behavior.",
    ),
  },
  {
    name: "readonly",
    type: "boolean",
    default: "false",
    desc: pick(
      "统一禁用、只读、编辑和清空行为。",
      "Unify disabled, read-only, editable, and clearable behavior.",
    ),
  },
  {
    name: "editable",
    type: "boolean",
    default: "true",
    desc: pick(
      "统一禁用、只读、编辑和清空行为。",
      "Unify disabled, read-only, editable, and clearable behavior.",
    ),
  },
  {
    name: "clearable",
    type: "boolean",
    default: "false",
    desc: pick(
      "统一禁用、只读、编辑和清空行为。",
      "Unify disabled, read-only, editable, and clearable behavior.",
    ),
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
    type: "DatePickerValue | Function",
    default: "ConfigProvider",
    desc: pick(
      "复用全局判空与清空值策略。",
      "Reuse global empty-value and clear-value strategies.",
    ),
  },
  {
    name: "validateEvent",
    type: "boolean",
    default: "true",
    desc: pick(
      "控制 FormItem 的 change 与 blur 校验。",
      "Control FormItem change and blur validation.",
    ),
  },
  {
    name: "shortcuts",
    type: "DateShortcut[]",
    default: "[]",
    desc: pick("单值或范围日期快捷项。", "Shortcuts for single dates or date ranges."),
  },
  {
    name: "confirmText",
    type: "string",
    default: "LocaleProvider",
    desc: pick("动作栏的本地化命令文本。", "Localized action-bar command labels."),
  },
  {
    name: "cancelText",
    type: "string",
    default: "LocaleProvider",
    desc: pick("动作栏的本地化命令文本。", "Localized action-bar command labels."),
  },
  {
    name: "clearText",
    type: "string",
    default: "LocaleProvider",
    desc: pick("动作栏的本地化命令文本。", "Localized action-bar command labels."),
  },
  {
    name: "teleported",
    type: "boolean",
    default: "true",
    desc: pick(
      "原生 Popover Top Layer、首选方位与翻转候选方位。",
      "Native Popover Top Layer behavior, preferred placement, and flip candidates.",
    ),
  },
  {
    name: "placement",
    type: "DatePickerPlacement",
    default: "bottom-start",
    desc: pick(
      "原生 Popover Top Layer、首选方位与翻转候选方位。",
      "Native Popover Top Layer behavior, preferred placement, and flip candidates.",
    ),
  },
  {
    name: "fallbackPlacements",
    type: "DatePickerPlacement[]",
    default: "['top-start']",
    desc: pick(
      "原生 Popover Top Layer、首选方位与翻转候选方位。",
      "Native Popover Top Layer behavior, preferred placement, and flip candidates.",
    ),
  },
  {
    name: "popperOptions",
    type: "DatePickerPopperOptions",
    default: "{}",
    desc: pick(
      "复用锚定浮层定位策略并扩展面板外观。",
      "Reuse anchored-overlay positioning and extend panel appearance.",
    ),
  },
  {
    name: "popperClass",
    type: "string",
    default: "''",
    desc: pick(
      "复用锚定浮层定位策略并扩展面板外观。",
      "Reuse anchored-overlay positioning and extend panel appearance.",
    ),
  },
  {
    name: "popperStyle",
    type: "CSSProperties",
    default: "{}",
    desc: pick(
      "复用锚定浮层定位策略并扩展面板外观。",
      "Reuse anchored-overlay positioning and extend panel appearance.",
    ),
  },
  {
    name: "id",
    type: "string",
    default: "''",
    desc: pick(
      "原生表单属性、键盘顺序与无障碍名称。",
      "Native form attributes, keyboard order, and accessible name.",
    ),
  },
  {
    name: "name",
    type: "string",
    default: "''",
    desc: pick(
      "原生表单属性、键盘顺序与无障碍名称。",
      "Native form attributes, keyboard order, and accessible name.",
    ),
  },
  {
    name: "tabindex",
    type: "string | number",
    default: "0",
    desc: pick(
      "原生表单属性、键盘顺序与无障碍名称。",
      "Native form attributes, keyboard order, and accessible name.",
    ),
  },
  {
    name: "ariaLabel",
    type: "string",
    default: "''",
    desc: pick(
      "原生表单属性、键盘顺序与无障碍名称。",
      "Native form attributes, keyboard order, and accessible name.",
    ),
  },
];

const eventRows = () => [
  {
    name: "update:modelValue",
    type: "(value) => void",
    desc: pick(
      "提交受控单值、多选值或范围结束值。",
      "Commit the controlled single, multiple, or range-end value.",
    ),
  },
  {
    name: "update:endValue",
    type: "(value) => void",
    desc: pick(
      "提交受控单值、多选值或范围结束值。",
      "Commit the controlled single, multiple, or range-end value.",
    ),
  },
  {
    name: "change",
    type: "(value: DatePickerValue) => void",
    desc: pick(
      "报告即时选择变化或动作栏确认提交。",
      "Report an immediate selection change or action-bar confirmation.",
    ),
  },
  {
    name: "confirm",
    type: "(value: DatePickerValue) => void",
    desc: pick(
      "报告即时选择变化或动作栏确认提交。",
      "Report an immediate selection change or action-bar confirmation.",
    ),
  },
  {
    name: "cancel",
    type: "() => void",
    desc: pick("取消草稿或提交清空值。", "Cancel the draft or commit the configured clear value."),
  },
  {
    name: "clear",
    type: "() => void",
    desc: pick("取消草稿或提交清空值。", "Cancel the draft or commit the configured clear value."),
  },
  {
    name: "focus",
    type: "(event: FocusEvent) => void",
    desc: pick("触发器焦点状态变化。", "The trigger focus state changed."),
  },
  {
    name: "blur",
    type: "(event: FocusEvent) => void",
    desc: pick("触发器焦点状态变化。", "The trigger focus state changed."),
  },
  {
    name: "calendar-change",
    type: "(value: DatePickerValue) => void",
    desc: pick("面板内临时选择发生变化。", "The temporary selection inside the panel changed."),
  },
  {
    name: "panel-change",
    type: "(date: Date, mode: 'month' | 'year') => void",
    desc: pick("月份或年份面板发生变化。", "The month or year panel changed."),
  },
  {
    name: "visible-change",
    type: "(visible: boolean) => void",
    desc: pick("日期浮层显示状态变化。", "The date overlay changed visibility."),
  },
];

const methodRows = () => [
  {
    name: "focusInput()",
    type: "Function",
    default: "-",
    desc: pick("控制日期触发器焦点。", "Control focus on the date trigger."),
  },
  {
    name: "blurInput()",
    type: "Function",
    default: "-",
    desc: pick("控制日期触发器焦点。", "Control focus on the date trigger."),
  },
  {
    name: "handleOpen()",
    type: "Function",
    default: "-",
    desc: pick(
      "以公开命令打开或关闭日期面板。",
      "Open or close the date panel through public commands.",
    ),
  },
  {
    name: "handleClose()",
    type: "Function",
    default: "-",
    desc: pick(
      "以公开命令打开或关闭日期面板。",
      "Open or close the date panel through public commands.",
    ),
  },
];

const slotRows = () => [
  {
    name: "range-separator",
    type: "Slot",
    default: "LocaleProvider",
    desc: pick("自定义范围分隔内容。", "Customize the range separator content."),
  },
  {
    name: "prev-month",
    type: "Slot",
    default: "‹",
    desc: pick("自定义月份导航内容。", "Customize month navigation content."),
  },
  {
    name: "next-month",
    type: "Slot",
    default: "›",
    desc: pick("自定义月份导航内容。", "Customize month navigation content."),
  },
  {
    name: "prev-year",
    type: "Slot",
    default: "‹",
    desc: pick("自定义年份导航内容。", "Customize year navigation content."),
  },
  {
    name: "next-year",
    type: "Slot",
    default: "›",
    desc: pick("自定义年份导航内容。", "Customize year navigation content."),
  },
];

const PageDatePickerProps = defineHtml(`
  <elf-api-builder component="elf-date-picker" title="API">
  <elf-props-table role="props" title="elf-date-picker Props" :rows=${propsRows()}></elf-props-table>
  <elf-props-table role="events" title="elf-date-picker Events" :rows=${eventRows()}></elf-props-table>
  <elf-props-table role="methods" title="elf-date-picker Methods" :rows=${methodRows()}></elf-props-table>
  <elf-props-table role="slots" title="elf-date-picker Slots" :rows=${slotRows()}></elf-props-table>
  </elf-api-builder>
`);

export { PageDatePickerProps };
