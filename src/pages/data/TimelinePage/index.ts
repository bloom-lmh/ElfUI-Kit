import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageTimelineEx1 } from "./ex1";
import { PageTimelineEx2 } from "./ex2";
import { PageTimelineEx3 } from "./ex3";
import { PageTimelineEx4 } from "./ex4";
import { PageTimelineProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "时间轴", en: "Timeline" },
  description: {
    zh: "按时间顺序展示事件，支持语义色、交替布局、横向布局以及每项独立的卡片和节点插槽。",
    en: "Display chronological events with semantic colors, alternating and horizontal layouts, and per-item card and node slots."
  }
});

useComponents({
  "page-timeline-ex1": PageTimelineEx1,
  "page-timeline-ex2": PageTimelineEx2,
  "page-timeline-ex3": PageTimelineEx3,
  "page-timeline-ex4": PageTimelineEx4,
  "page-timeline-props": PageTimelineProps
});

const PageTimeline = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-timeline-ex1 />
    <page-timeline-ex2 />
    <page-timeline-ex3 />
    <page-timeline-ex4 />
    <page-timeline-props />
  </elf-container>
`);

export { PageTimeline };
