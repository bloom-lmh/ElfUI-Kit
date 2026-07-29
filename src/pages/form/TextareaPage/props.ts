import { defineHtml } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  slots: { zh: "插槽", en: "Slots" },
  expose: { zh: "暴露方法", en: "Expose" }
});
const pick = createDocsPicker();

const propsRows = [
  { name: "background-color", type: "string", default: "''", desc: pick("自定义字段表面背景", "Custom field-surface background.") },
  { name: "variant", type: "default | filled | outlined | underlined | solo | solo-filled | solo-inverted", default: "filled", desc: pick("统一字段表面样式", "Shared field-surface variant.") },
  { name: "modelValue", type: "string", desc: pick("文本模型值", "Text model value.") },
  { name: "model-modifiers", type: "{ trim?: boolean; lazy?: boolean }", desc: pick("模型修饰符", "Model modifiers.") },
  { name: "size", type: "small | default | large | sm | md | lg", desc: pick("字段尺寸", "Field size.") },
  { name: "rows", type: "number", default: "3", desc: pick("默认可见行数", "Default visible row count.") },
  { name: "placeholder", type: "string", desc: pick("占位提示", "Placeholder text.") },
  { name: "disabled", type: "boolean", desc: pick("禁用输入", "Disables input.") },
  { name: "readonly", type: "boolean", desc: pick("只读状态", "Makes the field read-only.") },
  { name: "maxlength", type: "number", desc: pick("最大字符数", "Maximum character count.") },
  { name: "minlength", type: "number", desc: pick("最小字符数", "Minimum character count.") },
  { name: "show-count", type: "boolean", desc: pick("配合 maxlength 显示当前值/上限", "Shows current/maximum count with maxlength.") },
  { name: "show-word-limit", type: "boolean", desc: pick("show-count 的 Element Plus 兼容名称", "Element Plus-compatible alias for show-count.") },
  { name: "word-limit-position", type: "inside | outside", default: "inside", desc: pick("字符计数位置", "Character-count placement.") },
  { name: "clearable / clear-icon", type: "boolean / string", desc: pick("显示清空操作并配置图标", "Shows the clear action and configures its icon.") },
  { name: "formatter / parser", type: "(value: string) => string", desc: pick("显示格式化与输入解析函数", "Display formatter and input parser.") },
  { name: "prefix-icon / suffix-icon", type: "string", desc: pick("前缀与后缀图标", "Prefix and suffix icons.") },
  { name: "autosize", type: "boolean|{minRows,maxRows}", desc: pick("自动调整高度", "Automatically adjusts height.") },
  { name: "resize", type: "none|both|horizontal|vertical", default: "vertical", desc: pick("浏览器手动缩放方向", "Browser manual-resize direction.") },
  { name: "autocomplete / autofocus / form", type: "string / boolean / string", desc: pick("原生文本域属性", "Native textarea attributes.") },
  { name: "aria-label / label", type: "string", desc: pick("无障碍标签", "Accessible label.") },
  { name: "tabindex", type: "string | number", desc: pick("键盘导航顺序", "Keyboard navigation order.") },
  { name: "validate-event", type: "boolean", default: "true", desc: pick("输入时是否触发表单校验", "Whether input triggers form validation.") },
  { name: "input-style", type: "string | object", desc: pick("原生文本域内联样式", "Inline styles for the native textarea.") },
  { name: "inputmode / id / name", type: "string", desc: pick("原生输入模式与表单标识", "Native input mode and form identifiers.") },
  { name: "count-graphemes", type: "(value: string) => number", desc: pick("自定义字素计数函数", "Custom grapheme-count function.") }
];

const eventsRows = [
  { name: "input", type: "(v: string) => void", desc: pick("输入时触发", "Emitted on input.") },
  { name: "change", type: "(v: string) => void", desc: pick("提交变更时触发", "Emitted when a change is committed.") },
  { name: "focus", type: "(e) => void", desc: pick("获得焦点时触发", "Emitted on focus.") },
  { name: "blur", type: "(e) => void", desc: pick("失去焦点时触发", "Emitted on blur.") },
  { name: "clear", type: "() => void", desc: pick("清空时触发", "Emitted when cleared.") },
  { name: "keydown", type: "(e: KeyboardEvent) => void", desc: pick("按键按下时触发", "Emitted on keydown.") },
  { name: "mouseenter / mouseleave", type: "(e: MouseEvent) => void", desc: pick("指针进入或离开时触发", "Emitted when the pointer enters or leaves.") },
  {
    name: "compositionstart / compositionupdate / compositionend",
    type: "(e: CompositionEvent) => void",
    desc: pick("输入法组合状态变化时触发", "Emitted when IME composition state changes.")
  }
];

const slotsRows = [
  { name: "prefix / suffix", desc: pick("文本域顶部的辅助内容", "Supporting content above the textarea.") },
  { name: "prepend / append", desc: pick("组合文本域两侧内容", "Content attached to either side of the compound field.") }
];

const exposesRows = [
  { name: "focus / blur / select / clear", type: "() => void", desc: pick("控制焦点、选择与清空", "Controls focus, selection, and clearing.") },
  { name: "input / ref / textarea", type: "() => HTMLTextAreaElement | null", desc: pick("访问原生文本域", "Returns the native textarea.") },
  { name: "resizeTextarea", type: "() => void", desc: pick("重新计算自动高度", "Recalculates autosize height.") },
  { name: "textareaStyle", type: "() => CSSStyleDeclaration | null", desc: pick("读取文本域计算样式", "Returns the textarea's computed style.") },
  { name: "isComposing", type: "Ref<boolean>", desc: pick("当前输入法组合状态", "Current IME composition state.") }
];

const PageTextareaProps = defineHtml(`
  <h2>${t("api")}</h2>
  <elf-props-table :title=${t("props")} :rows=${propsRows} />
  <elf-props-table :title=${t("events")} :rows=${eventsRows} />
  <elf-props-table :title=${t("slots")} :rows=${slotsRows} />
  <elf-props-table :title=${t("expose")} :rows=${exposesRows} />
`);

export { PageTextareaProps };
