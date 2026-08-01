import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "快速入门", en: "Getting started" },
  title: { zh: "常见问题", en: "Frequently asked questions" },
  description: {
    zh: "从症状出发定位安装、运行时、样式、弹层和发布问题。每个回答先给最短结论，再指出应该检查的契约边界。",
    en: "Troubleshoot installation, runtime, styling, overlays, and releases from the observed symptom. Each answer starts with the shortest conclusion, then identifies the contract boundary to inspect.",
  },
  start: { zh: "接入与构建", en: "Setup and build" },
  runtime: { zh: "运行时与弹层", en: "Runtime and overlays" },
  styling: { zh: "主题与样式", en: "Theme and styling" },
  release: { zh: "升级与发布", en: "Upgrade and release" },
  registerQ: {
    zh: "页面显示未知的 elf-* 标签，组件没有渲染？",
    en: "The page shows an unknown elf-* tag and the component does not render?",
  },
  registerA: {
    zh: '确认应用入口已经执行 import "@elfui/kit"。Custom Element 注册发生在该入口加载时；按需构建则要确认目标组件入口没有被摇树移除。',
    en: 'Make sure the application entry executes import "@elfui/kit". Custom Elements register when that entry loads; selective builds must also keep the target component entry from being tree-shaken.',
  },
  compilerQ: {
    zh: "defineHtml 能运行，但模板语法没有响应式更新？",
    en: "defineHtml runs, but template bindings do not update reactively?",
  },
  compilerA: {
    zh: "检查 Vite 是否启用了 elfuiMacroPlugin，以及 Core 与 Vite Plugin 是否为完全相同的 beta。宏模板依赖构建期编译，不能把动态变量传给 defineHtml。",
    en: "Check that Vite enables elfuiMacroPlugin and that Core and the Vite Plugin use the exact same beta. Macro templates require build-time compilation and defineHtml cannot receive a runtime template variable.",
  },
  duplicateQ: {
    zh: "控制台提示自定义元素名称冲突？",
    en: "The console reports a custom-element name conflict?",
  },
  duplicateA: {
    zh: "同一个 tag 被不同构造器注册了两次。检查是否同时打包了两份 Kit/Framework，或两个库使用了相同组件前缀。不要用捕获异常来忽略冲突。",
    en: "The same tag was registered by two different constructors. Check for duplicate Kit/Framework bundles or libraries sharing a component prefix. Do not suppress the conflict with a catch block.",
  },
  overlayQ: {
    zh: "弹层挂到 body 后会丢失语言、主题或配置吗？",
    en: "Do body-level overlays lose locale, theme, or configuration?",
  },
  overlayA: {
    zh: "不应该。Framework 会保留 Teleport 的逻辑父链和 Provider/App 上下文。若丢失，请先缩小到最小复现并作为框架问题报告，而不是在组件内复制配置。",
    en: "They should not. The Framework preserves the Teleport logical parent and Provider/App context. If context is lost, reduce it to a framework reproduction instead of copying configuration inside the component.",
  },
  focusQ: {
    zh: "关闭 Dropdown/Dialog 时出现 aria-hidden 焦点警告？",
    en: "Closing a Dropdown or Dialog produces an aria-hidden focus warning?",
  },
  focusA: {
    zh: "关闭前必须先把焦点移出将被隐藏的浮层，并在关闭后恢复到激活器。不要只切 aria-hidden；模态内容还需要 inert 或等价的焦点隔离策略。",
    en: "Move focus out of the overlay before hiding it, then restore focus to the activator. Do not only toggle aria-hidden; modal content also needs inert or equivalent focus isolation.",
  },
  ssrQ: {
    zh: "SSR 中如何读取视口或访问 DOM？",
    en: "How should viewport or DOM access work during SSR?",
  },
  ssrA: {
    zh: "通过 ConfigProvider.display.ssr 提供首屏尺寸，把 window、document、ResizeObserver 等副作用放进 onMounted，并在卸载时清理。",
    en: "Provide initial dimensions through ConfigProvider.display.ssr, move window, document, and observer side effects into onMounted, and clean them up on unmount.",
  },
  styleQ: {
    zh: "为什么颜色、圆角或密度与预期不同？",
    en: "Why do colors, radii, or density differ from the expected design?",
  },
  styleA: {
    zh: "先检查 ConfigProvider、ThemeProvider 与 DefaultsProvider 的作用域和优先级。公共定制应修改语义 token 或组件公开变量，不要使用深层选择器穿透 Shadow DOM。",
    en: "Inspect ConfigProvider, ThemeProvider, and DefaultsProvider scope and precedence first. Customize semantic tokens or public component variables instead of piercing Shadow DOM with deep selectors.",
  },
  globalCssQ: {
    zh: "全局 CSS 为什么选不中组件内部节点？",
    en: "Why can global CSS not select component internals?",
  },
  globalCssA: {
    zh: "组件内部位于 Shadow DOM，这是隔离契约。使用主题 token、公开 CSS 自定义属性、part 或组件 API；如果缺少必要定制点，应补公开契约而不是依赖内部结构。",
    en: "Component internals live in Shadow DOM by contract. Use theme tokens, public CSS custom properties, parts, or component APIs. Add a public customization contract when one is missing instead of depending on internal structure.",
  },
  versionQ: { zh: "升级后 import 立即报错？", en: "Imports fail immediately after an upgrade?" },
  versionA: {
    zh: "beta 版本会删除旧 API。先对齐 Core、Compiler 与 Vite Plugin，再根据升级指南替换生命周期、响应式、主题和指令入口。",
    en: "Beta releases can remove legacy APIs. Align Core, Compiler, and the Vite Plugin first, then migrate lifecycle, reactivity, theme, and directive entries using the upgrade guide.",
  },
  issueQ: {
    zh: "什么信息能让 Bug 更快被定位？",
    en: "What information helps a bug get diagnosed faster?",
  },
  issueA: {
    zh: "提供最小复现、精确版本、浏览器/系统、预期与实际行为、控制台日志和截图。说明问题属于 Framework、Kit 组件还是文档案例；不确定时先删到最小。",
    en: "Provide a minimal reproduction, exact versions, browser and OS, expected and actual behavior, console logs, and screenshots. Identify whether the boundary is Framework, Kit component, or docs demo; reduce first when unsure.",
  },
  unresolvedTitle: { zh: "仍未解决？", en: "Still blocked?" },
  unresolvedBody: {
    zh: "先用浏览器支持页面确认环境，再按质量章节的最小复现与门禁方法收集证据。",
    en: "Confirm the environment against Browser support, then collect evidence using the reproduction and gate guidance in Quality.",
  },
  browserLink: { zh: "浏览器支持", en: "Browser support" },
  qualityLink: { zh: "质量", en: "Quality" },
  upgradeLink: { zh: "升级指南", en: "Upgrade guide" },
});

