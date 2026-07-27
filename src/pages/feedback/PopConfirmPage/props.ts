import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "title", type: "string", default: "''", desc: "标题" },
  { name: "content", type: "string", default: "''", desc: "辅助说明" },
  { name: "confirmText", type: "string", default: "确认", desc: "确认按钮文字" },
  { name: "cancelText", type: "string", default: "取消", desc: "取消按钮文字" },
  { name: "placement", type: "top | bottom | left | right", default: "top", desc: "弹出方向" },
  { name: "trigger", type: "click | hover | focus | manual", default: "click", desc: "触发方式" },
  { name: "visible", type: "boolean", default: "undefined", desc: "受控显示状态" },
  { name: "width", type: "string", default: "260px", desc: "弹层宽度" },
  { name: "disabled", type: "boolean", default: "false", desc: "禁用触发" },
  { name: "closeOnEscape", type: "boolean", default: "true", desc: "按 ESC 关闭" },
  { name: "closeOnClickOutside", type: "boolean", default: "true", desc: "点击外部关闭" },
  { name: "teleported", type: "boolean", default: "true", desc: "使用原生 Top Layer，避免被滚动或裁切容器截断" },
  { name: "beforeConfirm", type: "() => boolean | void | Promise<boolean | void>", default: "—", desc: "确认前守卫；返回 false、抛错或拒绝时保持打开" },
  { name: "loadingText", type: "string", default: "Loading", desc: "异步确认期间的按钮文字" }
];

const eventsRows = [
  { name: "confirm", type: "() => void", desc: "点击确认" },
  { name: "cancel", type: "() => void", desc: "点击取消" },
  { name: "open", type: "() => void", desc: "请求打开" },
  { name: "close", type: "() => void", desc: "请求关闭" },
  { name: "confirm-error", type: "(error: unknown) => void", desc: "异步确认守卫抛错或拒绝" },
  { name: "update:visible", type: "(visible: boolean) => void", desc: "显示状态变化" }
];

const slotsRows = [
  { name: "default", desc: "触发元素" },
  { name: "content", desc: "自定义弹层内容" },
  { name: "actions", desc: "自定义操作区；可配合 expose 的 confirm/cancel 方法" }
];

const methodsRows = [
  { name: "show()", type: "() => void", desc: "打开气泡" },
  { name: "hide()", type: "() => void", desc: "关闭气泡" },
  { name: "toggle()", type: "() => void", desc: "切换显示状态" },
  { name: "confirm() / cancel()", type: "() => Promise<void> / () => void", desc: "驱动自定义操作区的确认和取消" },
  { name: "isVisible()", type: "() => boolean", desc: "读取当前显示状态" }
];

const PagePopConfirmProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
  <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
  <elf-props-table title="Slots" :rows=${slotsRows}></elf-props-table>
  <elf-props-table title="Methods" :rows=${methodsRows}></elf-props-table>
`);

export { PagePopConfirmProps };
