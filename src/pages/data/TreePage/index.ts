import { defineHtml, useComponents } from "@elfui/core";
import { PageTreeEx1 } from "./ex1";
import { PageTreeEx2 } from "./ex2";
import { PageTreeEx3 } from "./ex3";
import { PageTreeEx4 } from "./ex4";
import { PageTreeEx5 } from "./ex5";
import { PageTreeEx6 } from "./ex6";
import { PageTreeProps } from "./props";

useComponents({
  "page-tree-ex1": PageTreeEx1,
  "page-tree-ex2": PageTreeEx2,
  "page-tree-ex3": PageTreeEx3,
  "page-tree-ex4": PageTreeEx4,
  "page-tree-ex5": PageTreeEx5,
  "page-tree-ex6": PageTreeEx6,
  "page-tree-props": PageTreeProps
});

const PageTree = defineHtml(`
  <elf-container>
    <h1>Tree 树</h1>
    <p>用于展示层级数据，支持展开收起、节点选择、复选框级联、过滤和自定义字段。</p>
    <page-tree-ex1></page-tree-ex1>
    <page-tree-ex2></page-tree-ex2>
    <page-tree-ex3></page-tree-ex3>
    <page-tree-ex4></page-tree-ex4>
    <page-tree-ex5></page-tree-ex5>
    <page-tree-ex6></page-tree-ex6>
    <page-tree-props></page-tree-props>
  </elf-container>
`);

export { PageTree };
