import { defineHtml, defineStyle } from "@elfui/core";

import "@elfui/kit/labs";
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
  startLead: {
    zh: "入口、编译与注册问题都发生在接入阶段；先验证导入和构建链，再看具体标签。",
    en: "Entry, compilation, and registration issues happen at integration time; verify the import and build chain before inspecting individual tags.",
  },
  runtimeLead: {
    zh: "弹层与焦点行为依赖 Provider 上下文和浮层生命周期；用最小复现区分框架问题与组件用法问题。",
    en: "Overlay and focus behavior depends on Provider context and overlay lifecycle; use a minimal reproduction to separate framework issues from component usage.",
  },
  stylingLead: {
    zh: "主题差异通常来自 Provider 作用域、token 优先级或 Shadow DOM 隔离；按公开契约定制而不是穿透样式。",
    en: "Theme differences usually come from Provider scope, token precedence, or Shadow DOM isolation; customize through public contracts instead of piercing styles.",
  },
  releaseLead: {
    zh: "升级先对齐版本与工具链，再处理 API 变更；报告问题时给出可复现的最小证据。",
    en: "Align versions and the toolchain before upgrading, then handle API changes; report issues with reproducible minimal evidence.",
  },
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
    zh: "检查 Vite 是否启用了 elfuiMacroPlugin，以及 Core 中 Vite Plugin 是否为完全相同的 beta。宏模板依赖构建期编译，不能把动态变量传给 defineHtml。",
    en: "Check that Vite enables elfuiMacroPlugin and that Core and the Vite Plugin use the exact same beta. Macro templates require build-time compilation and defineHtml cannot receive a runtime template variable.",
  },
  duplicateQ: {
    zh: "控制台提示自定义元素名称冲突？",
    en: "The console reports a custom-element name conflict?",
  },
  duplicateA: {
    zh: "同一个 tag 被不同构造函数注册了两次。检查是否同时打包了两份 Kit/Framework，或两个库使用了相同组件前缀。不要用捕获异常来忽略冲突。",
    en: "The same tag was registered by two different constructors. Check for duplicate Kit/Framework bundles or libraries sharing a component prefix. Do not suppress the conflict with a catch block.",
  },
  overlayQ: {
    zh: "弹层挂到 body 后会丢失语言、主题或配置吗？",
    en: "Do body-level overlays lose locale, theme, or configuration?",
  },
  overlayA: {
    zh: "不应该。Framework 会保留 Teleport 的逻辑父链和 Provider/App 上下文。若丢失，请先缩到最小复现并作为框架问题报告，而不是在组件内复制配置。",
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
    zh: "先检查 ConfigProvider、ThemeProvider 和 DefaultsProvider 的作用域和优先级。公共定制应修改语义 token 或组件公开变量，不要使用深层选择器穿透 Shadow DOM。",
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
    zh: "beta 版本会删除旧 API。先对齐 Core、Compiler 和 Vite Plugin，再根据升级指南替换生命周期、响应式、主题和指令入口。",
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
    zh: "先确认安装页的环境要求，再按质量章节的最小复现与门禁方法收集证据。",
    en: "Confirm the environment requirements on Installation, then collect evidence using the reproduction and gate guidance in Quality.",
  },
  qualityLink: { zh: "质量", en: "Quality" },
  upgradeLink: { zh: "升级指南", en: "Upgrade guide" },
});

const FAQ_MD_STYLE = `<style>
.faq-lead {
  margin: 0 0 var(--elf-space-3);
  color: var(--elf-text-secondary);
  line-height: var(--docs-line-height);
}
.faq-next-links {
  display: grid;
  gap: var(--elf-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
`;

const groupMarkdown = (title: string, lead: string): string =>
  `${FAQ_MD_STYLE}# ${title}\n\n<p class="faq-lead">${lead}</p>`;

const closingMarkdown = (): string => `${FAQ_MD_STYLE}# ${t("unresolvedTitle")}

${t("unresolvedBody")}

<ul class="faq-next-links">
  <li><elf-link href="#/quality">${t("qualityLink")} →</elf-link></li>
  <li><elf-link href="#/getting-started/upgrade-guide">${t("upgradeLink")} →</elf-link></li>
</ul>`;

