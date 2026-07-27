import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  useHost,
  useHostAttr
} from "@elfui/core";

import styles from "./style.scss?inline";
import { useFormControl } from "../../../composables";
import type { InputOtpProps, InputOtpSize, InputOtpType } from "./types";

export type { InputOtpProps, InputOtpSize, InputOtpType } from "./types";

interface OtpCell {
  index: number;
  char: string;
}

const props = defineProps<InputOtpProps>({
  modelValue: { type: String, default: "" },
  length: { type: Number, default: 6 },
  type: { type: String, default: "text" },
  size: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  placeholder: { type: String, default: "" },
  separator: { type: String, default: "" },
  formatter: { type: Function, default: undefined },
  parser: { type: Function, default: undefined },
  mask: { type: Boolean, default: false },
  validateEvent: { type: Boolean, default: true }
});

const emit = defineEmits(["update:modelValue", "input", "change", "focus", "blur"]);
const host = useHost();
const ctl = useFormControl<string>(props, emit, {
  ...(props.validateEvent === false
    ? { triggers: { input: false, change: false, blur: false } }
    : {})
});

const length = (): number => Math.min(12, Math.max(1, Number(props.length) || 6));
const formattedValue = (): string =>
  typeof props.formatter === "function" ? String(props.formatter(String(props.modelValue || ""))) : String(props.modelValue || "");
const chars = (): string[] =>
  formattedValue()
    .split("")
    .slice(0, length());
const displayChar = (value: string): string => (props.mask && value ? "•" : value);
const cells = (): OtpCell[] =>
  Array.from({ length: length() }, (_, index) => ({ index, char: chars()[index] || "" }));

const normalizeChar = (value: string): string => {
  const char = value.slice(-1);
  if (props.type === "number") return char.replace(/\D/g, "");
  return char;
};

const updateAt = (index: number, value: string, eventName: "input" | "change"): void => {
  if (props.disabled || props.readonly) return;
  const next = chars();
  next[index] = normalizeChar(value);
  const raw = next.join("").slice(0, length());
  const output = typeof props.parser === "function" ? String(props.parser(raw)) : raw;
  if (eventName === "input") ctl.dispatchInput(output);
  else {
    ctl.setValue(output);
    ctl.dispatchChange(output);
  }
};

const inputAt = (index: number): HTMLInputElement | null =>
  host.shadowRoot?.querySelector(`input[data-index="${index}"]`) as HTMLInputElement | null;

const focusAt = (index: number): void =>
  inputAt(Math.min(length() - 1, Math.max(0, index)))?.focus();

const onInput = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  const index = Number(input.dataset.index);
  updateAt(index, input.value, "input");
  if (input.value) focusAt(index + 1);
};

const onChange = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  updateAt(Number(input.dataset.index), input.value, "change");
};

const onKeydown = (event: KeyboardEvent): void => {
  const input = event.target as HTMLInputElement;
  const index = Number(input.dataset.index);
  if (event.key === "Backspace" && !input.value && index > 0) focusAt(index - 1);
};

const onPaste = (event: ClipboardEvent): void => {
  if (props.disabled || props.readonly) return;
  event.preventDefault();
  const text = event.clipboardData?.getData("text") || "";
  const raw = text.split("").map(normalizeChar).join("").slice(0, length());
  const output = typeof props.parser === "function" ? String(props.parser(raw)) : raw;
  ctl.dispatchInput(output);
  ctl.dispatchChange(output);
};

const inputType = (): string => (props.type === "password" ? "password" : "text");
const inputMode = (): string | null => (props.type === "number" ? "numeric" : null);

const normalizedSize = (): InputOtpSize => {
  const value = String(props.size || "") as InputOtpSize;
  return value === "sm" || value === "lg" ? value : "";
};

useHostAttr("size", normalizedSize);
defineStyle(styles);

const InputOtp = defineHtml<InputOtpProps>(`
  <div class="otp" part="otp" @paste=${onPaste}>
    <template v-for="cell in cells()" :key="cell.index">
      <input
        class="cell"
        part="input"
        maxlength="1"
        :data-index="cell.index"
        :type=${inputType()}
        :inputmode=${inputMode()}
        :value.prop="displayChar(cell.char)"
        :placeholder=${props.placeholder}
        :disabled=${props.disabled}
        :readonly=${props.readonly}
        @input=${onInput}
        @change=${onChange}
        @keydown=${onKeydown}
        @focus=${(event: Event) => ctl.dispatchFocus(event)}
        @blur=${(event: Event) => ctl.dispatchBlur(event)}
      />
      <span v-if="props.separator && cell.index < length() - 1" class="separator"
        ><slot name="separator">${props.separator}</slot></span
      >
    </template>
  </div>
`);

export { InputOtp };
