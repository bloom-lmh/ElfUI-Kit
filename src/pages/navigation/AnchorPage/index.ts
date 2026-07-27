import {
  PageAnchorEx1 } from "./ex1";
import { PageAnchorEx2 } from "./ex2";
import { PageAnchorEx3 } from "./ex3";
import { PageAnchorProps } from "./props";

import { defineHtml,
  useComponents
} from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

useComponents({
  "page-anchor-ex1": PageAnchorEx1,
  "page-anchor-ex2": PageAnchorEx2,
  "page-anchor-ex3": PageAnchorEx3,
  "page-anchor-props": PageAnchorProps
});

const t = createDocsTranslator({
  title: { zh: "Anchor 锚点", en: "Anchor" },
  description: {
    zh: "Anchor 会让导航与滚动容器保持同步，支持嵌套项、受控激活状态、禁用项以及点击和变更事件。",
    en: "Anchor keeps navigation in sync with a scroll container. It supports nested items, controlled active state, disabled entries, and click/change events."
  }
});

const PageAnchor = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-anchor-ex1></page-anchor-ex1>
    <page-anchor-ex2></page-anchor-ex2>
    <page-anchor-ex3></page-anchor-ex3>
    <page-anchor-props></page-anchor-props>
  </elf-container>
`);

export { PageAnchor };
