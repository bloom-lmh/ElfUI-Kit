import { defineHtml, defineStyle, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";
import { PageTimelineEx1 } from "./ex1";
import { PageTimelineEx2 } from "./ex2";
import { PageTimelineEx3 } from "./ex3";
import { PageTimelineEx4 } from "./ex4";
import { PageTimelineProps } from "./props";

const t = createDocsTranslator({
  kicker: { zh: "数据展示", en: "Data display" },
  title: { zh: "时间轴", en: "Timeline" },
  description: {
    zh: "按时间顺序展示事件，可通过独立的卡片与节点插槽构建警告、交替卡片和业务活动记录。",
    en: "Display chronological events and compose alerts, alternating cards, and business activity records through per-item card and node slots.",
  },
});

defineStyle(
  articleStyles,
  `
  page-timeline-ex1,
  page-timeline-ex2,
  page-timeline-ex3,
  page-timeline-ex4,
  page-timeline-props { display: block; width: 100%; }
`,
);

useComponents({
  "page-timeline-ex1": PageTimelineEx1,
  "page-timeline-ex2": PageTimelineEx2,
  "page-timeline-ex3": PageTimelineEx3,
  "page-timeline-ex4": PageTimelineEx4,
  "page-timeline-props": PageTimelineProps,
});

const PageTimeline = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="data" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-timeline-ex1 />
    <page-timeline-ex2 />
    <page-timeline-ex3 />
    <page-timeline-ex4 />
    <page-timeline-props />
  </elf-container>
`);

export { PageTimeline };
