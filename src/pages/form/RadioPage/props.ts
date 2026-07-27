import { defineHtml } from "@elfui/core";

const radioRows = [
  { name: "model-value / value", type: "string | number | boolean", default: "'' / ''" },
  { name: "label / disabled / border", type: "string / boolean / boolean", default: "'' / false / false" },
  { name: "id / name / aria-label / tabindex", type: "string / string / string / number", default: "''" },
  { name: "size / validate-event", type: "sm | md | lg / boolean", default: "'' / true" }
];

const groupRows = [
  { name: "model-value / disabled / size", type: "unknown / boolean / sm | md | lg", default: "'' / false / md" },
  { name: "variant / fill / text-color", type: "default | button / string / string", default: "default / '' / ''" },
  { name: "id / name / aria-label / label", type: "string", default: "''" },
  { name: "validate-event", type: "boolean", default: "true" },
  { name: "options", type: "Array<primitive | object>", default: "[]" },
  { name: "props", type: "{ label?, value?, disabled? }", default: "{}" }
];

const PageRadioProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="elf-radio Props" :rows=${radioRows} />
  <elf-props-table title="elf-radio-group Props" :rows=${groupRows} />
  <elf-props-table title="Events" :rows=${[
    { name: "update:modelValue / change", type: "(value) => void" }
  ]} />
  <p>Within a group, use Arrow keys to move and select the next enabled radio. The selected item receives tab focus.</p>
`);

export { PageRadioProps };
