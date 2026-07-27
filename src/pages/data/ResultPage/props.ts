import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "icon", type: "success | warning | error | info", default: "info", desc: "结果状态及默认图形" },
  { name: "title", type: "string", default: "''", desc: "结果标题" },
  { name: "sub-title", type: "string", default: "''", desc: "补充说明" }
];

const slotsRows = [
  { name: "icon", desc: "替换默认状态图形" },
  { name: "title", desc: "替换结果标题" },
  { name: "sub-title", desc: "替换补充说明" },
  { name: "extra", desc: "结果后的操作按钮或链接" }
];

const PageResultProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows} />
  <elf-props-table title="Slots" :rows=${slotsRows} />
`);

export { PageResultProps };
