import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();
const propsRows = [
  {
    name: "icon",
    type: "success | warning | error | info",
    default: "info",
    desc: pick("结果状态及默认图形", "Result state and default graphic"),
  },
  { name: "title", type: "string", default: "''", desc: pick("结果标题", "Result title") },
  {
    name: "sub-title",
    type: "string",
    default: "''",
    desc: pick("补充说明", "Supporting description"),
  },
];

const slotsRows = [
  { name: "icon", desc: pick("替换默认状态图形", "Replace the default status graphic") },
  { name: "title", desc: pick("替换结果标题", "Replace the result title") },
  { name: "sub-title", desc: pick("替换补充说明", "Replace the supporting description") },
  {
    name: "extra",
    desc: pick("结果后的操作按钮或链接", "Actions or links shown after the result"),
  },
];

const PageResultProps = defineHtml(`
  <elf-api-builder component="elf-result" title="API">
  <elf-props-table role="props" title="Props" :rows=${propsRows} />
  <elf-props-table role="slots" title="Slots" :rows=${slotsRows} />
  </elf-api-builder>
`);

export { PageResultProps };
