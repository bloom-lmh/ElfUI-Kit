import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();
const formRows = [
  { name: "model", type: "object", desc: pick("useReactive 对象", "useReactive object") },
  { name: "rules", type: "FormRules", desc: pick("字段到规则数组", "Field-to-rules mapping") },
  { name: "size", type: "sm|md|lg", default: "md", desc: pick("组件尺寸", "Component size.") },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: pick("禁用组件交互", "Disable component interaction."),
  },
  {
    name: "label-position",
    type: "top|left|right",
    default: "right",
    desc: pick("标签位置", "Label position."),
  },
  { name: "label-width", type: "string", default: "100px", desc: pick("标签宽度", "Label width.") },
  {
    name: "label-suffix",
    type: "string",
    default: "''",
    desc: pick("标签后缀文本", "Label suffix text."),
  },
  {
    name: "inline",
    type: "boolean",
    default: "false",
    desc: pick("行内表单布局", "Inline form layout."),
  },
  {
    name: "hide-required-asterisk",
    type: "boolean",
    desc: pick("隐藏必填星号", "Hide the required asterisk."),
  },
  {
    name: "require-asterisk-position",
    type: "left|right",
    default: "left",
    desc: pick("必填星号位置", "Required asterisk position."),
  },
  {
    name: "show-message",
    type: "boolean",
    default: "true",
    desc: pick("显示校验错误信息", "Show validation messages."),
  },
  {
    name: "inline-message",
    type: "boolean",
    default: "false",
    desc: pick("错误信息内联显示", "Display messages inline."),
  },
  {
    name: "status-icon",
    type: "boolean",
    default: "false",
    desc: pick("显示校验状态图标", "Show validation status icons."),
  },
  {
    name: "validate-on-rule-change",
    type: "boolean",
    default: "true",
    desc: pick("规则变化时重新校验", "Re-validate when rules change."),
  },
  {
    name: "scroll-to-error",
    type: "boolean",
    default: "false",
    desc: pick("校验失败时滚动到错误项", "Scroll to the first invalid field."),
  },
  {
    name: "scroll-into-view-options",
    type: "ScrollIntoViewOptions | false",
    default: "smooth / center",
    desc: pick("滚动行为配置", "Scroll-into-view options."),
  },
  {
    name: "prevent-submit",
    type: "boolean",
    default: "true",
    desc: pick("阻止原生表单提交", "Prevent native form submission."),
  },
];

const formItemRows = [
  { name: "prop", type: "string", desc: pick("字段路径，支持 a.b", "Field path, including a.b") },
  { name: "label", type: "string", desc: pick("标签文本", "Label text.") },
  {
    name: "rules",
    type: "FormRule[]",
    desc: pick("与 form.rules[prop] 合并", "Merged with form.rules[prop]"),
  },
  { name: "required", type: "boolean", desc: pick("是否必填", "Whether the field is required.") },
  { name: "size", type: "sm|md|lg", desc: pick("组件尺寸", "Component size.") },
  {
    name: "error",
    type: "string",
    desc: pick("手动设置错误信息", "Set an error message manually"),
  },
  {
    name: "label-position",
    type: "top|left|right",
    desc: pick("覆盖表单标签位置", "Override the form label position"),
  },
  {
    name: "label-width",
    type: "string",
    desc: pick("覆盖表单标签宽度", "Override the form label width"),
  },
  {
    name: "for",
    type: "string",
    desc: pick("关联内部原生控件 id", "Associate an internal native control id"),
  },
  {
    name: "validate-status",
    type: "success|error|validating",
    desc: pick("外部控制校验状态", "Control validation state externally"),
  },
  {
    name: "trigger",
    type: "blur|change|input",
    desc: pick("限制自动校验触发时机", "Limit automatic validation triggers"),
  },
  {
    name: "inline-message",
    type: "boolean",
    desc: pick("错误信息内联显示", "Display messages inline."),
  },
  {
    name: "show-message",
    type: "boolean",
    default: "true",
    desc: pick("显示校验错误信息", "Show validation messages."),
  },
];

