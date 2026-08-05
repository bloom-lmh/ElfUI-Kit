import { defineHtml, defineStyle, useRef } from "@elfui/core";

import "@elfui/kit/labs";
import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "MD Page 文档页", en: "MD Page" },
  description: {
    zh: "在 Shadow DOM 中把原生 Markdown 渲染成 VitePress 风格页面，支持标题锚点、大纲事件、代码高亮、frontmatter 标题、远程文件与可个性化主题。",
    en: "Renders raw Markdown into a VitePress-style page inside Shadow DOM, with heading anchors, outline events, code highlighting, frontmatter titles, remote files, and customizable theming.",
  },
  warning: {
    zh: "实验性 API：请锁定版本；属性、事件与 DOM 结构仍可能调整。",
    en: "Experimental API: pin versions; props, events, and DOM structure may still change.",
  },
  demo: { zh: "发布指南", en: "Release guide" },
  titleLabel: { zh: "页面标题", en: "Page title" },
  none: { zh: "未解析", en: "None" },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  methods: { zh: "方法", en: "Methods" },
  contentDesc: {
    zh: "编程式 Markdown 源码；默认插槽优先。",
    en: "Markdown source as a property; the default slot takes precedence.",
  },
  srcDesc: {
    zh: "可选的 Markdown 文件地址，按需 fetch。",
    en: "Optional Markdown file URL fetched on demand.",
  },
  maxWidthDesc: { zh: "内容列宽度。", en: "Content column width." },
  baseLevelDesc: {
    zh: "标题起点层级，默认 h1 → h2。",
    en: "Base heading level; h1 maps here by default.",
  },
  codeThemeDesc: {
    zh: "代码主题族，auto 跟随明暗。",
    en: "Code theme family; auto follows light/dark.",
  },
  tocDesc: {
    zh: "生成标题锚点并输出大纲。",
    en: "Generates heading anchors and emits the outline.",
  },
  allowHtmlDesc: {
    zh: "允许 Markdown 中的原始 HTML（VitePress 行为）。",
    en: "Allows raw HTML in Markdown, like VitePress.",
  },
  sanitizeDesc: {
    zh: "渲染后使用 DOMPurify 清洗 HTML（动态加载）。",
    en: "Sanitizes the rendered HTML with DOMPurify (lazy-loaded).",
  },
  densityDesc: { zh: "内容密度预设。", en: "Content density preset." },
  taskListsDesc: {
    zh: "启用 GFM 任务列表。",
    en: "Enables GFM task lists.",
  },
  containersDesc: {
    zh: "自定义提示容器名（tip / warning / danger / info…）。",
    en: "Custom callout container names (tip / warning / danger / info…).",
  },
  footnotesDesc: { zh: "启用脚注。", en: "Enables footnotes." },
  codeToolsDesc: {
    zh: "代码语言标牌、复制按钮与 {1,3-5} 行高亮。",
    en: "Code language labels, copy buttons, and {1,3-5} line highlighting.",
  },
  baseDesc: {
    zh: "src 内容的相对链接/图片解析基准地址。",
    en: "Base URL for relative links and images in fetched markdown.",
  },
  themeDesc: {
    zh: "命名主题预设：default / minimal / paper / midnight。",
    en: "Named theme preset: default / minimal / paper / midnight.",
  },
  tokensDesc: {
    zh: "逐变量覆盖 --elf-md-* 主题变量。",
    en: "Per-variable overrides for --elf-md-* theme tokens.",
  },
  parserDesc: {
    zh: "完全接管解析的自定义解析器。",
    en: "Custom parser that fully replaces the built-in pipeline.",
  },
  extendDesc: {
    zh: "规则级扩展：修改 markdown-it 实例。",
    en: "Rule-level extension mutating the markdown-it instance.",
  },
  renderHookDesc: {
    zh: "注入 DOM 前的最终 HTML 变换。",
    en: "Final HTML transformation before DOM injection.",
  },
  linkClickDesc: {
    zh: "点击链接时触发，preventDefault 可阻止跳转。",
    en: "Fires on link clicks; preventDefault blocks navigation.",
  },
  activeChangeDesc: {
    zh: "滚动经过标题时触发，携带当前章节 id。",
    en: "Fires when a heading scrolls into view with its id.",
  },
  outlineNote: {
    zh: "右侧目录由配套的 elf-md-outline 组件渲染，自动联动大纲与滚动高亮。",
    en: "The side outline is rendered by the companion elf-md-outline component, synced with toc and scroll events.",
  },
  globalTitle: { zh: "全局默认配置", en: "Global defaults" },
  globalNote: {
    zh: "用 elf-defaults-provider 统一注入 md-page / md-outline 的默认配置，单个实例的属性仍然优先。",
    en: "Use elf-defaults-provider to share md-page / md-outline defaults; instance props still win.",
  },
  minimalName: { zh: "Minimal 主题", en: "Minimal theme" },
  paperName: { zh: "Paper 主题 · 实例覆盖", en: "Paper theme · instance override" },
  copyLabel: { zh: "复制代码", en: "Copy code" },
  copiedLabel: { zh: "已复制", en: "Copied" },
  customTitle: { zh: "自定义解析规则", en: "Custom parsing rules" },
  customBody: {
    zh: "`extend` 把 `@version@` 替换为版本号，`render` 把 `__BUILD__` 替换为构建命令；两种占位都在正文里。",
    en: "`extend` replaces `@version@` with the version; `render` swaps `__BUILD__` for the build command.",
  },
  customWarnTitle: { zh: "扩展点说明", en: "Extension points" },
  customWarnBody: {
    zh: "默认插件装好后 `extend` 才执行，因此可以覆盖任何规则；`render` 是注入 DOM 前的最后一道变换。",
    en: "`extend` runs after the default plugins, so any rule can be overridden; `render` is the last transformation before DOM injection.",
  },
  customNote: { zh: "extend / render 运行时生效", en: "extend / render applied at runtime" },
  remoteTitle: { zh: "远程文件与链接拦截", en: "Remote files & link interception" },
  remoteStatus: { zh: "最近链接", en: "Last link" },
  remoteHint: {
    zh: "点击正文中的相对链接，可在状态栏看到 base 重写后的地址；preventDefault 可接管路由。",
    en: "Click a relative link to see its base-resolved href in the status; preventDefault can take over routing.",
  },
  outlineApiTitle: { zh: "elf-md-outline API", en: "elf-md-outline API" },
  outlineProps: { zh: "大纲属性", en: "Outline props" },
  outlineEvents: { zh: "大纲事件", en: "Outline events" },
  outlineMethods: { zh: "大纲方法", en: "Outline methods" },
  outlineTargetDesc: { zh: "关联 elf-md-page 的 id。", en: "Id of the target elf-md-page." },
  outlineTocDesc: {
    zh: "直接传入大纲数据，优先于目标查找。",
    en: "Direct outline data; takes precedence over the target lookup.",
  },
  outlineMaxDepthDesc: { zh: "最多展示的标题深度。", en: "Maximum heading depth to render." },
  outlineLabelDesc: { zh: "导航的无障碍标签。", en: "Accessible label for the navigation." },
  outlineEmptyTextDesc: {
    zh: "无大纲时的占位文本。",
    en: "Placeholder when the outline is empty.",
  },
  outlineSelectDesc: {
    zh: "点击条目时触发，携带标题 id。",
    en: "Fires when an entry is clicked with its id.",
  },
  outlineScrollToDesc: {
    zh: "滚动到目标标题；返回是否找到。",
    en: "Scrolls to the target heading; returns whether it was found.",
  },
  outlineActiveDesc: { zh: "返回当前高亮的标题 id。", en: "Returns the active heading id." },
  labelsDesc: {
    zh: "覆盖复制/加载等文案。",
    en: "Overrides for copy and loading labels.",
  },
  scrollRootDesc: {
    zh: "滚动容器选择器，用于滚动跟踪与代码懒高亮。",
    en: "Scroll container selector for scroll spy and lazy highlighting.",
  },
  anchorsDesc: {
    zh: "渲染悬停显示的标题锚点。",
    en: "Renders hoverable heading anchor links.",
  },
  codeGroupsDesc: {
    zh: "启用 VitePress 风格的代码组（tab 切换）。",
    en: "Enables VitePress-style tabbed code groups.",
  },
  tocChangeDesc: {
    zh: "大纲变化时触发，携带标题数组。",
    en: "Fires when the outline changes with the heading list.",
  },
  titleChangeDesc: {
    zh: "frontmatter title 变化时触发。",
    en: "Fires when the frontmatter title changes.",
  },
  loadDesc: { zh: "src 文件加载成功。", en: "Fires when the src file loads." },
  errorDesc: { zh: "src 加载失败。", en: "Fires when the src file fails to load." },
  renderDesc: { zh: "重新解析当前 Markdown。", en: "Re-parses the current Markdown." },
  outlineDesc: { zh: "返回当前标题大纲。", en: "Returns the current heading outline." },
  getHtmlDesc: { zh: "返回渲染后的 HTML 字符串。", en: "Returns the rendered HTML string." },
  quickStart: { zh: "快速开始", en: "Quick start" },
  intro: {
    zh: "这是一段**加粗**正文，包含[链接](#features)，以及由标题、表格、引用和代码块组成的完整页面结构。",
    en: "A paragraph with **bold** text, a [link](#features), plus headings, tables, quotes, and code blocks.",
  },
  features: { zh: "功能", en: "Features" },
  anchorFeature: { zh: "标题锚点与大纲事件", en: "Heading anchors and outline events" },
  tableFeature: { zh: "表格与引用样式", en: "Table and quote styling" },
  codeFeature: { zh: "Shiki 代码高亮", en: "Shiki code highlighting" },
  taskFeature: { zh: "任务列表", en: "Task lists" },
  containerFeature: { zh: "提示容器", en: "Callout containers" },
  configTitle: { zh: "配置示例", en: "Configuration" },
  config: { zh: "配置", en: "Config" },
  defaultValue: { zh: "默认值", en: "Default" },
  note: { zh: "说明", en: "Description" },
  maxWidthNote: { zh: "内容列宽", en: "Content column width" },
  themeNote: { zh: "代码主题，auto 跟随明暗", en: "Code theme; auto follows light/dark" },
  levelNote: { zh: "标题起点层级", en: "Base heading level" },
  quote: {
    zh: "引用块使用主色边框与浅色底，与设计令牌保持一致。",
    en: "Blockquotes use a primary border and tinted surface aligned with design tokens.",
  },
  embed: { zh: "支持内嵌组件", en: "Embedded components" },
  checklist: { zh: "核对发布项", en: "Release checklist" },
  taskDone: { zh: "更新版本号", en: "Bump the version" },
  taskTodo: { zh: "补充回归截图", en: "Add regression screenshots" },
  containerTitle: { zh: "发布前检查", en: "Before you ship" },
  containerBody: {
    zh: "先跑聚焦测试与类型检查，再执行完整构建。",
    en: "Run focused tests and type checks before the full build.",
  },
  footnoteText: { zh: "构建命令", en: "Build command" },
  footnoteBody: { zh: "pnpm build && pnpm build:lib", en: "pnpm build && pnpm build:lib" },
  codeLineHint: { zh: "行高亮", en: "Line highlight" },
});

