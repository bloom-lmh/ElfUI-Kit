import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();
const rows = [
  {
    name: "variant",
    type: "FieldVariant",
    default: "filled",
    desc: pick("六种统一字段表面与浮动标签", "Six unified field surfaces and a floating label"),
  },
  {
    name: "label",
    type: "string",
    default: "''",
    desc: pick("六种统一字段表面与浮动标签", "Six unified field surfaces and a floating label"),
  },
  {
    name: "background-color",
    type: "string",
    default: "''",
    desc: pick("自定义字段表面背景", "Custom field surface background"),
  },
  {
    name: "model-value",
    type: "string",
    default: "''",
    desc: pick("受控值；通过 v-model 双向绑定", "Controlled value; bind with v-model."),
  },
  {
    name: "options",
    type: "AutocompleteOption[]",
    default: "[]",
    desc: pick("选项数据列表", "The option data list."),
  },
  {
    name: "fetch-suggestions",
    type: "(query, callback) => void | Promise<option[]>",
    default: "undefined",
    desc: pick(
      "远程建议请求函数，接收查询词与回调",
      "Remote suggestion request function; receives the query and a callback.",
    ),
  },
  {
    name: "debounce",
    type: "number",
    default: "300",
    desc: pick("防抖延迟毫秒数", "Debounce delay in milliseconds."),
  },
  {
    name: "trigger-on-focus",
    type: "boolean",
    default: "true",
    desc: pick("聚焦时触发建议", "Open suggestions on focus."),
  },
  {
    name: "highlight-first-item",
    type: "boolean",
    default: "false",
    desc: pick("默认高亮第一项", "Highlight the first item by default."),
  },
  {
    name: "allow-create",
    type: "boolean",
    default: "false",
    desc: pick("输入不存在时提供创建项", "Offer a create option for unmatched input"),
  },
  {
    name: "create-text",
    type: "string",
    default: "'Create'",
    desc: pick("输入不存在时提供创建项", "Offer a create option for unmatched input"),
  },
  {
    name: "virtual",
    type: "boolean / number",
    default: "false",
    desc: pick("固定高度长列表虚拟滚动", "Virtualize fixed-height long lists"),
  },
  {
    name: "item-height",
    type: "boolean / number",
    default: "40",
    desc: pick("固定高度长列表虚拟滚动", "Virtualize fixed-height long lists"),
  },
  {
    name: "max-height",
    type: "boolean / number",
    default: "280",
    desc: pick("固定高度长列表虚拟滚动", "Virtualize fixed-height long lists"),
  },
  {
    name: "overscan",
    type: "boolean / number",
    default: "3",
    desc: pick("固定高度长列表虚拟滚动", "Virtualize fixed-height long lists"),
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    desc: pick("显示加载状态", "Show a loading state."),
  },
  {
    name: "loading-text",
    type: "string",
    default: "'Loading...'",
    desc: pick("加载中提示文本", "Loading text."),
  },
  {
    name: "no-data-text",
    type: "string",
    default: "No suggestions",
    desc: pick("远程空态与错误态文案", "Remote empty and error messages"),
  },
  {
    name: "error-text",
    type: "string",
    default: "Unable to load suggestions",
    desc: pick("远程空态与错误态文案", "Remote empty and error messages"),
  },
  {
    name: "placement",
    type: "top | top-start | top-end | bottom | bottom-start | bottom-end",
    default: "bottom-start",
  },
  {
    name: "teleported",
    type: "boolean",
    default: "true",
    desc: pick("弹层渲染到 body", "Render the overlay in the body."),
  },
  {
    name: "append-to",
    type: "CSS selector | HTMLElement",
    default: "body",
    desc: pick("弹层挂载目标", "Overlay mount target."),
  },
  {
    name: "popper-options",
    type: "object",
    default: "{}",
    desc: pick("Popper 配置项", "Popper options."),
  },
  {
    name: "popper-class",
    type: "string",
    default: "''",
    desc: pick("弹层自定义类名", "Custom class for the overlay."),
  },
  {
    name: "popper-style",
    type: "object",
    default: "{}",
    desc: pick("弹层内联样式", "Inline styles for the overlay."),
  },
  { name: "fit-input-width", type: "boolean", default: "false" },
  {
    name: "clearable",
    type: "boolean",
    default: "false",
    desc: pick("显示清除按钮", "Show a clear button."),
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: pick("禁用组件交互", "Disable component interaction."),
  },
  {
    name: "validate-event",
    type: "boolean",
    default: "true",
    desc: pick("值变化时触发表单校验", "Trigger form validation on value changes."),
  },
];

const PageAutocompleteProps = defineHtml(`
  <elf-api-builder component="elf-autocomplete" title="API">
  <elf-props-table role="props" title="Props" :rows=${rows} />
  <elf-props-table role="events" title="Events" :rows=${[
    {
      name: "update:modelValue",
      type: "(value: string) => void",
      desc: pick("请求新的受控值", "Request a new controlled value."),
    },
    {
      name: "input",
      type: "(value: string) => void",
      desc: pick("输入内容变化时触发", "Emitted when the input content changes."),
    },
    {
      name: "change",
      type: "(value: string) => void",
      desc: pick("选中值变化时触发", "Emitted when the selected value changes."),
    },
    {
      name: "select",
      type: "(option: AutocompleteOption) => void",
      desc: pick(
        "选中建议项时触发，携带该项",
        "Emitted when a suggestion is selected, carrying the item.",
      ),
    },
    {
      name: "create",
      type: "(option: AutocompleteOption) => void",
      desc: pick("选择创建项时触发", "Emitted when the create option is selected"),
    },
    {
      name: "focus",
      type: "FocusEvent / void",
      desc: pick("输入框聚焦时触发", "Emitted when the input gains focus."),
    },
    {
      name: "blur",
      type: "FocusEvent / void",
      desc: pick("输入框失焦时触发", "Emitted when the input loses focus."),
    },
    {
      name: "clear",
      type: "FocusEvent / void",
      desc: pick("点击清除按钮时触发", "Emitted when the clear button is clicked."),
    },
    {
      name: "fetch-error",
      type: "(error: unknown) => void",
      desc: pick("远程建议请求失败", "Remote suggestion request failed"),
    },
  ]} />
  <elf-props-table role="slots" title="Slots" :rows=${[
    {
      name: "default",
      desc: pick("自定义建议内容，接收 item", "Custom suggestion content; receives item"),
    },
    { name: "loading", desc: pick("远程加载内容", "Remote loading content") },
    { name: "empty", desc: pick("远程或本地无匹配结果", "Remote or local empty results") },
    {
      name: "error",
      desc: pick("远程请求失败内容，接收 error", "Remote request failure content; receives error"),
    },
  ]} />
  <elf-props-table role="methods" title="Expose" :rows=${[
    { name: "focus", desc: pick("聚焦或失焦原生输入框", "Focus or blur the native input") },
    { name: "blur", desc: pick("聚焦或失焦原生输入框", "Focus or blur the native input") },
    { name: "close", desc: pick("关闭建议面板", "Close the suggestion panel") },
  ]} />
  </elf-api-builder>
`);

export { PageAutocompleteProps };
