import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  title: { zh: "升级指南", en: "Upgrade guide" },
  description: {
    zh: "升级分为版本对齐、API 迁移、组件回归和真实浏览器验收四步。先让工具链一致，再处理源码，避免用组件侧兼容掩盖框架问题。",
    en: "Upgrade in four stages: version alignment, API migration, component regression, and real-browser acceptance. Align the toolchain first so component workarounds never hide framework defects.",
  },
  alignTitle: { zh: "一、锁定版本", en: "1. Align versions" },
  alignBody: {
    zh: "Core、Compiler 和 Vite Plugin 必须使用完全相同的 beta 版本。",
    en: "Core, Compiler, and the Vite Plugin must use exactly the same beta version.",
  },
  migrateTitle: { zh: "二、迁移 API", en: "2. Migrate APIs" },
  migrateBody: {
    zh: "使用 defineHtml/defineStyle 字符串、onMounted/onUnmounted、useComputed 和 useEffect，删除旧 tagged template 与生命周期别名。",
    en: "Use defineHtml/defineStyle strings, onMounted/onUnmounted, useComputed, and useEffect; remove legacy tagged templates and lifecycle aliases.",
  },
  verifyTitle: { zh: "三、运行门禁", en: "3. Run quality gates" },
  verifyBody: {
    zh: "先运行迁移扫描和目标测试，再执行类型检查、库构建与应用构建。",
    en: "Run the migration scan and focused tests first, followed by type checking, library build, and application build.",
  },
  browserTitle: { zh: "四、浏览器验收", en: "4. Verify in a browser" },
  browserBody: {
    zh: "Provider、Teleport、弹层、焦点、拖拽和滚动行为必须通过真实浏览器验证。",
    en: "Provider, Teleport, overlay, focus, drag, and scrolling behavior require real-browser verification.",
  },
  policy: {
    zh: "如果问题能够缩小为框架最小复现，应提交框架修复，不在组件内部增加轮询、延时或全局桥接。",
    en: "When a defect reduces to a framework reproduction, fix the framework instead of adding polling, delays, or global bridges inside components.",
  },
});

defineStyle(articleStyles);

const PageUpgradeGuide = defineHtml(`
  <elf-container class="docs-article">
    <h1>${t("title")}</h1>
    <p class="page-lead">${t("description")}</p>

    <div class="article-grid">
      <section class="article-card"><h2>${t("alignTitle")}</h2><p>${t("alignBody")}</p></section>
      <section class="article-card"><h2>${t("migrateTitle")}</h2><p>${t("migrateBody")}</p></section>
      <section class="article-card"><h2>${t("verifyTitle")}</h2><p>${t("verifyBody")}</p></section>
      <section class="article-card"><h2>${t("browserTitle")}</h2><p>${t("browserBody")}</p></section>
    </div>

    <pre><code>node scripts/check-beta8-migration.mjs
pnpm exec vitest run path/to/component.test.ts --maxWorkers=1
pnpm exec tsc -p tsconfig.lib.json --noEmit
pnpm build</code></pre>

    <p class="article-note">${t("policy")}</p>
  </elf-container>
`);

export { PageUpgradeGuide };
