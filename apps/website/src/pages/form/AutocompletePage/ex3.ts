import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "键盘导航与上方弹出", en: "Keyboard navigation and top placement" },
  search: { zh: "框架搜索", en: "Framework search" },
  disabled: { zh: "禁用项", en: "Disabled option" },
});

const keyboardKeyword = useRef("");

const suggestions = [
  { label: "Vue", value: "Vue" },
  { label: "React", value: "React" },
  { label: "Solid", value: "Solid" },
  { label: "ElfUI", value: "ElfUI" },
  { label: t("disabled"), value: "disabled", disabled: true },
];

const code3 = `<elf-autocomplete
  :modelValue=\${keyboardKeyword}
  :options.prop=\${suggestions}
  :highlightFirstItem=\${true}
  placement="top-start"
  aria-label="${t("search")}"
  @update:modelValue=\${onKeyboardUpdate}
/>`;

const script3 = `const keyboardKeyword = useRef("");

const onKeyboardUpdate = (event) => {
  keyboardKeyword.set(event.detail);
};

const suggestions = [
    { label: "Vue", value: "Vue" },
    { label: "React", value: "React" },
    { label: "Solid", value: "Solid" },
    { label: "ElfUI", value: "ElfUI" },
    { label: "${t("disabled")}", value: "disabled", disabled: true }
];`;

const onKeyboardUpdate = (event: CustomEvent): void => {
  keyboardKeyword.set(String(event.detail || ""));
};

const PageAutocompleteEx3 = defineHtml(`
<elf-playground :title=${t("title")} :code=${code3} :script=${script3}>
      <elf-autocomplete
        :modelValue=${keyboardKeyword}
        :options.prop=${suggestions}
        :highlightFirstItem=${true}
        placement="top-start"
        :aria-label=${t("search")}
        @update:modelValue=${onKeyboardUpdate}
      ></elf-autocomplete>
    </elf-playground>
`);

export { PageAutocompleteEx3 };
