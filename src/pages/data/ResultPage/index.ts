import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageResultProps } from "./props";
import { PageResultEx1 } from "./ex1";
import { PageResultEx2 } from "./ex2";
import { PageResultEx3 } from "./ex3";

const t = createDocsTranslator({
  title: { zh: "结果", en: "Result" },
  description: {
    zh: "用于流程结束页或局部操作结果，支持 success、warning、error 与 info 状态。",
    en: "Present page-level or local operation outcomes with success, warning, error, and info states."
  }
});

useComponents({
  "page-result-ex1": PageResultEx1,
  "page-result-ex2": PageResultEx2,
  "page-result-ex3": PageResultEx3,
  "page-result-props": PageResultProps
});

const PageResult = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>

    <page-result-ex1 />

    <page-result-ex2 />

    <page-result-ex3 />

    <page-result-props></page-result-props>
  </elf-container>
`);

export { PageResult };
