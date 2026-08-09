import { defineHtml, defineStyle, useComponents } from "@elfui/core";
import { mdiCogOutline, mdiContentCopy, mdiLockOutline, mdiStarOutline } from "@mdi/js";

import { createSvgIconSet } from "@elfui/kit";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

import { PagePageHeaderEx1 } from "./ex1";
import { PagePageHeaderEx2 } from "./ex2";
import { PagePageHeaderEx3 } from "./ex3";
import styles from "./style.scss?inline";

const t = createDocsTranslator({
  title: { zh: "页头", en: "Page header" },
  description: {
    zh: "用于详情页返回区域与页面级介绍区，支持标准页头、插画横幅、图标卡片、居中和深色表面。",
    en: "Build return regions and page-level introductions with standard headers, illustrated banners, icon cards, centered layouts, and dark surfaces.",
  },
  eyebrow: { zh: "导航组件 / 页头", en: "Navigation / Page header" },
  category: { zh: "导航组件", en: "Navigation" },
  favorite: { zh: "收藏", en: "Favorite" },
  copy: { zh: "复制", en: "Copy" },
  settings: { zh: "设置", en: "Settings" },
});
const pick = createDocsPicker();

const pageHeaderHeroIconOptions = {
  defaultSet: "mdi",
  sets: {
    mdi: createSvgIconSet({
      lock: mdiLockOutline,
      favorite: mdiStarOutline,
      copy: mdiContentCopy,
      settings: mdiCogOutline,
    }),
  },
};

const propsRows = [
  {
    name: "title",
    type: "string",
    default: "Back",
    desc: pick("返回文本或 Hero 主标题", "Return text or hero title."),
  },
  {
    name: "content",
    type: "string",
    default: "''",
    desc: pick("标准页头的标题内容", "Heading content in standard mode."),
  },
  {
    name: "icon",
    type: "string",
    default: "←",
    desc: pick("返回图标或卡片前导图标", "Return icon or card-leading icon."),
  },
  {
    name: "mode",
    type: "standard | hero",
    default: "standard",
    desc: pick("标准返回区或页面介绍区", "Standard return region or page introduction."),
  },
  {
    name: "variant",
    type: "plain | card | banner",
    default: "plain",
    desc: pick("Hero 的表面结构", "Hero surface structure."),
  },
  {
    name: "align",
    type: "start | center",
    default: "start",
    desc: pick("Hero 内容对齐方式", "Hero content alignment."),
  },
  {
    name: "tone",
    type: "default | primary | dark",
    default: "default",
    desc: pick("Hero 表面色调", "Hero surface tone."),
  },
  {
    name: "eyebrow",
    type: "string",
    default: "''",
    desc: pick("上眉标题与英文标签", "Eyebrow copy and compact tag."),
  },
  {
    name: "tag",
    type: "string",
    default: "''",
    desc: pick("上眉标题与英文标签", "Eyebrow copy and compact tag."),
  },
  {
    name: "description",
    type: "string",
    default: "''",
    desc: pick("说明文字与元信息", "Description and metadata."),
  },
  {
    name: "version",
    type: "string",
    default: "''",
    desc: pick("说明文字与元信息", "Description and metadata."),
  },
  {
    name: "image",
    type: "string",
    default: "''",
    desc: pick("Hero 视觉图片与替代文本", "Hero visual image and alternative text."),
  },
  {
    name: "imageAlt",
    type: "string",
    default: "''",
    desc: pick("Hero 视觉图片与替代文本", "Hero visual image and alternative text."),
  },
];

const eventsRows = [
  {
    name: "back",
    type: "() => void",
    desc: pick(
      "标准模式下点击返回按钮时触发",
      "Emitted after clicking the return button in standard mode.",
    ),
  },
];

const slotsRows = [
  { name: "breadcrumb", desc: pick("标准页头面包屑导航区域", "Standard breadcrumb region.") },
  { name: "icon", desc: pick("返回图标或卡片前导图标", "Return icon or card-leading icon.") },
  { name: "title", desc: pick("返回文本或 Hero 标题", "Return text or hero title.") },
  { name: "content", desc: pick("标准页头标题内容", "Standard heading content.") },
  { name: "eyebrow", desc: pick("Hero 上眉标题与标签", "Hero eyebrow and tag regions.") },
  { name: "tag", desc: pick("Hero 上眉标题与标签", "Hero eyebrow and tag regions.") },
  { name: "description", desc: pick("Hero 说明与元信息", "Hero description and metadata.") },
  { name: "meta", desc: pick("Hero 说明与元信息", "Hero description and metadata.") },
  { name: "visual", desc: pick("Hero 装饰或插画区域", "Hero decoration or illustration region.") },
  { name: "extra", desc: pick("右侧扩展操作", "Trailing actions.") },
];

useComponents({
  "page-page-header-ex1": PagePageHeaderEx1,
  "page-page-header-ex2": PagePageHeaderEx2,
  "page-page-header-ex3": PagePageHeaderEx3,
});

defineStyle(styles);

const PagePageHeader = defineHtml(`
  <elf-container>
    <elf-icon-provider :options.prop=${pageHeaderHeroIconOptions}>
      <elf-page-header class="page-header-doc-hero" mode="hero" variant="banner" tone="primary" :eyebrow=${t("eyebrow")} :title=${t("title")} tag="PageHeader" :description=${t("description")}>
        <div slot="meta" class="hero-meta-line">
          <elf-icon name="lock" size="15"></elf-icon><span>${t("category")}</span><span class="meta-separator" aria-hidden="true"></span><span>v1.0.0</span>
        </div>
        <div slot="extra" class="hero-actions">
          <elf-button class="hero-favorite" size="sm" variant="outlined" :aria-label=${t("favorite")}><elf-icon name="favorite" size="18"></elf-icon><span>28</span></elf-button>
          <elf-button class="hero-icon-action" circle size="sm" variant="text" bg :aria-label=${t("copy")}><elf-icon name="copy" size="18"></elf-icon></elf-button>
          <elf-button class="hero-icon-action" circle size="sm" variant="text" bg :aria-label=${t("settings")}><elf-icon name="settings" size="18"></elf-icon></elf-button>
        </div>
      </elf-page-header>
    </elf-icon-provider>

    <page-page-header-ex1 />
    <page-page-header-ex2 />
    <page-page-header-ex3 />

    <elf-api-builder component="elf-page-header" title="API">
    <elf-props-table role="props" title="Props" :rows=${propsRows}></elf-props-table>
    <elf-props-table role="events" title="Events" :rows=${eventsRows}></elf-props-table>
    <elf-props-table role="slots" title="Slots" :rows=${slotsRows}></elf-props-table>
  </elf-api-builder>
  </elf-container>
`);

export { PagePageHeader };
