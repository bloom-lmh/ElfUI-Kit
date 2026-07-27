import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageBacktopEx1 } from "./ex1";
import { PageBacktopEx2 } from "./ex2";
import { PageBacktopProps } from "./props";

useComponents({
  "page-backtop-ex1": PageBacktopEx1,
  "page-backtop-ex2": PageBacktopEx2,
  "page-backtop-props": PageBacktopProps
});

const t = createDocsTranslator({
  title: { zh: "BackTop 回到顶部", en: "BackTop" },
  description: {
    zh: "监听页面或指定容器的滚动位置，超过阈值后显示简洁的返回顶部按钮。",
    en: "Monitor a page or container and reveal a concise back-to-top action after the threshold."
  }
});

const PageBacktop = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-backtop-ex1></page-backtop-ex1>
    <page-backtop-ex2></page-backtop-ex2>
    <page-backtop-props></page-backtop-props>
  </elf-container>
`);

export { PageBacktop };
