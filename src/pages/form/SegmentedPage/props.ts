import { defineHtml } from "@elfui/core";
const rows = [
  { name: "model-value", type: "string | number | boolean", default: "undefined", desc: "当前选中值" },
  { name: "options", type: "SegmentedOption[]", default: "[]", desc: "字符串或含 label/value/disabled 的对象" },
  { name: "props", type: "{ label; value; disabled }", default: "{}", desc: "对象选项字段映射" },
  { name: "size / block / disabled", type: "string / boolean / boolean", default: "'' / false / false", desc: "外观与禁用状态" },
  { name: "name / id", type: "string / string", default: "'' / ''", desc: "表单名称和 radiogroup 标识" },
  { name: "aria-label / label", type: "string / string", default: "'' / ''", desc: "radiogroup 无障碍标签" },
  { name: "validate-event", type: "boolean", default: "true", desc: "变更时是否触发表单校验" }
];
const PageSegmentedProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${rows} />
  <elf-props-table title="Events" :rows=${[{ name: "update:modelValue / change", type: "(value) => void", desc: "选中值变化" }]} />
`);
export { PageSegmentedProps };
