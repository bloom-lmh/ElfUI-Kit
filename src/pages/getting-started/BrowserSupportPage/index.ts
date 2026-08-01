import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "快速入门", en: "Getting started" },
  title: { zh: "浏览器支持", en: "Browser support" },
  description: {
    zh: "ElfUI 基于 Custom Elements、Shadow DOM 和现代观察器 API。这里区分“支持目标”和“已验证环境”，避免把计划中的兼容性误写成发布承诺。",
    en: "ElfUI builds on Custom Elements, Shadow DOM, and modern observer APIs. This page separates support targets from verified environments so planned compatibility is never presented as a release promise.",
  },
  baseline: { zh: "基线", en: "Baseline" },
  baselineValue: { zh: "现代常青浏览器", en: "Modern evergreen browsers" },
  minimum: { zh: "最低目标", en: "Minimum target" },
  minimumValue: { zh: "Safari 16.4+", en: "Safari 16.4+" },
  excluded: { zh: "不支持", en: "Excluded" },
  excludedValue: { zh: "Internet Explorer", en: "Internet Explorer" },
  matrixTitle: { zh: "支持矩阵", en: "Support matrix" },
  matrixLead: {
    zh: "Target 表示设计目标；Verified 表示当前发布流程已有稳定自动化或人工验收。发布说明应记录实际执行的浏览器。",
    en: "Target is a design goal; Verified means the current release process has stable automated or manual acceptance. Release notes should name the browsers actually exercised.",
  },
  browser: { zh: "浏览器", en: "Browser" },
  target: { zh: "支持目标", en: "Target" },
  verification: { zh: "当前验证", en: "Current verification" },
  notes: { zh: "说明", en: "Notes" },
  currentTwo: { zh: "当前及前两个稳定版本", en: "Current and previous two stable releases" },
  chromiumVerify: {
    zh: "Chromium 自动化 + 人工截图",
    en: "Chromium automation + manual screenshots",
  },
  targetOnly: {
    zh: "目标；发布前需要补充矩阵验证",
    en: "Target; matrix verification required before release",
  },
  safariTarget: { zh: "Safari 16.4 及以上", en: "Safari 16.4 and later" },
  safariNote: {
    zh: "重点验证 Shadow DOM、Popover、焦点和日期控件",
    en: "Prioritize Shadow DOM, Popover, focus, and date controls",
  },
  mobileTarget: {
    zh: "对应系统 WebView 与移动浏览器",
    en: "Matching system WebViews and mobile browsers",
  },
  mobileNote: {
    zh: "重点验证触摸、视口、软键盘和安全区",
    en: "Prioritize touch, viewport, soft keyboard, and safe areas",
  },
  capabilitiesTitle: { zh: "平台能力要求", en: "Required platform capabilities" },
  capabilitiesLead: {
    zh: "ElfUI 不为缺少 Shadow DOM 的旧浏览器维护第二套渲染器。应用可以按业务需要加载局部 polyfill，但不能模拟核心平台模型。",
    en: "ElfUI does not maintain a second renderer for browsers without Shadow DOM. Apps may load focused polyfills when appropriate, but core platform semantics are not emulated.",
  },
  capability: { zh: "能力", en: "Capability" },
  usage: { zh: "ElfUI 用途", en: "How ElfUI uses it" },
  fallback: { zh: "缺失时", en: "When unavailable" },
  ceUsage: { zh: "组件注册与生命周期", en: "Component registration and lifecycle" },
  shadowUsage: {
    zh: "样式隔离、插槽和焦点边界",
    en: "Style isolation, slots, and focus boundaries",
  },
  observerUsage: {
    zh: "尺寸、可见性和虚拟列表测量",
    en: "Size, visibility, and virtual-list measurement",
  },
  abortUsage: { zh: "卸载时取消监听和异步任务", en: "Cancel listeners and async work on unmount" },
  cssUsage: { zh: "主题混色和语义表面", en: "Theme color mixing and semantic surfaces" },
  unsupported: { zh: "不支持", en: "Unsupported" },
  featureDegrades: {
    zh: "对应能力降级或需要局部适配",
    en: "The related capability degrades or needs a focused adapter",
  },
  cssFallback: { zh: "主题需要提供静态回退色", en: "Themes need static fallback colors" },
  testTitle: { zh: "应用侧验收清单", en: "Application acceptance checklist" },
  testLead: {
    zh: "浏览器支持不仅是页面能打开。至少覆盖以下容易跨浏览器分化的行为。",
    en: "Browser support is more than loading the page. Cover at least these cross-browser-sensitive behaviors.",
  },
  testOne: {
    zh: "弹层定位、外部点击、Escape 关闭与焦点恢复。",
    en: "Overlay positioning, outside click, Escape close, and focus restoration.",
  },
  testTwo: {
    zh: "表单提交、禁用态、自动填充和移动端软键盘。",
    en: "Form submission, disabled states, autofill, and mobile soft keyboards.",
  },
  testThree: {
    zh: "RTL、200% 缩放、减少动态效果和高对比度。",
    en: "RTL, 200% zoom, reduced motion, and high contrast.",
  },
  testFour: {
    zh: "长列表、滚动容器、粘性定位和动态高度内容。",
    en: "Long lists, scroll containers, sticky positioning, and dynamic-height content.",
  },
  reportTitle: { zh: "报告兼容问题", en: "Report a compatibility issue" },
  reportBody: {
    zh: "请附浏览器与系统版本、最小复现、控制台信息、预期/实际行为和截图。若问题能脱离组件库复现到 Framework，应转为框架缺陷。",
    en: "Include browser and OS versions, a minimal reproduction, console output, expected and actual behavior, and screenshots. If the issue reproduces without the Kit, report it as a Framework defect.",
  },
  nextTitle: { zh: "下一步", en: "Next step" },
  nextBody: {
    zh: "质量章节说明无障碍和发布门禁；常见问题提供接入排障路径。",
    en: "Quality explains accessibility and release gates; FAQ provides integration troubleshooting.",
  },
  qualityLink: { zh: "质量", en: "Quality" },
  faqLink: { zh: "常见问题", en: "FAQ" },
});

