import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  useEffect,
  useHost,
  useHostCssVar,
  useHostFlag,
  useRef
} from "@elfui/core";

import { cssSize, surfaceColor, surfaceForeground, surfaceShadow } from "../../surface";
import styles from "./style.scss?inline";
import type {
  BottomNavigationEmits,
  BottomNavigationItem,
  BottomNavigationProps,
  BottomNavigationSlots,
  BottomNavigationValue
} from "./types";

export type {
  BottomNavigationEmits,
  BottomNavigationItem,
  BottomNavigationProps,
  BottomNavigationSlots,
  BottomNavigationValue
} from "./types";

interface NavigationViewItem extends BottomNavigationItem { key: string; }

const props = defineProps<BottomNavigationProps>({
  items: { type: Array, default: () => [] },
  modelValue: { type: [String, Number], default: null },
  defaultValue: { type: [String, Number], default: null },
  ariaLabel: { type: String, default: "Bottom navigation" },
  color: { type: String, default: "primary" },
  backgroundColor: { type: String, default: "surface" },
  height: { type: [String, Number], default: 64 },
  active: { type: Boolean, default: true },
  grow: { type: Boolean, default: false },
  horizontal: { type: Boolean, default: false },
  shift: { type: Boolean, default: false },
  border: { type: Boolean, default: false },
  rounded: { type: Boolean, default: false },
  fixed: { type: Boolean, default: false },
  safeArea: { type: Boolean, default: true },
  mandatory: { type: Boolean, default: false },
  elevation: { type: Number, default: 2 }
});

const emit = defineEmits<BottomNavigationEmits>(["update:modelValue", "change"]);
const host = useHost();
const selected = useRef<BottomNavigationValue | null>(props.modelValue ?? props.defaultValue);

const itemKey = (value: BottomNavigationValue): string => String(value);
const viewItems = (): NavigationViewItem[] => (props.items || []).map((item, index) => ({
  ...item,
  key: itemKey(item.value ?? index)
}));
const selectedKey = (): string => {
  if (selected.value !== null && selected.value !== undefined) return itemKey(selected.value);
  if (!props.mandatory) return "";
  return viewItems().find((item) => !item.disabled)?.key || "";
};
const isSelected = (item: NavigationViewItem): boolean => selectedKey() === item.key;
const itemClass = (item: NavigationViewItem): Record<string, boolean> => ({
  item: true,
  "is-selected": isSelected(item),
  "is-disabled": Boolean(item.disabled)
});

const selectItem = (item: NavigationViewItem): void => {
  if (item.disabled) return;
  selected.set(item.value);
  emit("update:modelValue", item.value);
  emit("change", item.value, item);
};

const focusItem = (item: NavigationViewItem): void => {
  const buttons = Array.from(host.shadowRoot?.querySelectorAll<HTMLButtonElement>("button.item") ?? []);
  buttons.find((button) => button.dataset.navKey === item.key)?.focus();
};

const onItemKeydown = (item: NavigationViewItem, event: KeyboardEvent): void => {
  const enabled = viewItems().filter((entry) => !entry.disabled);
  const index = enabled.findIndex((entry) => entry.key === item.key);
  if (index < 0) return;
  let nextIndex = index;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % enabled.length;
  else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + enabled.length) % enabled.length;
  else if (event.key === "Home") nextIndex = 0;
  else if (event.key === "End") nextIndex = enabled.length - 1;
  else if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    selectItem(item);
    return;
  } else return;
  event.preventDefault();
  focusItem(enabled[nextIndex]!);
};

useEffect(() => {
  if (props.modelValue !== null && props.modelValue !== undefined) selected.set(props.modelValue);
});

useEffect(() => {
  if (!props.mandatory || selected.value !== null) return;
  const first = viewItems().find((item) => !item.disabled);
  if (first) selected.set(first.value);
});

useHostFlag("active", () => props.active);
useHostFlag("grow", () => props.grow);
useHostFlag("horizontal", () => props.horizontal);
useHostFlag("shift", () => props.shift);
useHostFlag("border", () => props.border);
useHostFlag("rounded", () => props.rounded);
useHostFlag("fixed", () => props.fixed);
useHostFlag("safe-area", () => props.safeArea);
useHostFlag("mandatory", () => props.mandatory);
useHostCssVar("--_bottom-nav-height", () => cssSize(props.height));
useHostCssVar("--_bottom-nav-active", () => surfaceColor(props.color, "var(--elf-primary)"));
useHostCssVar("--_bottom-nav-bg", () => surfaceColor(props.backgroundColor));
useHostCssVar("--_bottom-nav-color", () => surfaceForeground(props.backgroundColor));
useHostCssVar("--_bottom-nav-shadow", () => surfaceShadow(props.elevation));

defineStyle(styles);

const BottomNavigation = defineHtml<BottomNavigationProps, BottomNavigationEmits, BottomNavigationSlots>(`
  <nav class="navigation" part="navigation" :aria-label=${props.ariaLabel}>
    <slot name="prepend"></slot>
    <button
      v-for="item in viewItems()"
      :key="item.key"
      type="button"
      :class="itemClass(item)"
      :data-nav-key="item.key"
      :disabled="item.disabled"
      :aria-current="isSelected(item) ? 'page' : null"
      :aria-label="item.label"
      :tabindex="isSelected(item) ? 0 : -1"
      @click="selectItem(item)"
      @keydown="onItemKeydown(item, $event)"
    >
      <span v-if="item.icon" class="icon" aria-hidden="true">{{ item.icon }}</span>
      <span v-if="item.badge !== undefined && item.badge !== null" class="badge" aria-hidden="true">{{ item.badge }}</span>
      <span class="label">{{ item.label }}</span>
    </button>
    <slot name="append"></slot>
  </nav>
`);

export { BottomNavigation };
