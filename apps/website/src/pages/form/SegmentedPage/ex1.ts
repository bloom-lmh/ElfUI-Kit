import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "受控与禁用", en: "Controlled and disabled" },
  aria: { zh: "数据周期", en: "Data period" },
  today: { zh: "今日", en: "Today" },
  week: { zh: "本周", en: "This week" },
  month: { zh: "本月", en: "This month" },
  year: { zh: "全年", en: "Full year" },
  current: { zh: "当前", en: "Current" },
});

const period = useRef("day");

const periodOptions = [
  { label: t("today"), value: "day" },
  { label: t("week"), value: "week" },
  { label: t("month"), value: "month" },
  { label: t("year"), value: "year", disabled: true },
];

const code1 = `<elf-segmented
  name="period"
  aria-label="${t("aria")}"
  :options.prop="periodOptions"
  :modelValue.prop="period"
  @update:modelValue="onPeriodUpdate"
/>`;

const script1 = `const period = useRef("day");
const periodOptions = [
  { label: "${t("today")}", value: "day" },
  { label: "${t("week")}", value: "week" },
  { label: "${t("month")}", value: "month" },
  { label: "${t("year")}", value: "year", disabled: true }
];

const onPeriodUpdate = (event) => period.set(String(event.detail || ""));`;

const onPeriodUpdate = (event: CustomEvent): void => period.set(String(event.detail || ""));

const PageSegmentedEx1 = defineHtml(`
<elf-playground :title=${t("title")} :code=${code1} :script=${script1}>
            <elf-segmented
                name="period"
                :aria-label=${t("aria")}
                :options.prop=${periodOptions}
                :modelValue.prop=${period}
                @update:modelValue=${onPeriodUpdate}
            ></elf-segmented>
            <span slot="status" class="demo-state">${t("current")}：{{ period.value }}</span>
        </elf-playground>
`);

export { PageSegmentedEx1 };
