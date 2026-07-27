import { defineHtml } from "@elfui/core";

const code2 = `<elf-statistic title="本月收入" :value="932845.6" prefix="¥" suffix="CNY" :precision="2" />
<elf-statistic :value="1234567.89" group-separator=" " decimal-separator="," :precision="2" />`;

const PageStatisticEx2 = defineHtml(`
<elf-playground title="prefix / precision / separator" :code=${code2}>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(160px,1fr));gap:24px">
        <elf-statistic title="本月收入" :value=${932845.6} prefix="¥" suffix="CNY" :precision=${2}></elf-statistic>
        <elf-statistic :value=${1234567.89} group-separator=" " decimal-separator="," :precision=${2}></elf-statistic>
      </div>
    </elf-playground>
`);

export { PageStatisticEx2 };