const setupFaqs = () => [
  { name: "register", title: t("registerQ"), content: t("registerA") },
  { name: "compiler", title: t("compilerQ"), content: t("compilerA") },
  { name: "duplicate", title: t("duplicateQ"), content: t("duplicateA") },
];
const runtimeFaqs = () => [
  { name: "overlay", title: t("overlayQ"), content: t("overlayA") },
  { name: "focus", title: t("focusQ"), content: t("focusA") },
  { name: "ssr", title: t("ssrQ"), content: t("ssrA") },
];
const stylingFaqs = () => [
  { name: "theme", title: t("styleQ"), content: t("styleA") },
  { name: "global-css", title: t("globalCssQ"), content: t("globalCssA") },
];
const releaseFaqs = () => [
  { name: "version", title: t("versionQ"), content: t("versionA") },
  { name: "issue", title: t("issueQ"), content: t("issueA") },
];

defineStyle(articleStyles);

const PageFaq = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="getting-started" tag="FAQ" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <div class="guide-content">

    <section class="docs-section">
      <h2>${t("start")}</h2>
      <elf-card class="faq-card" variant="outlined" shadow="never">
        <elf-collapse accordion model-value="register" :items.prop=${setupFaqs()}></elf-collapse>
      </elf-card>
    </section>

    <section class="docs-section">
      <h2>${t("runtime")}</h2>
      <elf-card class="faq-card" variant="outlined" shadow="never">
        <elf-collapse accordion model-value="overlay" :items.prop=${runtimeFaqs()}></elf-collapse>
      </elf-card>
    </section>

    <section class="docs-section">
      <h2>${t("styling")}</h2>
      <elf-card class="faq-card" variant="outlined" shadow="never">
        <elf-collapse accordion model-value="theme" :items.prop=${stylingFaqs()}></elf-collapse>
      </elf-card>
    </section>

    <section class="docs-section">
      <h2>${t("release")}</h2>
      <elf-card class="faq-card" variant="outlined" shadow="never">
        <elf-collapse accordion model-value="version" :items.prop=${releaseFaqs()}></elf-collapse>
      </elf-card>
    </section>

    <section class="docs-next" data-docs-toc-ignore>
      <div>
        <h2>${t("unresolvedTitle")}</h2>
        <p>${t("unresolvedBody")}</p>
      </div>
      <div class="docs-link-list">
        <elf-link href="#/getting-started/browser-support">${t("browserLink")} →</elf-link>
        <elf-link href="#/quality">${t("qualityLink")} →</elf-link>
        <elf-link href="#/getting-started/upgrade-guide">${t("upgradeLink")} →</elf-link>
      </div>
    </section>
    </div>
  </elf-container>
`);

export { PageFaq };
