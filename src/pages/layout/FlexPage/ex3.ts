import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const t = createDocsTranslator({
  wrap: { zh: "换行策略", en: "Wrapping strategies" },
  alignContent: { zh: "多行内容对齐", en: "Wrapped-line alignment" },
  compatibility: { zh: "Space 兼容输入", en: "Space-compatible inputs" }
});

const wrapCode = `<elf-flex wrap="wrap" gap="md">1 2 3</elf-flex>
<elf-flex wrap="wrap-reverse" gap="md">1 2 3</elf-flex>`;

const alignContentCode = `<elf-flex wrap align-content="space-between" gap="sm">1 2 3</elf-flex>
<elf-flex wrap align-content="space-around" gap="sm">1 2 3</elf-flex>
<elf-flex wrap align-content="space-evenly" gap="sm">1 2 3</elf-flex>`;

const compatibilityCode = `<elf-flex alignment="center" size="default">1 2 3</elf-flex>
<elf-flex fill fill-ratio="30" size="default">1 2 3</elf-flex>`;

const alignedItems = [
  { id: 1, line: "line 1" },
  { id: 2, line: "line 1" },
  { id: 3, line: "line 2" }
] as const;

const alignContentModes = [
  "space-between",
  "space-around",
  "space-evenly"
] as const;

const alignedItemClass = (item: number): string =>
  item === 2 ? "diagram-item alt" : item === 3 ? "diagram-item neutral" : "diagram-item";

defineStyle(diagramStyles);

const PageFlexEx3 = defineHtml(`
  <elf-playground :title=${t("wrap")} :code=${wrapCode}>
    <div class="diagram-stack">
      <div class="diagram-line"><span class="diagram-label">wrap</span><div class="diagram-stage"><elf-flex class="flex-demo" wrap="wrap" gap="md" style="max-width:260px"><div class="diagram-item" style="flex-basis:112px">1</div><div class="diagram-item alt" style="flex-basis:112px">2</div><div class="diagram-item neutral" style="flex-basis:112px">3</div></elf-flex></div></div>
      <div class="diagram-line"><span class="diagram-label">wrap-reverse</span><div class="diagram-stage"><elf-flex class="flex-demo" wrap="wrap-reverse" gap="md" style="max-width:260px"><div class="diagram-item" style="flex-basis:112px">1</div><div class="diagram-item alt" style="flex-basis:112px">2</div><div class="diagram-item neutral" style="flex-basis:112px">3</div></elf-flex></div></div>
    </div>
  </elf-playground>

  <elf-playground :title=${t("alignContent")} :code=${alignContentCode}>
    <div class="diagram-stack">
      <div v-for="mode in alignContentModes" :key="mode" class="diagram-line">
        <span class="diagram-label">{{ mode }}</span>
        <div class="diagram-stage tall">
          <elf-flex class="align-content-demo" wrap :align-content="mode" gap="sm">
            <div v-for="item in alignedItems" :key="item.id" :class="alignedItemClass(item.id)">{{ item.id }}<small>{{ item.line }}</small></div>
          </elf-flex>
        </div>
      </div>
    </div>
  </elf-playground>

  <elf-playground :title=${t("compatibility")} :code=${compatibilityCode}>
    <div class="diagram-stack">
      <div class="diagram-stage"><elf-flex alignment="center" size="default"><div class="diagram-item">1</div><div class="diagram-item alt">2</div><div class="diagram-item neutral">3</div></elf-flex></div>
      <div class="diagram-stage"><elf-flex fill fill-ratio="30" size="default"><div class="diagram-item">1</div><div class="diagram-item alt">2</div><div class="diagram-item neutral">3</div></elf-flex></div>
    </div>
  </elf-playground>
`);

export { PageFlexEx3 };
