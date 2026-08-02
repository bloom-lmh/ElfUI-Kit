import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "局部暗色主题", en: "Local dark theme" },
  inherited: { zh: "继承局部主题", en: "Inherits the local theme" },
  description: {
    zh: "只影响 Provider 子树，不修改全站主题。",
    en: "Only affects the provider subtree and leaves the application theme unchanged.",
  },
  button: { zh: "继承主题按钮", en: "Themed button" },
  outlined: { zh: "描边按钮", en: "Outlined button" },
  token: { zh: "局部 token", en: "Local token" },
});

const darkCode = `<elf-theme-provider theme="dark" primary="#80cbc4" surface="#172525">
  <elf-button>${t("inherited")}</elf-button>
</elf-theme-provider>`;

const PageThemeProviderEx1 = defineHtml(`
<elf-playground :title=${t("title")} :code=${darkCode}>
      <elf-theme-provider theme="dark" primary="#80cbc4" surface="#172525">
        <div
          style="display:grid;gap:12px;width:100%;max-width:680px;padding:20px;border-radius:8px;background:var(--elf-bg-paper);color:var(--elf-text-primary);border:1px solid var(--elf-border)"
        >
          <strong>${t("title")}</strong>
          <span style="color:var(--elf-text-secondary)"
            >${t("description")}</span
          >
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <elf-button>${t("button")}</elf-button>
            <elf-button variant="outlined">${t("outlined")}</elf-button>
            <elf-tag color="info">${t("token")}</elf-tag>
          </div>
        </div>
      </elf-theme-provider>
    </elf-playground>
`);

export { PageThemeProviderEx1 };
