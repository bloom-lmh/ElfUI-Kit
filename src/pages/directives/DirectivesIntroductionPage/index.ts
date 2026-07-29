import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "DOM 行为", en: "DOM behaviors" },
  title: { zh: "指令", en: "Directives" },
  description: {
    zh: "指令把可复用的 DOM 行为附着到任意元素。它适合外部点击、观察器和手势这类“行为”，不应该替代有语义、有状态或有视觉契约的组件。",
    en: "Directives attach reusable DOM behavior to any element. They fit outside-click, observer, and gesture behaviors—not semantic, stateful, or visual component contracts.",
  },
  purpose: { zh: "职责", en: "Purpose" },
  purposeValue: { zh: "附着 DOM 行为", en: "Attach DOM behavior" },
  scope: { zh: "注册范围", en: "Registration" },
  scopeValue: { zh: "组件局部或应用级", en: "Component-local or app-wide" },
  contract: { zh: "实现契约", en: "Contract" },
  contractValue: { zh: "单一内核 · 自动清理", en: "One core · automatic cleanup" },
  chooseTitle: { zh: "什么时候使用指令", en: "When to use a directive" },
  chooseLead: {
    zh: "先判断需求是否只增强现有元素的行为。若能力需要自己的结构、ARIA 模型或业务状态，应优先做组件或组合式函数。",
    en: "First decide whether the need only enhances an existing element. If it owns structure, an ARIA model, or business state, prefer a component or composable.",
  },
  directiveTitle: { zh: "适合指令", en: "Use a directive" },
  directiveBody: {
    zh: "监听元素边界、尺寸、可见性、滚动、指针或键盘手势，并且可以在卸载时完整释放资源。",
    en: "Observe element boundaries, size, visibility, scrolling, pointer, or keyboard gestures with complete cleanup on unmount.",
  },
  componentTitle: { zh: "更适合组件", en: "Use a component instead" },
  componentBody: {
    zh: "需要可见 UI、复杂状态、插槽、表单值、焦点模型或稳定的可访问语义。",
    en: "The feature owns visible UI, complex state, slots, form values, a focus model, or stable accessible semantics.",
  },
  registerTitle: { zh: "注册方式", en: "Registration" },
  registerLead: {
    zh: "局部注册让依赖与组件一起销毁；应用级注册适合跨页面统一使用。两种入口应指向同一行为定义。",
    en: "Local registration keeps dependencies scoped to a component; app registration suits consistent cross-page use. Both entries must use the same behavior definition.",
  },
  localTitle: { zh: "组件局部", en: "Component-local" },
  localBody: { zh: "依赖显式、作用域最小，组件卸载时同步清理。", en: "Explicit dependencies, smallest scope, and cleanup with the component." },
  appTitle: { zh: "应用级", en: "Application-level" },
  appBody: { zh: "统一命名和策略，适合应用中大量重复使用。", en: "Consistent naming and policy for behavior used throughout an app." },
  lifecycleTitle: { zh: "生命周期模型", en: "Lifecycle model" },
  bindTitle: { zh: "绑定", en: "Bind" },
  bindBody: { zh: "解析参数，建立监听，并记录清理句柄。", en: "Resolve options, attach listeners, and retain cleanup handles." },
  updateTitle: { zh: "更新", en: "Update" },
  updateBody: { zh: "配置变化时更新内核，不重复叠加监听。", en: "Update the behavior core without stacking duplicate listeners." },
  cleanupTitle: { zh: "清理", en: "Cleanup" },
  cleanupBody: { zh: "卸载时取消观察器、事件、计时器和异步任务。", en: "Cancel observers, events, timers, and async work on unmount." },
  catalogTitle: { zh: "能力目录", en: "Capability catalog" },
  catalogLead: {
    zh: "只有具备公开类型、测试、双语案例和浏览器验收的能力才标记为稳定。已有组件能力不会为了填满目录而重复实现。",
    en: "Only capabilities with public types, tests, bilingual demos, and browser acceptance are stable. Existing component behavior is not duplicated merely to fill the catalog.",
  },
  behavior: { zh: "行为", en: "Behavior" },
  statusLabel: { zh: "状态", en: "Status" },
  entry: { zh: "入口", en: "Entry" },
  stable: { zh: "稳定", en: "Stable" },
  componentOwned: { zh: "组件内置", en: "Component-owned" },
  planned: { zh: "稳定", en: "Stable" },
  directEntry: { zh: "指令 + 注册函数", en: "Directive + registration helper" },
  sharedCore: { zh: "复用现有行为内核", en: "Reuse the existing behavior core" },
  notExported: { zh: "尚未公开", en: "Not public yet" },
  ruleTitle: { zh: "架构约束", en: "Architecture rule" },
  ruleBody: {
    zh: "每项行为只有一个权威内核。指令负责 DOM 绑定，组合式函数负责状态复用，组件负责语义和视觉；三者不能复制监听、定位或清理逻辑。",
    en: "Each behavior has one authoritative core. Directives bind DOM, composables reuse state, and components own semantics and visuals; listener, positioning, and cleanup logic must not be copied.",
  },
  nextTitle: { zh: "从真实案例开始", en: "Start with a working example" },
  nextBody: {
    zh: "外部点击展示 Shadow DOM 事件路径、排除元素、动态配置和自动清理。",
    en: "Click outside demonstrates Shadow DOM event paths, excluded elements, dynamic options, and automatic cleanup.",
  },
  openExample: { zh: "查看外部点击", en: "Open Click outside" },
});

