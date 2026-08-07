import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();
const propsRows = [
  { name: "modelValue", type: "string | number", desc: pick("v-model 绑定值", "v-model value") },
  {
    name: "model-modifiers",
    type: "{ trim?: boolean; number?: boolean; lazy?: boolean }",
    desc: pick("v-model 修饰符", "v-model modifiers."),
  },
  {
    name: "type",
    type: "text | password | email | tel | url | search | number",
    default: "text",
    desc: pick("类型", "Type."),
  },
  {
    name: "size",
    type: "small | default | large | sm | md | lg",
    default: "md",
    desc: pick("组件尺寸", "Component size."),
  },
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
  { name: "placeholder", type: "string", desc: pick("占位提示文本", "Placeholder text.") },
  {
    name: "disabled",
    type: "boolean",
    desc: pick("禁用组件交互", "Disable component interaction."),
  },
  {
    name: "readonly",
    type: "boolean",
    desc: pick("只读，禁止编辑", "Read-only; disables editing."),
  },
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
  { name: "maxlength", type: "number", desc: pick("最大输入长度", "Maximum input length.") },
  { name: "minlength", type: "number", desc: pick("最小输入长度", "Minimum input length.") },
  {
    name: "show-word-limit",
    type: "boolean",
    desc: pick("显示字数统计", "Show the word counter."),
  },
  {
    name: "word-limit-position",
    type: "inside | outside",
    default: "inside",
    desc: pick("字数统计位置", "Word-counter position."),
  },
  {
    name: "count-graphemes",
    type: "(value: string) => number",
    desc: pick("按字形簇统计长度", "Count length by grapheme clusters."),
  },
  { name: "prefix-icon", type: "string", desc: pick("前缀图标", "Prefix icon.") },
  { name: "suffix-icon", type: "string", desc: pick("后缀图标", "Suffix icon.") },
  { name: "prepend-icon", type: "string", desc: pick("输入框外部前置图标", "Outer prepend icon") },
  { name: "append-icon", type: "string", desc: pick("输入框外部后置图标", "Outer append icon") },
  {
    name: "autocomplete",
    type: "string",
    default: "off",
    desc: pick("原生自动补全提示", "Native autocomplete hint."),
  },
  {
    name: "min",
    type: "string | number",
    desc: pick("透传给原生 input", "Forwarded to the native input"),
  },
  {
    name: "max",
    type: "string | number",
    desc: pick("透传给原生 input", "Forwarded to the native input"),
  },
  {
    name: "step",
    type: "string | number",
    desc: pick("透传给原生 input", "Forwarded to the native input"),
  },
  { name: "autofocus", type: "boolean", desc: pick("自动聚焦", "Focus automatically.") },
  { name: "form", type: "string", desc: pick("关联的原生表单", "Associated native form.") },
  { name: "aria-label", type: "string", desc: pick("无障碍标签", "Accessible label.") },
  { name: "tabindex", type: "string | number", desc: pick("Tab 键顺序", "Tab order.") },
  {
    name: "validate-event",
    type: "boolean",
    default: "true",
    desc: pick("值变化时触发表单校验", "Trigger form validation on value changes."),
  },
  {
    name: "input-style",
    type: "string | object",
    desc: pick("输入框内联样式", "Inline styles for the input."),
  },
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
  {
    name: "inputmode",
    type: "string",
    desc: pick("原生 inputmode 属性", "Native inputmode attribute."),
  },
  { name: "id", type: "string", desc: pick("原生 id 属性", "Native id attribute.") },
  { name: "name", type: "string", desc: pick("原生 name 属性", "Native name attribute.") },
];

const eventsRows = [
  {
    name: "update:modelValue",
    type: "(value: string | number) => void",
    desc: pick("请求新的受控值", "Request a new controlled value."),
  },
  {
    name: "input",
    type: "(value: string | number) => void",
    desc: pick("输入内容变化时触发", "Emitted when the input content changes."),
  },
  {
    name: "change",
    type: "(value: string | number) => void",
    desc: pick("值提交变化时触发", "Emitted when the value is committed."),
  },
  {
    name: "focus",
    type: "(event: FocusEvent) => void",
    desc: pick("输入框聚焦时触发", "Emitted when the input gains focus."),
  },
  {
    name: "blur",
    type: "(event: FocusEvent) => void",
    desc: pick("输入框失焦时触发", "Emitted when the input loses focus."),
  },
  {
    name: "clear",
    type: "() => void",
    desc: pick("点击清除按钮时触发", "Emitted when the clear button is clicked."),
  },
  {
    name: "keydown",
    type: "(event: KeyboardEvent) => void",
    desc: pick("键盘按下时触发", "Emitted on keydown."),
  },
  {
    name: "mouseenter",
    type: "(event: MouseEvent) => void",
    desc: pick("鼠标进入输入框时触发", "Emitted when the pointer enters the input."),
  },
  {
    name: "mouseleave",
    type: "(event: MouseEvent) => void",
    desc: pick("鼠标离开输入框时触发", "Emitted when the pointer leaves the input."),
  },
  {
    name: "compositionstart",
    type: "(event: CompositionEvent) => void",
    desc: pick("组合输入开始时触发", "Emitted when composition input starts."),
  },
  {
    name: "compositionupdate",
    type: "(event: CompositionEvent) => void",
    desc: pick("组合输入更新时触发", "Emitted when composition input updates."),
  },
  {
    name: "compositionend",
    type: "(event: CompositionEvent) => void",
    desc: pick("组合输入结束时触发", "Emitted when composition input ends."),
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
  { name: "focus", type: "() => void", desc: pick("聚焦输入框", "Focus the input.") },
  { name: "blur", type: "() => void", desc: pick("使输入框失焦", "Blur the input.") },
  { name: "select", type: "() => void", desc: pick("选中输入框文本", "Select the input text.") },
  { name: "clear", type: "() => void", desc: pick("清空输入值", "Clear the input value.") },
  {
    name: "input",
    type: "() => HTMLInputElement | null",
    desc: pick("获取原生输入框元素", "Get the native input element."),
  },
  {
    name: "ref",
    type: "() => HTMLInputElement | null",
    desc: pick("获取内部输入框引用", "Get the internal input reference."),
  },
  {
    name: "isComposing",
    type: "Ref<boolean>",
    desc: pick("当前是否处于组合输入状态", "Whether composition input is active."),
  },
  {
    name: "passwordVisible",
    type: "Ref<boolean>",
    desc: pick("密码可见状态", "Password visibility state."),
  },
  {
    name: "resizeTextarea",
    desc: pick(
      "兼容 Element Plus 暴露项；多行输入请使用 Textarea 组件",
      "Element Plus compatibility expose; use Textarea for multiline input",
    ),
  },
  {
    name: "textarea",
    desc: pick(
      "兼容 Element Plus 暴露项；多行输入请使用 Textarea 组件",
      "Element Plus compatibility expose; use Textarea for multiline input",
    ),
  },
  {
    name: "textareaStyle",
    desc: pick(
      "兼容 Element Plus 暴露项；多行输入请使用 Textarea 组件",
      "Element Plus compatibility expose; use Textarea for multiline input",
    ),
  },
];

const PageInputProps = defineHtml(`
  <elf-api-builder component="elf-input" title="API">
  <elf-props-table role="props" title="Props" :rows=${propsRows} />
  <elf-props-table role="events" title="Events" :rows=${eventsRows} />
  <elf-props-table role="slots" title="Slots" :rows=${slotsRows} />
  <elf-props-table role="methods" title="Expose" :rows=${exposesRows} />
  </elf-api-builder>
`);

export { PageInputProps };
