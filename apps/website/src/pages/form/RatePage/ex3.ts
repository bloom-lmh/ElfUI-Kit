import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "自定义符号与只读状态", en: "Custom characters and read-only state" },
});

const mood = useRef(4);

const customCode = `<elf-rate
  :modelValue.prop=\${mood.value}
  character="♥"
  void-character="♡"
  color="#d81b60"
  void-color="#f8bbd0"
  @update:modelValue=\${onMood}
></elf-rate>
<elf-rate model-value="4" readonly show-score score-template="{value} / 5"></elf-rate>`;

const customScript = `const mood = useRef(4);
const onMood = (event) => mood.set(Number(event.detail));`;

const onMood = (event: CustomEvent): void => {
  mood.set(Number(event.detail));
};

const PageRateEx3 = defineHtml(`
<elf-playground :title=${t("title")} :code=${customCode} :script=${customScript}>
      <div style="display:grid;gap:12px">
        <elf-rate
          :modelValue.prop=${mood.value}
          character="♥"
          void-character="♡"
          color="#d81b60"
          void-color="#f8bbd0"
          @update:modelValue=${onMood}
        ></elf-rate>
        <elf-rate model-value="4" readonly show-score score-template="{value} / 5"></elf-rate>
      </div>
    </elf-playground>
`);

export { PageRateEx3 };
