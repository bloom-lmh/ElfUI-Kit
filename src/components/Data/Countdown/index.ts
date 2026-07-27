import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  onUnmounted,
  useRef,
  useEffect
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { CountdownProps, CountdownSlots, CountdownValue } from "./types";

export type { CountdownProps, CountdownSlots, CountdownValue } from "./types";

const props = defineProps<CountdownProps>({
  value: { type: null, default: 0 },
  format: { type: String, default: "HH:mm:ss" },
  title: { type: String, default: "" },
  prefix: { type: String, default: "" },
  suffix: { type: String, default: "" },
  valueStyle: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "Countdown" }
});

const emit = defineEmits(["change", "finish"]);
const remaining = useRef(0);
const finished = useRef(false);
let timer: ReturnType<typeof setInterval> | undefined;

const targetTime = (value: CountdownValue): number => {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const pad = (value: number, digits = 2): string => String(Math.max(0, Math.floor(value))).padStart(digits, "0");

const formatted = (): string => {
  let rest = remaining.value;
  const days = Math.floor(rest / 86_400_000);
  rest -= days * 86_400_000;
  const hours = Math.floor(rest / 3_600_000);
  rest -= hours * 3_600_000;
  const minutes = Math.floor(rest / 60_000);
  rest -= minutes * 60_000;
  const seconds = Math.floor(rest / 1_000);
  const milliseconds = rest - seconds * 1_000;
  const values: Record<string, string> = {
    SSS: pad(milliseconds, 3),
    DD: pad(days),
    HH: pad(hours),
    mm: pad(minutes),
    ss: pad(seconds),
    D: String(days),
    H: String(hours),
    m: String(minutes),
    s: String(seconds)
  };
  const literals: string[] = [];
  const template = String(props.format || "HH:mm:ss").replace(/\[([^\]]*)\]/g, (_, literal: string) => {
    const index = literals.push(literal) - 1;
    return `__literal_${index}__`;
  });
  return template
    .replace(/SSS|DD|HH|mm|ss|D|H|m|s/g, (token) => values[token] ?? token)
    .replace(/__literal_(\d+)__/g, (_, index: string) => literals[Number(index)] ?? "");
};

const refresh = (notify = false): void => {
  const next = Math.max(0, targetTime(props.value) - Date.now());
  const previous = remaining.value;
  if (next !== previous) {
    remaining.set(next);
    if (notify) emit("change", next);
  }
  if (next === 0 && previous > 0 && !finished.value) {
    finished.set(true);
    emit("finish");
  } else if (next > 0 && finished.value) {
    finished.set(false);
  }
};

useEffect(() => {
  props.value;
  refresh();
});

onMounted(() => {
  refresh();
  timer = setInterval(() => refresh(true), 250);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

defineStyle(styles);

const Countdown = defineHtml<CountdownProps, Record<string, never>, CountdownSlots>(`
  <div class="countdown" part="countdown" role="timer" :aria-label=${props.ariaLabel || props.title || "Countdown"}>
    <div v-if=${props.title} class="title" part="title"><slot name="title">${props.title}</slot></div>
    <div class="value" part="value" :style=${props.valueStyle} aria-live="off">
      <span v-if=${props.prefix} class="prefix"><slot name="prefix">${props.prefix}</slot></span>
      <span class="number">${formatted()}</span>
      <span v-if=${props.suffix} class="suffix"><slot name="suffix">${props.suffix}</slot></span>
    </div>
  </div>
`);

export { Countdown };
