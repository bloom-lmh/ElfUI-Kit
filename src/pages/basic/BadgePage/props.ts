import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "value", type: "string | number", default: "''" },
  { name: "max", type: "number", default: "99" },
  { name: "is-dot", type: "boolean", default: "false" },
  { name: "hidden", type: "boolean", default: "false" },
  { name: "type", type: "primary|success|warning|danger|info", default: "danger" },
  { name: "show-zero", type: "boolean", default: "true" },
  { name: "color", type: "string", default: "''" },
  { name: "offset", type: "[number, number] | string", default: "''" },
  { name: "badge-style", type: "Record<string, string | number>", default: "{}" },
  { name: "badge-class", type: "string", default: "''" },
  { name: "content", type: "string | number", default: "''" }
];

const slotsRows = [
  { name: "default", desc: "badge reference content" },
  { name: "content", desc: "custom badge content" }
];

const PageBadgeProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows} />
  <elf-props-table title="Slots" :rows=${slotsRows} />
`);

export { PageBadgeProps };
