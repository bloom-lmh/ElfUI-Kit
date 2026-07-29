import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "完整字体对象", en: "Complete font object" },
  watermark: { zh: "内部资料", en: "INTERNAL" },
  content: { zh: "多行文字水印", en: "Multiline text watermark" },
  detail: { zh: "字体对象可统一设置颜色、字号、字重、字形、字族与文字对齐方式。", en: "The font object configures color, size, weight, style, family, and text alignment together." }
});

const code2 = `<elf-watermark :content.prop="lines" :font.prop="font" :rotate="-18">
  <div class="demo-paper">${t("content")}</div>
</elf-watermark>`;

const code2Script = `const lines = ["ElfUI", "${t("watermark")}"];
const font = {
    color: "rgba(25, 118, 210, 0.16)",
    fontSize: 18,
    fontWeight: 600,
    fontStyle: "italic",
    fontFamily: "Inter, sans-serif",
    textAlign: "right",
};`;

const lines = ["ElfUI", t("watermark")];

const font = {
    color: "rgba(25, 118, 210, 0.16)",
    fontSize: 18,
    fontWeight: 600,
    fontStyle: "italic",
    fontFamily: "Inter, sans-serif",
    textAlign: "right" as const,
};

const PageWatermarkEx2 = defineHtml(`
<elf-playground :title=${t("title")} :code=${code2} :script=${code2Script}>
            <elf-watermark :content.prop=${lines} :font.prop=${font} :rotate=${-18}>
                <div style="height:180px;padding:24px;border:1px solid var(--elf-border-color);border-radius:8px">
                    ${t("detail")}
                </div>
            </elf-watermark>
        </elf-playground>
`);

export { PageWatermarkEx2 };
