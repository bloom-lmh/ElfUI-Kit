import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const t = createDocsTranslator({
  justify: { zh: "主轴对齐", en: "Main-axis alignment" },
  align: { zh: "交叉轴对齐", en: "Cross-axis alignment" },
  controls: { zh: "对齐配置", en: "Alignment controls" },
  justifyValue: { zh: "主轴对齐", en: "Justify content" },
  alignValue: { zh: "交叉轴对齐", en: "Align items" },
});

const justify = useRef("flex-start");
const align = useRef("flex-start");

const numberedItems = [1, 2, 3] as const;
const itemClass = (item: number): string =>
  item === 2 ? "diagram-item alt" : item === 3 ? "diagram-item neutral" : "diagram-item";
const justifyOptions = () =>
  ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"].map(
    (value) => ({ label: value, value }),
  );
const alignOptions = () =>
  ["stretch", "flex-start", "flex-end", "center", "baseline"].map((value) => ({
    label: value,
    value,
  }));
const eventValue = (event: CustomEvent): string => String(event.detail ?? "");
const onJustify = (event: CustomEvent): void => justify.set(eventValue(event));
const onAlign = (event: CustomEvent): void => align.set(eventValue(event));
const justifyCode = (): string => `<elf-flex justify="${justify.value}" gap="sm">1 2 3</elf-flex>`;
const alignCode = (): string => `<elf-flex align="${align.value}" gap="md">1 2 3</elf-flex>`;
const controlScript = `const justify = useRef("flex-start");
const align = useRef("flex-start");`;

defineStyle(diagramStyles);

const PageFlexEx2 = defineHtml(`
  <elf-playground :title=${t("justify")} :code=${justifyCode()} :script=${controlScript}>
    <div class="layout-playground-preview">
      <elf-flex class="flex-demo" :justify.prop=${justify.value} gap="sm">
        <div v-for="item in numberedItems" :key="item" :class="itemClass(item)">{{ item }}</div>
      </elf-flex>
    </div>
    <aside slot="controls" class="layout-playground-controls" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <label>
        <elf-select variant="outlined" :label=${t("justifyValue")} :options.prop=${justifyOptions()} :modelValue.prop=${justify.value} @update:modelValue=${onJustify}></elf-select>
      </label>
    </aside>
  </elf-playground>

  <elf-playground :title=${t("align")} :code=${alignCode()} :script=${controlScript}>
    <div class="layout-playground-preview tall">
      <elf-flex class="flex-demo align-demo" :align.prop=${align.value} gap="md" style="min-height:180px">
        <div v-for="item in numberedItems" :key="item" :class="itemClass(item)">{{ item }}</div>
      </elf-flex>
    </div>
    <aside slot="controls" class="layout-playground-controls" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <label>
        <elf-select variant="outlined" :label=${t("alignValue")} :options.prop=${alignOptions()} :modelValue.prop=${align.value} @update:modelValue=${onAlign}></elf-select>
      </label>
    </aside>
  </elf-playground>
`);

export { PageFlexEx2 };
