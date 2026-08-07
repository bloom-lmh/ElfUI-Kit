import { defineHtml } from "@elfui/core";

import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();

const propsRows = () => [
  {
    name: "modelValue",
    type: "string | [string, string]",
    default: "''",
    desc: pick("受控日期或日期范围。", "Controlled date or date range."),
  },
  {
    name: "viewDate",
    type: "string",
    default: "''",
    desc: pick(
      "控制当前视图月份，以及空值时的初始月份。",
      "Control the visible month and the initial month for an empty value.",
    ),
  },
  {
    name: "defaultValue",
    type: "string",
    default: "''",
    desc: pick(
      "控制当前视图月份，以及空值时的初始月份。",
      "Control the visible month and the initial month for an empty value.",
    ),
  },
  {
    name: "range",
    type: "boolean",
    default: "false",
    desc: pick("启用日期范围选择。", "Enable date range selection."),
  },
  {
    name: "disabledDate",
    type: "(date: Date) => boolean",
    default: "-",
    desc: pick("禁用符合条件的日期。", "Disable matching dates."),
  },
  {
    name: "cellClassName",
    type: "(date: Date) => string",
    default: "-",
    desc: pick("为日期单元格返回状态类名。", "Return a state class for a date cell."),
  },
  {
    name: "renderDateCell",
    type: "(cell, date) => CalendarRenderValue",
    default: "-",
    desc: pick(
      "在保留按钮、键盘和 ARIA 语义的前提下渲染日期内容。",
      "Render date content while preserving button, keyboard, and ARIA semantics.",
    ),
  },
  {
    name: "showWeekNumber",
    type: "boolean",
    default: "false",
    desc: pick("显示 ISO 周序号。", "Show ISO week numbers."),
  },
  {
    name: "firstDayOfWeek",
    type: "0 - 6",
    default: "ConfigProvider / 1",
    desc: pick(
      "覆盖全局每周起始日，0 表示周日。",
      "Override the global first weekday; 0 represents Sunday.",
    ),
  },
  {
    name: "locale",
    type: "string",
    default: "LocaleProvider",
    desc: pick("覆盖月份与星期语言。", "Override the month and weekday locale."),
  },
  {
    name: "ariaLabel",
    type: "string",
    default: "Calendar",
    desc: pick("日期网格的无障碍名称。", "Accessible name for the date grid."),
  },
];

const eventsRows = () => [
  {
    name: "update:modelValue",
    type: "(value) => void",
    desc: pick("提交受控日期或范围值。", "Commit the controlled date or range value."),
  },
  {
    name: "change",
    type: "(value) => void",
    desc: pick("完成单日或范围选择。", "Complete a single-date or range selection."),
  },
  {
    name: "panel-change",
    type: "(date: Date) => void",
    desc: pick("当前视图月份发生变化。", "The visible month changed."),
  },
];

const slotsRows = () => [
  {
    name: "header",
    type: "unknown",
    desc: pick("自定义页脚月份摘要。", "Customize the footer month summary."),
  },
  {
    name: "prev-month",
    type: "unknown",
    desc: pick("自定义月份导航图标。", "Customize month navigation icons."),
  },
  {
    name: "next-month",
    type: "unknown",
    desc: pick("自定义月份导航图标。", "Customize month navigation icons."),
  },
  {
    name: "prev-year",
    type: "unknown",
    desc: pick("自定义年份导航图标。", "Customize year navigation icons."),
  },
  {
    name: "next-year",
    type: "unknown",
    desc: pick("自定义年份导航图标。", "Customize year navigation icons."),
  },
];

const PageCalendarProps = defineHtml(`
  <elf-api-builder component="elf-calendar" title="API">
  <elf-props-table role="props" title="elf-calendar Props" :rows=${propsRows()}></elf-props-table>
  <elf-props-table role="events" title="elf-calendar Events" :rows=${eventsRows()}></elf-props-table>
  <elf-props-table role="slots" title="elf-calendar Slots" :rows=${slotsRows()}></elf-props-table>
  </elf-api-builder>
`);

export { PageCalendarProps };
