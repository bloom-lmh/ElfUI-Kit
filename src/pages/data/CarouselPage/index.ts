import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageCarouselEx1 } from "./ex1";
import { PageCarouselEx2 } from "./ex2";
import { PageCarouselEx3 } from "./ex3";
import { PageCarouselProps } from "./props";

useComponents({
  "page-carousel-ex1": PageCarouselEx1,
  "page-carousel-ex2": PageCarouselEx2,
  "page-carousel-ex3": PageCarouselEx3,
  "page-carousel-props": PageCarouselProps
});

const t = createDocsTranslator({
  title: { zh: "Carousel 轮播图", en: "Carousel" },
  description: {
    zh: "在有限空间中浏览一组内容，支持可控自动播放、无感循环、键盘、触屏、动态数据与减少动画偏好。",
    en: "Browse content in limited space with controllable autoplay, seamless looping, keyboard, touch, dynamic data, and reduced-motion support."
  }
});

const PageCarousel = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-carousel-ex1></page-carousel-ex1>
    <page-carousel-ex2></page-carousel-ex2>
    <page-carousel-ex3></page-carousel-ex3>
    <page-carousel-props></page-carousel-props>
  </elf-container>
`);

export { PageCarousel };
