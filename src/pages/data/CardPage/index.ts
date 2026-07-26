import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageCardEx1 } from "./ex1";
import { PageCardEx2 } from "./ex2";
import { PageCardEx3 } from "./ex3";
import { PageCardProps } from "./props";

useComponents({
  "page-card-ex1": PageCardEx1,
  "page-card-ex2": PageCardEx2,
  "page-card-ex3": PageCardEx3,
  "page-card-props": PageCardProps
});

const t = createDocsTranslator({
  title: { zh: "Card 卡片", en: "Card" },
  description: {
    zh: "承载相关内容与操作的 Surface 容器，支持层级、密度、整卡交互、加载状态和可恢复媒体。",
    en: "A surface container for related content and actions, with hierarchy, density, whole-card interaction, loading state, and recoverable media."
  }
});

const PageCard = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-card-ex1 />
    <page-card-ex2 />
    <page-card-ex3 />
    <page-card-props />
  </elf-container>
`);

export { PageCard };
