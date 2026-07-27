import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "variant", type: "text | circle | rect", default: "text", desc: "形状变体" },
  { name: "width", type: "string", default: "''", desc: "宽度，不设则用默认值" },
  { name: "height", type: "string", default: "''", desc: "高度，不设则用默认值" },
  { name: "animated", type: "boolean", default: "false", desc: "是否显示 shimmer 扫光动画" },
  { name: "count", type: "number", default: "1", desc: "重复生成的骨架组数" },
  { name: "loading", type: "boolean", default: "false", desc: "为 true 时显示骨架；为 false 时显示 default slot" },
  { name: "rows", type: "number", default: "3", desc: "每个文本骨架组的行数" },
  { name: "throttle", type: "number | { leading, trailing }", default: "0", desc: "显示/隐藏延迟，避免加载闪烁" },
  { name: "gap", type: "string", default: "'12px'", desc: "行间距（count>1 时生效）" }
];

const slotsRows = [
  { name: "default", desc: "加载完成后显示的实际内容" },
  { name: "template", desc: "加载中显示的自定义骨架模板" }
];

const PageSkeletonProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows" />
  <elf-props-table title="Slots" :rows="slotsRows" />
`);

export { PageSkeletonProps };
