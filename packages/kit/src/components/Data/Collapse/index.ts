import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  useEffect,
  useEventListener,
  useHost,
  useHostFlag,
  useRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { CollapseEmits, CollapseFieldNames, CollapseModelValue, CollapseProps } from "./types";

export type {
  CollapseEmits,
  CollapseFieldNames,
  CollapseItem,
  CollapseItemExposes,
  CollapseItemProps,
  CollapseItemSlots,
  CollapseModelValue,
  CollapseProps,
} from "./types";

interface ViewItem {
  raw: Record<string, unknown>;
  name: string;
  title: string;
  content: string;
  disabled: boolean;
}

interface CollapseItemElement extends HTMLElement {
  name?: string | number;
  disabled?: boolean;
  active?: boolean;
  focusHeader?: () => void;
}

type NavigationAction = "next" | "previous" | "first" | "last";

const DEFAULT_FIELDS: Required<CollapseFieldNames> = {
  name: "name",
  title: "title",
  content: "content",
  disabled: "disabled",
};

const nextId = (): string => {
  const store = globalThis as typeof globalThis & { __elfCollapseIdSeed?: number };
  store.__elfCollapseIdSeed = (store.__elfCollapseIdSeed ?? 0) + 1;
  return `elf-collapse-${store.__elfCollapseIdSeed}`;
};

const props = defineProps<CollapseProps>({
  modelValue: { type: null, default: "" },
  accordion: { type: Boolean, default: false },
  items: { type: Array, default: () => [] },
  props: {
    type: Object,
    default: () => ({
      name: "name",
      title: "title",
      content: "content",
      disabled: "disabled",
    }),
  },
});

const emit = defineEmits<CollapseEmits>();
const host = useHost();
const id = nextId();

// State
const active = useRef<string[]>([]);
const hasItemChildren = useRef(false);

// Derived state
const fieldNames = (): Required<CollapseFieldNames> => {
  const value = props.props ?? {};
  return {
    name: value.name || DEFAULT_FIELDS.name,
    title: value.title || DEFAULT_FIELDS.title,
    content: value.content || DEFAULT_FIELDS.content,
    disabled: value.disabled || DEFAULT_FIELDS.disabled,
  };
};

const normalizeActiveNames = (value: unknown): string[] => {
  const source = Array.isArray(value)
    ? value
    : value === null || value === undefined || value === ""
      ? []
      : [value];
  const names = [...new Set(source.map(String))];
  return props.accordion ? names.slice(0, 1) : names;
};

const itemChildren = (): CollapseItemElement[] =>
  Array.from(host.children).filter(
    (child): child is CollapseItemElement => child.tagName.toLowerCase() === "elf-collapse-item",
  );

const childName = (child: CollapseItemElement, index: number): string =>
  child.name === undefined || child.name === null || child.name === ""
    ? String(index)
    : String(child.name);

const viewItems = (): ViewItem[] => {
  const fields = fieldNames();
  const source = Array.isArray(props.items) ? props.items : [];
  return source.map((entry, index) => {
    const raw = (entry || {}) as Record<string, unknown>;
    const name = String(raw[fields.name] ?? index);
    return {
      raw,
      name,
      title: String(raw[fields.title] ?? name),
      content: String(raw[fields.content] ?? ""),
      disabled: Boolean(raw[fields.disabled]),
    };
  });
};

const isActive = (item: ViewItem): boolean => active.value.includes(item.name);
const panelId = (item: ViewItem): string => `${id}-panel-${encodeURIComponent(item.name)}`;
const headerId = (item: ViewItem): string => `${id}-header-${encodeURIComponent(item.name)}`;
const outputValue = (next: string[]): CollapseModelValue =>
  props.accordion ? next[0] || "" : next;

const navigationAction = (key: string): NavigationAction | null => {
  if (key === "ArrowDown") return "next";
  if (key === "ArrowUp") return "previous";
  if (key === "Home") return "first";
  if (key === "End") return "last";
  return null;
};

const navigationActionForValue = (value: unknown): value is NavigationAction =>
  value === "next" || value === "previous" || value === "first" || value === "last";

// Methods
const syncItemChildren = (): void => {
  const children = itemChildren();
  hasItemChildren.set(children.length > 0);
  children.forEach((child, index) => {
    child.active = active.value.includes(childName(child, index));
  });
};

