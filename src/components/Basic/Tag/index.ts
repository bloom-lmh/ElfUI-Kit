import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  useEffect,
  useHost,
  useHostAttr,
  useHostFlag,
  useRef
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { TagColor, TagEmits, TagProps, TagSize, TagSlots, TagVariant } from "./types";
import { useLocaleProvider } from "../../Providers/context";

export type { TagColor, TagEffect, TagEmits, TagProps, TagSize, TagSlots, TagVariant } from "./types";

const COLORS: readonly TagColor[] = ["primary", "secondary", "success", "warning", "danger", "info"];

const props = defineProps<TagProps>({
  type: { type: String, default: "" },
  color: { type: String, default: "primary" },
  size: { type: String, default: "md" },
  variant: { type: String, default: "light" },
  effect: { type: String, default: "" },
  closable: { type: Boolean, default: false },
  round: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  disableTransitions: { type: Boolean, default: false },
  hit: { type: Boolean, default: false },
  checked: { type: Boolean, default: undefined },
});

const emit = defineEmits<TagEmits>();
const locale = useLocaleProvider();
const host = useHost();

// State
const innerChecked = useRef(props.checked === true);
const checkable = useRef(typeof props.checked === "boolean" || host.hasAttribute("checked"));
const slotLabel = useRef("");

// Derived state
const normalizedColor = (): TagColor => {
  const type = String(props.type || "");
  if (COLORS.includes(type as TagColor)) return type as TagColor;
  return COLORS.includes(props.color as TagColor) ? (props.color as TagColor) : "primary";
};

const customColor = (): string => {
  const color = String(props.color || "").trim();
  return color && !COLORS.includes(color as TagColor) ? color : "";
};

const normalizedVariant = (): TagVariant => {
  if (props.effect === "dark") return "filled";
  if (props.effect === "plain") return "outlined";
  return props.variant === "filled" || props.variant === "outlined" ? props.variant : "light";
};

const normalizedSize = (): TagSize => {
  const size = String(props.size || "");
  return size === "sm" || size === "lg" ? size : "md";
};

const isCheckable = (): boolean => checkable.value;
const isChecked = (): boolean => innerChecked.value;
const accessibleLabel = (): string | null =>
  isCheckable() ? slotLabel.value || host.textContent?.trim() || null : null;

const tagStyle = (): Record<string, string> => {
  const color = customColor();
  return color
    ? {
        "--_color": color,
        "--_bg": `color-mix(in srgb, ${color} 12%, transparent)`,
      }
    : {};
};

// Methods
const toggleChecked = (): void => {
  if (!isCheckable()) return;
  const next = !isChecked();
  innerChecked.set(next);
  emit("update:checked", next);
  emit("change", next);
};

const onClose = (event: Event): void => {
  event.stopPropagation();
  emit("close", event);
};

const onClick = (event: MouseEvent): void => {
  if (props.disabled) return;
  emit("click", event);
  toggleChecked();
};

const onKeyDown = (event: KeyboardEvent): void => {
  if (props.disabled || !isCheckable()) return;
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  (event.currentTarget as HTMLElement).click();
};

const onSlotChange = (event: Event): void => {
  const slot = event.currentTarget as HTMLSlotElement;
  const label = slot.assignedNodes().map((node) => node.textContent || "").join("").trim();
  slotLabel.set(label);
};

useEffect(() => {
  if (typeof props.checked !== "boolean") return;
  checkable.set(true);
  innerChecked.set(props.checked);
});

useHostAttr("color", () => customColor() || normalizedColor());
useHostAttr("variant", normalizedVariant);
useHostAttr("size", normalizedSize);
useHostFlag("round", () => Boolean(props.round));
useHostFlag("disabled", () => Boolean(props.disabled));
useHostFlag("disable-transitions", () => Boolean(props.disableTransitions));
useHostFlag("hit", () => Boolean(props.hit));
useHostFlag("checked", isChecked);

defineStyle(styles);

const Tag = defineHtml<TagProps, TagEmits, TagSlots>(`
  <span
    class="tag"
    part="tag"
    :style=${tagStyle()}
    :role=${isCheckable() ? "button" : null}
    :tabindex=${isCheckable() && !props.disabled ? "0" : null}
    :aria-pressed=${isCheckable() ? String(isChecked()) : null}
    :aria-label=${accessibleLabel()}
    :aria-disabled=${props.disabled ? "true" : null}
    @click=${onClick}
    @keydown=${onKeyDown}
  >
    <span class="label" part="label"><slot @slotchange=${onSlotChange}></slot></span>
    <button
      v-if=${props.closable && !props.disabled}
      class="close"
      part="close"
      @click=${onClose}
      :aria-label=${locale.t("a11y.closeTag")}
      type="button"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M4 4l8 8M12 4l-8 8"></path>
      </svg>
    </button>
  </span>
`);

export { Tag };
