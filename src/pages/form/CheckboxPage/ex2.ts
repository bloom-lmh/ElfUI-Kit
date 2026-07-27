import { defineHtml, useRef } from "@elfui/core";

const cities = useRef<string[]>(["beijing", "shanghai"]);

const onUpdate = (event: CustomEvent): void => cities.set([...(event.detail as string[])]);

const code = `<elf-checkbox-group
  :modelValue.prop=\${cities.value}
  @update:modelValue=\${onUpdate}
>
  <elf-checkbox value="beijing" label="北京" />
  <elf-checkbox value="shanghai" label="上海" />
  <elf-checkbox value="guangzhou" label="广州" />
</elf-checkbox-group>`;

const script = `const cities = useRef(["beijing", "shanghai"]);
const onUpdate = (event) => cities.set([...event.detail]);`;

const PageCheckboxEx2 = defineHtml(`
  <elf-playground title="CheckboxGroup" :code=${code} :script=${script}>
    <elf-checkbox-group :modelValue.prop=${cities.value} @update:modelValue=${onUpdate}>
      <elf-checkbox value="beijing" label="北京"></elf-checkbox>
      <elf-checkbox value="shanghai" label="上海"></elf-checkbox>
      <elf-checkbox value="guangzhou" label="广州"></elf-checkbox>
    </elf-checkbox-group>
    <span slot="status" class="demo-state">选中：{{ cities.join(', ') }}</span>
  </elf-playground>
`);

export { PageCheckboxEx2 };
