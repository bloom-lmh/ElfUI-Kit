import { defineHtml, useRef } from "@elfui/core";

const focusedDay = useRef("2026-07-03");

const disableWeekend = (date: Date): boolean => date.getDay() === 0 || date.getDay() === 6;

const updateFocusedDay = (event: CustomEvent<string>): void => {
  focusedDay.set(String(event.detail || ""));
};

const code = `<elf-calendar
  :modelValue.prop="focusedDay"
  :disabledDate.prop="disableWeekend"
  aria-label="排班日期"
  @update:modelValue="updateFocusedDay"
/>`;

const script = `const focusedDay = useRef("2026-07-03");

const disableWeekend = (date) => date.getDay() === 0 || date.getDay() === 6;

const updateFocusedDay = (event) => {
  focusedDay.set(event.detail);
};`;

const PageCalendarEx4 = defineHtml(`
  <elf-playground title="键盘月历与窄屏" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">方向键移动 · Home/End 定位周 · Enter/Space 选择</span>
    <div style="width:100%;max-width:360px">
      <elf-calendar
        :modelValue.prop=${focusedDay}
        :disabledDate.prop=${disableWeekend}
        aria-label="排班日期"
        @update:modelValue=${updateFocusedDay}
      ></elf-calendar>
    </div>
  </elf-playground>
`);

export { PageCalendarEx4 };
