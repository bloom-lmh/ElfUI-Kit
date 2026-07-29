import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "禁用状态", en: "Disabled state" },
  aria: { zh: "禁用选项", en: "Disabled options" },
});

const picked = useRef("a");

const code = `<elf-radio-group :modelValue.prop=\${picked.value} disabled aria-label="${t("aria")}">
  <elf-radio value="a" label="A" />
  <elf-radio value="b" label="B" />
</elf-radio-group>`;

const script = `const picked = useRef("a");`;

const PageRadioEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <elf-radio-group :modelValue.prop=${picked.value} disabled :aria-label=${t("aria")}>
      <elf-radio value="a" label="A"></elf-radio>
      <elf-radio value="b" label="B"></elf-radio>
    </elf-radio-group>
  </elf-playground>
`);

export { PageRadioEx3 };
