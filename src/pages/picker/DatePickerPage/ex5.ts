import { defineHtml, defineStyle, useRef } from "@elfui/core";
import styles from "./demo.scss?inline";

const actionValue = useRef("2026-06-12");

const readDetail = <T>(event: Event, fallback: T): T =>
  ((event as CustomEvent).detail ?? fallback) as T;

const updateAction = (event: Event): void => {
  actionValue.set(String(readDetail(event, "")));
};

const actionsCode = `<elf-date-picker
  :modelValue.prop="actionValue"
  actions
  clearable
  show-header
  header="带确认的日期选择"
/>`;

const actionsScript = `const actionValue = useRef("2026-06-12");`;

defineStyle(styles);

const PageDatePickerEx5 = defineHtml(`
<elf-playground title="动作栏确认" :code=${actionsCode} :script=${actionsScript}>
      <div style="display:grid;gap:12px;max-width:620px">
        <elf-date-picker
          :modelValue.prop=${actionValue}
          actions
          clearable
          show-header
          header="带确认的日期选择"
          @update:modelValue=${updateAction}
        ></elf-date-picker>
        <span slot="status" class="demo-state">提交值：${actionValue}</span>
      </div>
    </elf-playground>
`);

export { PageDatePickerEx5 };
