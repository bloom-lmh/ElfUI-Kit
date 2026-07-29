import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "单选组组合", en: "Radio-group composition" },
  aria: { zh: "选择一个选项", en: "Choose one option" },
  optionA: { zh: "选项 A", en: "Option A" },
  optionB: { zh: "选项 B", en: "Option B" },
  optionC: { zh: "选项 C", en: "Option C" },
  current: { zh: "当前", en: "Current" },
});

const picked = useRef("a");

const onUpdate = (event: CustomEvent): void => picked.set(String(event.detail));

const code = `<elf-radio-group
  :modelValue.prop=\${picked.value}
  name="radio-demo"
  aria-label="${t("aria")}"
  @update:modelValue=\${onUpdate}
>
  <elf-radio value="a" label="${t("optionA")}" />
  <elf-radio value="b" label="${t("optionB")}" />
  <elf-radio value="c" label="${t("optionC")}" />
</elf-radio-group>
<span slot="status">${t("current")}：{{ picked }}</span>`;

const script = `const picked = useRef("a");
const onUpdate = (event) => picked.set(String(event.detail));`;

const PageRadioEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <elf-radio-group
      :modelValue.prop=${picked.value}
      name="radio-demo"
      :aria-label=${t("aria")}
      @update:modelValue=${onUpdate}
    >
      <elf-radio value="a" :label=${t("optionA")}></elf-radio>
      <elf-radio value="b" :label=${t("optionB")}></elf-radio>
      <elf-radio value="c" :label=${t("optionC")}></elf-radio>
    </elf-radio-group>
    <span slot="status" class="demo-state">${t("current")}：{{ picked }}</span>
  </elf-playground>
`);

export { PageRadioEx1 };
