import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  autosize: { zh: "输入内容自动撑高", en: "Autosize as content grows" },
  autosizePlaceholder: {
    zh: "键入更多内容会自动撑高",
    en: "Type more content to grow automatically",
  },
  noResize: { zh: "禁止手动调整大小", en: "Disable manual resizing" },
  noResizePlaceholder: { zh: "不可拖拽", en: "Cannot be resized" },
});
const code1 = `<div style="width:100%;max-width:480px">
  <elf-textarea autosize placeholder="${t("autosizePlaceholder")}" />
</div>`;

const code2 = `<div style="width:100%;max-width:480px">
  <elf-textarea resize="none" rows="3" placeholder="${t("noResizePlaceholder")}" />
</div>`;

const PageTextareaEx2 = defineHtml(`
  <h2>${t("autosize")}</h2>
  <elf-playground :title=${t("autosize")} :code=${code1}>
    <div style="width:100%;max-width:480px">
      <elf-textarea autosize :placeholder=${t("autosizePlaceholder")} />
    </div>
  </elf-playground>
  <h2>${t("noResize")}</h2>
  <elf-playground :title=${t("noResize")} :code=${code2}>
    <div style="width:100%;max-width:480px">
      <elf-textarea resize="none" rows="3" :placeholder=${t("noResizePlaceholder")} />
    </div>
  </elf-playground>
`);

export { PageTextareaEx2 };
