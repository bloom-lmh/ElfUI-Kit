import {
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  onUnmounted,
  useEffect,
  useHost,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useRef,
  useResizeObserver
} from "@elfui/core";

import styles from "./style.scss?inline";
import type {
  DescriptionsDirection,
  DescriptionsFieldNames,
  DescriptionsProps,
  DescriptionsSize,
  DescriptionsSlots
} from "./types";

export type {
  DescriptionItem,
  DescriptionSourceItem,
  DescriptionsDirection,
  DescriptionsFieldNames,
  DescriptionsProps,
  DescriptionsSize,
  DescriptionsSlots,
  DescriptionValue
} from "./types";

interface ViewItem {
  key: string;
  label: string;
  text: string;
  empty: boolean;
  span: number;
}

interface DescriptionsItemElement extends HTMLElement {
  span?: number;
}

interface ManagedChildState {
  border: string | null;
  direction: string | null;
  gridColumn: string;
  size: string | null;
}

const DEFAULT_FIELDS: Required<DescriptionsFieldNames> = {
  key: "key",
  label: "label",
  value: "value",
  span: "span"
};

const normalizeDirection = (value: unknown): DescriptionsDirection =>
  value === "vertical" ? "vertical" : "horizontal";

const normalizeSize = (value: unknown): DescriptionsSize => {
  const candidate = String(value || "");
  return candidate === "sm" || candidate === "md" || candidate === "lg" ? candidate : "";
};

const props = defineProps<DescriptionsProps>({
  title: { type: String, default: "" },
  extra: { type: String, default: "" },
  items: { type: Array, default: () => [] },
  column: { type: Number, default: 3 },
  responsive: { type: Boolean, default: true },
  border: { type: Boolean, default: false },
  direction: { type: String, default: "horizontal" },
  size: { type: String, default: "" },
  emptyText: { type: String, default: "—" },
  props: {
    type: Object,
    default: () => ({
      key: "key",
      label: "label",
      value: "value",
      span: "span"
    })
  }
});

const host = useHost();

// State
const containerWidth = useRef(0);
const hasExtraSlot = useRef(false);
const hasItemChildren = useRef(false);
const hasTitleSlot = useRef(false);
const managedChildren = new Map<DescriptionsItemElement, ManagedChildState>();

// Derived state
const fieldNames = (): Required<DescriptionsFieldNames> => {
  const value = props.props ?? {};
  return {
    key: value.key || DEFAULT_FIELDS.key,
    label: value.label || DEFAULT_FIELDS.label,
    value: value.value || DEFAULT_FIELDS.value,
    span: value.span || DEFAULT_FIELDS.span
  };
};

const maxColumn = (): number => Math.max(1, Math.min(8, Math.floor(Number(props.column) || 3)));

const effectiveColumn = (): number => {
  const maximum = maxColumn();
  const width = containerWidth.value;
  if (!props.responsive || width <= 0) return maximum;
  if (width < 560) return 1;
  if (width < 900) return Math.min(2, maximum);
  return maximum;
};

const normalizedDirection = (): DescriptionsDirection => normalizeDirection(props.direction);
const normalizedSize = (): DescriptionsSize => normalizeSize(props.size);
const showHeader = (): boolean =>
  Boolean(props.title || props.extra || hasTitleSlot.value || hasExtraSlot.value);

const isEmptyValue = (value: unknown): boolean =>
  value === null || value === undefined || value === "";

const viewItems = (): ViewItem[] => {
  const fields = fieldNames();
  const source = Array.isArray(props.items) ? props.items : [];
  return source.map((entry, index) => {
    const raw = (entry ?? {}) as Record<string, unknown>;
    const label = String(raw[fields.label] ?? "");
    const value = raw[fields.value];
    const empty = isEmptyValue(value);
    return {
      key: String(raw[fields.key] ?? `${label}-${index}`),
      label,
      text: empty ? props.emptyText : String(value),
      empty,
      span: Math.max(
        1,
        Math.min(effectiveColumn(), Math.floor(Number(raw[fields.span]) || 1))
      )
    };
  });
};

const showEmpty = (): boolean => !hasItemChildren.value && viewItems().length === 0;

const itemChildren = (): DescriptionsItemElement[] =>
  Array.from(host.children).filter(
    (child): child is DescriptionsItemElement =>
      child.tagName.toLowerCase() === "elf-descriptions-item"
  );

