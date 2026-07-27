import {
  defineEmits,
  inject,
  defineExpose,
  defineProps,
  defineStyle,
  useComputed,
  useEventListener,
  useEffect,
  useHostAttr,
  useHostFlag,
  useRef,
  defineHtml
} from "@elfui/core";

import { useDisabled, useFormItem } from "../../../composables";
import { FORM_ITEM_KEY } from "../context";
import styles from "./style.scss?inline";
import type { SliderInputSize, SliderMark, SliderModelValue, SliderSize } from "./types";

export type {
  SliderInputSize,
  SliderMark,
  SliderMarks,
  SliderModelValue,
  SliderProps,
  SliderSize
} from "./types";

type SliderValue = number | [number, number];
type RangeThumb = "start" | "end";

interface StopView {
  key: string;
  value: number;
}

interface SegmentView {
  key: string;
  start: number;
  end: number;
}

interface MarkView extends SliderMark {
  key: string;
}

const readNumber = (value: unknown, fallback = 0): number => {
  const next = Number(value ?? fallback);
  return Number.isFinite(next) ? next : fallback;
};

const props = defineProps({
  modelValue: { type: null, default: 0 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  range: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  vertical: { type: Boolean, default: false },
  showTooltip: { type: Boolean, default: true },
  showStops: { type: Boolean, default: false },
  segmented: { type: Boolean, default: false },
  showInput: { type: Boolean, default: false },
  showInputControls: { type: Boolean, default: true },
  inputSize: { type: String, default: "" },
  marks: { type: null, default: () => [] },
  color: { type: String, default: "" },
  size: { type: String, default: "" },
  formatTooltip: { type: Function, default: undefined },
  formatValueText: { type: Function, default: undefined },
  height: { type: null, default: undefined },
  ariaLabel: { type: String, default: "" },
  rangeStartLabel: { type: String, default: "" },
  rangeEndLabel: { type: String, default: "" },
  tooltipClass: { type: String, default: "" },
  placement: { type: String, default: "top" },
  persistent: { type: Boolean, default: true },
  label: { type: String, default: "" },
  validateEvent: { type: Boolean, default: true }
});

const emit = defineEmits(["update:modelValue", "input", "change"]);

const fi = useFormItem(() => props.size as SliderSize);
const formItem = inject(FORM_ITEM_KEY);

const isDisabled = useDisabled(() => Boolean(props.disabled));

const innerValue = useRef<SliderValue>(0);

const activeThumb = useRef<RangeThumb | null>(null);

const activeTrack = useRef<HTMLElement | null>(null);

const nextDescriptionId = (): string => {
  const store = globalThis as typeof globalThis & { __elfSliderDescriptionSeed?: number };
  store.__elfSliderDescriptionSeed = (store.__elfSliderDescriptionSeed ?? 0) + 1;
  return `elf-slider-description-${store.__elfSliderDescriptionSeed}`;
};

const descriptionId = nextDescriptionId();

const min = (): number => readNumber(props.min, 0);

const max = (): number => Math.max(min(), readNumber(props.max, 100));

const step = (): number => Math.max(0.000001, readNumber(props.step, 1));

const clamp = (value: number): number => Math.min(max(), Math.max(min(), value));

const snap = (value: number): number => {
  const base = min();
  const stepped = Math.round((clamp(value) - base) / step()) * step() + base;
  return Number(clamp(stepped).toFixed(6));
};

const snapSegment = (value: number): number => {
  const snapped = snap(value);
  if (!props.segmented) return snapped;
  const points = segmentBoundaries();
  if (points.length <= 1) return snapped;
  return points.reduce((best, point) =>
    Math.abs(point - snapped) < Math.abs(best - snapped) ? point : best
  );
};

const normalizeValue = (value: unknown): SliderValue => {
  if (props.range) {
    const source = Array.isArray(value) ? value : [min(), value ?? max()];
    const a = snap(readNumber(source[0], min()));
    const b = snap(readNumber(source[1], max()));
    return a <= b ? [a, b] : [b, a];
  }
  return snap(readNumber(Array.isArray(value) ? value[0] : value, min()));
};

useEffect(() => {
  innerValue.set(normalizeValue(props.modelValue));
});

useHostFlag("disabled", isDisabled);

useHostFlag("readonly", () => Boolean(props.readonly));

useHostFlag("vertical", () => Boolean(props.vertical));

useHostAttr("size", () => fi.formSize);

const values = (): [number, number] => {
  const value = innerValue.value;
  return Array.isArray(value) ? value : [min(), value];
};

const singleValue = (): number => {
  const value = innerValue.value;
  return Array.isArray(value) ? value[1] : value;
};

const percent = (value: number): number => {
  const span = max() - min();
  if (span <= 0) return 0;
  return ((clamp(value) - min()) / span) * 100;
};

const emitValue = (value: SliderValue, change = false): void => {
  innerValue.set(value);
  const payload: SliderModelValue = Array.isArray(value) ? [value[0], value[1]] : value;
  emit("update:modelValue", payload);
  emit("input", payload);
  if (change) {
    emit("change", payload);
    if (props.validateEvent) formItem?.validateTrigger("change");
  }
};

const updateSingle = (raw: unknown, change = false): void => {
  if (isDisabled() || props.readonly) return;
  emitValue(snapSegment(readNumber(raw, singleValue())), change);
};

const updateRange = (thumb: "start" | "end", raw: unknown, change = false): void => {
  if (isDisabled() || props.readonly) return;
  const [start, end] = values();
  const next = snapSegment(readNumber(raw, thumb === "start" ? start : end));
  let value: [number, number];
  if (thumb === "start" && next > end) {
    activeThumb.set("end");
    value = [end, next];
  } else if (thumb === "end" && next < start) {
    activeThumb.set("start");
    value = [next, start];
  } else {
    value = thumb === "start" ? [next, end] : [start, next];
  }
  emitValue(value, change);
};

const onSingleInput = (event: Event): void =>
  updateSingle((event.target as HTMLInputElement).value);

const onSingleChange = (event: Event): void =>
  updateSingle((event.target as HTMLInputElement).value, true);

const onStartInput = (event: Event): void =>
  updateRange("start", (event.target as HTMLInputElement).value);

const onStartChange = (event: Event): void =>
  updateRange("start", (event.target as HTMLInputElement).value, true);

const onEndInput = (event: Event): void =>
  updateRange("end", (event.target as HTMLInputElement).value);

const onEndChange = (event: Event): void =>
  updateRange("end", (event.target as HTMLInputElement).value, true);

const onNumberChange = (event: Event): void =>
  updateSingle((event.target as HTMLInputElement).value, true);

const onNumberInput = (event: Event): void =>
  updateSingle((event.target as HTMLInputElement).value);

const pointerValue = (event: PointerEvent, track: HTMLElement): number => {
  const rect = track.getBoundingClientRect();
  const span = props.vertical ? rect.height : rect.width;
  if (span <= 0) return values()[0];
  const offset = props.vertical ? rect.bottom - event.clientY : event.clientX - rect.left;
  const ratio = Math.min(1, Math.max(0, offset / span));
  return snapSegment(min() + ratio * (max() - min()));
};

const thumbFromTarget = (target: EventTarget | null): RangeThumb | null => {
  if (!(target instanceof Element)) return null;
  if (target.closest(".thumb-start")) return "start";
  if (target.closest(".thumb-end")) return "end";
  return null;
};

const closestThumb = (value: number): RangeThumb => {
  const [start, end] = values();
  const startDistance = Math.abs(value - start);
  const endDistance = Math.abs(value - end);
  if (startDistance === endDistance) return value <= (start + end) / 2 ? "start" : "end";
  return startDistance < endDistance ? "start" : "end";
};

const updateThumbFromPointer = (
  thumb: RangeThumb,
  event: PointerEvent,
  track: HTMLElement,
  change = false
): void => {
  updateRange(thumb, pointerValue(event, track), change);
};

const onRangePointerDown = (event: PointerEvent): void => {
  if (!props.range || isDisabled() || props.readonly) return;
  const track = event.currentTarget;
  if (!(track instanceof HTMLElement)) return;
  const next = pointerValue(event, track);
  const thumb = thumbFromTarget(event.target) ?? closestThumb(next);
  event.preventDefault();
  activeThumb.set(thumb);
  activeTrack.set(track);
  updateRange(thumb, next);
};

useEventListener<PointerEvent>(document, "pointermove", (event) => {
  const thumb = activeThumb.peek();
  const track = activeTrack.peek();
  if (!thumb || !track) return;
  event.preventDefault();
  updateThumbFromPointer(thumb, event, track);
});

useEventListener<PointerEvent>(document, "pointerup", (event) => {
  const thumb = activeThumb.peek();
  const track = activeTrack.peek();
  if (!thumb || !track) return;
  event.preventDefault();
  updateThumbFromPointer(thumb, event, track, true);
  activeThumb.set(null);
  activeTrack.set(null);
});

const formatValue = (value: number): string => {
  if (typeof props.formatTooltip === "function") {
    try {
      return String(props.formatTooltip(value));
    } catch {
      return String(value);
    }
  }
  return String(value);
};

const valueText = (value: number): string => {
  if (typeof props.formatValueText === "function") return String(props.formatValueText(value));
  return formatValue(value);
};

const sliderLabel = (): string => props.label || props.ariaLabel || "Slider";

const rangeLabel = (thumb: RangeThumb): string =>
  thumb === "start"
    ? props.rangeStartLabel || props.label || props.ariaLabel || "Range start"
    : props.rangeEndLabel || props.label || props.ariaLabel || "Range end";

const tooltipPlacement = (): "top" | "bottom" | "left" | "right" => {
  const placement = props.placement;
  return placement === "bottom" || placement === "left" || placement === "right"
    ? placement
    : "top";
};

const inputSize = (): SliderInputSize | "" => {
  const size = props.inputSize;
  if (size === "small") return "sm";
  if (size === "large") return "lg";
  if (size === "default") return "md";
  return size === "sm" || size === "md" || size === "lg" ? size : "";
};

const rootStyle = useComputed(() => {
  const [start, end] = values();
  const activeStart = props.range ? percent(start) : 0;
  const activeEnd = props.range ? percent(end) : percent(singleValue());
  return {
    "--slider-start": `${activeStart}%`,
    "--slider-end": `${activeEnd}%`,
    ...(props.color ? { "--slider-color": String(props.color) } : {}),
    ...(props.height !== undefined && props.height !== null ? { "--slider-height": typeof props.height === "number" ? `${props.height}px` : String(props.height) } : {})
  };
});

const pointStyle = (value: number): Record<string, string> =>
  props.vertical ? { bottom: `${percent(value)}%` } : { left: `${percent(value)}%` };

const itemPointStyle = (item: Pick<MarkView | StopView, "value">): Record<string, string> =>
  pointStyle(item.value);

const marks = (): MarkView[] => {
  const source = props.marks as unknown;
  if (Array.isArray(source)) {
    return source
      .map((mark) =>
        typeof mark === "number"
          ? { key: String(mark), value: mark, label: String(mark) }
          : {
              key: String((mark as SliderMark).value),
              value: readNumber((mark as SliderMark).value, min()),
              label: String((mark as SliderMark).label ?? (mark as SliderMark).value ?? "")
            }
      )
      .filter((mark) => mark.value >= min() && mark.value <= max());
  }
  if (source && typeof source === "object") {
    return Object.entries(source as Record<string, string | number>)
      .map(([value, label]) => ({ key: value, value: readNumber(value, min()), label: String(label) }))
      .filter((mark) => mark.value >= min() && mark.value <= max());
  }
  return [];
};

const stops = (): StopView[] => {
  if (!props.showStops) return [];
  const total = Math.floor((max() - min()) / step());
  if (total <= 1 || total > 100) return [];
  return Array.from({ length: total - 1 }, (_, index) => {
    const value = min() + (index + 1) * step();
    return { key: String(value), value };
  });
};

const segmentBoundaries = (): number[] => {
  const fromMarks = marks()
    .map((mark) => mark.value)
    .filter((value) => value > min() && value < max());
  if (fromMarks.length > 0) {
    return Array.from(new Set([min(), ...fromMarks, max()])).sort((a, b) => a - b);
  }

  const total = Math.floor((max() - min()) / step());
  if (total > 0 && total <= 20) {
    return Array.from({ length: total + 1 }, (_, index) =>
      index === total ? max() : min() + index * step()
    );
  }

  return Array.from({ length: 11 }, (_, index) => min() + ((max() - min()) / 10) * index);
};

const segments = (): SegmentView[] => {
  if (!props.segmented) return [];
  const boundaries = segmentBoundaries();
  return boundaries.slice(0, -1).map((start, index) => ({
    key: `${start}-${boundaries[index + 1]}`,
    start,
    end: boundaries[index + 1] ?? start
  }));
};

const segmentStyle = (segment: SegmentView): Record<string, string> => {
  const start = percent(segment.start);
  const end = percent(segment.end);
  const size = Math.max(0, end - start);
  const activeStart = props.range ? values()[0] : min();
  const activeEnd = props.range ? values()[1] : singleValue();
  const segmentSize = Math.max(0, segment.end - segment.start);
  const filled = Math.max(
    0,
    Math.min(1, (Math.min(activeEnd, segment.end) - Math.max(activeStart, segment.start)) / segmentSize)
  );
  return {
    "--segment-fill": `${filled * 100}%`,
    ...(props.vertical
      ? { bottom: `${start}%`, height: `calc(${size}% - 2px)` }
      : { left: `${start}%`, width: `calc(${size}% - 2px)` })
  };
};

const isSegmentActive = (segment: SegmentView): boolean => {
  if (props.range) {
    const [start, end] = values();
    return segment.end > start && segment.start < end;
  }
  return segment.start < singleValue();
};

const isActiveThumb = (thumb: RangeThumb): boolean => activeThumb.value === thumb;

const setValue = (value: SliderValue): void => emitValue(normalizeValue(value), true);

const clear = (): void => setValue(props.range ? [min(), min()] : min());

defineExpose({ clear, setValue });

defineStyle(styles);

const Slider = defineHtml(`
  <div
    :class=${[
      "slider",
      {
        "is-range": props.range,
        "is-vertical": props.vertical,
        "is-disabled": isDisabled(),
        "is-readonly": props.readonly,
        "has-input": props.showInput && !props.range,
        "is-segmented": props.segmented
      }
    ]}
    :style=${rootStyle}
  >
    <div class="slider-main" @pointerdown=${onRangePointerDown}>
      <div class="track" part="track">
        <span v-if=${segments().length > 0} class="segments">
          <span
            v-for="segment in segments()"
            :key="segment.key"
            :class="['segment', { 'is-active': isSegmentActive(segment) }]"
            :style="segmentStyle(segment)"
          ></span>
        </span>
        <span class="track-fill"></span>
        <span
          v-for="stop in stops()"
          :key="stop.key"
          class="stop step-stop"
          :style="itemPointStyle(stop)"
        ></span>
        <span
          v-for="mark in marks()"
          :key="'mark-' + mark.key"
          class="stop mark-stop"
          :style="itemPointStyle(mark)"
        ></span>
      </div>

      <input
        v-if=${!props.range}
        class="native native-single"
        type="range"
        :min=${min()}
        :max=${max()}
        :step=${step()}
        :value=${singleValue()}
        :disabled=${isDisabled() || props.readonly}
        @input=${onSingleInput}
        @change=${onSingleChange}
        :aria-label=${sliderLabel()}
        :aria-valuetext=${valueText(singleValue())}
        :aria-describedby=${`${descriptionId}-single`}
      />
      <template v-else>
        <input
          class="native native-start"
          type="range"
          :min=${min()}
          :max=${max()}
          :step=${step()}
          :value=${values()[0]}
          :disabled=${isDisabled() || props.readonly}
          @input=${onStartInput}
          @change=${onStartChange}
          :aria-label=${rangeLabel("start")}
          :aria-valuetext=${valueText(values()[0])}
          :aria-describedby=${`${descriptionId}-start`}
        />
        <input
          class="native native-end"
          type="range"
          :min=${min()}
          :max=${max()}
          :step=${step()}
          :value=${values()[1]}
          :disabled=${isDisabled() || props.readonly}
          @input=${onEndInput}
          @change=${onEndChange}
          :aria-label=${rangeLabel("end")}
          :aria-valuetext=${valueText(values()[1])}
          :aria-describedby=${`${descriptionId}-end`}
        />
      </template>

      <span v-if=${!props.range} class="thumb" :style=${pointStyle(singleValue())}>
        <span
          v-if=${props.showTooltip}
          :class=${["tooltip", `placement-${tooltipPlacement()}`, props.tooltipClass]}
        >${formatValue(singleValue())}</span>
      </span>
      <template v-else>
        <span
          :class=${["thumb", "thumb-start", { "is-active": isActiveThumb("start") }]}
          :style=${pointStyle(values()[0])}
        >
          <span
            v-if=${props.showTooltip}
            :class=${["tooltip", `placement-${tooltipPlacement()}`, props.tooltipClass]}
          >${formatValue(values()[0])}</span>
        </span>
        <span
          :class=${["thumb", "thumb-end", { "is-active": isActiveThumb("end") }]}
          :style=${pointStyle(values()[1])}
        >
          <span
            v-if=${props.showTooltip}
            :class=${["tooltip", `placement-${tooltipPlacement()}`, props.tooltipClass]}
          >${formatValue(values()[1])}</span>
        </span>
      </template>

      <span v-if=${!props.range} :id=${`${descriptionId}-single`} class="sr-description" aria-live="polite">
        ${sliderLabel()}: ${valueText(singleValue())}
      </span>
      <template v-else>
        <span :id=${`${descriptionId}-start`} class="sr-description" aria-live="polite">
          ${rangeLabel("start")}: ${valueText(values()[0])}
        </span>
        <span :id=${`${descriptionId}-end`} class="sr-description" aria-live="polite">
          ${rangeLabel("end")}: ${valueText(values()[1])}
        </span>
      </template>

      <div v-if=${marks().length > 0} class="marks">
        <span
          v-for="mark in marks()"
          :key="mark.key"
          class="mark"
          :style="itemPointStyle(mark)"
        >
          {{ mark.label }}
        </span>
      </div>
    </div>

    <input
      v-if=${props.showInput && !props.range}
      :class=${[
        "number-input",
        { "without-controls": !props.showInputControls },
        inputSize() ? `size-${inputSize()}` : ""
      ]}
      type="number"
      :min=${min()}
      :max=${max()}
      :step=${step()}
      :value=${singleValue()}
      :disabled=${isDisabled() || props.readonly}
      :aria-label=${sliderLabel()}
      @input=${onNumberInput}
      @change=${onNumberChange}
    />
  </div>
`);

export { Slider };
