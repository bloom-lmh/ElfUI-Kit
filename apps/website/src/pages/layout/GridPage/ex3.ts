import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const desktopColumns = { span: 4, offset: 2 };

const t = createDocsTranslator({
  alignment: { zh: "双轴对齐", en: "Two-axis alignment" },
  offset: { zh: "偏移与位移", en: "Offset and movement" },
  responsive: { zh: "响应式列宽", en: "Responsive columns" },
  controls: { zh: "栅格项配置", en: "Grid item controls" },
  mode: { zh: "布局方式", en: "Layout mode" },
  offsetMode: { zh: "偏移", en: "Offset" },
  movementMode: { zh: "推拉位移", en: "Push and pull" },
  pushed: { zh: "原位置 1–4，向后移动 4 列", en: "Starts at 1–4, then moves 4 columns forward" },
  pulled: { zh: "原位置 5–8，向前移动 4 列", en: "Starts at 5–8, then moves 4 columns backward" },
});

const offsetMode = useRef("offset");

const alignmentCode = `<elf-grid columns="12" justify="center" align="center" gap="md">
  <elf-grid-item span="3">1</elf-grid-item>
  <elf-grid-item span="3">2</elf-grid-item>
  <elf-grid-item span="3">3</elf-grid-item>
</elf-grid>`;

const offsetOptions = () => [
  { label: t("offsetMode"), value: "offset" },
  { label: t("movementMode"), value: "movement" },
];
const onOffsetMode = (event: CustomEvent): void => offsetMode.set(String(event.detail ?? ""));
const offsetCode = (): string =>
  offsetMode.value === "movement"
    ? `<elf-grid columns="12">
  <elf-grid-item span="4" push="4">2</elf-grid-item>
  <elf-grid-item span="4" pull="4">3</elf-grid-item>
</elf-grid>`
    : `<elf-grid columns="12">
  <elf-grid-item span="3" offset="1">1</elf-grid-item>
</elf-grid>`;
const offsetScript = `const offsetMode = useRef("offset");
const onOffsetMode = (event) => offsetMode.set(event.detail);`;

const responsiveCode = `<elf-grid columns="12" gap="md">
  <elf-grid-item span="12" :sm=\${12} :md=\${desktopColumns}>1</elf-grid-item>
</elf-grid>`;

const responsiveScript = `const desktopColumns = { span: 4, offset: 2 };`;

defineStyle(diagramStyles);

const PageGridEx3 = defineHtml(`
  <elf-playground :title=${t("alignment")} :code=${alignmentCode}>
    <elf-grid class="diagram-grid" columns="12" justify="center" align="center" gap="md" style="min-height:148px">
      <elf-grid-item span="3"><div class="diagram-item">1</div></elf-grid-item>
      <elf-grid-item span="3"><div class="diagram-item alt" style="min-height:112px">2</div></elf-grid-item>
      <elf-grid-item span="3"><div class="diagram-item neutral">3</div></elf-grid-item>
    </elf-grid>
  </elf-playground>

  <elf-playground :title=${t("offset")} :code=${offsetCode()} :script=${offsetScript}>
    <div class="layout-playground-preview">
      <elf-grid v-if=${offsetMode.value === "offset"} class="diagram-grid" columns="12">
        <elf-grid-item span="3" offset="1"><div class="diagram-item">1<small>offset 1</small></div></elf-grid-item>
      </elf-grid>
      <elf-grid v-if=${offsetMode.value === "movement"} class="diagram-grid" columns="12">
        <elf-grid-item span="4" push="4"><div class="diagram-item alt">2<small>${t("pushed")}</small></div></elf-grid-item>
        <elf-grid-item span="4" pull="4"><div class="diagram-item neutral">3<small>${t("pulled")}</small></div></elf-grid-item>
      </elf-grid>
    </div>
    <aside slot="controls" class="layout-playground-controls" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <label>
        <elf-select variant="outlined" :label=${t("mode")} :options.prop=${offsetOptions()} :modelValue.prop=${offsetMode.value} @update:modelValue=${onOffsetMode}></elf-select>
      </label>
    </aside>
  </elf-playground>

  <elf-playground :title=${t("responsive")} :code=${responsiveCode} :script=${responsiveScript}>
    <elf-grid class="diagram-grid" columns="12" gap="md">
      <elf-grid-item span="12" :sm=${12} :md=${desktopColumns}><div class="diagram-item">1<small>xs 12 · md 4 + offset 2</small></div></elf-grid-item>
    </elf-grid>
  </elf-playground>
`);

export { PageGridEx3 };