const slotHasContent = (slot: HTMLSlotElement): boolean =>
  slot.assignedNodes({ flatten: true }).some(
    (node) => node.nodeType === 1 || (node.textContent?.trim() ?? "") !== ""
  );

// Methods
const restoreChild = (
  child: DescriptionsItemElement,
  state: ManagedChildState
): void => {
  for (const [name, value] of [
    ["data-border", state.border],
    ["data-direction", state.direction],
    ["data-size", state.size]
  ] as const) {
    if (value === null) child.removeAttribute(name);
    else child.setAttribute(name, value);
  }
  child.style.gridColumn = state.gridColumn;
};

const syncItemChildren = (): void => {
  const children = itemChildren();
  const current = new Set(children);

  for (const [child, state] of managedChildren) {
    if (current.has(child)) continue;
    restoreChild(child, state);
    managedChildren.delete(child);
  }

  hasItemChildren.set(children.length > 0);
  children.forEach((child) => {
    if (!managedChildren.has(child)) {
      managedChildren.set(child, {
        border: child.getAttribute("data-border"),
        direction: child.getAttribute("data-direction"),
        gridColumn: child.style.gridColumn,
        size: child.getAttribute("data-size")
      });
    }

    child.setAttribute("data-direction", normalizedDirection());
    child.toggleAttribute("data-border", Boolean(props.border));
    const size = normalizedSize();
    if (size) child.setAttribute("data-size", size);
    else child.removeAttribute("data-size");

    const span = Math.max(1, Math.floor(Number(child.span) || 1));
    child.style.gridColumn = `span ${Math.min(span, effectiveColumn())}`;
  });
};

const restoreItemChildren = (): void => {
  for (const [child, state] of managedChildren) restoreChild(child, state);
  managedChildren.clear();
};

const updateHeaderSlot = (target: "title" | "extra", slot: HTMLSlotElement): void => {
  const hasContent = slotHasContent(slot);
  if (target === "title") hasTitleSlot.set(hasContent);
  else hasExtraSlot.set(hasContent);
};

const onHeaderSlotChange =
  (target: "title" | "extra") =>
  (event: Event): void =>
    updateHeaderSlot(target, event.target as HTMLSlotElement);

const syncHeaderSlots = (): void => {
  for (const target of ["title", "extra"] as const) {
    const slot = host.shadowRoot?.querySelector<HTMLSlotElement>(`slot[name="${target}"]`);
    if (slot) updateHeaderSlot(target, slot);
  }
};

const onItemsSlotChange = (): void => syncItemChildren();

useResizeObserver(host, ({ width }) => {
  containerWidth.set(width);
});

useHostAttr("direction", normalizedDirection);
useHostAttr("size", normalizedSize);
useHostAttr("data-columns", () => String(effectiveColumn()));
useHostFlag("border", () => Boolean(props.border));
useHostFlag("responsive", () => Boolean(props.responsive));
useHostCssVar("--_column", () => String(effectiveColumn()));

useEffect(() => {
  void props.border;
  void props.column;
  void props.direction;
  void props.responsive;
  void props.size;
  void containerWidth.value;
  syncItemChildren();
});

onMounted(() => {
  queueMicrotask(syncHeaderSlots);
  syncItemChildren();
});
onUnmounted(restoreItemChildren);

defineStyle(styles);

const Descriptions = defineHtml<
  DescriptionsProps,
  Record<string, never>,
  DescriptionsSlots
>(`
  <section class="descriptions" part="descriptions">
    <header class="header" v-show=${showHeader()}>
      <div class="title">
        <slot name="title" @slotchange=${onHeaderSlotChange("title")}>${props.title}</slot>
      </div>
      <div class="extra">
        <slot name="extra" @slotchange=${onHeaderSlotChange("extra")}>${props.extra}</slot>
      </div>
    </header>

    <dl class="grid" part="body">
      <slot v-show=${hasItemChildren} @slotchange=${onItemsSlotChange}></slot>
      <template v-if=${!hasItemChildren}>
        <div
          v-for="item in viewItems()"
          :key="item.key"
          :class="['item', { 'is-empty': item.empty }]"
          :style="{ gridColumn: 'span ' + item.span }"
          part="item"
        >
          <dt class="label" part="label">{{ item.label }}</dt>
          <dd class="content" part="content">{{ item.text }}</dd>
        </div>
      </template>
      <div v-if=${showEmpty()} class="empty" part="empty">
        <slot name="empty">${props.emptyText}</slot>
      </div>
    </dl>
  </section>
`);

export { Descriptions };
