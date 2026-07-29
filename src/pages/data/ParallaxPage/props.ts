import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();
const propsRows = [
  { name: "src", type: "string", default: "''", desc: pick("图片资源地址", "Image source") },
  { name: "alt", type: "string", default: "''", desc: pick("图片替代文本", "Image alt text") },
  { name: "height", type: "number | string", default: "420", desc: pick("容器高度，数字按 px 处理", "Container height; numbers use pixels") },
  { name: "scale", type: "number", default: "1.25", desc: pick("背景图片缩放倍率，范围 1–1.8", "Background scale from 1 to 1.8") },
  { name: "position", type: "string", default: "'center'", desc: pick("object-position 取景位置", "Image crop position via object-position") },
  { name: "disabled", type: "boolean", default: "false", desc: pick("关闭视差滚动", "Disable motion") }
];

const slotsRows = [
  { name: "default", desc: pick("覆盖在视差图片上的内容", "Overlay content") }
];

const exposeRows = [
  { name: "update", type: "() => void", desc: pick("手动重新计算视差偏移", "Recalculate offset") }
];

const PageParallaxProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows.prop=${propsRows} />
  <elf-props-table title="Slots" :rows.prop=${slotsRows} />
  <elf-props-table title="Expose" :rows.prop=${exposeRows} />
`);

export { PageParallaxProps };
