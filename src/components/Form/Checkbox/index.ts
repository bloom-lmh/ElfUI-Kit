// elf-checkbox

import {
  defineEmits,
  defineProps,
  defineStyle,
  inject,
  useEventListener,
  useHost,
  useHostAttr,
  useHostFlag,
  defineHtml
} from "@elfui/core";

import { CHECKBOX_GROUP_KEY } from "../context";
import { useDisabled } from "../../../composables";
import styles from "./style.scss?inline";

export type { CheckboxProps, CheckboxSize } from "./types";

const props = defineProps({
  modelValue: { type: null, default: false },
  value: { type: null, default: undefined },
  trueValue: { type: null, default: true },
  falseValue: { type: null, default: false },
  label: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: "" },
  indeterminate: { type: Boolean, default: false },
  border: { type: Boolean, default: false },
  checked: { type: Boolean, default: undefined },
  id: { type: String, default: "" },
  tabindex: { type: Number, default: 0 },
  ariaLabel: { type: String, default: "" },
  ariaControls: { type: String, default: "" },
  trueLabel: { type: String, default: "" },
  falseLabel: { type: String, default: "" }
});

const emit = defineEmits(["update:modelValue", "change"]);

const group = inject(CHECKBOX_GROUP_KEY);

const isDisabled = useDisabled(() => Boolean(props.disabled) || (group?.disabled ?? false));

const checkboxValue = (): unknown => group?.resolveValue(props.value) ?? props.value;

const checked = (): boolean => {
  if (group) return group.modelValue.includes(checkboxValue());
  const mv = props.modelValue;
  if (Array.isArray(mv)) return mv.includes(props.value);
  if (props.checked !== undefined) return Boolean(props.checked);
  return Object.is(mv, props.trueValue);
};

const ariaChecked = (): "true" | "false" | "mixed" => {
  if (props.indeterminate) return "mixed";
  return checked() ? "true" : "false";
};

useHostFlag("data-checked", () => checked());

useHostFlag("data-indeterminate", () => Boolean(props.indeterminate));

useHostFlag("disabled", isDisabled);
useHostFlag("bordered", () => Boolean(props.border));
useHostFlag("data-button", () => group?.variant === "button");
useHostAttr("size", () => String(props.size || group?.size || ""));

const isInnerInteractiveClick = (e: Event): boolean => {
  const path = typeof e.composedPath === "function" ? e.composedPath() : [];
  return path.some((item) => {
    if (!(item instanceof HTMLElement)) return false;
    return item.classList.contains("box") || item.classList.contains("label");
  });
};

const toggle = (e?: Event): void => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  if (isDisabled()) return;

  if (group) {
    const cur = group.modelValue;
    const value = checkboxValue();
    const idx = cur.indexOf(value);
    if (idx >= 0) {
      if (cur.length <= group.min) return;
      group.changeEvent(cur.filter((_, i) => i !== idx));
    } else {
      if (cur.length >= group.max) return;
      group.changeEvent([...cur, value]);
    }
    return;
  }

  const mv = props.modelValue;
  if (Array.isArray(mv)) {
    const idx = mv.indexOf(props.value);
    const next = idx >= 0 ? mv.filter((_, i) => i !== idx) : [...mv, props.value];
    emit("update:modelValue", next);
    emit("change", next);
  } else {
    const next = checked() ? props.falseValue : props.trueValue;
    emit("update:modelValue", next);
    emit("change", next);
  }
};

useEventListener(useHost(), "click", (e) => {
  if (isInnerInteractiveClick(e)) return;
  toggle(e);
});

const onKeyDown = (e: KeyboardEvent): void => {
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    toggle(e);
  }
};

defineStyle(styles);

const Checkbox = defineHtml(`
  <span
    class="box"
    part="box"
    :id=${props.id || null}
    :tabindex=${isDisabled() ? -1 : props.tabindex}
    role="checkbox"
    :aria-checked=${ariaChecked()}
    :aria-label=${props.ariaLabel || props.label || props.trueLabel || null}
    :aria-controls=${props.ariaControls || null}
    @keydown=${onKeyDown}
    @click.stop.prevent=${toggle}
  ></span>
  <span class="label" part="label" @click.stop.prevent=${toggle}>
    <slot>${props.label || (checked() ? props.trueLabel : props.falseLabel)}</slot>
  </span>
`);

export { Checkbox };
