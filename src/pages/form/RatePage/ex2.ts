import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "半星与分数", en: "Half values and scores" },
  score: { zh: "{value} 分", en: "{value} points" },
  current: { zh: "半星评分", en: "Half-value rating" },
});

const half = useRef(3.5);

const halfCode = `<elf-rate
  :modelValue.prop=\${half.value}
  allow-half
  show-score
  score-template="${t("score")}"
  @update:modelValue=\${onHalf}
></elf-rate>`;

const halfScript = `const half = useRef(3.5);
const onHalf = (event) => half.set(Number(event.detail));`;

const onHalf = (event: CustomEvent): void => {
  half.set(Number(event.detail));
};

const PageRateEx2 = defineHtml(`
<elf-playground :title=${t("title")} :code=${halfCode} :script=${halfScript}>
      <div style="display:grid;gap:12px">
        <elf-rate
          :modelValue.prop=${half.value}
          allow-half
          show-score
          :score-template=${t("score")}
          @update:modelValue=${onHalf}
        ></elf-rate>
        <span slot="status" class="demo-state">${t("current")}：{{ half }}</span>
      </div>
    </elf-playground>
`);

export { PageRateEx2 };
