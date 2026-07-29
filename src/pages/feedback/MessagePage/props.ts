import { defineHtml } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

const pick = createDocsPicker();
const t = createDocsTranslator({
  functionApi: { zh: "函数 API", en: "Function API" },
});

const apiRows = [
  { name: "ElfMessage(options | string)", type: "Function", desc: pick("通用入口", "Create a message and return its close handle.") },
  { name: "ElfMessage.info(msg)", type: "Function", desc: pick("普通提示", "Create an informational message.") },
  { name: "ElfMessage.success(msg)", type: "Function", desc: pick("成功提示", "Create a success message.") },
  { name: "ElfMessage.warning(msg)", type: "Function", desc: pick("警告提示", "Create a warning message.") },
  { name: "ElfMessage.danger(msg)", type: "Function", desc: pick("错误提示", "Create a danger message.") },
  { name: "ElfMessage.error(msg)", type: "Function", desc: pick("danger 的兼容别名", "Compatibility alias for danger.") },
  { name: "ElfMessage.closeAll()", type: "Function", desc: pick("关闭全部提示", "Close every active message.") }
];

const optsRows = [
  { name: "message", type: "string", default: "''", desc: pick("消息内容", "Message content.") },
  { name: "type", type: "info | success | warning | danger | error", default: "info", desc: pick("语义类型", "Semantic message type.") },
  { name: "duration", type: "number", default: "3000", desc: pick("持续毫秒数，0 表示不自动关闭", "Duration in milliseconds; 0 keeps the message open.") },
  { name: "closable", type: "boolean", default: "false", desc: pick("显示关闭按钮", "Show the close button.") },
  { name: "action", type: "string", default: "''", desc: pick("操作按钮文案", "Action-button label.") },
  { name: "position", type: "top | bottom", default: "top", desc: pick("显示位置", "Viewport placement.") },
  { name: "offset", type: "number", default: "20", desc: pick("距离视口边缘的偏移", "Offset from the viewport edge.") },
  { name: "zIndex", type: "number", default: "2000", desc: pick("自定义层级", "Custom stacking level.") },
  { name: "customClass", type: "string", default: "''", desc: pick("宿主元素类名", "Additional host class names.") },
  { name: "themeTokens", type: "ThemeTokens", default: "undefined", desc: pick("文档级浮层主题变量", "Theme tokens applied to the document-level host.") },
  { name: "onAction", type: "() => void", default: "-", desc: pick("点击操作按钮时触发", "Called when the action button is clicked.") },
  { name: "onClick", type: "() => void", default: "-", desc: pick("点击消息时触发", "Called when the message is clicked.") },
  { name: "onClose", type: "() => void", default: "-", desc: pick("关闭并移除后触发", "Called after the message closes and is removed.") }
];

const PageMessageProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table :title=${t("functionApi")} :rows=${apiRows}></elf-props-table>
  <elf-props-table title="MessageOptions" :rows=${optsRows}></elf-props-table>
`);

export { PageMessageProps };
