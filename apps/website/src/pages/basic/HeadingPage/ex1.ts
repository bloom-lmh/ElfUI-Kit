import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "标题族 · 文档蓝", en: "Heading family · Documentation blue" },
  status: {
    zh: "H1-H6 · 1. 编号标题 · - 无编号标题",
    en: "H1-H6 · 1. Numbered headings · - Unnumbered headings",
  },
  hierarchy: { zh: "层级标题", en: "Hierarchy" },
  numbered: { zh: "编号标题", en: "Numbered headings" },
  unnumbered: { zh: "无编号标题", en: "Unnumbered headings" },
  h1: { zh: "产品智能", en: "Product intelligence" },
  h2: { zh: "工作区", en: "Workspace" },
  h3: { zh: "项目", en: "Projects" },
  h4: { zh: "当前项目", en: "Active project" },
  h5: { zh: "状态", en: "Status" },
  h6: { zh: "5 分钟前更新", en: "Updated 5 minutes ago" },
  one: { zh: "规划", en: "Plan" },
  two: { zh: "构建", en: "Build" },
  three: { zh: "发布", en: "Ship" },
  note: { zh: "说明", en: "Notes" },
  reference: { zh: "参考", en: "References" },
});

const code = `<div class="heading-family heading-family-docs">
  <section class="heading-family-section">
    <span class="heading-family-label">H1 · H2 · H3 · H4 · H5 · H6</span>
    <elf-heading level="1" variant="page" accent>Product intelligence</elf-heading>
    <elf-heading level="2" variant="section" index="01">Workspace</elf-heading>
    <elf-heading level="3" variant="subsection">Projects</elf-heading>
    <elf-heading level="4" variant="card">Active project</elf-heading>
    <elf-heading level="5" variant="label">Status</elf-heading>
    <elf-heading level="6" variant="caption">Updated 5 minutes ago</elf-heading>
  </section>
  <section class="heading-family-section">
    <span class="heading-family-label">1. Numbered headings</span>
    <ol class="heading-family-ordered">
      <li><elf-heading level="3" variant="subsection">Plan</elf-heading></li>
      <li><elf-heading level="3" variant="subsection">Build</elf-heading></li>
      <li><elf-heading level="3" variant="subsection">Ship</elf-heading></li>
    </ol>
  </section>
  <section class="heading-family-section">
    <span class="heading-family-label">- Unnumbered headings</span>
    <ul class="heading-family-list">
      <li><elf-heading level="4" variant="card">Notes</elf-heading></li>
      <li><elf-heading level="4" variant="card">References</elf-heading></li>
    </ul>
  </section>
</div>`;

const script = `// Reuse .heading-family-docs as the blue documentation heading system.
// Numbered headings use ol.heading-family-ordered; bullets use ul.heading-family-list.`;

defineStyle(styles);

const PageHeadingEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="heading-family-status">${t("status")}</span>
    <div class="heading-family heading-family-docs">
      <section class="heading-family-section">
        <span class="heading-family-label">${t("hierarchy")} · H1-H6</span>
        <elf-heading level="1" variant="page" accent>${t("h1")}</elf-heading>
        <elf-heading level="2" variant="section" index="01">${t("h2")}</elf-heading>
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

export { PageHeadingEx1 };
