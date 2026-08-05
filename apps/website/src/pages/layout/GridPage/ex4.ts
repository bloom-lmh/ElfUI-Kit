import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const t = createDocsTranslator({
  container: { zh: "页面容器", en: "Page container" },
  composition: { zh: "组合式响应布局", en: "Composed responsive layout" },
  controls: { zh: "容器配置", en: "Container controls" },
  maxWidth: { zh: "最大宽度", en: "Maximum width" },
});

const containerWidth = useRef("sm");

const widthLabels: Record<string, string> = {
  sm: "sm · 600px",
  md: "md · 900px",
  lg: "lg · 1200px",
  xl: "xl · 1536px",
  full: "full · 100%",
};
const widthOptions = () => Object.entries(widthLabels).map(([value, label]) => ({ label, value }));
const onWidth = (event: CustomEvent): void => containerWidth.set(String(event.detail ?? ""));
const containerLabel = (): string => widthLabels[containerWidth.value] ?? containerWidth.value;
const containerCode =
  (): string => `<elf-container max-width="${containerWidth.value}" padding="md">
  ${containerLabel()}
</elf-container>`;
const containerScript = `const containerWidth = useRef("sm");
const onWidth = (event) => containerWidth.set(event.detail);`;

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
  <elf-playground :title=${t("container")} :code=${containerCode()} :script=${containerScript}>
    <div class="layout-playground-preview">
      <div class="container-preview">
        <elf-container class="container-frame" :maxWidth.prop=${containerWidth.value} padding="md">
          <div class="container-surface">${containerLabel()}</div>
        </elf-container>
      </div>
    </div>
    <aside slot="controls" class="layout-playground-controls" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <label>
        <elf-select variant="outlined" :label=${t("maxWidth")} :options.prop=${widthOptions()} :modelValue.prop=${containerWidth.value} @update:modelValue=${onWidth}></elf-select>
      </label>
    </aside>
  </elf-playground>

  <elf-playground :title=${t("composition")} :code=${compositionCode}>
    <elf-container max-width="lg" padding="0" style="width:100%">
      <elf-grid class="diagram-grid" columns="12" gap="md">
        <elf-grid-item span="8"><div class="diagram-item">1<small>span 8</small></div></elf-grid-item>
        <elf-grid-item span="4"><div class="diagram-item alt">2<small>span 4</small></div></elf-grid-item>
        <elf-grid-item span="3"><div class="diagram-item neutral">3<small>span 3</small></div></elf-grid-item>
        <elf-grid-item span="9"><div class="diagram-item alt">4<small>span 9</small></div></elf-grid-item>
      </elf-grid>
    </elf-container>
  </elf-playground>
`);

export { PageGridEx4 };
