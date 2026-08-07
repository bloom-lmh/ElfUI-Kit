import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineModel,
  defineProps,
  defineStyle,
  onMounted,
  useEffect,
  useHostFlag,
  useRef,
  useTemplateRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type {
  ChatComposerEmits,
  ChatComposerExpose,
  ChatComposerLabels,
  ChatComposerProps,
} from "./types";

export type {
  ChatComposerElement,
  ChatComposerEmits,
  ChatComposerExpose,
  ChatComposerLabels,
  ChatComposerProps,
} from "./types";

const DEFAULT_LABELS: ChatComposerLabels = {
  send: "Send message",
  stop: "Stop generating",
  hint: "Enter to send · Shift+Enter for a new line",
};

const props = defineProps<ChatComposerProps>({
  placeholder: { type: String, default: "Type a message..." },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  maxlength: { type: Number, default: 0 },
  rows: { type: Number, default: 1 },
  maxRows: { type: Number, default: 8 },
  submitOnEnter: { type: Boolean, default: true },
  labels: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "Message input" },
  autofocus: { type: Boolean, default: false },
});

const model = defineModel<string>("modelValue", { default: "" });
const emit = defineEmits<ChatComposerEmits>(["send", "stop", "focus", "blur"]);
const input = useTemplateRef<HTMLTextAreaElement>("input");
const composing = useRef(false);
let resizeFrame: number | null = null;

const label = (key: keyof ChatComposerLabels): string =>
  props.labels?.[key] || DEFAULT_LABELS[key] || key;
const hasText = (): boolean => model.value.trim().length > 0;
const hint = (): string => label("hint");
const sendDisabled = (): boolean => props.disabled || props.loading || !hasText();

const resizeInput = (): void => {
  const textarea = input.value;
  if (!textarea) return;
  const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 20;
  const maxHeight = props.maxRows * lineHeight + 18;
  textarea.style.height = "auto";
  const next = Math.min(textarea.scrollHeight, maxHeight);
  textarea.style.height = `${next}px`;
  textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
};

const scheduleResize = (): void => {
  if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(resizeInput);
};

const focus = (): void => input.value?.focus();
const blur = (): void => input.value?.blur();
const clear = (): void => {
  model.set("");
  scheduleResize();
};
const getValue = (): string => model.value;

const send = (): void => {
  const content = model.value.trim();
  if (!content || sendDisabled()) return;
  emit("send", content);
  model.set("");
  scheduleResize();
  focus();
};

const onInput = (event: Event): void => {
  model.set((event.currentTarget as HTMLTextAreaElement).value);
  scheduleResize();
};

const onKeydown = (event: KeyboardEvent): void => {
  if (!props.submitOnEnter || composing.value) return;
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    send();
  }
};

const onCompositionStart = (): void => composing.set(true);
const onCompositionEnd = (): void => composing.set(false);
const onFocus = (): void => {
  emit("focus");
};
const onBlur = (): void => {
  emit("blur");
};
const onStop = (): void => {
  emit("stop");
};

useHostFlag("data-disabled", () => props.disabled);
useHostFlag("data-loading", () => props.loading);
useHostFlag("data-empty", () => !hasText());

onMounted(() => {
  scheduleResize();
  if (props.autofocus) focus();
  return () => {
    if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
    resizeFrame = null;
  };
});

useEffect(scheduleResize);

defineExpose<ChatComposerExpose>(
  { focus, blur, clear, getValue },
  { overrideNative: ["focus", "blur"] },
);

defineStyle(styles);

const ChatComposer = defineHtml(`
  <div class="composer">
    <div class="field">
      <textarea
        ref="input"
        class="input"
        :value=${model.value}
        :placeholder=${props.placeholder}
        :disabled=${props.disabled}
        :maxlength=${props.maxlength || null}
        :rows=${props.rows}
        :aria-label=${props.ariaLabel}
        @input=${onInput}
        @keydown=${onKeydown}
        @compositionstart=${onCompositionStart}
        @compositionend=${onCompositionEnd}
        @focus=${onFocus}
        @blur=${onBlur}
      ></textarea>
    </div>
    <div class="bar">
      <span
        v-if=${hint()}
        class="hint"
      >${hint()}</span>
      <span class="spacer"></span>
      <button
        v-if=${props.loading}
        class="stop"
        type="button"
        :aria-label=${label("stop")}
        :title=${label("stop")}
        @click=${onStop}
      >
        <span
          class="stop-icon"
          aria-hidden="true"
        ></span>
      </button>
      <button
        v-else
        class="send"
        type="button"
        :aria-label=${label("send")}
        :title=${label("send")}
        :disabled=${sendDisabled()}
        @click=${send}
      >
        <span
          class="send-icon"
          aria-hidden="true"
        ></span>
      </button>
    </div>
  </div>
`);

export { ChatComposer };
