import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "total", type: "number", default: "0", desc: "Total item count" },
  { name: "current-page", type: "number", default: "undefined", desc: "Controlled current page" },
  { name: "default-current-page", type: "number", default: "1", desc: "Initial uncontrolled page" },
  { name: "page-size", type: "number", default: "undefined", desc: "Controlled page size" },
  { name: "default-page-size", type: "number", default: "10", desc: "Initial uncontrolled page size" },
  { name: "page-count", type: "number", default: "0", desc: "Explicit page count; takes precedence over total" },
  { name: "page-sizes", type: "number[]", default: "[10, 20, 30, 40, 50, 100]", desc: "Page size choices" },
  { name: "pager-count", type: "number", default: "7", desc: "Visible pager count; normalized to odd" },
  { name: "layout", type: "string", default: "total, sizes, prev, pager, next, jumper", desc: "Comma-separated sections" },
  { name: "background", type: "boolean", default: "false", desc: "Use background pager buttons" },
  { name: "size", type: "small | default | large", default: "''", desc: "Component size" },
  { name: "small", type: "boolean", default: "false", desc: "Legacy compact-size alias" },
  { name: "prev-text / next-text", type: "string", default: "''", desc: "Custom navigation labels" },
  { name: "prev-icon / next-icon", type: "string", default: "''", desc: "Navigation icon text; named SVG slots take precedence" },
  { name: "teleported", type: "boolean", default: "true", desc: "Place the size dropdown in the browser top layer" },
  { name: "append-size-to", type: "string | HTMLElement", default: "'body'", desc: "Logical overlay target metadata" },
  { name: "popper-class", type: "string", default: "''", desc: "Size dropdown class" },
  { name: "popper-style", type: "string | object", default: "''", desc: "Size dropdown inline style" },
  { name: "disabled", type: "boolean", default: "false", desc: "Disable interaction" },
  { name: "hide-on-single-page", type: "boolean", default: "false", desc: "Hide when only one page exists" },
  { name: "aria-label", type: "string", default: "'Pagination'", desc: "Navigation landmark label" }
];

const eventsRows = [
  { name: "update:currentPage", type: "(page: number) => void", desc: "Current page changed" },
  { name: "update:pageSize", type: "(size: number) => void", desc: "Page size changed" },
  { name: "current-change", type: "(page: number) => void", desc: "Current page changed" },
  { name: "size-change", type: "(size: number) => void", desc: "Page size changed" },
  { name: "change", type: "(page: number, size: number) => void", desc: "A page or size change completed" },
  { name: "prev-click / next-click", type: "(targetPage: number) => void", desc: "Navigation button activated" }
];

const slotsRows = [
  { name: "default", desc: "Custom content rendered after the configured layout" },
  { name: "prev-icon", desc: "Previous navigation SVG or icon content" },
  { name: "next-icon", desc: "Next navigation SVG or icon content" }
];

const methodsRows = [
  { name: "openSizeMenu", type: "() => void", desc: "Open the page-size listbox" },
  { name: "closeSizeMenu", type: "() => void", desc: "Close the page-size listbox" }
];

const partsRows = [
  { name: "size-trigger", desc: "Page-size trigger button" },
  { name: "size-dropdown", desc: "Page-size listbox overlay" }
];

const PagePaginationProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows.prop=${propsRows}></elf-props-table>
  <elf-props-table title="Events" :rows.prop=${eventsRows}></elf-props-table>
  <elf-props-table title="Slots" :rows.prop=${slotsRows}></elf-props-table>
  <elf-props-table title="Methods" :rows.prop=${methodsRows}></elf-props-table>
  <elf-props-table title="Parts" :rows.prop=${partsRows}></elf-props-table>
`);

export { PagePaginationProps };
