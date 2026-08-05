import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "标题套装 · 开发者终端", en: "Heading suite · Developer terminal" },
  status: {
    zh: "terminal · 等宽 · # 前缀 · 自动序号",
    en: "terminal · Mono · # prefixes · Auto numbering",
  },
  meta: {
    zh: "API 参考与 CLI 文档可直接使用，Markdown # 前缀自动按层级生成。",
    en: "Drop into API references and CLI documentation; Markdown # prefixes follow the level automatically.",
  },
  h1: { zh: "API 参考", en: "API reference" },
  s1: { zh: "开始使用", en: "Getting started" },
  s2: { zh: "配置选项", en: "Configuration" },
  c1: { zh: "安装依赖", en: "Install dependencies" },
  c2: { zh: "启动服务", en: "Start the server" },
  h5: { zh: "环境变量", en: "Environment variables" },
  h6: { zh: "已知限制", en: "Known limits" },
});

const code = `<div class="heading-suite heading-suite-terminal">
  <section class="heading-suite-section">
    <span class="heading-suite-meta">Terminal · mono · # prefixes · numbered</span>
    <elf-heading family="terminal" level="1">API reference</elf-heading>
    <elf-heading family="terminal" level="2" numbered>Getting started</elf-heading>
    <elf-heading family="terminal" level="3" chip>Install dependencies</elf-heading>
    <elf-heading family="terminal" level="3" chip>Start the server</elf-heading>
    <elf-heading family="terminal" level="2" numbered>Configuration</elf-heading>
    <elf-heading family="terminal" level="5">Environment variables</elf-heading>
    <elf-heading family="terminal" level="6">Known limits</elf-heading>
  </section>
</div>`;

const script = `// terminal 套装的每个层级自动渲染 Markdown # 前缀；使用 numbered 时前缀切换为等宽序号。`;

defineStyle(styles);

const PageHeadingEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="heading-suite-status">${t("status")}</span>
    <div class="heading-suite heading-suite-terminal">
      <section class="heading-suite-section">
        <span class="heading-suite-meta">${t("meta")}</span>
        <elf-heading family="terminal" level="1">${t("h1")}</elf-heading>
        <elf-heading family="terminal" level="2" numbered>${t("s1")}</elf-heading>
        <elf-heading family="terminal" level="3" chip>${t("c1")}</elf-heading>
        <elf-heading family="terminal" level="3" chip>${t("c2")}</elf-heading>
        <elf-heading family="terminal" level="2" numbered>${t("s2")}</elf-heading>
        <elf-heading family="terminal" level="5">${t("h5")}</elf-heading>
        <elf-heading family="terminal" level="6">${t("h6")}</elf-heading>
      </section>
    </div>
  </elf-playground>
`);

export { PageHeadingEx3 };
