import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "范围、步进、刻度与间断点", en: "Range, steps, marks, and stops" },
  interval: { zh: "区间", en: "Range" }
});
const value = useRef<[number, number]>([20, 72]);

const marks = [
  { value: 0, label: "0" },
  { value: 50, label: "50" },
  { value: 100, label: "100" }
];

const onChange = (event: CustomEvent): void => {
  const next = event.detail as [number, number];
  value.set([Number(next[0]), Number(next[1])]);
};

const code = `<elf-slider
  range
  show-stops
  step="10"
  :marks.prop=\${marks}
  :modelValue.prop=\${value.value}
  @update:modelValue=\${onChange}
/>`;

const script = `const value = useRef<[number, number]>([20, 72]);
const marks = [
  { value: 0, label: "0" },
  { value: 50, label: "50" },
  { value: 100, label: "100" }
];

const onChange = (event: CustomEvent<[number, number]>): void => {
  value.set(event.detail);
};`;

const PageSliderEx2 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="display:grid;gap:14px;width:100%;max-width:720px">
      <elf-slider
        range
        show-stops
        step="10"
        :marks.prop=${marks}
        :modelValue.prop=${value.value}
        @update:modelValue=${onChange}
      ></elf-slider>
      <p slot="status" class="demo-state">${t("interval")}: {{ value[0] }} - {{ value[1] }}</p>
    </div>
  </elf-playground>
`);

export { PageSliderEx2 };
