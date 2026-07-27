import { defineHtml, useRef } from "@elfui/core";

const picked = useRef("a");

const code = `<elf-radio-group :modelValue.prop=\${picked.value} disabled aria-label="禁用选项">
  <elf-radio value="a" label="A" />
  <elf-radio value="b" label="B" />
</elf-radio-group>`;

const script = `const picked = useRef("a");`;

const PageRadioEx3 = defineHtml(`
  <elf-playground title="禁用" :code=${code} :script=${script}>
    <elf-radio-group :modelValue.prop=${picked.value} disabled aria-label="禁用选项">
      <elf-radio value="a" label="A"></elf-radio>
      <elf-radio value="b" label="B"></elf-radio>
    </elf-radio-group>
  </elf-playground>
`);

export { PageRadioEx3 };
