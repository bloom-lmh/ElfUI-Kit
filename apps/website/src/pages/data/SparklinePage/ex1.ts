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
});

const period = useRef<Period>("weekly");
const series: Record<Period, number[]> = {
  weekly: [32, 58, 41, 72, 49, 84, 66, 92, 70, 105, 88, 124],
  monthly: [48, 72, 62, 98, 84, 118, 91, 132, 108, 148, 126, 166],
  quarterly: [72, 96, 82, 128, 102, 148, 132, 172, 151, 194, 176, 218],
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
const code = `<elf-sparkline
  :modelValue.prop="series[period]"
  auto-draw="once"
  auto-draw-duration="800"
  color="var(--elf-primary)"
  line-width="2"
  smooth="4"
  stroke-linecap="round"
  animation
/>`;

defineStyle(styles);

const PageSparklineEx1 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code}>
    <section class="sparkline-card">
      <h3>${t("pageViews")}</h3>
      <div class="sparkline-chart">
        <elf-sparkline :modelValue.prop=${series[period.value]} auto-draw="once" :autoDrawDuration=${800} color="var(--elf-primary)" :lineWidth=${2} :smooth=${4} stroke-linecap="round" animation :aria-label=${t("pageViews")}></elf-sparkline>
      </div>
      <elf-segmented class="sparkline-periods" block :aria-label=${t("title")} :options.prop=${periodOptions()} :modelValue.prop=${period.value} @update:modelValue=${selectPeriod}></elf-segmented>
    </section>
  </elf-playground>
`);

export { PageSparklineEx1 };
