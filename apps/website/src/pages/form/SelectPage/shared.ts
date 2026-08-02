// Select 页面共享数据
import type { SelectOption } from "@elfui/kit-src/components/Form";

export const opts: SelectOption[] = [
  { value: "vue", label: "Vue 3" },
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "elfui", label: "ElfUI" },
  { value: "lit", label: "Lit" },
];

export const optionFields = {
  value: "id",
  label: "name",
  disabled: "locked",
};
