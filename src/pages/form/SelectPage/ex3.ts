import { defineHtml, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { opts } from "./shared";

const multiple = useRef<string[]>([]);
const limited = useRef<string[]>(["vue"]);

const t = createDocsTranslator({
  title: { zh: "多选与折叠", en: "Multiple and collapsed tags" },
  multiple: { zh: "选择多个框架", en: "Choose multiple frameworks" },
  limited: { zh: "最多选择 2 项", en: "Choose up to 2 items" },
  selected: { zh: "已选择", en: "Selected" },
});

const onMultipleUpdate = (event: CustomEvent): void => {
  multiple.set((event.detail ?? []) as string[]);
};
const onLimitedUpdate = (event: CustomEvent): void => {
  limited.set((event.detail ?? []) as string[]);
};
const onRemoveTag = (event: CustomEvent): void => {
  void event.detail;
};

const code = `<elf-select
  :options.prop="options"
  :modelValue.prop="selected"
  multiple
  collapse-tags
  :max-collapse-tags="1"
  :multiple-limit="2"
  @update:modelValue="onUpdate"
  @remove-tag="onRemoveTag"
/>`;

const script = `const selected = useRef(["vue"]);
const onUpdate = (event) => selected.set(event.detail);
const onRemoveTag = (event) => console.log("remove-tag", event.detail);`;

const PageSelectEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status">${t("selected")} · ${String(multiple.value.length + limited.value.length)}</span>
    <div style="display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;width:100%">
      <elf-select style="width:320px"
        :options.prop=${opts}
        :modelValue.prop=${multiple.value}
        multiple
        :placeholder=${t("multiple")}
        @update:modelValue=${onMultipleUpdate}
      ></elf-select>
      <elf-select style="width:300px"
        :options.prop=${opts}
        :modelValue.prop=${limited.value}
        multiple
        collapse-tags
        :maxCollapseTags=${1}
        :multipleLimit=${2}
        :placeholder=${t("limited")}
        @update:modelValue=${onLimitedUpdate}
        @remove-tag=${onRemoveTag}
      ></elf-select>
    </div>
  </elf-playground>
`);

export { PageSelectEx3 };
