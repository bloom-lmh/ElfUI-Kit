import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const t = createDocsTranslator({
  single: { zh: "基础 12 列", en: "Twelve equal columns" },
  grouped: { zh: "三等分", en: "Three equal columns" },
});

const singleCode = `<elf-grid columns="12">
  <elf-grid-item span="1">1</elf-grid-item>
  <!-- ... -->
  <elf-grid-item span="1">12</elf-grid-item>
</elf-grid>`;

const groupedCode = `<elf-grid columns="12">
  <elf-grid-item span="4">1</elf-grid-item>
  <elf-grid-item span="4">2</elf-grid-item>
  <elf-grid-item span="4">3</elf-grid-item>
</elf-grid>`;

const twelveColumns = Array.from({ length: 12 }, (_, index) => index + 1);

defineStyle(diagramStyles);

const PageGridEx1 = defineHtml(`
  <elf-playground :title=${t("single")} :code=${singleCode}>
    <elf-grid class="blue-grid diagram-grid" columns="12">
      <elf-grid-item v-for="item in twelveColumns" :key="item" span="1">
        <div class="diagram-item">{{ item }}<small>span 1</small></div>
      </elf-grid-item>
    </elf-grid>
  </elf-playground>

  <elf-playground :title=${t("grouped")} :code=${groupedCode}>
    <elf-grid class="blue-grid diagram-grid" columns="12">
      <elf-grid-item span="4"><div class="diagram-item">1<small>span 4</small></div></elf-grid-item>
      <elf-grid-item span="4"><div class="diagram-item">2<small>span 4</small></div></elf-grid-item>
      <elf-grid-item span="4"><div class="diagram-item">3<small>span 4</small></div></elf-grid-item>
    </elf-grid>
  </elf-playground>
`);

export { PageGridEx1 };
