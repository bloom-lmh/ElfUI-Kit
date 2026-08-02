import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "前后缀、精度与分隔符", en: "Prefix, precision, and separators" },
  revenue: { zh: "本月收入", en: "Monthly revenue" },
});

const code2 = `<elf-statistic title="${t("revenue")}" :value="932845.6" prefix="¥" suffix="CNY" :precision="2" />
<elf-statistic :value="1234567.89" group-separator=" " decimal-separator="," :precision="2" />`;

const PageStatisticEx2 = defineHtml(`
<elf-playground :title=${t("title")} :code=${code2}>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(160px,1fr));gap:24px">
        <elf-statistic :title=${t("revenue")} :value=${932845.6} prefix="¥" suffix="CNY" :precision=${2}></elf-statistic>
        <elf-statistic :value=${1234567.89} group-separator=" " decimal-separator="," :precision=${2}></elf-statistic>
      </div>
    </elf-playground>
`);

export { PageStatisticEx2 };
