import {
  defineEmits,
  defineProps,
  defineStyle,
  onMounted,
  onUnmounted,
  useHost,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useRef,
  useTemplateRef,
  defineHtml,
} from "@elfui/core";

import { useDisabled, useFormControl, useFormItem } from "../../../composables";
import styles from "./style.scss?inline";
import type { SwitchProps, SwitchValue } from "./types";

export type {
  SwitchColor,
  SwitchLabelPosition,
  SwitchProps,
  SwitchSize,
  SwitchValue,
  SwitchVariant,
} from "./types";

const props = defineProps<SwitchProps>({
  modelValue: { type: null, default: false },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: "md" },
  variant: { type: String, default: "default" },
  width: { type: null, default: undefined },
  inlinePrompt: { type: Boolean, default: false },
  activeText: { type: String, default: "" },
  inactiveText: { type: String, default: "" },
  activeIcon: { type: String, default: "" },
  inactiveIcon: { type: String, default: "" },
  activeActionIcon: { type: String, default: "" },
  inactiveActionIcon: { type: String, default: "" },
  label: { type: String, default: "" },
  labelPosition: { type: String, default: "end" },
  activeValue: { type: null, default: true },
  inactiveValue: { type: null, default: false },
  beforeChange: { type: Function, default: undefined },
  validateEvent: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
  inset: { type: Boolean, default: false },
  flat: { type: Boolean, default: false },
  color: { type: String, default: "primary" },
  activeColor: { type: String, default: "" },
  inactiveColor: { type: String, default: "" },
  borderColor: { type: String, default: "" },
  id: { type: String, default: "" },
  tabindex: { type: Number, default: 0 },
  ariaLabel: { type: String, default: "" },
});

const emit = defineEmits<{
  "update:modelValue": [value: SwitchValue];
  change: [value: SwitchValue];
}>();
const ctl = useFormControl<SwitchValue>(props, emit, {
  triggers:
    props.validateEvent === false
      ? { input: false, blur: false, change: false }
      : { input: false, blur: false, change: "change" },
});
const fi = useFormItem(() => props.size as string);
const isDisabled = useDisabled(() => Boolean(props.disabled || props.loading));
const host = useHost();
const trackRef = useTemplateRef<HTMLElement>("track");

const slotVersion = useRef(0);

const tokenColor = (value: string): string => {
  const color = String(value || "primary");
  const map: Record<string, string> = {
    primary: "var(--elf-primary)",
    success: "var(--elf-success)",
    warning: "var(--elf-warning)",
    danger: "var(--elf-danger)",
    info: "var(--elf-info)",
  };
  return map[color] ?? color;
};

const checked = (): boolean => Object.is(ctl.model.value, props.activeValue);
const nextValue = (): SwitchValue => (checked() ? props.inactiveValue : props.activeValue);
const width = (): string | null => {
  if (props.width === undefined || props.width === null || props.width === "") return null;
  const value = String(props.width).trim();
  return /^\d+(?:\.\d+)?$/.test(value) ? `${value}px` : value;
};

const hasNamedSlot = (name: string): boolean => {
  void slotVersion.value;
  return Boolean(host.querySelector(`[slot="${name}"]`));
};

const hasActiveAction = (): boolean =>
  Boolean(props.activeActionIcon || props.activeIcon || hasNamedSlot("active-action"));

const hasInactiveAction = (): boolean =>
  Boolean(props.inactiveActionIcon || props.inactiveIcon || hasNamedSlot("inactive-action"));

const normalizedVariant = (): "default" | "inset" | "material" | "square" => {
  if (props.inset) return "inset";
  const variant = String(props.variant || "default");
  return variant === "inset" || variant === "material" || variant === "square"
    ? variant
    : "default";
};

useHostFlag("data-checked", checked);
useHostFlag("data-loading", () => Boolean(props.loading));
useHostFlag("data-inset", () => Boolean(props.inset));
useHostFlag("data-flat", () => Boolean(props.flat));
useHostFlag("data-inline-prompt", () => Boolean(props.inlinePrompt));
useHostFlag("disabled", isDisabled);
useHostAttr("data-size", () => fi.formSize);
useHostAttr("data-variant", normalizedVariant);
useHostAttr("data-label-position", () => String(props.labelPosition || "end"));
useHostCssVar("--_switch-active", () =>
  props.activeColor ? String(props.activeColor) : tokenColor(String(props.color)),
);
useHostCssVar("--_switch-inactive", () => props.inactiveColor || "var(--elf-border-strong)");
useHostCssVar("--_switch-border", () => props.borderColor || "transparent");
useHostCssVar("--_switch-width-custom", width);

const toggle = async (): Promise<void> => {
  if (isDisabled()) return;
  const next = nextValue();
  const guard = props.beforeChange as
    ((value: SwitchValue) => boolean | Promise<boolean>) | undefined;
  if (guard && (await guard(next)) === false) return;
  ctl.setValue(next);
  ctl.dispatchChange(next);
};

const onClick = (): void => {
  void toggle();
};
const onKeyDown = (event: KeyboardEvent): void => {
  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    void toggle();
  }
};
const touchSlots = (): void => slotVersion.set(slotVersion.value + 1);
const focus = (): void =>
  (trackRef.value ?? host.shadowRoot?.querySelector<HTMLElement>(".track"))?.focus();
const ariaLabel = (): string =>
  String(props.ariaLabel || props.label || props.activeText || "Switch");

onMounted(() => {
  Object.defineProperty(host, "focus", { configurable: true, value: focus });
});

onUnmounted(() => {
  delete (host as Partial<HTMLElement>).focus;
});

defineStyle(styles);

const Switch = defineHtml<SwitchProps>(`
  <span v-if=${props.inactiveText && !props.inlinePrompt} class="state-label" :class=${{ active: !checked() }} @click=${onClick}>${props.inactiveText}</span>
  <span class="body">
    <span
      ref="track"
      class="track"
      part="track"
      role="switch"
      :id=${props.id || null}
      :tabindex=${isDisabled() ? -1 : props.tabindex}
      :aria-label=${ariaLabel()}
      :aria-checked=${checked()}
      :aria-disabled=${isDisabled()}
      @click=${onClick}
      @keydown=${onKeyDown}
    >
      <span class="thumb">
        <span v-if=${props.loading} class="spinner" aria-hidden="true"></span>
        <span v-else-if=${!checked() && hasInactiveAction()} class="action-icon">
          <slot name="inactive-action" @slotchange=${touchSlots}>${props.inactiveActionIcon || props.inactiveIcon}</slot>
        </span>
        <span v-else-if=${checked() && hasActiveAction()} class="action-icon">
          <slot name="active-action" @slotchange=${touchSlots}>${props.activeActionIcon || props.activeIcon}</slot>
        </span>
      </span>
      <span v-if=${props.inlinePrompt && !checked()} class="inline-content"><slot name="inactive">${props.inactiveIcon || props.inactiveText}</slot></span>
      <span v-if=${props.inlinePrompt && checked()} class="inline-content"><slot name="active">${props.activeIcon || props.activeText}</slot></span>
    </span>
    <span class="main-label" part="label" @click=${onClick}><slot>${props.label}</slot></span>
  </span>
  <span v-if=${props.activeText && !props.inlinePrompt} class="state-label" :class=${{ active: checked() }} @click=${onClick}>${props.activeText}</span>
`);

export { Switch };
