import { defineHtml, defineStyle } from "@elfui/core";

import "@elfui/kit/labs";
import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";
import { codeCard, MD_EMBED_STYLE } from "../../shared/md-embed";

const t = createDocsTranslator({
  kicker: { zh: "快速入门", en: "Getting started" },
  title: { zh: "升级指南", en: "Upgrade guide" },
  description: {
    zh: "升级不是一次依赖更新，而是一条可回滚、可验证的迁移链路。先锁定版本与变更范围，再迁移 API，最后运行组件测试和真实浏览器验收。",
    en: "An upgrade is a reversible, verifiable migration—not a dependency bump. Lock versions and scope first, migrate APIs next, then run component tests and real-browser acceptance.",
  },
  scope: { zh: "适用范围", en: "Scope" },
  sequence: { zh: "执行顺序", en: "Sequence" },
  rule: { zh: "核心原则", en: "Core rule" },
  beforeTitle: { zh: "升级前准备", en: "Before upgrading" },
  beforeLead: {
    zh: "先记录当前可工作的版本和关键页面截图。没有基线，就无法判断升级是修复还是退化。",
    en: "Record the last known-good versions and screenshots of critical pages. Without a baseline, regressions cannot be distinguished from intended changes.",
  },
  beforeOne: {
    zh: "提交或暂存当前工作区，保留可回滚点。",
    en: "Commit or stash the current workspace to preserve a rollback point.",
  },
  beforeTwo: {
    zh: "记录 Core、Compiler、Vite Plugin、Router 与 Kit 的精确版本。",
    en: "Record exact Core, Compiler, Vite Plugin, Router, and Kit versions.",
  },
  beforeThree: {
    zh: "列出 Provider、Teleport、表单、弹层和虚拟滚动等高风险路径。",
    en: "List high-risk Provider, Teleport, form, overlay, and virtual-scroll paths.",
  },
  alignTitle: { zh: "对齐工具链", en: "Align the toolchain" },
  alignBody: {
    zh: "Core、Compiler 与 Vite Plugin 必须使用完全相同的 beta。先更新锁文件，再进入源码迁移。",
    en: "Core, Compiler, and the Vite Plugin must use the exact same beta. Update the lockfile before touching source code.",
  },
  migrateTitle: { zh: "迁移公开 API", en: "Migrate public APIs" },
  migrateBody: {
    zh: "通过静态扫描处理已删除入口，不保留双写兼容层。迁移后再运行类型检查。",
    en: "Use static scans to remove deleted entries without keeping dual compatibility layers. Run type checks immediately after migration.",
  },
  verifyTitle: { zh: "运行质量门禁", en: "Run quality gates" },
  verifyBody: {
    zh: "从聚焦单测到完整构建，再到浏览器行为与截图，按成本从低到高执行。",
    en: "Run focused tests, full builds, browser behavior, and screenshots in increasing order of cost.",
  },
  gatesTitle: { zh: "推荐门禁顺序", en: "Recommended gate order" },
  gatesLead: {
    zh: "任何一步失败都先停止并定位，不要继续堆叠后续错误。",
    en: "Stop at the first failing gate and isolate it instead of stacking later failures.",
  },
  defectTitle: { zh: "确认是框架问题时", en: "When the framework is responsible" },
  defectBody: {
    zh: "缩小为最小复现并反馈框架线程。不要在组件内增加轮询、随意 setTimeout、全局事件桥或重复渲染来掩盖问题。",
    en: "Reduce the issue to a framework reproduction. Do not mask it in components with polling, arbitrary timeouts, global event bridges, or duplicate renders.",
  },
  doneTitle: { zh: "完成标准", en: "Definition of done" },
  doneOne: {
    zh: "旧 API 扫描为零，类型检查与生产构建通过。",
    en: "Legacy API scans are clean; typecheck and production build pass.",
  },
  doneTwo: {
    zh: "高风险组件的聚焦测试全部通过。",
    en: "Focused tests for high-risk components all pass.",
  },
  doneThree: {
    zh: "中英文、浅色与深色模式完成真实浏览器验收。",
    en: "Chinese and English, light and dark modes pass real-browser acceptance.",
  },
  doneFour: {
    zh: "控制台没有新增 warning/error，关键页面截图可比较。",
    en: "No new console warnings or errors, and critical screenshots are comparable.",
  },
  nextTitle: { zh: "继续了解", en: "Continue" },
  nextBody: {
    zh: "质量章节定义验收门禁与无障碍边界。",
    en: "Quality defines acceptance gates and accessibility boundaries.",
  },
  qualityLink: { zh: "质量门禁", en: "Quality gates" },
  releasesTitle: { zh: "版本记录", en: "Release history" },
  frameworkReleasesTitle: { zh: "框架版本记录", en: "Framework release history" },
  kitReleasesTitle: { zh: "组件库版本记录", en: "Kit release history" },
  current: { zh: "当前版本", en: "Current" },
  kitReleaseTitle: { zh: "组件库能力收敛", en: "Kit capability consolidation" },
  kitReleaseBody: {
    zh: "当前预发布版本集中完善组件契约、Material 主题、文档工作台与统一 Provider 配置。",
    en: "The current prerelease consolidates component contracts, Material themes, documentation workbenches, and Provider configuration.",
  },
  kitReleaseOne: {
    zh: "统一 Material 内置配色与主题调色板。",
    en: "Unified Material presets and Theme Studio.",
  },
  kitReleaseTwo: {
    zh: "补齐组件案例、API 表格与响应式文档布局。",
    en: "Expanded component demos, API tables, and responsive docs.",
  },
  kitReleaseThree: {
    zh: "新增 CodeCard、Video、Heatmap 等实验室能力。",
    en: "Added CodeCard, Video, Heatmap, and other Labs capabilities.",
  },
  beta20Title: { zh: "当前框架基线", en: "Current framework baseline" },
  beta20Body: {
    zh: "Core、Compiler 与 Vite Plugin 统一到 beta.20。",
    en: "Core, Compiler, and the Vite Plugin are aligned on beta.20.",
  },
  beta20One: {
    zh: "统一生命周期、响应式与宏模板公开 API。",
    en: "Aligned lifecycle, reactivity, and macro template APIs.",
  },
  beta20Two: {
    zh: "Provider、Teleport、表单与弹层继续使用框架正式契约。",
    en: "Providers, Teleport, forms, and overlays use framework contracts.",
  },
  beta18Title: { zh: "稳定性里程碑", en: "Stability milestone" },
  beta18Body: {
    zh: "beta.18 修复了两个会影响组件库的底层事务问题。",
    en: "beta.18 fixed two runtime transaction issues that affected the Kit.",
  },
  beta18One: {
    zh: "修复 useComputed 同一事件事务读取旧值。",
    en: "Fixed stale useComputed reads in the same event transaction.",
  },
  beta18Two: {
    zh: "修复 useScrollLock 多个 owner 提前解锁。",
    en: "Fixed premature unlock with concurrent useScrollLock owners.",
  },
});

