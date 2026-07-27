import { defineHtml, useComponents } from "@elfui/core";
import { PageSkeletonEx1 } from "./ex1";
import { PageSkeletonEx2 } from "./ex2";
import { PageSkeletonProps } from "./props";

useComponents({
  "page-skeleton-ex1": PageSkeletonEx1,
  "page-skeleton-ex2": PageSkeletonEx2,
  "page-skeleton-props": PageSkeletonProps
});

const PageSkeleton = defineHtml(`
  <elf-container
    ><h1>Skeleton 骨架屏</h1>
    <p>Material Design 风格骨架屏，支持文本/圆形/矩形三种变体，带 shimmer 扫光动画。</p>
    <page-skeleton-ex1 /><page-skeleton-ex2 /><page-skeleton-props
  /></elf-container>
`);

export { PageSkeleton };
