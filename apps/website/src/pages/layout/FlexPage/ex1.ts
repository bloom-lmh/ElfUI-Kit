import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const t = createDocsTranslator({
  direction: { zh: "排列方向", en: "Flex direction" },
  gap: { zh: "元素间距", en: "Item gaps" },
  controls: { zh: "弹性布局配置", en: "Flex controls" },
  directionValue: { zh: "方向", en: "Direction" },
  gapValue: { zh: "间距", en: "Gap" },
});

const direction = useRef("row");
const itemGap = useRef("md");

const numberedItems = [1, 2, 3] as const;
const itemClass = (item: number): string =>
  item === 2 ? "diagram-item alt" : item === 3 ? "diagram-item neutral" : "diagram-item";
const directionOptions = () =>
  ["row", "row-reverse", "column", "column-reverse"].map((value) => ({ label: value, value }));
const gapOptions = () =>
  ["0", "xs", "sm", "md", "lg", "xl"].map((value) => ({ label: value, value }));
const eventValue = (event: CustomEvent): string => String(event.detail ?? "");
const onDirection = (event: CustomEvent): void => direction.set(eventValue(event));
const onGap = (event: CustomEvent): void => itemGap.set(eventValue(event));
const directionCode = (): string =>
  `<elf-flex direction="${direction.value}" gap="md">1 2 3</elf-flex>`;
const gapCode = (): string => `<elf-flex direction="row" gap="${itemGap.value}">1 2 3</elf-flex>`;
const controlScript = `const direction = useRef("row");
const itemGap = useRef("md");`;

defineStyle(diagramStyles);

const PageFlexEx1 = defineHtml(`
  <elf-playground :title=${t("direction")} :code=${directionCode()} :script=${controlScript}>
    <div class="layout-playground-preview tall">
      <elf-flex class="flex-demo flex-direction-preview" :direction.prop=${direction.value} gap="md">
        <div v-for="item in numberedItems" :key="item" :class="itemClass(item)">{{ item }}</div>
      </elf-flex>
    </div>
    <aside slot="controls" class="layout-playground-controls" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <label>
        <span>${t("directionValue")}</span>
        <elf-select variant="outlined" :options.prop=${directionOptions()} :modelValue.prop=${direction.value} @update:modelValue=${onDirection}></elf-select>
      </label>
    </aside>
  </elf-playground>

  <elf-playground :title=${t("gap")} :code=${gapCode()} :script=${controlScript}>
    <div class="layout-playground-preview">
      <elf-flex class="flex-demo" direction="row" :gap.prop=${itemGap.value}>
        <div v-for="item in numberedItems" :key="item" :class="itemClass(item)">{{ item }}</div>
      </elf-flex>
    </div>
    <aside slot="controls" class="layout-playground-controls" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <label>
        <span>${t("gapValue")}</span>
        <elf-select variant="outlined" :options.prop=${gapOptions()} :modelValue.prop=${itemGap.value} @update:modelValue=${onGap}></elf-select>
      </label>
    </aside>
  </elf-playground>
`);

export { PageFlexEx1 };
