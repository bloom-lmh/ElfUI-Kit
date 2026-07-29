import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";
const pick = createDocsPicker();

const rows = [
  { name: "model-value / active-value / inactive-value", type: "string | number | boolean", default: "false / true / false", desc: pick("当前值与开关值", "Current, active, and inactive values.") },
  { name: "size / width / inline-prompt", type: "sm | md | lg / string | number / boolean", default: "md / auto / false", desc: pick("尺寸、宽度与内嵌提示", "Size, width, and inline prompt.") },
  { name: "variant", type: "default | inset | material | square", default: "default", desc: pick("开关外观", "Switch appearance.") },
  { name: "active-text / inactive-text / active-icon / inactive-icon", type: "string", default: "''", desc: pick("状态文字与图标", "State text and icons.") },
  { name: "active-action-icon / inactive-action-icon", type: "string", default: "''", desc: pick("滑块动作图标", "Thumb action icons.") },
  { name: "disabled / loading / validate-event", type: "boolean", default: "false / false / true", desc: pick("禁用、加载与校验状态", "Disabled, loading, and validation states.") },
  { name: "id / tabindex / aria-label", type: "string / number / string", default: "'' / 0 / ''", desc: pick("原生与无障碍属性", "Native and accessibility attributes.") },
  { name: "active-color / inactive-color / border-color", type: "string", default: "''", desc: pick("状态与边框颜色", "State and border colors.") },
  { name: "inset / flat", type: "boolean", default: "false", desc: pick("兼容外观属性；新代码优先使用 variant", "Compatibility appearance flags; prefer variant in new code.") },
  { name: "before-change", type: "(nextValue) => boolean | Promise<boolean>", default: "undefined", desc: pick("切换前守卫", "Guard invoked before changing.") }
];

const PageSwitchProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${rows} />
  <elf-props-table title="Events" :rows=${[{ name: "update:modelValue / change", type: "(value: SwitchValue) => void", desc: pick("值变化时触发", "Emitted when the value changes.") }]} />
  <elf-props-table title="Slots" :rows=${[
    { name: "default", desc: pick("主标签", "Main label.") },
    { name: "active / inactive", desc: pick("内嵌提示内容", "Inline-prompt content.") },
    { name: "active-action / inactive-action", desc: pick("轨道动作内容", "Track-action content.") }
  ]} />
  <elf-props-table title="Expose" :rows=${[{ name: "focus", type: "() => void", desc: pick("聚焦原生开关", "Focus the native switch.") }]} />
`);

export { PageSwitchProps };
