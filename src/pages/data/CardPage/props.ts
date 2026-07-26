import { defineHtml } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  props: { zh: "卡片属性", en: "Card props" },
  events: { zh: "卡片事件", en: "Card events" },
  slots: { zh: "卡片插槽", en: "Card slots" },
  header: { zh: "头部文本，header 插槽优先", en: "Header text; the header slot takes precedence" },
  footer: { zh: "底部文本，footer 插槽优先", en: "Footer text; the footer slot takes precedence" },
  bodyStyle: { zh: "主体区域内联样式", en: "Inline styles for the body" },
  headerClass: { zh: "头部自定义 class", en: "Custom class for the header" },
  bodyClass: { zh: "主体自定义 class", en: "Custom class for the body" },
  footerClass: { zh: "底部自定义 class", en: "Custom class for the footer" },
  shadow: { zh: "阴影显示策略", en: "Shadow visibility policy" },
  variant: { zh: "Surface 视觉层级", en: "Visual surface hierarchy" },
  density: { zh: "内容区纵向密度", en: "Vertical content density" },
  avatar: { zh: "标题头像地址", en: "Header avatar URL" },
  title: { zh: "标题文本", en: "Title text" },
  subtitle: { zh: "副标题文本", en: "Subtitle text" },
  image: { zh: "快捷封面图片地址", en: "Shortcut cover image URL" },
  imageAlt: { zh: "封面替代文本；装饰图可留空", en: "Cover alternative text; leave empty for decorative media" },
  imagePlacement: { zh: "封面位于顶部或左侧", en: "Places the cover at the top or left" },
  imageHeight: { zh: "顶部封面高度", en: "Top cover height" },
  imageWidth: { zh: "左侧封面宽度", en: "Left cover width" },
  overlay: { zh: "封面底部叠加文字", en: "Text overlaid at the bottom of the cover" },
  clickable: { zh: "启用整卡按钮语义和键盘激活", en: "Enables whole-card button semantics and keyboard activation" },
  disabled: { zh: "禁用整卡交互并退出 Tab 顺序", en: "Disables whole-card interaction and removes it from the Tab order" },
  loading: { zh: "播报加载状态并暂时锁定整卡交互", en: "Announces loading and temporarily locks whole-card interaction" },
  click: { zh: "整卡被点击、Enter 或 Space 激活时触发", en: "Emitted when the whole card activates by click, Enter, or Space" },
  imageLoad: { zh: "快捷封面加载成功时触发", en: "Emitted when the shortcut cover loads" },
  imageError: { zh: "快捷封面加载失败时触发", en: "Emitted when the shortcut cover fails" },
  content: { zh: "卡片主体内容", en: "Card body content" },
  cover: { zh: "自定义封面，可组合 Image", en: "Custom cover; can compose with Image" },
  titleSlot: { zh: "自定义标题", en: "Custom title" },
  extra: { zh: "头部右侧内容", en: "Header trailing content" },
  headerSlot: { zh: "完整自定义头部", en: "Fully custom header" },
  footerSlot: { zh: "底部操作区", en: "Footer action area" },
  loadingSlot: { zh: "自定义顶部加载指示器", en: "Custom top loading indicator" },
  imageErrorSlot: { zh: "自定义封面失败内容", en: "Custom cover error content" }
});

const propsRows = () => [
  { name: "header", type: "string", default: "''", desc: t("header") },
  { name: "footer", type: "string", default: "''", desc: t("footer") },
  { name: "body-style", type: "CardBodyStyle", default: "{}", desc: t("bodyStyle") },
  { name: "header-class", type: "string", default: "''", desc: t("headerClass") },
  { name: "body-class", type: "string", default: "''", desc: t("bodyClass") },
  { name: "footer-class", type: "string", default: "''", desc: t("footerClass") },
  { name: "shadow", type: "always | hover | never", default: "always", desc: t("shadow") },
  { name: "variant", type: "elevated | outlined | filled | tonal | flat", default: "elevated", desc: t("variant") },
  { name: "density", type: "default | comfortable | compact", default: "default", desc: t("density") },
  { name: "avatar", type: "string", default: "''", desc: t("avatar") },
  { name: "title", type: "string", default: "''", desc: t("title") },
  { name: "subtitle", type: "string", default: "''", desc: t("subtitle") },
  { name: "image", type: "string", default: "''", desc: t("image") },
  { name: "image-alt", type: "string", default: "''", desc: t("imageAlt") },
  { name: "image-placement", type: "top | left", default: "top", desc: t("imagePlacement") },
  { name: "image-height", type: "string", default: "200px", desc: t("imageHeight") },
  { name: "image-width", type: "string", default: "40%", desc: t("imageWidth") },
  { name: "overlay", type: "string", default: "''", desc: t("overlay") },
  { name: "clickable", type: "boolean", default: "false", desc: t("clickable") },
  { name: "disabled", type: "boolean", default: "false", desc: t("disabled") },
  { name: "loading", type: "boolean", default: "false", desc: t("loading") }
];

const eventsRows = () => [
  { name: "click", desc: t("click") },
  { name: "image-load", type: "Event", desc: t("imageLoad") },
  { name: "image-error", type: "Event", desc: t("imageError") }
];

const slotsRows = () => [
  { name: "default", desc: t("content") },
  { name: "cover", desc: t("cover") },
  { name: "title", desc: t("titleSlot") },
  { name: "extra", desc: t("extra") },
  { name: "header", desc: t("headerSlot") },
  { name: "footer", desc: t("footerSlot") },
  { name: "loading", desc: t("loadingSlot") },
  { name: "image-error", desc: t("imageErrorSlot") }
];

const PageCardProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table :title=${t("props")} :rows=${propsRows()} />
  <elf-props-table :title=${t("events")} :rows=${eventsRows()} />
  <elf-props-table :title=${t("slots")} :rows=${slotsRows()} />
`);

export { PageCardProps };
