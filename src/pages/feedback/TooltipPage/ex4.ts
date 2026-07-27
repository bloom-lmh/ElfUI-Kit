import { defineHtml, defineStyle, useRef } from "@elfui/core";

const status = useRef("按 Tab 聚焦右侧帮助按钮");

const onFocus = (): void => {
  status.set("提示已显示；按 Esc 可关闭但不会丢失焦点");
};

const onBlur = (): void => {
  status.set("焦点已离开帮助按钮");
};

const code = `<elf-tooltip
  trigger="focus"
  placement="auto"
  :show-after="160"
  :max-width="280"
  content="权限继承自上级空间；单独修改后不会再跟随上级策略更新。"
>
  <button type="button">权限说明</button>
</elf-tooltip>`;

const script = `const status = useRef("按 Tab 聚焦右侧帮助按钮");

const onFocus = () => {
  status.set("提示已显示；按 Esc 可关闭但不会丢失焦点");
};

const onBlur = () => {
  status.set("焦点已离开帮助按钮");
};`;

defineStyle(`
  .tooltip-a11y-stage {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 28px;
    width: min(760px, 100%);
    min-height: 180px;
    padding: 28px;
    border: 1px solid var(--elf-border);
    border-radius: var(--elf-radius-md);
    box-sizing: border-box;
    background: color-mix(in srgb, var(--elf-bg-paper) 94%, var(--elf-primary) 6%);
  }
  .tooltip-a11y-copy strong { display: block; margin-bottom: 7px; font-size: 16px; }
  .tooltip-a11y-copy p { max-width: 440px; margin: 0; color: var(--elf-text-secondary); line-height: 1.65; }
  .tooltip-a11y-trigger {
    min-height: 40px;
    padding: 0 14px;
    border: 1px solid var(--elf-border);
    border-radius: var(--elf-radius-sm);
    color: var(--elf-primary);
    background: var(--elf-bg-paper);
    cursor: pointer;
    font: inherit;
  }
  .tooltip-a11y-trigger:focus-visible {
    border-color: var(--elf-primary);
    outline: 3px solid color-mix(in srgb, var(--elf-primary) 18%, transparent);
    outline-offset: 2px;
  }
  @media (max-width: 640px) {
    .tooltip-a11y-stage { grid-template-columns: 1fr; padding: 20px; }
    .tooltip-a11y-stage elf-tooltip { justify-self: start; }
  }
`);

const PageTooltipEx4 = defineHtml(`
  <h2>键盘与长内容</h2>
  <elf-playground title="焦点触发、Esc 关闭与自动避让" :code=${code} :script=${script}>
    <span slot="status">{{ status }}</span>
    <section class="tooltip-a11y-stage">
      <div class="tooltip-a11y-copy">
        <strong>访问权限</strong>
        <p>
          提示位于容器边缘时会选择可用方向；长内容受最大宽度约束，不会变成超长单行文本。
        </p>
      </div>
      <elf-tooltip
        trigger="focus"
        placement="auto"
        :showAfter=${160}
        :maxWidth=${280}
        content="权限继承自上级空间；单独修改后不会再跟随上级策略更新。"
      >
        <button
          type="button"
          class="tooltip-a11y-trigger"
          @focus="onFocus()"
          @blur="onBlur()"
        >
          权限说明
        </button>
      </elf-tooltip>
    </section>
  </elf-playground>
`);

export { PageTooltipEx4 };
