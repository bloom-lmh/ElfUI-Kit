import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const t = createDocsTranslator({
  container: { zh: "页面容器", en: "Page container" },
  composition: { zh: "组合式响应布局", en: "Composed responsive layout" }
});

const containerCode = `<elf-container max-width="sm">sm · 600px</elf-container>
<elf-container max-width="md">md · 900px</elf-container>
<elf-container max-width="lg">lg · 1200px</elf-container>`;

const compositionCode = `<elf-container max-width="lg">
  <elf-grid columns="12" gap="md">
    <elf-grid-item span="8">1</elf-grid-item>
    <elf-grid-item span="4">2</elf-grid-item>
    <elf-grid-item span="3">3</elf-grid-item>
    <elf-grid-item span="9">4</elf-grid-item>
  </elf-grid>
</elf-container>`;

defineStyle(diagramStyles);

const PageGridEx4 = defineHtml(`
  <elf-playground :title=${t("container")} :code=${containerCode}>
    <div class="diagram-stage">
      <div class="container-demo">
        <div class="container-bar" style="width:48%">sm · 600px</div>
        <div class="container-bar" style="width:72%">md · 900px</div>
        <div class="container-bar" style="width:100%">lg · 1200px</div>
      </div>
    </div>
  </elf-playground>

  <elf-playground :title=${t("composition")} :code=${compositionCode}>
    <elf-container max-width="lg" padding="0" style="width:100%">
      <div class="diagram-stage">
        <elf-grid columns="12" gap="md">
          <elf-grid-item span="8"><div class="diagram-item">1<small>span 8</small></div></elf-grid-item>
          <elf-grid-item span="4"><div class="diagram-item">2<small>span 4</small></div></elf-grid-item>
          <elf-grid-item span="3"><div class="diagram-item">3<small>span 3</small></div></elf-grid-item>
          <elf-grid-item span="9"><div class="diagram-item">4<small>span 9</small></div></elf-grid-item>
        </elf-grid>
      </div>
    </elf-container>
  </elf-playground>
`);

export { PageGridEx4 };
