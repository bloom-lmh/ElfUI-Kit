import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageTabsEx1 } from "./ex1";
import { PageTabsEx2 } from "./ex2";
import { PageTabsEx3 } from "./ex3";
import { PageTabsEx4 } from "./ex4";
import { PageTabsEx5 } from "./ex5";
import { PageTabsEx6 } from "./ex6";
import { PageTabsEx7 } from "./ex7";
import { PageTabsEx8 } from "./ex8";
import { PageTabsEx9 } from "./ex9";
import { PageTabsEx10 } from "./ex10";
import { PageTabsProps } from "./props";

useComponents({
  "page-tabs-ex1": PageTabsEx1, "page-tabs-ex2": PageTabsEx2,
  "page-tabs-ex3": PageTabsEx3, "page-tabs-ex4": PageTabsEx4,
  "page-tabs-ex5": PageTabsEx5, "page-tabs-ex6": PageTabsEx6,
  "page-tabs-ex7": PageTabsEx7, "page-tabs-ex8": PageTabsEx8,
  "page-tabs-ex9": PageTabsEx9, "page-tabs-ex10": PageTabsEx10,
  "page-tabs-props": PageTabsProps
});

const t = createDocsTranslator({
  title: { zh: "Tabs 标签页", en: "Tabs" },
  description: {
    zh: "在同一层级切换内容，支持铺满、对齐、堆叠、垂直、可编辑和内容面板。",
    en: "Switch between peer content with grow, alignment, stacked, vertical, editable, and panel variants."
  }
});

const PageTabs = defineHtml(`
  <elf-container>
    <h1>{{ t("title") }}</h1>
    <p>{{ t("description") }}</p>
    <page-tabs-ex8></page-tabs-ex8>
    <page-tabs-ex1></page-tabs-ex1>
    <page-tabs-ex9></page-tabs-ex9>
    <page-tabs-ex10></page-tabs-ex10>
    <page-tabs-ex2></page-tabs-ex2>
    <page-tabs-ex5></page-tabs-ex5>
    <page-tabs-ex6></page-tabs-ex6>
    <page-tabs-ex7></page-tabs-ex7>
    <page-tabs-ex3></page-tabs-ex3>
    <page-tabs-ex4></page-tabs-ex4>
    <page-tabs-props></page-tabs-props>
  </elf-container>
`);

export { PageTabs };
