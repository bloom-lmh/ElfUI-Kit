import { defineHtml, useComponents } from "@elfui/core";


import { PageColorPickerEx1 } from "./ex1";
import { PageColorPickerEx2 } from "./ex2";
import { PageColorPickerEx3 } from "./ex3";
import { PageColorPickerEx4 } from "./ex4";

const propsRows = [
  { name: "variant / label", type: "filled | outlined / string", default: "filled / ''", desc: "输入表面与浮动标签" },
  { name: "modelValue", type: "string", default: "#6750a4", desc: "当前颜色" },
  { name: "format", type: "hex | rgb", default: "hex", desc: "输出格式" },
  { name: "color-format", type: "hex | rgb", default: "''", desc: "Element 兼容格式别名，优先于 format" },
  { name: "presets", type: "Array", default: "[]", desc: "预设色" },
  { name: "predefine", type: "Array", default: "[]", desc: "Element 兼容预设色别名" },
  { name: "showAlpha", type: "boolean", default: "false", desc: "透明度" },
  { name: "clearable", type: "boolean", default: "false", desc: "可清空" },
  { name: "size", type: "sm | md | lg", default: "md", desc: "尺寸" },
  { name: "id / name / tabindex / ariaLabel", type: "string | number", default: "-", desc: "表单与无障碍属性" },
  { name: "valueOnClear", type: "string | Function", default: "''", desc: "清空后的值" },
  { name: "validateEvent", type: "boolean", default: "true", desc: "是否触发表单校验" },
  { name: "teleported / persistent", type: "boolean", default: "true / false", desc: "Top Layer 与外部点击关闭策略" },
  { name: "popper-class / popper-style", type: "string / CSSProperties", default: "'' / {}", desc: "浮层外观" },
  { name: "append-to", type: "string | HTMLElement", default: "null", desc: "将面板挂载到指定容器，并保留独立 Shadow 样式" },
  { name: "hue-slider-class / hue-slider-style", type: "string / CSSProperties", default: "'' / {}", desc: "定制原生色板入口" },
  { name: "border", type: "boolean", default: "true", desc: "是否显示输入表面边框" }
];

const eventsRows = [
  { name: "update:modelValue / input / change", type: "(value) => void", desc: "颜色值更新" },
  { name: "active-change", type: "(value) => void", desc: "面板内活动颜色变化" },
  { name: "clear", type: "() => void", desc: "清空颜色" },
  { name: "focus / blur", type: "(event) => void", desc: "文本输入聚焦状态" },
  { name: "visible-change", type: "(visible) => void", desc: "面板显示状态" }
];

const methodsRows = [
  { name: "show() / hide()", desc: "打开或关闭面板" },
  { name: "focusInput() / blurInput()", desc: "控制文本输入焦点" },
  { name: "update(value)", desc: "校验并提交颜色" },
  { name: "inputRef", desc: "内部文本输入引用" }
];

useComponents({
  "page-color-picker-ex1": PageColorPickerEx1,
  "page-color-picker-ex2": PageColorPickerEx2,
  "page-color-picker-ex3": PageColorPickerEx3,
  "page-color-picker-ex4": PageColorPickerEx4
});

const PageColorPicker = defineHtml(`
  <elf-container>
    <h1>ColorPicker 颜色选择器</h1>
    <p>支持原生色板、文本输入、透明度、清空和预设色。</p>
    <page-color-picker-ex1 />

    <page-color-picker-ex2 />
    <page-color-picker-ex3 />
    <page-color-picker-ex4 />
    <h2>API</h2>
    <elf-props-table title="属性" :rows=${propsRows}></elf-props-table>
    <elf-props-table title="事件" :rows=${eventsRows}></elf-props-table>
    <elf-props-table title="方法" :rows=${methodsRows}></elf-props-table>
  </elf-container>
`);

export { PageColorPicker };
