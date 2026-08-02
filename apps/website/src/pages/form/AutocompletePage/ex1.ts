import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

const pick = createDocsPicker();
const keyword = useRef("");
const variant = useRef("filled");
const flags = useRef<string[]>(["clearable", "trigger"]);

const t = createDocsTranslator({
  section: { zh: "基础", en: "Basic" },
  title: { zh: "综合操作台", en: "Autocomplete playground" },
  current: { zh: "当前", en: "Current" },
  empty: { zh: "未选择", en: "Not selected" },
  controls: { zh: "自动补全配置", en: "Autocomplete controls" },
  appearance: { zh: "外观", en: "Variant" },
  filled: { zh: "填充", en: "Filled" },
  outlined: { zh: "描边", en: "Outlined" },
  underlined: { zh: "下划线", en: "Underlined" },
  solo: { zh: "独立表面", en: "Solo" },
  clearable: { zh: "允许清空", en: "Clearable" },
  trigger: { zh: "聚焦触发", en: "Open on focus" },
  highlight: { zh: "高亮首项", en: "Highlight first" },
  label: { zh: "前端框架", en: "Frontend framework" },
  placeholder: { zh: "输入框架名", en: "Type a framework" },
  disabled: { zh: "禁用项", en: "Disabled option" },
});

const suggestions = [
  { label: "Vue", value: "Vue" },
  { label: "React", value: "React" },
  { label: "Solid", value: "Solid" },
  { label: "ElfUI", value: "ElfUI" },
  { label: pick("禁用项", "Disabled option"), value: "disabled", disabled: true },
];

const variantOptions = () => [
  { label: t("filled"), value: "filled" },
  { label: t("outlined"), value: "outlined" },
  { label: t("underlined"), value: "underlined" },
  { label: t("solo"), value: "solo" },
];
const flagOptions = () => [
  { label: t("clearable"), value: "clearable" },
  { label: t("trigger"), value: "trigger" },
  { label: t("highlight"), value: "highlight" },
];
const hasFlag = (name: string): boolean => flags.value.includes(name);

const code1 = (): string => `<elf-autocomplete
  :options.prop=\${suggestions}
  :modelValue.prop=\${keyword}
  variant="${variant.value}"
  label="Frontend framework"
  :clearable="${hasFlag("clearable")}"
  :trigger-on-focus="${hasFlag("trigger")}"
  :highlight-first-item="${hasFlag("highlight")}"
  placeholder="Type a framework"
  @update:modelValue=\${onKeywordUpdate}
  @select=\${onSelect}
/>`;

const script1 = `const keyword = useRef("");

const suggestions = [
  { label: "Vue", value: "Vue" },
  { label: "React", value: "React" },
  { label: "Solid", value: "Solid" },
  { label: "ElfUI", value: "ElfUI" },
  { label: "Disabled option", value: "disabled", disabled: true }
];

const onKeywordUpdate = (event) => {
  keyword.set(event.detail);
};`;

const onKeywordUpdate = (event: CustomEvent): void => {
  keyword.set(String(event.detail || ""));
};

const onSelect = (): void => undefined;
const eventValue = (event: CustomEvent): unknown =>
  Array.isArray(event.detail) ? event.detail[0] : event.detail;
const onVariant = (event: CustomEvent): void => variant.set(String(eventValue(event) || "filled"));
const onFlags = (event: CustomEvent): void =>
  flags.set(Array.isArray(event.detail) ? event.detail.map(String) : []);

defineStyle(`
  .autocomplete-preview { display:grid; width:100%; place-items:center; }
  .autocomplete-preview elf-autocomplete { width:min(360px,100%); }
  .autocomplete-controls { display:grid; align-content:start; gap:16px; }
  .autocomplete-controls label { display:grid; gap:6px; color:var(--elf-text-secondary); font-size:12px; }
`);

const PageAutocompleteEx1 = defineHtml(`
<h2>${t("section")}</h2>
<elf-playground :title=${t("title")} :code=${code1()} :script=${script1}>
      <span slot="status" class="demo-state">${t("current")}：${keyword.value || t("empty")}</span>
      <div class="autocomplete-preview">
      <elf-autocomplete
        :options.prop=${suggestions}
        :modelValue.prop=${keyword}
        :variant.prop=${variant.value}
        :label=${t("label")}
        :clearable.prop=${hasFlag("clearable")}
        :triggerOnFocus.prop=${hasFlag("trigger")}
        :highlightFirstItem.prop=${hasFlag("highlight")}
        :placeholder=${t("placeholder")}
        @update:modelValue=${onKeywordUpdate}
        @select=${onSelect}
      ></elf-autocomplete>
      </div>
      <aside slot="controls" class="autocomplete-controls" :aria-label=${t("controls")}>
        <strong>${t("controls")}</strong>
        <label><span>${t("appearance")}</span><elf-select :options.prop=${variantOptions()} :modelValue.prop=${variant.value} @update:modelValue=${onVariant}></elf-select></label>
        <elf-checkbox-group :options.prop=${flagOptions()} :modelValue.prop=${flags.value} @update:modelValue=${onFlags}></elf-checkbox-group>
      </aside>
    </elf-playground>
`);

export { PageAutocompleteEx1 };
