import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const t = createDocsTranslator({
  wrap: { zh: "换行策略", en: "Wrapping strategies" },
  alignContent: { zh: "多行内容对齐", en: "Wrapped-line alignment" },
  compatibility: { zh: "间距兼容输入", en: "Space-compatible inputs" },
  line1: { zh: "第 1 行", en: "line 1" },
  line2: { zh: "第 2 行", en: "line 2" },
  controls: { zh: "弹性布局配置", en: "Flex controls" },
  wrapValue: { zh: "换行方式", en: "Wrap mode" },
  alignContentValue: { zh: "多行对齐", en: "Align content" },
  compatibilityValue: { zh: "兼容模式", en: "Compatibility mode" },
  alignmentSize: { zh: "对齐与间距", en: "Alignment and size" },
  fillRatio: { zh: "填充比例", en: "Fill ratio" }
});

const wrapMode = useRef("wrap");
const alignContentMode = useRef("space-between");
const compatibilityMode = useRef("alignment");

const alignedItems = [
  { id: 1, line: t("line1") },
  { id: 2, line: t("line1") },
  { id: 3, line: t("line2") }
] as const;

const alignedItemClass = (item: number): string =>
  item === 2 ? "diagram-item alt" : item === 3 ? "diagram-item neutral" : "diagram-item";
const wrapOptions = () => ["nowrap", "wrap", "wrap-reverse"]
  .map((value) => ({ label: value, value }));
const alignContentOptions = () => ["stretch", "flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"]
  .map((value) => ({ label: value, value }));
const compatibilityOptions = () => [
  { label: t("alignmentSize"), value: "alignment" },
  { label: t("fillRatio"), value: "fill" }
];
const eventValue = (event: CustomEvent): string => String(event.detail ?? "");
const onWrap = (event: CustomEvent): void => wrapMode.set(eventValue(event));
const onAlignContent = (event: CustomEvent): void => alignContentMode.set(eventValue(event));
const onCompatibility = (event: CustomEvent): void => compatibilityMode.set(eventValue(event));
const wrapCode = (): string => `<elf-flex wrap="${wrapMode.value}" gap="md">1 2 3</elf-flex>`;
const alignContentCode = (): string => `<elf-flex wrap align-content="${alignContentMode.value}" gap="sm">1 2 3</elf-flex>`;
const compatibilityCode = (): string => compatibilityMode.value === "fill"
  ? `<elf-flex fill fill-ratio="30" size="default">1 2 3</elf-flex>`
  : `<elf-flex alignment="center" size="default">1 2 3</elf-flex>`;
const controlScript = `const wrapMode = useRef("wrap");
const alignContentMode = useRef("space-between");
const compatibilityMode = useRef("alignment");`;

defineStyle(diagramStyles);

const PageFlexEx3 = defineHtml(`
  <elf-playground :title=${t("wrap")} :code=${wrapCode()} :script=${controlScript}>
    <div class="layout-playground-preview tall wrap-preview">
      <elf-flex class="flex-demo" :wrap.prop=${wrapMode.value} gap="md" style="max-width:280px">
        <div class="diagram-item" style="flex-basis:112px">1</div>
        <div class="diagram-item alt" style="flex-basis:112px">2</div>
        <div class="diagram-item neutral" style="flex-basis:112px">3</div>
      </elf-flex>
    </div>
    <aside slot="controls" class="layout-playground-controls" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <label>
        <span>${t("wrapValue")}</span>
        <elf-select variant="outlined" :options.prop=${wrapOptions()} :modelValue.prop=${wrapMode.value} @update:modelValue=${onWrap}></elf-select>
      </label>
    </aside>
  </elf-playground>

  <elf-playground :title=${t("alignContent")} :code=${alignContentCode()} :script=${controlScript}>
    <div class="layout-playground-preview tall">
      <elf-flex class="align-content-demo" wrap :alignContent.prop=${alignContentMode.value} gap="sm">
        <div v-for="item in alignedItems" :key="item.id" :class="alignedItemClass(item.id)">{{ item.id }}<small>{{ item.line }}</small></div>
      </elf-flex>
    </div>
    <aside slot="controls" class="layout-playground-controls" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <label>
        <span>${t("alignContentValue")}</span>
        <elf-select variant="outlined" :options.prop=${alignContentOptions()} :modelValue.prop=${alignContentMode.value} @update:modelValue=${onAlignContent}></elf-select>
      </label>
    </aside>
  </elf-playground>

  <elf-playground :title=${t("compatibility")} :code=${compatibilityCode()} :script=${controlScript}>
    <div class="layout-playground-preview">
      <elf-flex v-if=${compatibilityMode.value === "alignment"} class="flex-demo" alignment="center" size="default">
        <div class="diagram-item">1</div><div class="diagram-item alt">2</div><div class="diagram-item neutral">3</div>
      </elf-flex>
      <elf-flex v-if=${compatibilityMode.value === "fill"} class="flex-demo" fill fill-ratio="30" size="default">
        <div class="diagram-item">1</div><div class="diagram-item alt">2</div><div class="diagram-item neutral">3</div>
      </elf-flex>
    </div>
    <aside slot="controls" class="layout-playground-controls" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <label>
        <span>${t("compatibilityValue")}</span>
        <elf-select variant="outlined" :options.prop=${compatibilityOptions()} :modelValue.prop=${compatibilityMode.value} @update:modelValue=${onCompatibility}></elf-select>
      </label>
    </aside>
  </elf-playground>
`);

export { PageFlexEx3 };
