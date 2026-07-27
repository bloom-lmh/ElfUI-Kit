import { defineHtml } from "@elfui/core";

const code2 = `<elf-watermark :content.prop="lines" :font.prop="font" :rotate="-18">
  <div class="demo-paper">多行文字水印</div>
</elf-watermark>`;

const code2Script = `const lines = ["ElfUI", "内部资料"];
const font = {
    color: "rgba(25, 118, 210, 0.16)",
    fontSize: 18,
    fontWeight: 600,
    fontStyle: "italic",
    fontFamily: "Inter, sans-serif",
    textAlign: "right",
};`;

const lines = ["ElfUI", "内部资料"];

const font = {
    color: "rgba(25, 118, 210, 0.16)",
    fontSize: 18,
    fontWeight: 600,
    fontStyle: "italic",
    fontFamily: "Inter, sans-serif",
    textAlign: "right" as const,
};

const PageWatermarkEx2 = defineHtml(`
<elf-playground title="完整字体对象" :code=${code2} :script=${code2Script}>
            <elf-watermark :content.prop=${lines} :font.prop=${font} :rotate=${-18}>
                <div style="height:180px;padding:24px;border:1px solid var(--elf-border-color);border-radius:8px">
                    字体对象可统一设置颜色、字号、字重、字形、字族与文字对齐方式。
                </div>
            </elf-watermark>
        </elf-playground>
`);

export { PageWatermarkEx2 };
