import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  title: { zh: "实验室", en: "Labs" },
  description: {
    zh: "实验室承载仍在验证 API、可访问性或性能边界的能力。实验组件不会进入默认稳定入口，也不会伪装成稳定组件。",
    en: "Labs hosts capabilities whose APIs, accessibility, or performance limits are still being validated. Experimental components do not enter the default stable entry or masquerade as stable.",
  },
  contractTitle: { zh: "实验契约", en: "Experimental contract" },
  contractBody: {
    zh: "独立导出、明确实验标识、允许破坏性调整；满足测试、文档、无障碍和性能门禁后才能晋升稳定。",
    en: "Separate exports, explicit experimental labels, and permitted breaking adjustments. Promotion requires tests, docs, accessibility, and performance gates.",
  },
  videoTitle: { zh: "视频", en: "Video" },
  videoBody: {
    zh: "优先封装原生视频的播放状态、控制栏、字幕、画中画和键盘操作，不内置 HLS/DASH 播放引擎。",
    en: "Wrap native video playback state, controls, captions, picture-in-picture, and keyboard operation without bundling an HLS or DASH engine.",
  },
  heatmapTitle: { zh: "热力图", en: "Heatmap" },
  heatmapBody: {
    zh: "首版聚焦矩阵与日历热力图，支持色阶、图例、Tooltip、键盘浏览和大数据降采样；不包含地理地图。",
    en: "The first version targets matrix and calendar heatmaps with color scales, legends, tooltips, keyboard navigation, and large-data sampling—not geographic maps.",
  },
  note: {
    zh: "Video 与 Heatmap 当前是已批准的实现路线图，完成组件、类型、案例、测试和浏览器验收后才会出现在实验室子菜单。",
    en: "Video and Heatmap are approved implementation roadmaps. They appear as Labs submenu entries only after components, types, demos, tests, and browser verification are complete.",
  },
});

defineStyle(articleStyles);

const PageLabsIntroduction = defineHtml(`
  <elf-container class="docs-article">
    <h1>${t("title")}</h1>
    <p class="page-lead">${t("description")}</p>

    <section class="article-card">
      <span class="status">experimental</span>
      <h2>${t("contractTitle")}</h2>
      <p>${t("contractBody")}</p>
    </section>

    <div class="article-grid">
      <section class="article-card">
        <span class="status">planned</span>
        <h2>${t("videoTitle")}</h2>
        <p>${t("videoBody")}</p>
      </section>
      <section class="article-card">
        <span class="status">planned</span>
        <h2>${t("heatmapTitle")}</h2>
        <p>${t("heatmapBody")}</p>
      </section>
    </div>

    <p class="article-note">${t("note")}</p>
  </elf-container>
`);

export { PageLabsIntroduction };
