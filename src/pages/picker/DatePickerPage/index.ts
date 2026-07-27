import { defineHtml, useComponents } from "@elfui/core";

import { PageDatePickerEx1 } from "./ex1";
import { PageDatePickerEx2 } from "./ex2";
import { PageDatePickerEx3 } from "./ex3";
import { PageDatePickerEx4 } from "./ex4";
import { PageDatePickerEx5 } from "./ex5";
import { PageDatePickerEx6 } from "./ex6";
import { PageDatePickerEx7 } from "./ex7";

const propsRows = [
  { name: "variant / label", type: "default | outlined | underlined | solo | solo-filled | solo-inverted / string", default: "filled / ''", desc: "输入表面与浮动标签" },
  { name: "size", type: "sm | md | lg", default: "继承 Form", desc: "尺寸，支持 Form / FormItem 继承" },
  { name: "format / value-format", type: "string / string", default: "'' / ''", desc: "分别控制展示字符串与绑定值格式" },
  { name: "modelValue", type: "string | string[]", default: "''", desc: "当前值，多选时为数组" },
  { name: "endValue", type: "string", default: "''", desc: "范围选择的结束值" },
  {
    name: "type",
    type: "date | datetime-local | month | week",
    default: "date",
    desc: "原生日期输入类型"
  },
  { name: "range", type: "boolean", default: "false", desc: "开启开始/结束范围选择" },
  { name: "multiple", type: "boolean", default: "false", desc: "开启多日期选择" },
  { name: "actions", type: "boolean", default: "false", desc: "显示确认/取消动作栏" },
  { name: "show-header", type: "boolean", default: "false", desc: "显示顶部摘要" },
  { name: "header", type: "string", default: "''", desc: "自定义顶部标题" },
  { name: "min / max", type: "string", default: "''", desc: "可选范围" },
  { name: "disabled-date", type: "(date: Date) => boolean", default: "undefined", desc: "返回 true 时禁用日期" },
  { name: "readonly / editable", type: "boolean", default: "false / true", desc: "只读或禁止原生字段编辑" },
  { name: "start-placeholder / end-placeholder / range-separator", type: "string", default: "本地化文本", desc: "范围字段文案" },
  { name: "id / name / tabindex / aria-label", type: "string | number", default: "-", desc: "原生表单与无障碍属性" },
  { name: "value-on-clear / empty-values", type: "DatePickerValue | Function / unknown[]", default: "'' / [undefined, null, '']", desc: "空值契约" },
  { name: "validate-event", type: "boolean", default: "true", desc: "是否触发 FormItem 校验" },
  { name: "teleported / placement", type: "boolean / top-start | bottom-start", default: "true / bottom-start", desc: "Top Layer 与首选方位" },
  { name: "popper-class / popper-style", type: "string / CSSProperties", default: "'' / {}", desc: "浮层外观" },
  { name: "popper-options / fallback-placements", type: "DatePickerPopperOptions / Placement[]", default: "{} / ['top-start']", desc: "浮层偏移、边距、翻转与候选方位" },
  { name: "default-value / default-time", type: "string / string | [string,string]", default: "''", desc: "空值时的初始面板日期与日期时间默认时刻" },
  { name: "single-panel / unlink-panels", type: "boolean", default: "true / false", desc: "范围模式的单双面板与独立翻月" },
  { name: "cell-class-name / show-week-number", type: "Function / boolean", default: "- / false", desc: "日期单元格状态类与 ISO 周序号" },
  { name: "show-footer / show-confirm", type: "boolean", default: "false", desc: "显示动作栏" },
  { name: "shortcuts", type: "DateShortcut[]", default: "[]", desc: "快捷项" },
  { name: "clearable", type: "boolean", default: "false", desc: "允许清空" }
];

const eventRows = [
  { name: "update:modelValue", type: "string | string[]", desc: "值更新" },
  { name: "update:endValue", type: "string", desc: "范围结束值更新" },
  { name: "change", type: "string | string[]", desc: "选择变化" },
  { name: "confirm", type: "string | string[]", desc: "动作栏确认" },
  { name: "cancel", type: "void", desc: "动作栏取消" },
  { name: "clear", type: "void", desc: "清空" },
  { name: "focus / blur", type: "FocusEvent" },
  { name: "calendar-change", type: "DatePickerValue", desc: "面板内临时选择变化" },
  { name: "panel-change", type: "Date, month | year", desc: "年月面板变化" },
  { name: "visible-change", type: "boolean" }
];

const methodRows = [
  { name: "focusInput() / blurInput()", desc: "控制触发器焦点" },
  { name: "handleOpen() / handleClose()", desc: "命令式打开或关闭面板" }
];

const slotRows = [
  { name: "range-separator", desc: "范围分隔内容" },
  { name: "prev-month / next-month", desc: "日期面板月份导航图标" },
  { name: "prev-year / next-year", desc: "年份导航图标" }
];

useComponents({
  "page-date-picker-ex1": PageDatePickerEx1,
  "page-date-picker-ex2": PageDatePickerEx2,
  "page-date-picker-ex3": PageDatePickerEx3,
  "page-date-picker-ex4": PageDatePickerEx4,
  "page-date-picker-ex5": PageDatePickerEx5,
  "page-date-picker-ex6": PageDatePickerEx6,
  "page-date-picker-ex7": PageDatePickerEx7
});

const PageDatePicker = defineHtml(`
  <elf-container>
    <h1>DatePicker 日期选择器</h1>
    <p>用于单日期、日期范围、月份和多日期选择；需要明确提交的场景可以开启动作栏。</p>

    <page-date-picker-ex1 />

    <page-date-picker-ex2 />

    <page-date-picker-ex3 />

    <page-date-picker-ex4 />

    <page-date-picker-ex5 />

    <page-date-picker-ex6 />
    <page-date-picker-ex7 />

    <h2>API</h2>
    <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
    <elf-props-table title="Events" :rows=${eventRows}></elf-props-table>
    <elf-props-table title="Exposes" :rows=${methodRows}></elf-props-table>
    <elf-props-table title="Slots" :rows=${slotRows}></elf-props-table>
  </elf-container>
`);

export { PageDatePicker };
