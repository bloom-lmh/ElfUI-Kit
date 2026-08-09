import { defineHtml, useRef } from "@elfui/core";

import type { SelectOption } from "@elfui/kit";
import { createDocsTranslator } from "../../docsLocale";
import { opts } from "./shared";

const clearValue = useRef("");

const t = createDocsTranslator({
  title: { zh: "Select 清空与禁用", en: "Select clear and disabled" },
  clearable: { zh: "选择后可清空", en: "Clear after selection" },
  disabled: { zh: "选项 C 已禁用", en: "Option C is disabled" },
  optionA: { zh: "可选 A", en: "Option A" },
  optionB: { zh: "可选 B", en: "Option B" },
  optionC: { zh: "禁用 C", en: "Disabled C" },
});

const disabledOptions = (): SelectOption[] => [
  { value: "a", label: t("optionA") },
  { value: "b", label: t("optionB") },
  { value: "c", label: t("optionC"), disabled: true },
];

const onClearUpdate = (event: CustomEvent): void => clearValue.set(String(event.detail || ""));

const code = `<elf-select
  :options.prop="options"
  :modelValue="value"
  clearable
  value-on-clear="elfui"
  @update:modelValue="onUpdate"
/>

<elf-select :options.prop="disabledOptions" />`;

const script = `const value = useRef("");
const disabledOptions = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Disabled C", disabled: true },
];
const onUpdate = (event) => value.set(event.detail);`;

const PageSelectEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;width:100%">
      <elf-select style="width:260px"
        :options.prop=${opts}
        :modelValue=${clearValue}
        clearable
        value-on-clear="elfui"
        :placeholder=${t("clearable")}
        @update:modelValue=${onClearUpdate}
      ></elf-select>
      <elf-select style="width:260px"
        :options.prop=${disabledOptions()}
        :placeholder=${t("disabled")}
      ></elf-select>
    </div>
  </elf-playground>
`);

export { PageSelectEx2 };
