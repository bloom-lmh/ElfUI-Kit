import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();

const propsRows = [
  {
    name: "max-width",
    type: "xs|sm|md|lg|xl|full",
    default: "lg",
    desc: pick("最大宽度档位", "Maximum-width preset."),
  },
  {
    name: "padding",
    type: "0|sm|md|lg",
    default: "md",
    desc: pick("内边距档位", "Padding preset."),
  },
  {
    name: "fluid",
    type: "boolean",
    default: "false",
    desc: pick(
      "取消最大宽度限制并填满父容器",
      "Remove the maximum-width limit and fill the parent.",
    ),
  },
];

const slotsRows = [
  { name: "default", type: "-", default: "-", desc: pick("容器内容", "Container content.") },
];

const PageContainerProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows} />
  <elf-props-table title="Slots" :rows=${slotsRows} />
`);

export { PageContainerProps };
