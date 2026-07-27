import { defineHtml, useComponents } from "@elfui/core";
import { PageScrollbarEx1 } from "./ex1";
import { PageScrollbarEx2 } from "./ex2";
import { PageScrollbarEx3 } from "./ex3";
import { PageScrollbarProps } from "./props";

useComponents({
  "page-scrollbar-ex1": PageScrollbarEx1,
  "page-scrollbar-ex2": PageScrollbarEx2,
  "page-scrollbar-ex3": PageScrollbarEx3,
  "page-scrollbar-props": PageScrollbarProps
});

const PageScrollbar = defineHtml(`
  <elf-container>
    <h1>Scrollbar 滚动条</h1>
    <p>包裹滚动内容并抛出 scroll 事件，支持固定高度、最大高度、always 预留滚动条空间，以及 setScrollTop / setScrollLeft 命令控制。</p>
    <page-scrollbar-ex1></page-scrollbar-ex1>
    <page-scrollbar-ex2></page-scrollbar-ex2>
    <page-scrollbar-ex3></page-scrollbar-ex3>
    <page-scrollbar-props></page-scrollbar-props>
  </elf-container>
`);

export { PageScrollbar };
