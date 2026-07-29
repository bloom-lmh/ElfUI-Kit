import { defineHtml, useRef } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const p = createDocsPicker();
const fruits = useRef<string[]>(["apple"]);

const onUpdate = (event: CustomEvent): void => fruits.set([...(event.detail as string[])]);

const code = `<elf-checkbox-group
  :modelValue.prop=\${fruits.value}
  min="1"
  max="2"
  @update:modelValue=\${onUpdate}
>
  <elf-checkbox value="apple" label="${p("苹果", "Apple")}" />
  <elf-checkbox value="banana" label="${p("香蕉", "Banana")}" />
  <elf-checkbox value="orange" label="${p("橙子", "Orange")}" />
</elf-checkbox-group>`;

const script = `const fruits = useRef(["apple"]);
const onUpdate = (event) => fruits.set([...event.detail]);`;

const PageCheckboxEx3 = defineHtml(`
  <elf-playground :title=${p("选择数量限制", "Selection limits")} :code=${code} :script=${script}>
    <elf-checkbox-group
      :modelValue.prop=${fruits.value}
      min="1"
      max="2"
      @update:modelValue=${onUpdate}
    >
      <elf-checkbox value="apple" :label=${p("苹果", "Apple")}></elf-checkbox>
      <elf-checkbox value="banana" :label=${p("香蕉", "Banana")}></elf-checkbox>
      <elf-checkbox value="orange" :label=${p("橙子", "Orange")}></elf-checkbox>
    </elf-checkbox-group>
    <span slot="status" class="demo-state">${p("已选值", "Selected values")}: {{ fruits.join(', ') }}</span>
  </elf-playground>
`);

export { PageCheckboxEx3 };
