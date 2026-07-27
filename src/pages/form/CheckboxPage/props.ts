import { defineHtml, useRef } from "@elfui/core";

const mappedState = useRef("disabled");

const onMappedState = (event: CustomEvent): void => {
  mappedState.set(String(event.detail));
};

const propsRows = [
  { name: "model-value", type: "boolean | unknown[]", default: "false", desc: "Standalone value or selected value array" },
  { name: "value", type: "unknown", default: "undefined", desc: "Array/group item value" },
  { name: "true-value / false-value", type: "unknown", default: "true / false", desc: "Standalone checked mapping" },
  { name: "label", type: "string", default: "''", desc: "Visible label" },
  { name: "true-label / false-label", type: "string", default: "''", desc: "State-dependent fallback label" },
  { name: "indeterminate", type: "boolean", default: "false", desc: "Mixed state" },
  { name: "border", type: "boolean", default: "false", desc: "Bordered appearance" },
  { name: "disabled", type: "boolean", default: "false", desc: "Disable interaction" },
  { name: "id / tabindex", type: "string / number", default: "'' / 0", desc: "Focusable control identifiers" },
  { name: "aria-label / aria-controls", type: "string", default: "''", desc: "Accessible control metadata" }
];

const groupRows = [
  { name: "model-value", type: "unknown[]", default: "[]", desc: "Selected values" },
  { name: "disabled", type: "boolean", default: "false", desc: "Disable all children" },
  { name: "min / max", type: "number", default: "0 / Infinity", desc: "Selection bounds" },
  { name: "aria-label", type: "string", default: "''", desc: "Group label" },
  { name: "variant / fill / text-color", type: "default | button / string / string" },
  { name: "options", type: "Array<primitive | object>", default: "[]" },
  { name: "props", type: "{ label?, value?, disabled? }", default: "{}" }
];

const stateCode = `<elf-checkbox
  :modelValue.prop=\${mappedState}
  :trueValue.prop=\${"enabled"}
  :falseValue.prop=\${"disabled"}
  border
  aria-label="启用通知"
  label="通知"
  @update:modelValue=\${onMappedState}
/>
<span slot="status">当前值：\${mappedState}</span>
<elf-checkbox indeterminate label="全选" />
<elf-checkbox disabled label="不可用" />`;

const stateScript = `const mappedState = useRef("disabled");

const onMappedState = (event) => {
  mappedState.set(event.detail);
};`;

const PageCheckboxProps = defineHtml(`
  <h2>State mappings and accessibility</h2>
  <elf-playground title="Use true-value / false-value for non-boolean state" :code=${stateCode} :script=${stateScript}>
    <span slot="status" class="demo-state">当前值：{{ mappedState }}</span>
    <elf-checkbox
      :modelValue.prop=${mappedState}
      :trueValue.prop=${"enabled"}
      :falseValue.prop=${"disabled"}
      border
      aria-label="Enable notifications"
      label="Notifications"
      @update:modelValue=${onMappedState}
    ></elf-checkbox>
    <elf-checkbox indeterminate label="Select all" />
    <elf-checkbox disabled label="Unavailable" />
  </elf-playground>
  <h2>API</h2>
  <elf-props-table title="elf-checkbox Props" :rows=${propsRows} />
  <elf-props-table title="elf-checkbox-group Props" :rows=${groupRows} />
`);

export { PageCheckboxProps };
