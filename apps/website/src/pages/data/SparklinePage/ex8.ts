import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "支出与内嵌趋势", en: "Inset expenses" },
  expenses: { zh: "年初至今支出", en: "Expenses YTD" },
  hoverHint: { zh: "悬停查看明细", en: "Hover for details" },
  m1: { zh: "1月", en: "Jan" },
  m2: { zh: "2月", en: "Feb" },
  m3: { zh: "3月", en: "Mar" },
  m4: { zh: "4月", en: "Apr" },
  m5: { zh: "5月", en: "May" },
  m6: { zh: "6月", en: "Jun" },
  m7: { zh: "7月", en: "Jul" },
});
const pick = createDocsPicker();
const currency = pick("¥", "$");

const expenses = [7600, 5000, 5600, 9800, 2200, 7400, 6640];
const monthKeys = ["m1", "m2", "m3", "m4", "m5", "m6", "m7"] as const;
const expenseGradient = ["#00e5ff99", "#00e5ff11"];
const hoveredIndex = useRef<number | null>(null);

const total = expenses.reduce((sum, value) => sum + value, 0).toLocaleString();
const monthName = (index: number): string => t(monthKeys[index] ?? "m1");
const hoveredText = (): string => {
  if (hoveredIndex.value == null) return t("hoverHint");
  const value = expenses[hoveredIndex.value];
  return value == null
    ? t("hoverHint")
    : `${monthName(hoveredIndex.value)} · ${currency}${value.toLocaleString()}`;
};
const onExpenseHover = (event: CustomEvent): void => {
  hoveredIndex.set((event.detail as number | null) ?? null);
};

const code = `<elf-card class="sparkline-expenses">
  <div class="sparkline-expenses-head">
    <div>
      <span class="sparkline-expenses-kicker">Expenses YTD</span>
      <strong class="sparkline-expenses-total">$44,200</strong>
    </div>
    <span class="sparkline-expenses-hover">Hover for details</span>
  </div>
  <elf-sparkline
    :model-value.prop="expenses"
    :gradient.prop="['#00e5ff99', '#00e5ff11']"
    fill
    inset
    interactive
    show-markers
    marker-size="10"
    marker-stroke="#0b1220"
    min="0"
    line-width="1.5"
    smooth="2"
    auto-draw="once"
    @update:current-index="hoveredIndex = $event.detail"
  />
</elf-card>`;

defineStyle(styles);

const PageSparklineEx8 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code}>
    <elf-card class="sparkline-expenses">
      <div class="sparkline-expenses-head">
        <div>
          <span class="sparkline-expenses-kicker">${t("expenses")}</span>
          <strong class="sparkline-expenses-total">${currency}${total}</strong>
        </div>
        <span class="sparkline-expenses-hover">${hoveredText()}</span>
      </div>
      <div class="sparkline-expenses-chart">
        <elf-sparkline :modelValue.prop=${expenses} :gradient.prop=${expenseGradient} fill inset interactive show-markers marker-size="10" marker-stroke="#0b1220" min="0" line-width="1.5" smooth="2" auto-draw="once" :aria-label=${t("expenses")} @update:currentIndex=${onExpenseHover}></elf-sparkline>
      </div>
    </elf-card>
  </elf-playground>
`);

export { PageSparklineEx8 };
