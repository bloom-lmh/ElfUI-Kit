import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "items", type: "AnchorItem[]", default: "[]", desc: "anchor item tree" },
  { name: "model-value", type: "string", default: "''", desc: "controlled active href" },
  { name: "default-active", type: "string", default: "''", desc: "initial active href" },
  {
    name: "container",
    type: "string | HTMLElement | Window",
    default: "window",
    desc: "scroll container"
  },
  { name: "offset", type: "number", default: "0", desc: "top offset before activation" },
  { name: "bound", type: "number", default: "15", desc: "activation threshold" },
  { name: "bounds", type: "number", default: "15", desc: "legacy activation threshold alias" },
  { name: "duration", type: "number", default: "300", desc: "smooth scroll duration hint" },
  { name: "marker", type: "boolean", default: "true", desc: "show active marker" },
  { name: "type", type: "default | underline", default: "default", desc: "anchor style type" },
  { name: "direction", type: "vertical | horizontal", default: "vertical", desc: "anchor direction" },
  { name: "selectScrollTop", type: "boolean", default: "false", desc: "Element Plus compatible flag" },
  { name: "smooth", type: "boolean", default: "true", desc: "smooth scroll on click" },
  { name: "props", type: "AnchorFieldNames", default: "built-in", desc: "field aliases" }
];

const eventsRows = [
  { name: "update:modelValue", type: "(href: string) => void", desc: "active href changed" },
  {
    name: "change",
    type: "(detail: AnchorChangeDetail) => void",
    desc: "scroll or click active change"
  },
  { name: "click", type: "(detail: AnchorClickDetail) => void", desc: "anchor item clicked" }
];

const methodsRows = [
  { name: "scrollToAnchor", type: "(href: string) => void", desc: "滚动到目标；避免覆盖 HTMLElement.scrollTo" }
];

const slotsRows = [
  { name: "default", type: "AnchorLink[]", desc: "compositional anchor links" }
];

const linkPropsRows = [
  { name: "title", type: "string", default: "''", desc: "link label" },
  { name: "href", type: "string", default: "''", desc: "target selector" }
];

const linkSlotsRows = [
  { name: "default", type: "unknown", desc: "custom link content" },
  { name: "sub-link", type: "AnchorLink[]", desc: "nested anchor links" }
];

const PageAnchorProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
  <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
  <elf-props-table title="Methods" :rows=${methodsRows}></elf-props-table>
  <elf-props-table title="Slots" :rows=${slotsRows}></elf-props-table>
  <elf-props-table title="AnchorLink Props" :rows=${linkPropsRows}></elf-props-table>
  <elf-props-table title="AnchorLink Slots" :rows=${linkSlotsRows}></elf-props-table>
`);

export { PageAnchorProps };
