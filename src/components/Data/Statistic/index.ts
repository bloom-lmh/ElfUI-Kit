import {
  defineHtml,
  defineProps,
  defineStyle,
  onBeforeUnmount,
  useComputed,
  useEffect,
  useRef
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { StatisticEasing, StatisticProps, StatisticSlots } from "./types";

export type { StatisticEasing, StatisticProps, StatisticSlots } from "./types";

const EASINGS: Record<StatisticEasing, (progress: number) => number> = {
  linear: (progress) => progress,
  "ease-out": (progress) => 1 - Math.pow(1 - progress, 3),
  "ease-in-out": (progress) =>
    progress < 0.5 ? 4 * Math.pow(progress, 3) : 1 - Math.pow(-2 * progress + 2, 3) / 2
};

const finiteNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const decimalPlaces = (value: number): number => {
  const decimal = String(value).split(".")[1];
  return Math.min(decimal?.length ?? 0, 6);
};

const props = defineProps<StatisticProps>({
  value: { type: Number, default: 0 },
  animated: { type: Boolean, default: false },
  startValue: { type: Number, default: 0 },
  duration: { type: Number, default: 1000 },
  easing: { type: String, default: "ease-out" },
  title: { type: String, default: "" },
  prefix: { type: String, default: "" },
  suffix: { type: String, default: "" },
  precision: { type: Number, default: undefined },
  formatter: { type: Function, default: undefined },
  groupSeparator: { type: String, default: "," },
  decimalSeparator: { type: String, default: "." },
  valueStyle: { type: Object, default: () => ({}) }
});

const displayedValue = useRef(0);
const hasTitleSlot = useRef(false);
const hasPrefixSlot = useRef(false);
const hasSuffixSlot = useRef(false);

let animationFrame = 0;
let initialized = false;

const targetValue = (): number => finiteNumber(props.value);
const initialValue = (): number => finiteNumber(props.startValue);
const animationDuration = (): number => Math.max(0, finiteNumber(props.duration, 1000));
const easing = (): StatisticEasing =>
  props.easing === "linear" || props.easing === "ease-in-out" ? props.easing : "ease-out";
const valuePrecision = (): number | undefined => {
  if (Number.isInteger(Number(props.precision))) return Math.max(0, Number(props.precision));
  if (!props.animated) return undefined;
  return Math.max(decimalPlaces(targetValue()), decimalPlaces(initialValue()));
};
const formatted = (): string => {
  const value = displayedValue.value;
  if (typeof props.formatter === "function") return props.formatter(value);
  const precision = valuePrecision();
  const raw = precision === undefined ? String(value) : value.toFixed(precision);
  const [int, decimal] = raw.split(".");
  const grouped = String(int).replace(/\B(?=(\d{3})+(?!\d))/g, props.groupSeparator || ",");
  return decimal ? `${grouped}${props.decimalSeparator || "."}${decimal}` : grouped;
};
const showTitle = useComputed(() => Boolean(props.title || hasTitleSlot.value));
const showPrefix = useComputed(() => Boolean(props.prefix || hasPrefixSlot.value));
const showSuffix = useComputed(() => Boolean(props.suffix || hasSuffixSlot.value));

const stopAnimation = (): void => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  animationFrame = 0;
};

const prefersReducedMotion = (): boolean =>
  typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const animateValue = (): void => {
  stopAnimation();

  const end = targetValue();
  const start = initialized ? displayedValue.peek() : initialValue();
  initialized = true;

  if (!props.animated || prefersReducedMotion() || animationDuration() === 0 || start === end) {
    displayedValue.set(end);
    return;
  }

  displayedValue.set(start);
  let startedAt: number | undefined;
  const step = (timestamp: number): void => {
    startedAt ??= timestamp;
    const progress = Math.min(1, (timestamp - startedAt) / animationDuration());
    const next = start + (end - start) * EASINGS[easing()](progress);
    displayedValue.set(progress === 1 ? end : next);
    animationFrame = progress < 1 ? requestAnimationFrame(step) : 0;
  };

  animationFrame = requestAnimationFrame(step);
};

const hasContent = (event: Event): boolean => {
  const slot = event.target as HTMLSlotElement;
  return slot.assignedNodes().some((node) => (node.textContent?.trim() ?? "") !== "");
};

const onSlotChange = (target: "title" | "prefix" | "suffix") => (event: Event): void => {
  const value = hasContent(event);
  if (target === "title") hasTitleSlot.set(value);
  if (target === "prefix") hasPrefixSlot.set(value);
  if (target === "suffix") hasSuffixSlot.set(value);
};

useEffect(animateValue);
onBeforeUnmount(stopAnimation);

defineStyle(styles);

const Statistic = defineHtml<StatisticProps, Record<string, never>, StatisticSlots>(`
  <div class="statistic" part="statistic">
    <div v-show=${showTitle} class="title" part="title">
      <slot name="title" @slotchange=${onSlotChange("title")}>${props.title}</slot>
    </div>
    <div class="value" part="value" :style=${props.valueStyle}>
      <span v-show=${showPrefix} class="prefix"><slot name="prefix" @slotchange=${onSlotChange("prefix")}>${props.prefix}</slot></span>
      <span class="number">${formatted()}</span>
      <span v-show=${showSuffix} class="suffix"><slot name="suffix" @slotchange=${onSlotChange("suffix")}>${props.suffix}</slot></span>
    </div>
  </div>
`);

export { Statistic };
