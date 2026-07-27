import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "src", type: "string", default: "''", desc: "图片资源地址 / Image source" },
  { name: "alt", type: "string", default: "''", desc: "图片替代文本 / Image alt text" },
  { name: "height", type: "number | string", default: "420", desc: "容器高度，数字按 px 处理 / Container height" },
  { name: "scale", type: "number", default: "1.25", desc: "背景图片缩放倍率，范围 1-1.8 / Background scale" },
  { name: "position", type: "string", default: "'center'", desc: "object-position 取景位置 / Image crop position" },
  { name: "disabled", type: "boolean", default: "false", desc: "关闭视差滚动 / Disable motion" }
];

const slotsRows = [
  { name: "default", desc: "覆盖在视差图片上的内容 / Overlay content" }
];

const exposeRows = [
  { name: "update", type: "() => void", desc: "手动重新计算视差偏移 / Recalculate offset" }
];

const PageParallaxProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows.prop=${propsRows} />
  <elf-props-table title="Slots" :rows.prop=${slotsRows} />
  <elf-props-table title="Expose" :rows.prop=${exposeRows} />
`);

export { PageParallaxProps };
