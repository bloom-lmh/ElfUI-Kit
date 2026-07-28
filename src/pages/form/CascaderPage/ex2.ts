import { defineHtml, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import { createRegionOptions, regionOptionsScript } from "./shared";

const pick = createDocsPicker();
const t = createDocsTranslator({
  title: { zh: "清空与禁用", en: "Clearable and disabled" },
  clearable: { zh: "请选择地区", en: "Choose a region" },
  disabled: { zh: "禁用状态", en: "Disabled" },
});
const clearableValue = useRef<string[]>([]);
const options = createRegionOptions(pick);
const code = `<elf-cascader :options.prop="options" :modelValue="value" clearable placeholder="Choose a region"
  @update:modelValue="onUpdate" />`;
const script = `const value = useRef([]);
${regionOptionsScript}
const onUpdate = (event) => value.set(event.detail);`;
const onUpdate = (event: CustomEvent): void => clearableValue.set(event.detail as string[]);

const PageCascaderEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="display:flex;gap:16px;align-items:center;justify-content:center;flex-wrap:wrap;width:100%">
      <div style="width:260px"><elf-cascader :options.prop=${options} :modelValue=${clearableValue} clearable
        :placeholder=${t("clearable")} @update:modelValue=${onUpdate}></elf-cascader></div>
      <div style="width:260px"><elf-cascader :options.prop=${options} disabled
        :placeholder=${t("disabled")}></elf-cascader></div>
    </div>
  </elf-playground>
`);

export { PageCascaderEx2 };
