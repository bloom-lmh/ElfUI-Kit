import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  title: { zh: "安装", en: "Installation" },
  description: {
    zh: "ElfUI Kit 以原生 Custom Elements 发布。使用组件只需安装 Kit；编写 ElfUI 宏组件时，再让 Core、Compiler 与 Vite Plugin 保持同一版本。",
    en: "ElfUI Kit ships as native Custom Elements. Install the Kit to consume components; when authoring ElfUI macro components, keep Core, Compiler, and the Vite Plugin on the same version.",
  },
  packageTitle: { zh: "安装组件库", en: "Install the component library" },
  packageBody: {
    zh: "主入口注册稳定组件、Provider、服务和公开类型。",
    en: "The main entry registers stable components, Providers, services, and public types.",
  },
  entryTitle: { zh: "应用入口", en: "Application entry" },
  entryBody: {
    zh: "在应用入口导入一次组件库；工具类样式是可选入口。",
    en: "Import the component library once in the application entry; utility styles are optional.",
  },
  authoringTitle: { zh: "宏组件开发", en: "Macro-component authoring" },
  authoringBody: {
    zh: "只有直接编写 defineHtml 组件的工程才需要安装编译器与 Vite 插件。",
    en: "Only projects that author defineHtml components need the compiler and Vite plugin.",
  },
  note: {
    zh: "不要混用不同 beta 版本的 Core、Compiler 与 Vite Plugin；公开 API 可能在 beta 阶段快速演进。",
    en: "Do not mix beta versions of Core, Compiler, and the Vite Plugin; public APIs can evolve quickly during beta.",
  },
});

defineStyle(articleStyles);

const PageInstallation = defineHtml(`
  <elf-container class="docs-article">
    <h1>${t("title")}</h1>
    <p class="page-lead">${t("description")}</p>

    <div class="article-grid">
      <section class="article-card">
        <span class="status">@elfui/kit</span>
        <h2>${t("packageTitle")}</h2>
        <p>${t("packageBody")}</p>
        <pre><code>pnpm add @elfui/kit</code></pre>
      </section>

      <section class="article-card">
        <span class="status">main.ts</span>
        <h2>${t("entryTitle")}</h2>
        <p>${t("entryBody")}</p>
        <pre><code>import "@elfui/kit";
import "@elfui/kit/styles/utilities.css"; // optional</code></pre>
      </section>
    </div>

    <section class="article-card">
      <span class="status">beta.20</span>
      <h2>${t("authoringTitle")}</h2>
      <p>${t("authoringBody")}</p>
      <pre><code>pnpm add @elfui/core@0.1.0-beta.20
pnpm add -D @elfui/compiler@0.1.0-beta.20 @elfui/vite-plugin@0.1.0-beta.20</code></pre>
    </section>

    <p class="article-note">${t("note")}</p>
  </elf-container>
`);

export { PageInstallation };
