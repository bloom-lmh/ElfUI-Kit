import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const p = createDocsPicker();
const rows = [
  { name: "model-value / options", type: "string / MentionOption[]", default: "'' / []" },
  { name: "prefix / prefixes", type: "string | string[] / string[]", default: "'@' / []" },
  {
    name: "variant / label",
    type: "FieldVariant / string",
    default: "filled / ''",
    desc: p("字段表面与浮动标签", "Field surface and floating label."),
  },
  {
    name: "background-color",
    type: "string",
    default: "''",
    desc: p("自定义字段表面背景", "Custom field surface background."),
  },
  {
    name: "split / whole / check-is-whole",
    type: "string / boolean / function",
    default: "' ' / false / undefined",
  },
  { name: "filter-option", type: "(pattern, option) => boolean", default: "undefined" },
  {
    name: "loading / loading-text / placement",
    type: "boolean / string / top | bottom",
    default: "false / 'Loading...' / bottom",
  },
  {
    name: "rows / disabled / validate-event",
    type: "number / boolean / boolean",
    default: "3 / false / true",
  },
];

const PageMentionProps = defineHtml(`
  <h2>API</h2>
  <p>${p("由于原生 Node.prefix 是只读属性，请使用适合 Web Component 的 prefixes 数组。", "Use the Web Component-safe prefixes array because native Node.prefix is read-only.")}</p>
  <elf-props-table title="Props" :rows=${rows} />
  <elf-props-table title="Events" :rows=${[
    { name: "update:modelValue / input", type: "(value: string) => void" },
    { name: "select", type: "(option, prefix) => void" },
    { name: "focus / blur", type: "(event: FocusEvent) => void" },
  ]} />
  <elf-props-table title="Slots" :rows=${[
    {
      name: "default",
      desc: p("自定义建议项内容，接收 item", "Custom suggestion content; receives item."),
    },
    { name: "loading", desc: p("加载状态内容", "Loading-state content.") },
  ]} />
  <elf-props-table title="Expose" :rows=${[{ name: "focus / blur", desc: p("聚焦或失焦原生文本框", "Focus or blur the native text box.") }]} />
`);

export { PageMentionProps };
