import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "modelValue", type: "string | number", desc: "v-model 绑定值" },
  { name: "model-modifiers", type: "{ trim?: boolean; number?: boolean; lazy?: boolean }" },
  { name: "type", type: "text | password | email | tel | url | search | number", default: "text" },
  { name: "size", type: "small | default | large | sm | md | lg", default: "md" },
  { name: "density", type: "default | comfortable | compact", default: "default", desc: "Material 字段密度；非默认 density 覆盖兼容 size 高度" },
  { name: "variant", type: "default | filled | outlined | underlined | solo | solo-filled | solo-inverted", default: "filled", desc: "字段表面样式；filled 是 default 的兼容别名" },
  { name: "placeholder", type: "string" },
  { name: "disabled", type: "boolean" },
  { name: "readonly", type: "boolean" },
  { name: "clearable", type: "boolean", desc: "可清空" },
  { name: "clear-icon", type: "string", default: "''", desc: "自定义清空图标文本；默认使用线性 SVG 图标" },
  { name: "show-password", type: "boolean", desc: "密码可见切换" },
  { name: "formatter", type: "(value: string) => string", desc: "展示值格式化" },
  { name: "parser", type: "(value: string) => string", desc: "输入值反解析" },
  { name: "maxlength", type: "number" },
  { name: "minlength", type: "number" },
  { name: "show-word-limit", type: "boolean" },
  { name: "word-limit-position", type: "inside | outside", default: "inside" },
  { name: "count-graphemes", type: "(value: string) => number" },
  { name: "prefix-icon", type: "string" },
  { name: "suffix-icon", type: "string" },
  { name: "prepend-icon", type: "string", desc: "输入框外部前置图标" },
  { name: "append-icon", type: "string", desc: "输入框外部后置图标" },
  { name: "autocomplete", type: "string", default: "off" },
  { name: "min / max / step", type: "string | number", desc: "透传给原生 input" },
  { name: "autofocus", type: "boolean" },
  { name: "form", type: "string" },
  { name: "aria-label", type: "string" },
  { name: "tabindex", type: "string | number" },
  { name: "validate-event", type: "boolean", default: "true" },
  { name: "input-style", type: "string | object" },
  { name: "background-color", type: "string", default: "''", desc: "自定义字段背景色，悬浮与聚焦时保持一致" },
  { name: "label", type: "string", desc: "浮动标签，同时作为无 aria-label 时的可访问名称兜底" },
  { name: "inputmode", type: "string" },
  { name: "id / name", type: "string" }
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
    type: "(event: CompositionEvent) => void"
  }
];

const slotsRows = [
  { name: "prefix", desc: "输入框前置内容" },
  { name: "suffix", desc: "输入框后置内容" },
  { name: "prepend", desc: "组合输入框前置块" },
  { name: "append", desc: "组合输入框后置块" },
  { name: "password-icon", desc: "自定义密码可见性切换内容" }
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
    desc: "兼容 Element Plus 暴露项；多行输入请使用 Textarea 组件"
  }
];

const PageInputProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows} />
  <elf-props-table title="Events" :rows=${eventsRows} />
  <elf-props-table title="Slots" :rows=${slotsRows} />
  <elf-props-table title="Exposes" :rows=${exposesRows} />
`);

export { PageInputProps };