const gateCode = [
  "node scripts/check-beta8-migration.mjs",
  "pnpm exec vitest run path/to/component.test.ts --maxWorkers=1",
  "pnpm typecheck",
  "pnpm build:lib",
  "pnpm build",
].join("\n");

const releaseTitle = (version: string, label: string): string => `${version} · ${label}`;

const markdown = (): string => `${MD_EMBED_STYLE}
# ${t("beforeTitle")}

${t("beforeLead")}

- ${t("beforeOne")}
- ${t("beforeTwo")}
- ${t("beforeThree")}

# ${t("gatesTitle")}

${t("gatesLead")}

${codeCard(gateCode, "bash", "Terminal")}

<div class="md-embed">
  <elf-alert type="warning" variant="soft" show-icon="false" title="${t("defectTitle")}" description="${t("defectBody")}"></elf-alert>
</div>

# ${t("doneTitle")}

- ${t("doneOne")}
- ${t("doneTwo")}
- ${t("doneThree")}
- ${t("doneFour")}

# ${t("nextTitle")}

${t("nextBody")}

- <elf-link href="#/quality">${t("qualityLink")} →</elf-link>`;

defineStyle(
  articleStyles,
  `
  .upgrade-md {
    width: max(85%, min(100%, 900px));
    max-width: 100%;
    min-width: 0;
    margin-inline: auto;
    box-sizing: border-box;
  }
  .release-accordion {
    margin: 0 0 18px;
  }
  .release-accordion::part(collapse) {
    box-shadow: none;
    border-radius: var(--elf-radius-sm);
  }
  .release-accordion elf-collapse-item::part(header) {
    min-height: 54px;
    color: var(--elf-text-primary);
    font-weight: 700;
  }
  .release-accordion elf-collapse-item::part(header):hover {
    background: color-mix(in srgb, var(--elf-primary) 6%, transparent);
  }
  .release-accordion elf-collapse-item[data-active]::part(header) {
    color: var(--elf-primary);
  }
  .release-accordion elf-collapse-item::part(icon) {
    color: var(--elf-primary);
  }
  .release-accordion elf-collapse-item::part(body) {
    color: var(--elf-text-secondary);
  }
  .release-group-title {
    margin: 22px 0 10px;
    font-size: var(--elf-font-size-lg);
  }
  .release-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--elf-space-3);
    margin-bottom: var(--elf-space-3);
    font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  }
  .release-accordion p {
    margin: 0 0 var(--elf-space-3);
    color: var(--elf-text-secondary);
    line-height: var(--docs-line-height);
  }
  .release-accordion ul {
    display: grid;
    gap: var(--elf-space-2);
    margin: 0;
    padding-inline-start: 1.25rem;
    color: var(--elf-text-secondary);
    line-height: var(--docs-line-height);
  }
`,
);

