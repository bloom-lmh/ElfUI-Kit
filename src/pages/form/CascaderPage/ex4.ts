import { defineHtml, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import { createRegionOptions, formatPaths, regionOptionsScript } from "./shared";

const pick = createDocsPicker();
const t = createDocsTranslator({
  title: { zh: "联动选项框", en: "Linked checkboxes" },
  current: { zh: "当前路径", en: "Current paths" },
  empty: { zh: "未选择", en: "Not selected" },
});
const value = useRef<string[][]>([["jiangsu", "nanjing"]]);
const status = useRef(pick("江苏 / 南京", "Jiangsu / Nanjing"));
const options = createRegionOptions(pick);
const code = `<elf-cascader checkable clearable :options.prop="options" :modelValue="value"
  @update:modelValue="onUpdate" @change="onChange" />`;
const script = `const value = useRef([["jiangsu", "nanjing"]]);
${regionOptionsScript}
const onUpdate = (event) => value.set(event.detail);`;
const onUpdate = (event: CustomEvent): void => value.set(event.detail as string[][]);
const onChange = (event: CustomEvent): void => {
  status.set(formatPaths((event.detail as { path?: string[][] }).path, t("empty")));
};

const PageCascaderEx4 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="width:min(320px,100%)"><elf-cascader checkable clearable :options.prop=${options}
      :modelValue=${value} @update:modelValue=${onUpdate} @change=${onChange}></elf-cascader></div>
    <span slot="status" class="demo-state">${t("current")} · ${status}</span>
  </elf-playground>
`);

export { PageCascaderEx4 };
