import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "按钮风格", en: "Button style" },
  optionX: { zh: "选项 X", en: "Option X" },
  optionY: { zh: "选项 Y", en: "Option Y" },
  optionZ: { zh: "选项 Z", en: "Option Z" },
  current: { zh: "当前", en: "Current" },
});

const picked = useRef("x");

const onUpdate = (event: CustomEvent): void => picked.set(String(event.detail));

const code = `<elf-radio-group
  :modelValue.prop=\${picked.value}
  variant="button"
  fill="#7c3aed"
  text-color="#fff"
  @update:modelValue=\${onUpdate}
>
  <elf-radio value="x" label="${t("optionX")}" />
  <elf-radio value="y" label="${t("optionY")}" />
  <elf-radio value="z" label="${t("optionZ")}" />
</elf-radio-group>`;

const script = `const picked = useRef("x");
const onUpdate = (event) => picked.set(String(event.detail));`;

const PageRadioEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <elf-radio-group
      :modelValue.prop=${picked.value}
      variant="button"
      fill="#7c3aed"
      text-color="#fff"
      @update:modelValue=${onUpdate}
    >
      <elf-radio value="x" :label=${t("optionX")}></elf-radio>
      <elf-radio value="y" :label=${t("optionY")}></elf-radio>
      <elf-radio value="z" :label=${t("optionZ")}></elf-radio>
    </elf-radio-group>
    <span slot="status" class="demo-state">${t("current")}：{{ picked }}</span>
  </elf-playground>
`);

export { PageRadioEx2 };
