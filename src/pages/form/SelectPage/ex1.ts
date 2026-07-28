import { defineHtml, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { opts } from "./shared";

const single = useRef("");

const t = createDocsTranslator({
  title: { zh: "基础单选", en: "Basic selection" },
  label: { zh: "前端框架", en: "Frontend framework" },
  placeholder: { zh: "选择框架", en: "Choose a framework" },
  selected: { zh: "当前选择", en: "Selected" },
  none: { zh: "未选择", en: "None" },
});

const onSingleUpdate = (event: CustomEvent): void => single.set(String(event.detail || ""));

const code = `<elf-select
  :options.prop="options"
  :modelValue="selected"
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
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="width:min(320px,100%)">
      <elf-select
        :options.prop=${opts}
        :modelValue=${single}
        :label=${t("label")}
        :placeholder=${t("placeholder")}
        @update:modelValue=${onSingleUpdate}
      ></elf-select>
    </div>
    <span slot="status" class="demo-state">
      ${t("selected")} · ${single.value || t("none")}
    </span>
  </elf-playground>
`);

export { PageSelectEx1 };
