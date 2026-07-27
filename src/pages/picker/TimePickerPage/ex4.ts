import { defineHtml, useRef } from "@elfui/core";

const preciseTime = useRef("09-30-15");

const disabledHours = (): number[] => [0, 1, 2, 3, 4, 5, 22, 23];
const disabledMinutes = (hour: number): number[] => (hour === 9 ? [0, 15, 45] : []);
const disabledSeconds = (_hour: number, minute: number): number[] => (minute === 30 ? [0, 30, 45] : []);

const updatePreciseTime = (event: CustomEvent<string>): void => {
  preciseTime.set(String(event.detail || ""));
};

const code = `<elf-time-picker
  :modelValue.prop="preciseTime"
  format="HH:mm:ss"
  value-format="HH-mm-ss"
  :step="15"
  :disabledHours.prop="disabledHours"
  :disabledMinutes.prop="disabledMinutes"
  :disabledSeconds.prop="disabledSeconds"
  placement="bottom-start"
  popper-class="precision-clock"
  @update:modelValue="updatePreciseTime"
/>`;

const script = `const preciseTime = useRef("09-30-15");

const disabledHours = () => [0, 1, 2, 3, 4, 5, 22, 23];
const disabledMinutes = (hour) => hour === 9 ? [0, 15, 45] : [];
const disabledSeconds = (_hour, minute) => minute === 30 ? [0, 30, 45] : [];

const updatePreciseTime = (event) => {
  preciseTime.set(event.detail);
};`;

const PageTimePickerEx4 = defineHtml(`
  <elf-playground title="格式、秒级步进与禁用项" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">输出：{{ preciseTime }}</span>
    <div style="display:grid;place-items:center;width:100%;max-width:720px">
      <elf-time-picker
        :modelValue.prop=${preciseTime}
        format="HH:mm:ss"
        value-format="HH-mm-ss"
        :step=${15}
        :disabledHours.prop=${disabledHours}
        :disabledMinutes.prop=${disabledMinutes}
        :disabledSeconds.prop=${disabledSeconds}
        placement="bottom-start"
        popper-class="precision-clock"
        @update:modelValue=${updatePreciseTime}
      ></elf-time-picker>
    </div>
  </elf-playground>
`);

export { PageTimePickerEx4 };
