import { defineHtml } from "@elfui/core";

const rows = [
  { name: "label / background-color", type: "string", default: "''", desc: "共享浮动标签与字段背景主题" },
  { name: "model-value", type: "string[]", default: "[]" },
  { name: "trigger", type: "enter | blur", default: "enter" },
  { name: "tag-type / tag-effect", type: "string", default: "'' / light" },
  { name: "draggable / validate-event", type: "boolean", default: "false / true" },
  { name: "clearable / max / size", type: "boolean / number / string", default: "false / undefined / ''" },
  { name: "variant", type: "FieldVariant", default: "outlined", desc: "字段表面样式，案例默认使用描边输入框" }
];

const PageInputTagProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="属性" :rows=${rows} />
  <elf-props-table title="插槽" :rows=${[{ name: "prefix / suffix", desc: "自定义输入框前后内容" }]} />
`);

export { PageInputTagProps };
