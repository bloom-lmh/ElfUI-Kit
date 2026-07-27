import { defineHtml } from "@elfui/core";

const code1 = `<elf-statistic title="活跃用户" :value="128430" suffix="人" />
<elf-statistic title="转化率" :value="0.8732" :precision="2" suffix="%" />`;

const PageStatisticEx1 = defineHtml(`
<elf-playground title="基础数值" :code=${code1}>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(160px,1fr));gap:24px">
        <elf-statistic title="活跃用户" :value=${128430} suffix="人"></elf-statistic>
        <elf-statistic title="转化率" :value=${0.8732} :precision=${2} suffix="%"></elf-statistic>
      </div>
    </elf-playground>
`);

export { PageStatisticEx1 };
