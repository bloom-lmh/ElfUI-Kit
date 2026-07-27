import { defineHtml } from "@elfui/core";

const rows = [
  { name: "model-value / active-value / inactive-value", type: "string | number | boolean", default: "false / true / false" },
  { name: "size / width / inline-prompt", type: "sm | md | lg / string | number / boolean", default: "md / auto / false" },
  { name: "variant", type: "default | inset | material | square", default: "default" },
  { name: "active-text / inactive-text / active-icon / inactive-icon", type: "string", default: "''" },
  { name: "active-action-icon / inactive-action-icon", type: "string", default: "''" },
  { name: "disabled / loading / validate-event", type: "boolean", default: "false / false / true" },
  { name: "id / tabindex / aria-label", type: "string / number / string", default: "'' / 0 / ''" },
  { name: "active-color / inactive-color / border-color", type: "string", default: "''" },
  { name: "inset / flat", type: "boolean", default: "false", desc: "兼容外观属性；新代码优先使用 variant" },
  { name: "before-change", type: "(nextValue) => boolean | Promise<boolean>", default: "undefined" }
];

const PageSwitchProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="属性" :rows=${rows} />
  <elf-props-table title="事件" :rows=${[{ name: "update:modelValue / change", type: "(value: SwitchValue) => void" }]} />
  <elf-props-table title="插槽" :rows=${[
    { name: "default", desc: "main label" },
    { name: "active / inactive", desc: "inline prompt content" },
    { name: "active-action / inactive-action", desc: "track action content" }
  ]} />
  <elf-props-table title="暴露方法" :rows=${[{ name: "focus", type: "() => void" }]} />
`);

export { PageSwitchProps };
