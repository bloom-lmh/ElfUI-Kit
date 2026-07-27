import { defineHtml, useComponents } from "@elfui/core";
import { PageTimelineEx1 } from "./ex1";
import { PageTimelineEx2 } from "./ex2";
import { PageTimelineEx3 } from "./ex3";
import { PageTimelineEx4 } from "./ex4";
import { PageTimelineProps } from "./props";

useComponents({
  "page-timeline-ex1": PageTimelineEx1,
  "page-timeline-ex2": PageTimelineEx2,
  "page-timeline-ex3": PageTimelineEx3,
  "page-timeline-ex4": PageTimelineEx4,
  "page-timeline-props": PageTimelineProps
});

const PageTimeline = defineHtml(`
  <elf-container>
    <h1>Timeline 时间轴</h1>
    <p>按时间顺序展示事件，支持语义色、交替布局、横向布局以及每项独立的卡片和节点插槽。</p>
    <page-timeline-ex1 />
    <page-timeline-ex2 />
    <page-timeline-ex3 />
    <page-timeline-ex4 />
    <page-timeline-props />
  </elf-container>
`);

export { PageTimeline };
