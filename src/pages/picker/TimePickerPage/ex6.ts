import { defineHtml, useRef } from "@elfui/core";

const time = useRef("");
const updateTime = (event: CustomEvent<string>): void => time.set(String(event.detail || ""));

const code = `<elf-time-picker
  :modelValue="time"
  default-value="09:30"
  placement="bottom-end"
  :fallbackPlacements.prop="['top-end', 'bottom-start']"
  :popperOptions.prop="{ offset: [0, 12], padding: 12 }"
  @update:modelValue="updateTime"
/>`;

const script = `const time = useRef("");
const updateTime = (event) => time.set(event.detail);`;

const PageTimePickerEx6 = defineHtml(`
  <elf-playground title="默认时刻与浮层策略" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">空值从 09:30 开始编辑 · 自动翻转</span>
    <div style="width:min(100%,360px)">
      <elf-time-picker
        :modelValue=${time}
        default-value="09:30"
        placement="bottom-end"
        :fallbackPlacements.prop=${["top-end", "bottom-start"]}
        :popperOptions.prop=${{ offset: [0, 12], padding: 12 }}
        label="会议时间"
        @update:modelValue=${updateTime}
      ></elf-time-picker>
    </div>
  </elf-playground>
`);

export { PageTimePickerEx6 };
