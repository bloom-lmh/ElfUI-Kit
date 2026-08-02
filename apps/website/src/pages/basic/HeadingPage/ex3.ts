import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "标题族 · 开发者终端", en: "Heading family · Developer terminal" },
  status: {
    zh: "Markdown # 前缀 · 1. 编号标题 · - 无编号标题",
    en: "Markdown # prefixes · 1. Numbered · - Unnumbered",
  },
  hierarchy: { zh: "Markdown 层级", en: "Markdown hierarchy" },
  numbered: { zh: "有序列表", en: "Ordered list" },
  unnumbered: { zh: "无序列表", en: "Unordered list" },
  h1: { zh: "项目文档", en: "Project docs" },
  h2: { zh: "快速开始", en: "Quick start" },
  h3: { zh: "安装依赖", en: "Install dependencies" },
  h4: { zh: "启动开发服务器", en: "Start the dev server" },
  h5: { zh: "环境变量", en: "Environment variables" },
  h6: { zh: "已知限制", en: "Known limits" },
  one: { zh: "检查版本", en: "Check versions" },
  two: { zh: "运行测试", en: "Run tests" },
  three: { zh: "构建产物", en: "Build output" },
  note: { zh: "调试提示", en: "Debug tip" },
  reference: { zh: "参考链接", en: "Reference links" },
});

const code = `<div class="heading-family heading-family-terminal">
  <section class="heading-family-section">
    <span class="heading-family-label"># ## ### #### ##### ######</span>
    <elf-heading level="1" variant="page">Project docs</elf-heading>
    <elf-heading level="2" variant="section">Quick start</elf-heading>
    <elf-heading level="3" variant="subsection">Install dependencies</elf-heading>
    <elf-heading level="4" variant="card">Start the dev server</elf-heading>
    <elf-heading level="5" variant="label">Environment variables</elf-heading>
    <elf-heading level="6" variant="caption">Known limits</elf-heading>
  </section>
  <section class="heading-family-section">
    <span class="heading-family-label">1. Ordered list</span>
    <ol class="heading-family-ordered">
      <li><elf-heading level="3" variant="subsection">Check versions</elf-heading></li>
      <li><elf-heading level="3" variant="subsection">Run tests</elf-heading></li>
      <li><elf-heading level="3" variant="subsection">Build output</elf-heading></li>
    </ol>
  </section>
  <section class="heading-family-section">
    <span class="heading-family-label">- Unordered list</span>
    <ul class="heading-family-list">
      <li><elf-heading level="4" variant="card">Debug tip</elf-heading></li>
      <li><elf-heading level="4" variant="card">Reference links</elf-heading></li>
    </ul>
  </section>
</div>`;

const script = `// Reuse .heading-family-terminal for dark, mono developer docs.
// H1-H6 automatically render Markdown # prefixes before the title text.`;

defineStyle(styles);

const PageHeadingEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="heading-family-status">${t("status")}</span>
    <div class="heading-family heading-family-terminal">
      <section class="heading-family-section">
        <span class="heading-family-label"># ## ### #### ##### ######</span>
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

export { PageHeadingEx3 };
