import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "快速入门", en: "Getting started" },
  title: { zh: "安装 ElfUI Kit", en: "Install ElfUI Kit" },
  description: {
    zh: "选择与你的工程相符的接入路径。新项目优先使用脚手架；已有应用只需安装组件库并在入口注册；只有编写 ElfUI 宏组件时才需要配置编译插件。",
    en: "Choose the path that matches your project. Prefer the scaffold for new apps, register the Kit once in existing apps, and configure the compiler plugin only when authoring ElfUI macro components.",
  },
  audience: { zh: "适用", en: "For" },
  audienceValue: { zh: "应用与组件库开发者", en: "App and library authors" },
  recommended: { zh: "推荐路径", en: "Recommended path" },
  recommendedValue: { zh: "Vite + Macro 组件", en: "Vite + Macro components" },
  versions: { zh: "当前版本", en: "Current versions" },
  chooseTitle: { zh: "选择接入方式", en: "Choose an installation path" },
  chooseLead: {
    zh: "ElfUI Framework 与 ElfUI Kit 职责不同：Framework 提供编译和运行时，Kit 提供可直接使用的组件。",
    en: "ElfUI Framework provides compilation and runtime capabilities, while ElfUI Kit provides ready-to-use components.",
  },
  newTitle: { zh: "创建新应用", en: "Create a new application" },
  newBody: {
    zh: "脚手架会生成 Vite、Macro 组件入口和可选路由。创建时选择 Macro，避免手动拼装工具链。",
    en: "The scaffold creates Vite, a Macro component entry, and optional routing. Choose Macro to avoid assembling the toolchain manually.",
  },
  existingTitle: { zh: "接入已有应用", en: "Add to an existing application" },
  existingBody: {
    zh: "如果只消费 Custom Elements，安装 Kit 并导入一次即可；如果还要编写宏组件，再添加 Core 与 Vite Plugin。",
    en: "If you only consume Custom Elements, install and import the Kit once. Add Core and the Vite Plugin when you also author macro components.",
  },
  stepsTitle: { zh: "完成首次接入", en: "Complete the first setup" },
  scaffoldTitle: { zh: "创建工程", en: "Create the project" },
  scaffoldBody: {
    zh: "推荐由官方脚手架建立可靠起点。--install 会安装依赖，--router 可选生成路由骨架。",
    en: "Use the official scaffold as the reliable starting point. --install installs dependencies and --router optionally creates routing.",
  },
  kitTitle: { zh: "安装并注册组件库", en: "Install and register the Kit" },
  kitBody: {
    zh: "在应用入口导入一次 @elfui/kit，公开组件会注册为 Custom Elements。工具类样式是独立的可选入口。",
    en: "Import @elfui/kit once in the application entry to register its public Custom Elements. Utility styles are an optional separate entry.",
  },
  useTitle: { zh: "开始使用组件", en: "Use a component" },
  useBody: {
    zh: "宏组件模板可以直接使用 elf-* 标签；普通 HTML 页面也可以在模块脚本加载完成后使用同一套标签。",
    en: "Macro templates can use elf-* tags directly. Plain HTML pages can use the same tags after the module entry has loaded.",
  },
  authorTitle: { zh: "需要编写宏组件？", en: "Authoring macro components?" },
  authorBody: {
    zh: "将 Core 与 Vite Plugin 固定在完全相同的 beta 版本，并在 Vite 中启用 elfuiMacroPlugin。",
    en: "Pin Core and the Vite Plugin to the exact same beta version and enable elfuiMacroPlugin in Vite.",
  },
  warningTitle: { zh: "版本必须对齐。", en: "Versions must align." },
  warningBody: {
    zh: "Core、Compiler 与 Vite Plugin 不要混用不同 beta。框架 API 仍在演进，升级前先阅读迁移说明。",
    en: "Do not mix Core, Compiler, and Vite Plugin beta versions. Framework APIs are still evolving, so read the migration notes before upgrading.",
  },
  verifyTitle: { zh: "验证安装", en: "Verify the installation" },
  verifyLead: {
    zh: "看到页面并不代表工程链路完全正确；至少完成下面四项检查。",
    en: "A rendered page alone does not prove the toolchain is correct. Complete at least these four checks.",
  },
  verifyOne: { zh: "开发服务器无编译警告，浏览器控制台无自定义元素冲突。", en: "The dev server has no compiler warnings and the browser has no custom-element conflicts." },
  verifyTwo: { zh: "主题、语言和默认配置能够通过 Provider 传入组件。", en: "Theme, locale, and defaults reach components through Providers." },
  verifyThree: { zh: "生产构建通过，输出没有重复打包底层运行时。", en: "The production build passes without bundling duplicate low-level runtimes." },
  verifyFour: { zh: "使用键盘可以聚焦并操作第一个交互组件。", en: "The first interactive component is focusable and operable from the keyboard." },
  nextTitle: { zh: "安装完成后", en: "After installation" },
  nextBody: { zh: "先了解全局配置和主题，再进入组件案例。", en: "Learn global configuration and theming before exploring component demos." },
  configLink: { zh: "全局配置", en: "Global configuration" },
  themeLink: { zh: "主题定制", en: "Theme customization" },
  faqLink: { zh: "常见问题", en: "FAQ" },
});

