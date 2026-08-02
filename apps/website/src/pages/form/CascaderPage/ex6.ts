import { defineHtml, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import { createRegionOptions, regionOptionsScript } from "./shared";

const pick = createDocsPicker();
const t = createDocsTranslator({
  title: { zh: "路径搜索", en: "Path search" },
  placeholder: { zh: "搜索城市或上级地区", en: "Search a city or parent region" },
  hint: {
    zh: "输入城市或上级地区名称，搜索可选路径。",
    en: "Search selectable paths by city or parent region.",
  },
});
const value = useRef<string[]>([]);
const options = createRegionOptions(pick);
const code = `<elf-cascader filterable :options.prop="options" :modelValue="value"
  placeholder="Search a city or parent region" @update:modelValue="onSearchUpdate" />`;
const script = `const value = useRef([]);
${regionOptionsScript}
const onSearchUpdate = (event) => value.set(event.detail);`;
const onSearchUpdate = (event: CustomEvent<string[]>): void => {
  value.set(Array.isArray(event.detail) ? event.detail : []);
};

const PageCascaderEx6 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="width:min(320px,100%)"><elf-cascader filterable :options.prop=${options} :modelValue=${value}
      :placeholder=${t("placeholder")} @update:modelValue=${onSearchUpdate}></elf-cascader></div>
    <span slot="status" class="demo-state">${t("hint")}</span>
  </elf-playground>
`);

export { PageCascaderEx6 };
