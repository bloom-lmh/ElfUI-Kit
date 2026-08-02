import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  useHostAttr,
  useHostFlag,
  useRef,
  useTemplateRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { ListItemEmits, ListItemExposes, ListItemProps, ListItemSlots } from "./types";

export type { ListItemEmits, ListItemExposes, ListItemProps, ListItemSlots } from "./types";

const props = defineProps<ListItemProps>({
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  value: { type: [String, Number], default: "" },
  active: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  clickable: { type: Boolean, default: false },
  lines: { type: String, default: "two" },
});

const emit = defineEmits<ListItemEmits>();

// Template refs and state
const buttonRef = useTemplateRef<HTMLButtonElement>("button");
const leadingSlotRef = useTemplateRef<HTMLSlotElement>("leadingSlot");
const trailingSlotRef = useTemplateRef<HTMLSlotElement>("trailingSlot");
const hasLeading = useRef(false);
const hasTrailing = useRef(false);

// Derived state
const normalizedLines = (): "one" | "two" | "three" =>
  props.lines === "one" || props.lines === "three" ? props.lines : "two";
const interactive = (): boolean => Boolean(props.clickable && !props.disabled);

// Methods
const syncSlots = (): void => {
  hasLeading.set(Boolean(leadingSlotRef.value?.assignedNodes({ flatten: true }).length));
  hasTrailing.set(Boolean(trailingSlotRef.value?.assignedNodes({ flatten: true }).length));
};
const onClick = (event: MouseEvent): void => {
  if (!interactive()) return;
  emit("click", event);
  emit("select", props.value);
};
const focusItem = (): void => {
  if (interactive()) buttonRef.value?.focus();
};

// Host state, lifecycle, and exposes
useHostAttr("role", () => "listitem");
useHostFlag("active", () => props.active);
useHostFlag("disabled", () => props.disabled);
useHostFlag("clickable", () => props.clickable);
onMounted(syncSlots);
defineExpose<ListItemExposes>({ focusItem });
defineStyle(styles);

const ListItem = defineHtml<ListItemProps, ListItemEmits, ListItemSlots>(`
  <button
    ref="button"
    v-if=${props.clickable}
    :class=${[
      "item",
      `lines-${normalizedLines()}`,
      {
        "is-clickable": props.clickable,
        "is-active": props.active,
        "has-leading": hasLeading,
        "has-trailing": hasTrailing,
      },
    ]}
    type="button"
    :disabled=${props.disabled}
    :aria-pressed=${String(props.active)}
    part="item"
    @click=${onClick}
  >
    <span class="leading" part="leading">
      <slot ref="leadingSlot" name="leading" @slotchange=${syncSlots}></slot>
    </span>
    <span class="content" part="content">
      <span v-if=${props.title} class="title" part="title">${props.title}</span>
      <slot></slot>
      <span v-if=${props.subtitle && normalizedLines() !== "one"} class="subtitle" part="subtitle">${props.subtitle}</span>
    </span>
    <span class="trailing" part="trailing">
      <slot ref="trailingSlot" name="trailing" @slotchange=${syncSlots}></slot>
    </span>
  </button>
  <div
    v-else
    :class=${[
      "item",
      `lines-${normalizedLines()}`,
      {
        "is-active": props.active,
        "has-leading": hasLeading,
        "has-trailing": hasTrailing,
      },
    ]}
    part="item"
  >
    <span class="leading" part="leading">
      <slot ref="leadingSlot" name="leading" @slotchange=${syncSlots}></slot>
    </span>
    <span class="content" part="content">
      <span v-if=${props.title} class="title" part="title">${props.title}</span>
      <slot></slot>
      <span v-if=${props.subtitle && normalizedLines() !== "one"} class="subtitle" part="subtitle">${props.subtitle}</span>
    </span>
    <span class="trailing" part="trailing">
      <slot ref="trailingSlot" name="trailing" @slotchange=${syncSlots}></slot>
    </span>
  </div>
`);

export { ListItem };