const pageTitle = useRef("");

const onTitleChange = (event: CustomEvent<string>): void => pageTitle.set(event.detail);
const titleText = (): string => pageTitle.value || t("none");

const remoteLink = useRef("");
const onRemoteLink = (event: CustomEvent<{ href: string }>): void => {
  event.preventDefault();
  remoteLink.set(event.detail.href);
};
const remoteLinkText = (): string => remoteLink.value || t("none");

const demoMarkdown = (): string => `---
title: ${t("demo")}
---

# ${t("quickStart")}

${t("intro")}

## ${t("features")}

- ${t("anchorFeature")}
- ${t("tableFeature")}
- ${t("codeFeature")}
- ${t("taskFeature")}
- ${t("containerFeature")}

### ${t("checklist")}

- [x] ${t("taskDone")}
- [ ] ${t("taskTodo")}

::: tip ${t("containerTitle")}

${t("containerBody")}

:::

正文${t("footnoteText")}[^1]。

[^1]: ${t("footnoteBody")}

## ${t("configTitle")}

| ${t("config")} | ${t("defaultValue")} | ${t("note")} |
| --- | --- | --- |
| max-width | 760px | ${t("maxWidthNote")} |
| code-theme | auto | ${t("themeNote")} |
| base-heading-level | 2 | ${t("levelNote")} |

> ${t("quote")}

\`\`\`ts {1} title="release.ts"
const markdown = "hello";
export const version = "0.0.2-beta.1";
\`\`\`

::: code-group
\`\`\`ts [release.ts]
export const version = "0.0.2-beta.1";
\`\`\`
\`\`\`bash [发布]
pnpm publish
\`\`\`
:::

<p><elf-tag type="success">${t("embed")}</elf-tag></p>`;

