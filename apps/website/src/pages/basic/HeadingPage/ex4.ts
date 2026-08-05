import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "标题套装 · 品牌展示", en: "Heading suite · Brand" },
  status: {
    zh: "brand · 超大字号 · 渐变标题 · 营销落地页",
    en: "brand · Display scale · Gradient titles · Landing pages",
  },
  meta: {
    zh: "产品首页、营销活动与发布会页面可直接使用。",
    en: "Drop into product homepages, campaigns, and launch pages.",
  },
  eyebrow: { zh: "ElfUI 3.0", en: "ElfUI 3.0" },
  h1: { zh: "更智能的设计系统", en: "A smarter design system" },
  h2: { zh: "产品能力", en: "Product capabilities" },
  h3: { zh: "设计令牌", en: "Design tokens" },
  h4: { zh: "深色主题", en: "Dark theme" },
  h5: { zh: "开始使用", en: "Get started" },
  h6: { zh: "版本 3.0", en: "Version 3.0" },
});

const code = `<div class="heading-suite heading-suite-brand">
  <section class="heading-suite-section">
    <span class="heading-suite-meta">Brand · display scale · gradient h1 · accent underline</span>
    <elf-heading family="brand" level="1" eyebrow="ElfUI 3.0">A smarter design system</elf-heading>
    <elf-heading family="brand" level="2" numbered accent>Product capabilities</elf-heading>
    <elf-heading family="brand" level="3">Design tokens</elf-heading>
    <elf-heading family="brand" level="4">Dark theme</elf-heading>
    <elf-heading family="brand" level="5">Get started</elf-heading>
    <elf-heading family="brand" level="6">Version 3.0</elf-heading>
  </section>
</div>`;

const script = `// brand 套装的 h1 默认渐变文字，gradient=false 可关闭；accent 渲染为渐变下划线。`;

defineStyle(styles);

const PageHeadingEx4 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="heading-suite-status">${t("status")}</span>
    <div class="heading-suite heading-suite-brand">
      <section class="heading-suite-section">
        <span class="heading-suite-meta">${t("meta")}</span>
        <elf-heading family="brand" level="1" eyebrow="${t("eyebrow")}">${t("h1")}</elf-heading>
        <elf-heading family="brand" level="2" numbered accent>${t("h2")}</elf-heading>
        <elf-heading family="brand" level="3">${t("h3")}</elf-heading>
        <elf-heading family="brand" level="4">${t("h4")}</elf-heading>
        <elf-heading family="brand" level="5">${t("h5")}</elf-heading>
        <elf-heading family="brand" level="6">${t("h6")}</elf-heading>
      </section>
    </div>
  </elf-playground>
`);

export { PageHeadingEx4 };
