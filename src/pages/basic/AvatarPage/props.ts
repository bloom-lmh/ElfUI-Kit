import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  props: { zh: "头像属性", en: "Avatar props" },
  events: { zh: "头像事件", en: "Avatar events" },
  slots: { zh: "头像插槽", en: "Avatar slots" },
  groupProps: { zh: "头像组属性", en: "Avatar group props" },
  size: { zh: "预设尺寸", en: "Preset size" },
  shape: { zh: "圆形或方形", en: "Circle or square shape" },
  src: { zh: "图片地址；变化后会重新尝试加载", en: "Image source; changing it retries loading" },
  srcSet: { zh: "响应式图片候选集", en: "Responsive image candidates" },
  alt: { zh: "图片替代文本和回退头像名称", en: "Image alternative text and fallback accessible name" },
  fit: { zh: "图片对象适配方式", en: "Image object-fit mode" },
  icon: { zh: "回退图标文本", en: "Fallback icon text" },
  color: { zh: "语义色或自定义背景色", en: "Semantic or custom background color" },
  error: { zh: "图片加载失败时触发", en: "Emitted when the image fails to load" },
  fallback: { zh: "自定义回退内容", en: "Custom fallback content" },
  iconSlot: { zh: "自定义图标内容", en: "Custom icon content" },
  inherit: { zh: "为未单独设置的头像提供尺寸或形状", en: "Provides size or shape to avatars without their own value" },
  collapse: { zh: "将超出数量的头像折叠为 +N", en: "Collapses overflowing avatars into +N" },
  tooltip: { zh: "点击 +N 显示隐藏成员名称", en: "Shows hidden member names when +N is activated" },
  max: { zh: "折叠前可见头像数量", en: "Visible avatar count before collapsing" },
  effect: { zh: "溢出提示外观", en: "Overflow tooltip appearance" },
  placement: { zh: "溢出提示位置", en: "Overflow tooltip placement" },
  custom: { zh: "溢出提示或按钮的自定义样式", en: "Custom overflow tooltip or button styling" }
});

const propsRows = () => [
  { name: "size", type: "sm | md | lg | xl", default: "md", desc: t("size") },
  { name: "shape", type: "circle | square", default: "circle", desc: t("shape") },
  { name: "src", type: "string", default: "''", desc: t("src") },
  { name: "src-set", type: "string", default: "''", desc: t("srcSet") },
  { name: "alt", type: "string", default: "''", desc: t("alt") },
  { name: "fit", type: "fill|contain|cover|none|scale-down", default: "cover", desc: t("fit") },
  { name: "icon", type: "string", default: "''", desc: t("icon") },
  { name: "color", type: "string", default: "''", desc: t("color") }
];

const eventsRows = () => [{ name: "error", type: "(event: Event) => void", desc: t("error") }];

const slotsRows = () => [
  { name: "default", desc: t("fallback") },
  { name: "icon", desc: t("iconSlot") }
];

const groupPropsRows = () => [
  { name: "size", type: "sm | md | lg | xl", default: "''", desc: t("inherit") },
  { name: "shape", type: "circle | square", default: "''", desc: t("inherit") },
  { name: "collapse-avatars", type: "boolean", default: "false", desc: t("collapse") },
  { name: "collapse-avatars-tooltip", type: "boolean", default: "false", desc: t("tooltip") },
  { name: "max-collapse-avatars", type: "number", default: "3", desc: t("max") },
  { name: "effect", type: "light | dark", default: "light", desc: t("effect") },
  { name: "placement", type: "top | bottom", default: "top", desc: t("placement") },
  { name: "popper-class / popper-style", type: "string / Record<string, string | number>", default: "'' / {}", desc: t("custom") },
  { name: "collapse-class / collapse-style", type: "string / Record<string, string | number>", default: "'' / {}", desc: t("custom") }
];

const PageAvatarProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table :title=${t("props")} :rows=${propsRows()} />
  <elf-props-table :title=${t("events")} :rows=${eventsRows()} />
  <elf-props-table :title=${t("slots")} :rows=${slotsRows()} />
  <elf-props-table :title=${t("groupProps")} :rows=${groupPropsRows()} />
`);

export { PageAvatarProps };
