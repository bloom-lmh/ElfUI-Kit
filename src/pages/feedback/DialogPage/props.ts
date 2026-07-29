import { defineHtml } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

const pick = createDocsPicker();
const t = createDocsTranslator({
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  slots: { zh: "插槽", en: "Slots" },
  methods: { zh: "方法", en: "Methods" },
});

const propsRows = [
  { name: "open", type: "boolean", default: "false", desc: pick("v-model:open 控制可见状态。", "Visible state controlled by v-model:open.") },
  { name: "title", type: "string", default: "''", desc: pick("对话框标题。", "Dialog title.") },
  { name: "size", type: "sm | md | lg | fullscreen", default: "md", desc: pick("预设面板尺寸。", "Preset panel size.") },
  { name: "close-on-mask", type: "boolean", default: "true", desc: pick("点击遮罩时请求关闭。", "Request closing when the backdrop is clicked.") },
  { name: "close-on-escape", type: "boolean", default: "true", desc: pick("按 Escape 时请求关闭最上层对话框。", "Request closing the topmost dialog on Escape.") },
  { name: "closable", type: "boolean", default: "true", desc: pick("显示标题栏关闭按钮。", "Show the header close button.") },
  { name: "lock-scroll", type: "boolean", default: "true", desc: pick("打开时锁定页面滚动。", "Lock page scrolling while open.") },
  { name: "before-close", type: "() => boolean | Promise<boolean>", default: "undefined", desc: pick("返回 false 或拒绝时阻止关闭。", "Prevent closing by returning false or rejecting.") },
];

const eventsRows = [
  { name: "update:open", type: "(open: boolean) => void", desc: pick("可见状态变化。", "Visible-state update.") },
  { name: "open", type: "() => void", desc: pick("开始显示时触发。", "Emitted when opening starts.") },
  { name: "opened", type: "() => void", desc: pick("已进入打开状态时触发。", "Emitted after entering the open state.") },
  { name: "close", type: "() => void", desc: pick("关闭请求通过后触发。", "Emitted after the close request is accepted.") },
  { name: "closed", type: "() => void", desc: pick("关闭动画及清理完成后触发。", "Emitted after the closing transition and cleanup complete.") },
  { name: "open-auto-focus", type: "() => void", desc: pick("初始焦点进入对话框后触发。", "Emitted after initial focus enters the dialog.") },
  { name: "close-auto-focus", type: "() => void", desc: pick("焦点恢复到触发元素后触发。", "Emitted after focus returns to the trigger.") },
];

const slotsRows = [
  { name: "default", desc: pick("对话框主体内容。", "Dialog body content.") },
  { name: "header", desc: pick("自定义标题区域。", "Custom header content.") },
  { name: "footer", desc: pick("底部操作区域。", "Footer actions.") },
];

const methodsRows = [
  { name: "close() / handleClose()", type: "() => void", desc: pick("执行 before-close 后请求关闭。", "Run before-close and request closing.") },
];

const PageDialogProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table :title=${t("props")} :rows=${propsRows}></elf-props-table>
  <elf-props-table :title=${t("events")} :rows=${eventsRows}></elf-props-table>
  <elf-props-table :title=${t("slots")} :rows=${slotsRows}></elf-props-table>
  <elf-props-table :title=${t("methods")} :rows=${methodsRows}></elf-props-table>
`);

export { PageDialogProps };
