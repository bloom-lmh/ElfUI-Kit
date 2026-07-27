import { defineHtml, defineStyle, useRef } from "@elfui/core";

const publishDate = useRef("2026/06/17");
const status = useRef("工作日可选 · 值格式 YYYY/MM/DD");
const popperStyle = { width: "360px" };

const disableWeekend = (date: Date): boolean => date.getDay() === 0 || date.getDay() === 6;

const onUpdate = (event: CustomEvent<string>): void => {
  publishDate.set(String(event.detail || ""));
  status.set(`已选择：${event.detail}`);
};

const code = `<elf-date-picker
  :modelValue="publishDate"
  format="YYYY年MM月DD日"
  value-format="YYYY/MM/DD"
  min="2026-06-01"
  max="2026-06-30"
  :disabled-date.prop="disableWeekend"
  teleported
  popper-class="release-calendar"
  :popper-style.prop="{ width: '360px' }"
  @update:modelValue="onUpdate"
/>`;

const script = `const publishDate = useRef("2026/06/17");
const status = useRef("工作日可选 · 值格式 YYYY/MM/DD");

const disableWeekend = (date) => date.getDay() === 0 || date.getDay() === 6;

const onUpdate = (event) => {
  publishDate.set(String(event.detail || ""));
  status.set(\`已选择：\${event.detail}\`);
};`;

defineStyle(`
  .date-boundary-stage {
    display: grid;
    grid-template-columns: minmax(240px, 340px) minmax(0, 1fr);
    align-items: center;
    gap: 28px;
    width: min(760px, 100%);
    min-height: 180px;
    margin: 0 auto;
    padding: 28px;
    box-sizing: border-box;
    border: 1px solid var(--elf-border);
    border-radius: var(--elf-radius-md);
    background: color-mix(in srgb, var(--elf-bg-paper) 95%, var(--elf-primary) 5%);
  }
  .date-boundary-stage elf-date-picker { width: 100%; }
  .date-boundary-notes { display: grid; gap: 8px; color: var(--elf-text-secondary); line-height: 1.6; }
  .date-boundary-notes strong { color: var(--elf-text-primary); font-size: 16px; }
  .date-boundary-notes kbd {
    padding: 2px 6px;
    border: 1px solid var(--elf-border);
    border-radius: 5px;
    color: var(--elf-text-primary);
    background: var(--elf-bg-paper);
    font: inherit;
    font-size: 12px;
  }
  @media (max-width: 680px) {
    .date-boundary-stage { grid-template-columns: 1fr; padding: 20px; }
  }
`);

const PageDatePickerEx6 = defineHtml(`
  <h2>格式与选择边界</h2>
  <elf-playground title="格式化、禁用日期与键盘" :code=${code} :script=${script}>
    <span slot="status">{{ status }}</span>
    <section class="date-boundary-stage">
      <elf-date-picker
        :modelValue.prop=${publishDate}
        format="YYYY年MM月DD日"
        value-format="YYYY/MM/DD"
        min="2026-06-01"
        max="2026-06-30"
        :disabled-date.prop=${disableWeekend}
        teleported
        popper-class="release-calendar"
        :popper-style.prop=${popperStyle}
        label="工作日发布日期"
        clearable
        @update:modelValue=${onUpdate}
      ></elf-date-picker>
      <div class="date-boundary-notes">
        <strong>六月工作日</strong>
        <span>输入显示中文日期，业务值保持斜杠格式；周末与范围外日期不可选。</span>
        <span><kbd>↓</kbd> 打开并进入月历，方向键移动，<kbd>Esc</kbd> 关闭。</span>
      </div>
    </section>
  </elf-playground>
`);

export { PageDatePickerEx6 };
