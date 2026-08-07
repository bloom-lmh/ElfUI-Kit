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
  { name: "length", type: "number", default: "6", desc: p("验证码位数", "Number of OTP digits.") },
  { name: "type", type: "text | number | password", default: "text" },
  { name: "separator", type: "string", default: "''" },
  {
    name: "formatter",
    type: "(value: string) => string",
    default: "undefined",
    desc: p("格式化函数", "Formatter function."),
  },
  {
    name: "parser",
    type: "(value: string) => string",
    default: "undefined",
    desc: p("解析函数", "Parser function."),
  },
  {
    name: "mask",
    type: "boolean",
    default: "false",
    desc: p("掩码显示输入字符", "Mask the input characters."),
  },
  {
    name: "validate-event",
    type: "boolean",
    default: "true",
    desc: p("值变化时触发表单校验", "Trigger form validation on value changes."),
  },
];

const PageInputOtpProps = defineHtml(`
  <elf-api-builder component="elf-input-otp" title="API">
  <elf-props-table role="props" title="Props" :rows=${rows} />
  <elf-props-table role="events" title="Events" :rows=${[
    {
      name: "update:modelValue",
      type: "CustomEvent<string>",
      desc: p("验证码输入变化或填写完成时触发", "Emitted when the code changes or is completed."),
    },
    {
      name: "change",
      type: "CustomEvent<string>",
      desc: p("验证码输入变化或填写完成时触发", "Emitted when the code changes or is completed."),
    },
    {
      name: "complete",
      type: "CustomEvent<string>",
      desc: p("验证码输入变化或填写完成时触发", "Emitted when the code changes or is completed."),
    },
  ]} />
  <elf-props-table role="slots" title="Slots" :rows=${[{ name: "separator", desc: p("自定义分隔符内容", "Custom separator content.") }]} />
  <elf-props-table role="methods" title="Expose" :rows=${[
    { name: "focus", desc: p("管理验证码输入焦点", "Manage OTP input focus.") },
    { name: "blur", desc: p("管理验证码输入焦点", "Manage OTP input focus.") },
  ]} />
  </elf-api-builder>
`);

export { PageInputOtpProps };
