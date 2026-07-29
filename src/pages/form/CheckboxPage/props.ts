import { defineHtml, useRef } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const p = createDocsPicker();
const mappedState = useRef("disabled");

const onMappedState = (event: CustomEvent): void => {
  mappedState.set(String(event.detail));
};

const propsRows = [
  { name: "model-value", type: "boolean | unknown[]", default: "false", desc: p("单项值或选中值数组", "Standalone value or selected value array.") },
  { name: "value", type: "unknown", default: "undefined", desc: p("数组或选项组中的项目值", "Array or group item value.") },
  { name: "true-value / false-value", type: "unknown", default: "true / false", desc: p("单项选中状态映射", "Standalone checked-state mapping.") },
  { name: "label", type: "string", default: "''", desc: p("可见标签", "Visible label.") },
  { name: "true-label / false-label", type: "string", default: "''", desc: p("随状态变化的后备标签", "State-dependent fallback label.") },
  { name: "indeterminate", type: "boolean", default: "false", desc: p("半选状态", "Mixed state.") },
  { name: "border", type: "boolean", default: "false", desc: p("显示边框外观", "Bordered appearance.") },
  { name: "disabled", type: "boolean", default: "false", desc: p("禁用交互", "Disable interaction.") },
  { name: "id / tabindex", type: "string / number", default: "'' / 0", desc: p("可聚焦控件标识", "Focusable control identifiers.") },
  { name: "aria-label / aria-controls", type: "string", default: "''", desc: p("无障碍控件元数据", "Accessible control metadata.") }
];

const groupRows = [
  { name: "model-value", type: "unknown[]", default: "[]", desc: p("选中值数组", "Selected values.") },
  { name: "disabled", type: "boolean", default: "false", desc: p("禁用全部子项", "Disable all children.") },
  { name: "min / max", type: "number", default: "0 / Infinity", desc: p("选择数量边界", "Selection bounds.") },
  { name: "aria-label", type: "string", default: "''", desc: p("选项组标签", "Group label.") },
  { name: "variant / fill / text-color", type: "default | button / string / string" },
  { name: "options", type: "Array<primitive | object>", default: "[]" },
  { name: "props", type: "{ label?, value?, disabled? }", default: "{}" }
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
  <h2>API</h2>
  <elf-props-table title="elf-checkbox Props" :rows=${propsRows} />
  <elf-props-table title="elf-checkbox-group Props" :rows=${groupRows} />
  <elf-props-table title="Events" :rows=${[
    { name: "update:modelValue / change", type: "CustomEvent<boolean | unknown[]>", desc: p("选中值变化时触发", "Emitted when the checked value changes.") }
  ]} />
  <elf-props-table title="Slots" :rows=${[
    { name: "default", type: "—", default: "—", desc: p("复选框标签内容", "Checkbox label content.") }
  ]} />
`);

export { PageCheckboxProps };
