import { defineHtml, defineProps, defineStyle, onUnmounted, useEffect, useRef } from "@elfui/core";
import styles from "./style.scss?inline";
import type { SparklineProps, SparklineStrokeLinecap } from "./types";

export type { SparklineAutoDraw, SparklineProps, SparklineStrokeLinecap } from "./types";

interface Point {
  x: number;
  y: number;
}

const VIEWBOX_WIDTH = 100;
const VIEWBOX_HEIGHT = 100;

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  width: { type: null, default: 300 },
  height: { type: null, default: 100 },
  color: { type: String, default: "var(--elf-primary)" },
  fill: { type: Boolean, default: false },
  fillColor: { type: String, default: "color-mix(in srgb, var(--elf-primary) 18%, transparent)" },
  lineWidth: { type: Number, default: 2 },
  smooth: { type: Number, default: 0 },
  strokeLinecap: { type: String, default: "round" },
  animation: { type: Boolean, default: false },
  animationDuration: { type: Number, default: 300 },
  autoDraw: { type: null, default: false },
  autoDrawDuration: { type: Number, default: 800 },
  ariaLabel: { type: String, default: "Sparkline" },
});

const values = useRef<number[]>([]);
let frame = 0;

const sanitize = (source: unknown): number[] =>
  (Array.isArray(source) ? source : []).map(Number).filter(Number.isFinite);

const prefersReducedMotion = (): boolean =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

const animateTo = (next: number[]): void => {
  if (frame) cancelAnimationFrame(frame);
  const previous = values.peek();
  if (
    !props.animation ||
    prefersReducedMotion() ||
    previous.length !== next.length ||
    previous.length === 0
  ) {
    values.set(next);
    return;
  }
  const started = performance.now();
  const duration = Math.max(1, Number(props.animationDuration) || 300);
  const step = (time: number): void => {
    const progress = Math.min(1, (time - started) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    values.set(
      next.map(
        (value, index) => (previous[index] ?? value) + (value - (previous[index] ?? value)) * eased,
      ),
    );
    if (progress < 1) frame = requestAnimationFrame(step);
    else frame = 0;
  };
  frame = requestAnimationFrame(step);
};

useEffect(() => animateTo(sanitize(props.modelValue)));
onUnmounted(() => {
  if (frame) cancelAnimationFrame(frame);
});

const width = (): number => Math.max(1, Number(props.width) || 300);
const height = (): number => Math.max(1, Number(props.height) || 100);
const points = (): Point[] => {
  const source = values.value;
  if (source.length === 0) return [];
  const low = Math.min(...source);
  const high = Math.max(...source);
  const span = Math.max(1, high - low);
  return source.map((value, index) => ({
    x: source.length === 1 ? VIEWBOX_WIDTH / 2 : (index / (source.length - 1)) * VIEWBOX_WIDTH,
    y: VIEWBOX_HEIGHT - ((value - low) / span) * VIEWBOX_HEIGHT,
  }));
};

const linePath = (): string => {
  const source = points();
  if (source.length === 0) return "";
  if (source.length < 3 || Number(props.smooth) <= 0) {
    return source
      .map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(2)},${point.y.toFixed(2)}`)
      .join(" ");
  }
  const tension = Math.min(1, Math.max(0, Number(props.smooth) / 10));
  let path = `M${source[0]!.x.toFixed(2)},${source[0]!.y.toFixed(2)}`;
  for (let index = 0; index < source.length - 1; index += 1) {
    const before = source[Math.max(0, index - 1)]!;
    const current = source[index]!;
    const next = source[index + 1]!;
    const after = source[Math.min(source.length - 1, index + 2)]!;
    const c1x = current.x + ((next.x - before.x) / 6) * tension;
    const c1y = current.y + ((next.y - before.y) / 6) * tension;
    const c2x = next.x - ((after.x - current.x) / 6) * tension;
    const c2y = next.y - ((after.y - current.y) / 6) * tension;
    path += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${next.x.toFixed(2)},${next.y.toFixed(2)}`;
  }
  return path;
};

const areaPath = (): string => {
  const source = points();
  if (source.length === 0) return "";
  return `${linePath()} L${source.at(-1)!.x.toFixed(2)},${VIEWBOX_HEIGHT} L${source[0]!.x.toFixed(2)},${VIEWBOX_HEIGHT} Z`;
};

const linecap = (): SparklineStrokeLinecap => {
  const value = props.strokeLinecap;
  return value === "butt" || value === "square" ? value : "round";
};

const style = (): Record<string, string> => ({
  "--sparkline-color": String(props.color),
  "--sparkline-fill-color": String(props.fillColor || props.color),
  "--sparkline-line-width": String(Math.max(0.5, Number(props.lineWidth) || 2)),
  "--sparkline-linecap": linecap(),
  "--sparkline-draw-duration": `${Math.max(0, Number(props.autoDrawDuration) || 800)}ms`,
  "--sparkline-aspect": `${width()} / ${height()}`,
});

const shouldAutoDraw = (): boolean => {
  const value = props.autoDraw as unknown;
  return value === true || value === "once" || value === "always";
};

defineStyle(styles);

const Sparkline = defineHtml<SparklineProps>(`
  <svg class="sparkline" :style=${style()} viewBox="0 0 100 100" role="img" :aria-label=${props.ariaLabel} preserveAspectRatio="none">
    <path v-if=${props.fill && areaPath()} class="area" :d=${areaPath()}></path>
    <path :class=${["line", { "is-auto-draw": shouldAutoDraw() }]} :d=${linePath()}></path>
  </svg>
`);

export { Sparkline };
