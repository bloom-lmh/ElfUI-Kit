import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "工程契约", en: "Engineering contract" },
  title: { zh: "质量", en: "Quality" },
  description: {
    zh: "质量不是发布前补做的一轮检查，而是组件 API 的组成部分。ElfUI 用可验证门禁覆盖可访问性、行为、类型、构建、性能与浏览器边界。",
    en: "Quality is not a final inspection added before release; it is part of the component API. ElfUI uses verifiable gates for accessibility, behavior, types, builds, performance, and browser boundaries.",
  },
  promise: { zh: "记录原则", en: "Documentation rule" },
  promiseValue: { zh: "只写可验证承诺", en: "Document verifiable promises" },
  minimum: { zh: "最低门禁", en: "Minimum gate" },
  minimumValue: { zh: "测试 · 类型 · 构建", en: "Tests · types · build" },
  acceptance: { zh: "交互验收", en: "Interaction acceptance" },
  acceptanceValue: { zh: "真实浏览器 + 截图", en: "Real browser + screenshots" },
  ownershipTitle: { zh: "质量责任边界", en: "Quality ownership" },
  ownershipLead: {
    zh: "组件库负责通用交互与语义，应用负责业务内容和页面结构。边界明确后，问题才能进入正确层级修复。",
    en: "The library owns reusable interaction and semantics; the application owns business content and page structure. Clear ownership sends defects to the correct layer.",
  },
  area: { zh: "领域", en: "Area" },
  library: { zh: "ElfUI 负责", en: "ElfUI owns" },
  application: { zh: "应用负责", en: "Application owns" },
  keyboard: { zh: "键盘与焦点", en: "Keyboard and focus" },
  keyboardLibrary: { zh: "键位模型、焦点顺序、关闭后恢复、禁用态", en: "Key model, focus order, restoration, and disabled states" },
  keyboardApp: { zh: "合理的触发顺序与业务初始焦点", en: "Logical trigger order and business-specific initial focus" },
  semantics: { zh: "语义与内容", en: "Semantics and content" },
  semanticsLibrary: { zh: "role、aria 状态、表单关联和状态通知", en: "Roles, ARIA states, form association, and announcements" },
  semanticsApp: { zh: "标题层级、可访问名称、错误文案和替代文本", en: "Heading structure, accessible names, error copy, and alt text" },
  visuals: { zh: "视觉与主题", en: "Visuals and theme" },
  visualsLibrary: { zh: "对比度 token、聚焦环、减少动态效果", en: "Contrast tokens, focus rings, and reduced motion" },
  visualsApp: { zh: "品牌色组合、内容可读性和自定义样式回归", en: "Brand combinations, content readability, and custom-style regression" },
  performance: { zh: "性能", en: "Performance" },
  performanceLibrary: { zh: "列表虚拟化、监听清理、批量状态更新", en: "List virtualization, listener cleanup, and batched state updates" },
  performanceApp: { zh: "真实数据量、资源体积和业务渲染成本", en: "Real data volume, asset weight, and business rendering cost" },
  gatesTitle: { zh: "发布门禁", en: "Release gates" },
  gatesLead: {
    zh: "门禁按反馈速度排列。聚焦测试先发现局部问题，真实浏览器最后确认 DOM、焦点与视觉没有偏差。",
    en: "Gates are ordered by feedback speed. Focused tests catch local defects first; real browsers finally confirm DOM, focus, and visual behavior.",
  },
  contractTitle: { zh: "组件契约", en: "Component contract" },
  contractBody: { zh: "Props、Events、Expose、表单语义和边界状态都有聚焦测试。", en: "Focused tests cover Props, Events, Expose, form semantics, and boundary states." },
  staticTitle: { zh: "静态检查", en: "Static checks" },
  staticBody: { zh: "旧 API 扫描、严格类型与库声明生成必须通过。", en: "Legacy API scans, strict types, and library declarations must pass." },
  browserTitle: { zh: "浏览器验收", en: "Browser acceptance" },
  browserBody: { zh: "交互、控制台、语言泄漏、主题与关键截图必须验证。", en: "Verify interaction, console output, locale leakage, themes, and critical screenshots." },
  commandTitle: { zh: "本仓库基础命令", en: "Repository baseline commands" },
  commandLead: {
    zh: "新增能力至少运行聚焦测试、类型检查和生产构建；涉及交互和布局时必须增加浏览器验收。",
    en: "Every new capability runs focused tests, typecheck, and production build; interaction or layout work also requires browser acceptance.",
  },
  coverageTitle: { zh: "当前覆盖与待补齐", en: "Current coverage and gaps" },
  statusLabel: { zh: "状态", en: "Status" },
  currentGate: { zh: "当前门禁", en: "Current gate" },
  nextGate: { zh: "下一步", en: "Next gate" },
  active: { zh: "已执行", en: "Active" },
  partial: { zh: "部分覆盖", en: "Partial" },
  unitCurrent: { zh: "Vitest 聚焦/全量、类型检查、生产构建", en: "Focused/full Vitest, typecheck, and production build" },
  unitNext: { zh: "覆盖率趋势与变更影响分组", en: "Coverage trends and change-impact grouping" },
  a11yCurrent: { zh: "键盘、焦点、ARIA 的组件测试与页面验收", en: "Component tests and page acceptance for keyboard, focus, and ARIA" },
  a11yNext: { zh: "自动化 axe 与屏幕阅读器基线", en: "Automated axe and screen-reader baselines" },
  perfCurrent: { zh: "虚拟列表/表格场景与人工观察", en: "Virtual list/table scenarios and manual observation" },
  perfNext: { zh: "固定数据集、预算和回归阈值", en: "Fixed datasets, budgets, and regression thresholds" },
  browserCurrent: { zh: "Chromium 真实交互与截图", en: "Real Chromium interaction and screenshots" },
  browserNext: { zh: "Firefox、WebKit 与移动设备矩阵", en: "Firefox, WebKit, and mobile-device matrix" },
  honestyTitle: { zh: "质量声明必须诚实。", en: "Quality claims must remain honest." },
  honestyBody: {
    zh: "尚未建立自动化门禁的能力只能标记为部分覆盖或计划，不能写成稳定支持。",
    en: "Capabilities without automated gates must be labeled partial or planned, never stable support.",
  },
  nextTitle: { zh: "先从无障碍开始", en: "Start with accessibility" },
  nextBody: { zh: "了解组件库和应用分别要承担哪些键盘、焦点和语义责任。", en: "Learn which keyboard, focus, and semantic responsibilities belong to the library and the application." },
  accessibilityLink: { zh: "无障碍", en: "Accessibility" },
  browserLink: { zh: "浏览器支持", en: "Browser support" },
});

