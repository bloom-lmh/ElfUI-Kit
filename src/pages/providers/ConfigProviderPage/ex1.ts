import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "统一入口 · 蓝图与默认值", en: "One entry point · blueprint and defaults" },
  blueprint: { zh: "使用蓝图默认值", en: "Uses the blueprint" },
  explicit: { zh: "显式属性仍然优先", en: "Explicit props still win" },
});

const blueprint = {
  defaults: {
    global: { size: "sm" },
    "elf-button": { variant: "outlined" },
  },
};

const config = {
  theme: { theme: "light" },
  locale: { name: "en-US" },
};

const code = `<elf-config-provider :blueprint.prop="blueprint" :config.prop="config">
  <elf-button>${t("blueprint")}</elf-button>
  <elf-button variant="contained">${t("explicit")}</elf-button>
</elf-config-provider>`;

const script = `const blueprint = {
  defaults: {
    global: { size: "sm" },
    "elf-button": { variant: "outlined" }
  }
};
const config = {
  theme: { theme: "light" },
  locale: { name: "en-US" }
};`;

const PageConfigProviderEx1 = defineHtml(`
  <elf-playground
    :title=${t("title")}
    :code=${code}
    :script=${script}
  >
    <elf-config-provider :blueprint.prop=${blueprint} :config.prop=${config}>
      <div class="config-demo-actions">
        <elf-button>${t("blueprint")}</elf-button>
        <elf-button variant="contained">${t("explicit")}</elf-button>
      </div>
    </elf-config-provider>
  </elf-playground>
`);

export { PageConfigProviderEx1 };
