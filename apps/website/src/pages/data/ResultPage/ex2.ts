import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "扩展操作区", en: "Extra actions" },
  result: { zh: "部署成功", en: "Deployed" },
  detail: { zh: "v2.4.1 已发布到生产环境。", en: "v2.4.1 is live in production." },
  view: { zh: "查看发布记录", en: "View release log" },
  edit: { zh: "返回项目", en: "Back to project" },
});

const extraCode = `<elf-result icon="success" title="${t("result")}" sub-title="${t("detail")}">
  <div slot="extra" style="display:flex;gap:8px;justify-content:center">
    <elf-button variant="outlined">${t("view")}</elf-button>
    <elf-button>${t("edit")}</elf-button>
  </div>
</elf-result>`;

const PageResultEx2 = defineHtml(`
<elf-playground :title=${t("title")} :code=${extraCode}>
      <elf-result icon="success" :title=${t("result")} :sub-title=${t("detail")}>
        <div slot="extra" style="display:flex;gap:8px;justify-content:center">
          <elf-button variant="outlined">${t("view")}</elf-button>
          <elf-button>${t("edit")}</elf-button>
        </div>
      </elf-result>
    </elf-playground>
`);

export { PageResultEx2 };
