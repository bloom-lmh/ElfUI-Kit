import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "model-value", type: "number | null", default: "undefined" },
  { name: "min / max / step", type: "number", default: "undefined / undefined / 1" },
  { name: "step-strictly / precision", type: "boolean / number", default: "false / auto" },
  { name: "value-on-clear", type: "number | null", default: "null" },
  { name: "controls / controls-position", type: "boolean / right", default: "true / ''" },
  { name: "control-variant", type: "default | stacked | split | hidden", default: "default" },
  { name: "reverse / inset / hide-input", type: "boolean", default: "false" },
  { name: "variant", type: "FieldVariant", default: "filled" },
  { name: "density", type: "default | comfortable | compact", default: "default" },
  { name: "label / background-color", type: "string", default: "''" },
  { name: "disabled / readonly", type: "boolean", default: "false" },
  { name: "validate-event", type: "boolean", default: "true" }
];

const eventsRows = [
  { name: "update:modelValue", type: "(value: number | null) => void" },
  { name: "input / change", type: "(value: number | null) => void" },
  { name: "focus / blur", type: "(event: FocusEvent) => void" }
];

const PageInputNumberProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="属性" :rows=${propsRows} />
  <elf-props-table title="事件" :rows=${eventsRows} />
  <elf-props-table title="方法" :rows=${[{ name: "focus / blur", desc: "聚焦或失焦原生数字输入框" }]} />
`);

export { PageInputNumberProps };
