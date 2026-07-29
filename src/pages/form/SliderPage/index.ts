import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageSliderEx1 } from "./ex1";
import { PageSliderEx2 } from "./ex2";
import { PageSliderEx3 } from "./ex3";
import { PageSliderEx4 } from "./ex4";
import { PageSliderEx5 } from "./ex5";
import { PageSliderEx6 } from "./ex6";
import { PageSliderEx7 } from "./ex7";
import { PageSliderEx8 } from "./ex8";
import { PageSliderProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "滑块", en: "Slider" },
  description: {
    zh: "用于连续或区间数值选择，支持步进、刻度、输入框、纵向模式与自定义提示。",
    en: "Select a continuous value or range with steps, marks, numeric input, vertical orientation, and custom tooltips."
  }
});

useComponents({
  "page-slider-ex1": PageSliderEx1,
  "page-slider-ex2": PageSliderEx2,
  "page-slider-ex3": PageSliderEx3,
  "page-slider-ex4": PageSliderEx4,
  "page-slider-ex5": PageSliderEx5,
  "page-slider-ex6": PageSliderEx6,
  "page-slider-ex7": PageSliderEx7,
  "page-slider-ex8": PageSliderEx8,
  "page-slider-props": PageSliderProps
});

const PageSlider = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-slider-ex1></page-slider-ex1>
    <page-slider-ex2></page-slider-ex2>
    <page-slider-ex3></page-slider-ex3>
    <page-slider-ex4></page-slider-ex4>
    <page-slider-ex5></page-slider-ex5>
    <page-slider-ex6></page-slider-ex6>
    <page-slider-ex7></page-slider-ex7>
    <page-slider-ex8></page-slider-ex8>
    <page-slider-props></page-slider-props>
  </elf-container>
`);

export { PageSlider };
