import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "命名主题 · 设计 token", en: "Named theme · design tokens" },
  theme: { zh: "命名主题", en: "Named theme" },
  description: {
    zh: "颜色、圆角和阴影来自同一份 token 映射。",
    en: "Colors, radius, and elevation come from one token map.",
  },
});

const themes = {
  ocean: {
    dark: false,
    tokens: {
      primary: "#1769aa",
      primaryHover: "#0d47a1",
      bgDefault: "#eff8ff",
      bgPaper: "#ffffff",
      radiusMd: "12px",
      shadow1: "0 2px 8px rgba(23, 105, 170, 0.14)",
    },
  },
};

const config = {
  theme: { theme: "ocean", themes },
};

const code = `<elf-config-provider :config.prop="config">
  <elf-card>
    <strong>${t("theme")}</strong>
    <p>${t("description")}</p>
  </elf-card>
</elf-config-provider>`;

const script = `const config = {
  theme: {
    theme: "ocean",
    themes: {
      ocean: {
        tokens: {
          primary: "#1769aa",
          radiusMd: "12px",
          shadow1: "0 2px 8px rgba(23, 105, 170, 0.14)"
        }
      }
    }
  }
};`;

const PageConfigProviderEx2 = defineHtml(`
  <elf-playground
    :title=${t("title")}
    :code=${code}
    :script=${script}
  >
    <elf-config-provider :config.prop=${config}>
      <elf-card class="theme-card">
        <strong>${t("theme")}</strong>
        <p>${t("description")}</p>
      </elf-card>
    </elf-config-provider>
  </elf-playground>
`);

export { PageConfigProviderEx2 };
