import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();

const propsRows = [
  { name: "steps", type: "TourStep[]", default: "[]", desc: pick("引导步骤", "Tour steps.") },
  {
    name: "visible",
    type: "boolean",
    default: "false",
    desc: pick("受控显示状态", "Controlled visibility state."),
  },
  {
    name: "current",
    type: "number",
    default: "0",
    desc: pick("当前步骤索引", "Current step index."),
  },
  {
    name: "maskClosable",
    type: "boolean",
    default: "true",
    desc: pick("点击遮罩关闭", "Close after clicking the mask."),
  },
  {
    name: "keyboard",
    type: "boolean",
    default: "true",
    desc: pick("启用方向键和退出键控制", "Enable arrow-key and Escape controls."),
  },
  {
    name: "closeOnPressEscape",
    type: "boolean",
    default: "true",
    desc: pick("允许退出键关闭", "Allow Escape to close the tour."),
  },
  {
    name: "showClose",
    type: "boolean",
    default: "true",
    desc: pick("显示关闭按钮", "Show the close button."),
  },
  {
    name: "mask",
    type: "boolean",
    default: "true",
    desc: pick("显示目标区域外遮罩", "Mask the area outside the target."),
  },
  {
    name: "lockScroll",
    type: "boolean",
    default: "true",
    desc: pick("打开时锁定页面滚动", "Lock page scrolling while open."),
  },
  {
    name: "gap",
    type: "number",
    default: "12",
    desc: pick("高亮区域与目标间距", "Gap between the highlight and target."),
  },
  { name: "zIndex", type: "number", default: "3000", desc: pick("浮层层级", "Overlay z-index.") },
  {
    name: "contentStyle",
    type: "Record<string, string>",
    default: "{}",
    desc: pick("步骤面板内联样式", "Inline styles for the step panel."),
  },
];

const stepRows = [
  {
    name: "target",
    type: "string",
    default: "-",
    desc: pick("目标元素选择器", "Target element selector."),
  },
  { name: "title", type: "string", default: "-", desc: pick("步骤标题", "Step title.") },
  { name: "content", type: "string", default: "-", desc: pick("步骤说明", "Step content.") },
  {
    name: "placement",
    type: "top | bottom | left | right",
    default: "bottom",
    desc: pick("步骤面板位置", "Step-panel placement."),
  },
  {
    name: "nextText",
    type: "string",
    default: "-",
    desc: pick("当前步骤的下一步按钮文字", "Next-button text for this step."),
  },
  {
    name: "prevText",
    type: "string",
    default: "-",
    desc: pick("当前步骤的上一步按钮文字", "Previous-button text for this step."),
  },
];

const eventsRows = [
  {
    name: "update:current",
    type: "(current: number) => void",
    desc: pick("请求切换步骤", "Requests a current-step update."),
  },
  {
    name: "change",
    type: "(detail: { current: number; step: TourStep | null }) => void",
    desc: pick("步骤切换时触发", "Emitted when the current step changes."),
  },
  { name: "close", type: "() => void", desc: pick("关闭时触发", "Emitted when the tour closes.") },
  {
    name: "finish",
    type: "() => void",
    desc: pick("完成时触发", "Emitted when the tour finishes."),
  },
];

const methodsRows = [
  { name: "open()", type: "() => void", desc: pick("打开引导", "Open the tour.") },
  { name: "close()", type: "() => void", desc: pick("关闭引导", "Close the tour.") },
  { name: "prev()", type: "() => void", desc: pick("进入上一步", "Move to the previous step.") },
  { name: "next()", type: "() => void", desc: pick("进入下一步", "Move to the next step.") },
  { name: "skip()", type: "() => void", desc: pick("跳过引导", "Skip the tour.") },
  { name: "finish()", type: "() => void", desc: pick("完成引导", "Finish the tour.") },
];

const slotsRows = [
  { name: "header", desc: pick("完整替换面板头部内容", "Replace the complete panel header.") },
  { name: "indicators", desc: pick("仅替换步骤指示器", "Replace only the step indicators.") },
];

const PageTourProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
  <elf-props-table title="TourStep" :rows=${stepRows}></elf-props-table>
  <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
  <elf-props-table title="Slots" :rows=${slotsRows}></elf-props-table>
  <elf-props-table title="Expose" :rows=${methodsRows}></elf-props-table>
`);

export { PageTourProps };
