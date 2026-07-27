import { defineHtml, useRef } from "@elfui/core";

const picked = useRef("x");

const onUpdate = (event: CustomEvent): void => picked.set(String(event.detail));

const code = `<elf-radio-group
  :modelValue.prop=\${picked.value}
  variant="button"
  fill="#7c3aed"
  text-color="#fff"
  @update:modelValue=\${onUpdate}
>
  <elf-radio value="x" label="选项 X" />
  <elf-radio value="y" label="选项 Y" />
  <elf-radio value="z" label="选项 Z" />
</elf-radio-group>`;

const script = `const picked = useRef("x");
const onUpdate = (event) => picked.set(String(event.detail));`;

const PageRadioEx2 = defineHtml(`
  <elf-playground title="按钮风格" :code=${code} :script=${script}>
    <elf-radio-group
      :modelValue.prop=${picked.value}
      variant="button"
      fill="#7c3aed"
      text-color="#fff"
      @update:modelValue=${onUpdate}
    >
      <elf-radio value="x" label="选项 X"></elf-radio>
      <elf-radio value="y" label="选项 Y"></elf-radio>
      <elf-radio value="z" label="选项 Z"></elf-radio>
    </elf-radio-group>
    <span slot="status" class="demo-state">当前：{{ picked }}</span>
  </elf-playground>
`);

export { PageRadioEx2 };
