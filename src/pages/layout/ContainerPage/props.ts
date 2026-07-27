import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "max-width", type: "xs|sm|md|lg|xl|full", default: "lg", desc: "最大宽度档位" },
  { name: "padding", type: "0|sm|md|lg", default: "md", desc: "内边距档位" },
  { name: "fluid", type: "boolean", default: "false", desc: "取消最大宽度限制，填满父容器" }
];

const slotsRows = [
  { name: "default", type: "-", default: "-", desc: "容器内容" }
];

const PageContainerProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows} />
  <elf-props-table title="Slots" :rows=${slotsRows} />
`);

export { PageContainerProps };
