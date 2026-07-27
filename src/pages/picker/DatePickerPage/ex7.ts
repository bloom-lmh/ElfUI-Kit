import { defineHtml, useRef } from "@elfui/core";

const start = useRef("2026-07-08");
const end = useRef("2026-08-18");
const updateStart = (event: CustomEvent<string>): void => start.set(event.detail || "");
const updateEnd = (event: CustomEvent<string>): void => end.set(event.detail || "");
const releaseCell = (date: Date): string => [8, 18, 26].includes(date.getDate()) ? "is-release-day" : "";

const code = `<elf-date-picker
  range
  :singlePanel="false"
  unlink-panels
  show-week-number
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
</elf-date-picker>`;

const script = `const start = useRef("2026-07-08");
const end = useRef("2026-08-18");
const releaseCell = (date) => [8, 18, 26].includes(date.getDate()) ? "is-release-day" : "";
const updateStart = (event) => start.set(event.detail);
const updateEnd = (event) => end.set(event.detail);`;

const PageDatePickerEx7 = defineHtml(`
  <elf-playground title="双面板与高级定位" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">独立翻月 · 周序号 · 自定义导航</span>
    <div style="width:min(100%,440px)">
      <elf-date-picker
        range
        :singlePanel=${false}
        unlink-panels
        show-week-number
        default-value="2026-07-01"
        :cellClassName.prop=${releaseCell}
        :fallbackPlacements.prop=${["top-start", "bottom-end"]}
        :popperOptions.prop=${{ offset: [0, 10], padding: 12 }}
        :modelValue.prop=${start}
        :endValue.prop=${end}
        @update:modelValue=${updateStart}
        @update:endValue=${updateEnd}
      >
        <span slot="range-separator">至</span>
        <span slot="prev-month">←</span>
        <span slot="next-month">→</span>
      </elf-date-picker>
    </div>
  </elf-playground>
`);

export { PageDatePickerEx7 };
