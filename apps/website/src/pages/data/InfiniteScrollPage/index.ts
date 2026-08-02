import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageInfiniteScrollEx1 } from "./ex1";
import { PageInfiniteScrollEx2 } from "./ex2";
import { PageInfiniteScrollEx3 } from "./ex3";
import { PageInfiniteScrollProps } from "./props";

useComponents({
  "page-infinite-scroll-ex1": PageInfiniteScrollEx1,
  "page-infinite-scroll-ex2": PageInfiniteScrollEx2,
  "page-infinite-scroll-ex3": PageInfiniteScrollEx3,
  "page-infinite-scroll-props": PageInfiniteScrollProps,
});

const t = createDocsTranslator({
  title: { zh: "InfiniteScroll 无限滚动", en: "InfiniteScroll" },
  description: {
    zh: "在内置、外部或页面滚动容器接近底部时请求下一页，覆盖异步失败恢复、明确停止条件和可靠销毁清理。",
    en: "Request the next page near the bottom of an internal, external, or window scroller with async recovery, explicit completion, and reliable teardown.",
  },
});

const PageInfiniteScroll = defineHtml(`
  <elf-container>
    <elf-docs-hero category="data" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-infinite-scroll-ex1 />
    <page-infinite-scroll-ex2 />
    <page-infinite-scroll-ex3 />
    <page-infinite-scroll-props />
  </elf-container>
`);

export { PageInfiniteScroll };
