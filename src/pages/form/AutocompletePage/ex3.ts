import { defineHtml, useRef } from "@elfui/core";

const keyboardKeyword = useRef("");

const suggestions = [
  { label: "Vue", value: "Vue" },
  { label: "React", value: "React" },
  { label: "Solid", value: "Solid" },
  { label: "ElfUI", value: "ElfUI" },
  { label: "禁用项", value: "disabled", disabled: true }
];

const code3 = `<elf-autocomplete
  :modelValue=\${keyboardKeyword}
  :options.prop=\${suggestions}
  :highlightFirstItem=\${true}
  placement="top-start"
  aria-label="框架搜索"
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
    { label: "禁用项", value: "disabled", disabled: true }
];`;

const onKeyboardUpdate = (event: CustomEvent): void => {
  keyboardKeyword.set(String(event.detail || ""));
};

const PageAutocompleteEx3 = defineHtml(`
<elf-playground title="键盘导航与上方弹出" :code=${code3} :script=${script3}>
      <elf-autocomplete
        :modelValue=${keyboardKeyword}
        :options.prop=${suggestions}
        :highlightFirstItem=${true}
        placement="top-start"
        aria-label="框架搜索"
        @update:modelValue=${onKeyboardUpdate}
      ></elf-autocomplete>
    </elf-playground>
`);

export { PageAutocompleteEx3 };
