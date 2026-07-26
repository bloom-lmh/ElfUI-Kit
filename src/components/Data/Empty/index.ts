import {
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  useHost,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useRef
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { EmptyProps, EmptySize, EmptySlots } from "./types";

export type { EmptyProps, EmptySize, EmptySlots } from "./types";

const props = defineProps<EmptyProps>({
  image: { type: String, default: "" },
  imageSize: { type: [Number, String], default: 160 },
  description: { type: String, default: "No data" },
  size: { type: String, default: "default" }
});

const host = useHost();

// State
const hasActions = useRef(false);
const hasDescriptionSlot = useRef(false);

// Derived state
const normalizedSize = (): EmptySize =>
  props.size === "compact" ? "compact" : "default";

const imageSize = (): string => {
  const value = props.imageSize;
  if (typeof value === "number") {
    return `${Math.max(40, Number.isFinite(value) ? value : 160)}px`;
  }

  const normalized = String(value ?? "").trim();
  if (!normalized) return "160px";
  if (/^\d+(?:\.\d+)?$/.test(normalized)) {
    return `${Math.max(40, Number(normalized))}px`;
  }
  return normalized;
};

const hasDescription = (): boolean =>
  hasDescriptionSlot.value || Boolean(String(props.description ?? "").trim());

const hasActionContent = (): boolean => hasActions.value;

// Methods
const hasMeaningfulContent = (slot: HTMLSlotElement): boolean =>
  slot.assignedNodes({ flatten: true }).some((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) return true;
    return Boolean(node.textContent?.trim());
  });

const syncSlotState = (slot: HTMLSlotElement): void => {
  const populated = hasMeaningfulContent(slot);
  if (slot.name === "description") {
    hasDescriptionSlot.set(populated);
    return;
  }
  if (!slot.name) hasActions.set(populated);
};

const syncSlots = (): void => {
  host.shadowRoot
    ?.querySelectorAll<HTMLSlotElement>("slot")
    .forEach((slot) => syncSlotState(slot));
};

const onSlotChange = (event: Event): void => {
  syncSlotState(event.target as HTMLSlotElement);
};

useHostAttr("size", normalizedSize);
useHostFlag("has-actions", () => hasActions.value);
useHostFlag("has-description", hasDescription);
useHostCssVar("--_empty-image-size", imageSize);

onMounted(() => queueMicrotask(syncSlots));

defineStyle(styles);

const Empty = defineHtml<EmptyProps, Record<string, never>, EmptySlots>(`
  <div class="empty" part="empty">
    <div class="image" part="image">
      <slot name="image" @slotchange=${onSlotChange}>
        <img v-if=${props.image} :src=${props.image} alt="" decoding="async" />
        <svg v-else class="illustration" viewBox="0 0 160 160" aria-hidden="true">
          <path class="cloud cloud-left" d="M18 103c0-10 8-18 18-18 3-12 13-20 26-20 14 0 25 10 27 23 9 1 16 8 16 18 0 10-8 18-18 18H36c-10 0-18-9-18-21Z" />
          <path class="cloud cloud-right" d="M83 71c0-8 7-15 15-15 3-10 12-17 23-17 12 0 22 8 24 19 8 0 15 7 15 15 0 9-7 16-16 16H99c-9 0-16-8-16-18Z" />
          <path class="box" d="M43 84 80 65l37 19v43l-37 20-37-20V84Z" />
          <path class="box-top" d="m43 84 37 20 37-20M80 104v43" />
          <circle class="spark" cx="121" cy="45" r="5" />
          <circle class="spark small" cx="35" cy="48" r="3" />
        </svg>
      </slot>
    </div>
    <div
      class="description"
      part="description"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      v-show=${hasDescription()}
    >
      <slot name="description" @slotchange=${onSlotChange}>${props.description}</slot>
    </div>
    <div class="bottom" part="bottom" v-show=${hasActionContent()}>
      <slot @slotchange=${onSlotChange}></slot>
    </div>
  </div>
`);

export { Empty };
