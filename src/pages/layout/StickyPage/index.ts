import { defineHtml, useComponents } from "@elfui/core";
import { PageStickyEx1 } from "./ex1";
import { PageStickyEx2 } from "./ex2";
import { PageStickyEx3 } from "./ex3";
import { PageStickyEx4 } from "./ex4";
import { PageStickyProps } from "./props";

useComponents({
  "page-sticky-ex1": PageStickyEx1,
  "page-sticky-ex2": PageStickyEx2,
  "page-sticky-ex3": PageStickyEx3,
  "page-sticky-ex4": PageStickyEx4,
  "page-sticky-props": PageStickyProps
});

const PageSticky = defineHtml(`
  <elf-container>
    <h1>Sticky 吸附</h1>
    <p>让工具栏、操作栏或分组标题在滚动容器内保持可见，支持目标边界、Teleport 与滚动状态。</p>
    <page-sticky-ex1></page-sticky-ex1>
    <page-sticky-ex2></page-sticky-ex2>
    <page-sticky-ex3></page-sticky-ex3>
    <page-sticky-ex4></page-sticky-ex4>
    <page-sticky-props></page-sticky-props>
  </elf-container>
`);

export { PageSticky };
