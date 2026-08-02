import { defineHtml } from "@elfui/core";

import { APP_SKINS } from "../../../app/skins";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "多套主题皮肤", en: "Multiple theme skins" },
  status: {
    zh: "同一组件 · 四套 Provider token",
    en: "The same components · four Provider token sets",
  },
  projectName: { zh: "项目名称", en: "Project name" },
  confirm: { zh: "确认", en: "Confirm" },
  details: { zh: "详情", en: "Details" },
});

const PageThemeProviderEx3 = defineHtml(`
  <elf-playground :title=${t("title")}>
    <span slot="status" class="demo-state">${t("status")}</span>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;width:100%">
      <elf-theme-provider
        v-for="skin in APP_SKINS"
        :key="skin.id"
        :theme="skin.providerTheme"
        :tokens.prop="skin.tokens"
      >
        <section style="display:grid;gap:16px;min-height:210px;padding:20px;border:1px solid var(--elf-border);border-radius:18px;background:var(--elf-bg-paper);color:var(--elf-text-primary);box-shadow:0 12px 28px rgba(0,0,0,.08)">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
            <strong>{{ skin.label }}</strong>
            <span style="width:18px;height:18px;border-radius:50%;background:var(--elf-primary)"></span>
          </div>
          <elf-input :label=${t("projectName")} model-value="ElfUI" variant="solo-filled"></elf-input>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <elf-button size="sm">${t("confirm")}</elf-button>
            <elf-button size="sm" variant="outlined">${t("details")}</elf-button>
            <elf-tag>Token</elf-tag>
          </div>
        </section>
      </elf-theme-provider>
    </div>
  </elf-playground>
`);

export { PageThemeProviderEx3 };
