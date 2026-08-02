import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "基础水印", en: "Basic watermark" },
  short: { zh: "这里是业务内容区域", en: "Business content area" },
  detail: {
    zh: "这里是业务内容区域，滚动、表格和表单都可以放在水印容器内。",
    en: "Scrolling content, tables, and forms can all live inside the watermark container.",
  },
});

const code1 = `<elf-watermark
  content="ElfUI"
  :width="140"
  :height="72"
  :gap-x="60"
  :gap-y="48"
>
  <div class="demo-paper">${t("short")}</div>
</elf-watermark>`;

const PageWatermarkEx1 = defineHtml(`
<elf-playground :title=${t("title")} :code=${code1}>
            <elf-watermark content="ElfUI" :width=${140} :height=${72} :gap-x=${60} :gap-y=${48}>
                <div style="height:180px;padding:24px;border:1px solid var(--elf-border-color);border-radius:8px">
                    ${t("detail")}
                </div>
            </elf-watermark>
        </elf-playground>
`);

export { PageWatermarkEx1 };
