import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageDividerEx1 } from "./ex1";
import { PageDividerEx2 } from "./ex2";
import { PageDividerProps } from "./props";

useComponents({
  "page-divider-ex1": PageDividerEx1,
  "page-divider-ex2": PageDividerEx2,
  "page-divider-props": PageDividerProps
});

const t = createDocsTranslator({
  title: { zh: "Divider 分割线", en: "Divider" },
  description: {
    zh: "在内容层级或行内分组之间建立清晰边界，支持四种线型、文字位置、垂直方向、RTL 与完整分隔语义。",
    en: "Create clear boundaries between content levels or inline groups with four line styles, content positions, vertical orientation, RTL, and complete separator semantics."
  }
});

const PageDivider = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-divider-ex1 />
    <page-divider-ex2 />
    <page-divider-props />
  </elf-container>
`);

export { PageDivider };
