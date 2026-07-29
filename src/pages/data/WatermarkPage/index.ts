import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageWatermarkProps } from "./props";
import { PageWatermarkEx1 } from "./ex1";
import { PageWatermarkEx2 } from "./ex2";
import { PageWatermarkEx3 } from "./ex3";

const t = createDocsTranslator({
  title: { zh: "水印", en: "Watermark" },
  description: {
    zh: "给内容区域增加文字或图片水印，支持尺寸、间距、旋转角度、颜色及多行文本。",
    en: "Add text or image watermarks with configurable size, spacing, rotation, color, and multiple lines."
  }
});

useComponents({
  "page-watermark-ex1": PageWatermarkEx1,
  "page-watermark-ex2": PageWatermarkEx2,
  "page-watermark-ex3": PageWatermarkEx3,
  "page-watermark-props": PageWatermarkProps
});

const PageWatermark = defineHtml(`
    <elf-container>
        <h1>${t("title")}</h1>
        <p>${t("description")}</p>

        <page-watermark-ex1 />

        <page-watermark-ex2 />
        <page-watermark-ex3 />
        <page-watermark-props></page-watermark-props>
    </elf-container>
`);

export { PageWatermark };
