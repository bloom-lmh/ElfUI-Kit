import { defineHtml, defineStyle } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "自定义标签", en: "Custom labels" },
  sales: { zh: "最近 24 小时销售额", en: "Sales Last 24h" },
  report: { zh: "查看报表", en: "Go to Report" },
});
const pick = createDocsPicker();
const currency = pick("¥", "$");

const sales = [423, 446, 675, 510, 590, 610, 760];
const salesLabels = (): string[] => sales.map((value) => `${currency}${value}`);

const code = `<elf-card class="sparkline-sales">
  <div class="sparkline-sales-body">
    <div class="sparkline-sales-chart">
      <elf-sparkline
        :model-value.prop="sales"
        :labels.prop="salesLabels"
        show-labels
        label-size="10"
        color="rgb(255 255 255 / 78%)"
        padding="24"
        stroke-linecap="round"
        smooth="8"
      />
    </div>
    <strong class="sparkline-sales-title">Sales Last 24h</strong>
  </div>
  <div class="sparkline-sales-foot">
    <elf-button block variant="text">Go to Report</elf-button>
  </div>
</elf-card>`;

defineStyle(styles);

const PageSparklineEx6 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code}>
    <elf-card class="sparkline-sales">
      <div class="sparkline-sales-body">
        <div class="sparkline-sales-chart">
          <elf-sparkline :modelValue.prop=${sales} :labels.prop=${salesLabels()} show-labels label-size="10" color="rgb(255 255 255 / 78%)" padding="24" stroke-linecap="round" smooth="8" :aria-label=${t("sales")}></elf-sparkline>
        </div>
        <strong class="sparkline-sales-title">${t("sales")}</strong>
      </div>
      <div class="sparkline-sales-foot">
        <elf-button block variant="text" :aria-label=${t("report")}>${t("report")}</elf-button>
      </div>
    </elf-card>
  </elf-playground>
`);

export { PageSparklineEx6 };
