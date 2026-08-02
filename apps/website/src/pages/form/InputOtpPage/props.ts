import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const p = createDocsPicker();
const rows = [
  { name: "model-value / length", type: "string / number", default: "'' / 6" },
  { name: "type", type: "text | number | password", default: "text" },
  { name: "separator", type: "string", default: "''" },
  { name: "formatter / parser", type: "(value: string) => string", default: "undefined" },
  { name: "mask / validate-event", type: "boolean", default: "false / true" },
];

const PageInputOtpProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${rows} />
  <elf-props-table title="Events" :rows=${[
    {
      name: "update:modelValue / change / complete",
      type: "CustomEvent<string>",
      desc: p("验证码输入变化或填写完成时触发", "Emitted when the code changes or is completed."),
    },
  ]} />
  <elf-props-table title="Slots" :rows=${[{ name: "separator", desc: p("自定义分隔符内容", "Custom separator content.") }]} />
  <elf-props-table title="Expose" :rows=${[{ name: "focus / blur", desc: p("管理验证码输入焦点", "Manage OTP input focus.") }]} />
`);

export { PageInputOtpProps };
