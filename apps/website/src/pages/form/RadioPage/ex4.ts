import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "声明式选项与字段映射", en: "Declarative options and field mapping" },
  standard: { zh: "标准配送", en: "Standard delivery" },
  express: { zh: "次日达", en: "Next-day delivery" },
  concierge: { zh: "专人配送", en: "Concierge delivery" },
  method: { zh: "配送方式", en: "Delivery method" },
});

const delivery = useRef("standard");
const deliveryOptions = [
  { text: t("standard"), code: "standard" },
  { text: t("express"), code: "express" },
  { text: t("concierge"), code: "concierge", locked: true },
];
const optionProps = { label: "text", value: "code", disabled: "locked" };

const onUpdate = (event: CustomEvent): void => delivery.set(String(event.detail));

const code = `<elf-radio-group
  :modelValue.prop=\${delivery.value}
  :options.prop=\${deliveryOptions}
  :props.prop=\${optionProps}
  variant="button"
  @update:modelValue=\${onUpdate}
/>`;

const script = `const delivery = useRef("standard");
const deliveryOptions = [
  { text: "${t("standard")}", code: "standard" },
  { text: "${t("express")}", code: "express" },
  { text: "${t("concierge")}", code: "concierge", locked: true }
];
const optionProps = { label: "text", value: "code", disabled: "locked" };
const onUpdate = (event) => delivery.set(String(event.detail));`;

const PageRadioEx4 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <elf-radio-group
      :modelValue.prop=${delivery.value}
      :options.prop=${deliveryOptions}
      :props.prop=${optionProps}
      variant="button"
      @update:modelValue=${onUpdate}
    ></elf-radio-group>
    <span slot="status" class="demo-state">${t("method")}：{{ delivery }}</span>
  </elf-playground>
`);

export { PageRadioEx4 };
