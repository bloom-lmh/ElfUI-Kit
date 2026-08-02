import { defineHtml, useComponents } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import { PageLocaleProviderPreview } from "./preview";

useComponents({ "page-locale-provider-preview": PageLocaleProviderPreview });

const pick = createDocsPicker();
const t = createDocsTranslator({
  section: { zh: "嵌套作用域与格式化", en: "Nested scopes and formatting" },
});

const enMessages = { provider: { title: "Outer English workspace" } };
const nestedLocaleName = pick("zh-CN", "de-DE");
const nestedTimeZone = pick("Asia/Shanghai", "Europe/Berlin");
const nestedMessages = {
  common: {
    confirm: pick("确认", "Bestätigen"),
    cancel: pick("取消", "Abbrechen"),
  },
  provider: {
    title: pick("局部中文审批区", "Lokaler deutscher Freigabebereich"),
  },
};

const code = `<elf-locale-provider name="en-US" time-zone="UTC" :messages.prop="enMessages">
  <page-locale-provider-preview />
  <elf-locale-provider name="${nestedLocaleName}" :messages.prop="nestedMessages">
    <page-locale-provider-preview />
  </elf-locale-provider>
</elf-locale-provider>`;

const script = `const enMessages = { provider: { title: "Outer English workspace" } };
const nestedMessages = {
  common: { confirm: "${nestedMessages.common.confirm}", cancel: "${nestedMessages.common.cancel}" },
  provider: { title: "${nestedMessages.provider.title}" }
};`;

const PageLocaleProviderEx3 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("section")} :code=${code} :script=${script}>
    <elf-locale-provider name="en-US" time-zone="UTC" :messages.prop=${enMessages}>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;width:100%;max-width:760px">
        <page-locale-provider-preview></page-locale-provider-preview>
        <elf-locale-provider :name=${nestedLocaleName} :time-zone=${nestedTimeZone} :messages.prop=${nestedMessages}>
          <page-locale-provider-preview></page-locale-provider-preview>
        </elf-locale-provider>
      </div>
    </elf-locale-provider>
  </elf-playground>
`);

export { PageLocaleProviderEx3 };
