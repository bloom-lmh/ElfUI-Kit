import {
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  useHostAttr,
  useHostFlag,
  useRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { AiLoadingExpose, AiLoadingLabels, AiLoadingProps, AiLoadingVariant } from "./types";

export type {
  AiLoadingElement,
  AiLoadingExpose,
  AiLoadingLabels,
  AiLoadingProps,
  AiLoadingVariant,
} from "./types";

const DEFAULT_LABELS: AiLoadingLabels = {
  loading: "Working",
};

const VARIANTS: readonly AiLoadingVariant[] = ["drive", "dots", "orbit"];

interface AiLoadingCell {
  delay: number | null;
  round: boolean;
}

const chevronDelays = (): (number | null)[] =>
  Array.from({ length: 9 }, (_, index) => {
    const row = Math.floor(index / 3);
    const column = index % 3;
    return (column + Math.abs(row - 1)) * 90;
  });

const ORBIT_ORDER = [0, 1, 2, 5, 8, 7, 6, 3];

const orbitDelays = (): (number | null)[] =>
  Array.from({ length: 9 }, (_, index) => {
    const position = ORBIT_ORDER.indexOf(index);
    return position === -1 ? null : position * 110;
  });

const cellsFor = (variant: AiLoadingVariant): AiLoadingCell[] => {
  const delays = variant === "orbit" ? orbitDelays() : chevronDelays();
  return delays.map((delay) => ({ delay, round: variant === "dots" || variant === "orbit" }));
};

const props = defineProps<AiLoadingProps>({
  label: { type: String, default: "Working" },
  variant: { type: String, default: "drive" },
  showTimer: { type: Boolean, default: true },
  labels: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "" },
});

const cells = (): AiLoadingCell[] => cellsFor(resolvedVariant());
const startAt = useRef(Date.now());
const elapsed = useRef(0);
let tick: ReturnType<typeof setInterval> | undefined;

const resolvedVariant = (): AiLoadingVariant =>
  VARIANTS.includes(props.variant as AiLoadingVariant)
    ? (props.variant as AiLoadingVariant)
    : "drive";
const label = (key: keyof AiLoadingLabels): string =>
  props.labels?.[key] || DEFAULT_LABELS[key] || key;
const hostLabel = (): string => props.ariaLabel || `${label("loading")}: ${props.label}`;

const formatElapsed = (totalMs: number): string => {
  const totalSeconds = totalMs / 1000;
  if (totalSeconds < 60) return `${totalSeconds.toFixed(1)}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds.toFixed(1)}s`;
};

const formatted = (): string => formatElapsed(elapsed.value);
const cellClass = (cell: AiLoadingCell): Record<string, boolean> => ({
  cell: true,
  "is-round": cell.round,
  "is-dim": cell.delay === null,
});
const cellStyle = (cell: AiLoadingCell): Record<string, string> => ({
  animationDelay: cell.delay === null ? "" : `${cell.delay}ms`,
});

const resetTimer = (): void => {
  startAt.set(Date.now());
  elapsed.set(0);
};

onMounted(() => {
  startAt.set(Date.now());
  elapsed.set(0);
  tick = setInterval(() => {
    elapsed.set(Date.now() - startAt.value);
  }, 100);
  return () => {
    if (tick) clearInterval(tick);
    tick = undefined;
  };
});

useHostAttr("data-variant", resolvedVariant);
useHostFlag("data-timer", () => props.showTimer);
useHostAttr("aria-label", hostLabel);

defineExpose<AiLoadingExpose>({ resetTimer });

defineStyle(styles);

const AiLoading = defineHtml(`
  <div class="ai-loading" role="status">
    <span class="grid" aria-hidden="true">
      <i
        v-for="(cell, index) in cells()"
        :key="index"
        :class="cellClass(cell)"
        :style="cellStyle(cell)"
      ></i>
    </span>
    <span class="label">${props.label}</span>
    <span v-if=${props.showTimer} class="timer" aria-hidden="true">${formatted()}</span>
  </div>
`);

export { AiLoading };
