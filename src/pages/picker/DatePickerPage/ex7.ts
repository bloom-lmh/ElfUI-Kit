import { defineHtml, defineStyle, useComputed, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const start = useRef("2026-07-08");
const end = useRef("2026-08-18");
const dualPanel = useRef(true);
const unlinkPanels = useRef(true);
const weekNumbers = useRef(true);
const singlePanel = useComputed(() => !dualPanel.value);
const t = createDocsTranslator({
  title: { zh: "双面板与高级定位", en: "Dual panels and advanced positioning" },
  controls: { zh: "面板配置", en: "Panel configuration" },
  dualPanel: { zh: "双面板", en: "Dual panels" },
  unlinkPanels: { zh: "独立翻月", en: "Unlinked navigation" },
  weekNumbers: { zh: "显示周序号", en: "Show week numbers" },
  selected: { zh: "已选范围", en: "Selected range" },
  to: { zh: "至", en: "to" },
});
const pick = createDocsPicker();

const updateStart = (event: CustomEvent<string>): void => start.set(event.detail || "");
const updateEnd = (event: CustomEvent<string>): void => end.set(event.detail || "");
const updateDualPanel = (event: CustomEvent<boolean>): void => dualPanel.set(Boolean(event.detail));
const updateUnlinkPanels = (event: CustomEvent<boolean>): void =>
  unlinkPanels.set(Boolean(event.detail));
const updateWeekNumbers = (event: CustomEvent<boolean>): void =>
  weekNumbers.set(Boolean(event.detail));
const releaseCell = (date: Date): string =>
  [8, 18, 26].includes(date.getDate()) ? "is-release-day" : "";

const code = () =>
  pick(
    `<elf-date-picker
  range
  :singlePanel.prop="!dualPanel"
  :unlinkPanels.prop="unlinkPanels"
  :showWeekNumber.prop="weekNumbers"
  default-value="2026-07-01"
  :cellClassName.prop="releaseCell"
  :fallbackPlacements.prop="['top-start', 'bottom-end']"
  :popperOptions.prop="{ offset: [0, 10], padding: 12 }"
  :modelValue.prop="start"
  :endValue.prop="end"
  @update:modelValue="updateStart"
  @update:endValue="updateEnd"
>
  <span slot="range-separator">至</span>
  <span slot="prev-month">←</span>
  <span slot="next-month">→</span>
</elf-date-picker>`,
    `<elf-date-picker
  range
  :singlePanel.prop="!dualPanel"
  :unlinkPanels.prop="unlinkPanels"
  :showWeekNumber.prop="weekNumbers"
  default-value="2026-07-01"
  :cellClassName.prop="releaseCell"
  :fallbackPlacements.prop="['top-start', 'bottom-end']"
  :popperOptions.prop="{ offset: [0, 10], padding: 12 }"
  :modelValue.prop="start"
  :endValue.prop="end"
  @update:modelValue="updateStart"
  @update:endValue="updateEnd"
>
  <span slot="range-separator">to</span>
  <span slot="prev-month">←</span>
  <span slot="next-month">→</span>
</elf-date-picker>`,
  );

const script = `const start = useRef("2026-07-08");
const end = useRef("2026-08-18");
const dualPanel = useRef(true);
const unlinkPanels = useRef(true);
const weekNumbers = useRef(true);

const releaseCell = (date) => [8, 18, 26].includes(date.getDate()) ? "is-release-day" : "";
const updateStart = (event) => start.set(event.detail || "");
const updateEnd = (event) => end.set(event.detail || "");`;

defineStyle(demoStyles);

const PageDatePickerEx7 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div class="date-picker-demo-stage">
      <elf-date-picker
        class="date-picker-demo-control date-picker-demo-control--dual"
        range
        :singlePanel.prop=${singlePanel}
        :unlinkPanels.prop=${unlinkPanels}
        :showWeekNumber.prop=${weekNumbers}
        default-value="2026-07-01"
        :cellClassName.prop=${releaseCell}
        :fallbackPlacements.prop=${["top-start", "bottom-end"]}
        :popperOptions.prop=${{ offset: [0, 10], padding: 12 }}
        :modelValue.prop=${start}
        :endValue.prop=${end}
        @update:modelValue=${updateStart}
        @update:endValue=${updateEnd}
      >
        <span slot="range-separator">${t("to")}</span>
        <span slot="prev-month">←</span>
        <span slot="next-month">→</span>
      </elf-date-picker>
    </div>
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${t("selected")} · ${start} ${t("to")} ${end}
    </span>
    <aside slot="controls" class="date-picker-demo-controls" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <label>
        <span>${t("dualPanel")}</span>
        <elf-switch :modelValue.prop=${dualPanel} @update:modelValue=${updateDualPanel}></elf-switch>
      </label>
      <label>
        <span>${t("unlinkPanels")}</span>
        <elf-switch :modelValue.prop=${unlinkPanels} @update:modelValue=${updateUnlinkPanels}></elf-switch>
      </label>
      <label>
        <span>${t("weekNumbers")}</span>
        <elf-switch :modelValue.prop=${weekNumbers} @update:modelValue=${updateWeekNumbers}></elf-switch>
      </label>
    </aside>
  </elf-playground>
`);

export { PageDatePickerEx7 };
