import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const t = createDocsTranslator({
  spacer: { zh: "剩余空间与 Spacer", en: "Remaining space and Spacer" },
  items: { zh: "子项伸缩与顺序", en: "Item growth and order" },
  responsive: { zh: "响应式工具类", en: "Responsive utilities" }
});

const spacerCode = `<elf-flex align="center" gap="sm">
  <div>1</div><elf-spacer></elf-spacer><div>2</div><div>3</div>
</elf-flex>`;

const itemsCode = `<elf-flex gap="sm">
  <div class="flex-grow-1">1</div><div>2</div><div>3</div>
</elf-flex>
<elf-flex gap="sm">
  <div class="order-3">1</div><div class="order-1">2</div><div class="order-2">3</div>
</elf-flex>`;

const responsiveCode = `<div class="d-flex flex-column flex-md-row ga-3">
  <div>1</div><div>2</div><div>3</div>
</div>`;

defineStyle(diagramStyles);

const PageFlexEx4 = defineHtml(`
  <elf-playground :title=${t("spacer")} :code=${spacerCode}>
    <div class="diagram-stage">
      <elf-flex class="flex-demo" align="center" gap="sm">
        <div class="diagram-item">1</div><elf-spacer></elf-spacer><div class="diagram-item alt">2</div><div class="diagram-item neutral">3</div>
      </elf-flex>
    </div>
  </elf-playground>

  <elf-playground :title=${t("items")} :code=${itemsCode}>
    <div class="diagram-stack">
      <div class="diagram-line"><span class="diagram-label">flex-grow: 1</span><div class="diagram-stage"><elf-flex class="flex-demo" gap="sm"><div class="diagram-item" style="flex:1 1 auto">1</div><div class="diagram-item alt">2</div><div class="diagram-item neutral">3</div></elf-flex></div></div>
      <div class="diagram-line"><span class="diagram-label">order: 3 / 1 / 2</span><div class="diagram-stage"><elf-flex class="flex-demo" gap="sm"><div class="diagram-item" style="order:3">1</div><div class="diagram-item alt" style="order:1">2</div><div class="diagram-item neutral" style="order:2">3</div></elf-flex></div></div>
      <div class="diagram-line"><span class="diagram-label">align-self: end</span><div class="diagram-stage tall"><elf-flex class="flex-demo" align="flex-start" gap="sm" style="height:148px"><div class="diagram-item">1</div><div class="diagram-item alt" style="align-self:center">2</div><div class="diagram-item neutral" style="align-self:flex-end">3</div></elf-flex></div></div>
    </div>
  </elf-playground>

  <elf-playground :title=${t("responsive")} :code=${responsiveCode}>
    <div class="diagram-stage">
      <elf-flex class="flex-demo" direction="column" gap="sm">
        <div class="diagram-item">1<small>flex-column</small></div><div class="diagram-item alt">2<small>flex-md-row</small></div><div class="diagram-item neutral">3<small>ga-3</small></div>
      </elf-flex>
    </div>
  </elf-playground>
`);

export { PageFlexEx4 };
