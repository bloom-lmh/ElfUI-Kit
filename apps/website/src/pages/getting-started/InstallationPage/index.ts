import { defineHtml, defineStyle } from "@elfui/core";
import "@elfui/kit/labs";
import type { CodeCardItem } from "@elfui/kit/labs";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "快速入门", en: "Getting started" },
  title: { zh: "安装", en: "Installation" },
  description: {
    zh: "安装 @elfui/kit，在应用入口注册一次，然后用第一个 elf-button 开始。",
    en: "Install @elfui/kit, register it once in the application entry, and start with your first elf-button.",
  },
  requirementsTitle: { zh: "环境要求", en: "Requirements" },
  requirementsLead: {
    zh: "开始前先确认浏览器与包管理器基线，避免把兼容性问题当成安装失败。",
    en: "Confirm the browser and package-manager baseline first so compatibility issues are not mistaken for installation failures.",
  },
  baseline: { zh: "浏览器基线", en: "Browser baseline" },
  baselineValue: { zh: "现代常青浏览器", en: "Modern evergreen browsers" },
  minimum: { zh: "最低目标", en: "Minimum target" },
  minimumValue: { zh: "Safari 16.4+", en: "Safari 16.4+" },
  excluded: { zh: "不支持", en: "Excluded" },
  excludedValue: { zh: "Internet Explorer", en: "Internet Explorer" },
  manager: { zh: "包管理器", en: "Package manager" },
  managerValue: { zh: "pnpm 推荐", en: "pnpm recommended" },
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
  createTitle: { zh: "创建项目", en: "Create a project" },
  scaffoldTitle: { zh: "新项目：官方脚手架", en: "New project: official scaffold" },
  scaffoldBody: {
    zh: "脚手架会创建 Vite 应用并配置 Macro 组件主线，交互过程中选择 Macro。",
    en: "The scaffold creates a Vite application and configures the Macro component mainline; choose Macro during setup.",
  },
  scaffoldLabel: { zh: "脚手架", en: "Scaffold" },
  routerTitle: { zh: "带路由的项目", en: "Routed project" },
  routerLabel: { zh: "路由", en: "Router" },
  routerBody: {
    zh: "需要客户端路由时，可以在创建时直接加入 @elfui/router。",
    en: "Add @elfui/router during creation when client routing is required.",
  },
  bareTitle: { zh: "最小空项目", en: "Minimal project" },
  bareLabel: { zh: "最小项目", en: "Minimal" },
  bareBody: {
    zh: "使用 --bare 创建不包含教学示例的最小项目。",
    en: "Use --bare to create a minimal project without tutorial examples.",
  },
  existingTitle: { zh: "已有项目", en: "Existing project" },
  existingBody: {
    zh: "已有 Vite 项目可以跳过脚手架，直接安装 @elfui/kit。",
    en: "Existing Vite projects can skip the scaffold and install @elfui/kit directly.",
  },
  installTitle: { zh: "安装组件库", en: "Install the Kit" },
  installLead: {
    zh: "通过包管理器安装 @elfui/kit。普通应用不需要单独安装 @elfui/core，它会作为依赖自动安装。",
    en: "Install @elfui/kit with your package manager. Normal applications do not need to install @elfui/core separately; it comes in as a dependency.",
  },
  installFooter: { zh: "在项目根目录的终端中执行", en: "Run in the project root" },
  registerTitle: { zh: "注册组件库", en: "Register the Kit" },
  registerLead: {
    zh: "在应用入口导入一次 @elfui/kit，所有 elf-* 组件会自动注册为 Custom Elements。",
    en: "Import @elfui/kit once in the application entry; every elf-* component registers as a Custom Element automatically.",
  },
  entryTitle: { zh: "应用入口", en: "Application entry" },
  entryFooter: { zh: "应用入口，只需导入一次", en: "Application entry; import once" },
  optionalTitle: { zh: "可选入口", en: "Optional entries" },
  optionalLead: {
    zh: "工具类样式和 Labs 组件按需引入，不使用时不进入打包结果。",
    en: "Import utility styles and Labs components only when needed so they stay out of the bundle.",
  },
  utilitiesTitle: { zh: "工具类样式", en: "Utility styles" },
  utilitiesBody: {
    zh: "需要布局与排版工具类时，再引入 utilities.css。",
    en: "Import utilities.css only when layout and typography utilities are needed.",
  },
  utilitiesFooter: { zh: "可选入口", en: "Optional entry" },
  labsTitle: { zh: "Labs 组件", en: "Labs components" },
  labsBody: {
    zh: "CodeCard、Heatmap、Video 等实验组件通过独立入口导出。",
    en: "Experimental components such as CodeCard, Heatmap, and Video use a separate entry.",
  },
  labsFooter: { zh: "可选入口", en: "Optional entry" },
  entriesTitle: { zh: "公开入口", en: "Public entries" },
  entriesLead: {
    zh: "下表是 @elfui/kit 当前的稳定入口。",
    en: "The following table lists the current stable entries of @elfui/kit.",
  },
  useTitle: { zh: "使用组件", en: "Use a component" },
  useLead: {
    zh: "导入完成后，普通 HTML 和 Macro 组件模板都可以直接使用 elf-* 标签。",
    en: "Once imported, plain HTML and Macro component templates can use elf-* tags directly.",
  },
  htmlTitle: { zh: "普通 HTML 页面", en: "Plain HTML page" },
  htmlBody: {
    zh: "模块脚本加载完成后，页面中的 elf-* 标签会正常渲染。",
    en: "After the module script loads, elf-* tags in the page render normally.",
  },
  macroTitle: { zh: "Macro 组件模板", en: "Macro component template" },
  macroBody: {
    zh: "在 defineHtml 模板中组合组件；在应用里编写宏组件需要 Vite Plugin。",
    en: "Compose components inside defineHtml templates; authoring macro components in your application requires the Vite Plugin.",
  },
  authorTitle: { zh: "编写自己的 Macro 组件？", en: "Authoring your own macro components?" },
  authorBody: {
    zh: "在应用里编写 defineHtml 宏组件时，显式安装 Core 与 Vite Plugin，并保持相同 beta 版本。",
    en: "When authoring defineHtml macro components in your application, install Core and the Vite Plugin explicitly and keep them on the same beta.",
  },
  buildLink: { zh: "构建与样式", en: "Build and styles" },
  previewTitle: { zh: "第一个组件", en: "First component" },
  previewBody: {
    zh: "下面的 elf-button 来自组件库的公开入口。",
    en: "The elf-button below comes from the Kit's public entry.",
  },
  verifyTitle: { zh: "验证安装", en: "Verify the installation" },
  verifyLead: {
    zh: "页面能打开只是第一步，再确认下面四项。",
    en: "A rendered page is only the start; confirm these four checks as well.",
  },
  verifyOne: {
    zh: "开发服务器没有编译警告，浏览器控制台没有自定义元素冲突。",
    en: "The dev server has no compiler warnings and the console reports no custom-element conflicts.",
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
  readingTitle: { zh: "推荐阅读", en: "Recommended reading" },
  readingBody: {
    zh: "继续了解主题定制、组件示例与常见问题。",
    en: "Continue with theming, component examples, and FAQ.",
  },
  configLink: { zh: "全局配置", en: "Global configuration" },
  nextAction: { zh: "下一步：全局配置", en: "Next: Global configuration" },
  themeLink: { zh: "主题定制", en: "Theme customization" },
  faqLink: { zh: "常见问题", en: "FAQ" },
});
const pick = createDocsPicker();

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
const entryCode = 'import "@elfui/kit";';
const utilitiesCode = 'import "@elfui/kit/styles/utilities.css";';
const labsCode = 'import "@elfui/kit/labs";';
const htmlCode = [
  '<script type="module">',
  '  import "@elfui/kit";',
  "</script>",
  "",
  '<elf-button color="primary">Create project</elf-button>',
].join("\n");
const macroCode = [
  'import { defineHtml } from "@elfui/core";',
  "",
  "export const App = defineHtml(`",
  '  <elf-button color="primary">Create project</elf-button>',
  "`);",
].join("\n");
const createItems = (): CodeCardItem[] => [
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
  {
    key: "bare",
    label: t("bareLabel"),
    filename: "Terminal",
    language: "bash",
    code: bareCode,
  },
  {
    key: "existing",
    label: t("existingTitle"),
    filename: "Terminal",
    language: "bash",
    code: "pnpm add @elfui/kit",
  },
];
const optionalItems = (): CodeCardItem[] => [
  {
    key: "utilities",
    label: "utilities.css",
    filename: "src/main.ts",
    language: "typescript",
    code: utilitiesCode,
  },
  {
    key: "labs",
    label: "labs",
    filename: "src/main.ts",
    language: "typescript",
    code: labsCode,
  },
];
const installItems = (): CodeCardItem[] => [
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
];

