import { defineHtml } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

const pick = createDocsPicker();
const t = createDocsTranslator({
  functionApi: { zh: "函数 API", en: "Function API" },
  options: { zh: "MessageBoxOptions", en: "MessageBoxOptions" },
});

const functionRows = [
  { name: "ElfMessageBox(options)", type: "Promise<MessageBoxResult>", desc: pick("打开通用消息框", "Open a general message box.") },
  { name: "ElfMessageBox.alert(message, title?, options?)", type: "Promise", desc: pick("必须确认的提醒；默认不响应遮罩与 Escape", "Open an alert that ignores backdrop and Escape by default.") },
  { name: "ElfMessageBox.confirm(message, title?, options?)", type: "Promise", desc: pick("打开确认与取消消息框", "Open a confirm/cancel message box.") },
  { name: "ElfMessageBox.prompt(message, title?, options?)", type: "Promise", desc: pick("打开带校验输入的消息框", "Open a validated input prompt.") },
  { name: "ElfMessageBox.closeAll()", type: "void", desc: pick("关闭全部活动消息框", "Close all active message boxes.") },
  { name: "useMessageBox()", type: "MessageBoxApi", desc: pick("读取最近 ConfigProvider 的服务默认值", "Bind the API to the nearest ConfigProvider service defaults.") },
];

const optionRows = [
  { name: "title", type: "string", default: "''", desc: pick("标题", "Title.") },
  { name: "message", type: "string | Node | () => Node", default: "''", desc: pick("文本或可信 DOM 内容；不解析 HTML 字符串", "Text or trusted DOM content; HTML strings are never parsed.") },
  { name: "type", type: "info | success | warning | error", default: "info", desc: pick("语义类型", "Semantic type.") },
  { name: "icon", type: "string", default: pick("按 type", "by type"), desc: pick("覆盖语义图标文本", "Override the semantic icon text.") },
  { name: "autofocus", type: "boolean", default: "true", desc: pick("打开后自动聚焦输入或确认按钮", "Focus the input or confirm button after opening.") },
  { name: "center", type: "boolean", default: "false", desc: pick("居中显示内容和操作", "Center content and actions.") },
  { name: "modal", type: "boolean", default: "true", desc: pick("显示遮罩并阻止背景指针交互", "Show a backdrop and block background pointer interaction.") },
  { name: "showClose", type: "boolean", default: "true", desc: pick("显示关闭按钮", "Show the close button.") },
  { name: "showCancelButton", type: "boolean", default: "false", desc: pick("显示取消按钮", "Show the cancel button.") },
  { name: "showConfirmButton", type: "boolean", default: "true", desc: pick("显示确认按钮", "Show the confirm button.") },
  { name: "cancelButtonText / confirmButtonText", type: "string", default: "locale", desc: pick("覆盖本地化按钮文本", "Override localized action labels.") },
  { name: "closeOnClickModal", type: "boolean", default: "true", desc: pick("点击遮罩关闭", "Close on backdrop click.") },
  { name: "closeOnPressEscape", type: "boolean", default: "true", desc: pick("按 Escape 关闭", "Close on Escape.") },
  { name: "closeOnHashChange", type: "boolean", default: "true", desc: pick("地址哈希变化时关闭", "Close when the location hash changes.") },
  { name: "distinguishCancelAndClose", type: "boolean", default: "false", desc: pick("区分 cancel 与 close 拒绝原因", "Distinguish cancel and close rejection reasons.") },
  { name: "lockScroll", type: "boolean", default: "true", desc: pick("打开时锁定文档滚动", "Lock document scrolling while open.") },
  { name: "showInput", type: "boolean", default: "false", desc: pick("显示输入框", "Show the input field.") },
  { name: "inputValue / inputType / inputPlaceholder", type: "string", default: "'' / text / ''", desc: pick("输入框初始值、类型和占位文本", "Configure the input value, type, and placeholder.") },
  { name: "inputPattern / inputValidator", type: "RegExp | function", default: "—", desc: pick("同步或异步输入校验", "Synchronous or asynchronous input validation.") },
  { name: "inputErrorMessage", type: "string", default: "Invalid input", desc: pick("校验失败的回退提示", "Fallback message for failed validation.") },
  { name: "beforeClose", type: "(action, value) => boolean | Promise<boolean>", default: "—", desc: pick("异步关闭守卫", "Asynchronous close guard.") },
  { name: "callback", type: "(action, value) => void", default: "—", desc: pick("Promise 之外的完成回调", "Completion callback in addition to the Promise result.") },
  { name: "customClass", type: "string", default: "''", desc: pick("添加到文档级 host 的类名", "Classes added to the document-level host.") },
  { name: "appendTo", type: "string | HTMLElement", default: "document.body", desc: pick("挂载目标", "Mount target.") },
  { name: "zIndex", type: "number", default: "10000", desc: pick("覆盖浮层层级", "Override the overlay z-index.") },
  { name: "themeTokens", type: "ThemeTokens", default: "—", desc: pick("文档级浮层主题变量", "Theme tokens for the document-level overlay.") },
];

const PageMessageBoxProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table :title=${t("functionApi")} :rows=${functionRows} />
  <elf-props-table :title=${t("options")} :rows=${optionRows} />
`);

export { PageMessageBoxProps };
