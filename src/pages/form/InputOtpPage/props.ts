import { defineHtml } from "@elfui/core";

const rows = [
  { name: "model-value / length", type: "string / number", default: "'' / 6" },
  { name: "type", type: "text | number | password", default: "text" },
  { name: "separator", type: "string", default: "''" },
  { name: "formatter / parser", type: "(value: string) => string", default: "undefined" },
  { name: "mask / validate-event", type: "boolean", default: "false / true" }
];

const PageInputOtpProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${rows} />
  <elf-props-table title="Slots" :rows=${[{ name: "separator", desc: "custom separator content" }]} />
  <elf-props-table title="Exposes" :rows=${[{ name: "focus / blur", desc: "manage OTP input focus" }]} />
`);

export { PageInputOtpProps };
