import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  title: { zh: "常见问题", en: "Frequently asked questions" },
  description: {
    zh: "这里集中回答安装、注册、主题、弹层、版本和 SSR 中最容易遇到的问题。",
    en: "Answers to common questions about installation, registration, themes, overlays, versions, and SSR.",
  },
  registerQ: { zh: "为什么页面上显示未知的 elf-* 标签？", en: "Why does the page show an unknown elf-* element?" },
  registerA: {
    zh: "确认应用入口已经导入 @elfui/kit。组件库通过该入口注册公开 Custom Elements。",
    en: "Make sure the application entry imports @elfui/kit. The package registers public Custom Elements from that entry.",
  },
  styleQ: { zh: "为什么组件颜色和预期不同？", en: "Why do component colors differ from the expected theme?" },
  styleA: {
    zh: "检查组件是否位于 ConfigProvider 或 ThemeProvider 作用域中，并优先通过主题 token 定制，不要穿透 Shadow DOM。",
    en: "Check that the component is inside ConfigProvider or ThemeProvider. Customize semantic tokens instead of piercing Shadow DOM.",
  },
  overlayQ: { zh: "弹层挂到 body 后会丢失语言或主题吗？", en: "Do body-level overlays lose locale or theme context?" },
  overlayA: {
    zh: "不会。当前框架保留 Teleport 的逻辑父链、Provider 和 App 上下文；如果丢失，应提交框架最小复现。",
    en: "No. The framework preserves the Teleport logical parent, Provider, and App context. If context is lost, reduce it to a framework reproduction.",
  },
  versionQ: { zh: "为什么升级后 import 直接报错？", en: "Why do imports fail immediately after an upgrade?" },
  versionA: {
    zh: "beta 版本会删除旧 API。确保 Core、Compiler 和 Vite Plugin 版本一致，并按升级指南迁移。",
    en: "Beta releases can remove legacy APIs. Align Core, Compiler, and the Vite Plugin, then follow the upgrade guide.",
  },
  ssrQ: { zh: "SSR 中如何处理浏览器尺寸？", en: "How should viewport size be handled during SSR?" },
  ssrA: {
    zh: "通过 ConfigProvider.display.ssr 提供初始尺寸，并把浏览器副作用放到 onMounted 中。",
    en: "Provide initial dimensions through ConfigProvider.display.ssr and keep browser side effects inside onMounted.",
  },
});

defineStyle(articleStyles);

const PageFaq = defineHtml(`
  <elf-container class="docs-article">
    <h1>${t("title")}</h1>
    <p class="page-lead">${t("description")}</p>

    <section class="article-card">
      <details open><summary>${t("registerQ")}</summary><p>${t("registerA")}</p></details>
      <details><summary>${t("styleQ")}</summary><p>${t("styleA")}</p></details>
      <details><summary>${t("overlayQ")}</summary><p>${t("overlayA")}</p></details>
      <details><summary>${t("versionQ")}</summary><p>${t("versionA")}</p></details>
      <details><summary>${t("ssrQ")}</summary><p>${t("ssrA")}</p></details>
    </section>
  </elf-container>
`);

export { PageFaq };
