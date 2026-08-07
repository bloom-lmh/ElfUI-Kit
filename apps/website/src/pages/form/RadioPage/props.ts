import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();

const radioRows = [
  {
    name: "model-value",
    type: "string | number | boolean",
    default: "''",
    desc: pick("组值与选项值", "Group value and option value."),
  },
  {
    name: "value",
    type: "string | number | boolean",
    default: "''",
    desc: pick("组值与选项值", "Group value and option value."),
  },
  {
    name: "label",
    type: "string",
    default: "''",
    desc: pick("标签、禁用与边框状态", "Label, disabled, and border states."),
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: pick("标签、禁用与边框状态", "Label, disabled, and border states."),
  },
  {
    name: "border",
    type: "boolean",
    default: "false",
    desc: pick("标签、禁用与边框状态", "Label, disabled, and border states."),
  },
  {
    name: "id",
    type: "string",
    default: "''",
    desc: pick("原生表单和无障碍属性", "Native form and accessibility attributes."),
  },
  {
    name: "name",
    type: "string",
    default: "''",
    desc: pick("原生表单和无障碍属性", "Native form and accessibility attributes."),
  },
  {
    name: "aria-label",
    type: "string",
    default: "''",
    desc: pick("原生表单和无障碍属性", "Native form and accessibility attributes."),
  },
  {
    name: "tabindex",
    type: "number",
    default: "''",
    desc: pick("原生表单和无障碍属性", "Native form and accessibility attributes."),
  },
  {
    name: "size",
    type: "sm | md | lg",
    default: "''",
    desc: pick("尺寸与表单校验开关", "Size and form-validation switch."),
  },
  {
    name: "validate-event",
    type: "boolean",
    default: "true",
    desc: pick("尺寸与表单校验开关", "Size and form-validation switch."),
  },
];

const groupRows = [
  {
    name: "model-value",
    type: "unknown",
    default: "''",
    desc: pick("组值、禁用和尺寸", "Group value, disabled state, and size."),
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: pick("组值、禁用和尺寸", "Group value, disabled state, and size."),
  },
  {
    name: "size",
    type: "sm | md | lg",
    default: "md",
    desc: pick("组值、禁用和尺寸", "Group value, disabled state, and size."),
  },
  {
    name: "variant",
    type: "default | button",
    default: "default",
    desc: pick("按钮外观与颜色", "Button appearance and colors."),
  },
  {
    name: "fill",
    type: "string",
    default: "''",
    desc: pick("按钮外观与颜色", "Button appearance and colors."),
  },
  {
    name: "text-color",
    type: "string",
    default: "''",
    desc: pick("按钮外观与颜色", "Button appearance and colors."),
  },
  {
    name: "id",
    type: "string",
    default: "''",
    desc: pick("表单与无障碍标识", "Form and accessibility identifiers."),
  },
  {
    name: "name",
    type: "string",
    default: "''",
    desc: pick("表单与无障碍标识", "Form and accessibility identifiers."),
  },
  {
    name: "aria-label",
    type: "string",
    default: "''",
    desc: pick("表单与无障碍标识", "Form and accessibility identifiers."),
  },
  {
    name: "label",
    type: "string",
    default: "''",
    desc: pick("表单与无障碍标识", "Form and accessibility identifiers."),
  },
  {
    name: "validate-event",
    type: "boolean",
    default: "true",
    desc: pick("值变化时触发表单校验", "Trigger form validation after changes."),
  },
  {
    name: "options",
    type: "Array<primitive | object>",
    default: "[]",
    desc: pick("声明式选项", "Declarative options."),
  },
  {
    name: "props",
    type: "{ label?, value?, disabled? }",
    default: "{}",
    desc: pick("选项字段别名", "Option field aliases."),
  },
];

const PageRadioProps = defineHtml(`
  <elf-api-builder component="elf-radio" title="API">
  <elf-props-table role="props" title="elf-radio Props" :rows=${radioRows} />
  <elf-props-table role="props" component="elf-radio-group" title="elf-radio-group Props" :rows=${groupRows} />
  <elf-props-table role="events" title="Events" :rows=${[
    {
      name: "update:modelValue",
      type: "(value) => void",
      desc: pick("值变化时触发", "Emitted when the value changes."),
    },
    {
      name: "change",
      type: "(value) => void",
      desc: pick("值变化时触发", "Emitted when the value changes."),
    },
  ]} />
  </elf-api-builder>
  <p>${pick("在组内使用方向键移动并选择下一个可用选项；选中项会获得 Tab 焦点。", "Within a group, use Arrow keys to move and select the next enabled radio. The selected item receives tab focus.")}</p>
`);

export { PageRadioProps };
