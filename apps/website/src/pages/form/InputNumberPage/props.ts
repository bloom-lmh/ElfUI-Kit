import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();

const propsRows = [
  {
    name: "model-value",
    type: "number | null",
    default: "undefined",
    desc: pick("受控数值", "Controlled numeric value."),
  },
  {
    name: "min",
    type: "number",
    default: "undefined",
    desc: pick("范围与步长", "Range and step size."),
  },
  {
    name: "max",
    type: "number",
    default: "undefined",
    desc: pick("范围与步长", "Range and step size."),
  },
  {
    name: "step",
    type: "number",
    default: "1",
    desc: pick("范围与步长", "Range and step size."),
  },
  {
    name: "step-strictly",
    type: "boolean",
    default: "false",
    desc: pick("严格步长与小数精度", "Strict stepping and decimal precision."),
  },
  {
    name: "precision",
    type: "number",
    default: "auto",
    desc: pick("严格步长与小数精度", "Strict stepping and decimal precision."),
  },
  {
    name: "value-on-clear",
    type: "number | null",
    default: "null",
    desc: pick("清空后的值", "Value used after clearing."),
  },
  {
    name: "controls",
    type: "boolean",
    default: "true",
    desc: pick("控制器显示与位置", "Control visibility and position."),
  },
  {
    name: "controls-position",
    type: "right",
    default: "''",
    desc: pick("控制器显示与位置", "Control visibility and position."),
  },
  {
    name: "control-variant",
    type: "default | stacked | split | hidden",
    default: "default",
    desc: pick("控制器布局", "Control layout."),
  },
  {
    name: "reverse",
    type: "boolean",
    default: "false",
    desc: pick("控制器与输入框布局标记", "Control and input layout flags."),
  },
  {
    name: "inset",
    type: "boolean",
    default: "false",
    desc: pick("控制器与输入框布局标记", "Control and input layout flags."),
  },
  {
    name: "hide-input",
    type: "boolean",
    default: "false",
    desc: pick("控制器与输入框布局标记", "Control and input layout flags."),
  },
  {
    name: "variant",
    type: "FieldVariant",
    default: "filled",
    desc: pick("字段外观", "Field appearance."),
  },
  {
    name: "density",
    type: "default | comfortable | compact",
    default: "default",
    desc: pick("字段密度", "Field density."),
  },
  {
    name: "label",
    type: "string",
    default: "''",
    desc: pick("标签与背景色", "Label and background color."),
  },
  {
    name: "background-color",
    type: "string",
    default: "''",
    desc: pick("标签与背景色", "Label and background color."),
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: pick("禁用与只读状态", "Disabled and read-only states."),
  },
  {
    name: "readonly",
    type: "boolean",
    default: "false",
    desc: pick("禁用与只读状态", "Disabled and read-only states."),
  },
  {
    name: "validate-event",
    type: "boolean",
    default: "true",
    desc: pick("值变化时触发表单校验", "Trigger form validation after value changes."),
  },
];

const eventsRows = [
  {
    name: "update:modelValue",
    type: "(value: number | null) => void",
    desc: pick("请求更新受控值", "Requests a controlled-value update."),
  },
  {
    name: "input",
    type: "(value: number | null) => void",
    desc: pick("输入或提交数值时触发", "Emitted while entering or committing a value."),
  },
  {
    name: "change",
    type: "(value: number | null) => void",
    desc: pick("输入或提交数值时触发", "Emitted while entering or committing a value."),
  },
  {
    name: "focus",
    type: "(event: FocusEvent) => void",
    desc: pick("聚焦或失焦时触发", "Emitted on focus or blur."),
  },
  {
    name: "blur",
    type: "(event: FocusEvent) => void",
    desc: pick("聚焦或失焦时触发", "Emitted on focus or blur."),
  },
];

const PageInputNumberProps = defineHtml(`
  <elf-api-builder component="elf-input-number" title="API">
  <elf-props-table role="props" title="Props" :rows=${propsRows} />
  <elf-props-table role="events" title="Events" :rows=${eventsRows} />
  <elf-props-table role="methods" title="Expose" :rows=${[
    {
      name: "focus",
      desc: pick("聚焦或失焦原生数字输入框", "Focus or blur the native number input."),
    },
    {
      name: "blur",
      desc: pick("聚焦或失焦原生数字输入框", "Focus or blur the native number input."),
    },
  ]} />
  </elf-api-builder>
`);

export { PageInputNumberProps };
