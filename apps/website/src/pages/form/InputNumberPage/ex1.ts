import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const count = useRef(2);
const t = createDocsTranslator({
  heading: { zh: "基础", en: "Basics" },
  title: { zh: "受控数字输入", en: "Controlled number input" },
  quantity: { zh: "数量", en: "Quantity" },
});
const code = `<elf-input-number variant="outlined" label="Quantity" :modelValue.prop=${count} min="0" max="10" />`;
const script = `const count = useRef(2);
const onCountUpdate = (event) => count.set(event.detail ?? 0);`;
const onCountUpdate = (event: CustomEvent): void => count.set(Number(event.detail ?? 0));

const PageInputNumberEx1 = defineHtml(`
  <h2>${t("heading")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <elf-input-number variant="outlined" :label=${t("quantity")} :modelValue=${count.value} min="0" max="10" @update:modelValue=${onCountUpdate}></elf-input-number>
    <span slot="status" class="demo-state">${t("quantity")}：${count.value}</span>
  </elf-playground>
`);

export { PageInputNumberEx1 };
