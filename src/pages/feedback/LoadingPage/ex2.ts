import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "自定义遮罩背景", en: "Custom overlay background" },
  processing: { zh: "处理中", en: "Processing" },
  content: { zh: "自定义遮罩背景", en: "Custom overlay background" },
});

const code2 = `<elf-loading
  loading
  text="${t("processing")}"
  background="rgba(24, 144, 255, 0.12)"
>
  <div class="demo-panel">${t("content")}</div>
</elf-loading>`;

const PageLoadingEx2 = defineHtml(`
<elf-playground :title=${t("title")} :code=${code2}>
      <elf-loading loading :text=${t("processing")} background="rgba(24, 144, 255, 0.12)">
        <div
          style="height:120px;padding:24px;border:1px solid var(--elf-border-color);border-radius:8px"
        >
          ${t("content")}
        </div>
      </elf-loading>
    </elf-playground>
`);

export { PageLoadingEx2 };
