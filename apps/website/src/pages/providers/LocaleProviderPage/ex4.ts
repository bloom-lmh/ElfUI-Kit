import { defineHtml, useComponents } from "@elfui/core";

import { defineLocaleAdapter, type LocaleAdapterDateValue } from "@elfui/kit";
import { createDocsTranslator } from "../../docsLocale";
import { PageLocaleProviderPreview } from "./preview";

useComponents({ "page-locale-provider-preview": PageLocaleProviderPreview });

const t = createDocsTranslator({
  title: { zh: "外部 i18n", en: "External i18n" },
  status: {
    zh: "ConfigProvider · 法语目录 · Intl 格式化",
    en: "ConfigProvider · French catalog · Intl formatting",
  },
});

const catalog: Record<string, string> = {
  "provider.title": "Adaptateur i18n externe",
  "common.confirm": "Valider",
  "common.cancel": "Annuler",
};
const toDate = (value: LocaleAdapterDateValue): Date =>
  value instanceof Date ? value : new Date(typeof value === "string" ? Date.parse(value) : value);
const adapter = defineLocaleAdapter({
  translate: (path) => catalog[path],
  formatNumber: (value, options, context) =>
    new Intl.NumberFormat(context.name, options).format(value),
  formatDate(value, options, context) {
    return new Intl.DateTimeFormat(context.name, {
      ...options,
      ...(context.timeZone ? { timeZone: context.timeZone } : {}),
    }).format(toDate(value));
  },
});
const config = {
  locale: {
    name: "fr-FR",
    timeZone: "Europe/Paris",
    adapter,
  },
};

const code = `<elf-config-provider :config.prop="config">
  <localized-workspace />
</elf-config-provider>`;
const script = `import { defineLocaleAdapter } from "@elfui/kit";

const catalog = {
  "provider.title": "Adaptateur i18n externe",
  "common.confirm": "Valider",
  "common.cancel": "Annuler"
};
const adapter = defineLocaleAdapter({
  translate: (path) => catalog[path],
  formatNumber: (value, options, context) =>
    new Intl.NumberFormat(context.name, options).format(value)
});
const config = { locale: { name: "fr-FR", adapter } };`;

const PageLocaleProviderEx4 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <elf-config-provider :config.prop=${config}>
      <div style="width:min(100%,420px);margin-inline:auto">
        <page-locale-provider-preview></page-locale-provider-preview>
      </div>
    </elf-config-provider>
    <span slot="status" class="demo-state">${t("status")}</span>
  </elf-playground>
`);

export { PageLocaleProviderEx4 };