const PageUpgradeGuide = defineHtml(`
  <elf-container class="docs-article guide-page upgrade-page">
    <elf-docs-hero category="getting-started" tag="Upgrade" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <div class="upgrade-md">
      <h2>${t("releasesTitle")}</h2>
      <h3 class="release-group-title">${t("frameworkReleasesTitle")}</h3>
      <elf-collapse class="release-accordion" accordion>
        <elf-collapse-item name="framework-beta.20" :title=${releaseTitle("Framework v0.1.0-beta.20", t("beta20Title"))}>
          <p>${t("beta20Body")}</p>
          <ul>
            <li>${t("beta20One")}</li>
            <li>${t("beta20Two")}</li>
          </ul>
        </elf-collapse-item>
        <elf-collapse-item name="framework-beta.18" :title=${releaseTitle("Framework v0.1.0-beta.18", t("beta18Title"))}>
          <p>${t("beta18Body")}</p>
          <ul>
            <li>${t("beta18One")}</li>
            <li>${t("beta18Two")}</li>
          </ul>
        </elf-collapse-item>
      </elf-collapse>
      <h3 class="release-group-title">${t("kitReleasesTitle")}</h3>
      <elf-collapse class="release-accordion" accordion>
        <elf-collapse-item name="v0.0.2-beta.1" :title=${releaseTitle("v0.0.2-beta.1", t("kitReleaseTitle"))}>
          <div class="release-meta">
            <elf-tag size="small" type="success">${t("current")}</elf-tag>
          </div>
          <p>${t("kitReleaseBody")}</p>
          <ul>
            <li>${t("kitReleaseOne")}</li>
            <li>${t("kitReleaseTwo")}</li>
            <li>${t("kitReleaseThree")}</li>
          </ul>
        </elf-collapse-item>
      </elf-collapse>
      <elf-md-page
        max-width="100%"
        code-theme="material"
        :base-heading-level=${2}
      >${markdown()}</elf-md-page>
    </div>
  </elf-container>
`);

export { PageUpgradeGuide };
