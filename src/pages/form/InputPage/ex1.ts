import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const value = useRef("");
const variant = useRef("filled");
const density = useRef("default");
const flags = useRef<string[]>([]);

const t = createDocsTranslator({
  appearance: { zh: "外观与浮动标签", en: "Variants and floating labels" },
  playground: { zh: "Material 输入框操作台", en: "Material text field playground" },
  controls: { zh: "输入框配置", en: "Text field controls" },
  variant: { zh: "外观", en: "Variant" },
  density: { zh: "密度", en: "Density" },
  defaultDensity: { zh: "默认", en: "Default" },
  comfortable: { zh: "舒适", en: "Comfortable" },
  compact: { zh: "紧凑", en: "Compact" },
  outlined: { zh: "描边", en: "Outlined" },
  filled: { zh: "填充", en: "Filled" },
  underlined: { zh: "下划线", en: "Underlined" },
  solo: { zh: "独立表面", en: "Solo" },
  soloFilled: { zh: "独立填充", en: "Solo filled" },
  soloInverted: { zh: "独立反色", en: "Solo inverted" },
  clearable: { zh: "允许清空", en: "Clearable" },
  disabled: { zh: "禁用", en: "Disabled" },
  innerIcon: { zh: "内部前置图标", en: "Prepend inner icon" },
  label: { zh: "标签", en: "Label" },
  current: { zh: "当前值", en: "Value" },
  comparison: { zh: "六种字段表面", en: "Six field surfaces" },
  comparisonTitle: { zh: "静止与聚焦状态逐项对照", en: "Compare resting and focused states" },
  densitySection: { zh: "密度", en: "Density" },
  densityTitle: { zh: "默认、舒适与紧凑高度", en: "Default, comfortable, and compact" },
  icons: { zh: "图标", en: "Icons" },
  iconTitle: { zh: "内部与外部图标", en: "Inner and outer icons" },
  prepend: { zh: "外部前置", en: "Prepend" },
  prependInner: { zh: "内部前置", en: "Prepend inner" },
  appendInner: { zh: "内部后置", en: "Append inner" },
  append: { zh: "外部后置", en: "Append" }
});

const variantOptions = () => [
  { label: t("filled"), value: "filled" },
  { label: t("outlined"), value: "outlined" },
  { label: t("underlined"), value: "underlined" },
  { label: t("solo"), value: "solo" },
  { label: t("soloFilled"), value: "solo-filled" },
  { label: t("soloInverted"), value: "solo-inverted" }
];

const densityOptions = () => [
  { label: t("defaultDensity"), value: "default" },
  { label: t("comfortable"), value: "comfortable" },
  { label: t("compact"), value: "compact" }
];

const flagOptions = () => [
  { label: t("innerIcon"), value: "prefix" },
  { label: t("clearable"), value: "clearable" },
  { label: t("disabled"), value: "disabled" }
];

const detail = (event: CustomEvent): unknown =>
  Array.isArray(event.detail) ? event.detail[0] : event.detail;
const onVariant = (event: CustomEvent): void => variant.set(String(detail(event) || "filled"));
const onDensity = (event: CustomEvent): void => density.set(String(detail(event) || "default"));
const onValue = (event: CustomEvent): void => value.set(String(event.detail || ""));
const onFlags = (event: CustomEvent): void =>
  flags.set(Array.isArray(event.detail) ? event.detail.map(String) : []);
const hasFlag = (name: string): boolean => flags.value.includes(name);

const code = (): string => `<elf-input
  variant="${variant.value}"
  density="${density.value}"
  label="${t("label")}"
  :modelValue.prop=\${value.value}
  @update:modelValue=\${onValue}
>${hasFlag("prefix") ? '\n  <svg slot="prefix">...</svg>' : ""}
</elf-input>`;

const script = `const value = useRef("");

const onValue = (event) => {
  value.set(String(event.detail || ""));
};`;

const comparisonCode = `<elf-input variant="filled" label="Filled" />
<elf-input variant="outlined" label="Outlined" />
<elf-input variant="underlined" label="Underlined" />
<elf-input variant="solo" label="Solo" />
<elf-input variant="solo-filled" label="Solo filled" />
<elf-input variant="solo-inverted" label="Solo inverted" />`;

const densityCode = `<elf-input density="default" label="Default" />
<elf-input density="comfortable" label="Comfortable" />
<elf-input density="compact" label="Compact" />`;

