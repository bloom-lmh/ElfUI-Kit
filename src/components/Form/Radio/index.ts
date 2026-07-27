// elf-radio

import {
  defineEmits,
  defineProps,
  defineStyle,
  inject,
  useHost,
  useHostAttr,
  useHostFlag,
  defineHtml
} from "@elfui/core";

import { FORM_ITEM_KEY, RADIO_GROUP_KEY } from "../context";
import { useDisabled } from "../../../composables";
import styles from "./style.scss?inline";

export type { RadioProps, RadioSize } from "./types";

const props = defineProps({
  modelValue: { type: null, default: "" },
  value: { type: null, default: "" },
  label: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: "" },
  border: { type: Boolean, default: false },
  id: { type: String, default: "" },
  name: { type: String, default: "" },
  ariaLabel: { type: String, default: "" },
  tabindex: { type: Number, default: undefined },
  validateEvent: { type: Boolean, default: true }
});

const emit = defineEmits(["update:modelValue", "change"]);

const group = inject(RADIO_GROUP_KEY);
const formItem = inject(FORM_ITEM_KEY);

const host = useHost();

const radioValue = (): unknown => group?.resolveValue(props.value) ?? props.value;

const isDisabled = useDisabled(() => Boolean(props.disabled) || (group?.disabled ?? false));

const checked = (): boolean => {
  if (group) return Object.is(group.modelValue, radioValue());
  return props.modelValue === props.value;
};

const tabIndex = (): number => {
  if (props.tabindex !== undefined) return Number(props.tabindex);
  return checked() ? 0 : -1;
};

useHostFlag("data-checked", () => checked());

useHostFlag("disabled", isDisabled);
useHostFlag("border", () => Boolean(props.border || group?.variant === "button"));
useHostFlag("data-button", () => group?.variant === "button");
useHostAttr("size", () => String(props.size || group?.size || ""));

const select = (e?: Event): void => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  if (isDisabled() || checked()) return;

  host.dispatchEvent(
    new CustomEvent("elf-radio-select", {
      detail: props.value,
      bubbles: true,
      composed: true
    })
  );

  if (group) {
    group.changeEvent(radioValue());
  } else {
    emit("update:modelValue", props.value);
    emit("change", props.value);
    if (props.validateEvent) formItem?.validateTrigger("change");
  }
};

const onKeyDown = (e: KeyboardEvent): void => {
  if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowUp") {
    e.preventDefault();
    host.dispatchEvent(new CustomEvent("elf-radio-navigate", {
      detail: e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1,
      bubbles: true,
      composed: true
    }));
    return;
  }
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    select(e);
  }
};

defineStyle(styles);

const Radio = defineHtml(`
  <button
    class="control"
    part="control"
    type="button"
    role="radio"
    :aria-checked=${checked()}
    :aria-label=${props.ariaLabel || null}
    :id=${props.id || null}
    :name=${props.name || group?.name || null}
    :tabindex=${tabIndex()}
    :disabled=${isDisabled()}
    @click.stop.prevent=${select}
    @keydown=${onKeyDown}
  >
    <span class="dot" part="dot"></span>
    <span class="label" part="label">
      <slot>${props.label}</slot>
    </span>
  </button>
`);

export { Radio };
