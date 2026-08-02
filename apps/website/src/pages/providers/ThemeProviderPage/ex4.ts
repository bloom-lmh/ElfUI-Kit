import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageThemeServiceTrigger } from "./service-preview";

useComponents({ "page-theme-service-trigger": PageThemeServiceTrigger });

const t = createDocsTranslator({
  section: { zh: "嵌套主题与服务浮层", en: "Nested themes and service overlays" },
  workspace: { zh: "暗色工作区", en: "Dark workspace" },
  workspaceDescription: {
    zh: "外层提供暗色表面与对比度。",
    en: "The outer provider supplies dark surfaces and contrast.",
  },
  approval: { zh: "珊瑚色审批区", en: "Coral approval scope" },
  releaseNote: { zh: "发布说明", en: "Release note" },
  ready: { zh: "等待评审", en: "Ready for review" },
  contrast: { zh: "继承暗色对比度", en: "Inherited dark contrast" },
  saved: { zh: "已保存", en: "Saved" },
});

const innerTokens = {
  primary: "#ffb4ab",
  primaryHover: "#ff897d",
  bgPaper: "#2b2020",
  fieldBg: "#382a2a",
  border: "rgba(255, 180, 171, .28)",
};

const code = `<elf-theme-provider theme="dark" primary="#80cbc4" surface="#111827">
  <elf-theme-provider theme="custom" :tokens.prop="innerTokens">
    <page-theme-service-trigger />
  </elf-theme-provider>
</elf-theme-provider>`;

const script = `const theme = useThemeProvider();

const showThemedMessage = () => ElfMessage.success("${t("saved")}", {
  themeTokens: theme?.tokens
});`;

const PageThemeProviderEx4 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("section")} :code=${code} :script=${script}>
    <elf-theme-provider theme="dark" primary="#80cbc4" surface="#111827">
      <section style="display:grid;gap:16px;width:100%;max-width:760px;padding:20px;border-radius:10px;background:var(--elf-bg-paper);color:var(--elf-text-primary);border:1px solid var(--elf-border)">
        <div>
          <strong>${t("workspace")}</strong>
          <p style="margin:4px 0 0;color:var(--elf-text-secondary)">${t("workspaceDescription")}</p>
        </div>
        <elf-theme-provider theme="custom" :tokens.prop=${innerTokens}>
          <div style="display:grid;gap:14px;padding:18px;border-radius:8px;background:var(--elf-bg-paper);border:1px solid var(--elf-border);color:var(--elf-text-primary)">
            <strong>${t("approval")}</strong>
            <elf-input :label=${t("releaseNote")} :model-value=${t("ready")} variant="solo-filled"></elf-input>
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
              <page-theme-service-trigger></page-theme-service-trigger>
              <elf-tag>${t("contrast")}</elf-tag>
            </div>
          </div>
        </elf-theme-provider>
      </section>
    </elf-theme-provider>
  </elf-playground>
`);

export { PageThemeProviderEx4 };
