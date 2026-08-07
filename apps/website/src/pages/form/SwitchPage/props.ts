import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";
const pick = createDocsPicker();

const rows = [
  {
    name: "model-value",
    type: "string | number | boolean",
    default: "false",
    desc: pick("当前值与开关值", "Current, active, and inactive values."),
  },
  {
    name: "active-value",
    type: "string | number | boolean",
    default: "true",
    desc: pick("当前值与开关值", "Current, active, and inactive values."),
  },
  {
    name: "inactive-value",
    type: "string | number | boolean",
    default: "false",
    desc: pick("当前值与开关值", "Current, active, and inactive values."),
  },
  {
    name: "size",
    type: "sm | md | lg",
    default: "md",
    desc: pick("尺寸、宽度与内嵌提示", "Size, width, and inline prompt."),
  },
  {
    name: "width",
    type: "string | number",
    default: "auto",
    desc: pick("尺寸、宽度与内嵌提示", "Size, width, and inline prompt."),
  },
  {
    name: "inline-prompt",
    type: "boolean",
    default: "false",
    desc: pick("尺寸、宽度与内嵌提示", "Size, width, and inline prompt."),
  },
  {
    name: "variant",
    type: "default | inset | material | square",
    default: "default",
    desc: pick("开关外观", "Switch appearance."),
  },
  {
    name: "active-text",
    type: "string",
    default: "''",
    desc: pick("状态文字与图标", "State text and icons."),
  },
  {
    name: "inactive-text",
    type: "string",
    default: "''",
    desc: pick("状态文字与图标", "State text and icons."),
  },
  {
    name: "active-icon",
    type: "string",
    default: "''",
    desc: pick("状态文字与图标", "State text and icons."),
  },
  {
    name: "inactive-icon",
    type: "string",
    default: "''",
    desc: pick("状态文字与图标", "State text and icons."),
  },
  {
    name: "active-action-icon",
    type: "string",
    default: "''",
    desc: pick("滑块动作图标", "Thumb action icons."),
  },
  {
    name: "inactive-action-icon",
    type: "string",
    default: "''",
    desc: pick("滑块动作图标", "Thumb action icons."),
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: pick("禁用、加载与校验状态", "Disabled, loading, and validation states."),
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    desc: pick("禁用、加载与校验状态", "Disabled, loading, and validation states."),
  },
  {
    name: "validate-event",
    type: "boolean",
    default: "true",
    desc: pick("禁用、加载与校验状态", "Disabled, loading, and validation states."),
  },
  {
    name: "id",
    type: "string",
    default: "''",
    desc: pick("原生与无障碍属性", "Native and accessibility attributes."),
  },
  {
    name: "tabindex",
    type: "number",
    default: "0",
    desc: pick("原生与无障碍属性", "Native and accessibility attributes."),
  },
  {
    name: "aria-label",
    type: "string",
    default: "''",
    desc: pick("原生与无障碍属性", "Native and accessibility attributes."),
  },
  {
    name: "active-color",
    type: "string",
    default: "''",
    desc: pick("状态与边框颜色", "State and border colors."),
  },
  {
    name: "inactive-color",
    type: "string",
    default: "''",
    desc: pick("状态与边框颜色", "State and border colors."),
  },
  {
    name: "border-color",
    type: "string",
    default: "''",
    desc: pick("状态与边框颜色", "State and border colors."),
  },
  {
    name: "inset",
    type: "boolean",
    default: "false",
    desc: pick(
      "兼容外观属性；新代码优先使用 variant",
      "Compatibility appearance flags; prefer variant in new code.",
    ),
  },
  {
    name: "flat",
    type: "boolean",
    default: "false",
    desc: pick(
      "兼容外观属性；新代码优先使用 variant",
      "Compatibility appearance flags; prefer variant in new code.",
    ),
  },
  {
    name: "before-change",
    type: "(nextValue) => boolean | Promise<boolean>",
    default: "undefined",
    desc: pick("切换前守卫", "Guard invoked before changing."),
  },
];

const PageSwitchProps = defineHtml(`
  <elf-api-builder component="elf-switch" title="API">
  <elf-props-table role="props" title="Props" :rows=${rows} />
  <elf-props-table role="events" title="Events" :rows=${[
    {
      name: "update:modelValue",
      type: "(value: SwitchValue) => void",
      desc: pick("值变化时触发", "Emitted when the value changes."),
    },
    {
      name: "change",
      type: "(value: SwitchValue) => void",
      desc: pick("值变化时触发", "Emitted when the value changes."),
    },
  ]} />
  <elf-props-table role="slots" title="Slots" :rows=${[
    { name: "default", desc: pick("主标签", "Main label.") },
    { name: "active", desc: pick("内嵌提示内容", "Inline-prompt content.") },
    { name: "inactive", desc: pick("内嵌提示内容", "Inline-prompt content.") },
    {
      name: "active-action",
      desc: pick("轨道动作内容", "Track-action content."),
    },
    {
      name: "inactive-action",
      desc: pick("轨道动作内容", "Track-action content."),
    },
  ]} />
  <elf-props-table role="methods" title="Expose" :rows=${[{ name: "focus", type: "() => void", desc: pick("聚焦原生开关", "Focus the native switch.") }]} />
  </elf-api-builder>
`);

export { PageSwitchProps };
