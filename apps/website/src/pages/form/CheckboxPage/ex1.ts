import { defineHtml, useRef } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const p = createDocsPicker();
const agreed = useRef(false);

const onUpdate = (event: CustomEvent): void => agreed.set(Boolean(event.detail));
const agreementStatus = (): string =>
  agreed.value ? p("✓ 已勾选", "✓ Checked") : p("未勾选", "Not checked");

const code = `<elf-checkbox
  :modelValue.prop=\${agreed.value}
  label="${p("同意条款", "Accept the terms")}"
  @update:modelValue=\${onUpdate}
/>
<span slot="status">{{ agreed ? '${p("✓ 已勾选", "✓ Checked")}' : '${p("未勾选", "Not checked")}' }}</span>`;

const script = `const agreed = useRef(false);
const onUpdate = (event) => agreed.set(Boolean(event.detail));`;

const PageCheckboxEx1 = defineHtml(`
  <elf-playground :title=${p("单个复选框", "Standalone checkbox")} :code=${code} :script=${script}>
    <elf-checkbox
      :modelValue.prop=${agreed.value}
      :label=${p("同意条款", "Accept the terms")}
      @update:modelValue=${onUpdate}
    ></elf-checkbox>
    <span slot="status" class="demo-state">${agreementStatus()}</span>
  </elf-playground>
`);

export { PageCheckboxEx1 };
