import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();
const propsRows = [
  { name: "modelValue", type: "string | number", desc: pick("v-model 绑定值", "v-model value") },
  { name: "model-modifiers", type: "{ trim?: boolean; number?: boolean; lazy?: boolean }" },
  { name: "type", type: "text | password | email | tel | url | search | number", default: "text" },
  { name: "size", type: "small | default | large | sm | md | lg", default: "md" },
  {
    name: "density",
    type: "default | comfortable | compact",
    default: "default",
    desc: pick(
      "Material 字段密度；非默认 density 覆盖兼容 size 高度",
      "Material field density; non-default density overrides compatibility size height",
    ),
  },
  {
    name: "variant",
    type: "default | filled | outlined | underlined | solo | solo-filled | solo-inverted",
    default: "filled",
    desc: pick(
      "字段表面样式；filled 是 default 的兼容别名",
      "Field surface; filled is a compatibility alias for default",
    ),
  },
  { name: "placeholder", type: "string" },
  { name: "disabled", type: "boolean" },
  { name: "readonly", type: "boolean" },
  { name: "clearable", type: "boolean", desc: pick("可清空", "Clearable") },
  {
    name: "clear-icon",
    type: "string",
    default: "''",
    desc: pick(
      "自定义清空图标文本；默认使用线性 SVG 图标",
      "Custom clear icon text; defaults to a line SVG icon",
    ),
  },
  {
    name: "show-password",
    type: "boolean",
    desc: pick("密码可见切换", "Password visibility toggle"),
  },
  {
    name: "formatter",
    type: "(value: string) => string",
    desc: pick("展示值格式化", "Display value formatter"),
  },
  {
    name: "parser",
    type: "(value: string) => string",
    desc: pick("输入值反解析", "Input value parser"),
  },
  { name: "maxlength", type: "number" },
  { name: "minlength", type: "number" },
  { name: "show-word-limit", type: "boolean" },
  { name: "word-limit-position", type: "inside | outside", default: "inside" },
  { name: "count-graphemes", type: "(value: string) => number" },
  { name: "prefix-icon", type: "string" },
  { name: "suffix-icon", type: "string" },
  { name: "prepend-icon", type: "string", desc: pick("输入框外部前置图标", "Outer prepend icon") },
  { name: "append-icon", type: "string", desc: pick("输入框外部后置图标", "Outer append icon") },
  { name: "autocomplete", type: "string", default: "off" },
  {
    name: "min / max / step",
    type: "string | number",
    desc: pick("透传给原生 input", "Forwarded to the native input"),
  },
  { name: "autofocus", type: "boolean" },
  { name: "form", type: "string" },
  { name: "aria-label", type: "string" },
  { name: "tabindex", type: "string | number" },
  { name: "validate-event", type: "boolean", default: "true" },
  { name: "input-style", type: "string | object" },
  {
    name: "background-color",
    type: "string",
    default: "''",
    desc: pick(
      "自定义字段背景色，悬浮与聚焦时保持一致",
      "Custom field background preserved on hover and focus",
    ),
  },
  {
    name: "label",
    type: "string",
    desc: pick(
      "浮动标签，同时作为无 aria-label 时的可访问名称兜底",
      "Floating label and accessible-name fallback without aria-label",
    ),
  },
  { name: "inputmode", type: "string" },
  { name: "id / name", type: "string" },
];

const eventsRows = [
  { name: "update:modelValue", type: "(value: string | number) => void" },
  { name: "input", type: "(value: string | number) => void" },
  { name: "change", type: "(value: string | number) => void" },
  { name: "focus", type: "(event: FocusEvent) => void" },
  { name: "blur", type: "(event: FocusEvent) => void" },
  { name: "clear", type: "() => void" },
  { name: "keydown", type: "(event: KeyboardEvent) => void" },
  { name: "mouseenter / mouseleave", type: "(event: MouseEvent) => void" },
  {
    name: "compositionstart / compositionupdate / compositionend",
    type: "(event: CompositionEvent) => void",
  },
];

const slotsRows = [
  { name: "prefix", desc: pick("输入框前置内容", "Inner prefix content") },
  { name: "suffix", desc: pick("输入框后置内容", "Inner suffix content") },
  { name: "prepend", desc: pick("组合输入框前置块", "Outer prepend block") },
  { name: "append", desc: pick("组合输入框后置块", "Outer append block") },
  {
    name: "password-icon",
    desc: pick("自定义密码可见性切换内容", "Custom password visibility content"),
  },
];

const exposesRows = [
  { name: "focus", type: "() => void" },
  { name: "blur", type: "() => void" },
  { name: "select", type: "() => void" },
  { name: "clear", type: "() => void" },
  { name: "input / ref", type: "() => HTMLInputElement | null" },
  { name: "isComposing", type: "Ref<boolean>" },
  { name: "passwordVisible", type: "Ref<boolean>" },
  {
    name: "resizeTextarea / textarea / textareaStyle",
    desc: pick(
      "兼容 Element Plus 暴露项；多行输入请使用 Textarea 组件",
      "Element Plus compatibility expose; use Textarea for multiline input",
    ),
  },
];

const PageInputProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows} />
  <elf-props-table title="Events" :rows=${eventsRows} />
  <elf-props-table title="Slots" :rows=${slotsRows} />
  <elf-props-table title="Expose" :rows=${exposesRows} />
`);

export { PageInputProps };
