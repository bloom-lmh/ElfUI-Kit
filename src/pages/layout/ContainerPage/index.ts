import { defineHtml, useComponents } from "@elfui/core";
import { PageContainerEx1 } from "./ex1";
import { PageContainerEx2 } from "./ex2";
import { PageContainerProps } from "./props";

useComponents({
  "page-container-ex1": PageContainerEx1,
  "page-container-ex2": PageContainerEx2,
  "page-container-props": PageContainerProps
});

const PageContainer = defineHtml(`
  <elf-container
    ><h1>Container 容器</h1>
    <p>限宽居中容器，常用作页面骨架。</p>
    <page-container-ex1 /><page-container-ex2 /><page-container-props
  /></elf-container>
`);

export { PageContainer };
