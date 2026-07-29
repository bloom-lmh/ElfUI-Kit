import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "基础数值", en: "Basic values" },
  users: { zh: "活跃用户", en: "Active users" },
  usersSuffix: { zh: "人", en: " users" },
  conversion: { zh: "转化率", en: "Conversion rate" }
});

const code1 = `<elf-statistic title="${t("users")}" :value="128430" suffix="${t("usersSuffix")}" />
<elf-statistic title="${t("conversion")}" :value="0.8732" :precision="2" suffix="%" />`;

const PageStatisticEx1 = defineHtml(`
<elf-playground :title=${t("title")} :code=${code1}>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(160px,1fr));gap:24px">
        <elf-statistic title=${t("users")} :value=${128430} suffix=${t("usersSuffix")}></elf-statistic>
        <elf-statistic title=${t("conversion")} :value=${0.8732} :precision=${2} suffix="%"></elf-statistic>
      </div>
    </elf-playground>
`);

export { PageStatisticEx1 };
