import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验能力", en: "Experimental capabilities" },
  title: { zh: "实验室", en: "Labs" },
  description: {
    zh: "实验室用于公开验证尚未稳定的 API、可访问性模型和性能边界。它不是未完成组件的展示柜，而是一条从提案到稳定发布的透明晋级通道。",
    en: "Labs publicly validates APIs, accessibility models, and performance limits that are not stable yet. It is not a showcase for unfinished components, but a transparent promotion path from proposal to stable release.",
  },
  stability: { zh: "稳定性", en: "Stability" },
  stabilityValue: { zh: "允许破坏性调整", en: "Breaking changes allowed" },
  distribution: { zh: "发布入口", en: "Distribution" },
  distributionValue: { zh: "与稳定入口隔离", en: "Isolated from stable entry" },
  promotion: { zh: "晋级要求", en: "Promotion" },
  promotionValue: { zh: "API · a11y · 性能 · 测试", en: "API · a11y · performance · tests" },
  warningTitle: { zh: "不要直接用于关键生产路径。", en: "Do not use Labs in critical production paths." },
  warningBody: {
    zh: "实验能力可能在补丁版本调整 Props、Events、DOM 结构或导入入口。采用前要锁定版本，并预留迁移成本。",
    en: "Experimental Props, Events, DOM structure, or import paths may change in a patch release. Pin versions and budget for migration before adoption.",
  },
  meaningTitle: { zh: "Labs 标签意味着什么", en: "What the Labs label means" },
  meaningLead: {
    zh: "实验只放宽 API 稳定性，不降低安全、清理和基础可访问性要求。无法满足最低质量线的提案不会发布。",
    en: "Labs relaxes API stability, not safety, cleanup, or baseline accessibility. Proposals below the minimum quality bar are not published.",
  },
  allowedTitle: { zh: "允许变化", en: "May change" },
  allowedBody: {
    zh: "命名、默认值、数据模型、插槽、DOM 结构和独立导出路径可依据反馈调整。",
    en: "Names, defaults, data models, slots, DOM structure, and isolated export paths may change from feedback.",
  },
  requiredTitle: { zh: "仍然必须保证", en: "Still required" },
  requiredBody: {
    zh: "严格类型、卸载清理、SSR 安全、键盘基本路径、双语文档和明确的已知限制。",
    en: "Strict types, cleanup, SSR safety, a baseline keyboard path, bilingual docs, and explicit known limitations.",
  },
  stagesTitle: { zh: "晋级流程", en: "Promotion stages" },
  proposalTitle: { zh: "提案", en: "Proposal" },
  proposalBody: { zh: "确定用户问题、非目标、数据模型和替代方案。", en: "Define the user problem, non-goals, data model, and alternatives." },
  experimentTitle: { zh: "实验实现", en: "Experimental implementation" },
  experimentBody: { zh: "独立导出，补齐案例、类型、测试和已知限制。", en: "Ship through an isolated entry with demos, types, tests, and known limitations." },
  stableTitle: { zh: "稳定晋级", en: "Stable promotion" },
  stableBody: { zh: "API 冻结，完成 a11y/性能门禁与迁移说明后进入稳定入口。", en: "Freeze the API, pass a11y/performance gates, and publish migration notes before entering the stable entry." },
  candidatesTitle: { zh: "候选能力", en: "Candidate capabilities" },
  candidatesLead: {
    zh: "Video 与 Heatmap 已作为独立 Labs 入口发布。它们可用于试验与反馈，但尚未进入稳定组件入口。",
    en: "Video and Heatmap are published through isolated Labs entries. They are available for experiments and feedback, but not yet part of the stable component entry.",
  },
  candidate: { zh: "候选", en: "Candidate" },
  focus: { zh: "首版范围", en: "First-release scope" },
  gate: { zh: "关键门禁", en: "Key gates" },
  statusLabel: { zh: "状态", en: "Status" },
  planned: { zh: "实验性可用", en: "Experimental" },
  videoFocus: { zh: "原生播放状态、控制栏、字幕、画中画、全屏与键盘", en: "Native playback state, controls, captions, PiP, fullscreen, and keyboard" },
  videoGate: { zh: "媒体错误、焦点、字幕语义和浏览器能力降级", en: "Media errors, focus, caption semantics, and browser capability fallbacks" },
  heatmapFocus: { zh: "矩阵/日历数据、色阶、图例、Tooltip 与键盘浏览", en: "Matrix/calendar data, scales, legends, tooltips, and keyboard navigation" },
  heatmapGate: { zh: "大数据性能、色觉可访问性与屏幕阅读器摘要", en: "Large-data performance, color-vision accessibility, and screen-reader summaries" },
  checklistTitle: { zh: "进入 Labs 前的完成清单", en: "Entry checklist" },
  checklistOne: { zh: "公开 API、严格类型和独立导出入口已经确定。", en: "Public API, strict types, and an isolated export entry are defined." },
  checklistTwo: { zh: "至少包含基础、受控、边界和错误状态案例。", en: "Demos cover basic, controlled, boundary, and error states." },
  checklistThree: { zh: "已知限制、兼容矩阵和非目标在页面顶部可见。", en: "Known limitations, compatibility, and non-goals are visible near the top." },
  checklistFour: { zh: "聚焦测试、类型检查、构建和真实浏览器截图通过。", en: "Focused tests, typecheck, build, and real-browser screenshots pass." },
  feedbackTitle: { zh: "实验反馈要具体", en: "Experimental feedback must be concrete" },
  feedbackBody: {
    zh: "提交使用场景、数据规模、操作步骤、预期 API 和实际限制。只说“不好用”无法判断应该调整数据模型、交互还是视觉。",
    en: "Include the use case, data scale, steps, expected API, and observed limitation. “Hard to use” alone cannot identify whether the data model, interaction, or visuals need change.",
  },
  nextTitle: { zh: "稳定能力在哪里？", en: "Looking for stable capabilities?" },
  nextBody: { zh: "回到组件目录选择稳定组件，或阅读质量章节了解晋级门禁。", en: "Choose a stable component from the main catalog or read Quality to understand promotion gates." },
  qualityLink: { zh: "质量门禁", en: "Quality gates" },
  componentsLink: { zh: "组件目录", en: "Component catalog" },
});