defineStyle(articleStyles);

const PageDirectivesIntroduction = defineHtml(`
  <elf-container class="docs-article">
    <span class="docs-kicker">${t("kicker")}</span>
    <h1>${t("title")}</h1>
    <p class="page-lead">${t("description")}</p>

    <div class="docs-summary">
      <div class="docs-summary-item">
        <span class="docs-summary-label">${t("purpose")}</span>
        <span class="docs-summary-value">${t("purposeValue")}</span>
      </div>
      <div class="docs-summary-item">
        <span class="docs-summary-label">${t("scope")}</span>
        <span class="docs-summary-value">${t("scopeValue")}</span>
      </div>
      <div class="docs-summary-item">
        <span class="docs-summary-label">${t("contract")}</span>
        <span class="docs-summary-value">${t("contractValue")}</span>
      </div>
    </div>

    <section class="docs-section">
      <h2>${t("chooseTitle")}</h2>
      <p class="docs-section-lead">${t("chooseLead")}</p>
      <div class="docs-choice-grid" data-docs-toc-ignore>
        <article class="docs-choice">
          <h3>${t("directiveTitle")}</h3>
          <p>${t("directiveBody")}</p>
        </article>
        <article class="docs-choice">
          <h3>${t("componentTitle")}</h3>
          <p>${t("componentBody")}</p>
        </article>
      </div>
    </section>

    <section class="docs-section">
      <h2>${t("registerTitle")}</h2>
      <p class="docs-section-lead">${t("registerLead")}</p>
      <div class="docs-choice-grid" data-docs-toc-ignore>
        <article class="docs-choice">
          <span class="status">defineDirective</span>
          <h3>${t("localTitle")}</h3>
          <p>${t("localBody")}</p>
          <div class="docs-code">
            <span class="docs-code-label">Component.ts</span>
            <pre><code>const clickOutside =
  defineDirective(clickOutsideDirective);</code></pre>
          </div>
        </article>
        <article class="docs-choice">
          <span class="status">app.directive</span>
          <h3>${t("appTitle")}</h3>
          <p>${t("appBody")}</p>
          <div class="docs-code">
            <span class="docs-code-label">main.ts</span>
            <pre><code>const app = createApp(App);
registerClickOutsideDirective(app);
app.mount("#app");</code></pre>
          </div>
        </article>
      </div>
    </section>

    <section class="docs-section">
      <h2>${t("lifecycleTitle")}</h2>
      <div class="docs-flow" data-docs-toc-ignore>
        <article class="docs-flow-item">
          <span class="docs-flow-index">01</span>
          <h3>${t("bindTitle")}</h3>
          <p>${t("bindBody")}</p>
        </article>
        <article class="docs-flow-item">
          <span class="docs-flow-index">02</span>
          <h3>${t("updateTitle")}</h3>
          <p>${t("updateBody")}</p>
        </article>
        <article class="docs-flow-item">
          <span class="docs-flow-index">03</span>
          <h3>${t("cleanupTitle")}</h3>
          <p>${t("cleanupBody")}</p>
        </article>
      </div>
    </section>

    <section class="docs-section">
      <h2>${t("catalogTitle")}</h2>
      <p class="docs-section-lead">${t("catalogLead")}</p>
      <table class="docs-matrix">
        <thead>
          <tr><th>${t("behavior")}</th><th>${t("statusLabel")}</th><th>${t("entry")}</th></tr>
        </thead>
        <tbody>
          <tr><td><elf-link href="#/directives/click-outside">Click outside</elf-link></td><td>${t("stable")}</td><td>${t("directEntry")}</td></tr>
          <tr><td><elf-link href="#/directives/intersect">Intersect / Mutate / Resize</elf-link></td><td>${t("planned")}</td><td>${t("directEntry")}</td></tr>
          <tr><td><elf-link href="#/directives/ripple">Ripple / Scroll / Tooltip / Touch</elf-link></td><td>${t("planned")}</td><td>${t("directEntry")}</td></tr>
          <tr><td>Draggable / Loading / Infinite Scroll</td><td>${t("componentOwned")}</td><td>${t("sharedCore")}</td></tr>
        </tbody>
      </table>
      <p class="docs-callout"><strong>${t("ruleTitle")}</strong> ${t("ruleBody")}</p>
    </section>

    <section class="docs-next" data-docs-toc-ignore>
      <div>
        <h2>${t("nextTitle")}</h2>
        <p>${t("nextBody")}</p>
      </div>
      <div class="docs-link-list">
        <elf-link href="#/directives/click-outside">${t("openExample")} →</elf-link>
      </div>
    </section>
  </elf-container>
`);

export { PageDirectivesIntroduction };
