import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "标题套装 · 编辑杂志", en: "Heading suite · Editorial" },
  status: {
    zh: "editorial · 衬线 · 斜体章节 · 1. 编号",
    en: "editorial · Serif · Italic chapters · 1. Numbering",
  },
  meta: {
    zh: "文章、发布说明与杂志式页面可直接使用。",
    en: "Drop into articles, release notes, and magazine-style pages.",
  },
  h1: { zh: "设计为何重要", en: "Why design matters" },
  h2: { zh: "原则与方法", en: "Principles and methods" },
  h3: { zh: "从问题开始", en: "Start from the problem" },
  h4: { zh: "验证与迭代", en: "Validate and iterate" },
  h5: { zh: "记录", en: "Record" },
  h6: { zh: "第 4 期 · 2026", en: "Issue 04 · 2026" },
  eyebrow: { zh: "第 4 期 · 2026", en: "Issue 04 · 2026" },
});

const code = `<div class="heading-suite heading-suite-editorial">
  <section class="heading-suite-section">
    <span class="heading-suite-meta">Editorial · serif · italic h2 · numbered</span>
    <elf-heading family="editorial" level="1" eyebrow="Issue 04 · 2026">Why design matters</elf-heading>
    <elf-heading family="editorial" level="2" numbered>Principles and methods</elf-heading>
    <elf-heading family="editorial" level="3" accent>Start from the problem</elf-heading>
    <elf-heading family="editorial" level="4">Validate and iterate</elf-heading>
    <elf-heading family="editorial" level="5">Record</elf-heading>
    <elf-heading family="editorial" level="6">Further reading</elf-heading>
  </section>
</div>`;

const script = `// editorial 套装的 h2 默认为斜体章节强调，h5/h6 渲染为小帽。
// eyebrow 提供眉题，accent 绘制细强调条，numbered 自动按 1.、2. 编号。`;

defineStyle(styles);

const PageHeadingEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="heading-suite-status">${t("status")}</span>
    <div class="heading-suite heading-suite-editorial">
      <section class="heading-suite-section">
        <span class="heading-suite-meta">${t("meta")}</span>
        <elf-heading family="editorial" level="1" eyebrow="${t("eyebrow")}">${t("h1")}</elf-heading>
        <elf-heading family="editorial" level="2" numbered>${t("h2")}</elf-heading>
        <elf-heading family="editorial" level="3" accent>${t("h3")}</elf-heading>
        <elf-heading family="editorial" level="4">${t("h4")}</elf-heading>
        <elf-heading family="editorial" level="5">${t("h5")}</elf-heading>
        <elf-heading family="editorial" level="6">${t("h6")}</elf-heading>
      </section>
    </div>
  </elf-playground>
`);

export { PageHeadingEx2 };