const formExposeRows = [
  {
    name: "validate()",
    type: "Promise<boolean>",
    desc: pick("校验全部已注册字段", "Validate all registered fields"),
  },
  {
    name: "validateField(prop)",
    type: "Promise<boolean>",
    desc: pick("校验指定字段", "Validate selected fields"),
  },
  {
    name: "resetFields(prop?)",
    type: "void",
    desc: pick("恢复全部或指定字段的初始值", "Restore initial values for all or selected fields"),
  },
  {
    name: "clearValidate(prop?)",
    type: "void",
    desc: pick("清除全部或指定字段的校验状态", "Clear validation state for all or selected fields"),
  },
  {
    name: "scrollToField(prop, options?)",
    type: "void",
    desc: pick("滚动定位指定字段", "Scroll to a selected field"),
  },
  {
    name: "fields",
    type: "FormField[]",
    desc: pick("读取已注册字段", "Read registered fields"),
  },
  {
    name: "getField(prop)",
    type: "FormField",
    desc: pick("读取已注册字段", "Read registered fields"),
  },
  {
    name: "setInitialValues(values?)",
    type: "void",
    desc: pick("更新 resetFields 使用的基线", "Update the resetFields baseline"),
  },
];

const formItemExposeRows = [
  {
    name: "validateState",
    type: "FormItemValidateState",
    desc: pick("当前校验状态", "Current validation state"),
  },
  {
    name: "validateMessage",
    type: "string",
    desc: pick("当前校验消息", "Current validation message"),
  },
  {
    name: "validate(trigger?)",
    type: "Promise<boolean>",
    desc: pick("执行字段校验", "Validate the field"),
  },
  {
    name: "resetField()",
    type: "void",
    desc: pick("重置字段或清除状态", "Reset the field or clear state"),
  },
  {
    name: "clearValidate()",
    type: "void",
    desc: pick("重置字段或清除状态", "Reset the field or clear state"),
  },
  {
    name: "setInitialValue(value?)",
    type: "void",
    desc: pick("更新字段重置基线", "Update the field reset baseline"),
  },
];

const ruleRows = [
  { name: "required", type: "boolean", desc: pick("必填", "Required") },
  { name: "type", type: "string|number|integer|float|email|url|date", desc: pick("类型", "Type.") },
  { name: "enum", type: "any[]", desc: pick("值必须在列表中", "Value must be in the list") },
  { name: "fields", type: "string", desc: pick("跨字段联动", "Cross-field dependency") },
  { name: "min", type: "number", desc: pick("最小值", "The minimum value.") },
  { name: "max", type: "number", desc: pick("最大值", "The maximum value.") },
  {
    name: "pattern",
    type: "RegExp",
    desc: pick("正则校验规则", "Regular-expression validation rule."),
  },
  {
    name: "validator",
    type: "(v, model) => string|true|Promise",
    desc: pick("自定义校验，支持异步", "Custom validator with async support"),
  },
  { name: "trigger", type: "blur|change|input", desc: pick("触发方式", "Trigger mode.") },
  { name: "message", type: "string", desc: pick("自定义错误信息", "Custom error message") },
];

const PageFormProps = defineHtml(`
  <elf-api-builder component="elf-form" title="API">
  <elf-props-table role="props" title="elf-form Props" :rows.prop=${formRows}></elf-props-table>
  <elf-props-table role="props" component="elf-form-item" title="elf-form-item Props" :rows.prop=${formItemRows}></elf-props-table>
  <elf-props-table role="methods" title="elf-form Expose" :rows.prop=${formExposeRows}></elf-props-table>
  <elf-props-table role="methods" component="elf-form-item" title="elf-form-item Expose" :rows.prop=${formItemExposeRows}></elf-props-table>
  <elf-props-table title="FormRule" :rows.prop=${ruleRows}></elf-props-table>
  </elf-api-builder>
`);

export { PageFormProps };
