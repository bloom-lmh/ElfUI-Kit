import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useRef,
  useEffect,
} from "@elfui/core";

import styles from "./style.scss?inline";
import { useFormControl } from "../../../composables";
import { useFieldValueDefaults } from "../../../composables/field-values";
import { normalizeFieldVariant } from "../../../types/field";
import type {
  InputNumberControlsPosition,
  InputNumberControlVariant,
  InputNumberDensity,
  InputNumberProps,
  InputNumberSize,
} from "./types";

export type {
  InputNumberControlsPosition,
  InputNumberControlVariant,
  InputNumberDensity,
  InputNumberProps,
  InputNumberSize,
} from "./types";

const props = defineProps<InputNumberProps>({
  modelValue: { type: Number, default: undefined },
  min: { type: Number, default: undefined },
  max: { type: Number, default: undefined },
  step: { type: Number, default: 1 },
  stepStrictly: { type: Boolean, default: false },
  precision: { type: Number, default: undefined },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  controls: { type: Boolean, default: true },
  controlsPosition: { type: String, default: "" },
  controlVariant: { type: String, default: "default" },
  reverse: { type: Boolean, default: false },
  inset: { type: Boolean, default: false },
  hideInput: { type: Boolean, default: false },
  size: { type: String, default: "" },
  density: { type: String, default: "default" },
  variant: { type: String, default: "filled" },
  label: { type: String, default: "" },
  backgroundColor: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  name: { type: String, default: "" },
  valueOnClear: { type: Number, default: undefined },
  validateEvent: { type: Boolean, default: true },
});

const emit = defineEmits(["update:modelValue", "change", "input", "focus", "blur"]);
const fieldValues = useFieldValueDefaults();
const ctl = useFormControl<number | null>(props, emit, {
  ...(props.validateEvent === false
    ? { triggers: { input: false, change: false, blur: false } }
    : {}),
});

const current = useRef<number | null>(null);
const lastModel = useRef<string>("");

const numberOrNull = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const next = Number(value);
  return Number.isFinite(next) ? next : null;
};

const min = (): number => {
  const value = Number(props.min);
  return Number.isFinite(value) ? value : Number.NEGATIVE_INFINITY;
};

const max = (): number => {
  const value = Number(props.max);
  return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
};

const step = (): number => {
  const value = Math.abs(Number(props.step));
  return Number.isFinite(value) && value > 0 ? value : 1;
};

const precision = (): number | null => {
  const value = Number(props.precision);
  if (Number.isInteger(value) && value >= 0) return value;
  const stepText = String(props.step ?? "");
  const dot = stepText.indexOf(".");
  return dot >= 0 ? stepText.length - dot - 1 : null;
};

const applyPrecision = (value: number): number => {
  const p = precision();
  return p === null ? value : Number(value.toFixed(p));
};

const clamp = (value: number): number => Math.min(max(), Math.max(min(), value));

const normalize = (value: number | null): number | null => {
  if (value === null) return null;
  let next = value;
  if (props.stepStrictly) {
    const base = Number.isFinite(min()) ? min() : 0;
    next = base + Math.round((next - base) / step()) * step();
  }
  return applyPrecision(clamp(next));
};

useEffect(() => {
  const raw = numberOrNull(props.modelValue);
  const key = raw === null ? "" : String(raw);
  if (lastModel.peek() === key) return;
  lastModel.set(key);
  current.set(normalize(raw));
});

const displayValue = (): string => {
  const value = current.value;
  return value === null ? "" : String(value);
};

const canDecrease = (): boolean => {
  const value = current.value;
  return value !== null && value <= min();
};

const canIncrease = (): boolean => {
  const value = current.value;
  return value !== null && value >= max();
};

const commit = (value: number | null, eventName: "input" | "change"): void => {
  if (props.disabled || props.readonly) return;
  const next = normalize(value);
  current.set(next);
  lastModel.set(next === null ? "" : String(next));
  if (eventName === "input") ctl.dispatchInput(next);
  else {
    ctl.setValue(next);
    ctl.dispatchChange(next);
  }
};

const onInput = (event: Event): void => {
  const value = numberOrNull((event.target as HTMLInputElement).value);
  commit(
    value === null ? numberOrNull(fieldValues.valueOnClear(props.valueOnClear, () => null)) : value,
    "input",
  );
};

