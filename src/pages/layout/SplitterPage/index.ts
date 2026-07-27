import { defineHtml, useComponents } from "@elfui/core";
import { PageSplitterEx1 } from "./ex1";
import { PageSplitterEx2 } from "./ex2";
import { PageSplitterEx3 } from "./ex3";
import { PageSplitterEx4 } from "./ex4";
import { PageSplitterEx5 } from "./ex5";
import { PageSplitterProps } from "./props";

useComponents({
  "page-splitter-ex1": PageSplitterEx1,
  "page-splitter-ex2": PageSplitterEx2,
  "page-splitter-ex3": PageSplitterEx3,
  "page-splitter-ex4": PageSplitterEx4,
  "page-splitter-ex5": PageSplitterEx5,
  "page-splitter-props": PageSplitterProps
});

const PageSplitter = defineHtml(`
  <elf-container>
    <h1>Splitter 分割面板</h1>
    <p>通过拖拽分隔条调整两个区域比例，支持 Panel 子组件、折叠、延迟激活和尺寸持久化。</p>
    <page-splitter-ex1></page-splitter-ex1>
    <page-splitter-ex2></page-splitter-ex2>
    <page-splitter-ex3></page-splitter-ex3>
    <page-splitter-ex4></page-splitter-ex4>
    <page-splitter-ex5></page-splitter-ex5>
    <page-splitter-props></page-splitter-props>
  </elf-container>
`);

export { PageSplitter };