const commitActive = (next: string[]): void => {
  active.set(next);
  const detail = outputValue(next);
  emit("update:modelValue", detail);
  emit("change", detail);
};

const toggle = (name: string, disabled = false): void => {
  if (disabled) return;
  const opened = active.value.includes(name);
  const next = props.accordion
    ? opened
      ? []
      : [name]
    : opened
      ? active.value.filter((activeName) => activeName !== name)
      : [...active.value, name];
  commitActive(next);
};

const focusByAction = (
  candidates: Array<{ disabled: boolean; focus: () => void }>,
  currentIndex: number,
  action: NavigationAction,
): void => {
  const enabled = candidates
    .map((candidate, index) => ({ ...candidate, index }))
    .filter((candidate) => !candidate.disabled);
  if (!enabled.length) return;

  const enabledIndex = enabled.findIndex((candidate) => candidate.index === currentIndex);
  const target =
    action === "first"
      ? enabled[0]
      : action === "last"
        ? enabled[enabled.length - 1]
        : action === "next"
          ? enabled[(Math.max(0, enabledIndex) + 1) % enabled.length]
          : enabled[(enabledIndex <= 0 ? enabled.length : enabledIndex) - 1];
  target?.focus();
};

const onHeaderClick = (event: Event): void => {
  const name = (event.currentTarget as HTMLElement | null)?.dataset.name;
  const item = viewItems().find((entry) => entry.name === name);
  if (item) toggle(item.name, item.disabled);
};

const onHeaderKeydown = (event: KeyboardEvent): void => {
  const action = navigationAction(event.key);
  if (!action) return;
  event.preventDefault();
  const headers = Array.from(host.shadowRoot?.querySelectorAll<HTMLButtonElement>(".header") ?? []);
  focusByAction(
    headers.map((header) => ({
      disabled: header.disabled,
      focus: () => header.focus(),
    })),
    headers.indexOf(event.currentTarget as HTMLButtonElement),
    action,
  );
};

const onItemsSlotChange = (): void => syncItemChildren();

useEventListener(host, "elf-collapse-toggle", (event) => {
  const child = event.target as CollapseItemElement | null;
  const children = itemChildren();
  const index = child ? children.indexOf(child) : -1;
  if (!child || index < 0) return;
  event.stopPropagation();
  toggle(childName(child, index), Boolean(child.disabled));
});

useEventListener(host, "elf-collapse-navigate", (event) => {
  const child = event.target as CollapseItemElement | null;
  const children = itemChildren();
  const index = child ? children.indexOf(child) : -1;
  const action = (event as CustomEvent<NavigationAction>).detail;
  if (!child || index < 0 || !navigationActionForValue(action)) return;
  event.stopPropagation();
  focusByAction(
    children.map((item) => ({
      disabled: Boolean(item.disabled),
      focus: () => item.focusHeader?.(),
    })),
    index,
    action,
  );
});

useHostFlag("accordion", () => Boolean(props.accordion));

useEffect(() => {
  void props.accordion;
  active.set(normalizeActiveNames(props.modelValue));
});

useEffect(() => {
  void active.value;
  syncItemChildren();
});

onMounted(syncItemChildren);

defineStyle(styles);

const Collapse = defineHtml<CollapseProps, CollapseEmits>(`
  <div class="collapse" part="collapse">
    <slot v-if=${hasItemChildren} @slotchange=${onItemsSlotChange}></slot>
    <template v-if=${!hasItemChildren}>
      <div
        v-for="item in viewItems()"
        :key="item.name"
        :class="['item', { 'is-active': isActive(item), 'is-disabled': item.disabled }]"
        part="item"
      >
        <button
          class="header"
          part="header"
          type="button"
          :data-name="item.name"
          :id="headerId(item)"
          :disabled="item.disabled"
          :aria-expanded="isActive(item) ? 'true' : 'false'"
          :aria-controls="panelId(item)"
          @click=${onHeaderClick}
          @keydown=${onHeaderKeydown}
        >
          <span part="title">{{ item.title }}</span>
          <span class="arrow" part="icon" aria-hidden="true"></span>
        </button>
        <div
          class="body"
          part="body"
          :id="panelId(item)"
          role="region"
          :aria-labelledby="headerId(item)"
          :aria-hidden="isActive(item) ? 'false' : 'true'"
          :inert="!isActive(item)"
        >
          <div class="body-content">{{ item.content }}</div>
        </div>
      </div>
    </template>
  </div>
`);

export { Collapse };
