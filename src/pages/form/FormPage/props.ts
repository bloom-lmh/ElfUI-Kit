import { defineHtml } from "@elfui/core";

const formRows = [
  { name: "model", type: "object", desc: "useReactive 对象" },
  { name: "rules", type: "FormRules", desc: "字段→规则数组" },
  { name: "size", type: "sm|md|lg", default: "md" },
  { name: "disabled", type: "boolean", default: "false" },
  { name: "label-position", type: "top|left|right", default: "right" },
  { name: "label-width", type: "string", default: "100px" },
  { name: "label-suffix", type: "string", default: "''" },
  { name: "inline", type: "boolean", default: "false" },
  { name: "hide-required-asterisk", type: "boolean" },
  { name: "require-asterisk-position", type: "left|right", default: "left" },
  { name: "show-message / inline-message / status-icon", type: "boolean", default: "true / false / false" },
  { name: "validate-on-rule-change", type: "boolean", default: "true" },
  { name: "scroll-to-error", type: "boolean", default: "false" },
  { name: "scroll-into-view-options", type: "ScrollIntoViewOptions | false", default: "smooth / center" },
  { name: "prevent-submit", type: "boolean", default: "true" }
];

const formItemRows = [
  { name: "prop", type: "string", desc: "字段路径，支持 a.b" },
  { name: "label", type: "string" },
  { name: "rules", type: "FormRule[]", desc: "与 form.rules[prop] 合并" },
  { name: "required", type: "boolean" },
  { name: "size", type: "sm|md|lg" },
  { name: "error", type: "string", desc: "手动设置错误信息" },
  { name: "label-position", type: "top|left|right", desc: "覆盖 Form 标签位置" },
  { name: "label-width", type: "string", desc: "覆盖 Form 标签宽度" },
  { name: "for", type: "string", desc: "关联内部原生控件 id" },
  { name: "validate-status", type: "success|error|validating", desc: "外部控制校验状态" },
  { name: "trigger", type: "blur|change|input", desc: "限制自动校验触发时机" },
  { name: "inline-message", type: "boolean" },
  { name: "show-message", type: "boolean", default: "true" }
];

const formExposeRows = [
  { name: "validate()", type: "Promise<boolean>", desc: "校验全部已注册字段" },
  { name: "validateField(prop)", type: "Promise<boolean>", desc: "校验指定字段" },
  { name: "resetFields(prop?)", type: "void", desc: "恢复全部或指定字段的初始值" },
  { name: "clearValidate(prop?)", type: "void", desc: "清除全部或指定字段的校验状态" },
  { name: "scrollToField(prop, options?)", type: "void", desc: "滚动定位指定字段" },
  { name: "fields / getField(prop)", type: "FormField[] / FormField", desc: "读取已注册字段" },
  { name: "setInitialValues(values?)", type: "void", desc: "更新 resetFields 使用的基线" }
];

const formItemExposeRows = [
  { name: "validateState", type: "FormItemValidateState", desc: "当前校验状态" },
  { name: "validateMessage", type: "string", desc: "当前校验消息" },
  { name: "validate(trigger?)", type: "Promise<boolean>", desc: "执行字段校验" },
  { name: "resetField() / clearValidate()", type: "void", desc: "重置字段或清除状态" },
  { name: "setInitialValue(value?)", type: "void", desc: "更新字段重置基线" }
];

const ruleRows = [
  { name: "required", type: "boolean", desc: "必填" },
  { name: "type", type: "string|number|integer|float|email|url|date" },
  { name: "enum", type: "any[]", desc: "值必须在列表中" },
  { name: "fields", type: "string", desc: "跨字段联动" },
  { name: "min / max", type: "number" },
  { name: "pattern", type: "RegExp" },
  { name: "validator", type: "(v, model) => string|true|Promise", desc: "自定义，支持异步" },
  { name: "trigger", type: "blur|change|input" },
  { name: "message", type: "string", desc: "自定义错误信息" }
];

const PageFormProps = defineHtml(`
  <h2>elf-form Props</h2>
  <elf-props-table title="elf-form Props" :rows.prop=${formRows}></elf-props-table>
  <h2>elf-form-item Props</h2>
  <elf-props-table title="elf-form-item Props" :rows.prop=${formItemRows}></elf-props-table>
  <h2>Exposes</h2>
  <elf-props-table title="elf-form Exposes" :rows.prop=${formExposeRows}></elf-props-table>
  <elf-props-table title="elf-form-item Exposes" :rows.prop=${formItemExposeRows}></elf-props-table>
  <h2>FormRule 字段</h2>
  <elf-props-table title="FormRule 字段" :rows.prop=${ruleRows}></elf-props-table>
`);

export { PageFormProps };
