import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

type Period = "weekly" | "monthly" | "quarterly";

const t = createDocsTranslator({
  title: { zh: "动画", en: "Animation" },
  pageViews: { zh: "页面浏览量", en: "Page Views" },
  weekly: { zh: "每周", en: "Weekly" },
  monthly: { zh: "每月", en: "Monthly" },
  quarterly: { zh: "每季度", en: "Quarterly" },
  last7: { zh: "最近 7 天", en: "Last 7 days" },
  last12: { zh: "最近 12 个月", en: "Last 12 months" },
  last6: { zh: "最近 6 个季度", en: "Last 6 quarters" },
});

const period = useRef<Period>("monthly");
const series: Record<Period, number[]> = {
  weekly: [120, 340, 275, 410, 380, 295, 450],
  monthly: [640, 820, 550, 910, 770, 1050, 680, 1120, 860, 1240, 930, 1180],
  quarterly: [3100, 5800, 4200, 7600, 6100, 3800],
};

const periodLabel = (): string => {
  if (period.value === "weekly") return t("last7");
  if (period.value === "quarterly") return t("last6");
  return t("last12");
};

const periodOptions = (): Array<{ label: string; value: Period }> => [
  { label: t("weekly"), value: "weekly" },
  { label: t("monthly"), value: "monthly" },
  { label: t("quarterly"), value: "quarterly" },
];

const selectPeriod = (event: CustomEvent): void => {
  const next = String(event.detail || "") as Period;
  if (next in series) period.set(next);
};

const code = `<elf-card variant="outlined" density="comfortable" class="sparkline-pageviews">
  <div slot="header" class="sparkline-pageviews-head">
    <div class="sparkline-pageviews-copy">
      <h3>Page Views</h3>
      <span>Last 12 months</span>
    </div>
    <elf-segmented
      size="sm"
      :options.prop="periods"
      :model-value.prop="period"
      @update:model-value="changePeriod"
    />
  </div>
  <elf-sparkline
    :model-value.prop="series[period]"
    auto-draw="once"
    auto-draw-duration="800"
    color="var(--elf-primary)"
    line-width="2"
    smooth="4"
    stroke-linecap="round"
    animation
  />
</elf-card>`;

defineStyle(styles);

const PageSparklineEx1 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code}>
    <elf-card variant="outlined" density="comfortable" class="sparkline-pageviews">
      <div slot="header" class="sparkline-pageviews-head">
        <div class="sparkline-pageviews-copy">
          <h3>${t("pageViews")}</h3>
          <span>${periodLabel()}</span>
        </div>
        <elf-segmented class="sparkline-periods" size="sm" :options.prop=${periodOptions()} :modelValue.prop=${period.value} @update:modelValue=${selectPeriod} :aria-label=${t("title")}></elf-segmented>
      </div>
      <div class="sparkline-pageviews-chart">
        <elf-sparkline :modelValue.prop=${series[period.value]} auto-draw="once" auto-draw-duration="800" color="var(--elf-primary)" line-width="2" smooth="4" stroke-linecap="round" animation :aria-label=${t("pageViews")}></elf-sparkline>
      </div>
    </elf-card>
  </elf-playground>
`);

export { PageSparklineEx1 };
