import { defineHtml, defineStyle } from "@elfui/core";

import "@elfui/kit/labs";
import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  title: { zh: "Markdown 文档页", en: "Markdown page" },
  description: {
    zh: "用原生 Markdown 渲染 VitePress 风格文档页：标题锚点、大纲、代码高亮与代码组、任务列表、提示容器、主题与自定义解析规则。",
    en: "Render VitePress-style pages from raw Markdown: heading anchors, outlines, code highlighting and groups, task lists, callouts, theming, and custom parsing rules.",
  },
  warning: {
    zh: "实验性 API：请锁定版本；属性、事件与 DOM 结构仍可能调整。",
    en: "Experimental API: pin versions; props, events, and DOM structure may still change.",
  },
  quickStartTitle: { zh: "快速开始", en: "Quick start" },
  quickStartBody: {
    zh: "从 @elfui/kit/labs 导入后，默认插槽里的 Markdown 会自动渲染成页面排版。",
    en: "Import from @elfui/kit/labs and the default slot renders Markdown as a page layout.",
  },
  inputsTitle: { zh: "三种输入方式", en: "Three input modes" },
  inputsBody: {
    zh: "默认插槽最直观；content prop 适合动态内容；src 可加载远程 .md 文件，带加载骨架与错误兜底。",
    en: "The slot is the simplest; content fits dynamic strings; src loads remote .md files with a skeleton and error fallback.",
  },
  syntaxTitle: { zh: "支持的语法", en: "Supported syntax" },
  syntaxBody: {
    zh: "除标准 Markdown 外，默认启用以下增强：",
    en: "Beyond standard Markdown, these enhancements are on by default:",
  },
  anchorsItem: { zh: "标题锚点与 § 悬停链接", en: "Heading anchors with hoverable § links" },
  containersItem: {
    zh: "::: tip / warning / danger / info 提示容器",
    en: "::: tip / warning / danger / info callouts",
  },
  codeGroupsItem: {
    zh: "::: code-group 代码组（tab 切换）",
    en: "::: code-group tabbed code blocks",
  },
  taskListsItem: { zh: "GFM 任务列表", en: "GFM task lists" },
  footnotesItem: { zh: "脚注与引用回跳", en: "Footnotes with back references" },
  tablesItem: { zh: "表格、引用、行内代码", en: "Tables, quotes, and inline code" },
  htmlItem: { zh: "原始 HTML 与内嵌 Web Component", en: "Raw HTML and embedded web components" },
  themeTitle: { zh: "主题与样式", en: "Theming" },
  themeBody: {
    zh: "内置 default / minimal / paper / midnight 四套预设；tokens prop 或 CSS 变量可逐项覆盖，style 属性也始终生效。",
    en: "Four presets are built in: default / minimal / paper / midnight. The tokens prop, CSS variables, and the style attribute can override them.",
  },
  extendTitle: { zh: "扩展点", en: "Extension points" },
  extendBody: {
    zh: "parser 可完全接管解析；extend 在默认插件之后改写 markdown-it 规则；render 在注入 DOM 前变换最终 HTML。",
    en: "parser fully replaces parsing; extend mutates markdown-it rules after the defaults; render transforms the final HTML before DOM injection.",
  },
  outlineTitle: { zh: "大纲与全局默认", en: "Outline and global defaults" },
  outlineBody: {
    zh: "elf-md-outline 通过 target 关联文档页，自动联动大纲、滚动高亮与点击跳转。",
    en: "elf-md-outline links to the page via target, syncing the outline, scroll highlight, and click navigation.",
  },
  defaultsBody: {
    zh: "用 elf-defaults-provider 批量注入 md-page / md-outline 默认配置，实例属性仍然优先。",
    en: "elf-defaults-provider shares md-page / md-outline defaults; instance props still win.",
  },
  labsTitle: { zh: "案例与 API", en: "Demos and API" },
  labsBody: {
    zh: "完整 Playground 案例、Props / Events / Methods 表与全部 API 细节见实验室页面。",
    en: "Full playground demos, props/events/methods tables, and API details live on the Labs page.",
  },
});

const codeCardItem = (label: string, language: string, code: string) => [
  { key: label, label, language, code },
];

