import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const p = createDocsPicker();
const rows = [
  {
    name: "label / background-color",
    type: "string",
    default: "''",
    desc: p("浮动标签与字段背景主题", "Floating label and field background styling."),
  },
  { name: "model-value", type: "string[]", default: "[]" },
  { name: "trigger", type: "enter | blur", default: "enter" },
  { name: "tag-type / tag-effect", type: "string", default: "'' / light" },
  { name: "draggable / validate-event", type: "boolean", default: "false / true" },
  {
    name: "clearable / max / size",
    type: "boolean / number / string",
    default: "false / undefined / ''",
  },
  {
    name: "variant",
    type: "FieldVariant",
    default: "outlined",
    desc: p("字段表面样式", "Field surface variant."),
  },
];

const PageInputTagProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${rows} />
  <elf-props-table title="Events" :rows=${[
    {
      name: "update:modelValue / add-tag / remove-tag / clear",
      type: "CustomEvent",
      desc: p("标签数组变化时触发", "Emitted as the tag collection changes."),
    },
  ]} />
  <elf-props-table title="Slots" :rows=${[{ name: "prefix / suffix", desc: p("自定义输入框前后内容", "Custom content before or after the input.") }]} />
`);

export { PageInputTagProps };
