import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();
const rows = [
  {
    name: "variant / label",
    type: "FieldVariant / string",
    default: "filled / ''",
    desc: pick("六种统一字段表面与浮动标签", "Six unified field surfaces and a floating label"),
  },
  {
    name: "background-color",
    type: "string",
    default: "''",
    desc: pick("自定义字段表面背景", "Custom field surface background"),
  },
  { name: "model-value / options", type: "string / AutocompleteOption[]", default: "'' / []" },
  {
    name: "fetch-suggestions / debounce",
    type: "(query, callback) => void | Promise<option[]> / number",
    default: "undefined / 300",
  },
  { name: "trigger-on-focus / highlight-first-item", type: "boolean", default: "true / false" },
  {
    name: "allow-create / create-text",
    type: "boolean / string",
    default: "false / 'Create'",
    desc: pick("输入不存在时提供创建项", "Offer a create option for unmatched input"),
  },
  {
    name: "virtual / item-height / max-height / overscan",
    type: "boolean / number",
    default: "false / 40 / 280 / 3",
    desc: pick("固定高度长列表虚拟滚动", "Virtualize fixed-height long lists"),
  },
  { name: "loading / loading-text", type: "boolean / string", default: "false / 'Loading...'" },
  {
    name: "no-data-text / error-text",
    type: "string",
    default: "No suggestions / Unable to load suggestions",
    desc: pick("远程空态与错误态文案", "Remote empty and error messages"),
  },
  {
    name: "placement",
    type: "top | top-start | top-end | bottom | bottom-start | bottom-end",
    default: "bottom-start",
  },
  {
    name: "teleported / append-to",
    type: "boolean / CSS selector | HTMLElement",
    default: "true / body",
  },
  {
    name: "popper-options / popper-class / popper-style",
    type: "object / string / object",
    default: "{} / '' / {}",
  },
  { name: "fit-input-width", type: "boolean", default: "false" },
  {
    name: "clearable / disabled / validate-event",
    type: "boolean",
    default: "false / false / true",
  },
];

const PageAutocompleteProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${rows} />
  <elf-props-table title="Events" :rows=${[
    { name: "update:modelValue / input / change", type: "(value: string) => void" },
    { name: "select", type: "(option: AutocompleteOption) => void" },
    {
      name: "create",
      type: "(option: AutocompleteOption) => void",
      desc: pick("选择创建项时触发", "Emitted when the create option is selected"),
    },
    { name: "focus / blur / clear", type: "FocusEvent / void" },
    {
      name: "fetch-error",
      type: "(error: unknown) => void",
      desc: pick("远程建议请求失败", "Remote suggestion request failed"),
    },
  ]} />
  <elf-props-table title="Slots" :rows=${[
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
  <elf-props-table title="Expose" :rows=${[
    { name: "focus / blur", desc: pick("聚焦或失焦原生输入框", "Focus or blur the native input") },
    { name: "close", desc: pick("关闭建议面板", "Close the suggestion panel") },
  ]} />
`);

export { PageAutocompleteProps };
