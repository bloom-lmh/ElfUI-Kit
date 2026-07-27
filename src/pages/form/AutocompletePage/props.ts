import { defineHtml } from "@elfui/core";

const rows = [
  { name: "variant / label", type: "FieldVariant / string", default: "filled / ''", desc: "六种统一字段表面与浮动标签" },
  { name: "background-color", type: "string", default: "''", desc: "自定义字段表面背景" },
  { name: "model-value / options", type: "string / AutocompleteOption[]", default: "'' / []" },
  { name: "fetch-suggestions / debounce", type: "(query, callback) => void | Promise<option[]> / number", default: "undefined / 300" },
  { name: "trigger-on-focus / highlight-first-item", type: "boolean", default: "true / false" },
  { name: "allow-create / create-text", type: "boolean / string", default: "false / 'Create'", desc: "输入不存在时提供创建项" },
  { name: "virtual / item-height / max-height / overscan", type: "boolean / number", default: "false / 40 / 280 / 3", desc: "固定高度长列表虚拟滚动" },
  { name: "loading / loading-text", type: "boolean / string", default: "false / 'Loading...'" },
  { name: "no-data-text / error-text", type: "string", default: "No suggestions / Unable to load suggestions", desc: "远程空态与错误态文案" },
  { name: "placement", type: "top | top-start | top-end | bottom | bottom-start | bottom-end", default: "bottom-start" },
  { name: "teleported / append-to", type: "boolean / CSS selector | HTMLElement", default: "true / body" },
  { name: "popper-options / popper-class / popper-style", type: "object / string / object", default: "{} / '' / {}" },
  { name: "fit-input-width", type: "boolean", default: "false" },
  { name: "clearable / disabled / validate-event", type: "boolean", default: "false / false / true" }
];

const PageAutocompleteProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="属性" :rows=${rows} />
  <elf-props-table title="事件" :rows=${[
    { name: "update:modelValue / input / change", type: "(value: string) => void" },
    { name: "select", type: "(option: AutocompleteOption) => void" },
    { name: "create", type: "(option: AutocompleteOption) => void", desc: "选择创建项时触发" },
    { name: "focus / blur / clear", type: "FocusEvent / void" },
    { name: "fetch-error", type: "(error: unknown) => void", desc: "远程建议请求失败" }
  ]} />
  <elf-props-table title="插槽" :rows=${[
    { name: "default", desc: "custom suggestion content; receives item" },
    { name: "loading", desc: "远程加载内容" },
    { name: "empty", desc: "远程或本地无匹配结果" },
    { name: "error", desc: "远程请求失败内容，接收 error" }
  ]} />
  <elf-props-table title="方法" :rows=${[
    { name: "focus / blur", desc: "聚焦或失焦原生输入框" },
    { name: "close", desc: "关闭建议面板" }
  ]} />
`);

export { PageAutocompleteProps };
