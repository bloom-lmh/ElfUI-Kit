// elf-scrollbar — 滚动条容器
//
//   <elf-scrollbar :height="260" always @scroll="onScroll">...</elf-scrollbar>
//   <elf-scrollbar max-height="280px">...</elf-scrollbar>
//
// 高度直接内联到 .wrap，避免 host→wrap 百分比传递在时序或 flex 上下文里失效。
// 命令式能力通过 defineExpose 暴露：setScrollTop / setScrollLeft / update / wrapRef。

import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  useHost,
  useHostFlag,
  useTemplateRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { ScrollbarProps, ScrollbarScrollDetail } from "./types";

export type { ScrollbarExpose, ScrollbarProps, ScrollbarScrollDetail } from "./types";

const props = defineProps<ScrollbarProps>({
  height: { type: [Number, String], default: "auto" },
  maxHeight: { type: [Number, String], default: "none" },
  always: { type: Boolean, default: false },
  native: { type: Boolean, default: true },
  noresize: { type: Boolean, default: false },
  wrapClass: { type: String, default: "" },
  viewClass: { type: String, default: "" },
});

const emit = defineEmits(["scroll"]);

const host = useHost();
const wrapRef = useTemplateRef<HTMLElement>("wrap");

// ref 在首次挂载时序未跟上时，回退到 shadowRoot 查询，保证 expose 一定可用。
const getWrap = (): HTMLElement | null =>
  wrapRef.value ?? host.shadowRoot?.querySelector(".wrap") ?? null;

const cssSize = (value: number | string): string =>
  typeof value === "number" ? `${Math.max(0, value)}px` : String(value || "auto");

// 直接把高度内联到 .wrap，绕过 host→wrap 的 100% 传递：
// 当 host 在 flex 容器里或变量时序未跟上时，100% 会塌缩成内容高度导致无滚动。
const wrapStyle = (): Record<string, string> => {
  const style: Record<string, string> = {};
  const h = cssSize(props.height);
  const mh = cssSize(props.maxHeight);
  if (h !== "auto") style.height = h;
  if (mh !== "none") style.maxHeight = mh;
  return style;
};

const onScroll = (event: Event): void => {
  const target = event.currentTarget as HTMLElement;
  const detail: ScrollbarScrollDetail = {
    scrollTop: target.scrollTop,
    scrollLeft: target.scrollLeft,
  };
  emit("scroll", detail);
};

const setScrollTop = (value: number): void => {
  const el = getWrap();
  if (el) el.scrollTop = Math.max(0, Number(value) || 0);
};

const setScrollLeft = (value: number): void => {
  const el = getWrap();
  if (el) el.scrollLeft = Math.max(0, Number(value) || 0);
};

// 纯 CSS 实现，滚动尺寸由浏览器自动维护；保留以对齐 Element Plus API。
const update = (): void => {
  /* no-op for native implementation */
};

defineExpose({
  setScrollTop,
  setScrollLeft,
  update,
  get wrapRef() {
    return getWrap();
  },
});

// native 默认 true，反射为 host attribute，由 :host([native]) 控制是否启用美化。
useHostFlag("native", () => props.native);
useHostFlag("always", () => props.always);

defineStyle(styles);

const Scrollbar = defineHtml<ScrollbarProps>(`
    <div ref="wrap" :class=${["wrap", () => props.wrapClass]} part="wrap" :style=${wrapStyle()} @scroll=${onScroll}>
        <div :class=${["view", () => props.viewClass]} part="view"><slot></slot></div>
    </div>
`);

export { Scrollbar };