const shortMarkdown = (): string => `# ${t("quickStart")}

${t("intro")}

\`\`\`ts
export const version = "0.0.2-beta.1";
\`\`\``;

const mdDefaults = {
  "elf-md-page": { codeTheme: "material", maxWidth: "680px" },
};

const mdLabels = () => ({ copy: t("copyLabel"), copied: t("copiedLabel") });

const globalCode = `<elf-defaults-provider :defaults.prop="{
  'elf-md-page': { codeTheme: 'material', maxWidth: '680px' }
}">
  <elf-md-page theme="minimal">
# Quick start

A paragraph with **bold** text and a [link](#features).

\`\`\`ts
export const version = "0.0.2-beta.1";
\`\`\`
  </elf-md-page>
  <elf-md-page theme="paper" :labels.prop="{ copy: 'Copy code', copied: 'Copied' }">
# Quick start

A paragraph with **bold** text and a [link](#features).

\`\`\`ts
export const version = "0.0.2-beta.1";
\`\`\`
  </elf-md-page>
</elf-defaults-provider>`;

const extendMd = (md: unknown): void => {
  const instance = md as {
    core: {
      ruler: {
        after: (
          name: string,
          id: string,
          rule: (state: {
            tokens: Array<{ type: string; children?: Array<{ type: string; content: string }> }>;
          }) => void,
        ) => void;
      };
    };
  };
  instance.core.ruler.after("inline", "version-placeholder", (state) => {
    for (const token of state.tokens) {
      if (token.type !== "inline") continue;
      for (const child of token.children ?? []) {
        if (child.type === "text") {
          child.content = child.content.replaceAll("@version@", "v1.2.3-custom");
        }
      }
    }
  });
};