const entryRows = (): Array<{ name: string; type: string; default: string; desc: string }> => [
  {
    name: "@elfui/kit",
    type: "JavaScript + types",
    default: pick("必需", "Required"),
    desc: pick("组件、Provider 与公开类型", "Components, Providers, and public types"),
  },
  {
    name: "@elfui/kit/styles/utilities.css",
    type: "CSS",
    default: pick("可选", "Optional"),
    desc: pick("布局与排版工具类", "Layout and typography utilities"),
  },
  {
    name: "@elfui/kit/labs",
    type: "JavaScript + types",
    default: pick("可选", "Optional"),
    desc: pick("Labs 实验组件", "Labs experimental components"),
  },
];

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

defineStyle(
  articleStyles,
  `
  .installation-page .docs-section {
    margin-block: clamp(1.75rem, 3vw, 2.75rem);
  }
  .installation-page .installation-summary {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .installation-page .create-section > h2 {
    margin-bottom: var(--elf-space-4);
  }
  .installation-page elf-props-table {
    display: block;
    width: 100%;
    min-width: 0;
    margin-inline: 0;
  }
  .installation-page elf-table::part(table) {
    line-height: var(--docs-line-height);
  }
  .installation-page elf-table::part(table) th,
  .installation-page elf-table::part(table) td {
    white-space: normal;
  }
  .installation-page .guide-content elf-quote {
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    margin-inline: 0;
  }
  .installation-page elf-quote::part(body) {
    line-height: var(--docs-line-height);
  }
  .installation-page .guide-use-labels {
    margin-bottom: 0;
  }
  .installation-page .guide-use-labels + .guide-code-grid {
    margin-top: var(--elf-space-2);
  }
  .installation-next {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--elf-space-4);
    align-content: start;
    min-width: 0;
    margin-top: clamp(1.75rem, 3vw, 2.75rem);
  }
  .installation-next-card {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    width: 100%;
    padding: var(--elf-space-6);
    border: 1px solid color-mix(in srgb, var(--elf-primary) 24%, var(--elf-border));
    border-radius: var(--elf-radius-md);
    background: color-mix(in srgb, var(--elf-primary) 5%, var(--elf-bg-paper));
  }
  .installation-next-card::before {
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
    border-radius: var(--elf-radius-sm) 0 0 var(--elf-radius-sm);
    background: var(--elf-primary);
    content: "";
  }
  .installation-next-card h2 {
    margin: 0 0 var(--elf-space-2);
    font-size: var(--elf-font-size-lg);
    font-weight: 800;
    letter-spacing: 0;
  }
  .installation-next-card p {
    margin: 0 0 var(--elf-space-4);
    color: var(--elf-text-secondary);
    line-height: var(--docs-line-height);
  }
  .installation-next-card .docs-link-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--elf-space-2);
  }
  .installation-next-card elf-link {
    color: var(--elf-primary);
    font-weight: 700;
  }
  .installation-reading-card {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    width: 100%;
    padding: var(--elf-space-4);
    border: 1px solid color-mix(in srgb, var(--elf-success) 26%, var(--elf-border));
    border-radius: var(--elf-radius-md);
    background: color-mix(in srgb, var(--elf-success) 6%, var(--elf-bg-paper));
  }
  .installation-reading-card::before {
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
    border-radius: var(--elf-radius-sm) 0 0 var(--elf-radius-sm);
    background: var(--elf-success);
    content: "";
  }
  .installation-reading-card h2 {
    margin: 0 0 var(--elf-space-2);
    color: var(--elf-success);
    font-size: var(--elf-font-size-lg);
    font-weight: 800;
    letter-spacing: 0;
  }
  .installation-reading-card p {
    margin: 0 0 var(--elf-space-4);
    color: var(--elf-text-secondary);
    line-height: var(--docs-line-height);
  }
  .installation-reading-card .docs-link-list {
    display: grid;
    gap: var(--elf-space-2);
    justify-content: start;
  }
  .installation-reading-card elf-link {
    color: var(--elf-success);
    font-weight: 700;
  }
  .installation-verify-row {
    display: block;
  }
  .guide-stage {
    display: grid;
    min-height: 96px;
    margin-top: var(--elf-space-4);
    padding: var(--elf-space-5);
    place-items: center;
    border: 1px dashed var(--elf-divider);
    border-radius: var(--elf-radius-sm);
  }
  @media (max-width: 900px) {
    .installation-next {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 720px) {
    .installation-page .installation-summary {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  `,
);

