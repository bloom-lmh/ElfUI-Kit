import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

import { PageLoadingEx1 } from "./ex1";
import { PageLoadingEx2 } from "./ex2";
import { PageLoadingEx3 } from "./ex3";
import { PageLoadingEx4 } from "./ex4";
import { PageLoadingEx5 } from "./ex5";
import { PageLoadingEx6 } from "./ex6";
import { PageLoadingEx7 } from "./ex7";
import { PageLoadingEx8 } from "./ex8";
import { PageLoadingProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "加载", en: "Loading" },
  description: {
    zh: "为局部内容或全屏任务添加加载遮罩，支持声明式组件、v-loading 指令和命令式服务。",
    en: "Add loading overlays to local content or fullscreen tasks with a component, the v-loading directive, or an imperative service.",
  },
});

useComponents({
  "page-loading-ex1": PageLoadingEx1,
  "page-loading-ex2": PageLoadingEx2,
  "page-loading-ex3": PageLoadingEx3,
  "page-loading-ex4": PageLoadingEx4,
  "page-loading-ex5": PageLoadingEx5,
  "page-loading-ex6": PageLoadingEx6,
  "page-loading-ex7": PageLoadingEx7,
  "page-loading-ex8": PageLoadingEx8,
  "page-loading-props": PageLoadingProps
});

const PageLoading = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>

    <page-loading-ex1 />

    <page-loading-ex2 />

    <page-loading-ex3 />

    <page-loading-ex4 />

    <page-loading-ex5 />

    <page-loading-ex6 />

    <page-loading-ex7 />

    <page-loading-ex8 />

    <page-loading-props />
  </elf-container>
`);

export { PageLoading };
