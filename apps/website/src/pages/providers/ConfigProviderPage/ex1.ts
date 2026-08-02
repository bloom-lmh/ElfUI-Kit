import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: {
    zh: "配置优先级：基础预设 → 应用配置 → 显式属性",
    en: "Configuration priority: preset → app config → explicit props",
  },
  explanation: {
    zh: "blueprint 是可复用的基础预设；config 在应用入口覆盖预设；组件上显式传入的属性优先级最高。",
    en: "blueprint is a reusable base preset; config overrides it at the application entry; explicit component props have the highest priority.",
  },
  merged: { zh: "预设与应用配置的合并结果", en: "Merged preset and app config" },
  explicit: { zh: "显式属性覆盖合并结果", en: "Explicit props override the merge" },
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
  defaults: {
    "elf-button": { color: "success" },
  },
};

const code = `<elf-config-provider :blueprint.prop="blueprint" :config.prop="config">
  <elf-button>${t("merged")}</elf-button>
  <elf-button variant="contained" color="primary">${t("explicit")}</elf-button>
</elf-config-provider>`;

const script = `const blueprint = {
  defaults: {
    global: { size: "sm" },
    "elf-button": { variant: "outlined" }
  }
};
const config = {
  theme: { theme: "light" },
  locale: { name: "en-US" },
  defaults: {
    "elf-button": { color: "success" }
  }
};`;

const PageConfigProviderEx1 = defineHtml(`
  <elf-playground
    :title=${t("title")}
    :code=${code}
    :script=${script}
  >
    <elf-config-provider :blueprint.prop=${blueprint} :config.prop=${config}>
      <div class="config-priority-demo">
        <p class="config-demo-copy">${t("explanation")}</p>
        <div class="config-demo-actions">
          <elf-button>${t("merged")}</elf-button>
          <elf-button variant="contained" color="primary">${t("explicit")}</elf-button>
        </div>
      </div>
    </elf-config-provider>
  </elf-playground>
`);

export { PageConfigProviderEx1 };