const renderHook = (html: string): string =>
  html.replaceAll("__BUILD__", "pnpm build && pnpm test");

const customMarkdown = (): string => `# ${t("customTitle")}

${t("customBody")}

版本：@version@

构建：__BUILD__

::: warning ${t("customWarnTitle")}

${t("customWarnBody")}

:::`;

const customCode = `<elf-md-page
  :extend.prop="extendMd"
  :render.prop="renderHook"
  code-theme="vitesse"
>
# Custom rules

\`extend\` replaces \`@version@\` with the version; \`render\` swaps \`__BUILD__\` for the build command.

Version: @version@

Build: __BUILD__

::: warning Extension points

\`extend\` runs after the default plugins, so any rule can be overridden; \`render\` is the last transformation before DOM injection.

:::
</elf-md-page>`;

const customScript = `const extendMd = (md) => {
  md.core.ruler.after("inline", "version-placeholder", (state) => {
    for (const token of state.tokens) {
      if (token.type !== "inline") continue;
      for (const child of token.children ?? []) {
        if (child.type === "text") {
          child.content = child.content.replaceAll("@version@", "v1.2.3-custom");
        }
      }
    }
  });
};

const renderHook = (html) => html.replaceAll("__BUILD__", "pnpm build && pnpm test");`;

const remoteCode = `<elf-md-page
  src="/md-page-demo.md"
  base="/md/"
  @link-click="onLinkClick"
></elf-md-page>`;

const remoteScript = `const onLinkClick = (event) => {
  // event.detail.href is resolved against base; preventDefault to take over routing.
  console.log(event.detail.href);
};`;

const outlinePropRows = () => [
  { name: "target", type: "string", default: "''", desc: t("outlineTargetDesc") },
  { name: "toc", type: "MdPageTocEntry[]", default: "[]", desc: t("outlineTocDesc") },
  { name: "max-depth", type: "number", default: "3", desc: t("outlineMaxDepthDesc") },
  { name: "label", type: "string", default: "'Page outline'", desc: t("outlineLabelDesc") },
  { name: "empty-text", type: "string", default: "'No outline'", desc: t("outlineEmptyTextDesc") },
];

const outlineEventRows = () => [
  { name: "select", type: "CustomEvent<string>", default: "—", desc: t("outlineSelectDesc") },
];

const outlineMethodRows = () => [
  { name: "scrollTo(id)", type: "boolean", desc: t("outlineScrollToDesc") },
  { name: "active()", type: "string", desc: t("outlineActiveDesc") },
];

