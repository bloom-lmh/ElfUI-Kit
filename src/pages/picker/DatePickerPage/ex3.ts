import { defineHtml, defineStyle, useRef } from "@elfui/core";
import styles from "./demo.scss?inline";

const month = useRef("2026-06");

const readDetail = <T>(event: Event, fallback: T): T =>
  ((event as CustomEvent).detail ?? fallback) as T;

const updateMonth = (event: Event): void => {
  month.set(String(readDetail(event, "")));
};

const monthCode = `<elf-date-picker
  :modelValue.prop="month"
  type="month"
  show-header
  header="选择账期"
/>`;

const monthScript = `const month = useRef("2026-06");`;

defineStyle(styles);

const PageDatePickerEx3 = defineHtml(`
<elf-playground title="月份与头部" :code=${monthCode} :script=${monthScript}>
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <elf-date-picker
          :modelValue.prop=${month}
          type="month"
          show-header
          header="选择账期"
          @update:modelValue=${updateMonth}
        ></elf-date-picker>
        <span slot="status" class="demo-state">${month}</span>
      </div>
    </elf-playground>
`);

export { PageDatePickerEx3 };
