import { defineHtml, defineStyle, useRef } from "@elfui/core";
import styles from "./demo.scss?inline";

const start = useRef("2026-06-01");

const end = useRef("2026-06-30");

const shortcuts = [
  { label: "今天", value: "2026-06-17" },
  { label: "本月", value: "2026-06-01", endValue: "2026-06-30" },
  { label: "下周一", value: "2026-06-22" }
];

const readDetail = <T>(event: Event, fallback: T): T =>
  ((event as CustomEvent).detail ?? fallback) as T;

const updateStart = (event: Event): void => {
  start.set(String(readDetail(event, "")));
};

const updateEnd = (event: Event): void => {
  end.set(String(readDetail(event, "")));
};

const rangeCode = `<elf-date-picker
  :modelValue.prop="start"
  :endValue.prop="end"
  range
  clearable
  :shortcuts.prop="shortcuts"
/>`;

const rangeScript = `const start = useRef("2026-06-01");
const end = useRef("2026-06-30");
const shortcuts = [
    { label: "今天", value: "2026-06-17" },
    { label: "本月", value: "2026-06-01", endValue: "2026-06-30" },
    { label: "下周一", value: "2026-06-22" }
];`;

defineStyle(styles);

const PageDatePickerEx2 = defineHtml(`
<elf-playground title="范围与快捷项" :code=${rangeCode} :script=${rangeScript}>
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <elf-date-picker
          :modelValue.prop=${start}
          :endValue.prop=${end}
          range
          clearable
          :shortcuts.prop=${shortcuts}
          @update:modelValue=${updateStart}
          @update:endValue=${updateEnd}
        ></elf-date-picker>
        <span slot="status" class="demo-state">${start} 至 ${end}</span>
      </div>
    </elf-playground>
`);

export { PageDatePickerEx2 };
