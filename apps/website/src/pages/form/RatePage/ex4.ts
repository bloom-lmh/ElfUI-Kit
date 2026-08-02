import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "分段颜色与图标", en: "Segmented colors and icons" },
  aria: { zh: "满意度评分", en: "Satisfaction rating" },
});

const palette = ["#ef4444", "#f59e0b", "#22c55e"];

const rateIcons = ["😞", "😐", "😊"];

const code = `<elf-rate
  model-value="4"
  :colors.prop=\${palette}
  :icons.prop=\${rateIcons}
  void-icon="0"
  low-threshold="2"
  high-threshold="4"
  aria-label="${t("aria")}"
></elf-rate>`;

const script = `const palette = ["#ef4444", "#f59e0b", "#22c55e"];
const rateIcons = ["😞", "😐", "😊"];`;

const PageRateEx4 = defineHtml(`
<elf-playground :title=${t("title")} :code=${code} :script=${script}>
      <div style="display:grid;gap:12px">
        <elf-rate
          model-value="4"
          :colors.prop=${palette}
          :icons.prop=${rateIcons}
          void-icon="0"
          low-threshold="2"
          high-threshold="4"
          :aria-label=${t("aria")}
        ></elf-rate>
        <elf-rate model-value="2" disabled-void-icon="-" readonly></elf-rate>
      </div>
    </elf-playground>
`);

export { PageRateEx4 };
