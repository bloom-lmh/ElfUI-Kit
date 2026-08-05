import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  onUnmounted,
  useEffect,
  useRef,
} from "@elfui/core";
import { genMonotonePath } from "./monotone";
import styles from "./style.scss?inline";
import type {
  SparklineEmits,
  SparklineGradientDirection,
  SparklineItem,
  SparklineProps,
  SparklineSmoothMode,
  SparklineStrokeLinecap,
} from "./types";

export type {
  SparklineAutoDraw,
  SparklineEmits,
  SparklineGradientDirection,
  SparklineItem,
  SparklineProps,
  SparklineSmoothMode,
  SparklineStrokeLinecap,
  SparklineType,
} from "./types";

interface Point {
  x: number;
  y: number;
}

interface Bar {
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
}

interface GradientStop {
  color: string;
  offset: string;
}

const GRADIENT_ID = "sparkline-gradient";

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  itemValue: { type: String, default: "value" },
  width: { type: null, default: 300 },
  height: { type: null, default: 100 },
  color: { type: String, default: "var(--elf-primary)" },
  fill: { type: Boolean, default: false },
  fillColor: {
    type: String,
    default: "color-mix(in srgb, var(--elf-primary) 18%, transparent)",
  },
  lineWidth: { type: Number, default: 2 },
  smooth: { type: Number, default: 0 },
  strokeLinecap: { type: String, default: "round" },
  animation: { type: Boolean, default: false },
  animationDuration: { type: Number, default: 300 },
  autoDraw: { type: null, default: false },
  autoDrawDuration: { type: Number, default: 800 },
  autoDrawEasing: { type: String, default: "ease" },
  ariaLabel: { type: String, default: "Sparkline" },
  type: { type: String, default: "trend" },
  gradient: { type: Array, default: () => [] },
  gradientDirection: { type: String, default: "top" },
  labels: { type: Array, default: () => [] },
  showLabels: { type: Boolean, default: false },
  labelSize: { type: Number, default: 7 },
  autoLineWidth: { type: Boolean, default: false },
  showMarkers: { type: Boolean, default: false },
  markerSize: { type: Number, default: 8 },
  markerStroke: { type: String, default: "#fff" },
  inset: { type: Boolean, default: false },
  smoothMode: { type: String, default: "default" },
  interactive: { type: Boolean, default: false },
  padding: { type: Number, default: 0 },
  min: { type: null, default: null },
  max: { type: null, default: null },
});

const emit = defineEmits<SparklineEmits>();

const values = useRef<number[]>([]);
const frame = useRef(0);
const currentIndex = useRef<number | null>(null);

const valueOf = (item: SparklineItem): number => {
  if (typeof item === "number") return item;
  const key = String(props.itemValue || "value");
  return Number((item as Record<string, unknown>)[key]);
};

const sanitize = (source: unknown): number[] =>
  (Array.isArray(source) ? source : []).map(valueOf).filter(Number.isFinite);

const prefersReducedMotion = (): boolean =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

const animateTo = (next: number[]): void => {
  if (frame.value) cancelAnimationFrame(frame.value);
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
    if (progress < 1) frame.set(requestAnimationFrame(step));
    else frame.set(0);
  };
  frame.set(requestAnimationFrame(step));
};

useEffect(() => animateTo(sanitize(props.modelValue)));
onUnmounted(() => {
  if (frame.value) cancelAnimationFrame(frame.value);
});

const chartWidth = (): number => Math.max(1, Number(props.width) || 300);
const chartHeight = (): number => Math.max(1, Number(props.height) || 100);
const chartPadding = (): number => Math.max(0, Number(props.padding) || 0);
const labelSize = (): number => Math.max(1, Number(props.labelSize) || 7);
const smoothValue = (): number => Math.min(10, Math.max(0, Number(props.smooth) || 0));
const isBar = (): boolean => props.type === "bar";
const smoothMode = (): SparklineSmoothMode =>
  props.smoothMode === "monotone" ? "monotone" : "default";
const viewBox = (): string => `0 0 ${chartWidth().toFixed(1)} ${chartHeight().toFixed(1)}`;

