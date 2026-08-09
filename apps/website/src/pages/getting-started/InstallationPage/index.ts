import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";
import { codeCard, codeTabs, MD_EMBED_STYLE, quote, table } from "../../shared/md-embed";

const t = createDocsTranslator({
  kicker: { zh: "快速入门", en: "Getting started" },
  title: { zh: "安装", en: "Installation" },
  description: {
    zh: "用 elf-md-page 以 Markdown 驱动渲染；代码卡片使用 elf-code-card，表格使用 elf-table。",
    en: "Rendered with elf-md-page Markdown; code cards use elf-code-card and tables use elf-table.",
  },
  requirementsTitle: { zh: "环境要求", en: "Requirements" },
  requirementsLead: {
    zh: "开始前先确认浏览器与包管理器基线，避免把兼容性问题当成安装失败。",
    en: "Confirm the browser and package-manager baseline first so compatibility issues are not mistaken for installation failures.",
  },
  browser: { zh: "浏览器", en: "Browser" },
  target: { zh: "支持目标", en: "Target" },
  verification: { zh: "当前验证", en: "Current verification" },
  notes: { zh: "说明", en: "Notes" },
  chromium: { zh: "Chromium / Firefox / Edge", en: "Chromium / Firefox / Edge" },
  currentTwo: { zh: "当前及前两个稳定版本", en: "Current and previous two stable releases" },
  chromiumVerify: {
    zh: "Chromium 自动化 + 人工截图",
    en: "Chromium automation + manual screenshots",
  },
  safari: { zh: "Safari", en: "Safari" },
  safariTarget: { zh: "Safari 16.4 及以上", en: "Safari 16.4 and later" },
  targetOnly: {
    zh: "目标；发布前需要补充矩阵验证",
    en: "Target; matrix verification required before release",
  },
  safariNote: {
    zh: "重点验证 Shadow DOM、Popover、焦点和日期控件",
    en: "Prioritize Shadow DOM, Popover, focus, and date controls",
  },
  mobile: { zh: "移动端", en: "Mobile" },
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
    zh: "ElfUI 不为缺少 Shadow DOM 的旧浏览器维护第二套渲染器。",
    en: "ElfUI does not maintain a second renderer for browsers without Shadow DOM.",
  },
  capability: { zh: "能力", en: "Capability" },
  usage: { zh: "ElfUI 用途", en: "How ElfUI uses it" },
  fallback: { zh: "缺失时", en: "When unavailable" },
  ceName: { zh: "Custom Elements", en: "Custom Elements" },
  ceUsage: { zh: "组件注册与生命周期", en: "Component registration and lifecycle" },
  shadowName: { zh: "Shadow DOM", en: "Shadow DOM" },
  shadowUsage: {
    zh: "样式隔离、插槽和焦点边界",
    en: "Style isolation, slots, and focus boundaries",
  },
  observerName: { zh: "IntersectionObserver", en: "IntersectionObserver" },
  observerUsage: {
    zh: "尺寸、可见性和虚拟列表测量",
    en: "Size, visibility, and virtual-list measurement",
  },
  abortName: { zh: "AbortController", en: "AbortController" },
  abortUsage: { zh: "卸载时取消监听和异步任务", en: "Cancel listeners and async work on unmount" },
  colorName: { zh: "color-mix()", en: "color-mix()" },
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
    zh: "请附浏览器与系统版本、最小复现、控制台信息、预期/实际行为和截图。",
    en: "Include browser and OS versions, a minimal reproduction, console output, expected and actual behavior, and screenshots.",
  },
  createTitle: { zh: "创建项目", en: "Create a project" },
  scaffoldTitle: { zh: "新项目：官方脚手架", en: "New project: official scaffold" },
  scaffoldBody: {
    zh: "脚手架会创建 Vite 应用并配置 Macro 组件主线。",
    en: "The scaffold creates a Vite application on the Macro component mainline.",
  },
  routerTitle: { zh: "带路由的项目", en: "Routed project" },
  routerBody: {
    zh: "需要客户端路由时，创建时直接加入 @elfui/router。",
    en: "Add @elfui/router during creation when client routing is required.",
  },
  bareTitle: { zh: "最小空项目", en: "Minimal project" },
  bareBody: {
    zh: "使用 --bare 创建不含教学示例的最小项目。",
    en: "Use --bare to create a minimal project without tutorial examples.",
  },
  existingTitle: { zh: "已有项目", en: "Existing project" },
  existingBody: {
    zh: "已有 Vite 项目可以跳过脚手架，直接安装 @elfui/kit。",
    en: "Existing Vite projects can skip the scaffold and install @elfui/kit directly.",
  },
  scaffoldLabel: { zh: "脚手架", en: "Scaffold" },
  routerLabel: { zh: "路由", en: "Router" },
  bareLabel: { zh: "最小项目", en: "Minimal" },
  installTitle: { zh: "安装组件库", en: "Install the Kit" },
  installLead: {
    zh: "通过包管理器安装 @elfui/kit。使用按需注册、theme() 或 useVariant() 时，同时安装兼容版本的 @elfui/core。",
    en: "Install @elfui/kit with your package manager. Add a compatible @elfui/core when using on-demand registration, theme(), or useVariant().",
  },
  installFooter: { zh: "在项目根目录的终端中执行", en: "Run in the project root" },
  registerTitle: { zh: "注册组件库", en: "Register the Kit" },
  registerLead: {
    zh: "导入包本身不会注册标签。调用 registerAllComponents() 全量注册，或者使用 @elfui/core 按需注册命名导出的构造器。",
    en: "Importing the package does not register tags. Call registerAllComponents() for the full set, or register named constructors on demand with @elfui/core.",
  },
  entryTitle: { zh: "应用入口", en: "Application entry" },
  entryFooter: { zh: "应用入口，显式执行一次", en: "Application entry; invoke once" },
  optionalTitle: { zh: "注册模式", en: "Registration modes" },
  optionalLead: {
    zh: "全量和按需模式使用同一个 @elfui/kit 根入口，不提供 Labs、组件或样式 subpath。",
    en: "Full and on-demand modes use the same @elfui/kit root; there are no Labs, component, or style subpaths.",
  },
  entriesTitle: { zh: "公开入口", en: "Public entries" },
  entriesLead: {
    zh: "下表是 @elfui/kit 当前的稳定入口。",
    en: "The table lists the current stable entries of @elfui/kit.",
  },
  entryName: { zh: "入口", en: "Entry" },
  entryType: { zh: "类型", en: "Type" },
  entryDesc: { zh: "说明", en: "Description" },
  useTitle: { zh: "使用组件", en: "Use a component" },
  useLead: {
    zh: "组件完成显式注册后，普通 HTML 和 Macro 组件模板都可以使用 elf-* 标签。",
    en: "After explicit registration, plain HTML and Macro templates can use elf-* tags.",
  },
  htmlTitle: { zh: "普通 HTML 页面", en: "Plain HTML page" },
  htmlBody: {
    zh: "模块脚本调用全量注册后，页面中的 elf-* 标签会正常升级并渲染。",
    en: "After the module invokes full registration, elf-* tags upgrade and render normally.",
  },
  macroTitle: { zh: "Macro 组件模板", en: "Macro component template" },
  macroBody: {
    zh: "在 defineHtml 模板中组合组件；编写宏组件需要 Vite Plugin。",
    en: "Compose components inside defineHtml; authoring macros requires the Vite Plugin.",
  },
  previewTitle: { zh: "第一个组件", en: "First component" },
  previewBody: {
    zh: "下面的 elf-button 来自组件库的公开入口。",
    en: "The elf-button below comes from the Kit's public entry.",
  },
  authorTitle: { zh: "编写自己的 Macro 组件？", en: "Authoring your own macro components?" },
  authorBody: {
    zh: "显式安装 Core 与 Vite Plugin，并保持相同 beta 版本。",
    en: "Install Core and the Vite Plugin explicitly and keep them on the same beta.",
  },
  buildLink: { zh: "构建与样式", en: "Build and styles" },
  verifyTitle: { zh: "验证安装", en: "Verify the installation" },
  verifyLead: {
    zh: "页面能打开只是第一步，再确认下面四项。",
    en: "A rendered page is only the start; confirm these four checks as well.",
  },
  verifyOne: {
    zh: "开发服务器没有编译警告，控制台没有自定义元素冲突。",
    en: "The dev server has no compiler warnings and no custom-element conflicts.",
  },
  verifyTwo: {
    zh: "主题、语言和默认配置能够通过 Provider 传入组件。",
    en: "Theme, locale, and defaults reach components through Providers.",
  },
  verifyThree: {
    zh: "生产构建通过，输出中没有重复打包底层运行时。",
    en: "The production build passes without duplicating low-level runtimes.",
  },
  verifyFour: {
    zh: "第一个交互组件可以用键盘聚焦和操作。",
    en: "The first interactive component is focusable and operable from the keyboard.",
  },
  nextTitle: { zh: "下一步", en: "Next steps" },
  nextBody: {
    zh: "先看全局配置和主题，再进入组件示例。",
    en: "Review global configuration and theming, then explore component demos.",
  },
  nextAction: { zh: "下一步：全局配置", en: "Next: Global configuration" },
  themeLink: { zh: "主题定制", en: "Theme customization" },
  faqLink: { zh: "常见问题", en: "FAQ" },
  createCardTitle: { zh: "创建项目", en: "Create project" },
  createCardSubtitle: {
    zh: "开始你的第一个 ElfUI 应用",
    en: "Start your first ElfUI application",
  },
  createCardFooter: { zh: "@elfui/kit · Macro 主线", en: "@elfui/kit · Macro mainline" },
  readyTag: { zh: "就绪", en: "Ready" },
  createAction: { zh: "创建项目", en: "Create project" },
  cancelAction: { zh: "取消", en: "Cancel" },
});

