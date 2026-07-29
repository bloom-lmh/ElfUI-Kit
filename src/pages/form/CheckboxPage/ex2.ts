import { defineHtml, useRef } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const p = createDocsPicker();
const cities = useRef<string[]>(["beijing", "shanghai"]);

const onUpdate = (event: CustomEvent): void => cities.set([...(event.detail as string[])]);

const code = `<elf-checkbox-group
  :modelValue.prop=\${cities.value}
  @update:modelValue=\${onUpdate}
>
  <elf-checkbox value="beijing" label="${p("北京", "Beijing")}" />
  <elf-checkbox value="shanghai" label="${p("上海", "Shanghai")}" />
  <elf-checkbox value="guangzhou" label="${p("广州", "Guangzhou")}" />
</elf-checkbox-group>`;

const script = `const cities = useRef(["beijing", "shanghai"]);
const onUpdate = (event) => cities.set([...event.detail]);`;

const PageCheckboxEx2 = defineHtml(`
  <elf-playground :title=${p("复选框组", "Checkbox group")} :code=${code} :script=${script}>
    <elf-checkbox-group :modelValue.prop=${cities.value} @update:modelValue=${onUpdate}>
      <elf-checkbox value="beijing" :label=${p("北京", "Beijing")}></elf-checkbox>
      <elf-checkbox value="shanghai" :label=${p("上海", "Shanghai")}></elf-checkbox>
      <elf-checkbox value="guangzhou" :label=${p("广州", "Guangzhou")}></elf-checkbox>
    </elf-checkbox-group>
    <span slot="status" class="demo-state">${p("已选值", "Selected values")}: {{ cities.join(', ') }}</span>
  </elf-playground>
`);

export { PageCheckboxEx2 };
