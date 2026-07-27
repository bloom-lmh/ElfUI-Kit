import { defineHtml, useComponents } from "@elfui/core";
import { PageResultProps } from "./props";
import { PageResultEx1 } from "./ex1";
import { PageResultEx2 } from "./ex2";
import { PageResultEx3 } from "./ex3";

useComponents({
  "page-result-ex1": PageResultEx1,
  "page-result-ex2": PageResultEx2,
  "page-result-ex3": PageResultEx3,
  "page-result-props": PageResultProps
});

const PageResult = defineHtml(`
  <elf-container>
    <h1>Result 结果</h1>
    <p>用于流程结束页或局部操作结果，支持 success、warning、error 与 info 状态。</p>

    <page-result-ex1 />

    <page-result-ex2 />

    <page-result-ex3 />

    <page-result-props></page-result-props>
  </elf-container>
`);

export { PageResult };
