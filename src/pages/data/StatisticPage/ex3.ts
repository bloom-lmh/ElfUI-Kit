import { defineHtml } from "@elfui/core";

const formatter = (value: number): string => `${Math.round(value / 1000)}k`;

const formatCode = `<elf-statistic :value="128430" :formatter.prop="formatter" :value-style.prop="{ color: 'var(--elf-primary)' }" />`;

const formatScript = "const formatter = (value: number): string => `${Math.round(value / 1000)}k`;";

const PageStatisticEx3 = defineHtml(`
<elf-playground title="formatter / value-style" :code=${formatCode} :script=${formatScript}>
      <elf-statistic :value=${128430} :formatter=${formatter} :value-style=${{ color: "var(--elf-primary)" }}></elf-statistic>
    </elf-playground>
`);

export { PageStatisticEx3 };
