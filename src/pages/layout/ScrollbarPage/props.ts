import { defineHtml } from "@elfui/core";

const scrollbarRows = [
  { name: "height", type: "number | string", desc: "容器固定高度" },
  { name: "max-height", type: "number | string", desc: "容器最大高度" },
  { name: "always", type: "boolean", default: "false", desc: "始终预留滚动条空间" },
  { name: "native", type: "boolean", default: "true", desc: "使用原生美化滚动条" },
  { name: "noresize", type: "boolean", default: "false", desc: "关闭 resize 监听" },
  { name: "wrap-class", type: "string", desc: "包裹层额外 class" },
  { name: "view-class", type: "string", desc: "视图层额外 class" }
];

const eventRows = [
  { name: "scroll", type: "CustomEvent<ScrollbarScrollDetail>", desc: "滚动时触发，detail 包含 scrollTop / scrollLeft" }
];

const exposeRows = [
  { name: "setScrollTop", type: "(value: number) => void", desc: "设置垂直滚动位置" },
  { name: "setScrollLeft", type: "(value: number) => void", desc: "设置水平滚动位置" },
  { name: "update", type: "() => void", desc: "手动触发滚动条更新" },
  { name: "wrapRef", type: "HTMLElement | null", desc: "包裹层 DOM 引用" }
];

const PageScrollbarProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="elf-scrollbar Props" :rows="scrollbarRows" />
  <elf-props-table title="elf-scrollbar Events" :rows="eventRows" />
  <elf-props-table title="elf-scrollbar 暴露方法" :rows="exposeRows" />
`);

export { PageScrollbarProps };
