import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const t = createDocsTranslator({
  gap: { zh: "栅格间距", en: "Grid gaps" },
  columns: { zh: "自定义列数", en: "Custom column count" },
  autoFit: { zh: "自动适配列", en: "Auto-fit columns" },
  controls: { zh: "栅格配置", en: "Grid controls" },
  gapValue: { zh: "间距", en: "Gap" },
});

const gridGap = useRef("md");

const gapOptions = () =>
  ["0", "xs", "sm", "md", "lg", "xl"].map((value) => ({ label: value, value }));
const eventValue = (event: CustomEvent): string => String(event.detail ?? "");
const onGap = (event: CustomEvent): void => gridGap.set(eventValue(event));
const gapCode = (): string => `<elf-grid columns="12" gap="${gridGap.value}">
  <elf-grid-item span="4">1</elf-grid-item>
  <elf-grid-item span="4">2</elf-grid-item>
  <elf-grid-item span="4">3</elf-grid-item>
</elf-grid>`;
const gapScript = `const gridGap = useRef("md");
const onGap = (event) => gridGap.set(event.detail);`;

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
  <elf-playground :title=${t("gap")} :code=${gapCode()} :script=${gapScript}>
    <div class="layout-playground-preview">
      <elf-grid class="diagram-grid" columns="12" :gap.prop=${gridGap.value}>
        <elf-grid-item span="4"><div class="diagram-item">1</div></elf-grid-item>
        <elf-grid-item span="4"><div class="diagram-item alt">2</div></elf-grid-item>
        <elf-grid-item span="4"><div class="diagram-item neutral">3</div></elf-grid-item>
      </elf-grid>
    </div>
    <aside slot="controls" class="layout-playground-controls" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <label>
        <span>${t("gapValue")}</span>
        <elf-select variant="outlined" :options.prop=${gapOptions()} :modelValue.prop=${gridGap.value} @update:modelValue=${onGap}></elf-select>
      </label>
    </aside>
  </elf-playground>

  <elf-playground :title=${t("columns")} :code=${columnsCode}>
    <elf-grid class="diagram-grid" columns="24" gap="sm">
      <elf-grid-item span="6"><div class="diagram-item">1<small>6 / 24</small></div></elf-grid-item>
      <elf-grid-item span="12"><div class="diagram-item alt">2<small>12 / 24</small></div></elf-grid-item>
      <elf-grid-item span="6"><div class="diagram-item neutral">3<small>6 / 24</small></div></elf-grid-item>
    </elf-grid>
  </elf-playground>

  <elf-playground :title=${t("autoFit")} :code=${autoFitCode}>
    <elf-grid class="diagram-grid" auto-fit min-column-width="180px" gap="md">
      <div class="diagram-item">1</div><div class="diagram-item alt">2</div><div class="diagram-item neutral">3</div>
    </elf-grid>
  </elf-playground>
`);

export { PageGridEx2 };
