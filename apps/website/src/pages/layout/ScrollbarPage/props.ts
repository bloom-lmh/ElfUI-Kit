import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  height: { zh: "容器固定高度", en: "Fixed container height." },
  maxHeight: { zh: "容器最大高度", en: "Maximum container height." },
  always: { zh: "始终预留滚动条空间", en: "Always reserve space for the scrollbar." },
  native: {
    zh: "使用原生滚动并应用滚动条样式",
    en: "Use native scrolling with styled scrollbars.",
  },
  noresize: { zh: "关闭尺寸变化监听", en: "Disable resize observation." },
  wrapClass: { zh: "包裹层的额外类名", en: "Additional class for the scroll wrapper." },
  viewClass: { zh: "内容视图的额外类名", en: "Additional class for the content view." },
  scroll: {
    zh: "滚动时触发，detail 包含 scrollTop 和 scrollLeft",
    en: "Emitted on scroll; detail contains scrollTop and scrollLeft.",
  },
  setTop: { zh: "设置垂直滚动位置", en: "Set the vertical scroll position." },
  setLeft: { zh: "设置水平滚动位置", en: "Set the horizontal scroll position." },
  update: { zh: "手动更新滚动条状态", en: "Refresh the scrollbar state manually." },
  wrapRef: { zh: "滚动包裹层的 DOM 引用", en: "DOM reference to the scroll wrapper." },
  defaultSlot: { zh: "需要滚动的内容", en: "Scrollable content." },
});

const scrollbarRows = () => [
  { name: "height", type: "number | string", default: "—", desc: t("height") },
  { name: "max-height", type: "number | string", default: "—", desc: t("maxHeight") },
  { name: "always", type: "boolean", default: "false", desc: t("always") },
  { name: "native", type: "boolean", default: "true", desc: t("native") },
  { name: "noresize", type: "boolean", default: "false", desc: t("noresize") },
  { name: "wrap-class", type: "string", default: "''", desc: t("wrapClass") },
  { name: "view-class", type: "string", default: "''", desc: t("viewClass") },
];

const eventRows = () => [
  { name: "scroll", type: "CustomEvent<ScrollbarScrollDetail>", desc: t("scroll") },
];

const exposeRows = () => [
  { name: "setScrollTop", type: "(value: number) => void", desc: t("setTop") },
  { name: "setScrollLeft", type: "(value: number) => void", desc: t("setLeft") },
  { name: "update", type: "() => void", desc: t("update") },
  { name: "wrapRef", type: "HTMLElement | null", desc: t("wrapRef") },
];

const slotRows = () => [{ name: "default", type: "—", default: "—", desc: t("defaultSlot") }];

const PageScrollbarProps = defineHtml(`
  <elf-api-builder component="elf-scrollbar" title="API">
  <elf-props-table role="props" title="elf-scrollbar Props" :rows=${scrollbarRows()} />
  <elf-props-table role="events" title="Events" :rows=${eventRows()} />
  <elf-props-table role="slots" title="Slots" :rows=${slotRows()} />
  <elf-props-table role="methods" title="Expose" :rows=${exposeRows()} />
  </elf-api-builder>
`);

export { PageScrollbarProps };
