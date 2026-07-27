import { defineHtml, useRef } from "@elfui/core";

const picked = useRef("a");

const onUpdate = (event: CustomEvent): void => picked.set(String(event.detail));

const code = `<elf-radio-group
  :modelValue.prop=\${picked.value}
  name="radio-demo"
  aria-label="选择一个选项"
  @update:modelValue=\${onUpdate}
>
  <elf-radio value="a" label="A 选项" />
  <elf-radio value="b" label="B 选项" />
  <elf-radio value="c" label="C 选项" />
</elf-radio-group>
<span slot="status">当前：{{ picked }}</span>`;

const script = `const picked = useRef("a");
const onUpdate = (event) => picked.set(String(event.detail));`;

const PageRadioEx1 = defineHtml(`
  <elf-playground title="RadioGroup 组合" :code=${code} :script=${script}>
    <elf-radio-group
      :modelValue.prop=${picked.value}
      name="radio-demo"
      aria-label="选择一个选项"
      @update:modelValue=${onUpdate}
    >
      <elf-radio value="a" label="A 选项"></elf-radio>
      <elf-radio value="b" label="B 选项"></elf-radio>
      <elf-radio value="c" label="C 选项"></elf-radio>
    </elf-radio-group>
    <span slot="status" class="demo-state">当前：{{ picked }}</span>
  </elf-playground>
`);

export { PageRadioEx1 };
