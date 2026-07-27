import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "content", type: "string", default: "''", desc: "提示内容" },
  {
    name: "placement",
    type: "top | bottom | left | right | auto",
    default: "top",
    desc: "气泡弹出位置"
  },
  { name: "disabled", type: "boolean", default: "false", desc: "是否禁用提示" },
  {
    name: "trigger",
    type: "hover | focus | click | contextmenu | manual",
    default: "hover",
    desc: "触发事件类型"
  },
  { name: "show-after", type: "number", default: "0", desc: "显示延迟（毫秒）" },
  { name: "hide-after", type: "number", default: "0", desc: "隐藏延迟（毫秒）" },
  { name: "effect", type: "dark | light", default: "dark", desc: "主题风格" },
  { name: "max-width", type: "number | string", default: "240", desc: "长内容最大宽度" },
  { name: "visible", type: "boolean", default: "undefined", desc: "手动控制显示隐藏" },
  { name: "touch-long-press", type: "boolean", default: "true", desc: "hover / focus 模式下启用触屏长按" },
  { name: "long-press-delay", type: "number", default: "500", desc: "触屏长按触发时间（毫秒）" },
  { name: "long-press-tolerance", type: "number", default: "10", desc: "长按期间允许的手指移动距离（像素）" }
];

const eventsRows = [
  { name: "before-show", type: "() => void", desc: "显示状态切换前" },
  { name: "show", type: "() => void", desc: "提示进入可见状态" },
  { name: "before-hide", type: "() => void", desc: "隐藏状态切换前" },
  { name: "hide", type: "() => void", desc: "离场动画完成" }
];

const slotsRows = [
  { name: "default", desc: "触发元素" },
  { name: "content", desc: "自定义提示内容" }
];

const methodsRows = [
  { name: "show() / hide()", type: "() => void", desc: "命令式控制显隐" },
  { name: "isVisible()", type: "() => boolean", desc: "读取当前显示状态" },
  { name: "updatePosition()", type: "() => void", desc: "目标布局变化后重新计算方向" }
];

const PageTooltipProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows"></elf-props-table>
  <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
  <elf-props-table title="Slots" :rows=${slotsRows}></elf-props-table>
  <elf-props-table title="Methods" :rows=${methodsRows}></elf-props-table>
`);

export { PageTooltipProps };
