import { defineHtml, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import { createRegionOptions, formatPaths, regionOptionsScript } from "./shared";

const pick = createDocsPicker();
const t = createDocsTranslator({
  title: { zh: "独立选项面板", en: "Standalone panel" },
  current: { zh: "当前路径", en: "Current paths" },
  empty: { zh: "未选择", en: "Not selected" },
});
const value = useRef<string[][]>([["zhejiang", "ningbo"]]);
const status = useRef(pick("浙江 / 宁波", "Zhejiang / Ningbo"));
const options = createRegionOptions(pick);
const code = `<elf-cascader-panel checkable :options.prop="options" :modelValue="value"
  @update:modelValue="onUpdate" @change="onChange" />`;
const script = `const value = useRef([["zhejiang", "ningbo"]]);
${regionOptionsScript}
const onUpdate = (event) => value.set(event.detail);`;
const onUpdate = (event: CustomEvent): void => value.set(event.detail as string[][]);
const onChange = (event: CustomEvent): void => {
  status.set(formatPaths((event.detail as { path?: string[][] }).path, t("empty")));
};

const PageCascaderEx5 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="width:max-content;max-width:100%"><elf-cascader-panel checkable :options.prop=${options}
      :modelValue=${value} @update:modelValue=${onUpdate} @change=${onChange}></elf-cascader-panel></div>
    <span slot="status" class="demo-state">${t("current")} · ${status}</span>
  </elf-playground>
`);

export { PageCascaderEx5 };