defineStyle(articleStyles);

const PageLabsIntroduction = defineHtml(`
  <elf-container class="docs-article">
    <span class="docs-kicker">${t("kicker")}</span>
    <h1>${t("title")}</h1>
    <p class="page-lead">${t("description")}</p>

    <div class="docs-summary">
      <div class="docs-summary-item">
        <span class="docs-summary-label">${t("stability")}</span>
        <span class="docs-summary-value">${t("stabilityValue")}</span>
      </div>
      <div class="docs-summary-item">
        <span class="docs-summary-label">${t("distribution")}</span>
        <span class="docs-summary-value">${t("distributionValue")}</span>
      </div>
      <div class="docs-summary-item">
        <span class="docs-summary-label">${t("promotion")}</span>
        <span class="docs-summary-value">${t("promotionValue")}</span>
      </div>
    </div>

    <p class="docs-callout is-warning"><strong>${t("warningTitle")}</strong> ${t("warningBody")}</p>

    <section class="docs-section">
      <h2>${t("meaningTitle")}</h2>
      <p class="docs-section-lead">${t("meaningLead")}</p>
      <div class="docs-choice-grid" data-docs-toc-ignore>
        <article class="docs-choice">
          <h3>${t("allowedTitle")}</h3>
          <p>${t("allowedBody")}</p>
        </article>
        <article class="docs-choice">
          <h3>${t("requiredTitle")}</h3>
          <p>${t("requiredBody")}</p>
        </article>
      </div>
    </section>

    <section class="docs-section">
      <h2>${t("stagesTitle")}</h2>
      <div class="docs-flow" data-docs-toc-ignore>
        <article class="docs-flow-item">
          <span class="docs-flow-index">01</span>
          <h3>${t("proposalTitle")}</h3>
          <p>${t("proposalBody")}</p>
        </article>
        <article class="docs-flow-item">
          <span class="docs-flow-index">02</span>
          <h3>${t("experimentTitle")}</h3>
          <p>${t("experimentBody")}</p>
        </article>
        <article class="docs-flow-item">
          <span class="docs-flow-index">03</span>
          <h3>${t("stableTitle")}</h3>
          <p>${t("stableBody")}</p>
        </article>
      </div>
    </section>

    <section class="docs-section">
      <h2>${t("candidatesTitle")}</h2>
      <p class="docs-section-lead">${t("candidatesLead")}</p>
      <table class="docs-matrix">
        <thead>
          <tr><th>${t("candidate")}</th><th>${t("focus")}</th><th>${t("gate")}</th><th>${t("statusLabel")}</th></tr>
        </thead>
        <tbody>
          <tr><td><elf-link href="#/labs/video">Video</elf-link></td><td>${t("videoFocus")}</td><td>${t("videoGate")}</td><td>${t("planned")}</td></tr>
          <tr><td><elf-link href="#/labs/heatmap">Heatmap</elf-link></td><td>${t("heatmapFocus")}</td><td>${t("heatmapGate")}</td><td>${t("planned")}</td></tr>
        </tbody>
      </table>
    </section>

    <section class="docs-section">
      <h2>${t("checklistTitle")}</h2>
      <ul class="docs-checklist">
        <li>${t("checklistOne")}</li>
        <li>${t("checklistTwo")}</li>
        <li>${t("checklistThree")}</li>
        <li>${t("checklistFour")}</li>
      </ul>
      <p class="docs-callout"><strong>${t("feedbackTitle")}</strong> ${t("feedbackBody")}</p>
    </section>

    <section class="docs-next" data-docs-toc-ignore>
      <div>
        <h2>${t("nextTitle")}</h2>
        <p>${t("nextBody")}</p>
      </div>
      <div class="docs-link-list">
        <elf-link href="#/quality">${t("qualityLink")} →</elf-link>
        <elf-link href="#/basic/button">${t("componentsLink")} →</elf-link>
      </div>
    </section>
  </elf-container>
`);

export { PageLabsIntroduction };
