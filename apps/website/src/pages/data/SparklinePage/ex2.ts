import { defineHtml, defineStyle } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "柱状迷你图", en: "Bar sparkline" },
  revenue: { zh: "本周营收", en: "This week's revenue" },
  total: { zh: "¥ 12.6k", en: "$12.6k" },
  delta: { zh: "较上周 +18.2%", en: "+18.2% vs last week" },
  average: { zh: "日均 ¥6.8k", en: "Daily avg $6.8k" },
  peak: { zh: "峰值 ¥9.4k", en: "Peak $9.4k" },
  mon: { zh: "周一", en: "Mon" },
  tue: { zh: "周二", en: "Tue" },
  wed: { zh: "周三", en: "Wed" },
  thu: { zh: "周四", en: "Thu" },
  fri: { zh: "周五", en: "Fri" },
  sat: { zh: "周六", en: "Sat" },
  sun: { zh: "周日", en: "Sun" },
});

const weeklyRevenue = [4.2, 6.8, 5.4, 8.1, 6.2, 9.4, 7.6];
const weekDays = [t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat"), t("sun")];
const primaryGradient = [
  "var(--elf-primary)",
  "color-mix(in srgb, var(--elf-primary) 28%, transparent)",
];

const code = `<elf-sparkline
  :model-value.prop="weeklyRevenue"
  type="bar"
  :gradient.prop="['var(--elf-primary)', 'color-mix(in srgb, var(--elf-primary) 28%, transparent)']"
  :labels.prop="weekDays"
  show-labels
  label-size="10"
  auto-line-width
  :smooth="3"
  auto-draw="once"
/>`;

defineStyle(styles);

const PageSparklineEx2 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code}>
    <section class="sparkline-metric">
      <header class="sparkline-metric-head">
        <div>
          <h3>${t("revenue")}</h3>
          <strong>${t("total")}</strong>
        </div>
        <span class="sparkline-delta">${t("delta")}</span>
      </header>
      <div class="sparkline-metric-chart">
        <elf-sparkline :modelValue.prop=${weeklyRevenue} type="bar" :gradient.prop=${primaryGradient} :labels.prop=${weekDays} show-labels label-size="10" auto-line-width smooth="3" auto-draw="once" :aria-label=${t("revenue")}></elf-sparkline>
      </div>
      <footer class="sparkline-metric-foot">
        <span>${t("average")}</span>
        <span>${t("peak")}</span>
      </footer>
    </section>
  </elf-playground>
`);

export { PageSparklineEx2 };
