import {
  defineEmits,
  defineHtml,
  defineOptions,
  defineProps,
  defineStyle,
  useComponents,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useRef,
  useEffect,
} from "@elfui/core";

import { useFormControl } from "../../../composables";
import { normalizeFieldVariant } from "../../../types/field";
import { Tag } from "../../Basic/Tag";
import type { TagColor, TagEffect } from "../../Basic/Tag/types";
import styles from "./style.scss?inline";
import type { InputTagProps, InputTagSize } from "./types";

export type { InputTagProps, InputTagSize } from "./types";

interface TagItem {
  key: string;
  label: string;
  index: number;
}

useComponents(Tag);

const props = defineProps<InputTagProps>({
  modelValue: { type: Array, default: () => [] },
  placeholder: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  max: { type: Number, default: undefined },
  collapseTags: { type: Boolean, default: false },
  maxCollapseTags: { type: Number, default: 1 },
  size: { type: String, default: "" },
  variant: { type: String, default: "outlined" },
  label: { type: String, default: "" },
  backgroundColor: { type: String, default: "" },
  trigger: { type: String, default: "enter" },
  tagType: { type: String, default: "" },
  tagEffect: { type: String, default: "light" },
  draggable: { type: Boolean, default: false },
  validateEvent: { type: Boolean, default: true },
  name: { type: String, default: "" },
  form: { type: String, default: "" },
});

defineOptions({ formControl: true });

const emit = defineEmits([
  "update:modelValue",
  "change",
  "input",
  "add-tag",
  "remove-tag",
  "clear",
]);

const value = useRef<string[]>([]);
const hasTags = (): boolean => value.value.length > 0;
const text = useRef("");
const dragIndex = useRef<number | null>(null);
const ctl = useFormControl<string[]>(props, emit, {
  native: true,
  ...(props.validateEvent === false
    ? { triggers: { input: false, change: false, blur: false } }
    : {}),
});

const normalize = (source: unknown): string[] =>
  Array.isArray(source) ? source.map((item) => String(item)).filter(Boolean) : [];

useEffect(() => {
  value.set(normalize(props.modelValue));
});

const tags = (): TagItem[] =>
  value.value.map((label, index) => ({
    key: `${label}:${index}`,
    label,
    index,
  }));
const isLimitReached = (): boolean =>
  Number(props.max) > 0 && value.value.length >= Number(props.max);

const commit = (next: string[], eventName: "change" | "input" = "change"): void => {
  value.set(next);
  if (eventName === "input") ctl.dispatchInput(next);
  else {
    ctl.setValue(next);
    ctl.dispatchChange(next);
  }
};

const add = (): void => {
  const label = text.value.trim();
  if (!label || props.disabled || props.readonly || isLimitReached()) return;
  const next = [...value.value, label];
  text.set("");
  commit(next);
  emit("add-tag", label);
};

const removeAt = (index: number): void => {
  if (props.disabled || props.readonly) return;
  const removed = value.value[index];
  const next = value.value.filter((_, i) => i !== index);
  commit(next);
  emit("remove-tag", removed);
};

const clear = (): void => {
  if (props.disabled || props.readonly) return;
  text.set("");
  commit([]);
  emit("clear");
};

const onInput = (event: Event): void => {
  text.set((event.target as HTMLInputElement).value);
};

const onKeydown = (event: KeyboardEvent): void => {
  if (props.trigger === "enter" && (event.key === "Enter" || event.key === ",")) {
    event.preventDefault();
    add();
  } else if (event.key === "Backspace" && !text.value && value.value.length) {
    removeAt(value.value.length - 1);
  }
};

const onBlur = (event: Event): void => {
  if (props.trigger === "blur") add();
  ctl.dispatchBlur(event);
};

const onTagClose = (event: Event): void => {
  const index = Number((event.currentTarget as HTMLElement | null)?.dataset.index);
  if (Number.isInteger(index)) removeAt(index);
};

const onDragStart = (event: DragEvent): void => {
  if (!props.draggable || props.disabled || props.readonly) return;
  dragIndex.set(Number((event.currentTarget as HTMLElement).dataset.index));
  event.dataTransfer?.setData("text/plain", "input-tag");
};

const onDrop = (event: DragEvent): void => {
  event.preventDefault();
  const from = dragIndex.value;
  const to = Number((event.currentTarget as HTMLElement).dataset.index);
  dragIndex.set(null);
  if (!props.draggable || from === null || !Number.isInteger(to) || from === to) return;
  const next = [...value.value];
  const [moved] = next.splice(from, 1);
  if (!moved) return;
  next.splice(to, 0, moved);
  commit(next);
};

const showClear = (): boolean =>
  Boolean(props.clearable && value.value.length && !props.disabled && !props.readonly);

const normalizedSize = (): InputTagSize => {
  const size = String(props.size || "") as InputTagSize;
  return size === "sm" || size === "lg" ? size : "";
};

const tagSize = (): "sm" | "md" | "lg" => normalizedSize() || "md";

const TAG_COLORS: readonly TagColor[] = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
];
const TAG_EFFECTS: readonly TagEffect[] = ["dark", "light", "plain"];

const tagColor = (): TagColor => {
  const value = String(props.tagType || "primary") as TagColor;
  return TAG_COLORS.includes(value) ? value : "primary";
};

const tagEffect = (): TagEffect => {
  const value = String(props.tagEffect || "light") as TagEffect;
  return TAG_EFFECTS.includes(value) ? value : "light";
};

useHostAttr("size", normalizedSize);
useHostAttr("variant", () => normalizeFieldVariant(props.variant));
useHostFlag("disabled", () => Boolean(props.disabled));
useHostFlag("data-dirty", () => value.value.length > 0 || Boolean(text.value));
useHostFlag("data-has-label", () => Boolean(props.label));
useHostCssVar("--elf-field-custom-bg", () => props.backgroundColor || "");

defineStyle(styles);

const InputTag = defineHtml<InputTagProps>(`
    <div class="input-tag" part="wrapper">
        <fieldset class="field-outline" aria-hidden="true">
            <legend><span v-if=${props.label}>${props.label}</span></legend>
        </fieldset>
        <span v-if=${props.label} class="field-label" part="label">${props.label}</span>
        <slot name="prefix"></slot>
        <span class="tag-strip" part="tag-strip">
            <span
                v-for="tag in tags()"
                :key="tag.key"
                class="input-token"
                :data-index="tag.index"
                :draggable=${props.draggable}
                @dragstart=${onDragStart}
                @dragover=${(event: DragEvent) => props.draggable && event.preventDefault()}
                @drop=${onDrop}
            >
              <elf-tag
                :data-index="tag.index"
                :type=${tagColor()}
                :effect=${tagEffect()}
                :size=${tagSize()}
                :closable=${!props.disabled && !props.readonly}
                round
                part="tag"
                @close=${onTagClose}
              >
                <span class="tag-label">{{ tag.label }}</span>
              </elf-tag>
            </span>
            <input
                part="input"
                :value.prop=${text}
                :placeholder=${hasTags() ? "" : props.placeholder}
                :disabled=${props.disabled || isLimitReached()}
                :readonly=${props.readonly}
                @input=${onInput}
                @keydown=${onKeydown}
                @blur=${onBlur}
            />
        </span>
        <slot name="suffix"></slot>
        <button v-if=${showClear()} class="clear" type="button" aria-label="Clear tags" @click=${clear}>
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 4l8 8M12 4l-8 8"></path></svg>
        </button>
    </div>
`);

export { InputTag };