const onChange = (event: Event): void => {
  const value = numberOrNull((event.target as HTMLInputElement).value);
  commit(
    value === null ? numberOrNull(fieldValues.valueOnClear(props.valueOnClear, () => null)) : value,
    "change",
  );
};

const decrease = (): void => {
  const base = current.value ?? 0;
  commit(base - step(), "change");
};

const increase = (): void => {
  const base = current.value ?? 0;
  commit(base + step(), "change");
};

const normalizedSize = (): InputNumberSize => {
  const value = String(props.size || "") as InputNumberSize;
  return value === "sm" || value === "lg" ? value : "";
};

const normalizedControlsPosition = (): InputNumberControlsPosition =>
  props.controlsPosition === "right" ? "right" : "";

const normalizedControlVariant = (): InputNumberControlVariant => {
  if (!props.controls) return "hidden";
  if (props.controlsPosition === "right") return "stacked";
  const value = String(props.controlVariant || "default") as InputNumberControlVariant;
  return ["default", "stacked", "split", "hidden"].includes(value) ? value : "default";
};

const wrapperClass = (): Array<string | Record<string, boolean>> => [
  "input-number",
  `controls-${normalizedControlVariant()}`,
  { "is-reverse": props.reverse, "is-inset": props.inset, "hide-input": props.hideInput },
];

const showControls = (): boolean => normalizedControlVariant() !== "hidden";

const normalizedDensity = (): InputNumberDensity => {
  if (props.density === "comfortable" || props.density === "compact") return props.density;
  return "default";
};

const inputPlaceholder = (): string =>
  props.label.trim() && props.label.trim() === props.placeholder.trim() ? "" : props.placeholder;

useHostAttr("size", normalizedSize);
useHostAttr("density", normalizedDensity);
useHostAttr("controls-position", normalizedControlsPosition);
useHostAttr("variant", () => normalizeFieldVariant(props.variant));
useHostAttr("control-variant", normalizedControlVariant);
useHostFlag("disabled", () => Boolean(props.disabled));
useHostFlag("data-dirty", () => current.value !== null);
useHostFlag("data-has-label", () => Boolean(props.label));
useHostCssVar("--elf-field-custom-bg", () => props.backgroundColor || "");

// HTMLElement already provides focus/blur. Exposing those names would replace
// native host methods and produce a collision warning for every instance.
defineExpose({ decrease, increase });

defineStyle(styles);

const InputNumber = defineHtml<InputNumberProps>(`
  <div :class=${wrapperClass()} part="wrapper">
    <fieldset class="field-outline" aria-hidden="true"><legend><span v-if=${props.label}>${props.label}</span></legend></fieldset>
    <span v-if=${props.label} class="field-label" part="label">${props.label}</span>
    <button
      v-if=${showControls()}
      class="control decrease"
      part="decrease"
      type="button"
      :disabled=${props.disabled || props.readonly || canDecrease()}
      aria-label="Decrease"
      @click=${decrease}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10"></path></svg>
    </button>
    <input
      part="input"
      type="number"
      :name=${props.name || null}
      :placeholder=${inputPlaceholder()}
      :aria-label=${props.label || props.placeholder || null}
      :disabled=${props.disabled}
      :readonly=${props.readonly}
      :min=${Number.isFinite(min()) ? min() : null}
      :max=${Number.isFinite(max()) ? max() : null}
      :step=${step()}
      :value.prop=${displayValue()}
      role="spinbutton"
      :aria-valuemin=${Number.isFinite(min()) ? String(min()) : null}
      :aria-valuemax=${Number.isFinite(max()) ? String(max()) : null}
      :aria-valuenow=${current === null ? null : String(current)}
      @input=${onInput}
      @change=${onChange}
      @focus=${(event: Event) => ctl.dispatchFocus(event)}
      @blur=${(event: Event) => ctl.dispatchBlur(event)}
    />
    <button
      v-if=${showControls()}
      class="control increase"
      part="increase"
      type="button"
      :disabled=${props.disabled || props.readonly || canIncrease()}
      aria-label="Increase"
      @click=${increase}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M8 3v10"></path></svg>
    </button>
  </div>
`);

export { InputNumber };