const supportColumns = () => [
  { prop: "browser", label: t("browser"), minWidth: 140 },
  { prop: "target", label: t("target"), minWidth: 210 },
  { prop: "verification", label: t("verification"), minWidth: 230 },
  { prop: "notes", label: t("notes"), minWidth: 240 },
];
const supportRows = () => [
  {
    browser: "Chrome / Edge",
    target: t("currentTwo"),
    verification: t("chromiumVerify"),
    notes: "Primary CI baseline",
  },
  {
    browser: "Firefox",
    target: t("currentTwo"),
    verification: t("targetOnly"),
    notes: "Gecko rendering and focus",
  },
  {
    browser: "Safari",
    target: t("safariTarget"),
    verification: t("targetOnly"),
    notes: t("safariNote"),
  },
  {
    browser: "iOS / Android",
    target: t("mobileTarget"),
    verification: t("targetOnly"),
    notes: t("mobileNote"),
  },
];
const capabilityColumns = () => [
  { prop: "capability", label: t("capability"), minWidth: 210 },
  { prop: "usage", label: t("usage"), minWidth: 280 },
  { prop: "fallback", label: t("fallback"), minWidth: 240 },
];
const capabilityRows = () => [
  { capability: "Custom Elements", usage: t("ceUsage"), fallback: t("unsupported") },
  { capability: "Shadow DOM", usage: t("shadowUsage"), fallback: t("unsupported") },
  {
    capability: "ResizeObserver / IntersectionObserver",
    usage: t("observerUsage"),
    fallback: t("featureDegrades"),
  },
  {
    capability: "AbortController / Pointer Events",
    usage: t("abortUsage"),
    fallback: t("featureDegrades"),
  },
  {
    capability: "CSS custom properties / color-mix()",
    usage: t("cssUsage"),
    fallback: t("cssFallback"),
  },
];

defineStyle(articleStyles);

const PageBrowserSupport = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="getting-started" tag="Compatibility" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <div class="guide-content">

    <div class="docs-summary">
      <div class="docs-summary-item">
        <span class="docs-summary-label">${t("baseline")}</span>
        <span class="docs-summary-value">${t("baselineValue")}</span>
      </div>
      <div class="docs-summary-item">
        <span class="docs-summary-label">${t("minimum")}</span>
        <span class="docs-summary-value">${t("minimumValue")}</span>
      </div>
      <div class="docs-summary-item">
        <span class="docs-summary-label">${t("excluded")}</span>
        <span class="docs-summary-value">${t("excludedValue")}</span>
      </div>
    </div>

    <section class="docs-section">
      <h2>${t("matrixTitle")}</h2>
      <p class="docs-section-lead">${t("matrixLead")}</p>
      <elf-table class="guide-table" :data.prop=${supportRows()} :columns.prop=${supportColumns()} row-key="browser" border stripe></elf-table>
    </section>

    <section class="docs-section">
      <h2>${t("capabilitiesTitle")}</h2>
      <p class="docs-section-lead">${t("capabilitiesLead")}</p>
      <elf-table class="guide-table" :data.prop=${capabilityRows()} :columns.prop=${capabilityColumns()} row-key="capability" border></elf-table>
    </section>

    <section class="docs-section">
      <h2>${t("testTitle")}</h2>
      <p class="docs-section-lead">${t("testLead")}</p>
      <ul class="docs-checklist">
        <li>${t("testOne")}</li>
        <li>${t("testTwo")}</li>
        <li>${t("testThree")}</li>
        <li>${t("testFour")}</li>
      </ul>
      <elf-alert type="info" variant="soft" :showIcon.prop=${false} :title=${t("reportTitle")} :description=${t("reportBody")}></elf-alert>
    </section>

    <section class="docs-next" data-docs-toc-ignore>
      <div>
        <h2>${t("nextTitle")}</h2>
        <p>${t("nextBody")}</p>
      </div>
      <div class="docs-link-list">
        <elf-link href="#/quality">${t("qualityLink")} →</elf-link>
        <elf-link href="#/getting-started/faq">${t("faqLink")} →</elf-link>
      </div>
    </section>
    </div>
  </elf-container>
`);

export { PageBrowserSupport };
