import { defineHtml, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { opts } from "./shared";

const single = useRef("");
const variant = useRef("filled");

const t = createDocsTranslator({
  title: { zh: "基础单选", en: "Basic selection" },
  label: { zh: "前端框架", en: "Frontend framework" },
  placeholder: { zh: "选择框架", en: "Choose a framework" },
  selected: { zh: "当前选择", en: "Selected" },
  none: { zh: "未选择", en: "None" },
  controls: { zh: "选择器配置", en: "Select controls" },
  appearance: { zh: "外观", en: "Appearance" },
});

const variantOptions = [
  { label: "Filled", value: "filled" },
  { label: "Outlined", value: "outlined" },
  { label: "Underlined", value: "underlined" },
  { label: "Solo", value: "solo" },
  { label: "Solo filled", value: "solo-filled" },
  { label: "Solo inverted", value: "solo-inverted" },
];

const onSingleUpdate = (event: CustomEvent): void => single.set(String(event.detail || ""));
const onVariant = (event: CustomEvent): void =>
  variant.set(String(Array.isArray(event.detail) ? event.detail[0] : event.detail || "filled"));

const code = (): string => `<elf-select
  :options.prop="options"
  :modelValue="selected"
  variant="${variant.value}"
  label="Frontend framework"
  placeholder="Choose a framework"
  @update:modelValue="onUpdate"
/>`;

const script = `const selected = useRef("");
const options = [
  { value: "vue", label: "Vue 3" },
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
];
const onUpdate = (event) => selected.set(event.detail);`;

const PageSelectEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div style="width:min(320px,100%)">
      <elf-select
        :options.prop=${opts}
        :modelValue=${single}
        :variant.prop=${variant.value}
        :label=${t("label")}
        :placeholder=${t("placeholder")}
        @update:modelValue=${onSingleUpdate}
      ></elf-select>
    </div>
    <span slot="status" class="demo-state">
      ${t("selected")} · ${single.value || t("none")}
    </span>
    <aside slot="controls" class="demo-controls" style="display:grid;gap:16px" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <label style="display:grid;gap:8px"><span>${t("appearance")}</span><elf-select
        variant="underlined"
        :options.prop=${variantOptions}
        :modelValue.prop=${variant.value}
        @update:modelValue=${onVariant}
      ></elf-select></label>
    </aside>
  </elf-playground>
`);

export { PageSelectEx1 };
