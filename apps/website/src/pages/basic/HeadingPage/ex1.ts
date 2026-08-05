import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "标题套装 · 文档指南", en: "Heading suite · Guide" },
  status: {
    zh: "guide · H1-H6 · 自动序号 · 胶囊小节",
    en: "guide · H1-H6 · Auto numbering · Chip subsections",
  },
  meta: {
    zh: "安装、快速入门、配置等指南页面可直接使用，无需重新设计标题样式。",
    en: "Drop into installation, quick start, and configuration pages without redesigning headings.",
  },
  h1: { zh: "安装组件库", en: "Install the component library" },
  s1: { zh: "环境要求", en: "Requirements" },
  s1a: { zh: "浏览器基线", en: "Browser baseline" },
  s1b: { zh: "包管理器", en: "Package manager" },
  s2: { zh: "创建项目", en: "Create a project" },
  c1: { zh: "官方脚手架", en: "Official scaffold" },
  c2: { zh: "最小项目", en: "Minimal project" },
  l1: { zh: "当前状态", en: "Current status" },
  l2: { zh: "5 分钟前更新", en: "Updated 5 minutes ago" },
  markdownLabel: { zh: "Markdown 转换", en: "Markdown conversion" },
  markdownMeta: {
    zh: "- 无序 · 1. 有序 · 自动编号",
    en: "- Bullet · 1. Ordered · Auto numbered",
  },
  m1: { zh: "规划", en: "Plan" },
  m2: { zh: "构建", en: "Build" },
  m3: { zh: "发布", en: "Ship" },
  m4: { zh: "说明", en: "Notes" },
  m5: { zh: "参考", en: "References" },
});

const code = `<div class="heading-suite heading-suite-guide">
  <section class="heading-suite-section">
    <span class="heading-suite-meta">Guide · H1-H6 · numbered h2 · chip h3</span>
    <elf-heading family="guide" level="1">Install the component library</elf-heading>
    <elf-heading family="guide" level="2" numbered>Requirements</elf-heading>
    <elf-heading family="guide" level="3">Browser baseline</elf-heading>
    <elf-heading family="guide" level="3">Package manager</elf-heading>
    <elf-heading family="guide" level="2" numbered>Create a project</elf-heading>
    <elf-heading family="guide" level="4">Official scaffold</elf-heading>
    <elf-heading family="guide" level="4">Minimal project</elf-heading>
    <elf-heading family="guide" level="5">Current status</elf-heading>
    <elf-heading family="guide" level="6">Updated 5 minutes ago</elf-heading>
  </section>
  <section class="heading-suite-section">
    <span class="heading-suite-meta">Markdown · - bullet · 1. ordered</span>
    <elf-heading family="guide" level="3" markdown="ordered">Plan</elf-heading>
    <elf-heading family="guide" level="3" markdown="ordered">Build</elf-heading>
    <elf-heading family="guide" level="3" markdown="ordered">Ship</elf-heading>
    <elf-heading family="guide" level="3" markdown="bullet">Notes</elf-heading>
    <elf-heading family="guide" level="3" markdown="bullet">References</elf-heading>
  </section>
</div>`;

const script = `// guide 套装的 level 2 默认带主色强调条，level 3 默认渲染为胶囊小节。
// numbered 在同一页面/容器内按层级自动递增，无需手工编号。
// markdown="ordered" 自动生成 1. 2. 3.，markdown="bullet" 渲染 - 前缀；
// markdown 模式下 guide 的 level 3 不再套胶囊。`;

defineStyle(styles);

const PageHeadingEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="heading-suite-status">${t("status")}</span>
    <div class="heading-suite heading-suite-guide">
      <section class="heading-suite-section">
        <span class="heading-suite-meta">${t("meta")}</span>
        <elf-heading family="guide" level="1">${t("h1")}</elf-heading>
        <elf-heading family="guide" level="2" numbered>${t("s1")}</elf-heading>
        <elf-heading family="guide" level="3">${t("s1a")}</elf-heading>
        <elf-heading family="guide" level="3">${t("s1b")}</elf-heading>
        <elf-heading family="guide" level="2" numbered>${t("s2")}</elf-heading>
        <elf-heading family="guide" level="4">${t("c1")}</elf-heading>
        <elf-heading family="guide" level="4">${t("c2")}</elf-heading>
        <elf-heading family="guide" level="5">${t("l1")}</elf-heading>
        <elf-heading family="guide" level="6">${t("l2")}</elf-heading>
      </section>
      <section class="heading-suite-section">
        <span class="heading-suite-meta">${t("markdownLabel")} · ${t("markdownMeta")}</span>
        <elf-heading family="guide" level="3" markdown="ordered">${t("m1")}</elf-heading>
        <elf-heading family="guide" level="3" markdown="ordered">${t("m2")}</elf-heading>
        <elf-heading family="guide" level="3" markdown="ordered">${t("m3")}</elf-heading>
        <elf-heading family="guide" level="3" markdown="bullet">${t("m4")}</elf-heading>
        <elf-heading family="guide" level="3" markdown="bullet">${t("m5")}</elf-heading>
      </section>
    </div>
  </elf-playground>
`);

export { PageHeadingEx1 };
