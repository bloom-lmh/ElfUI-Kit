import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "自定义图标", en: "Custom icon" },
  detail: { zh: "icon 插槽可替换默认状态图形", en: "The icon slot replaces the default status graphic." }
});

const slotCode = `<elf-result title="${t("title")}" sub-title="${t("detail")}">
  <span slot="icon">★</span>
</elf-result>`;

const PageResultEx3 = defineHtml(`
<elf-playground :title=${t("title")} :code=${slotCode}>
      <elf-result :title=${t("title")} :sub-title=${t("detail")}>
        <span slot="icon">★</span>
      </elf-result>
    </elf-playground>
`);

export { PageResultEx3 };
