import { defineHtml, defineStyle, useRef } from "@elfui/core";
import styles from "./demo.scss?inline";

const dates = useRef<string[]>(["2026-06-10", "2026-06-14"]);

const readDetail = <T>(event: Event, fallback: T): T =>
  ((event as CustomEvent).detail ?? fallback) as T;

const updateDates = (event: Event): void => {
  const detail = readDetail<unknown>(event, []);
  dates.set(Array.isArray(detail) ? detail.map(String) : []);
};

const multipleCode = `<elf-date-picker
  multiple
  clearable
  :modelValue.prop="dates"
/>`;

const multipleScript = `const dates = useRef(["2026-06-10", "2026-06-14"]);`;

const selectedDates = (): string => dates.value.join("，") || "暂无";

defineStyle(styles);

const PageDatePickerEx4 = defineHtml(`
<elf-playground title="多日期" :code=${multipleCode} :script=${multipleScript}>
      <div style="display:grid;gap:12px;width:min(360px,100%)">
        <elf-date-picker
          multiple
          clearable
          :modelValue.prop=${dates}
          @update:modelValue=${updateDates}
        ></elf-date-picker>
        <span slot="status" class="demo-state">已选：${selectedDates()}</span>
      </div>
    </elf-playground>
`);

export { PageDatePickerEx4 };
