import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  useEffect,
  useHostAttr,
  useRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type {
  AiApprovalAnswerDetail,
  AiApprovalCardEmits,
  AiApprovalCardExpose,
  AiApprovalCardProps,
  AiApprovalLabels,
  AiApprovalOption,
  AiApprovalQuestion,
} from "./types";

export type {
  AiApprovalAnswerDetail,
  AiApprovalCardElement,
  AiApprovalCardEmits,
  AiApprovalCardExpose,
  AiApprovalCardProps,
  AiApprovalLabels,
  AiApprovalOption,
  AiApprovalQuestion,
} from "./types";

const DEFAULT_LABELS: AiApprovalLabels = {
  question: "Question",
  of: "of",
  dismiss: "Dismiss",
  custom: "Custom answer",
  previous: "Previous",
  next: "Next",
  confirm: "Confirm",
};

const props = defineProps<AiApprovalCardProps>({
  questions: { type: Array, default: () => [] },
  defaultIndex: { type: Number, default: 0 },
  confirmLabel: { type: String, default: "" },
  dismissLabel: { type: String, default: "" },
  required: { type: Boolean, default: true },
  showProgress: { type: Boolean, default: true },
  labels: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "" },
});

const emit = defineEmits<AiApprovalCardEmits>(["confirm", "dismiss", "change", "question-change"]);
const currentIndex = useRef(0);
const selectedOption = useRef("");
const customInput = useRef("");
let lastQuestionsKey = "";

const label = (key: keyof AiApprovalLabels): string =>
  props.labels?.[key] || DEFAULT_LABELS[key] || key;
const clampIndex = (value: number): number =>
  Math.min(Math.max(0, Number(value) || 0), Math.max(0, props.questions.length - 1));
const questionsKey = (): string =>
  props.questions.map((question) => String(question.id ?? question.title)).join("\u0000");
const currentQuestion = (): AiApprovalQuestion =>
  props.questions[clampIndex(currentIndex.value)] || {
    title: "",
    options: [],
  };
const options = (): AiApprovalOption[] => currentQuestion().options || [];
const hasOptions = (): boolean => options().length > 0;
const hasCustom = (): boolean => Boolean(currentQuestion().customPlaceholder);
const customPlaceholder = (): string => currentQuestion().customPlaceholder || label("custom");
const selectedValue = (): string => customInput.value.trim() || selectedOption.value || "";
const canConfirm = (): boolean => !props.required || Boolean(selectedValue());
const questionCount = (): number => props.questions.length;
const isFirst = (): boolean => clampIndex(currentIndex.value) === 0;
const isLast = (): boolean => clampIndex(currentIndex.value) >= props.questions.length - 1;
const confirmText = (): string => props.confirmLabel || label("confirm");
const dismissText = (): string => props.dismissLabel || label("dismiss");
const optionActive = (option: AiApprovalOption): boolean => selectedOption.value === option.value;
const progressLabel = (): string =>
  `${clampIndex(currentIndex.value) + 1} ${label("of")} ${Math.max(questionCount(), 1)}`;
const hostLabel = (): string =>
  props.ariaLabel || `${label("question")}: ${currentQuestion().title || ""} · ${progressLabel()}`;

const syncQuestion = (): void => {
  currentIndex.set(clampIndex(props.defaultIndex));
  selectedOption.set("");
  customInput.set("");
};

useEffect(() => {
  const key = questionsKey();
  if (key !== lastQuestionsKey) {
    lastQuestionsKey = key;
    syncQuestion();
  }
});

const onOptionClick = (event: Event): void => {
  const value = (event.currentTarget as HTMLElement).dataset.value || "";
  const option = options().find((entry) => entry.value === value);
  if (!option) return;
  selectedOption.set(option.value);
  customInput.set("");
  emit("change", {
    index: clampIndex(currentIndex.value),
    value: option.value,
  });
};
const onCustomInput = (event: Event): void => {
  const value = (event.currentTarget as HTMLInputElement).value;
  customInput.set(value);
  if (value.trim()) selectedOption.set("");
  emit("change", {
    index: clampIndex(currentIndex.value),
    value: value.trim() || selectedOption.value,
  });
};

const next = (): boolean => {
  const index = clampIndex(currentIndex.value);
  if (index >= props.questions.length - 1) return false;
  currentIndex.set(index + 1);
  selectedOption.set("");
  customInput.set("");
  emit("question-change", clampIndex(currentIndex.value));
  return true;
};
const previous = (): boolean => {
  const index = clampIndex(currentIndex.value);
  if (index <= 0) return false;
  currentIndex.set(index - 1);
  selectedOption.set("");
  customInput.set("");
  emit("question-change", clampIndex(currentIndex.value));
  return true;
};
const confirm = (): boolean => {
  const value = selectedValue();
  if (!canConfirm() || !value) return false;
  const index = clampIndex(currentIndex.value);
  const detail: AiApprovalAnswerDetail = {
    index,
    question: currentQuestion(),
    value,
    custom: Boolean(customInput.value.trim()),
  };
  emit("confirm", detail);
  return true;
};
const reset = (): void => syncQuestion();
const onDismiss = (): void => {
  emit("dismiss", { index: clampIndex(currentIndex.value) });
};
const onConfirm = (): void => void confirm();
const onNext = (): void => void next();
const onPrevious = (): void => void previous();

useHostAttr("data-index", () => String(clampIndex(currentIndex.value)));
useHostAttr("aria-label", hostLabel);

defineExpose<AiApprovalCardExpose>({ next, previous, confirm, reset });

defineStyle(styles);

const AiApprovalCard = defineHtml(`
  <div class="approval" role="group">
    <div class="head">
      <span class="eyebrow">${label("question")} · ${progressLabel()}</span>
      <button class="dismiss" type="button" :aria-label=${dismissText()} :title=${dismissText()} @click=${onDismiss}>
        <span class="dismiss-icon" aria-hidden="true"></span>
      </button>
    </div>
    <h3 class="title">${currentQuestion().title}</h3>
    <p v-if="currentQuestion().description" class="description">{{ currentQuestion().description }}</p>
    <div v-if=${hasOptions()} class="options" role="radiogroup" :aria-label=${label("question")}>
      <button
        v-for="option in options()"
        :key="option.value"
        class="option"
        :class="{ active: optionActive(option) }"
        type="button"
        role="radio"
        :data-value="option.value"
        :aria-checked="String(optionActive(option))"
        @click=${onOptionClick}
      >
        <span class="radio" aria-hidden="true"></span>
        <span class="option-label">{{ option.label }}</span>
      </button>
    </div>
    <div v-if=${hasCustom()} class="custom">
      <input
        class="custom-input"
        type="text"
        :value=${customInput}
        :placeholder=${customPlaceholder()}
        :aria-label=${label("custom")}
        @input=${onCustomInput}
      >
    </div>
    <div class="footer">
      <div v-if=${props.showProgress} class="nav">
        <button class="nav-button" type="button" :disabled=${isFirst()} :aria-label=${label("previous")} :title=${label("previous")} @click=${onPrevious}>
          <span class="prev-icon" aria-hidden="true"></span>
        </button>
        <span class="progress">${progressLabel()}</span>
        <button class="nav-button" type="button" :disabled=${isLast()} :aria-label=${label("next")} :title=${label("next")} @click=${onNext}>
          <span class="next-icon" aria-hidden="true"></span>
        </button>
      </div>
      <span class="spacer"></span>
      <button class="confirm" type="button" :disabled=${!canConfirm()} @click=${onConfirm}>${confirmText()}</button>
    </div>
  </div>
`);

export { AiApprovalCard };
