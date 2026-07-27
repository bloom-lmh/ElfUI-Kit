import { defineHtml, defineStyle, useRef } from "@elfui/core";

const status = useRef("在触屏设备上长按卡片 500ms");

const onPointerDown = (event: PointerEvent): void => {
  if (event.pointerType === "touch") status.set("正在识别长按；移动手指可取消");
};

const onPointerUp = (event: PointerEvent): void => {
  if (event.pointerType === "touch") status.set("松手后提示保持，点击外部关闭");
};

const code = `<elf-tooltip
  content="长按提示不会阻断轻触和滚动手势。"
  :touch-long-press="true"
  :long-press-delay="500"
  :long-press-tolerance="10"
>
  <button type="button">长按查看说明</button>
</elf-tooltip>`;

const script = `const status = useRef("在触屏设备上长按卡片 500ms");

const onPointerDown = (event) => {
  if (event.pointerType === "touch") status.set("正在识别长按；移动手指可取消");
};

const onPointerUp = (event) => {
  if (event.pointerType === "touch") status.set("松手后提示保持，点击外部关闭");
};`;

defineStyle(`
  .tooltip-touch-stage {
    display: grid;
    place-items: center;
    width: min(560px, 100%);
    min-height: 190px;
    margin: 0 auto;
    padding: 28px;
    box-sizing: border-box;
    border: 1px solid var(--elf-border);
    border-radius: var(--elf-radius-md);
    background: color-mix(in srgb, var(--elf-bg-paper) 95%, var(--elf-primary) 5%);
  }
  .tooltip-touch-target {
    display: grid;
    gap: 8px;
    width: min(320px, 100%);
    min-height: 92px;
    padding: 18px 20px;
    box-sizing: border-box;
    border: 1px solid color-mix(in srgb, var(--elf-primary) 44%, var(--elf-border));
    border-radius: var(--elf-radius-md);
    color: var(--elf-text-primary);
    background: var(--elf-bg-paper);
    text-align: left;
    cursor: help;
    touch-action: pan-y;
    font: inherit;
  }
  .tooltip-touch-target strong { color: var(--elf-primary); font-size: 16px; }
  .tooltip-touch-target span { color: var(--elf-text-secondary); line-height: 1.55; }
`);

const PageTooltipEx5 = defineHtml(`
  <h2>触屏长按</h2>
  <elf-playground title="长按提示与手势取消" :code=${code} :script=${script}>
    <span slot="status">{{ status }}</span>
    <section class="tooltip-touch-stage">
      <elf-tooltip
        content="长按提示不会阻断轻触和滚动手势。"
        :touchLongPress=${true}
        :longPressDelay=${500}
        :longPressTolerance=${10}
      >
        <button
          type="button"
          class="tooltip-touch-target"
          @pointerdown=${onPointerDown}
          @pointerup=${onPointerUp}
        >
          <strong>长按查看说明</strong>
          <span>移动超过 10px 会取消，正常纵向滚动不会误打开。</span>
        </button>
      </elf-tooltip>
    </section>
  </elf-playground>
`);

export { PageTooltipEx5 };
