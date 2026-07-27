import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const t = createDocsTranslator({
  gap: { zh: "栅格间距", en: "Grid gaps" },
  columns: { zh: "自定义列数", en: "Custom column count" },
  autoFit: { zh: "自动适配列", en: "Auto-fit columns" }
});

const gapCode = `<elf-grid columns="12" gap="xs">...</elf-grid>
<elf-grid columns="12" gap="md">...</elf-grid>
<elf-grid columns="12" gap="xl">...</elf-grid>`;

const columnsCode = `<elf-grid columns="24" gap="sm">
  <elf-grid-item span="6">1</elf-grid-item>
  <elf-grid-item span="12">2</elf-grid-item>
  <elf-grid-item span="6">3</elf-grid-item>
</elf-grid>`;

const autoFitCode = `<elf-grid auto-fit min-column-width="180px" gap="md">
  <div>1</div><div>2</div><div>3</div>
</elf-grid>`;

defineStyle(diagramStyles);

const PageGridEx2 = defineHtml(`
  <elf-playground :title=${t("gap")} :code=${gapCode}>
    <div class="diagram-stack">
      <div class="diagram-line"><span class="diagram-label">gap="xs"</span><div class="diagram-stage"><elf-grid columns="12" gap="xs"><elf-grid-item span="4"><div class="diagram-item">1</div></elf-grid-item><elf-grid-item span="4"><div class="diagram-item">2</div></elf-grid-item><elf-grid-item span="4"><div class="diagram-item">3</div></elf-grid-item></elf-grid></div></div>
      <div class="diagram-line"><span class="diagram-label">gap="md"</span><div class="diagram-stage"><elf-grid columns="12" gap="md"><elf-grid-item span="4"><div class="diagram-item">1</div></elf-grid-item><elf-grid-item span="4"><div class="diagram-item">2</div></elf-grid-item><elf-grid-item span="4"><div class="diagram-item">3</div></elf-grid-item></elf-grid></div></div>
      <div class="diagram-line"><span class="diagram-label">gap="xl"</span><div class="diagram-stage"><elf-grid columns="12" gap="xl"><elf-grid-item span="4"><div class="diagram-item">1</div></elf-grid-item><elf-grid-item span="4"><div class="diagram-item">2</div></elf-grid-item><elf-grid-item span="4"><div class="diagram-item">3</div></elf-grid-item></elf-grid></div></div>
    </div>
  </elf-playground>

  <elf-playground :title=${t("columns")} :code=${columnsCode}>
    <div class="diagram-stage">
      <elf-grid columns="24" gap="sm">
        <elf-grid-item span="6"><div class="diagram-item">1<small>6 / 24</small></div></elf-grid-item>
        <elf-grid-item span="12"><div class="diagram-item">2<small>12 / 24</small></div></elf-grid-item>
        <elf-grid-item span="6"><div class="diagram-item">3<small>6 / 24</small></div></elf-grid-item>
      </elf-grid>
    </div>
  </elf-playground>

  <elf-playground :title=${t("autoFit")} :code=${autoFitCode}>
    <div class="diagram-stage">
      <elf-grid auto-fit min-column-width="180px" gap="md">
        <div class="diagram-item">1</div><div class="diagram-item">2</div><div class="diagram-item">3</div>
      </elf-grid>
    </div>
  </elf-playground>
`);

export { PageGridEx2 };