defineStyle(articleStyles);

const PageInstallation = defineHtml(`
  <elf-container class="docs-article">
    <span class="docs-kicker">${t("kicker")}</span>
    <h1>${t("title")}</h1>
    <p class="page-lead">${t("description")}</p>

    <div class="docs-summary">
      <div class="docs-summary-item">
        <span class="docs-summary-label">${t("audience")}</span>
        <span class="docs-summary-value">${t("audienceValue")}</span>
      </div>
      <div class="docs-summary-item">
        <span class="docs-summary-label">${t("recommended")}</span>
        <span class="docs-summary-value">${t("recommendedValue")}</span>
      </div>
      <div class="docs-summary-item">
        <span class="docs-summary-label">${t("versions")}</span>
        <span class="docs-summary-value">Kit beta.1 · Framework beta.20</span>
      </div>
    </div>

    <section class="docs-section">
      <h2>${t("chooseTitle")}</h2>
      <p class="docs-section-lead">${t("chooseLead")}</p>
      <div class="docs-choice-grid" data-docs-toc-ignore>
        <article class="docs-choice">
          <span class="status">Recommended</span>
          <h3>${t("newTitle")}</h3>
          <p>${t("newBody")}</p>
          <div class="docs-code">
            <span class="docs-code-label">Terminal</span>
            <pre><code>pnpm create elfui@beta my-app --install --router
cd my-app
pnpm dev</code></pre>
          </div>
        </article>
        <article class="docs-choice">
          <span class="status">Existing app</span>
          <h3>${t("existingTitle")}</h3>
          <p>${t("existingBody")}</p>
          <div class="docs-code">
            <span class="docs-code-label">Terminal</span>
            <pre><code>pnpm add @elfui/kit</code></pre>
          </div>
        </article>
      </div>
    </section>

    <section class="docs-section">
      <h2>${t("stepsTitle")}</h2>
      <div class="docs-steps" data-docs-toc-ignore>
        <article class="docs-step">
          <span class="docs-step-index">1</span>
          <div class="docs-step-content">
            <h3>${t("scaffoldTitle")}</h3>
            <p>${t("scaffoldBody")}</p>
          </div>
        </article>
        <article class="docs-step">
          <span class="docs-step-index">2</span>
          <div class="docs-step-content">
            <h3>${t("kitTitle")}</h3>
            <p>${t("kitBody")}</p>
            <div class="docs-code">
              <span class="docs-code-label">src/main.ts</span>
              <pre><code>import "@elfui/kit";
import "@elfui/kit/styles/utilities.css"; // optional</code></pre>
            </div>
          </div>
        </article>
        <article class="docs-step">
          <span class="docs-step-index">3</span>
          <div class="docs-step-content">
            <h3>${t("useTitle")}</h3>
            <p>${t("useBody")}</p>
            <div class="docs-code">
              <span class="docs-code-label">src/App.ts</span>
              <pre><code>import { defineHtml } from "@elfui/core";

export const App = defineHtml(\`
  &lt;elf-button type="primary"&gt;Create project&lt;/elf-button&gt;
\`);</code></pre>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="docs-section">
      <h2>${t("authorTitle")}</h2>
      <p class="docs-section-lead">${t("authorBody")}</p>
      <div class="docs-code">
        <span class="docs-code-label">Terminal</span>
        <pre><code>pnpm add @elfui/core@0.1.0-beta.20
pnpm add -D @elfui/vite-plugin@0.1.0-beta.20</code></pre>
      </div>
      <div class="docs-code">
        <span class="docs-code-label">vite.config.ts</span>
        <pre><code>import { defineConfig } from "vite";
import { elfuiMacroPlugin } from "@elfui/vite-plugin";

export default defineConfig({
  plugins: [elfuiMacroPlugin()]
});</code></pre>
      </div>
      <p class="docs-callout is-warning"><strong>${t("warningTitle")}</strong> ${t("warningBody")}</p>
    </section>

    <section class="docs-section">
      <h2>${t("verifyTitle")}</h2>
      <p class="docs-section-lead">${t("verifyLead")}</p>
      <ul class="docs-checklist">
        <li>${t("verifyOne")}</li>
        <li>${t("verifyTwo")}</li>
        <li>${t("verifyThree")}</li>
        <li>${t("verifyFour")}</li>
      </ul>
    </section>

    <section class="docs-next" data-docs-toc-ignore>
      <div>
        <h2>${t("nextTitle")}</h2>
        <p>${t("nextBody")}</p>
      </div>
      <div class="docs-link-list">
        <elf-link href="#/providers/config">${t("configLink")} →</elf-link>
        <elf-link href="#/providers/theme">${t("themeLink")} →</elf-link>
        <elf-link href="#/getting-started/faq">${t("faqLink")} →</elf-link>
      </div>
    </section>
  </elf-container>
`);

export { PageInstallation };
