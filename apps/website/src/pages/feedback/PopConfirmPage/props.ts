import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();

const propsRows = [
  { name: "title", type: "string", default: "''", desc: pick("标题", "Confirmation title.") },
  {
    name: "content",
    type: "string",
    default: "''",
    desc: pick("辅助说明", "Supporting description."),
  },
  {
    name: "confirmText",
    type: "string",
    default: pick("确认", "Confirm"),
    desc: pick("确认按钮文字", "Confirm-button label."),
  },
  {
    name: "cancelText",
    type: "string",
    default: pick("取消", "Cancel"),
    desc: pick("取消按钮文字", "Cancel-button label."),
  },
  {
    name: "placement",
    type: "top | bottom | left | right",
    default: "top",
    desc: pick("弹出方向", "Preferred popover placement."),
  },
  {
    name: "trigger",
    type: "click | hover | focus | manual",
    default: "click",
    desc: pick("触发方式", "Interaction that opens the popover."),
  },
  {
    name: "visible",
    type: "boolean",
    default: "undefined",
    desc: pick("受控显示状态", "Controlled visibility state."),
  },
  { name: "width", type: "string", default: "260px", desc: pick("弹层宽度", "Popover width.") },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: pick("禁用触发", "Disable opening interactions."),
  },
  {
    name: "closeOnEscape",
    type: "boolean",
    default: "true",
    desc: pick("按 Escape 关闭", "Close when Escape is pressed."),
  },
  {
    name: "closeOnClickOutside",
    type: "boolean",
    default: "true",
    desc: pick("点击外部关闭", "Close after an outside click."),
  },
  {
    name: "teleported",
    type: "boolean",
    default: "true",
    desc: pick(
      "使用浏览器原生顶层，避免被滚动或裁切容器截断",
      "Use the native Top Layer to escape scrolling or clipping containers.",
    ),
  },
  {
    name: "beforeConfirm",
    type: "() => boolean | void | Promise<boolean | void>",
    default: "—",
    desc: pick(
      "确认前守卫；返回 false、抛错或拒绝时保持打开",
      "Guard confirmation; false, a thrown error, or rejection keeps the popover open.",
    ),
  },
  {
    name: "loadingText",
    type: "string",
    default: "''",
    desc: pick(
      "异步确认期间的按钮文字",
      "Button label while asynchronous confirmation is pending.",
    ),
  },
];

const eventsRows = [
  {
    name: "confirm",
    type: "() => void",
    desc: pick("确认完成时触发", "Emitted after confirmation succeeds."),
  },
  {
    name: "cancel",
    type: "() => void",
    desc: pick("点击取消时触发", "Emitted when cancellation is requested."),
  },
  {
    name: "open",
    type: "() => void",
    desc: pick("请求打开时触发", "Emitted when the popover opens."),
  },
  {
    name: "close",
    type: "() => void",
    desc: pick("请求关闭时触发", "Emitted when the popover closes."),
  },
  {
    name: "confirm-error",
    type: "(error: unknown) => void",
    desc: pick(
      "异步确认守卫抛错或拒绝",
      "Emitted when the async confirmation guard throws or rejects.",
    ),
  },
  {
    name: "update:visible",
    type: "(visible: boolean) => void",
    desc: pick("显示状态变化", "Requests a controlled visibility update."),
  },
];

const slotsRows = [
  { name: "default", desc: pick("触发元素", "Trigger element.") },
  { name: "content", desc: pick("自定义弹层内容", "Custom popover content.") },
  {
    name: "actions",
    desc: pick(
      "自定义操作区；可配合公开的 confirm/cancel 方法",
      "Custom actions used with the exposed confirm and cancel methods.",
    ),
  },
];

const methodsRows = [
  { name: "show()", type: "() => void", desc: pick("打开气泡", "Open the popover.") },
  { name: "hide()", type: "() => void", desc: pick("关闭气泡", "Close the popover.") },
  { name: "toggle()", type: "() => void", desc: pick("切换显示状态", "Toggle visibility.") },
  {
    name: "confirm() / cancel()",
    type: "() => Promise<void> / () => void",
    desc: pick(
      "驱动自定义操作区的确认和取消",
      "Drive confirmation and cancellation from custom actions.",
    ),
  },
  {
    name: "isVisible()",
    type: "() => boolean",
    desc: pick("读取当前显示状态", "Read the current visibility state."),
  },
];

const PagePopConfirmProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
  <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
  <elf-props-table title="Slots" :rows=${slotsRows}></elf-props-table>
  <elf-props-table title="Expose" :rows=${methodsRows}></elf-props-table>
`);

export { PagePopConfirmProps };
