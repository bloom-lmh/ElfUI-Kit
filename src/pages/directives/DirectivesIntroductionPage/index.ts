import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  title: { zh: "指令", en: "Directives" },
  description: {
    zh: "指令负责把可复用的 DOM 行为附着到任意元素。ElfUI 的指令与组合式函数共享同一套行为内核，避免同一能力出现两份实现。",
    en: "Directives attach reusable DOM behavior to any element. ElfUI directives and composables share the same behavior core, avoiding duplicate implementations.",
  },
  localTitle: { zh: "组件局部注册", en: "Component-local registration" },
  localBody: {
    zh: "适合仅由单个组件使用的行为，依赖关系明确并可随组件卸载。",
    en: "Use this for behavior owned by one component, with explicit dependencies and component-scoped cleanup.",
  },
  appTitle: { zh: "应用级注册", en: "Application registration" },
  appBody: {
    zh: "适合跨页面复用的通用行为，通过应用实例统一命名和注册。",
    en: "Use this for shared behavior across pages, registered and named consistently on the application instance.",
  },
  stableTitle: { zh: "已有稳定能力", en: "Stable capabilities" },
  stableBody: {
    zh: "拖拽、加载和无限滚动已有组件库实现；后续会统一公开入口、类型和文档。",
    en: "Draggable, Loading, and Infinite Scroll already have library implementations; their public entries, types, and docs will be consolidated.",
  },
  plannedTitle: { zh: "计划补齐", en: "Planned directives" },
  plannedBody: {
    zh: "外部点击、交叉观察、DOM 变动观察、尺寸变化、波纹、滚动、工具提示和触摸。",
    en: "Click Outside, Intersection Observer, Mutation Observer, Resize, Ripple, Scroll, Tooltip, and Touch.",
  },
  architecture: {
    zh: "实现约束：每项行为只有一个权威内核；指令只负责绑定，组合式函数负责状态复用；两者都必须支持卸载清理、SSR 安全和严格类型。",
    en: "Architecture rule: each behavior has one authoritative core. Directives bind behavior, composables reuse state, and both must provide cleanup, SSR safety, and strict types.",
  },
});

defineStyle(articleStyles);

const PageDirectivesIntroduction = defineHtml(`
  <elf-container class="docs-article">
    <h1>${t("title")}</h1>
    <p class="page-lead">${t("description")}</p>

    <div class="article-grid">
      <section class="article-card">
        <span class="status">defineDirective</span>
        <h2>${t("localTitle")}</h2>
        <p>${t("localBody")}</p>
        <pre><code>const clickOutside = defineDirective({
  mounted(element, binding) {
    return bindClickOutside(element, binding.value);
  }
});</code></pre>
      </section>

      <section class="article-card">
        <span class="status">app.directive</span>
        <h2>${t("appTitle")}</h2>
        <p>${t("appBody")}</p>
        <pre><code>const app = createApp(App);
app.directive("click-outside", clickOutside);</code></pre>
      </section>

      <section class="article-card">
        <span class="status">stable</span>
        <h2>${t("stableTitle")}</h2>
        <p>${t("stableBody")}</p>
        <ul>
          <li>Draggable</li>
          <li>Loading</li>
          <li>Infinite Scroll</li>
        </ul>
      </section>

      <section class="article-card">
        <span class="status">roadmap</span>
        <h2>${t("plannedTitle")}</h2>
        <p>${t("plannedBody")}</p>
      </section>
    </div>

    <p class="article-note">${t("architecture")}</p>
  </elf-container>
`);

export { PageDirectivesIntroduction };
