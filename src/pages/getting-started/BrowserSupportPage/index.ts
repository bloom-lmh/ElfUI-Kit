import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  title: { zh: "浏览器支持", en: "Browser support" },
  description: {
    zh: "ElfUI 面向支持 Custom Elements、Shadow DOM、CSS 自定义属性和现代观察器 API 的常青浏览器。正式支持范围以自动化浏览器矩阵为准。",
    en: "ElfUI targets evergreen browsers with Custom Elements, Shadow DOM, CSS custom properties, and modern observer APIs. The automated browser matrix is the source of truth for formal support.",
  },
  target: { zh: "目标", en: "Target" },
  status: { zh: "策略", en: "Policy" },
  chromium: { zh: "当前及前两个稳定版本", en: "Current and previous two stable releases" },
  firefox: { zh: "当前及前两个稳定版本", en: "Current and previous two stable releases" },
  safari: { zh: "Safari 16.4 及以上，持续加入真实设备门禁", en: "Safari 16.4+, with continuing real-device coverage" },
  mobile: { zh: "对应系统 WebView 与移动浏览器", en: "Matching system WebViews and mobile browsers" },
  unsupported: { zh: "不支持 Internet Explorer 和缺少 Shadow DOM 的旧浏览器。", en: "Internet Explorer and legacy browsers without Shadow DOM are not supported." },
  requirements: { zh: "平台能力", en: "Platform capabilities" },
  requirementsBody: {
    zh: "Custom Elements、Shadow DOM、ResizeObserver、IntersectionObserver、AbortController、Pointer Events 和 CSS color-mix 是当前实现的重要基础。",
    en: "Custom Elements, Shadow DOM, ResizeObserver, IntersectionObserver, AbortController, Pointer Events, and CSS color-mix are important implementation foundations.",
  },
});

defineStyle(articleStyles);

const PageBrowserSupport = defineHtml(`
  <elf-container class="docs-article">
    <h1>${t("title")}</h1>
    <p class="page-lead">${t("description")}</p>

    <table class="support-table">
      <thead><tr><th>Browser</th><th>${t("target")}</th><th>${t("status")}</th></tr></thead>
      <tbody>
        <tr><td>Chrome / Edge</td><td>${t("chromium")}</td><td>Target</td></tr>
        <tr><td>Firefox</td><td>${t("firefox")}</td><td>Target</td></tr>
        <tr><td>Safari</td><td>${t("safari")}</td><td>Target</td></tr>
        <tr><td>iOS / Android</td><td>${t("mobile")}</td><td>Target</td></tr>
      </tbody>
    </table>

    <div class="article-grid">
      <section class="article-card">
        <h2>${t("requirements")}</h2>
        <p>${t("requirementsBody")}</p>
      </section>
      <section class="article-card">
        <h2>Legacy</h2>
        <p>${t("unsupported")}</p>
      </section>
    </div>
  </elf-container>
`);

export { PageBrowserSupport };
