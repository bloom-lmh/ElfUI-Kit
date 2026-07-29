import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "自定义主色", en: "Custom primary color" },
  dynamic: { zh: "动态主色", en: "Dynamic primary color" },
  outlined: { zh: "描边", en: "Outlined" },
});

const customPrimary = useRef("#6750a4");

const customCode = `<elf-color-picker
  :modelValue="customPrimary"
  @update:modelValue="onColor"
/>
<elf-theme-provider theme="custom" :tokens.prop="customTokens()">
  <elf-button>${t("dynamic")}</elf-button>
</elf-theme-provider>`;

const customScript = `const customPrimary = useRef("#6750a4");

const customTokens = () => ({
  primary: customPrimary.value,
  primaryHover: "#4f378b",
  bgPaper: "#fffbff",
  border: "rgba(103, 80, 164, 0.28)"
});

const onColor = (event) => customPrimary.set(String(event.detail));`;

const customTokens = () => ({
  primary: customPrimary.value,
  primaryHover: "#4f378b",
  bgPaper: "#fffbff",
  bgOverlay: "rgba(103, 80, 164, 0.08)",
  textPrimary: "rgba(29, 27, 32, 0.87)",
  border: "rgba(103, 80, 164, 0.28)"
});

const onColor = (event: CustomEvent): void => {
  customPrimary.set(String(event.detail));
};

const PageThemeProviderEx2 = defineHtml(`
<elf-playground :title=${t("title")} :code=${customCode} :script=${customScript}>
      <div style="display:grid;gap:16px;width:100%;max-width:720px">
        <elf-color-picker
          :modelValue="customPrimary"
          @update:modelValue="onColor"
        ></elf-color-picker>
        <elf-theme-provider theme="custom" :tokens.prop="customTokens()">
          <div
            style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;padding:20px;border-radius:8px;background:var(--elf-bg-paper);border:1px solid var(--elf-border)"
          >
            <elf-button>${t("dynamic")}</elf-button>
            <elf-button variant="outlined">${t("outlined")}</elf-button>
            <elf-tag>Token</elf-tag>
          </div>
        </elf-theme-provider>
      </div>
    </elf-playground>
`);

export { PageThemeProviderEx2 };
