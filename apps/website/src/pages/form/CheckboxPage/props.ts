import { defineHtml, useRef } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const p = createDocsPicker();
const mappedState = useRef("disabled");

const onMappedState = (event: CustomEvent): void => {
  mappedState.set(String(event.detail));
};

const propsRows = [
  {
    name: "model-value",
    type: "boolean | unknown[]",
    default: "false",
    desc: p("单项值或选中值数组", "Standalone value or selected value array."),
  },
  {
    name: "value",
    type: "unknown",
    default: "undefined",
    desc: p("数组或选项组中的项目值", "Array or group item value."),
  },
  {
    name: "true-value",
    type: "unknown",
    default: "true",
    desc: p("单项选中状态映射", "Standalone checked-state mapping."),
  },
  {
    name: "false-value",
    type: "unknown",
    default: "false",
    desc: p("单项选中状态映射", "Standalone checked-state mapping."),
  },
  { name: "label", type: "string", default: "''", desc: p("可见标签", "Visible label.") },
  {
    name: "true-label",
    type: "string",
    default: "''",
    desc: p("随状态变化的后备标签", "State-dependent fallback label."),
  },
  {
    name: "false-label",
    type: "string",
    default: "''",
    desc: p("随状态变化的后备标签", "State-dependent fallback label."),
  },
  { name: "indeterminate", type: "boolean", default: "false", desc: p("半选状态", "Mixed state.") },
  {
    name: "border",
    type: "boolean",
    default: "false",
    desc: p("显示边框外观", "Bordered appearance."),
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: p("禁用交互", "Disable interaction."),
  },
  {
    name: "id",
    type: "string",
    default: "''",
    desc: p("可聚焦控件标识", "Focusable control identifiers."),
  },
  {
    name: "tabindex",
    type: "number",
    default: "0",
    desc: p("可聚焦控件标识", "Focusable control identifiers."),
  },
  {
    name: "aria-label",
    type: "string",
    default: "''",
    desc: p("无障碍控件元数据", "Accessible control metadata."),
  },
  {
    name: "aria-controls",
    type: "string",
    default: "''",
    desc: p("无障碍控件元数据", "Accessible control metadata."),
  },
];

const groupRows = [
  {
    name: "model-value",
    type: "unknown[]",
    default: "[]",
    desc: p("选中值数组", "Selected values."),
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: p("禁用全部子项", "Disable all children."),
  },
  {
    name: "min",
    type: "number",
    default: "0",
    desc: p("选择数量边界", "Selection bounds."),
  },
  {
    name: "max",
    type: "number",
    default: "Infinity",
    desc: p("选择数量边界", "Selection bounds."),
  },
  { name: "aria-label", type: "string", default: "''", desc: p("选项组标签", "Group label.") },
  {
    name: "variant",
    type: "default | button",
    desc: p("视觉变体风格", "Visual variant style."),
  },
  { name: "fill", type: "string", desc: p("选中填充色", "Selection fill color.") },
  { name: "text-color", type: "string", desc: p("文本颜色", "Text color.") },
  {
    name: "options",
    type: "Array<primitive | object>",
    default: "[]",
    desc: p("选项数据列表", "The option data list."),
  },
  {
    name: "props",
    type: "{ label?, value?, disabled? }",
    default: "{}",
    desc: p("子项字段映射", "Child item field mapping."),
  },
];

const stateCode = `<elf-checkbox
  :modelValue.prop=\${mappedState}
  :trueValue.prop=\${"enabled"}
  :falseValue.prop=\${"disabled"}
  border
  aria-label="${p("启用通知", "Enable notifications")}"
  label="${p("通知", "Notifications")}"
  @update:modelValue=\${onMappedState}
/>
<span slot="status">${p("当前值", "Current value")}: \${mappedState}</span>
<elf-checkbox indeterminate label="${p("全选", "Select all")}" />
<elf-checkbox disabled label="${p("不可用", "Unavailable")}" />`;

const stateScript = `const mappedState = useRef("disabled");

const onMappedState = (event) => {
  mappedState.set(event.detail);
};`;

const PageCheckboxProps = defineHtml(`
  <h2>${p("状态映射与无障碍", "State mappings and accessibility")}</h2>
  <elf-playground :title=${p("使用真值和假值映射非布尔状态", "Map non-boolean state with true-value and false-value")} :code=${stateCode} :script=${stateScript}>
    <span slot="status" class="demo-state">${p("当前值", "Current value")}: {{ mappedState }}</span>
    <elf-checkbox
      :modelValue.prop=${mappedState}
      :trueValue.prop=${"enabled"}
      :falseValue.prop=${"disabled"}
      border
      :aria-label=${p("启用通知", "Enable notifications")}
      :label=${p("通知", "Notifications")}
      @update:modelValue=${onMappedState}
    ></elf-checkbox>
    <elf-checkbox indeterminate :label=${p("全选", "Select all")} />
    <elf-checkbox disabled :label=${p("不可用", "Unavailable")} />
  </elf-playground>
  <elf-api-builder component="elf-checkbox" title="API">
  <elf-props-table role="props" title="elf-checkbox Props" :rows=${propsRows} />
  <elf-props-table role="props" component="elf-checkbox-group" title="elf-checkbox-group Props" :rows=${groupRows} />
  <elf-props-table role="events" title="Events" :rows=${[
    {
      name: "update:modelValue",
      type: "CustomEvent<boolean | unknown[]>",
      desc: p("选中值变化时触发", "Emitted when the checked value changes."),
    },
    {
      name: "change",
      type: "CustomEvent<boolean | unknown[]>",
      desc: p("选中值变化时触发", "Emitted when the checked value changes."),
    },
  ]} />
  <elf-props-table role="slots" title="Slots" :rows=${[
    {
      name: "default",
      type: "—",
      default: "—",
      desc: p("复选框标签内容", "Checkbox label content."),
    },
  ]} />
  </elf-api-builder>
`);

export { PageCheckboxProps };
