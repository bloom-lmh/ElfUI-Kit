import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "标题套装 · 极简", en: "Heading suite · Minimal" },
  status: {
    zh: "minimal · 轻字重 · 细分隔线 · 留白",
    en: "minimal · Light weights · Hairlines · Whitespace",
  },
  meta: {
    zh: "工作台、笔记与安静的内容页可直接使用。",
    en: "Drop into workbenches, notes, and quiet content pages.",
  },
  h1: { zh: "工作台", en: "Workbench" },
  h2: { zh: "今日任务", en: "Today's tasks" },
  h3: { zh: "设计评审", en: "Design review" },
  h4: { zh: "发布检查", en: "Release checklist" },
  h5: { zh: "状态", en: "Status" },
  h6: { zh: "更新于 5 分钟前", en: "Updated 5 minutes ago" },
});

const code = `<div class="heading-suite heading-suite-minimal">
  <section class="heading-suite-section">
    <span class="heading-suite-meta">Minimal · light weights · hairline accents</span>
    <elf-heading family="minimal" level="1">Workbench</elf-heading>
    <elf-heading family="minimal" level="2" numbered accent>Today's tasks</elf-heading>
    <elf-heading family="minimal" level="3">Design review</elf-heading>
    <elf-heading family="minimal" level="4">Release checklist</elf-heading>
    <elf-heading family="minimal" level="5">Status</elf-heading>
    <elf-heading family="minimal" level="6">Updated 5 minutes ago</elf-heading>
  </section>
</div>`;

const script = `// minimal 套装的 accent 渲染为标题下方的短细分隔线，编号为浅色纯文本。`;

defineStyle(styles);

const PageHeadingEx6 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="heading-suite-status">${t("status")}</span>
    <div class="heading-suite heading-suite-minimal">
      <section class="heading-suite-section">
        <span class="heading-suite-meta">${t("meta")}</span>
        <elf-heading family="minimal" level="1">${t("h1")}</elf-heading>
        <elf-heading family="minimal" level="2" numbered accent>${t("h2")}</elf-heading>
        <elf-heading family="minimal" level="3">${t("h3")}</elf-heading>
        <elf-heading family="minimal" level="4">${t("h4")}</elf-heading>
        <elf-heading family="minimal" level="5">${t("h5")}</elf-heading>
        <elf-heading family="minimal" level="6">${t("h6")}</elf-heading>
      </section>
    </div>
  </elf-playground>
`);

export { PageHeadingEx6 };
