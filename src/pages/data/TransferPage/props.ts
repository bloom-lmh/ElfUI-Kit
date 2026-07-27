import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "data", type: "TransferDataItem[]", default: "[]", desc: "Source records" },
  { name: "model-value", type: "string[]", default: "[]", desc: "Selected target keys" },
  { name: "titles", type: "[string, string]", default: "['Source', 'Target']", desc: "Panel headings" },
  { name: "filterable", type: "boolean", default: "false", desc: "Show filter inputs" },
  { name: "filter-placeholder", type: "string", default: "'Search'", desc: "Filter placeholder" },
  { name: "filter-method", type: "(query, item) => boolean", default: "undefined", desc: "Custom filter predicate" },
  { name: "target-order", type: "original | push | unshift", default: "original", desc: "Target display and insertion order" },
  { name: "button-texts", type: "[left, right]", default: "[]", desc: "Transfer action labels" },
  { name: "format", type: "{ noChecked, hasChecked }", default: "{}", desc: "Header count templates" },
  { name: "left-default-checked / right-default-checked", type: "string[]", default: "[]", desc: "Initial selectable checked keys" },
  { name: "props", type: "{ key, label, disabled? }", default: "{ key:'key', label:'label', disabled:'disabled' }", desc: "Field mappings" },
  { name: "virtual", type: "boolean", default: "false", desc: "Render only the visible option window" },
  { name: "height", type: "number | string", default: "320", desc: "Scrollable list viewport height" },
  { name: "item-size", type: "number", default: "36", desc: "Fixed option height used by virtualization" },
  { name: "overscan", type: "number", default: "4", desc: "Extra options rendered above and below the viewport" },
  { name: "empty-text", type: "string", default: "'No data'", desc: "Empty and no-filter-result message" },
  { name: "render-content", type: "(item, context) => unknown", default: "undefined", desc: "Typed option renderer with side, checked and disabled context" }
];

const eventsRows = [
  { name: "update:modelValue", type: "(keys: string[]) => void", desc: "Target keys changed" },
  { name: "change", type: "(keys, direction, movedKeys) => void", desc: "A transfer completed" },
  { name: "left-check-change / right-check-change", type: "(checkedKeys, changedKeys) => void", desc: "Panel checked state changed" }
];

const exposesRows = [
  { name: "clearQuery", type: "(side?: 'left' | 'right') => void", desc: "Clear one or both filters" },
  { name: "scrollToItem", type: "(side, key) => void", desc: "Scroll and focus a panel option by key" },
  { name: "leftPanel / rightPanel", type: "{ query: string }", desc: "Current filter query views" }
];

const slotsRows = [
  { name: "left-footer / right-footer", type: "unknown", desc: "Panel footer content" },
  { name: "left-empty / right-empty", type: "unknown", desc: "Panel empty content" }
];

const PageTransferProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows.prop=${propsRows} />
  <elf-props-table title="Events" :rows.prop=${eventsRows} />
  <elf-props-table title="Exposes" :rows.prop=${exposesRows} />
  <elf-props-table title="Slots" :rows.prop=${slotsRows} />
`);

export { PageTransferProps };
