import { defineHtml, useComponents } from "@elfui/core";

import { PageTimePickerEx1 } from "./ex1";
import { PageTimePickerEx2 } from "./ex2";
import { PageTimePickerEx3 } from "./ex3";
import { PageTimePickerEx4 } from "./ex4";
import { PageTimePickerEx5 } from "./ex5";
import { PageTimePickerEx6 } from "./ex6";

const propsRows = [
  { name: "variant / label", type: "filled | outlined / string", default: "filled / ''", desc: "输入表面与浮动标签" },
  {
    name: "modelValue",
    type: "string | [string, string]",
    default: "''",
    desc: "当前时间；范围模式可传数组"
  },
  { name: "endValue", type: "string", default: "''", desc: "兼容单独结束时间绑定" },
  { name: "range / isRange", type: "boolean", default: "false", desc: "范围选择" },
  { name: "min / max", type: "string", default: "''", desc: "可选时间范围" },
  { name: "step", type: "number", default: "60", desc: "秒级步进" },
  { name: "format / valueFormat", type: "string", default: "HH:mm", desc: "展示格式与输出格式" },
  {
    name: "disabledHours / disabledMinutes / disabledSeconds",
    type: "Function",
    default: "-",
    desc: "按当前范围端点禁用时、分、秒"
  },
  {
    name: "readonly / editable",
    type: "boolean",
    default: "false / true",
    desc: "只读或禁止手动输入"
  },
  { name: "size", type: "sm | md | lg", default: "md", desc: "尺寸" },
  {
    name: "placeholder / startPlaceholder / endPlaceholder",
    type: "string",
    default: "-",
    desc: "占位文本"
  },
  { name: "rangeSeparator", type: "string", default: "至", desc: "范围分隔符" },
  { name: "shortcuts", type: "TimeShortcut[]", default: "[]", desc: "快捷项" },
  { name: "default-value", type: "string | [string,string]", default: "''", desc: "空值打开时钟面的初始编辑时刻" },
  { name: "clearable", type: "boolean", default: "true", desc: "可清空" },
  {
    name: "valueOnClear",
    type: "string | [string, string] | Function",
    default: "-",
    desc: "清空后的值"
  },
  { name: "id / name / tabindex", type: "string | number", default: "-", desc: "原生表单属性" },
  { name: "arrow-control", type: "boolean", default: "false", desc: "保留方向键控制语义" },
  { name: "teleported / placement", type: "boolean / top-start | bottom-start", default: "true / bottom-start", desc: "Top Layer 与首选方位" },
  { name: "popper-class / popper-style", type: "string / CSSProperties", default: "'' / {}", desc: "浮层外观" },
  { name: "popper-options / fallback-placements", type: "TimePickerPopperOptions / Placement[]", default: "{} / ['top-start']", desc: "浮层偏移、边距、翻转与候选方位" },
  { name: "aria-label / prefix-icon / clear-icon", type: "string", default: "''", desc: "无障碍名称与图标" },
  { name: "validate-event", type: "boolean", default: "true", desc: "是否触发 FormItem 校验" }
];

const eventsRows = [
  { name: "update:modelValue", type: "(value) => void", desc: "值变化" },
  { name: "update:endValue", type: "(value) => void", desc: "结束值变化" },
  { name: "change", type: "(value) => void", desc: "提交变化" },
  { name: "clear", type: "() => void", desc: "清空" },
  { name: "focus / blur", type: "(event) => void", desc: "聚焦和失焦" },
  { name: "visible-change", type: "(visible) => void", desc: "面板显示状态变化" }
];

const methodsRows = [
  { name: "focusInput(target?)", desc: "聚焦开始或结束触发器" },
  { name: "blurInput()", desc: "移除触发器焦点" },
  { name: "handleOpen()", desc: "手动标记打开状态" },
  { name: "handleClose()", desc: "手动标记关闭状态" }
];

useComponents({
  "page-time-picker-ex1": PageTimePickerEx1,
  "page-time-picker-ex2": PageTimePickerEx2,
  "page-time-picker-ex3": PageTimePickerEx3,
  "page-time-picker-ex4": PageTimePickerEx4,
  "page-time-picker-ex5": PageTimePickerEx5,
  "page-time-picker-ex6": PageTimePickerEx6
});

const PageTimePicker = defineHtml(`
  <elf-container>
    <h1>TimePicker 时间选择器</h1>
    <p>支持单时间、时间范围、步进、最小最大值、快捷项和清空。</p>
    <page-time-picker-ex1 />

    <page-time-picker-ex2 />

    <page-time-picker-ex3 />

    <page-time-picker-ex4 />

    <page-time-picker-ex5 />
    <page-time-picker-ex6 />

    <h2>API</h2>
    <elf-props-table title="属性" :rows=${propsRows}></elf-props-table>
    <elf-props-table title="事件" :rows=${eventsRows}></elf-props-table>
    <elf-props-table title="方法" :rows=${methodsRows}></elf-props-table>
  </elf-container>
`);

export { PageTimePicker };
