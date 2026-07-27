import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "background-color", type: "string", default: "''", desc: "自定义字段表面背景" },
  { name: "variant", type: "default | filled | outlined | underlined | solo | solo-filled | solo-inverted", default: "filled", desc: "统一字段表面样式" },
  { name: "modelValue", type: "string" },
  { name: "model-modifiers", type: "{ trim?: boolean; lazy?: boolean }" },
  { name: "size", type: "small | default | large | sm | md | lg" },
  { name: "rows", type: "number", default: "3" },
  { name: "placeholder", type: "string" },
  { name: "disabled", type: "boolean" },
  { name: "readonly", type: "boolean" },
  { name: "maxlength", type: "number" },
  { name: "minlength", type: "number" },
  { name: "show-count", type: "boolean", desc: "配合 maxlength 显示 cur/max" },
  { name: "show-word-limit", type: "boolean", desc: "show-count 的 Element Plus 兼容名称" },
  { name: "word-limit-position", type: "inside | outside", default: "inside" },
  { name: "clearable / clear-icon", type: "boolean / string" },
  { name: "formatter / parser", type: "(value: string) => string" },
  { name: "prefix-icon / suffix-icon", type: "string" },
  { name: "autosize", type: "boolean|{minRows,maxRows}", desc: "自动调整高度" },
  { name: "resize", type: "none|both|horizontal|vertical", default: "vertical" },
  { name: "autocomplete / autofocus / form", type: "string / boolean / string" },
  { name: "aria-label / label", type: "string" },
  { name: "tabindex", type: "string | number" },
  { name: "validate-event", type: "boolean", default: "true" },
  { name: "input-style", type: "string | object" },
  { name: "inputmode / id / name", type: "string" },
  { name: "count-graphemes", type: "(value: string) => number" }
];

const eventsRows = [
  { name: "input", type: "(v: string) => void" },
  { name: "change", type: "(v: string) => void" },
  { name: "focus", type: "(e) => void" },
  { name: "blur", type: "(e) => void" },
  { name: "clear", type: "() => void" },
  { name: "keydown", type: "(e: KeyboardEvent) => void" },
  { name: "mouseenter / mouseleave", type: "(e: MouseEvent) => void" },
  {
    name: "compositionstart / compositionupdate / compositionend",
    type: "(e: CompositionEvent) => void"
  }
];

const slotsRows = [
  { name: "prefix / suffix", desc: "文本域顶部的辅助内容" },
  { name: "prepend / append", desc: "组合文本域两侧内容" }
];

const exposesRows = [
  { name: "focus / blur / select / clear", type: "() => void" },
  { name: "input / ref / textarea", type: "() => HTMLTextAreaElement | null" },
  { name: "resizeTextarea", type: "() => void" },
  { name: "textareaStyle", type: "() => CSSStyleDeclaration | null" },
  { name: "isComposing", type: "Ref<boolean>" }
];

const PageTextareaProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="属性" :rows=${propsRows} />
  <elf-props-table title="事件" :rows=${eventsRows} />
  <elf-props-table title="插槽" :rows=${slotsRows} />
  <elf-props-table title="暴露方法" :rows=${exposesRows} />
`);

export { PageTextareaProps };
