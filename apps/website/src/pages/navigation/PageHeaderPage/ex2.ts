import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "自定义页头插槽", en: "Custom page-header slots" },
  customSlots: { zh: "自定义插槽", en: "Custom slots" },
  breadcrumb: { zh: "首页 / 产品 / 详情", en: "Home / Product / Detail" },
  back: { zh: "回到列表", en: "Back to list" },
  content: { zh: "发布配置", en: "Release settings" },
  preview: { zh: "预览", en: "Preview" },
  save: { zh: "保存", en: "Save" },
  comment: {
    zh: "纯插槽组合案例，无需额外状态。",
    en: "This slot-composition example needs no additional state.",
  },
});

const code2 = `<elf-page-header content="${t("customSlots")}">
  <span slot="breadcrumb">${t("breadcrumb")}</span>
  <span slot="icon">←</span>
  <span slot="title">${t("back")}</span>
  <span slot="content">${t("content")}</span>
  <div slot="extra">
    <elf-button size="sm" variant="outlined">${t("preview")}</elf-button>
    <elf-button size="sm">${t("save")}</elf-button>
  </div>
</elf-page-header>`;

const script2 = `// ${t("comment")}`;

const PagePageHeaderEx2 = defineHtml(`
<elf-playground :title=${t("title")} :code=${code2} :script=${script2}>
      <elf-page-header :content=${t("customSlots")}>
        <span slot="breadcrumb">${t("breadcrumb")}</span>
        <span slot="icon">←</span>
        <span slot="title">${t("back")}</span>
        <span slot="content">${t("content")}</span>
        <div slot="extra" style="display:flex;gap:8px">
          <elf-button size="sm" variant="outlined">${t("preview")}</elf-button>
          <elf-button size="sm">${t("save")}</elf-button>
        </div>
      </elf-page-header>
    </elf-playground>
`);

export { PagePageHeaderEx2 };
