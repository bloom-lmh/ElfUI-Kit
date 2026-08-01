// elf-button — Material Design + Element Plus 风格按钮

import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineOptions,
  defineProps,
  defineStyle,
  useHost,
  useHostAttr,
  useHostFlag,
  useTemplateRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { ButtonEmits, ButtonProps, ButtonSlots, ButtonType, ButtonVariant } from "./types";

export type {
  ButtonColor,
  ButtonEmits,
  ButtonProps,
  ButtonShape,
  ButtonSize,
  ButtonSlots,
  ButtonType,
  ButtonVariant,
} from "./types";

const colorTypes: readonly string[] = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
];
const nativeTypes: readonly string[] = ["button", "submit", "reset"];

const props = defineProps<ButtonProps>({
  type: { type: String, default: "" },
  variant: { type: String, default: "contained" },
  color: { type: String, default: "primary" },
  size: { type: String, default: "md" },
  shape: { type: String, default: "default" },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  text: { type: Boolean, default: false },
  bg: { type: Boolean, default: false },
  link: { type: Boolean, default: false },
  round: { type: Boolean, default: false },
  circle: { type: Boolean, default: false },
  plain: { type: Boolean, default: false },
  dashed: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false },
  ariaLabel: { type: String, default: "" },
  form: { type: String, default: "" },
  nativeType: { type: String, default: "button" },
  icon: { type: String, default: "" },
  loadingIcon: { type: String, default: "" },
  autoInsertSpace: { type: Boolean, default: false },
  dark: { type: Boolean, default: false },
  noHover: { type: Boolean, default: false },
  tag: { type: String, default: "button" },
  direction: { type: String, default: "horizontal" },
});

defineOptions({
  emitOptions: {
    events: {
      click: { bubbles: true, composed: true, cancelable: true },
    },
  },
});

const emit = defineEmits<ButtonEmits>(["click"]);
const host = useHost();
const buttonRef = useTemplateRef<HTMLButtonElement>("button");

const normalizedColor = (): string => {
  const type = String(props.type || "");
  if (colorTypes.includes(type)) return type;
  return colorTypes.includes(String(props.color)) ? String(props.color) : "primary";
};

const normalizedVariant = (): ButtonVariant => {
  if (props.link || props.text) return "text";
  return props.variant === "outlined" || props.variant === "text" ? props.variant : "contained";
};

const normalizedSize = (): "sm" | "md" | "lg" => {
  if (props.size === "small") return "sm";
  if (props.size === "large") return "lg";
  if (props.size === "default") return "md";
  return props.size === "sm" || props.size === "lg" ? props.size : "md";
};

const normalizedNativeType = (): ButtonType => {
  const type = String(props.type || "");
  if (nativeTypes.includes(type)) return type as ButtonType;
  return nativeTypes.includes(String(props.nativeType))
    ? (props.nativeType as ButtonType)
    : "button";
};

const resolveFormOwner = (button: HTMLButtonElement): HTMLFormElement | null => {
  if (button.form) return null;

  if (props.form) {
    const explicitForm = host.ownerDocument.getElementById(props.form);
    if (explicitForm instanceof HTMLFormElement) return explicitForm;
  }

  const closestForm = host.closest("form");
  return closestForm instanceof HTMLFormElement ? closestForm : null;
};

/** Bridges the internal native click across the component's Shadow DOM boundary. */
const handleClick = (event: MouseEvent): void => {
  if (props.disabled || props.loading) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  event.stopPropagation();
  if (!emit("click", event)) {
    event.preventDefault();
    return;
  }

  const nativeType = normalizedNativeType();
  if (nativeType === "button") return;

  const form = resolveFormOwner(event.currentTarget as HTMLButtonElement);
  if (!form) return;

  queueMicrotask(() => {
    if (event.defaultPrevented) return;
    if (nativeType === "reset") {
      form.reset();
      return;
    }
    form.requestSubmit();
  });
};

useHostAttr("color", normalizedColor);
useHostAttr("variant", normalizedVariant);
useHostAttr("size", normalizedSize);
useHostFlag("disabled", () => Boolean(props.disabled));
useHostFlag("loading", () => Boolean(props.loading));
useHostFlag("round", () => Boolean(props.round || props.shape === "round"));
useHostFlag("circle", () => Boolean(props.circle || props.shape === "circle"));
useHostFlag("text", () => Boolean(props.text));
useHostFlag("bg", () => Boolean(props.bg));
useHostFlag("link", () => Boolean(props.link));
useHostFlag("dark", () => Boolean(props.dark));
useHostFlag("block", () => Boolean(props.block));
useHostFlag("plain", () => Boolean(props.plain));
useHostFlag("dashed", () => Boolean(props.dashed));
useHostFlag("no-hover", () => Boolean(props.noHover));
useHostAttr("direction", () => (props.direction === "vertical" ? "vertical" : "horizontal"));

/** Preserves native Button semantics when consumers invoke the custom-element host. */
defineExpose(
  {
    click: (): void => buttonRef.value?.click(),
  },
  { overrideNative: ["click"] },
);

defineStyle(styles);

const Button = defineHtml<ButtonProps, ButtonEmits, ButtonSlots>(`
  <button
    ref="button"
    part="button"
    :type=${normalizedNativeType()}
    :disabled=${props.disabled || props.loading}
    :aria-busy=${props.loading}
    :aria-label=${props.ariaLabel || null}
    :autofocus=${props.autofocus}
    :form=${props.form || null}
    @click=${handleClick}
  >
    <slot
      v-if=${props.loading}
      name="loading"
    >
      <span
        v-if=${props.loadingIcon}
        class="prop-icon"
        aria-hidden="true"
      >${props.loadingIcon}</span>
      <span
        v-else
        class="spinner"
        aria-hidden="true"
      ></span>
    </slot>
    <slot
      v-if=${!props.loading}
      name="icon"
    >
      <span
        v-if=${props.icon}
        class="prop-icon"
        aria-hidden="true"
      >${props.icon}</span>
    </slot>
    <slot></slot>
    <slot name="suffix-icon"></slot>
  </button>
`);

export { Button };
