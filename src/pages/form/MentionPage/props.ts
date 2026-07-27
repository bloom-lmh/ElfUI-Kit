import { defineHtml } from "@elfui/core";

const rows = [
  { name: "model-value / options", type: "string / MentionOption[]", default: "'' / []" },
  { name: "prefix / prefixes", type: "string | string[] / string[]", default: "'@' / []" },
  { name: "variant / label", type: "FieldVariant / string", default: "filled / ''", desc: "六种统一字段表面与浮动标签" },
  { name: "background-color", type: "string", default: "''", desc: "自定义字段表面背景" },
  { name: "split / whole / check-is-whole", type: "string / boolean / function", default: "' ' / false / undefined" },
  { name: "filter-option", type: "(pattern, option) => boolean", default: "undefined" },
  { name: "loading / loading-text / placement", type: "boolean / string / top | bottom", default: "false / 'Loading...' / bottom" },
  { name: "rows / disabled / validate-event", type: "number / boolean / boolean", default: "3 / false / true" }
];

const PageMentionProps = defineHtml(`
  <h2>API</h2>
  <p><code>prefixes</code> is the Web Component-safe array alternative because native <code>Node.prefix</code> is read-only.</p>
  <elf-props-table title="属性" :rows=${rows} />
  <elf-props-table title="事件" :rows=${[
    { name: "update:modelValue / input", type: "(value: string) => void" },
    { name: "select", type: "(option, prefix) => void" },
    { name: "focus / blur", type: "(event: FocusEvent) => void" }
  ]} />
  <elf-props-table title="插槽" :rows=${[
    { name: "default", desc: "custom suggestion content; receives item" },
    { name: "loading", desc: "loading content" }
  ]} />
  <elf-props-table title="方法" :rows=${[{ name: "focus / blur", desc: "聚焦或失焦原生文本框" }]} />
`);

export { PageMentionProps };