const PageInstallation = defineHtml(`
  <elf-container class="docs-article guide-page installation-page">
    <elf-docs-hero
      category="getting-started"
      tag="Getting Started"
      :title=${t("title")}
      :description=${t("description")}
    ></elf-docs-hero>
    <div class="guide-content">
      <section class="docs-section">
        <h2>${t("requirementsTitle")}</h2>
        <elf-quote
          type="info"
          variant="soft"
          :compact.prop=${true}
        >
          <p>${t("requirementsLead")}</p>
        </elf-quote>
        <div class="docs-summary installation-summary">
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
          <div class="docs-summary-item">
            <span class="docs-summary-label">${t("manager")}</span>
            <span class="docs-summary-value">${t("managerValue")}</span>
          </div>
        </div>

        <h3>${t("matrixTitle")}</h3>
        <elf-quote
          type="info"
          variant="soft"
          :compact.prop=${true}
        >
          <p>${t("matrixLead")}</p>
        </elf-quote>
        <elf-table
          class="guide-table"
          :data.prop=${supportRows()}
          :columns.prop=${supportColumns()}
          row-key="browser"
          border
          stripe
        ></elf-table>

        <h3>${t("capabilitiesTitle")}</h3>
        <elf-quote
          type="info"
          variant="soft"
          :compact.prop=${true}
        >
          <p>${t("capabilitiesLead")}</p>
        </elf-quote>
        <elf-table
          class="guide-table"
          :data.prop=${capabilityRows()}
          :columns.prop=${capabilityColumns()}
          row-key="capability"
          border
        ></elf-table>

        <h3>${t("testTitle")}</h3>
        <elf-quote
          type="warning"
          variant="soft"
          :compact.prop=${true}
        >
          <p>${t("testLead")}</p>
        </elf-quote>
        <ul class="docs-checklist">
          <li>${t("testOne")}</li>
          <li>${t("testTwo")}</li>
          <li>${t("testThree")}</li>
          <li>${t("testFour")}</li>
        </ul>
        <elf-quote
          type="info"
          variant="soft"
          :title=${t("reportTitle")}
          :compact.prop=${false}
        >
          <p>${t("reportBody")}</p>
        </elf-quote>
      </section>

      <section class="docs-section create-section">
        <h2>${t("createTitle")}</h2>
        <ul class="article-list">
          <li>
            <strong>${t("scaffoldTitle")}</strong>: ${t("scaffoldBody")}
          </li>
          <li>
            <strong>${t("routerTitle")}</strong>: ${t("routerBody")}
          </li>
          <li>
            <strong>${t("bareTitle")}</strong>: ${t("bareBody")}
          </li>
          <li>
            <strong>${t("existingTitle")}</strong>: ${t("existingBody")}
          </li>
        </ul>
        <elf-code-card
          class="guide-code"
          variant="workbench"
          :items.prop=${createItems()}
          :lineNumbers.prop=${false}
        >
          <span slot="footer">${t("installFooter")}</span>
        </elf-code-card>
      </section>

      <section class="docs-section">
        <h2>${t("installTitle")}</h2>
        <elf-quote
          type="info"
          variant="soft"
          :compact.prop=${true}
        >
          <p>${t("installLead")}</p>
        </elf-quote>
        <elf-code-card
          class="guide-code"
          variant="workbench"
          :items.prop=${installItems()}
          :lineNumbers.prop=${false}
        >
          <span slot="footer">${t("installFooter")}</span>
        </elf-code-card>
      </section>

      <section class="docs-section">
        <h2>${t("registerTitle")}</h2>
        <elf-quote
          type="info"
          variant="soft"
          :compact.prop=${true}
        >
          <p>${t("registerLead")}</p>
        </elf-quote>
        <h3>${t("entryTitle")}</h3>
        <elf-code-card
          class="guide-code"
          variant="workbench"
          language="typescript"
          filename="src/main.ts"
          :code.prop=${entryCode}
          :lineNumbers.prop=${false}
        >
          <span slot="footer">${t("entryFooter")}</span>
        </elf-code-card>

        <h3>${t("optionalTitle")}</h3>
        <elf-quote
          type="info"
          variant="soft"
          :compact.prop=${true}
        >
          <p>${t("optionalLead")}</p>
        </elf-quote>
        <elf-code-card
          class="guide-code"
          variant="workbench"
          :items.prop=${optionalItems()}
          :lineNumbers.prop=${false}
        >
          <span slot="footer">${t("optionalLead")}</span>
        </elf-code-card>

        <h3>${t("entriesTitle")}</h3>
        <elf-quote
          type="info"
          variant="soft"
          :compact.prop=${true}
        >
          <p>${t("entriesLead")}</p>
        </elf-quote>
        <elf-props-table :title=${t("entriesTitle")} :rows.prop=${entryRows()}></elf-props-table>
      </section>

      <section class="docs-section">
        <h2>${t("useTitle")}</h2>
        <elf-quote
          type="info"
          variant="soft"
          :compact.prop=${true}
        >
          <p>${t("useLead")}</p>
        </elf-quote>
        <div class="guide-code-grid guide-use-labels">
          <div>
            <h3>${t("htmlTitle")}</h3>
            <p>${t("htmlBody")}</p>
          </div>
          <div>
            <h3>${t("macroTitle")}</h3>
            <p>${t("macroBody")}</p>
          </div>
        </div>
        <div class="guide-code-grid">
          <elf-code-card
            class="guide-code"
            variant="workbench"
            language="html"
            filename="index.html"
            :code.prop=${htmlCode}
            :lineNumbers.prop=${false}
          >
            <span slot="footer">${t("entryFooter")}</span>
          </elf-code-card>
          <elf-code-card
            class="guide-code"
            variant="workbench"
            language="typescript"
            filename="src/App.ts"
            :code.prop=${macroCode}
            :lineNumbers.prop=${false}
          >
            <span slot="footer">${t("entryFooter")}</span>
          </elf-code-card>
        </div>

        <h3>${t("previewTitle")}</h3>
        <elf-quote
          type="info"
          variant="soft"
          :compact.prop=${true}
        >
          <p>${t("previewBody")}</p>
        </elf-quote>
        <div class="guide-stage">
          <elf-button color="primary">Create project</elf-button>
        </div>

        <elf-quote
          type="warning"
          variant="soft"
          :title=${t("authorTitle")}
          :compact.prop=${false}
        >
          <p>${t("authorBody")}</p>
          <elf-link href="#/guide/build">${t("buildLink")} →</elf-link>
        </elf-quote>
      </section>

      <div class="installation-verify-row">
        <section class="docs-section">
          <h2>${t("verifyTitle")}</h2>
          <elf-quote
            type="warning"
            variant="soft"
            :compact.prop=${true}
          >
            <p>${t("verifyLead")}</p>
          </elf-quote>
          <ul class="docs-checklist">
            <li>${t("verifyOne")}</li>
            <li>${t("verifyTwo")}</li>
            <li>${t("verifyThree")}</li>
            <li>${t("verifyFour")}</li>
          </ul>
        </section>

        <section class="installation-next" data-docs-toc-ignore>
          <div class="installation-next-card">
            <h2>${t("nextTitle")}</h2>
            <p>${t("nextBody")}</p>
            <div class="docs-link-list">
              <elf-link href="#/providers/config">${t("nextAction")} →</elf-link>
            </div>
          </div>
          <div class="installation-reading-card">
            <h2>${t("readingTitle")}</h2>
            <p>${t("readingBody")}</p>
            <div class="docs-link-list">
              <elf-link href="#/providers/theme">${t("themeLink")} →</elf-link>
              <elf-link href="#/getting-started/faq">${t("faqLink")} →</elf-link>
            </div>
          </div>
        </section>
      </div>
    </div>
  </elf-container>
`);

export { PageInstallation };
