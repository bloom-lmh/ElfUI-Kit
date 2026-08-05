import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "交互悬停", en: "Interactive hover" },
  downloads: { zh: "每周下载量", en: "Weekly Downloads" },
  lastWeek: { zh: "最近一周", en: "Last week" },
});

const weeklyValues = [28410, 32750, 30210, 36180, 34890, 40230, 38560, 43120];
const downloadGradient = [
  "var(--elf-primary)",
  "color-mix(in srgb, var(--elf-primary) 10%, transparent)",
];
const weekRanges = [
  "3/1 – 3/7",
  "3/8 – 3/14",
  "3/15 – 3/21",
  "3/22 – 3/28",
  "3/29 – 4/4",
  "4/5 – 4/11",
  "4/12 – 4/18",
  "4/19 – 4/25",
];
const hoveredIndex = useRef<number | null>(null);

const hoveredWeek = (): string =>
  hoveredIndex.value == null ? t("lastWeek") : (weekRanges[hoveredIndex.value] ?? "");
const hoveredValue = (): string => {
  const index = hoveredIndex.value ?? weeklyValues.length - 1;
  return String(weeklyValues[index] ?? weeklyValues.at(-1) ?? 0).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ",",
  );
};
const onIndex = (event: CustomEvent): void => {
  hoveredIndex.set((event.detail as number | null) ?? null);
};

const code = `<elf-card variant="outlined" class="sparkline-downloads">
  <div slot="header" class="sparkline-downloads-head">
    <div class="sparkline-downloads-title">
      <strong>Weekly Downloads</strong>
      <span>{{ hoveredWeek }}</span>
    </div>
  </div>
  <div class="sparkline-downloads-body">
    <strong class="sparkline-downloads-value">{{ hoveredValue }}</strong>
    <elf-sparkline
      :model-value.prop="weeklyValues"
      fill
      :gradient.prop="['var(--elf-primary)', 'color-mix(in srgb, var(--elf-primary) 10%, transparent)']"
      min="0"
      padding="6"
      smooth="2"
      line-width="1.5"
      marker-size="12"
      marker-stroke="var(--elf-bg-paper)"
      interactive
      @update:current-index="hoveredIndex = $event.detail"
    />
  </div>
</elf-card>`;

defineStyle(styles);

const PageSparklineEx4 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code}>
    <elf-card variant="outlined" class="sparkline-downloads">
      <div slot="header" class="sparkline-downloads-head">
        <div class="sparkline-downloads-title">
          <strong>${t("downloads")}</strong>
          <span>${hoveredWeek()}</span>
        </div>
      </div>
      <div class="sparkline-downloads-body">
        <strong class="sparkline-downloads-value">${hoveredValue()}</strong>
        <div class="sparkline-downloads-chart">
          <elf-sparkline :modelValue.prop=${weeklyValues} fill :gradient.prop=${downloadGradient} min="0" padding="6" smooth="2" line-width="1.5" marker-size="12" marker-stroke="var(--elf-bg-paper)" interactive @update:currentIndex=${onIndex} :aria-label=${t("downloads")}></elf-sparkline>
        </div>
      </div>
    </elf-card>
  </elf-playground>
`);

export { PageSparklineEx4 };