defineStyle(
  articleStyles,
  `
  .faq-md {
    width: max(85%, min(100%, 900px));
    max-width: 100%;
    min-width: 0;
    margin-inline: auto;
    box-sizing: border-box;
  }
  .faq-accordion {
    margin: 0 0 26px;
  }
  .faq-accordion::part(collapse) {
    box-shadow: none;
    border-radius: var(--elf-radius-sm);
  }
  .faq-accordion elf-collapse-item::part(header) {
    min-height: 54px;
    color: var(--elf-text-primary);
    font-weight: 600;
  }
  .faq-accordion elf-collapse-item::part(header):hover {
    background: color-mix(in srgb, var(--elf-primary) 6%, transparent);
  }
  .faq-accordion elf-collapse-item[data-active]::part(header) {
    color: var(--elf-primary);
  }
  .faq-accordion elf-collapse-item::part(icon) {
    color: var(--elf-primary);
  }
  .faq-accordion elf-collapse-item::part(body) {
    color: var(--elf-text-secondary);
  }
  .faq-accordion p {
    margin: 0;
    line-height: var(--docs-line-height);
  }
`,
);

const PageFaq = defineHtml(`
  <elf-container class="docs-article guide-page faq-page">
    <elf-docs-hero category="getting-started" tag="FAQ" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <div class="faq-md">
      <elf-md-page
        max-width="100%"
        code-theme="material"
        :base-heading-level=${2}
      >${groupMarkdown(t("start"), t("startLead"))}</elf-md-page>
      <elf-collapse class="faq-accordion" accordion>
        <elf-collapse-item name="register" :title=${t("registerQ")}><p>${t("registerA")}</p></elf-collapse-item>
        <elf-collapse-item name="compiler" :title=${t("compilerQ")}><p>${t("compilerA")}</p></elf-collapse-item>
        <elf-collapse-item name="duplicate" :title=${t("duplicateQ")}><p>${t("duplicateA")}</p></elf-collapse-item>
      </elf-collapse>

      <elf-md-page
        max-width="100%"
        code-theme="material"
        :base-heading-level=${2}
      >${groupMarkdown(t("runtime"), t("runtimeLead"))}</elf-md-page>
      <elf-collapse class="faq-accordion" accordion>
        <elf-collapse-item name="overlay" :title=${t("overlayQ")}><p>${t("overlayA")}</p></elf-collapse-item>
        <elf-collapse-item name="focus" :title=${t("focusQ")}><p>${t("focusA")}</p></elf-collapse-item>
        <elf-collapse-item name="ssr" :title=${t("ssrQ")}><p>${t("ssrA")}</p></elf-collapse-item>
      </elf-collapse>

      <elf-md-page
        max-width="100%"
        code-theme="material"
        :base-heading-level=${2}
      >${groupMarkdown(t("styling"), t("stylingLead"))}</elf-md-page>
      <elf-collapse class="faq-accordion" accordion>
        <elf-collapse-item name="theme" :title=${t("styleQ")}><p>${t("styleA")}</p></elf-collapse-item>
        <elf-collapse-item name="global-css" :title=${t("globalCssQ")}><p>${t("globalCssA")}</p></elf-collapse-item>
      </elf-collapse>

      <elf-md-page
        max-width="100%"
        code-theme="material"
        :base-heading-level=${2}
      >${groupMarkdown(t("release"), t("releaseLead"))}</elf-md-page>
      <elf-collapse class="faq-accordion" accordion>
        <elf-collapse-item name="version" :title=${t("versionQ")}><p>${t("versionA")}</p></elf-collapse-item>
        <elf-collapse-item name="issue" :title=${t("issueQ")}><p>${t("issueA")}</p></elf-collapse-item>
      </elf-collapse>

      <elf-md-page
        max-width="100%"
        code-theme="material"
        :base-heading-level=${2}
      >${closingMarkdown()}</elf-md-page>
    </div>
  </elf-container>
`);

export { PageFaq };
