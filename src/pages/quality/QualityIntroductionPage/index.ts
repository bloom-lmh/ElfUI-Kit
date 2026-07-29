import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  title: { zh: "质量", en: "Quality" },
  description: {
    zh: "质量不是发布前的最后一步，而是组件契约的一部分。本章集中说明可访问性、测试、性能、兼容性和发布门禁。",
    en: "Quality is part of the component contract, not a final pre-release step. This chapter covers accessibility, testing, performance, compatibility, and release gates.",
  },
  a11yTitle: { zh: "无障碍", en: "Accessibility" },
  a11yBody: {
    zh: "键盘操作、焦点管理、语义角色、可访问名称，以及 Shadow DOM 与浮层边界。",
    en: "Keyboard operation, focus management, semantic roles, accessible names, and Shadow DOM or overlay boundaries.",
  },
  testingTitle: { zh: "测试策略", en: "Testing strategy" },
  testingBody: {
    zh: "组件契约测试、交互回归、类型检查、生产构建和真实浏览器截图共同组成质量门禁。",
    en: "Component contract tests, interaction regressions, type checking, production builds, and real-browser screenshots form the quality gate.",
  },
  performanceTitle: { zh: "性能", en: "Performance" },
  performanceBody: {
    zh: "关注长列表、频繁状态更新、浮层定位和事件监听，避免用演示数据掩盖真实瓶颈。",
    en: "Focus on long lists, frequent state updates, overlay positioning, and event listeners without hiding real bottlenecks behind small demo data.",
  },
  compatibilityTitle: { zh: "兼容与发布", en: "Compatibility and release" },
  compatibilityBody: {
    zh: "框架版本必须对齐；公开 API、类型、案例、迁移说明和浏览器基线同步更新。",
    en: "Framework versions must align, while public APIs, types, demos, migration notes, and browser baselines evolve together.",
  },
  note: {
    zh: "质量章节只记录可验证的承诺。尚未建立自动化门禁的能力会明确标注为计划，而不是标记为支持。",
    en: "The Quality chapter documents only verifiable commitments. Capabilities without automated gates are labeled as planned, not supported.",
  },
});

defineStyle(articleStyles);

const PageQualityIntroduction = defineHtml(`
  <elf-container class="docs-article">
    <h1>${t("title")}</h1>
    <p class="page-lead">${t("description")}</p>

    <div class="article-grid">
      <section class="article-card">
        <span class="status">a11y</span>
        <h2>${t("a11yTitle")}</h2>
        <p>${t("a11yBody")}</p>
        <elf-link href="#/quality/accessibility">Accessibility →</elf-link>
      </section>
      <section class="article-card">
        <span class="status">tests</span>
        <h2>${t("testingTitle")}</h2>
        <p>${t("testingBody")}</p>
      </section>
      <section class="article-card">
        <span class="status">runtime</span>
        <h2>${t("performanceTitle")}</h2>
        <p>${t("performanceBody")}</p>
      </section>
      <section class="article-card">
        <span class="status">release gate</span>
        <h2>${t("compatibilityTitle")}</h2>
        <p>${t("compatibilityBody")}</p>
      </section>
    </div>

    <p class="article-note">${t("note")}</p>
  </elf-container>
`);

export { PageQualityIntroduction };
