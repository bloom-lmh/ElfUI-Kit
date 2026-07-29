import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageFormEx1 } from "./ex1";
import { PageFormEx2 } from "./ex2";
import { PageFormEx3 } from "./ex3";
import { PageFormEx4 } from "./ex4";
import { PageFormEx5 } from "./ex5";
import { PageFormEx6 } from "./ex6";
import { PageFormProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "表单", en: "Form" },
  description: { zh: "对齐 Element Plus 的 model 与 rules 校验联动，并提供完整字段和命令方法。", en: "Align model and rules validation with Element Plus while exposing complete field and command APIs." }
});

useComponents({
  "page-form-ex1": PageFormEx1,
  "page-form-ex2": PageFormEx2,
  "page-form-ex3": PageFormEx3,
  "page-form-ex4": PageFormEx4,
  "page-form-ex5": PageFormEx5,
  "page-form-ex6": PageFormEx6,
  "page-form-props": PageFormProps
});

const PageForm = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-form-ex1 />
    <page-form-ex2 />
    <page-form-ex3 />
    <page-form-ex4 />
    <page-form-ex5 />
    <page-form-ex6 />
    <page-form-props />
  </elf-container>
`);

export { PageForm };
