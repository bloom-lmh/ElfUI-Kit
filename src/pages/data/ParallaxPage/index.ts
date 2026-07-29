import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

import { PageParallaxEx1 } from "./ex1";
import { PageParallaxEx2 } from "./ex2";
import { PageParallaxProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "视差滚动", en: "Parallax" },
  description: {
    zh: "用轻量的滚动位移增强图片层次，支持禁用动画和手动更新。",
    en: "Add depth with subtle scroll movement, with controls for disabling motion and updating manually."
  }
});

useComponents({
  "page-parallax-ex1": PageParallaxEx1,
  "page-parallax-ex2": PageParallaxEx2,
  "page-parallax-props": PageParallaxProps
});

const PageParallax = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>

    <page-parallax-ex1 />

    <page-parallax-ex2 />

    <page-parallax-props />
  </elf-container>
`);

export { PageParallax };
