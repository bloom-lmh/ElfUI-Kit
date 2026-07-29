import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "自定义格式化与数值样式", en: "Custom formatter and value style" },
  description: {
    zh: "使用 formatter 转换展示值，并通过 value-style 设置数值区样式。",
    en: "Transform the displayed value with formatter and style the value area with value-style."
  }
});

const formatter = (value: number): string => `${Math.round(value / 1000)}k`;

const formatCode = `<elf-statistic :value="128430" :formatter.prop="formatter" :value-style.prop="{ color: 'var(--elf-primary)' }" />`;

const formatScript = "const formatter = (value: number): string => `${Math.round(value / 1000)}k`;";

const PageStatisticEx3 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("description")} :code=${formatCode} :script=${formatScript}>
      <elf-statistic :value=${128430} :formatter=${formatter} :value-style=${{ color: "var(--elf-primary)" }}></elf-statistic>
    </elf-playground>
`);

export { PageStatisticEx3 };
