import { defineHtml } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  props: { zh: "空状态属性", en: "Empty props" },
  slots: { zh: "空状态插槽", en: "Empty slots" },
  image: {
    zh: "自定义插画地址；图片保持装饰语义，说明文字负责传达状态",
    en: "Custom artwork URL; the image stays decorative while the description conveys status",
  },
  imageSize: {
    zh: "插画尺寸；数字和纯数字字符串按 px 处理，最小为 40px",
    en: "Artwork size; numbers and numeric strings use px with a 40px minimum",
  },
  description: {
    zh: "空状态说明，更新时通过礼貌级状态区域播报",
    en: "Empty-state guidance announced through a polite status region when updated",
  },
  size: {
    zh: "布局密度；compact 减少最小高度、间距与内边距",
    en: "Layout density; compact reduces minimum height, gaps, and padding",
  },
  imageSlot: {
    zh: "替换默认 SVG 或 image 属性提供的插画",
    en: "Replace the default SVG or artwork supplied by the image prop",
  },
  descriptionSlot: {
    zh: "替换说明内容，并保留状态播报语义",
    en: "Replace the guidance while preserving status-announcement semantics",
  },
  defaultSlot: {
    zh: "底部操作区；空插槽不会占据布局间距",
    en: "Bottom action area; an empty slot does not reserve layout spacing",
  },
});

const propsRows = () => [
  { name: "image", type: "string", default: "''", desc: t("image") },
  { name: "image-size", type: "number | string", default: "160", desc: t("imageSize") },
  { name: "description", type: "string", default: "No data", desc: t("description") },
  { name: "size", type: "default | compact", default: "default", desc: t("size") },
];

const slotsRows = () => [
  { name: "image", desc: t("imageSlot") },
  { name: "description", desc: t("descriptionSlot") },
  { name: "default", desc: t("defaultSlot") },
];

const PageEmptyProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table :title=${t("props")} :rows=${propsRows()} />
  <elf-props-table :title=${t("slots")} :rows=${slotsRows()} />
`);

export { PageEmptyProps };
