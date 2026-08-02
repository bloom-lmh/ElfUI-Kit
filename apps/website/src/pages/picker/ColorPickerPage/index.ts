import { defineHtml, useComponents } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import { PageColorPickerEx1 } from "./ex1";
import { PageColorPickerEx2 } from "./ex2";
import { PageColorPickerEx3 } from "./ex3";
import { PageColorPickerEx4 } from "./ex4";
import { PageColorPickerEx5 } from "./ex5";

const t = createDocsTranslator({
  title: { zh: "ColorPicker 颜色选择器", en: "ColorPicker" },
  intro: {
    zh: "支持原生色板、文本输入、透明度、清空和预设色。",
    en: "Select colors through a native palette, text input, alpha control, clearing, and presets.",
  },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  methods: { zh: "方法", en: "Methods" },
});
const pick = createDocsPicker();

const row = (name: string, type: string, defaultValue: string, zh: string, en: string) => ({
  name,
  type,
  default: defaultValue,
  desc: pick(zh, en),
});

const propsRows = () => [
  row(
    "variant / label",
    "FieldVariant / string",
    "filled / ''",
    "输入表面与浮动标签。",
    "Field surface variant and floating label.",
  ),
  row("modelValue", "string", "#6750a4", "当前颜色。", "Current color value."),
  row("format", "hex | rgb", "hex", "输出格式。", "Output format."),
  row(
    "colorFormat",
    "hex | rgb",
    "''",
    "Element Plus 兼容格式别名，优先于 format。",
    "Element Plus-compatible alias that takes priority over format.",
  ),
  row("presets", "Array", "[]", "预设颜色。", "Preset colors."),
  row(
    "predefine",
    "Array",
    "[]",
    "Element Plus 兼容的预设色别名。",
    "Element Plus-compatible preset alias.",
  ),
  row("showAlpha", "boolean", "false", "启用透明度输出。", "Enable alpha output."),
  row("clearable", "boolean", "false", "显示清空操作。", "Show the clear action."),
  row(
    "size",
    "sm | md | lg",
    "md",
    "字段尺寸，可继承 Form。",
    "Field size, inheriting from Form when omitted.",
  ),
  row(
    "id / name / tabindex / ariaLabel",
    "string | number",
    "-",
    "表单和无障碍属性。",
    "Form and accessibility attributes.",
  ),
  row(
    "valueOnClear",
    "string | Function",
    "''",
    "清空后提交的值。",
    "Value committed after clearing.",
  ),
  row(
    "emptyValues",
    "unknown[]",
    "[undefined, null, '']",
    "判定为空的值集合。",
    "Values treated as empty.",
  ),
  row(
    "validateEvent",
    "boolean",
    "true",
    "是否触发表单校验。",
    "Whether updates trigger form validation.",
  ),
  row(
    "teleported / persistent",
    "boolean",
    "true / false",
    "Top Layer 与外部点击关闭策略。",
    "Top Layer and outside-dismiss policy.",
  ),
  row(
    "popperClass / popperStyle",
    "string / CSSProperties",
    "'' / {}",
    "扩展面板外观。",
    "Extend panel styling.",
  ),
  row(
    "appendTo",
    "string | HTMLElement",
    "null",
    "将面板挂载到指定容器并保留独立 Shadow 样式。",
    "Mount the panel in a target container while preserving isolated Shadow styles.",
  ),
  row(
    "hueSliderClass / hueSliderStyle",
    "string / CSSProperties",
    "'' / {}",
    "定制原生色板入口。",
    "Customize the native color input.",
  ),
  row("border", "boolean", "true", "显示字段边框。", "Show the field border."),
];

const eventsRows = () => [
  row(
    "update:modelValue / input / change",
    "(value) => void",
    "-",
    "颜色值更新。",
    "Color value updated.",
  ),
  row(
    "active-change",
    "(value) => void",
    "-",
    "面板内活动颜色变化。",
    "Active panel color changed.",
  ),
  row("clear", "() => void", "-", "颜色已清空。", "Color cleared."),
  row("focus / blur", "(event) => void", "-", "文本输入焦点变化。", "Text input focus changed."),
  row(
    "visible-change",
    "(visible) => void",
    "-",
    "面板显示状态变化。",
    "Panel visibility changed.",
  ),
];

const methodsRows = () => [
  row("show() / hide()", "Function", "-", "打开或关闭面板。", "Open or close the panel."),
  row(
    "focusInput() / blurInput()",
    "Function",
    "-",
    "控制文本输入焦点。",
    "Control text input focus.",
  ),
  row("update(value)", "Function", "-", "校验并提交颜色。", "Validate and commit a color."),
  row(
    "inputRef",
    "HTMLInputElement | null",
    "-",
    "内部文本输入引用。",
    "Internal text input reference.",
  ),
];

useComponents({
  "page-color-picker-ex1": PageColorPickerEx1,
  "page-color-picker-ex2": PageColorPickerEx2,
  "page-color-picker-ex3": PageColorPickerEx3,
  "page-color-picker-ex4": PageColorPickerEx4,
  "page-color-picker-ex5": PageColorPickerEx5,
});

const PageColorPicker = defineHtml(`
  <elf-container>
    <elf-docs-hero category="picker" tag="ColorPicker" :title=${t("title")} :description=${t("intro")}></elf-docs-hero>
    <page-color-picker-ex1 />
    <page-color-picker-ex2 />
    <page-color-picker-ex3 />
    <page-color-picker-ex4 />
    <page-color-picker-ex5 />
    <h2>API</h2>
    <elf-props-table :title=${t("props")} :rows=${propsRows()}></elf-props-table>
    <elf-props-table :title=${t("events")} :rows=${eventsRows()}></elf-props-table>
    <elf-props-table :title=${t("methods")} :rows=${methodsRows()}></elf-props-table>
  </elf-container>
`);

export { PageColorPicker };
