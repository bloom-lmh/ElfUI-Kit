import {
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  useHost,
  useHostAttr,
  useHostFlag,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { StepProps, StepSlots, StepStatus, StepsDirection, StepsSize } from "../Steps/types";

export type { StepProps, StepSlots } from "../Steps/types";

interface StepRuntimeProps extends StepProps {
  stepIndex: number;
  resolvedStatus: StepStatus;
  active: boolean;
  last: boolean;
  clickable: boolean;
  direction: StepsDirection;
  size: StepsSize;
  simple: boolean;
  alignCenter: boolean;
  alternativeLabel: boolean;
}

const props = defineProps<StepRuntimeProps>({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  icon: { type: String, default: "" },
  status: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  value: { type: null, default: "" },
  stepIndex: { type: Number, default: 0 },
  resolvedStatus: { type: String, default: "wait" },
  active: { type: Boolean, default: false },
  last: { type: Boolean, default: false },
  clickable: { type: Boolean, default: true },
  direction: { type: String, default: "horizontal" },
  size: { type: String, default: "md" },
  simple: { type: Boolean, default: false },
  alignCenter: { type: Boolean, default: false },
  alternativeLabel: { type: Boolean, default: false },
});

const host = useHost();

const status = (): StepStatus => {
  const value = props.resolvedStatus;
  return value === "process" || value === "finish" || value === "error" ? value : "wait";
};

const isInteractive = (): boolean => Boolean(props.clickable) && !props.disabled && !props.active;

const rootClass = (): string => {
  const classes = ["step", `is-${status()}`, `is-${props.direction}`, `size-${props.size}`];
  if (props.active) classes.push("is-active");
  if (isInteractive()) classes.push("is-clickable");
  if (props.disabled) classes.push("is-disabled");
  if (props.last) classes.push("is-last");
  if (props.simple) classes.push("is-simple");
  if (props.alignCenter) classes.push("is-align-center");
  if (props.alternativeLabel) classes.push("is-alternative");
  return classes.join(" ");
};

const fallbackIcon = (): string => {
  if (props.icon) return props.icon;
  if (status() === "finish") return "✓";
  if (status() === "error") return "!";
  return String(props.stepIndex + 1);
};

const requestSelect = (): void => {
  if (!isInteractive()) return;
  host.dispatchEvent(
    new CustomEvent("elf-step-select", {
      bubbles: true,
      composed: true,
      detail: { index: props.stepIndex },
    }),
  );
};

const onKeydown = (event: KeyboardEvent): void => {
  if (!props.clickable || props.disabled) return;
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key))
    return;
  event.preventDefault();
  host.dispatchEvent(
    new CustomEvent("elf-step-navigate", {
      bubbles: true,
      composed: true,
      detail: { index: props.stepIndex, key: event.key },
    }),
  );
};

const focusButton = (): void => {
  host.shadowRoot?.querySelector<HTMLButtonElement>(".step-button")?.focus();
};

useHostAttr("role", () => "listitem");
useHostFlag("data-active", () => props.active);
useHostFlag("data-disabled", () => Boolean(props.disabled));
useHostAttr("data-status", status);

defineExpose({ focusButton });
defineStyle(styles);

const Step = defineHtml<StepRuntimeProps, Record<string, never>, StepSlots>(`
  <div :class=${rootClass} part="item">
    <button
      class="step-button"
      part="button"
      type="button"
      :disabled=${props.disabled}
      :tabindex=${props.active ? 0 : -1}
      :aria-current=${props.active ? "step" : null}
      :aria-disabled=${props.disabled || !props.clickable ? "true" : null}
      @click=${requestSelect}
      @keydown=${onKeydown}
    >
      <span class="step-head" part="head">
        <span class="step-icon" part="icon" aria-hidden="true">
          <slot name="icon">${fallbackIcon()}</slot>
        </span>
      </span>
      <span class="step-main" part="main">
        <span class="step-title" part="title"><slot name="title">${props.title}</slot></span>
        <span class="step-description" part="description">
          <slot name="description">${props.description}</slot>
        </span>
      </span>
    </button>
    <span v-if=${!props.last} class="step-tail" part="tail" aria-hidden="true">
      <span class="step-tail-track"></span>
      <span class="step-tail-progress"></span>
    </span>
  </div>
`);

export { Step };
