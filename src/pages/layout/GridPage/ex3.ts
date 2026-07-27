import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const desktopColumns = { span: 4, offset: 2 };

const t = createDocsTranslator({
  alignment: { zh: "双轴对齐", en: "Two-axis alignment" },
  offset: { zh: "偏移与位移", en: "Offset and movement" },
  responsive: { zh: "响应式列宽", en: "Responsive columns" }
});

const alignmentCode = `<elf-grid columns="12" justify="center" align="center" gap="md">
  <elf-grid-item span="3">1</elf-grid-item>
  <elf-grid-item span="3">2</elf-grid-item>
  <elf-grid-item span="3">3</elf-grid-item>
</elf-grid>`;

const offsetCode = `<elf-grid columns="12">
  <elf-grid-item span="3" offset="1">1</elf-grid-item>
  <elf-grid-item span="4" push="4">2</elf-grid-item>
  <elf-grid-item span="4" pull="4">3</elf-grid-item>
</elf-grid>`;

const responsiveCode = `<elf-grid columns="12" gap="md">
  <elf-grid-item span="12" :sm=\${12} :md=\${desktopColumns}>1</elf-grid-item>
</elf-grid>`;

const responsiveScript = `const desktopColumns = { span: 4, offset: 2 };`;

defineStyle(diagramStyles);

const PageGridEx3 = defineHtml(`
  <elf-playground :title=${t("alignment")} :code=${alignmentCode}>
    <div class="diagram-stage tall">
      <elf-grid columns="12" justify="center" align="center" gap="md" style="min-height:148px">
        <elf-grid-item span="3"><div class="diagram-item">1</div></elf-grid-item>
        <elf-grid-item span="3"><div class="diagram-item" style="min-height:82px">2</div></elf-grid-item>
        <elf-grid-item span="3"><div class="diagram-item">3</div></elf-grid-item>
      </elf-grid>
    </div>
  </elf-playground>

  <elf-playground :title=${t("offset")} :code=${offsetCode}>
    <div class="diagram-stack">
      <div class="diagram-line"><span class="diagram-label">offset="1"</span><div class="diagram-stage"><elf-grid columns="12"><elf-grid-item span="3" offset="1"><div class="diagram-item">1</div></elf-grid-item></elf-grid></div></div>
      <div class="diagram-line"><span class="diagram-label">push="4" / pull="4"</span><div class="diagram-stage"><elf-grid columns="12"><elf-grid-item span="4" push="4"><div class="diagram-item">2<small>原位置 1–4，向后移动 4 列</small></div></elf-grid-item><elf-grid-item span="4" pull="4"><div class="diagram-item">3<small>原位置 5–8，向前移动 4 列</small></div></elf-grid-item></elf-grid></div></div>
    </div>
  </elf-playground>

  <elf-playground :title=${t("responsive")} :code=${responsiveCode} :script=${responsiveScript}>
    <div class="diagram-stage">
      <elf-grid columns="12" gap="md">
        <elf-grid-item span="12" :sm=${12} :md=${desktopColumns}><div class="diagram-item">1<small>xs 12 · md 4 + offset 2</small></div></elf-grid-item>
      </elf-grid>
    </div>
  </elf-playground>
`);

export { PageGridEx3 };