const iconCode = `<elf-input variant="filled" label="Prepend inner"><svg slot="prefix">...</svg></elf-input>
<elf-input variant="outlined" label="Prepend inner"><svg slot="prefix">...</svg></elf-input>
<elf-input variant="underlined" label="Prepend inner"><svg slot="prefix">...</svg></elf-input>
<elf-input variant="solo" label="Append inner"><svg slot="suffix">...</svg></elf-input>
<elf-input variant="filled" label="Prepend"><svg slot="prepend">...</svg></elf-input>
<elf-input variant="outlined" label="Append"><svg slot="append">...</svg></elf-input>`;

defineStyle(styles);

const PageInputEx1 = defineHtml(`
  <h2>${t("appearance")}</h2>
  <elf-playground :title=${t("playground")} :code=${code()} :script=${script}>
    <span slot="status" class="demo-state">${t("current")}：${value.value || "—"}</span>
    <section class="input-lab-preview">
      <elf-input
        :variant.prop=${variant.value}
        :density.prop=${density.value}
        :label=${t("label")}
        :modelValue.prop=${value.value}
        :clearable.prop=${hasFlag("clearable")}
        :disabled.prop=${hasFlag("disabled")}
        @update:modelValue=${onValue}
      >
        <svg v-if=${hasFlag("prefix")} slot="prefix" viewBox="0 0 24 24" aria-label="search"><circle cx="11" cy="11" r="6"></circle><path d="m16 16 4 4"></path></svg>
      </elf-input>
    </section>
    <aside slot="controls" class="input-lab-config" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <label><span>${t("variant")}</span><elf-select variant="underlined" :options.prop=${variantOptions()} :modelValue.prop=${variant.value} @update:modelValue=${onVariant}></elf-select></label>
      <label><span>${t("density")}</span><elf-select variant="underlined" :options.prop=${densityOptions()} :modelValue.prop=${density.value} @update:modelValue=${onDensity}></elf-select></label>
      <elf-checkbox-group :options.prop=${flagOptions()} :modelValue.prop=${flags.value} @update:modelValue=${onFlags}></elf-checkbox-group>
    </aside>
  </elf-playground>

  <h2>${t("comparison")}</h2>
  <elf-playground :title=${t("comparisonTitle")} :code=${comparisonCode}>
    <div class="input-variant-grid">
      <elf-input variant="filled" :label=${t("filled")}></elf-input>
      <elf-input variant="outlined" :label=${t("outlined")}></elf-input>
      <elf-input variant="underlined" :label=${t("underlined")}></elf-input>
      <elf-input variant="solo" :label=${t("solo")}></elf-input>
      <elf-input variant="solo-filled" :label=${t("soloFilled")}></elf-input>
      <elf-input variant="solo-inverted" :label=${t("soloInverted")}></elf-input>
    </div>
  </elf-playground>

  <h2>${t("densitySection")}</h2>
  <elf-playground :title=${t("densityTitle")} :code=${densityCode}>
    <div class="input-density-stack">
      <elf-input density="default" :label=${t("defaultDensity")}></elf-input>
      <elf-input density="comfortable" :label=${t("comfortable")}></elf-input>
      <elf-input density="compact" :label=${t("compact")}></elf-input>
    </div>
  </elf-playground>

  <h2>${t("icons")}</h2>
  <elf-playground :title=${t("iconTitle")} :code=${iconCode}>
    <div class="input-icon-grid">
      <elf-input variant="filled" :label=${t("prependInner")}><svg slot="prefix" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"></circle><path d="m16 16 4 4"></path></svg></elf-input>
      <elf-input variant="outlined" :label=${t("prependInner")}><svg slot="prefix" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"></circle><path d="m16 16 4 4"></path></svg></elf-input>
      <elf-input variant="underlined" :label=${t("prependInner")}><svg slot="prefix" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"></circle><path d="m16 16 4 4"></path></svg></elf-input>
      <elf-input variant="solo" :label=${t("appendInner")}><svg slot="suffix" viewBox="0 0 24 24"><path d="m7 12 3 3 7-7"></path></svg></elf-input>
      <elf-input variant="filled" :label=${t("prepend")}><svg slot="prepend" viewBox="0 0 24 24"><path d="M4 12h16"></path><path d="m10 6-6 6 6 6"></path></svg></elf-input>
      <elf-input variant="outlined" :label=${t("append")}><svg slot="append" viewBox="0 0 24 24"><path d="M4 12h16"></path><path d="m14 6 6 6-6 6"></path></svg></elf-input>
    </div>
  </elf-playground>
`);

export { PageInputEx1 };
