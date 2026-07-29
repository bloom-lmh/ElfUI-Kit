import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const t = createDocsTranslator({
  spacer: { zh: "剩余空间分配", en: "Remaining space and Spacer" },
  items: { zh: "子项伸缩与顺序", en: "Item growth and order" },
  responsive: { zh: "响应式工具类", en: "Responsive utilities" },
  controls: { zh: "子项配置", en: "Item controls" },
  behavior: { zh: "行为", en: "Behavior" },
  grow: { zh: "伸展", en: "Grow" },
  order: { zh: "排序", en: "Order" },
  alignSelf: { zh: "独立对齐", en: "Align self" }
});

const spacerCode = `<elf-flex align="center" gap="sm">
  <div>1</div><elf-spacer></elf-spacer><div>2</div><div>3</div>
</elf-flex>`;

const itemBehavior = useRef("grow");

const behaviorOptions = () => [
  { label: t("grow"), value: "grow" },
  { label: t("order"), value: "order" },
  { label: t("alignSelf"), value: "align-self" }
];
const onBehavior = (event: CustomEvent): void => itemBehavior.set(String(event.detail ?? ""));
const itemsCode = (): string => {
  if (itemBehavior.value === "order") {
    return `<elf-flex gap="sm">
  <div style="order:3">1</div><div style="order:1">2</div><div style="order:2">3</div>
</elf-flex>`;
  }
  if (itemBehavior.value === "align-self") {
    return `<elf-flex align="flex-start" gap="sm">
  <div>1</div><div style="align-self:center">2</div><div style="align-self:flex-end">3</div>
</elf-flex>`;
  }
  return `<elf-flex gap="sm">
  <div style="flex:1 1 auto">1</div><div>2</div><div>3</div>
</elf-flex>`;
};
const itemsScript = `const itemBehavior = useRef("grow");
const onBehavior = (event) => itemBehavior.set(event.detail);`;

const responsiveCode = `<div class="d-flex flex-column flex-md-row ga-3">
  <div>1</div><div>2</div><div>3</div>
</div>`;

defineStyle(diagramStyles);

const PageFlexEx4 = defineHtml(`
  <elf-playground :title=${t("spacer")} :code=${spacerCode}>
    <elf-flex class="flex-demo" align="center" gap="sm">
      <div class="diagram-item">1</div><elf-spacer></elf-spacer><div class="diagram-item alt">2</div><div class="diagram-item neutral">3</div>
    </elf-flex>
  </elf-playground>

  <elf-playground :title=${t("items")} :code=${itemsCode()} :script=${itemsScript}>
    <div class="layout-playground-preview tall">
      <elf-flex v-if=${itemBehavior.value === "grow"} class="flex-demo" gap="sm">
        <div class="diagram-item" style="flex:1 1 auto">1</div><div class="diagram-item alt">2</div><div class="diagram-item neutral">3</div>
      </elf-flex>
      <elf-flex v-if=${itemBehavior.value === "order"} class="flex-demo" gap="sm">
        <div class="diagram-item" style="order:3">1</div><div class="diagram-item alt" style="order:1">2</div><div class="diagram-item neutral" style="order:2">3</div>
      </elf-flex>
      <elf-flex v-if=${itemBehavior.value === "align-self"} class="flex-demo" align="flex-start" gap="sm" style="height:180px">
        <div class="diagram-item">1</div><div class="diagram-item alt" style="align-self:center">2</div><div class="diagram-item neutral" style="align-self:flex-end">3</div>
      </elf-flex>
    </div>
    <aside slot="controls" class="layout-playground-controls" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <label>
        <span>${t("behavior")}</span>
        <elf-select variant="outlined" :options.prop=${behaviorOptions()} :modelValue.prop=${itemBehavior.value} @update:modelValue=${onBehavior}></elf-select>
      </label>
    </aside>
  </elf-playground>

  <elf-playground :title=${t("responsive")} :code=${responsiveCode}>
    <elf-flex class="flex-demo" direction="column" gap="sm">
      <div class="diagram-item">1<small>flex-column</small></div><div class="diagram-item alt">2<small>flex-md-row</small></div><div class="diagram-item neutral">3<small>ga-3</small></div>
    </elf-flex>
  </elf-playground>
`);

export { PageFlexEx4 };
