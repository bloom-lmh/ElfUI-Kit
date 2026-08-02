import { defineHtml } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  props: { zh: "分割线属性", en: "Divider props" },
  slots: { zh: "分割线插槽", en: "Divider slots" },
  direction: {
    zh: "水平或垂直方向；同步设置 aria-orientation",
    en: "Horizontal or vertical orientation; also sets aria-orientation",
  },
  contentPosition: {
    zh: "水平分割线中文字的位置；在 RTL 中随书写方向镜像",
    en: "Text position on a horizontal divider; mirrors with the writing direction in RTL",
  },
  borderStyle: { zh: "分割线的 CSS 线型", en: "CSS line style used by the divider" },
  dashed: {
    zh: "旧版兼容别名，启用后优先使用 dashed",
    en: "Legacy compatibility alias that takes precedence as dashed",
  },
  content: {
    zh: "水平分割线的文字内容，同时作为可访问名称",
    en: "Text for a horizontal divider, also used as its accessible name",
  },
});

const propsRows = () => [
  {
    name: "direction",
    type: "horizontal | vertical",
    default: "horizontal",
    desc: t("direction"),
  },
  {
    name: "content-position",
    type: "left | center | right",
    default: "center",
    desc: t("contentPosition"),
  },
  {
    name: "border-style",
    type: "solid | dashed | dotted | double",
    default: "solid",
    desc: t("borderStyle"),
  },
  { name: "dashed", type: "boolean", default: "false", desc: t("dashed") },
];

const slotsRows = () => [{ name: "default", desc: t("content") }];

const PageDividerProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table :title=${t("props")} :rows=${propsRows()} />
  <elf-props-table :title=${t("slots")} :rows=${slotsRows()} />
`);

export { PageDividerProps };
