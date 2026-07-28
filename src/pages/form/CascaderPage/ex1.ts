import { defineHtml, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import { createRegionOptions, formatPaths, regionOptionsScript } from "./shared";

const pick = createDocsPicker();
const t = createDocsTranslator({
  title: { zh: "基础选择", en: "Basic selection" },
  label: { zh: "地区", en: "Region" },
  current: { zh: "当前路径", en: "Current path" },
  empty: { zh: "未选择", en: "Not selected" },
});
const value = useRef<string[]>(["zhejiang", "hangzhou"]);
const status = useRef(pick("浙江 / 杭州", "Zhejiang / Hangzhou"));
const options = createRegionOptions(pick);

const code = `<elf-cascader
  :options.prop="options"
  :modelValue="value"
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
const onChange = (event: CustomEvent): void => {
  status.set(formatPaths((event.detail as { path?: string[] }).path, t("empty")));
};

const PageCascaderEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="display:grid;gap:12px;width:260px">
      <elf-cascader :options.prop=${options} :modelValue=${value} :label=${t("label")}
        @update:modelValue=${onUpdate} @change=${onChange}></elf-cascader>
    </div>
    <span slot="status" class="demo-state">${t("current")} · ${status}</span>
  </elf-playground>
`);

export { PageCascaderEx1 };
