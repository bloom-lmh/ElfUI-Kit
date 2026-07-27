import { defineHtml } from "@elfui/core";

const apiRows = [
  { name: "ElfNotification(options | string)", type: "Function", desc: "Create a notification and return a close handle" },
  { name: "ElfNotification.info/success/warning/error", type: "Function", desc: "Create a typed notification" },
  { name: "ElfNotification.closeAll()", type: "Function", desc: "Close every active notification" }
];

const optsRows = [
  { name: "title", type: "string", default: "''", desc: "Notification title" },
  { name: "message", type: "string | Node | () => Node", default: "required", desc: "Text or trusted DOM content; HTML strings are never parsed" },
  { name: "type", type: "info | success | warning | error", default: "''", desc: "Status styling" },
  { name: "icon", type: "string", default: "''", desc: "Custom icon glyph" },
  { name: "position", type: "top-right | top-left | bottom-right | bottom-left", default: "top-right", desc: "Screen corner" },
  { name: "duration", type: "number", default: "4500", desc: "Milliseconds; 0 keeps it open" },
  { name: "showClose / closable", type: "boolean", default: "true", desc: "Show the close button" },
  { name: "closeIcon", type: "string", default: "'×'", desc: "Close button glyph" },
  { name: "offset", type: "number", default: "16", desc: "Initial stack offset" },
  { name: "appendTo", type: "string | Element", default: "document.body", desc: "Target container or selector" },
  { name: "customClass", type: "string", default: "''", desc: "Extra host classes" },
  { name: "zIndex", type: "number", default: "2000", desc: "Host stacking context" },
  { name: "onClick / onClose", type: "() => void", default: "undefined", desc: "Lifecycle callbacks" }
];

const PageNotificationProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Function API" :rows="apiRows"></elf-props-table>
  <elf-props-table title="NotificationOptions" :rows="optsRows"></elf-props-table>
`);

export { PageNotificationProps };
