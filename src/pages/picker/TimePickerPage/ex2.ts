import { defineHtml, useRef } from "@elfui/core";

const rangeValue = useRef<[string, string]>(["09:00", "18:00"]);

const shortcuts = [
  { label: "上午", value: "09:00", endValue: "12:00" },
  { label: "工作日", value: "09:00", endValue: "18:00" },
  { label: "晚上", value: "19:00", endValue: "22:00" }
];

const updateRange = (event: CustomEvent): void => {
  rangeValue.set((event.detail ?? ["", ""]) as [string, string]);
};

const rangeText = (): string =>
  `${rangeValue.value[0] || "--:--"} 至 ${rangeValue.value[1] || "--:--"}`;

const rangeCode = `<elf-time-picker
  :modelValue.prop="rangeValue"
  is-range
  start-placeholder="开始时间"
  end-placeholder="结束时间"
  range-separator="到"
  :shortcuts.prop="shortcuts"
  @update:modelValue="updateRange"
/>`;

const rangeScript = `const rangeValue = useRef(["09:00", "18:00"]);

const shortcuts = [
  { label: "上午", value: "09:00", endValue: "12:00" },
  { label: "工作日", value: "09:00", endValue: "18:00" },
  { label: "晚上", value: "19:00", endValue: "22:00" }
];

const updateRange = (event) => {
  rangeValue.set(event.detail);
};`;

const PageTimePickerEx2 = defineHtml(`
<elf-playground title="范围值、快捷时间与清空" :code=${rangeCode} :script=${rangeScript}>
      <div style="display:grid;gap:16px;width:100%;max-width:820px;place-items:center">
        <div style="display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;width:100%">
          <elf-time-picker
            :modelValue.prop="rangeValue"
            is-range
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            range-separator="到"
            :shortcuts.prop="shortcuts"
            clearable
            @update:modelValue=${updateRange}
          ></elf-time-picker>
          <span slot="status" class="demo-state">{{ rangeText() }}</span>
        </div>
      </div>
    </elf-playground>
`);

export { PageTimePickerEx2 };
