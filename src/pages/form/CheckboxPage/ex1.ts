import { defineHtml, useRef } from "@elfui/core";

const agreed = useRef(false);

const onUpdate = (event: CustomEvent): void => agreed.set(Boolean(event.detail));

const code = `<elf-checkbox
  :modelValue.prop=\${agreed.value}
  label="同意条款"
  @update:modelValue=\${onUpdate}
/>
<span slot="status">{{ agreed ? '✓ 已勾选' : '未勾选' }}</span>`;

const script = `const agreed = useRef(false);
const onUpdate = (event) => agreed.set(Boolean(event.detail));`;

const PageCheckboxEx1 = defineHtml(`
  <elf-playground title="单个 Checkbox" :code=${code} :script=${script}>
    <elf-checkbox
      :modelValue.prop=${agreed.value}
      label="同意条款"
      @update:modelValue=${onUpdate}
    ></elf-checkbox>
    <span slot="status" class="demo-state">{{ agreed ? '✓ 已勾选' : '未勾选' }}</span>
  </elf-playground>
`);

export { PageCheckboxEx1 };
