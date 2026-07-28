import { defineHtml, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import { createRegionOptions, formatPaths, regionOptionsScript } from "./shared";

const pick = createDocsPicker();
const t = createDocsTranslator({
  title: { zh: "多选与折叠", en: "Multiple selection" },
  current: { zh: "当前路径", en: "Current paths" },
  empty: { zh: "未选择", en: "Not selected" },
});
const value = useRef<string[][]>([["zhejiang", "hangzhou"]]);
const status = useRef(pick("浙江 / 杭州", "Zhejiang / Hangzhou"));
const options = createRegionOptions(pick);
const code = `<elf-cascader multiple clearable :options.prop="options" :modelValue="value"
  @update:modelValue="onUpdate" @change="onChange" />`;
const script = `const value = useRef([["zhejiang", "hangzhou"]]);
${regionOptionsScript}
const onUpdate = (event) => value.set(event.detail);`;
const onUpdate = (event: CustomEvent): void => value.set(event.detail as string[][]);
const onChange = (event: CustomEvent): void => {
  status.set(formatPaths((event.detail as { path?: string[][] }).path, t("empty")));
};

const PageCascaderEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="width:min(320px,100%)"><elf-cascader multiple clearable :options.prop=${options}
      :modelValue=${value} @update:modelValue=${onUpdate} @change=${onChange}></elf-cascader></div>
    <span slot="status" class="demo-state">${t("current")} · ${status}</span>
  </elf-playground>
`);

export { PageCascaderEx3 };