const quickStartCode = `<elf-md-page>
# Quick start

A paragraph with **bold** text and a [link](#syntax).

\`\`\`ts
export const version = "0.0.2-beta.1";
\`\`\`
</elf-md-page>`;

const inputsCode = `<elf-md-page># From the slot</elf-md-page>

<elf-md-page :content.prop="markdownString" />

<elf-md-page src="/docs/guide.md" base="/docs/" />`;

const themeCode = `<elf-md-page
  theme="paper"
  :tokens.prop="{
    '--elf-md-heading-2-size': '28px',
    '--elf-md-link-color': '#1565c0'
  }"
>
# Themed page
</elf-md-page>`;

const extendCode = `<elf-md-page
  :extend.prop="(md) => md.core.ruler.after('inline', 'rule', (state) => {
    for (const token of state.tokens) {
      for (const child of token.children ?? []) {
        if (child.type === 'text') child.content = child.content.replace('@@', 'v1.2.3');
      }
    }
  })"
>
Version: @@
</elf-md-page>`;

const outlineCode = `<elf-md-page id="doc" src="/docs/guide.md"></elf-md-page>

<elf-md-outline target="doc" :max-depth="3"></elf-md-outline>

<elf-defaults-provider :defaults.prop="{
  'elf-md-page': { theme: 'minimal', codeTheme: 'material' },
  'elf-md-outline': { maxDepth: 2 }
}">
  <elf-md-page># Inherited defaults</elf-md-page>
</elf-defaults-provider>`;

defineStyle(
  articleStyles,
  `
  .labs-warning { margin-bottom: var(--elf-space-4); }
  .guide-code { margin-bottom: var(--elf-space-4); }
`,
);

const PageMarkdownPageGuide = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="guide" tag="MD Page" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>

    <section class="docs-section">
      <h2>${t("quickStartTitle")}</h2>
      <p>${t("quickStartBody")}</p>
      <elf-code-card class="guide-code" variant="workbench" :items.prop=${codeCardItem(
        "quick-start.md",
        "html",
        quickStartCode,
      )} :lineNumbers.prop=${false}></elf-code-card>
    </section>

    <section class="docs-section">
      <h2>${t("inputsTitle")}</h2>
      <p>${t("inputsBody")}</p>
      <elf-code-card class="guide-code" variant="workbench" :items.prop=${codeCardItem(
        "inputs.md",
        "html",
        inputsCode,
      )} :lineNumbers.prop=${false}></elf-code-card>
    </section>

    <section class="docs-section">
      <h2>${t("syntaxTitle")}</h2>
      <p>${t("syntaxBody")}</p>
      <ul class="docs-checklist">
        <li>${t("anchorsItem")}</li>
        <li>${t("containersItem")}</li>
        <li>${t("codeGroupsItem")}</li>
        <li>${t("taskListsItem")}</li>
        <li>${t("footnotesItem")}</li>
        <li>${t("tablesItem")}</li>
        <li>${t("htmlItem")}</li>
      </ul>
    </section>

    <section class="docs-section">
      <h2>${t("themeTitle")}</h2>
      <p>${t("themeBody")}</p>
      <elf-code-card class="guide-code" variant="workbench" :items.prop=${codeCardItem(
        "theme.md",
        "html",
        themeCode,
      )} :lineNumbers.prop=${false}></elf-code-card>
    </section>

    <section class="docs-section">
      <h2>${t("extendTitle")}</h2>
      <p>${t("extendBody")}</p>
      <elf-code-card class="guide-code" variant="workbench" :items.prop=${codeCardItem(
        "extend.ts",
        "html",
        extendCode,
      )} :lineNumbers.prop=${false}></elf-code-card>
    </section>

    <section class="docs-section">
      <h2>${t("outlineTitle")}</h2>
      <p>${t("outlineBody")} ${t("defaultsBody")}</p>
      <elf-code-card class="guide-code" variant="workbench" :items.prop=${codeCardItem(
        "outline.md",
        "html",
        outlineCode,
      )} :lineNumbers.prop=${false}></elf-code-card>
    </section>

    <section class="docs-section">
      <h2>${t("labsTitle")}</h2>
      <p>${t("labsBody")}</p>
      <elf-link href="#/labs/md-page">${t("labsTitle")} →</elf-link>
    </section>
  </elf-container>
`);

export { PageMarkdownPageGuide };
