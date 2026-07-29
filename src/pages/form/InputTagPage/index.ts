import { defineHtml, useComponents } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";
import { PageInputTagProps } from "./props";
import { PageInputTagEx1 } from "./ex1";
import { PageInputTagEx2 } from "./ex2";

const p = createDocsPicker();

useComponents({
  "page-input-tag-ex1": PageInputTagEx1,
  "page-input-tag-ex2": PageInputTagEx2,
  "page-input-tag-props": PageInputTagProps
});

const PageInputTag = defineHtml(`
  <elf-container>
    <h1>${p("标签输入", "Input tag")}</h1>
    <p>${p("把输入内容转换成标签；内容较多时自动换行，并保持每个标签可操作。", "Turn typed content into tags that wrap automatically while each item remains operable.")}</p>

    <page-input-tag-ex1 />

    <page-input-tag-ex2 />
    <page-input-tag-props></page-input-tag-props>
  </elf-container>
`);

export { PageInputTag };
