import { defineHtml, useRef } from "@elfui/core";
import { opts, optsWithDisabled } from "./shared";

const clearValue = useRef("");

const code1 = `<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
  <elf-select style="width:240px"
    :options.prop=\${opts}
    :modelValue=\${clearValue}
    clearable
    value-on-clear="elfui"
    placeholder="选了能清"
    @update:modelValue=\${onClearUpdate}
  />
  <elf-select style="width:240px" :options.prop=\${optsWithDisabled} placeholder="选项C不可选" />
</div>`;

const script1 = `const clearValue = useRef("");

const opts = [
  { value: "vue", label: "Vue 3" },
  { value: "react", label: "React" },
  { value: "elfui", label: "ElfUI" }
];

const optsWithDisabled = [
  { value: "a", label: "可选 A" },
  { value: "b", label: "可选 B" },
  { value: "c", label: "禁用 C", disabled: true }
];

const onClearUpdate = (event) => {
  clearValue.set(event.detail);
};`;

const onClearUpdate = (event: CustomEvent): void => {
  clearValue.set(String(event.detail || ""));
};

const PageSelectEx2 = defineHtml(`
  <elf-playground title="clearable / value-on-clear / 禁用项" :code=${code1} :script=${script1}>
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;width:100%;justify-content:center">
      <div style="width:240px">
      <elf-select
        :options.prop=${opts}
        :modelValue=${clearValue}
        clearable
        value-on-clear="elfui"
        placeholder="选了能清"
        @update:modelValue=${onClearUpdate}
      ></elf-select>
      </div>
      <div style="width:240px">
        <elf-select :options.prop=${optsWithDisabled} placeholder="选项C不可选"></elf-select>
      </div>
    </div>
  </elf-playground>
`);

export { PageSelectEx2 };
