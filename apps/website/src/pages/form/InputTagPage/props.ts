import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const p = createDocsPicker();
const rows = [
  {
    name: "label",
    type: "string",
    default: "''",
    desc: p("浮动标签与字段背景主题", "Floating label and field background styling."),
  },
  {
    name: "background-color",
    type: "string",
    default: "''",
    desc: p("浮动标签与字段背景主题", "Floating label and field background styling."),
  },
  { name: "model-value", type: "string[]", default: "[]" },
  { name: "trigger", type: "enter | blur", default: "enter" },
  { name: "tag-type", type: "string", default: "''", desc: p("标签类型", "Tag type.") },
  {
    name: "tag-effect",
    type: "string",
    default: "light",
    desc: p("标签主题效果", "Tag theme effect."),
  },
  {
    name: "draggable",
    type: "boolean",
    default: "false",
    desc: p("允许拖拽排序", "Allow drag sorting."),
  },
  {
    name: "validate-event",
    type: "boolean",
    default: "true",
    desc: p("值变化时触发表单校验", "Trigger form validation on value changes."),
  },
  {
    name: "clearable",
    type: "boolean",
    default: "false",
    desc: p("显示清除按钮", "Show a clear button."),
  },
  {
    name: "max",
    type: "number",
    default: "undefined",
    desc: p("最大值", "The maximum value."),
  },
  {
    name: "size",
    type: "string",
    default: "''",
    desc: p("组件尺寸", "Component size."),
  },
  {
    name: "variant",
    type: "FieldVariant",
    default: "outlined",
    desc: p("字段表面样式", "Field surface variant."),
  },
];

const PageInputTagProps = defineHtml(`
  <elf-api-builder component="elf-input-tag" title="API">
  <elf-props-table role="props" title="Props" :rows=${rows} />
  <elf-props-table role="events" title="Events" :rows=${[
    {
      name: "update:modelValue",
      type: "CustomEvent",
      desc: p("标签数组变化时触发", "Emitted as the tag collection changes."),
    },
    {
      name: "add-tag",
      type: "CustomEvent",
      desc: p("标签数组变化时触发", "Emitted as the tag collection changes."),
    },
    {
      name: "remove-tag",
      type: "CustomEvent",
      desc: p("标签数组变化时触发", "Emitted as the tag collection changes."),
    },
    {
      name: "clear",
      type: "CustomEvent",
      desc: p("标签数组变化时触发", "Emitted as the tag collection changes."),
    },
  ]} />
  <elf-props-table role="slots" title="Slots" :rows=${[
    {
      name: "prefix",
      desc: p("自定义输入框前后内容", "Custom content before or after the input."),
    },
    {
      name: "suffix",
      desc: p("自定义输入框前后内容", "Custom content before or after the input."),
    },
  ]} />
  </elf-api-builder>
`);

export { PageInputTagProps };
