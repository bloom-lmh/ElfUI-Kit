import { defineHtml, useComponents } from "@elfui/core";

import { PageCalendarEx1 } from "./ex1";
import { PageCalendarEx2 } from "./ex2";
import { PageCalendarEx3 } from "./ex3";
import { PageCalendarEx4 } from "./ex4";
import { PageCalendarEx5 } from "./ex5";

const propsRows = [
  { name: "modelValue", type: "string | [string, string]", default: "''", desc: "选中日期或日期范围" },
  { name: "viewDate / defaultValue", type: "string", default: "''", desc: "受控视图月份与空值时的初始月份" },
  { name: "range", type: "boolean", default: "false", desc: "启用范围选择" },
  { name: "disabledDate", type: "(date: Date) => boolean", default: "-", desc: "禁用日期判定" },
  { name: "cellClassName", type: "(date: Date) => string", default: "-", desc: "日期单元格状态类" },
  { name: "renderDateCell", type: "(cell, date) => CalendarRenderValue", default: "-", desc: "类型化日期内容渲染器" },
  { name: "showWeekNumber", type: "boolean", default: "false", desc: "显示 ISO 周序号" },
  { name: "firstDayOfWeek", type: "0 - 6", default: "1", desc: "每周第一天" },
  { name: "locale", type: "string", default: "Provider locale", desc: "日期与星期语言" },
  { name: "ariaLabel", type: "string", default: "Calendar", desc: "日期网格无障碍名称" },
];

const slotsRows = [
  { name: "header", type: "unknown", desc: "页脚月份摘要内容" },
  { name: "prev-month / next-month", type: "unknown", desc: "月份导航图标" },
  { name: "prev-year / next-year", type: "unknown", desc: "年份导航图标" },
];

const eventsRows = [
  { name: "update:modelValue", type: "(value) => void", desc: "选择值变化" },
  { name: "change", type: "(value) => void", desc: "完成单日或范围选择" },
  { name: "panel-change", type: "(year, month) => void", desc: "视图月份变化" },
];

useComponents({
  "page-calendar-ex1": PageCalendarEx1,
  "page-calendar-ex2": PageCalendarEx2,
  "page-calendar-ex3": PageCalendarEx3,
  "page-calendar-ex4": PageCalendarEx4,
  "page-calendar-ex5": PageCalendarEx5,
});

const PageCalendar = defineHtml(`
  <elf-container>
    <h1>Calendar 日历</h1>
    <p>展示月视图日期选择，支持年 / 月层级切换、范围、周序号、键盘导航与自定义日期内容。</p>
    <page-calendar-ex1 />
    <page-calendar-ex2 />
    <page-calendar-ex3 />
    <page-calendar-ex4 />
    <page-calendar-ex5 />

    <h2>API</h2>
    <elf-props-table title="属性" :rows=${propsRows}></elf-props-table>
    <elf-props-table title="事件" :rows=${eventsRows}></elf-props-table>
    <elf-props-table title="Slots" :rows=${slotsRows}></elf-props-table>
  </elf-container>
`);

export { PageCalendar };
