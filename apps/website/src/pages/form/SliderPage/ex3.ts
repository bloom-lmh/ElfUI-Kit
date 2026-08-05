import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "数字输入与颜色", en: "Numeric input and color" },
  ratio: { zh: "比例", en: "Ratio" },
});
const value = useRef(64);

const format = (next: number): string => `${next}%`;

const onChange = (event: CustomEvent): void => {
  value.set(Number(event.detail));
};

const code = `<elf-slider
  show-input
  color="#006a6a"
  :formatTooltip.prop=\${format}
  :modelValue.prop=\${value.value}
  @update:modelValue=\${onChange}
/>`;

const script = `const value = useRef(64);
const format = (next: number): string => \`\${next}%\`;

const onChange = (event: CustomEvent<number>): void => {
  value.set(Number(event.detail));
};`;

const PageSliderEx3 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="display:grid;gap:14px;width:100%;max-width:720px">
      <elf-slider
        show-input
        color="#006a6a"
        :formatTooltip.prop=${format}
        :modelValue.prop=${value.value}
        @update:modelValue=${onChange}
      ></elf-slider>
      <p slot="status" class="demo-state">${t("ratio")}: {{ value }}%</p>
    </div>
  </elf-playground>
`);

export { PageSliderEx3 };
