import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "扩展操作区", en: "Extra actions" },
  result: { zh: "发布成功", en: "Published" },
  detail: { zh: "页面已经上线", en: "The page is now live." },
  view: { zh: "查看页面", en: "View page" },
  edit: { zh: "继续编辑", en: "Continue editing" }
});

const extraCode = `<elf-result icon="success" title="${t("result")}" sub-title="${t("detail")}">
  <div slot="extra" style="display:flex;gap:8px;justify-content:center">
    <elf-button variant="outlined">${t("view")}</elf-button>
    <elf-button>${t("edit")}</elf-button>
  </div>
</elf-result>`;

const PageResultEx2 = defineHtml(`
<elf-playground :title=${t("title")} :code=${extraCode}>
      <elf-result icon="success" title=${t("result")} sub-title=${t("detail")}>
        <div slot="extra" style="display:flex;gap:8px;justify-content:center">
          <elf-button variant="outlined">${t("view")}</elf-button>
          <elf-button>${t("edit")}</elf-button>
        </div>
      </elf-result>
    </elf-playground>
`);

export { PageResultEx2 };
