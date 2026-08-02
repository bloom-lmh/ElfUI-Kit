import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "长按提示与手势取消", en: "Long-press tooltip and gesture cancellation" },
  initialStatus: {
    zh: "在触屏设备上长按卡片 500 毫秒",
    en: "Long-press the card for 500 ms on a touch device",
  },
  pressingStatus: {
    zh: "正在识别长按；移动手指可取消",
    en: "Recognizing a long press; move your finger to cancel",
  },
  releasedStatus: {
    zh: "松手后提示保持，点击外部关闭",
    en: "The tooltip stays open after release; tap outside to close",
  },
  content: {
    zh: "长按提示不会阻断轻触和滚动手势。",
    en: "Long-press tooltips preserve tap and scrolling gestures.",
  },
  button: { zh: "长按查看说明", en: "Long-press for details" },
  description: {
    zh: "移动超过 10 像素会取消，正常纵向滚动不会误打开。",
    en: "Moving more than 10 px cancels the gesture, so normal vertical scrolling does not open the tooltip.",
  },
});

const status = useRef(t("initialStatus"));

const onPointerDown = (event: PointerEvent): void => {
  if (event.pointerType === "touch") status.set(t("pressingStatus"));
};

const onPointerUp = (event: PointerEvent): void => {
  if (event.pointerType === "touch") status.set(t("releasedStatus"));
};

const code = `<elf-tooltip
  content="${t("content")}"
  :touch-long-press="true"
  :long-press-delay="500"
  :long-press-tolerance="10"
>
  <button type="button">${t("button")}</button>
</elf-tooltip>`;

const script = `const status = useRef("${t("initialStatus")}");

const onPointerDown = (event) => {
  if (event.pointerType === "touch") status.set("${t("pressingStatus")}");
};

const onPointerUp = (event) => {
  if (event.pointerType === "touch") status.set("${t("releasedStatus")}");
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
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status">{{ status }}</span>
    <section class="tooltip-touch-stage">
      <elf-tooltip
        :content=${t("content")}
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
          <strong>${t("button")}</strong>
          <span>${t("description")}</span>
        </button>
      </elf-tooltip>
    </section>
  </elf-playground>
`);

export { PageTooltipEx5 };
