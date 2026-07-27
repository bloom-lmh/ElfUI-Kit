import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "steps", type: "TourStep[]", default: "[]", desc: "引导步骤" },
  { name: "visible", type: "boolean", default: "false", desc: "是否显示" },
  { name: "current", type: "number", default: "0", desc: "当前步骤索引" },
  { name: "maskClosable", type: "boolean", default: "true", desc: "点击遮罩关闭" },
  { name: "keyboard", type: "boolean", default: "true", desc: "方向键与 ESC 控制" },
  { name: "closeOnPressEscape", type: "boolean", default: "true", desc: "允许 ESC 关闭" },
  { name: "showClose", type: "boolean", default: "true", desc: "显示关闭按钮" },
  { name: "mask", type: "boolean", default: "true", desc: "显示目标区域外遮罩" },
  { name: "lockScroll", type: "boolean", default: "true", desc: "打开时锁定页面滚动" },
  { name: "gap", type: "number", default: "12", desc: "高亮区域与目标间距" },
  { name: "zIndex", type: "number", default: "3000", desc: "层级" },
  { name: "contentStyle", type: "Record<string, string>", default: "{}", desc: "步骤面板内联样式" }
];

const stepRows = [
  { name: "target", type: "string", default: "-", desc: "目标元素选择器" },
  { name: "title", type: "string", default: "-", desc: "标题" },
  { name: "content", type: "string", default: "-", desc: "说明内容" },
  { name: "placement", type: "top | bottom | left | right", default: "bottom", desc: "面板位置" },
  { name: "nextText", type: "string", default: "-", desc: "当前步骤下一步按钮文字" },
  { name: "prevText", type: "string", default: "-", desc: "当前步骤上一步按钮文字" }
];

const eventsRows = [
  { name: "update:current", type: "(current: number) => void", desc: "请求切换步骤" },
  {
    name: "change",
    type: "(detail: { current: number; step: TourStep | null }) => void",
    desc: "步骤切换"
  },
  { name: "close", type: "() => void", desc: "关闭" },
  { name: "finish", type: "() => void", desc: "完成" }
];

const methodsRows = [
  { name: "open()", type: "() => void", desc: "打开" },
  { name: "close()", type: "() => void", desc: "关闭" },
  { name: "prev()", type: "() => void", desc: "上一步" },
  { name: "next()", type: "() => void", desc: "下一步" },
  { name: "skip()", type: "() => void", desc: "跳过" },
  { name: "finish()", type: "() => void", desc: "完成" }
];

const slotsRows = [
  { name: "header", desc: "完整替换面板头部内容" },
  { name: "indicators", desc: "仅替换步骤指示器" }
];

const PageTourProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
  <elf-props-table title="TourStep" :rows=${stepRows}></elf-props-table>
  <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
  <elf-props-table title="Slots" :rows=${slotsRows}></elf-props-table>
  <elf-props-table title="Methods" :rows=${methodsRows}></elf-props-table>
`);

export { PageTourProps };
