import { defineHtml, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import { createRegionOptions, formatPaths, regionOptionsScript } from "./shared";

const pick = createDocsPicker();
const t = createDocsTranslator({
  title: { zh: "Cascader 基础选择", en: "Cascader basic selection" },
  label: { zh: "地区", en: "Region" },
  current: { zh: "当前路径", en: "Current path" },
  empty: { zh: "未选择", en: "Not selected" },
  controls: { zh: "级联选择器配置", en: "Cascader controls" },
  appearance: { zh: "外观", en: "Appearance" },
});
const value = useRef<string[]>(["zhejiang", "hangzhou"]);
const variant = useRef("filled");
const status = useRef(pick("浙江 / 杭州", "Zhejiang / Hangzhou"));
const options = createRegionOptions(pick);
const variantOptions = [
  { label: "Filled", value: "filled" },
  { label: "Outlined", value: "outlined" },
  { label: "Underlined", value: "underlined" },
  { label: "Solo", value: "solo" },
  { label: "Solo filled", value: "solo-filled" },
  { label: "Solo inverted", value: "solo-inverted" },
];

const code = (): string => `<elf-cascader
  :options.prop="options"
  :modelValue="value"
  variant="${variant.value}"
  label="Region"
  @update:modelValue="onUpdate"
  @change="onChange"
/>`;
const script = `const value = useRef(["zhejiang", "hangzhou"]);
const status = useRef("Zhejiang / Hangzhou");
${regionOptionsScript}
const onUpdate = (event) => value.set(event.detail);
const onChange = (event) => status.set(event.detail.path.join(" / ") || "Not selected");`;

const onUpdate = (event: CustomEvent): void => value.set(event.detail as string[]);
const onVariant = (event: CustomEvent): void =>
  variant.set(String(Array.isArray(event.detail) ? event.detail[0] : event.detail || "filled"));
const onChange = (event: CustomEvent): void => {
  status.set(formatPaths((event.detail as { path?: string[] }).path, t("empty")));
};

const PageCascaderEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div style="display:grid;gap:12px;width:260px">
      <elf-cascader :options.prop=${options} :modelValue=${value} :label=${t("label")} :variant.prop=${variant.value}
        @update:modelValue=${onUpdate} @change=${onChange}></elf-cascader>
    </div>
    <span slot="status" class="demo-state">${t("current")} · ${status}</span>
    <aside slot="controls" class="demo-controls" style="display:grid;gap:12px" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <elf-select variant="underlined" :label=${t("appearance")} :options.prop=${variantOptions} :modelValue.prop=${variant.value}
        @update:modelValue=${onVariant}></elf-select>
    </aside>
  </elf-playground>
`);

export { PageCascaderEx1 };
