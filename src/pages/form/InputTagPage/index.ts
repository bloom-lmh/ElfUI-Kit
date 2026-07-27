import { defineHtml, useComponents } from "@elfui/core";
import { PageInputTagProps } from "./props";
import { PageInputTagEx1 } from "./ex1";
import { PageInputTagEx2 } from "./ex2";

useComponents({
  "page-input-tag-ex1": PageInputTagEx1,
  "page-input-tag-ex2": PageInputTagEx2,
  "page-input-tag-props": PageInputTagProps
});

const PageInputTag = defineHtml(`
  <elf-container>
    <h1>InputTag 标签输入</h1>
    <p>把输入内容转换成标签。标签复用 Tag 的颜色、轮廓和关闭语义，内容较多时自动换行并保持每项可操作。</p>

    <page-input-tag-ex1 />

    <page-input-tag-ex2 />
    <page-input-tag-props></page-input-tag-props>
  </elf-container>
`);

export { PageInputTag };
