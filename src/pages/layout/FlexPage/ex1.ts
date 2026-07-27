import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const t = createDocsTranslator({
  direction: { zh: "排列方向", en: "Flex direction" },
  gap: { zh: "元素间距", en: "Item gaps" }
});

const directionCode = `<elf-flex direction="row" gap="sm">1 2 3</elf-flex>
<elf-flex direction="row-reverse" gap="sm">1 2 3</elf-flex>
<elf-flex direction="column" gap="sm">1 2 3</elf-flex>
<elf-flex direction="column-reverse" gap="sm">1 2 3</elf-flex>`;

const gapCode = `<elf-flex gap="xs">1 2 3</elf-flex>
<elf-flex gap="md">1 2 3</elf-flex>
<elf-flex gap="xl">1 2 3</elf-flex>`;

const numberedItems = [1, 2, 3] as const;
const itemClass = (item: number): string => item === 2 ? "diagram-item alt" : item === 3 ? "diagram-item neutral" : "diagram-item";

defineStyle(diagramStyles);

const PageFlexEx1 = defineHtml(`
  <elf-playground :title=${t("direction")} :code=${directionCode}>
    <div class="diagram-stack">
      <div class="diagram-line"><span class="diagram-label">row</span><div class="diagram-stage"><elf-flex class="flex-demo" direction="row" gap="sm"><div v-for="item in numberedItems" :key="item" :class="itemClass(item)">{{ item }}</div></elf-flex></div></div>
      <div class="diagram-line"><span class="diagram-label">row-reverse</span><div class="diagram-stage"><elf-flex class="flex-demo" direction="row-reverse" gap="sm"><div v-for="item in numberedItems" :key="item" :class="itemClass(item)">{{ item }}</div></elf-flex></div></div>
      <div class="diagram-line"><span class="diagram-label">column</span><div class="diagram-stage"><elf-flex class="flex-demo vertical" direction="column" gap="sm"><div v-for="item in numberedItems" :key="item" :class="itemClass(item)">{{ item }}</div></elf-flex></div></div>
      <div class="diagram-line"><span class="diagram-label">column-reverse</span><div class="diagram-stage"><elf-flex class="flex-demo vertical" direction="column-reverse" gap="sm"><div v-for="item in numberedItems" :key="item" :class="itemClass(item)">{{ item }}</div></elf-flex></div></div>
    </div>
  </elf-playground>

  <elf-playground :title=${t("gap")} :code=${gapCode}>
    <div class="diagram-stack">
      <div class="diagram-line"><span class="diagram-label">gap="xs"</span><div class="diagram-stage"><elf-flex class="flex-demo" gap="xs"><div v-for="item in numberedItems" :key="item" :class="itemClass(item)">{{ item }}</div></elf-flex></div></div>
      <div class="diagram-line"><span class="diagram-label">gap="md"</span><div class="diagram-stage"><elf-flex class="flex-demo" gap="md"><div v-for="item in numberedItems" :key="item" :class="itemClass(item)">{{ item }}</div></elf-flex></div></div>
      <div class="diagram-line"><span class="diagram-label">gap="xl"</span><div class="diagram-stage"><elf-flex class="flex-demo" gap="xl"><div v-for="item in numberedItems" :key="item" :class="itemClass(item)">{{ item }}</div></elf-flex></div></div>
    </div>
  </elf-playground>
`);

export { PageFlexEx1 };