const code = `<elf-md-page
  id="md-demo"
  max-width="720px"
  code-theme="material"
  :base-heading-level="2"
  @title-change="onTitleChange"
>
---
title: Release guide
---

# Quick start

A paragraph with **bold** text, a [link](#features), plus headings, tables, quotes, and code blocks.

## Features

- Heading anchors and outline events
- Table and quote styling
- Shiki code highlighting
- Task lists
- Callout containers

### Release checklist

- [x] Bump the version
- [ ] Add regression screenshots

::: tip Before you ship

Run focused tests and type checks before the full build.

:::

Build command[^1].

[^1]: pnpm build && pnpm build:lib

## Configuration

| Config | Default | Description |
| --- | --- | --- |
| max-width | 760px | Content column width |
| code-theme | auto | Code theme; auto follows light/dark |
| base-heading-level | 2 | Base heading level |

> Blockquotes use a primary border and tinted surface aligned with design tokens.

\`\`\`ts {1} title="release.ts"
const markdown = "hello";
export const version = "0.0.2-beta.1";
\`\`\`

::: code-group
\`\`\`ts [release.ts]
export const version = "0.0.2-beta.1";
\`\`\`
\`\`\`bash [发布]
pnpm publish
\`\`\`
:::

<p><elf-tag type="success">Embedded components</elf-tag></p>
</elf-md-page>

<elf-md-outline target="md-demo" :max-depth="3"></elf-md-outline>`;

const script = `import "@elfui/kit/labs";

const onTocChange = (event) => {
  // event.detail: [{ id, text, depth }]
};

const onTitleChange = (event) => {
  // event.detail: frontmatter title
};`;

const propRows = () => [
  { name: "content", type: "string", default: "''", desc: t("contentDesc") },
  { name: "src", type: "string", default: "''", desc: t("srcDesc") },
  { name: "max-width", type: "string", default: "'760px'", desc: t("maxWidthDesc") },
  { name: "base-heading-level", type: "number", default: "2", desc: t("baseLevelDesc") },
  {
    name: "code-theme",
    type: "auto | github | material | vitesse",
    default: "'auto'",
    desc: t("codeThemeDesc"),
  },
  { name: "toc", type: "boolean", default: "true", desc: t("tocDesc") },
  { name: "anchors", type: "boolean", default: "true", desc: t("anchorsDesc") },
  { name: "allow-html", type: "boolean", default: "true", desc: t("allowHtmlDesc") },
  { name: "sanitize", type: "boolean", default: "false", desc: t("sanitizeDesc") },
  {
    name: "labels",
    type: "{ copy?; copied?; loading? }",
    default: "{}",
    desc: t("labelsDesc"),
  },
  {
    name: "density",
    type: "default | comfortable | compact",
    default: "'default'",
    desc: t("densityDesc"),
  },
  { name: "task-lists", type: "boolean", default: "true", desc: t("taskListsDesc") },
  {
    name: "containers",
    type: "string[]",
    default: "['tip','warning','danger','info']",
    desc: t("containersDesc"),
  },
  { name: "footnotes", type: "boolean", default: "true", desc: t("footnotesDesc") },
  { name: "code-groups", type: "boolean", default: "true", desc: t("codeGroupsDesc") },
  { name: "code-tools", type: "boolean", default: "true", desc: t("codeToolsDesc") },
  { name: "base", type: "string", default: "''", desc: t("baseDesc") },
  { name: "scroll-root", type: "string", default: "''", desc: t("scrollRootDesc") },
  {
    name: "theme",
    type: "default | minimal | paper | midnight",
    default: "'default'",
    desc: t("themeDesc"),
  },
  { name: "tokens", type: "Record<string, string>", default: "{}", desc: t("tokensDesc") },
  { name: "parser", type: "MdPageParser", default: "null", desc: t("parserDesc") },
  { name: "extend", type: "MdPageExtend", default: "null", desc: t("extendDesc") },
  { name: "render", type: "MdPageRenderHook", default: "null", desc: t("renderHookDesc") },
];

const eventRows = () => [
  {
    name: "toc-change",
    type: "CustomEvent<MdPageTocEntry[]>",
    default: "—",
    desc: t("tocChangeDesc"),
  },
  { name: "title-change", type: "CustomEvent<string>", default: "—", desc: t("titleChangeDesc") },
  { name: "load", type: "CustomEvent<string>", default: "—", desc: t("loadDesc") },
  { name: "error", type: "CustomEvent<string>", default: "—", desc: t("errorDesc") },
  {
    name: "link-click",
    type: "CustomEvent<{ href; target; text }>",
    default: "—",
    desc: t("linkClickDesc"),
  },
  {
    name: "active-change",
    type: "CustomEvent<string>",
    default: "—",
    desc: t("activeChangeDesc"),
  },
];

const methodRows = () => [
  { name: "render()", type: "void", desc: t("renderDesc") },
  { name: "outline()", type: "MdPageTocEntry[]", desc: t("outlineDesc") },
  { name: "getHtml()", type: "string", desc: t("getHtmlDesc") },
];

