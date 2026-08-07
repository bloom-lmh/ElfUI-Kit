import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const p = createDocsPicker();
const rows = [
  {
    name: "model-value",
    type: "string",
    default: "''",
    desc: p("受控值；通过 v-model 双向绑定", "Controlled value; bind with v-model."),
  },
  {
    name: "options",
    type: "MentionOption[]",
    default: "[]",
    desc: p("选项数据列表", "The option data list."),
  },
  {
    name: "prefix",
    type: "string | string[]",
    default: "'@'",
    desc: p("前缀内容", "Prefix content."),
  },
  {
    name: "prefixes",
    type: "string[]",
    default: "[]",
    desc: p(
      "触发前缀集合，替代只读的原生 Node.prefix",
      "Set of trigger prefixes replacing the read-only native Node.prefix.",
    ),
  },
  {
    name: "variant",
    type: "FieldVariant",
    default: "filled",
    desc: p("字段表面与浮动标签", "Field surface and floating label."),
  },
  {
    name: "label",
    type: "string",
    default: "''",
    desc: p("字段表面与浮动标签", "Field surface and floating label."),
  },
  {
    name: "background-color",
    type: "string",
    default: "''",
    desc: p("自定义字段表面背景", "Custom field surface background."),
  },
  {
    name: "split",
    type: "string",
    default: "' '",
    desc: p("触发分隔符", "Trigger separator."),
  },
  {
    name: "whole",
    type: "boolean",
    default: "false",
    desc: p("仅匹配完整单词", "Match whole words only."),
  },
  {
    name: "check-is-whole",
    type: "function",
    default: "undefined",
    desc: p("校验完整词匹配", "Check whole-word matching."),
  },
  {
    name: "filter-option",
    type: "(pattern, option) => boolean",
    default: "undefined",
    desc: p("自定义选项过滤函数", "Custom option filter function."),
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    desc: p("显示加载状态", "Show a loading state."),
  },
  {
    name: "loading-text",
    type: "string",
    default: "'Loading...'",
    desc: p("加载中提示文本", "Loading text."),
  },
  {
    name: "placement",
    type: "top | bottom",
    default: "bottom",
    desc: p("弹层位置", "Overlay placement."),
  },
  {
    name: "rows",
    type: "number",
    default: "3",
    desc: p("文本行数", "Number of text rows."),
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: p("禁用组件交互", "Disable component interaction."),
  },
  {
    name: "validate-event",
    type: "boolean",
    default: "true",
    desc: p("值变化时触发表单校验", "Trigger form validation on value changes."),
  },
];

const PageMentionProps = defineHtml(`
  <elf-api-builder component="elf-mention" title="API">
  <p>${p("由于原生 Node.prefix 是只读属性，请使用适合 Web Component 的 prefixes 数组。", "Use the Web Component-safe prefixes array because native Node.prefix is read-only.")}</p>
  <elf-props-table role="props" title="Props" :rows=${rows} />
  <elf-props-table role="events" title="Events" :rows=${[
    {
      name: "update:modelValue",
      type: "(value: string) => void",
      desc: p("请求新的受控值", "Request a new controlled value."),
    },
    {
      name: "input",
      type: "(value: string) => void",
      desc: p("输入内容变化时触发", "Emitted when the input content changes."),
    },
    {
      name: "select",
      type: "(option, prefix) => void",
      desc: p(
        "选中提及项时触发，携带选项与触发前缀",
        "Emitted when a mention is selected, carrying the option and prefix.",
      ),
    },
    {
      name: "focus",
      type: "(event: FocusEvent) => void",
      desc: p("输入框聚焦时触发", "Emitted when the input gains focus."),
    },
    {
      name: "blur",
      type: "(event: FocusEvent) => void",
      desc: p("输入框失焦时触发", "Emitted when the input loses focus."),
    },
  ]} />
  <elf-props-table role="slots" title="Slots" :rows=${[
    {
      name: "default",
      desc: p("自定义建议项内容，接收 item", "Custom suggestion content; receives item."),
    },
    { name: "loading", desc: p("加载状态内容", "Loading-state content.") },
  ]} />
  <elf-props-table role="methods" title="Expose" :rows=${[
    { name: "focus", desc: p("聚焦或失焦原生文本框", "Focus or blur the native text box.") },
    { name: "blur", desc: p("聚焦或失焦原生文本框", "Focus or blur the native text box.") },
  ]} />
  </elf-api-builder>
`);

export { PageMentionProps };
