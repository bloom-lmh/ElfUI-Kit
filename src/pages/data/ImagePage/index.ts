import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageImageEx1 } from "./ex1";
import { PageImageEx2 } from "./ex2";
import { PageImageEx3 } from "./ex3";
import { PageImageEx4 } from "./ex4";
import { PageImageProps } from "./props";

useComponents({
  "page-image-ex1": PageImageEx1,
  "page-image-ex2": PageImageEx2,
  "page-image-ex3": PageImageEx3,
  "page-image-ex4": PageImageEx4,
  "page-image-props": PageImageProps
});

const t = createDocsTranslator({
  title: { zh: "Image 图片", en: "Image" },
  description: {
    zh: "可靠展示固定或响应式图片，覆盖对象适配、懒加载、错误恢复，以及具备完整键盘与焦点语义的预览组。",
    en: "Render fixed or responsive images reliably with object fitting, lazy loading, error recovery, and preview groups with complete keyboard and focus behavior."
  }
});

const PageImage = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-image-ex1 />
    <page-image-ex2 />
    <page-image-ex3 />
    <page-image-ex4 />
    <page-image-props />
  </elf-container>
`);

export { PageImage };
