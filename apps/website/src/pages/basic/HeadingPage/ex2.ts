import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "标题族 · 编辑杂志", en: "Heading family · Editorial serif" },
  status: {
    zh: "衬线字体 · 斜体章节 · 1. 编号标题 · - 无编号标题",
    en: "Serif · Italic sections · 1. Numbered · - Unnumbered",
  },
  hierarchy: { zh: "文章层级", en: "Article hierarchy" },
  numbered: { zh: "章节编号", en: "Numbered chapters" },
  unnumbered: { zh: "侧栏条目", en: "Sidebar entries" },
  h1: { zh: "设计为何重要", en: "Why design matters" },
  h2: { zh: "原则与方法", en: "Principles and methods" },
  h3: { zh: "从问题开始", en: "Start from the problem" },
  h4: { zh: "验证与迭代", en: "Validate and iterate" },
  h5: { zh: "记录", en: "Record" },
  h6: { zh: "第 4 期 · 2026", en: "Issue 04 · 2026" },
  one: { zh: "读者", en: "Readers" },
  two: { zh: "内容", en: "Content" },
  three: { zh: "节奏", en: "Rhythm" },
  note: { zh: "编辑手记", en: "Editor's note" },
  reference: { zh: "延伸阅读", en: "Further reading" },
});

const code = `<div class="heading-family heading-family-editorial">
  <section class="heading-family-section">
    <span class="heading-family-label">H1 · H2 · H3 · H4 · H5 · H6</span>
    <elf-heading level="1" variant="page">Why design matters</elf-heading>
    <elf-heading level="2" variant="section">Principles and methods</elf-heading>
    <elf-heading level="3" variant="subsection">Start from the problem</elf-heading>
    <elf-heading level="4" variant="card">Validate and iterate</elf-heading>
    <elf-heading level="5" variant="label">Record</elf-heading>
    <elf-heading level="6" variant="caption">Issue 04 · 2026</elf-heading>
  </section>
  <section class="heading-family-section">
    <span class="heading-family-label">1. Numbered chapters</span>
    <ol class="heading-family-ordered">
      <li><elf-heading level="3" variant="subsection">Readers</elf-heading></li>
      <li><elf-heading level="3" variant="subsection">Content</elf-heading></li>
      <li><elf-heading level="3" variant="subsection">Rhythm</elf-heading></li>
    </ol>
  </section>
  <section class="heading-family-section">
    <span class="heading-family-label">- Sidebar entries</span>
    <ul class="heading-family-list">
      <li><elf-heading level="4" variant="card">Editor's note</elf-heading></li>
      <li><elf-heading level="4" variant="card">Further reading</elf-heading></li>
    </ul>
  </section>
</div>`;

const script = `// Reuse .heading-family-editorial for serif editorial pages.
// H2 uses an italic accent; H5/H6 render as small caps.`;

defineStyle(styles);

const PageHeadingEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="heading-family-status">${t("status")}</span>
    <div class="heading-family heading-family-editorial">
      <section class="heading-family-section">
        <span class="heading-family-label">${t("hierarchy")} · H1-H6</span>
        <elf-heading level="1" variant="page">${t("h1")}</elf-heading>
        <elf-heading level="2" variant="section">${t("h2")}</elf-heading>
        <elf-heading level="3" variant="subsection">${t("h3")}</elf-heading>
        <elf-heading level="4" variant="card">${t("h4")}</elf-heading>
        <elf-heading level="5" variant="label">${t("h5")}</elf-heading>
        <elf-heading level="6" variant="caption">${t("h6")}</elf-heading>
      </section>
      <section class="heading-family-section">
        <span class="heading-family-label">1. ${t("numbered")}</span>
        <ol class="heading-family-ordered">
          <li><elf-heading level="3" variant="subsection">${t("one")}</elf-heading></li>
          <li><elf-heading level="3" variant="subsection">${t("two")}</elf-heading></li>
          <li><elf-heading level="3" variant="subsection">${t("three")}</elf-heading></li>
        </ol>
      </section>
      <section class="heading-family-section">
        <span class="heading-family-label">- ${t("unnumbered")}</span>
        <ul class="heading-family-list">
          <li><elf-heading level="4" variant="card">${t("note")}</elf-heading></li>
          <li><elf-heading level="4" variant="card">${t("reference")}</elf-heading></li>
        </ul>
      </section>
    </div>
  </elf-playground>
`);

export { PageHeadingEx2 };
