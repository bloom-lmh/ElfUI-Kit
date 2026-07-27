import { defineHtml, defineStyle, useRef } from "@elfui/core";
import styles from "./demo.scss?inline";

const date = useRef("2026-06-17");

const readDetail = <T>(event: Event, fallback: T): T =>
  ((event as CustomEvent).detail ?? fallback) as T;

const updateDate = (event: Event): void => {
  date.set(String(readDetail(event, "")));
};

const basicCode = `<elf-date-picker
  :modelValue.prop="date"
  clearable
/>`;

const basicScript = `const date = useRef("2026-06-17");`;

defineStyle(styles);

const PageDatePickerEx1 = defineHtml(`
<h2>基础</h2>
<elf-playground title="基础日期" :code=${basicCode} :script=${basicScript}>
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <elf-date-picker
          :modelValue.prop=${date}
          label="发布日期"
          clearable
          @update:modelValue=${updateDate}
        ></elf-date-picker>
        <span slot="status" class="demo-state">${date}</span>
      </div>
    </elf-playground>
`);

export { PageDatePickerEx1 };