const scaffoldCode = ["pnpm create elfui@beta my-app --install", "cd my-app", "pnpm dev"].join(
  "\n",
);
const routerCode = [
  "pnpm create elfui@beta my-app --router --install",
  "cd my-app",
  "pnpm dev",
].join("\n");
const bareCode = ["pnpm create elfui@beta my-app --bare --install", "cd my-app", "pnpm dev"].join(
  "\n",
);
const entryCode = `import { registerAllComponents } from "@elfui/kit";

registerAllComponents();`;
const onDemandCode = `import { registerComponents } from "@elfui/core";
import { Button, Input } from "@elfui/kit";

registerComponents(Button, Input);`;
const htmlCode = [
  '<script type="module">',
  '  import { registerAllComponents } from "@elfui/kit";',
  "  registerAllComponents();",
  "</script>",
  "",
  '<elf-button color="primary">Create project</elf-button>',
].join("\n");
const macroCode = [
  'import { defineHtml, useComponents } from "@elfui/core";',
  'import { Button } from "@elfui/kit";',
  "",
  "useComponents(Button);",
  "",
  "export const App = defineHtml(`",
  '  <elf-button color="primary">Create project</elf-button>',
  "`);",
].join("\n");

const markdown = (): string => `${MD_EMBED_STYLE}<style>
.md-create-card {
  width: min(520px, 100%);
  margin-inline: auto;
}
.md-create-form {
  display: grid;
  gap: 14px;
}
.md-create-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
@media (max-width: 720px) {
  .md-create-actions {
    flex-wrap: wrap;
  }
}
</style>

# ${t("requirementsTitle")}

${t("requirementsLead")}

${table(
  [
    { prop: "browser", label: t("browser") },
    { prop: "target", label: t("target") },
    { prop: "verification", label: t("verification") },
    { prop: "notes", label: t("notes") },
  ],
  [
    {
      browser: t("chromium"),
      target: t("currentTwo"),
      verification: t("chromiumVerify"),
      notes: "—",
    },
    {
      browser: t("safari"),
      target: t("safariTarget"),
      verification: t("targetOnly"),
      notes: t("safariNote"),
    },
    {
      browser: t("mobile"),
      target: t("mobileTarget"),
      verification: t("targetOnly"),
      notes: t("mobileNote"),
    },
  ],
  "browser",
)}

## ${t("capabilitiesTitle")}

${t("capabilitiesLead")}

${table(
  [
    { prop: "capability", label: t("capability") },
    { prop: "usage", label: t("usage") },
    { prop: "fallback", label: t("fallback") },
  ],
  [
    { capability: t("ceName"), usage: t("ceUsage"), fallback: t("unsupported") },
    { capability: t("shadowName"), usage: t("shadowUsage"), fallback: t("unsupported") },
    { capability: t("observerName"), usage: t("observerUsage"), fallback: t("featureDegrades") },
    { capability: t("abortName"), usage: t("abortUsage"), fallback: t("featureDegrades") },
    { capability: t("colorName"), usage: t("cssUsage"), fallback: t("cssFallback") },
  ],
  "capability",
)}

## ${t("testTitle")}

${t("testLead")}

- ${t("testOne")}
- ${t("testTwo")}
- ${t("testThree")}
- ${t("testFour")}

${quote("success", t("reportTitle"), t("reportBody"), false)}

# ${t("createTitle")}

- **${t("scaffoldTitle")}**: ${t("scaffoldBody")}
- **${t("routerTitle")}**: ${t("routerBody")}
- **${t("bareTitle")}**: ${t("bareBody")}
- **${t("existingTitle")}**: ${t("existingBody")}

${codeTabs([
  {
    key: "scaffold",
    label: t("scaffoldLabel"),
    filename: "Terminal",
    language: "bash",
    code: scaffoldCode,
  },
  {
    key: "router",
    label: t("routerLabel"),
    filename: "Terminal",
    language: "bash",
    code: routerCode,
  },
  { key: "bare", label: t("bareLabel"), filename: "Terminal", language: "bash", code: bareCode },
  {
    key: "existing",
    label: t("existingTitle"),
    filename: "Terminal",
    language: "bash",
    code: "pnpm add @elfui/kit",
  },
])}

# ${t("installTitle")}

${t("installLead")}

${codeTabs([
  {
    key: "pnpm",
    label: "pnpm",
    filename: "Terminal",
    language: "bash",
    code: "pnpm add @elfui/kit",
  },
  {
    key: "npm",
    label: "npm",
    filename: "Terminal",
    language: "bash",
    code: "npm install @elfui/kit",
  },
  {
    key: "yarn",
    label: "yarn",
    filename: "Terminal",
    language: "bash",
    code: "yarn add @elfui/kit",
  },
])}

# ${t("registerTitle")}

${t("registerLead")}

## ${t("entryTitle")}

${codeCard(entryCode, "typescript", "src/main.ts")}

## ${t("optionalTitle")}

${t("optionalLead")}

${codeTabs([
  {
    key: "full",
    label: "registerAllComponents",
    filename: "src/main.ts",
    language: "typescript",
    code: entryCode,
  },
  {
    key: "on-demand",
    label: t("optionalTitle"),
    filename: "src/main.ts",
    language: "typescript",
    code: onDemandCode,
  },
])}

## ${t("entriesTitle")}

${t("entriesLead")}

${table(
  [
    { prop: "entry", label: t("entryName") },
    { prop: "type", label: t("entryType") },
    { prop: "desc", label: t("entryDesc") },
  ],
  [{ entry: "@elfui/kit", type: "JavaScript + types", desc: "required" }],
  "entry",
)}

# ${t("useTitle")}

${t("useLead")}

## ${t("htmlTitle")}

${t("htmlBody")}

${codeCard(htmlCode, "html", "index.html")}

## ${t("macroTitle")}

${t("macroBody")}

${codeCard(macroCode, "typescript", "src/App.ts")}

## ${t("previewTitle")}

${t("previewBody")}

<div class="md-embed">
  <elf-card class="md-create-card" variant="elevated" title="${t("createCardTitle")}" subtitle="${t("createCardSubtitle")}" footer="${t("createCardFooter")}">
    <div slot="extra">
      <elf-tag type="success" size="sm">${t("readyTag")}</elf-tag>
    </div>
    <div class="md-create-form">
      <elf-input label="Project name" variant="outlined" placeholder="my-app"></elf-input>
      <div class="md-create-actions">
        <elf-button color="primary">${t("createAction")}</elf-button>
        <elf-button variant="outlined">${t("cancelAction")}</elf-button>
      </div>
    </div>
  </elf-card>
</div>

${quote("warning", t("authorTitle"), `${t("authorBody")} <elf-link href="#/guide/build">${t("buildLink")} →</elf-link>`, false)}

# ${t("verifyTitle")}

${t("verifyLead")}

- ${t("verifyOne")}
- ${t("verifyTwo")}
- ${t("verifyThree")}
- ${t("verifyFour")}

# ${t("nextTitle")}

${t("nextBody")}

- <elf-link href="#/providers/config">${t("nextAction")} →</elf-link>
- <elf-link href="#/providers/theme">${t("themeLink")} →</elf-link>
- <elf-link href="#/getting-started/faq">${t("faqLink")} →</elf-link>`;

defineStyle(
  articleStyles,
  `
  .installation-md {
    width: max(85%, min(100%, 900px));
    max-width: 100%;
    min-width: 0;
    margin-inline: auto;
    box-sizing: border-box;
  }
`,
);

const PageInstallation = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="getting-started" tag="Installation" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <div class="installation-md">
      <elf-md-page
        max-width="100%"
        code-theme="material"
        :base-heading-level=${2}
      >${markdown()}</elf-md-page>
    </div>
  </elf-container>
`);

export { PageInstallation };