defineStyle(articleStyles);

const PageQualityIntroduction = defineHtml(`
  <elf-container class="docs-article">
    <span class="docs-kicker">${t("kicker")}</span>
    <h1>${t("title")}</h1>
    <p class="page-lead">${t("description")}</p>

    <div class="docs-summary">
      <div class="docs-summary-item">
        <span class="docs-summary-label">${t("promise")}</span>
        <span class="docs-summary-value">${t("promiseValue")}</span>
      </div>
      <div class="docs-summary-item">
        <span class="docs-summary-label">${t("minimum")}</span>
        <span class="docs-summary-value">${t("minimumValue")}</span>
      </div>
      <div class="docs-summary-item">
        <span class="docs-summary-label">${t("acceptance")}</span>
        <span class="docs-summary-value">${t("acceptanceValue")}</span>
      </div>
    </div>

    <section class="docs-section">
      <h2>${t("ownershipTitle")}</h2>
      <p class="docs-section-lead">${t("ownershipLead")}</p>
      <table class="docs-matrix">
        <thead>
          <tr><th>${t("area")}</th><th>${t("library")}</th><th>${t("application")}</th></tr>
        </thead>
        <tbody>
          <tr><td>${t("keyboard")}</td><td>${t("keyboardLibrary")}</td><td>${t("keyboardApp")}</td></tr>
          <tr><td>${t("semantics")}</td><td>${t("semanticsLibrary")}</td><td>${t("semanticsApp")}</td></tr>
          <tr><td>${t("visuals")}</td><td>${t("visualsLibrary")}</td><td>${t("visualsApp")}</td></tr>
          <tr><td>${t("performance")}</td><td>${t("performanceLibrary")}</td><td>${t("performanceApp")}</td></tr>
        </tbody>
      </table>
    </section>

    <section class="docs-section">
      <h2>${t("gatesTitle")}</h2>
      <p class="docs-section-lead">${t("gatesLead")}</p>
      <div class="docs-flow" data-docs-toc-ignore>
        <article class="docs-flow-item">
          <span class="docs-flow-index">01</span>
          <h3>${t("contractTitle")}</h3>
          <p>${t("contractBody")}</p>
        </article>
        <article class="docs-flow-item">
          <span class="docs-flow-index">02</span>
          <h3>${t("staticTitle")}</h3>
          <p>${t("staticBody")}</p>
        </article>
        <article class="docs-flow-item">
          <span class="docs-flow-index">03</span>
          <h3>${t("browserTitle")}</h3>
          <p>${t("browserBody")}</p>
        </article>
      </div>
    </section>

    <section class="docs-section">
      <h2>${t("commandTitle")}</h2>
      <p class="docs-section-lead">${t("commandLead")}</p>
      <div class="docs-code">
        <span class="docs-code-label">Terminal</span>
        <pre><code>pnpm exec vitest run path/to/component.test.ts --maxWorkers=1
pnpm typecheck
pnpm build:lib
pnpm build</code></pre>
      </div>
    </section>

    <section class="docs-section">
      <h2>${t("coverageTitle")}</h2>
      <table class="docs-matrix">
        <thead>
          <tr><th>${t("area")}</th><th>${t("statusLabel")}</th><th>${t("currentGate")}</th><th>${t("nextGate")}</th></tr>
        </thead>
        <tbody>
          <tr><td>Tests & types</td><td>${t("active")}</td><td>${t("unitCurrent")}</td><td>${t("unitNext")}</td></tr>
          <tr><td>Accessibility</td><td>${t("partial")}</td><td>${t("a11yCurrent")}</td><td>${t("a11yNext")}</td></tr>
          <tr><td>Performance</td><td>${t("partial")}</td><td>${t("perfCurrent")}</td><td>${t("perfNext")}</td></tr>
          <tr><td>Browser matrix</td><td>${t("partial")}</td><td>${t("browserCurrent")}</td><td>${t("browserNext")}</td></tr>
        </tbody>
      </table>
      <p class="docs-callout is-warning"><strong>${t("honestyTitle")}</strong> ${t("honestyBody")}</p>
    </section>

    <section class="docs-next" data-docs-toc-ignore>
      <div>
        <h2>${t("nextTitle")}</h2>
        <p>${t("nextBody")}</p>
      </div>
      <div class="docs-link-list">
        <elf-link href="#/quality/accessibility">${t("accessibilityLink")} →</elf-link>
        <elf-link href="#/getting-started/browser-support">${t("browserLink")} →</elf-link>
      </div>
    </section>
  </elf-container>
`);

export { PageQualityIntroduction };
