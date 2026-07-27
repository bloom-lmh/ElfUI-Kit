import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const t = createDocsTranslator({
  equal: { zh: "等分栅格", en: "Equal columns" },
  unequal: { zh: "非等分栅格", en: "Unequal columns" }
});

const equalCode = `<elf-grid columns="12" gap="md">
  <elf-grid-item span="4">1</elf-grid-item>
  <elf-grid-item span="4">2</elf-grid-item>
  <elf-grid-item span="4">3</elf-grid-item>
</elf-grid>`;

const unequalCode = `<elf-grid columns="12" gap="md">
  <elf-grid-item span="3">1</elf-grid-item>
  <elf-grid-item span="6">2</elf-grid-item>
  <elf-grid-item span="3">3</elf-grid-item>
</elf-grid>`;

defineStyle(diagramStyles);

const PageGridEx1 = defineHtml(`
  <elf-playground :title=${t("equal")} :code=${equalCode}>
    <div class="diagram-stage">
      <elf-grid columns="12" gap="md">
        <elf-grid-item span="4"><div class="diagram-item">1<small>span 4</small></div></elf-grid-item>
        <elf-grid-item span="4"><div class="diagram-item">2<small>span 4</small></div></elf-grid-item>
        <elf-grid-item span="4"><div class="diagram-item">3<small>span 4</small></div></elf-grid-item>
      </elf-grid>
    </div>
  </elf-playground>

  <elf-playground :title=${t("unequal")} :code=${unequalCode}>
    <div class="diagram-stage">
      <elf-grid columns="12" gap="md">
        <elf-grid-item span="3"><div class="diagram-item">1<small>span 3</small></div></elf-grid-item>
        <elf-grid-item span="6"><div class="diagram-item">2<small>span 6</small></div></elf-grid-item>
        <elf-grid-item span="3"><div class="diagram-item">3<small>span 3</small></div></elf-grid-item>
      </elf-grid>
    </div>
  </elf-playground>
`);

export { PageGridEx1 };
