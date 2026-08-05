import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageHeadingEx1 } from "./ex1";
import { PageHeadingEx2 } from "./ex2";
import { PageHeadingEx3 } from "./ex3";
import { PageHeadingEx4 } from "./ex4";
import { PageHeadingEx5 } from "./ex5";
import { PageHeadingEx6 } from "./ex6";
import { PageHeadingEx7 } from "./ex7";
import { PageHeadingProps } from "./props";

useComponents({
  "page-heading-ex1": PageHeadingEx1,
  "page-heading-ex2": PageHeadingEx2,
  "page-heading-ex3": PageHeadingEx3,
  "page-heading-ex4": PageHeadingEx4,
  "page-heading-ex5": PageHeadingEx5,
  "page-heading-ex6": PageHeadingEx6,
  "page-heading-ex7": PageHeadingEx7,
  "page-heading-props": PageHeadingProps,
});

const t = createDocsTranslator({
  title: { zh: "Heading 标题", en: "Heading" },
  description: {
    zh: "内置六套配套标题体系：文档指南、编辑杂志、开发者终端、品牌展示、霓虹与极简。按 family 选择套装，level 决定语义层级，numbered、accent、chip、eyebrow、gradient 组合装饰，并可用 line-height、margin-top、margin-bottom、font-size、letter-spacing 直接覆盖样式。",
    en: "Ship six coordinated heading suites: guide, editorial, terminal, brand, neon, and minimal. Pick a suite with family, drive semantics with level, compose numbered, accent, chip, eyebrow, and gradient decorations, and override line-height, margin-top, margin-bottom, font-size, and letter-spacing directly.",
  },
});

const PageHeading = defineHtml(`
  <elf-container>
    <elf-docs-hero category="basic" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-heading-ex1 />
    <page-heading-ex2 />
    <page-heading-ex3 />
    <page-heading-ex4 />
    <page-heading-ex5 />
    <page-heading-ex6 />
    <page-heading-ex7 />
    <page-heading-props />
  </elf-container>
`);

export { PageHeading };