const points = (): Point[] => {
  const source = values.value;
  if (source.length === 0) return [];
  const pad = chartPadding();
  const w = chartWidth();
  const h = chartHeight();
  const innerW = Math.max(1, w - pad * 2);
  const innerH = Math.max(1, h - pad * 2);
  const low = props.min != null ? Number(props.min) : Math.min(...source);
  const high = props.max != null ? Number(props.max) : Math.max(...source);
  const span = Math.max(1, high - low);
  return source.map((value, index) => ({
    x: pad + (source.length === 1 ? innerW / 2 : (index / (source.length - 1)) * innerW),
    y: pad + innerH - ((value - low) / span) * innerH,
  }));
};

const pathPoints = (): Point[] => {
  const source = points();
  if (!props.inset || source.length < 2) return source;
  const first = source[0]!;
  const second = source[1]!;
  const last = source.at(-1)!;
  const secondLast = source.at(-2)!;
  const startSlope = (second.y - first.y) / (second.x - first.x);
  const endSlope = (last.y - secondLast.y) / (last.x - secondLast.x);
  return [
    { x: 0, y: first.y - first.x * startSlope },
    ...source,
    { x: chartWidth(), y: last.y + (chartWidth() - last.x) * endSlope },
  ];
};

const linePath = (): string => {
  const source = pathPoints();
  if (source.length === 0) return "";
  if (smoothMode() === "monotone") {
    return genMonotonePath(source, smoothValue());
  }
  if (source.length < 3 || smoothValue() <= 0) {
    return source
      .map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(2)},${point.y.toFixed(2)}`)
      .join(" ");
  }
  const tension = smoothValue() / 10;
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
  const source = pathPoints();
  if (source.length === 0) return "";
  const h = chartHeight();
  return `${linePath()} L${source.at(-1)!.x.toFixed(2)},${h.toFixed(2)} L${source[0]!.x.toFixed(2)},${h.toFixed(2)} Z`;
};

const bars = (): Bar[] => {
  const source = values.value;
  if (source.length === 0) return [];
  const w = chartWidth();
  const h = chartHeight();
  const maxValue = props.max != null ? Number(props.max) : Math.max(...source);
  const rawMin = props.min != null ? Number(props.min) : Math.min(...source);
  const minValue = props.min == null && rawMin > 0 ? 0 : rawMin;
  const adjustedMax = props.max == null && maxValue < 0 ? 0 : maxValue;
  const span = Math.max(1, adjustedMax - minValue);
  const slot = w / (source.length === 1 ? 2 : source.length);
  const gridY = h / span;
  const horizonY = h - Math.abs(minValue * gridY);
  const rawWidth = props.autoLineWidth ? slot * 0.8 : Number(props.lineWidth) || 2;
  const barWidth = Math.max(0.5, Math.min(rawWidth, slot));
  return source.map((value, index) => {
    const barHeight = Math.abs(gridY * value);
    const x = index * slot + (slot - barWidth) / 2;
    const y = value < 0 ? horizonY : horizonY - barHeight;
    return { x, y, width: barWidth, height: barHeight, value };
  });
};

const barRadius = (bar: Bar): number => Math.min(smoothValue(), bar.width / 2);

const barStyle = (bar: Bar): Record<string, string> => ({
  "--sparkline-bar-origin": bar.value < 0 ? "top" : "bottom",
});

const linecap = (): SparklineStrokeLinecap => {
  const value = props.strokeLinecap;
  return value === "butt" || value === "square" ? value : "round";
};

const hasLabels = (): boolean => Boolean(props.showLabels || labelSource().length > 0);

const labelSource = (): string[] =>
  (Array.isArray(props.labels) ? props.labels : []).map((item) => String(item ?? ""));

const labelTexts = (): string[] => {
  const source = values.value;
  if (source.length === 0) return [];
  const labels = labelSource();
  return source.map((value, index) => String(labels[index] || value));
};

const hasGradient = (): boolean =>
  Array.isArray(props.gradient) &&
  props.gradient.some((item) => typeof item === "string" && item.length > 0);

const gradientStops = (): GradientStop[] => {
  const colors = (Array.isArray(props.gradient) ? props.gradient : []).filter(
    (item): item is string => typeof item === "string" && item.length > 0,
  );
  const list = colors.length ? [...colors].reverse() : [""];
  const last = Math.max(list.length - 1, 1);
  return list.map((color, index) => ({ color, offset: `${(index / last).toFixed(3)}` }));
};

const gradientDirection = (): SparklineGradientDirection =>
  props.gradientDirection === "left" ||
  props.gradientDirection === "right" ||
  props.gradientDirection === "bottom"
    ? props.gradientDirection
    : "top";

const gradientX1 = (): string => (gradientDirection() === "left" ? "100%" : "0");
const gradientY1 = (): string => (gradientDirection() === "top" ? "100%" : "0");
const gradientX2 = (): string => (gradientDirection() === "right" ? "100%" : "0");
const gradientY2 = (): string => (gradientDirection() === "bottom" ? "100%" : "0");

const markerSizePx = (): number => Math.max(4, Number(props.markerSize) || 8);
const showMarkers = (): boolean => !isBar() && Boolean(props.showMarkers);
const markerStyle = (point: Point): Record<string, string> => ({
  left: `${((point.x / chartWidth()) * 100).toFixed(3)}%`,
  top: `${((point.y / chartHeight()) * 100).toFixed(3)}%`,
});

const hoverPoint = (): Point | null =>
  currentIndex.value == null ? null : (points()[currentIndex.value] ?? null);

const showHover = (): boolean => Boolean(props.interactive && currentIndex.value != null);

const crosshairStyle = (): Record<string, string> => {
  const point = hoverPoint();
  return point ? { left: `${((point.x / chartWidth()) * 100).toFixed(3)}%` } : {};
};

const hoverMarkerStyle = (): Record<string, string> => {
  const point = hoverPoint();
  return point
    ? {
        left: `${((point.x / chartWidth()) * 100).toFixed(3)}%`,
        top: `${((point.y / chartHeight()) * 100).toFixed(3)}%`,
      }
    : {};
};

const barHighlightStyle = (): Record<string, string> => {
  if (currentIndex.value == null) return {};
  const list = bars();
  if (currentIndex.value >= list.length) return {};
  const slot = chartWidth() / (list.length === 1 ? 2 : list.length);
  return {
    left: `${((currentIndex.value * slot) / chartWidth()) * 100}%`,
    top: "0%",
    width: `${(slot / chartWidth()) * 100}%`,
    height: "100%",
  };
};

const setIndex = (index: number | null): void => {
  if (currentIndex.value === index) return;
  currentIndex.set(index);
  emit("update:currentIndex", index);
};

const onHover = (event: PointerEvent): void => {
  if (!props.interactive) return;
  const wrap = event.currentTarget as HTMLElement;
  const rect = wrap.getBoundingClientRect();
  if (rect.width === 0) return;
  const pointerX = ((event.clientX - rect.left) / rect.width) * chartWidth();
  const list: Array<Point | Bar> = isBar() ? bars() : points();
  if (list.length === 0) return;
  let nearest = 0;
  let minDistance = Infinity;
  list.forEach((item, index) => {
    const center = isBar() ? (item as Bar).x + (item as Bar).width / 2 : (item as Point).x;
    const distance = Math.abs(center - pointerX);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = index;
    }
  });
  setIndex(nearest);
};

const onLeave = (): void => {
  if (props.interactive) setIndex(null);
};

const onFocus = (): void => {
  const list = isBar() ? bars() : points();
  if (props.interactive && list.length) setIndex(list.length - 1);
};

const onBlur = (): void => {
  if (props.interactive) setIndex(null);
};

const onKeydown = (event: KeyboardEvent): void => {
  if (!props.interactive || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
  event.preventDefault();
  const list = isBar() ? bars() : points();
  if (!list.length) return;
  const direction = event.key === "ArrowLeft" ? -1 : 1;
  const current = currentIndex.value ?? (direction === 1 ? -1 : list.length);
  const next = Math.max(0, Math.min(list.length - 1, current + direction));
  setIndex(next);
};

const style = (): Record<string, string> => {
  const result: Record<string, string> = {
    "--sparkline-color": String(props.color),
    "--sparkline-fill-color": String(props.fillColor || props.color),
    "--sparkline-line-width": String(Math.max(0.5, Number(props.lineWidth) || 2)),
    "--sparkline-linecap": linecap(),
    "--sparkline-draw-duration": `${Math.max(0, Number(props.autoDrawDuration) || 800)}ms`,
    "--sparkline-draw-easing": String(props.autoDrawEasing || "ease"),
    "--sparkline-aspect": `${chartWidth()} / ${chartHeight()}`,
    "--sparkline-label-size": `${labelSize()}px`,
    "--sparkline-marker-size": `${markerSizePx()}px`,
    "--sparkline-marker-stroke": String(props.markerStroke || "#fff"),
  };
  if (hasGradient()) {
    const key = isBar() || props.fill ? "--sparkline-fill" : "--sparkline-stroke";
    result[key] = `url(#${GRADIENT_ID})`;
  }
  return result;
};

