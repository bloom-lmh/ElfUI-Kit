import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const t = createDocsTranslator({
  justify: { zh: "主轴对齐", en: "Main-axis alignment" },
  align: { zh: "交叉轴对齐", en: "Cross-axis alignment" }
});

const justifyCode = `<elf-flex justify="flex-start">1 2 3</elf-flex>
<elf-flex justify="center">1 2 3</elf-flex>
<elf-flex justify="space-between">1 2 3</elf-flex>
<elf-flex justify="space-around">1 2 3</elf-flex>
<elf-flex justify="space-evenly">1 2 3</elf-flex>`;

const alignCode = `<elf-flex align="flex-start">1 2 3</elf-flex>
<elf-flex align="center">1 2 3</elf-flex>
<elf-flex align="flex-end">1 2 3</elf-flex>
<elf-flex align="stretch">1 2 3</elf-flex>`;

const numberedItems = [1, 2, 3] as const;
const itemClass = (item: number): string => item === 2 ? "diagram-item alt" : item === 3 ? "diagram-item neutral" : "diagram-item";

defineStyle(diagramStyles);

const PageFlexEx2 = defineHtml(`
  <elf-playground :title=${t("justify")} :code=${justifyCode}>
    <div class="diagram-stack">
      <div class="diagram-line"><span class="diagram-label">flex-start</span><div class="diagram-stage"><elf-flex class="flex-demo" justify="flex-start" gap="sm"><div v-for="item in numberedItems" :key="item" :class="itemClass(item)">{{ item }}</div></elf-flex></div></div>
      <div class="diagram-line"><span class="diagram-label">center</span><div class="diagram-stage"><elf-flex class="flex-demo" justify="center" gap="sm"><div v-for="item in numberedItems" :key="item" :class="itemClass(item)">{{ item }}</div></elf-flex></div></div>
      <div class="diagram-line"><span class="diagram-label">space-between</span><div class="diagram-stage"><elf-flex class="flex-demo" justify="space-between"><div v-for="item in numberedItems" :key="item" :class="itemClass(item)">{{ item }}</div></elf-flex></div></div>
      <div class="diagram-line"><span class="diagram-label">space-around</span><div class="diagram-stage"><elf-flex class="flex-demo" justify="space-around"><div v-for="item in numberedItems" :key="item" :class="itemClass(item)">{{ item }}</div></elf-flex></div></div>
      <div class="diagram-line"><span class="diagram-label">space-evenly</span><div class="diagram-stage"><elf-flex class="flex-demo" justify="space-evenly"><div v-for="item in numberedItems" :key="item" :class="itemClass(item)">{{ item }}</div></elf-flex></div></div>
    </div>
  </elf-playground>

  <elf-playground :title=${t("align")} :code=${alignCode}>
    <div class="diagram-stack">
      <div class="diagram-line"><span class="diagram-label">flex-start</span><div class="diagram-stage tall"><elf-flex class="flex-demo align-demo" align="flex-start" gap="md"><div v-for="item in numberedItems" :key="item" :class="itemClass(item)">{{ item }}</div></elf-flex></div></div>
      <div class="diagram-line"><span class="diagram-label">center</span><div class="diagram-stage tall"><elf-flex class="flex-demo align-demo" align="center" gap="md" style="min-height:148px"><div v-for="item in numberedItems" :key="item" :class="itemClass(item)">{{ item }}</div></elf-flex></div></div>
      <div class="diagram-line"><span class="diagram-label">flex-end</span><div class="diagram-stage tall"><elf-flex class="flex-demo align-demo" align="flex-end" gap="md" style="min-height:148px"><div v-for="item in numberedItems" :key="item" :class="itemClass(item)">{{ item }}</div></elf-flex></div></div>
      <div class="diagram-line"><span class="diagram-label">stretch</span><div class="diagram-stage tall"><elf-flex class="flex-demo" align="stretch" gap="md" style="min-height:148px"><div v-for="item in numberedItems" :key="item" :class="itemClass(item)">{{ item }}</div></elf-flex></div></div>
    </div>
  </elf-playground>
`);

export { PageFlexEx2 };
