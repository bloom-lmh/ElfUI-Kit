import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";
const pick = createDocsPicker();
const rows = [
  {
    name: "model-value",
    type: "string | number | boolean",
    default: "undefined",
    desc: pick("当前选中值", "Current selected value."),
  },
  {
    name: "options",
    type: "SegmentedOption[]",
    default: "[]",
    desc: pick(
      "字符串或含 label/value/disabled 的对象",
      "Strings or objects with label, value, and disabled fields.",
    ),
  },
  {
    name: "props",
    type: "{ label; value; disabled }",
    default: "{}",
    desc: pick("对象选项字段映射", "Object-option field mapping."),
  },
  {
    name: "size / block / disabled",
    type: "string / boolean / boolean",
    default: "'' / false / false",
    desc: pick("外观与禁用状态", "Appearance and disabled state."),
  },
  {
    name: "name / id",
    type: "string / string",
    default: "'' / ''",
    desc: pick("表单名称和 radiogroup 标识", "Form name and radiogroup identifier."),
  },
  {
    name: "aria-label / label",
    type: "string / string",
    default: "'' / ''",
    desc: pick("radiogroup 无障碍标签", "Accessible label for the radiogroup."),
  },
  {
    name: "validate-event",
    type: "boolean",
    default: "true",
    desc: pick("变更时触发表单校验", "Trigger form validation after changes."),
  },
];
const PageSegmentedProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${rows} />
  <elf-props-table title="Events" :rows=${[{ name: "update:modelValue / change", type: "(value) => void", desc: pick("选中值变化", "Selected value changed.") }]} />
`);
export { PageSegmentedProps };