const shouldAutoDraw = (): boolean => {
  const value = props.autoDraw as unknown;
  return value === true || value === "once" || value === "always";
};

const barClass = (): Array<string | Record<string, boolean>> => [
  "bar",
  { "is-auto-draw": shouldAutoDraw() },
];

defineStyle(styles);

const Sparkline = defineHtml<SparklineProps>(`
  <div class="sparkline" :style=${style()}>
    <div
      class="sparkline-svg-wrap"
      :tabindex=${props.interactive ? 0 : undefined}
      :role=${props.interactive ? "img" : undefined}
      :aria-label=${props.interactive ? props.ariaLabel : undefined}
      @pointermove=${onHover}
      @pointerleave=${onLeave}
      @focus=${onFocus}
      @blur=${onBlur}
      @keydown=${onKeydown}
    >
      <svg
        class="sparkline-svg"
        :viewBox=${viewBox()}
        :role=${props.interactive ? undefined : "img"}
        :aria-label=${props.interactive ? undefined : props.ariaLabel}
        preserveAspectRatio="none"
      >
        <defs v-if=${hasGradient()}>
          <linearGradient :id=${GRADIENT_ID} gradientUnits="userSpaceOnUse" :x1=${gradientX1()} :y1=${gradientY1()} :x2=${gradientX2()} :y2=${gradientY2()}>
            <stop v-for="stop in gradientStops()" :key="stop.offset" :offset="stop.offset" :stop-color="stop.color || 'currentColor'"></stop>
          </linearGradient>
        </defs>
        <path v-if=${props.fill && !isBar()} class="area" :d=${areaPath()}></path>
        <path v-if=${!isBar()} :class=${["line", { "is-auto-draw": shouldAutoDraw() }]} :d=${linePath()}></path>
        <g v-if=${isBar()}>
          <rect v-for="(bar, index) in bars()" :key="index" :class=${barClass()} :style="barStyle(bar)" :x="bar.x" :y="bar.y" :width="bar.width" :height="bar.height" :rx="barRadius(bar)" :ry="barRadius(bar)"></rect>
        </g>
      </svg>
      <div v-if=${showHover()} class="sparkline-hover" aria-hidden="true">
        <span v-if=${!isBar()} class="sparkline-crosshair" :style=${crosshairStyle()}></span>
        <span v-if=${!isBar()} class="sparkline-hover-marker" :style=${hoverMarkerStyle()}></span>
        <span v-if=${isBar()} class="sparkline-bar-highlight" :style=${barHighlightStyle()}></span>
      </div>
      <div v-if=${showMarkers()} class="sparkline-markers" aria-hidden="true">
        <span v-for="(point, index) in points()" :key="index" class="sparkline-marker" :style="markerStyle(point)"></span>
      </div>
    </div>
    <div v-if=${hasLabels()} class="sparkline-labels">
      <span v-for="(label, index) in labelTexts()" :key="index" class="sparkline-label">{{ label }}</span>
    </div>
  </div>
`);

export { Sparkline };
