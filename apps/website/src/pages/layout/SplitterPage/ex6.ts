import { defineHtml, defineStyle, useHost, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

defineStyle(styles);

const t = createDocsTranslator({
  title: { zh: "转换与拖动", en: "Swap and drag" },
  hint: {
    zh: "点击中部图标交换左右面板；按住图标左右拖动可代替分隔条调整比例。",
    en: "Click the center icon to swap panels, or drag it to resize like the separator.",
  },
  listTitle: { zh: "待办列表", en: "Task list" },
  listBody: {
    zh: "设计评审 · 组件测试 · 文档更新",
    en: "Design review · component tests · docs update",
  },
  detailTitle: { zh: "任务详情", en: "Task details" },
  detailBody: {
    zh: "拖动分隔条或中部图标调整两栏比例。",
    en: "Drag the separator or the center icon to adjust the ratio.",
  },
  ratio: { zh: "左栏比例", en: "Left panel ratio" },
  swap: { zh: "交换面板", en: "Swap panels" },
});

const swapSize = useRef(40);
const swapped = useRef(false);
const dragPointer = useRef(-1);
const dragMoved = useRef(false);
const host = useHost();

const stage = (): HTMLElement | null =>
  (host.shadowRoot ?? host).querySelector<HTMLElement>(".swap-stage");

const onSwapSizeUpdate = (event: CustomEvent<number>): void => {
  swapSize.set(Number(event.detail) || 40);
};

const onSwap = (): void => {
  if (dragMoved.value) {
    dragMoved.set(false);
    return;
  }
  swapped.set(!swapped.value);
};

const onSwapPointerDown = (event: PointerEvent): void => {
  dragPointer.set(event.pointerId);
  dragMoved.set(false);
  try {
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
  } catch {
    // Synthetic events may not carry an active pointer; capture is optional.
  }
};

const onSwapPointerMove = (event: PointerEvent): void => {
  if (dragPointer.value !== event.pointerId) return;
  const target = stage();
  if (!target) return;
  const rect = target.getBoundingClientRect();
  if (rect.width === 0) return;
  const ratio = ((event.clientX - rect.left) / rect.width) * 100;
  swapSize.set(Math.min(80, Math.max(20, Math.round(ratio))));
  dragMoved.set(true);
};

const onSwapPointerUp = (event: PointerEvent): void => {
  if (dragPointer.value !== event.pointerId) return;
  dragPointer.set(-1);
  try {
    (event.currentTarget as HTMLElement).releasePointerCapture?.(event.pointerId);
  } catch {
    // The browser may have already released a captured synthetic pointer.
  }
};

const swapStyle = (): string => `left: ${swapSize.value}%;`;

const code = `<div class="swap-stage">
  <elf-splitter :modelValue.prop="size" :min="20" :max="80">
    <div slot="first" class="swap-panel">Task list</div>
    <div slot="second" class="swap-panel">Task details</div>
  </elf-splitter>
  <button class="swap-handle" aria-label="Swap panels"
    @click="onSwap"
    @pointerdown="onSwapPointerDown"
    @pointermove="onSwapPointerMove"
    @pointerup="onSwapPointerUp">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.99 11 3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/>
    </svg>
  </button>
</div>`;

const script = `const size = useRef(40);
const swapped = useRef(false);

const onSwap = () => swapped.set(!swapped.value);
const onSwapPointerDown = (event) => {
  dragPointer.set(event.pointerId);
  event.currentTarget.setPointerCapture(event.pointerId);
};
const onSwapPointerMove = (event) => {
  if (dragPointer.value !== event.pointerId) return;
  const rect = stage.getBoundingClientRect();
  const ratio = ((event.clientX - rect.left) / rect.width) * 100;
  size.set(Math.min(80, Math.max(20, Math.round(ratio))));
};`;

const PageSplitterEx6 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status">${t("ratio")}: ${swapSize.value}%</span>
    <div class="swap-stage">
      <elf-splitter
        :modelValue.prop=${swapSize.value}
        :min=${20}
        :max=${80}
        @update:modelValue=${onSwapSizeUpdate}
      >
        <div slot="first" v-if=${swapped.value} class="swap-panel">
          <strong>${t("detailTitle")}</strong>
          <p>${t("detailBody")}</p>
        </div>
        <div slot="first" v-else class="swap-panel">
          <strong>${t("listTitle")}</strong>
          <p>${t("listBody")}</p>
        </div>
        <div slot="second" v-if=${swapped.value} class="swap-panel">
          <strong>${t("listTitle")}</strong>
          <p>${t("listBody")}</p>
        </div>
        <div slot="second" v-else class="swap-panel">
          <strong>${t("detailTitle")}</strong>
          <p>${t("detailBody")}</p>
        </div>
      </elf-splitter>
      <button
        class="swap-handle"
        :style=${swapStyle()}
        :aria-label=${t("swap")}
        @click=${onSwap}
        @pointerdown=${onSwapPointerDown}
        @pointermove=${onSwapPointerMove}
        @pointerup=${onSwapPointerUp}
        @pointercancel=${onSwapPointerUp}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6.99 11 3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/>
        </svg>
      </button>
      <small class="swap-hint">${t("hint")}</small>
    </div>
  </elf-playground>
`);

export { PageSplitterEx6 };