defineStyle(
  articleStyles,
  `
  .labs-warning { margin-bottom: var(--elf-space-4); }
  .md-page-demo { padding: 8px 4px 4px; }
  .md-page-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 190px;
    gap: 24px;
    align-items: start;
  }
  .md-page-layout elf-md-outline {
    position: sticky;
    top: 12px;
    max-height: calc(100vh - 160px);
    overflow-y: auto;
    padding: 8px 10px;
    border: 1px solid var(--elf-border);
    border-radius: var(--elf-radius-md);
    background: var(--elf-bg-paper);
  }
  @media (max-width: 720px) {
    .md-page-layout { grid-template-columns: 1fr; }
    .md-page-layout elf-md-outline { position: static; max-height: none; }
  }
  .md-page-status { color: var(--elf-text-secondary); font-size: var(--elf-font-size-sm); }
  .md-remote-status { display: grid; gap: 2px; text-align: right; }
  .md-page-outline-note { color: var(--elf-text-secondary); font-size: 12px; text-align: center; }
  .md-defaults-grid {
    display: grid;
    gap: 18px;
  }
  .md-defaults-grid elf-md-page {
    padding: 14px 18px;
    border: 1px solid var(--elf-border);
    border-radius: var(--elf-radius-md);
    background: var(--elf-bg-paper);
  }
  .md-remote-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
    align-items: start;
  }
  .md-remote-grid elf-md-page {
    padding: 14px 18px;
    border: 1px solid var(--elf-border);
    border-radius: var(--elf-radius-md);
    background: var(--elf-bg-paper);
  }
  @media (max-width: 720px) {
    .md-remote-grid {
      grid-template-columns: 1fr;
    }
  }
`,
);

const PageLabsMdPage = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="MD Page" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status" class="md-page-status">${t("titleLabel")}: ${titleText()}</span>
      <div class="md-page-demo">
        <div class="md-page-layout">
          <elf-md-page
            id="md-demo"
            max-width="720px"
            code-theme="material"
            :base-heading-level=${2}
            @title-change=${onTitleChange}
          >${demoMarkdown()}</elf-md-page>
          <elf-md-outline target="md-demo" :max-depth=${3}></elf-md-outline>
        </div>
        <p class="md-page-outline-note">${t("outlineNote")}</p>
      </div>
    </elf-playground>
    <elf-playground :title=${t("globalTitle")} :code=${globalCode}>
      <p slot="status" class="md-page-status">${t("globalNote")}</p>
      <div class="md-defaults-grid">
        <elf-defaults-provider :defaults.prop=${mdDefaults}>
          <elf-md-page theme="minimal">${shortMarkdown()}</elf-md-page>
          <elf-md-page theme="paper" :labels.prop=${mdLabels()}>${shortMarkdown()}</elf-md-page>
        </elf-defaults-provider>
      </div>
    </elf-playground>
    <elf-playground :title=${t("remoteTitle")} :code=${remoteCode} :script=${remoteScript}>
      <div slot="status" class="md-page-status md-remote-status">
        <span>${t("remoteStatus")}: ${remoteLinkText()}</span>
        <span>${t("remoteHint")}</span>
      </div>
      <div class="md-remote-grid">
        <elf-md-page
          class="md-remote-demo"
          src="/md-page-demo.md"
          base="/md/"
          @link-click=${onRemoteLink}
        ></elf-md-page>
      </div>
    </elf-playground>
    <elf-playground :title=${t("customTitle")} :code=${customCode} :script=${customScript}>
      <span slot="status" class="md-page-status">${t("customNote")}</span>
      <elf-md-page
        class="md-custom-demo"
        :extend.prop=${extendMd}
        :render.prop=${renderHook}
        code-theme="vitesse"
      >${customMarkdown()}</elf-md-page>
    </elf-playground>
    <h2>${t("api")}</h2>
    <elf-props-table :title=${t("props")} :rows=${propRows()} />
    <elf-props-table :title=${t("events")} :rows=${eventRows()} />
    <elf-props-table :title=${t("methods")} :rows=${methodRows()} />
    <h3>${t("outlineApiTitle")}</h3>
    <elf-props-table :title=${t("outlineProps")} :rows=${outlinePropRows()} />
    <elf-props-table :title=${t("outlineEvents")} :rows=${outlineEventRows()} />
    <elf-props-table :title=${t("outlineMethods")} :rows=${outlineMethodRows()} />
  </elf-container>
`);

export { PageLabsMdPage };
