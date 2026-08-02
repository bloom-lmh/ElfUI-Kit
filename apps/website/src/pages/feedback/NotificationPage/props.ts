import { defineHtml } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

const pick = createDocsPicker();
const t = createDocsTranslator({
  functionApi: { zh: "函数 API", en: "Function API" },
});

const apiRows = [
  {
    name: "ElfNotification(options | string)",
    type: "Function",
    desc: pick("创建通知并返回关闭句柄", "Create a notification and return a close handle."),
  },
  {
    name: "ElfNotification.info/success/warning/error",
    type: "Function",
    desc: pick("创建指定类型的通知", "Create a typed notification."),
  },
  {
    name: "ElfNotification.closeAll()",
    type: "Function",
    desc: pick("关闭全部活动通知", "Close every active notification."),
  },
];

const optsRows = [
  { name: "title", type: "string", default: "''", desc: pick("通知标题", "Notification title.") },
  {
    name: "message",
    type: "string | Node | () => Node",
    default: "required",
    desc: pick(
      "文本或可信 DOM 内容；HTML 字符串始终按纯文本处理",
      "Text or trusted DOM content; HTML strings are never parsed.",
    ),
  },
  {
    name: "type",
    type: "info | success | warning | error",
    default: "''",
    desc: pick("状态样式", "Status styling."),
  },
  {
    name: "icon",
    type: "string",
    default: "''",
    desc: pick("自定义图标字符", "Custom icon glyph."),
  },
  {
    name: "position",
    type: "top-right | top-left | bottom-right | bottom-left",
    default: "top-right",
    desc: pick("屏幕角落", "Screen corner."),
  },
  {
    name: "duration",
    type: "number",
    default: "4500",
    desc: pick("持续毫秒数，0 表示保持显示", "Duration in milliseconds; 0 keeps it open."),
  },
  {
    name: "showClose / closable",
    type: "boolean",
    default: "true",
    desc: pick("显示关闭按钮", "Show the close button."),
  },
  {
    name: "closeIcon",
    type: "string",
    default: "'×'",
    desc: pick("关闭按钮字符或文字", "Close-button glyph or label."),
  },
  {
    name: "offset",
    type: "number",
    default: "16",
    desc: pick("堆叠起始偏移", "Initial stack offset."),
  },
  {
    name: "appendTo",
    type: "string | Element",
    default: "document.body",
    desc: pick("目标容器或选择器", "Target container or selector."),
  },
  {
    name: "customClass",
    type: "string",
    default: "''",
    desc: pick("额外宿主类名", "Additional host class names."),
  },
  {
    name: "zIndex",
    type: "number",
    default: "2000",
    desc: pick("宿主层级", "Host stacking context."),
  },
  {
    name: "onClick / onClose",
    type: "() => void",
    default: "undefined",
    desc: pick("点击和关闭生命周期回调", "Click and close lifecycle callbacks."),
  },
];

const PageNotificationProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table :title=${t("functionApi")} :rows=${apiRows}></elf-props-table>
  <elf-props-table title="NotificationOptions" :rows=${optsRows}></elf-props-table>
`);

export { PageNotificationProps };
