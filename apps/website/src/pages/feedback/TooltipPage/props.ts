import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();

const propsRows = [
  { name: "content", type: "string", default: "''", desc: pick("提示内容", "Tooltip content.") },
  {
    name: "placement",
    type: "top | bottom | left | right | auto",
    default: "top",
    desc: pick("气泡弹出位置", "Preferred tooltip placement."),
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: pick("禁用提示", "Disable the tooltip."),
  },
  {
    name: "trigger",
    type: "hover | focus | click | contextmenu | manual",
    default: "hover",
    desc: pick("触发方式", "Interaction that opens the tooltip."),
  },
  {
    name: "show-after",
    type: "number",
    default: "0",
    desc: pick("显示延迟（毫秒）", "Delay before showing, in milliseconds."),
  },
  {
    name: "hide-after",
    type: "number",
    default: "0",
    desc: pick("隐藏延迟（毫秒）", "Delay before hiding, in milliseconds."),
  },
  {
    name: "effect",
    type: "dark | light",
    default: "dark",
    desc: pick("明暗风格", "Light or dark appearance."),
  },
  {
    name: "max-width",
    type: "number | string",
    default: "240",
    desc: pick("长内容最大宽度", "Maximum width for long content."),
  },
  {
    name: "visible",
    type: "boolean",
    default: "undefined",
    desc: pick("受控显示状态", "Controlled visibility state."),
  },
  {
    name: "touch-long-press",
    type: "boolean",
    default: "true",
    desc: pick(
      "悬浮或聚焦模式下启用触屏长按",
      "Enable touch long press for hover or focus triggers.",
    ),
  },
  {
    name: "long-press-delay",
    type: "number",
    default: "500",
    desc: pick("触屏长按触发时间（毫秒）", "Touch long-press delay, in milliseconds."),
  },
  {
    name: "long-press-tolerance",
    type: "number",
    default: "10",
    desc: pick(
      "长按允许的手指移动距离（像素）",
      "Allowed finger movement during a long press, in pixels.",
    ),
  },
];

const eventsRows = [
  {
    name: "before-show",
    type: "() => void",
    desc: pick("显示状态切换前触发", "Emitted before the tooltip becomes visible."),
  },
  {
    name: "show",
    type: "() => void",
    desc: pick("提示进入可见状态时触发", "Emitted when the tooltip becomes visible."),
  },
  {
    name: "before-hide",
    type: "() => void",
    desc: pick("隐藏状态切换前触发", "Emitted before the tooltip starts hiding."),
  },
  {
    name: "hide",
    type: "() => void",
    desc: pick("离场动画完成时触发", "Emitted after the exit animation finishes."),
  },
];

const slotsRows = [
  { name: "default", desc: pick("触发元素", "Trigger element.") },
  { name: "content", desc: pick("自定义提示内容", "Custom tooltip content.") },
];

const methodsRows = [
  {
    name: "show() / hide()",
    type: "() => void",
    desc: pick("命令式控制显隐", "Show or hide the tooltip imperatively."),
  },
  {
    name: "isVisible()",
    type: "() => boolean",
    desc: pick("读取当前显示状态", "Read the current visibility state."),
  },
  {
    name: "updatePosition()",
    type: "() => void",
    desc: pick(
      "目标布局变化后重新计算位置",
      "Recalculate placement after the target layout changes.",
    ),
  },
];

const PageTooltipProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows"></elf-props-table>
  <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
  <elf-props-table title="Slots" :rows=${slotsRows}></elf-props-table>
  <elf-props-table title="Expose" :rows=${methodsRows}></elf-props-table>
`);

export { PageTooltipProps };
