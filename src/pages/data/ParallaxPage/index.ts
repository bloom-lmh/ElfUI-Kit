import { defineHtml, useComponents } from "@elfui/core";

import { PageParallaxEx1 } from "./ex1";
import { PageParallaxEx2 } from "./ex2";
import { PageParallaxProps } from "./props";

useComponents({
  "page-parallax-ex1": PageParallaxEx1,
  "page-parallax-ex2": PageParallaxEx2,
  "page-parallax-props": PageParallaxProps
});

const PageParallax = defineHtml(`
  <elf-container>
    <h1>Parallax 视差滚动</h1>
    <p>用轻量的滚动位移增强图片层次，支持禁用动画和手动更新。</p>

    <page-parallax-ex1 />

    <page-parallax-ex2 />

    <page-parallax-props />
  </elf-container>
`);

export { PageParallax };
