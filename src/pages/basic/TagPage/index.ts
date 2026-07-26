import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageTagEx1 } from "./ex1";
import { PageTagEx2 } from "./ex2";
import { PageTagProps } from "./props";

useComponents({
  "page-tag-ex1": PageTagEx1,
  "page-tag-ex2": PageTagEx2,
  "page-tag-props": PageTagProps
});

const t = createDocsTranslator({
  title: { zh: "Tag 标签", en: "Tag" },
  description: {
    zh: "紧凑展示状态与分类，也可组合成可选择、可关闭和可编辑的动态标签列表。",
    en: "A compact status and category primitive that composes into selectable, closable, and editable dynamic tag lists."
  }
});

const PageTag = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-tag-ex1 />
    <page-tag-ex2 />
    <page-tag-props />
  </elf-container>
`);

export { PageTag };
