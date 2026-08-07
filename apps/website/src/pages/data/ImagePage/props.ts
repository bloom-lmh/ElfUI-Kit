import { defineHtml } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  props: { zh: "图片属性", en: "Image props" },
  events: { zh: "图片事件", en: "Image events" },
  slots: { zh: "图片插槽", en: "Image slots" },
  exposes: { zh: "图片方法", en: "Image exposes" },
  src: { zh: "默认图片资源地址", en: "Default image source URL" },
  srcset: {
    zh: "响应式候选资源，原样转发到原生 img",
    en: "Responsive source candidates forwarded to the native img",
  },
  sizes: {
    zh: "响应式图片槽位尺寸，配合 srcset 选择资源",
    en: "Responsive slot sizes used by the browser with srcset",
  },
  alt: {
    zh: "图片替代文本；装饰图片应传空字符串",
    en: "Alternative text; use an empty string for decorative images",
  },
  fit: { zh: "对应原生 object-fit 的填充方式", en: "Fitting mode mapped to native object-fit" },
  size: {
    zh: "数字和纯数字字符串按 px 处理，也支持 CSS 尺寸",
    en: "Numbers and numeric strings use px; CSS sizes are also accepted",
  },
  lazy: {
    zh: "接近视口前不创建带 src/srcset 的 img",
    en: "Delay an img with src/srcset until it nears the viewport",
  },
  list: {
    zh: "非空时启用点击与键盘预览",
    en: "Enable pointer and keyboard preview when non-empty",
  },
  initial: {
    zh: "每次打开预览时使用的初始索引",
    en: "Initial index used whenever the preview opens",
  },
  teleported: {
    zh: "将预览层传送到 document.body",
    en: "Teleport the preview layer to document.body",
  },
  zoom: { zh: "单次缩放倍率，最小为 1.05", en: "Zoom multiplier per step with a 1.05 minimum" },
  toolbar: { zh: "显示缩小、重置和放大工具栏", en: "Show zoom-out, reset, and zoom-in controls" },
  load: { zh: "底层图片加载完成", en: "Native image finished loading" },
  error: { zh: "底层图片加载失败", en: "Native image failed to load" },
  previewOpen: { zh: "预览打开并返回当前索引", en: "Preview opened with the current index" },
  previewClose: { zh: "预览关闭并返回当前索引", en: "Preview closed with the current index" },
  previewChange: { zh: "预览图片切换并返回新索引", en: "Preview changed with the new index" },
  errorSlot: {
    zh: "失败内容；未提供时显示内置重试按钮",
    en: "Failure content; the fallback includes a retry button",
  },
  loadingSlot: {
    zh: "延迟请求或加载中的占位内容",
    en: "Placeholder shown before request or while loading",
  },
  openExpose: { zh: "以 initial-index 打开预览", en: "Open the preview at initial-index" },
  closeExpose: {
    zh: "关闭预览并恢复触发器焦点",
    en: "Close the preview and restore trigger focus",
  },
  retryExpose: { zh: "重新请求当前 src", en: "Request the current src again" },
});

const propsRows = () => [
  { name: "src", type: "string", default: "''", desc: t("src") },
  { name: "srcset", type: "string", default: "''", desc: t("srcset") },
  { name: "sizes", type: "string", default: "''", desc: t("sizes") },
  { name: "alt", type: "string", default: "''", desc: t("alt") },
  {
    name: "fit",
    type: "fill | contain | cover | none | scale-down",
    default: "fill",
    desc: t("fit"),
  },
  { name: "width", type: "number | string", default: "auto", desc: t("size") },
  { name: "height", type: "number | string", default: "auto", desc: t("size") },
  { name: "lazy", type: "boolean", default: "false", desc: t("lazy") },
  { name: "preview-src-list", type: "string[]", default: "[]", desc: t("list") },
  { name: "initial-index", type: "number", default: "0", desc: t("initial") },
  { name: "preview-teleported", type: "boolean", default: "false", desc: t("teleported") },
  { name: "zoom-rate", type: "number", default: "1.2", desc: t("zoom") },
  { name: "toolbar", type: "boolean", default: "true", desc: t("toolbar") },
];

const eventsRows = () => [
  { name: "load", type: "(event: Event) => void", desc: t("load") },
  { name: "error", type: "(event: Event) => void", desc: t("error") },
  { name: "preview-open", type: "(index: number) => void", desc: t("previewOpen") },
  { name: "preview-close", type: "(index: number) => void", desc: t("previewClose") },
  { name: "preview-change", type: "(index: number) => void", desc: t("previewChange") },
];

const slotsRows = () => [
  { name: "error", desc: t("errorSlot") },
  { name: "loading", desc: t("loadingSlot") },
];

const exposesRows = () => [
  { name: "openPreview()", desc: t("openExpose") },
  { name: "closePreview()", desc: t("closeExpose") },
  { name: "retry()", desc: t("retryExpose") },
];

const PageImageProps = defineHtml(`
  <elf-api-builder component="elf-image" title="API">
  <elf-props-table role="props" :title=${t("props")} :rows=${propsRows()} />
  <elf-props-table role="events" :title=${t("events")} :rows=${eventsRows()} />
  <elf-props-table role="slots" :title=${t("slots")} :rows=${slotsRows()} />
  <elf-props-table role="methods" :title=${t("exposes")} :rows=${exposesRows()} />
  </elf-api-builder>
`);

export { PageImageProps };
