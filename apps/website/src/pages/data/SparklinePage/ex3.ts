import { defineHtml, defineStyle } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "仪表盘卡片与标签", en: "Dashboard cards with labels" },
  revenue: { zh: "本月收入", en: "Monthly revenue" },
  users: { zh: "活跃用户", en: "Active users" },
  conversion: { zh: "转化率", en: "Conversion rate" },
  orders: { zh: "新增订单", en: "New orders" },
  revenueValue: { zh: "¥128.4k", en: "$128.4k" },
  usersValue: { zh: "86.2k", en: "86.2k" },
  conversionValue: { zh: "3.6%", en: "3.6%" },
  ordersValue: { zh: "1,284", en: "1,284" },
  mon: { zh: "周一", en: "Mon" },
  tue: { zh: "周二", en: "Tue" },
  wed: { zh: "周三", en: "Wed" },
  thu: { zh: "周四", en: "Thu" },
  fri: { zh: "周五", en: "Fri" },
  sat: { zh: "周六", en: "Sat" },
  sun: { zh: "周日", en: "Sun" },
});

const revenue = [18, 24, 31, 38];
const users = [32, 48, 41, 56, 49, 63, 58];
const conversion = [2.4, 2.8, 3.1, 3.6];
const orders = [42, 68, 55, 89, 74, 106, 92];
const weeks = ["W1", "W2", "W3", "W4"];
const quarters = ["Q1", "Q2", "Q3", "Q4"];
const weekDays = [t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat"), t("sun")];
const areaGradient = [
  "var(--elf-primary)",
  "color-mix(in srgb, var(--elf-primary) 12%, transparent)",
];
const lineGradient = ["var(--elf-primary)", "var(--elf-success)"];

const code = `<elf-card variant="outlined">
  <div slot="header" class="metric-card-head">
    <div>
      <span class="metric-label">Monthly revenue</span>
      <strong class="metric-value">$128.4k</strong>
    </div>
    <span class="metric-delta">+12.4%</span>
  </div>
  <elf-sparkline
    :model-value.prop="revenue"
    fill
    :gradient.prop="['var(--elf-primary)', 'color-mix(in srgb, var(--elf-primary) 12%, transparent)']"
    :labels.prop="weeks"
    show-labels
    label-size="10"
    :smooth="4"
    auto-draw="once"
  />
</elf-card>`;

defineStyle(styles);

const PageSparklineEx3 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code}>
    <div class="sparkline-dashboard">
      <elf-card variant="outlined" class="metric-card">
        <div slot="header" class="metric-card-head">
          <div>
            <span class="metric-label">${t("revenue")}</span>
            <strong class="metric-value">${t("revenueValue")}</strong>
          </div>
          <span class="sparkline-delta">+12.4%</span>
        </div>
        <div class="metric-card-chart">
          <elf-sparkline :modelValue.prop=${revenue} fill :gradient.prop=${areaGradient} :labels.prop=${weeks} show-labels label-size="10" smooth="4" auto-draw="once" :aria-label=${t("revenue")}></elf-sparkline>
        </div>
      </elf-card>

      <elf-card variant="outlined" class="metric-card">
        <div slot="header" class="metric-card-head">
          <div>
            <span class="metric-label">${t("users")}</span>
            <strong class="metric-value">${t("usersValue")}</strong>
          </div>
          <span class="sparkline-delta">+8.1%</span>
        </div>
        <div class="metric-card-chart">
          <elf-sparkline :modelValue.prop=${users} type="bar" :gradient.prop=${areaGradient} :labels.prop=${weekDays} show-labels label-size="9" auto-line-width smooth="3" auto-draw="once" :aria-label=${t("users")}></elf-sparkline>
        </div>
      </elf-card>

      <elf-card variant="outlined" class="metric-card">
        <div slot="header" class="metric-card-head">
          <div>
            <span class="metric-label">${t("conversion")}</span>
            <strong class="metric-value">${t("conversionValue")}</strong>
          </div>
          <span class="sparkline-delta down">-0.2%</span>
        </div>
        <div class="metric-card-chart">
          <elf-sparkline :modelValue.prop=${conversion} :gradient.prop=${lineGradient} :labels.prop=${quarters} show-labels label-size="10" smooth="4" line-width="2.5" auto-draw="once" :aria-label=${t("conversion")}></elf-sparkline>
        </div>
      </elf-card>

      <elf-card variant="outlined" class="metric-card">
        <div slot="header" class="metric-card-head">
          <div>
            <span class="metric-label">${t("orders")}</span>
            <strong class="metric-value">${t("ordersValue")}</strong>
          </div>
          <span class="sparkline-delta">+21.6%</span>
        </div>
        <div class="metric-card-chart">
          <elf-sparkline :modelValue.prop=${orders} type="bar" :gradient.prop=${lineGradient} gradient-direction="left" :labels.prop=${weekDays} show-labels label-size="9" auto-line-width smooth="3" auto-draw="once" :aria-label=${t("orders")}></elf-sparkline>
        </div>
      </elf-card>
    </div>
  </elf-playground>
`);

export { PageSparklineEx3 };
