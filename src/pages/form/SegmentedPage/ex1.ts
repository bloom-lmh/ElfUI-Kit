import { defineHtml, useRef } from "@elfui/core";

const period = useRef("day");

const periodOptions = [
    { label: "今日", value: "day" },
    { label: "本周", value: "week" },
    { label: "本月", value: "month" },
    { label: "全年", value: "year", disabled: true },
];

const code1 = `<elf-segmented
  name="period"
  aria-label="数据周期"
  :options.prop="periodOptions"
  :modelValue.prop="period"
  @update:modelValue="onPeriodUpdate"
/>`;

const script1 = `const period = useRef("day");
const periodOptions = [
  { label: "今日", value: "day" },
  { label: "本周", value: "week" },
  { label: "本月", value: "month" },
  { label: "全年", value: "year", disabled: true }
];

const onPeriodUpdate = (event) => period.set(String(event.detail || ""));`;

const onPeriodUpdate = (event: CustomEvent): void => period.set(String(event.detail || ""));

const PageSegmentedEx1 = defineHtml(`
<elf-playground title="受控值、标签与禁用项" :code=${code1} :script=${script1}>
            <elf-segmented
                name="period"
                aria-label="数据周期"
                :options.prop=${periodOptions}
                :modelValue.prop=${period}
                @update:modelValue=${onPeriodUpdate}
            ></elf-segmented>
            <span slot="status" class="demo-state">当前：{{ period.value }}</span>
        </elf-playground>
`);

export { PageSegmentedEx1 };
