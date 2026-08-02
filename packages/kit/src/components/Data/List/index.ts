import {
  defineDirective,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  useHost,
  useHostFlag,
  useRef,
  useTemplateRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";
import { listContentDirective } from "../list-content";
import type { ListExposes, ListItemRenderer, ListProps, ListSlots } from "./types";

export type { ListExposes, ListItemKey, ListItemRenderer, ListProps, ListSlots } from "./types";

const props = defineProps<ListProps>({
  items: { type: Array, default: () => [] },
  itemKey: { type: [String, Function], default: "id" },
  renderItem: { type: Function },
  bordered: { type: Boolean, default: false },
  divided: { type: Boolean, default: true },
  emptyText: { type: String, default: "" },
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: "" },
  ariaLabel: { type: String, default: "" },
});

const locale = useLocaleProvider();
const host = useHost();
const elfListContent = defineDirective(listContentDirective);

// Template refs and state
const defaultSlotRef = useTemplateRef<HTMLSlotElement>("defaultSlot");
const hasDefaultContent = useRef(false);

// Derived state
const items = (): unknown[] => (Array.isArray(props.items) ? props.items : []);
const emptyLabel = (): string => props.emptyText || locale.t("table.empty");
const loadingLabel = (): string => {
  if (props.loadingText) return props.loadingText;
  return locale.name.toLowerCase().startsWith("zh") ? "正在加载…" : "Loading…";
};
const keyOf = (item: unknown, index: number): string => {
  if (typeof props.itemKey === "function") return String(props.itemKey(item, index));
  if (item && typeof item === "object")
    return String((item as Record<string, unknown>)[String(props.itemKey)] ?? index);
  return String(index);
};
const render = (item: unknown, index: number): unknown => {
  if (typeof props.renderItem === "function")
    return (props.renderItem as ListItemRenderer)(item, index);
  return item && typeof item === "object" ? JSON.stringify(item) : String(item ?? "");
};
const interactiveItems = (): Array<HTMLElement & { focusItem?: () => void }> =>
  Array.from(host.querySelectorAll<HTMLElement>("elf-list-item[clickable]:not([disabled])"));

// Methods
const syncDefaultSlot = (): void => {
  hasDefaultContent.set(
    Boolean(
      defaultSlotRef.value
        ?.assignedNodes({ flatten: true })
        .some((node) => node.nodeType === Node.ELEMENT_NODE || Boolean(node.textContent?.trim())),
    ),
  );
};
const focusItem = (item: HTMLElement & { focusItem?: () => void }): void => {
  if (typeof item.focusItem === "function") item.focusItem();
  else item.focus();
};
const focusFirst = (): void => {
  const [first] = interactiveItems();
  if (first) focusItem(first);
};
const onKeydown = (event: KeyboardEvent): void => {
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
  const current = event
    .composedPath()
    .find(
      (entry): entry is HTMLElement =>
        entry instanceof HTMLElement && entry.tagName.toLowerCase() === "elf-list-item",
    );
  if (!current) return;
  const candidates = interactiveItems();
  const currentIndex = candidates.indexOf(current);
  if (currentIndex < 0 || candidates.length === 0) return;
  event.preventDefault();
  const nextIndex =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? candidates.length - 1
        : (currentIndex + (event.key === "ArrowDown" ? 1 : -1) + candidates.length) %
          candidates.length;
  focusItem(candidates[nextIndex]!);
};

// Host state and exposes
useHostFlag("loading", () => props.loading);
onMounted(() => {
  host.addEventListener("keydown", onKeydown);
  queueMicrotask(syncDefaultSlot);
  return () => host.removeEventListener("keydown", onKeydown);
});
defineExpose<ListExposes>({ focusFirst });
defineStyle(styles);

const List = defineHtml<ListProps, Record<string, never>, ListSlots>(`
  <ul
    class="list"
    :class=${{
      "is-bordered": props.bordered,
      "is-divided": props.divided,
      "is-loading": props.loading,
    }}
    role="list"
    :aria-label=${props.ariaLabel || undefined}
    :aria-busy=${String(props.loading)}
  >
    <li v-if=${props.loading} class="loading" role="status" aria-live="polite">
      <slot name="loading">
        <span class="loading-spinner" aria-hidden="true"></span>
        <span>${loadingLabel()}</span>
      </slot>
    </li>
    <template v-else-if=${items().length > 0}>
      <li v-for="(item, index) in items()" :key="keyOf(item, index)" class="item" part="item" v-elf-list-content="render(item, index)"></li>
    </template>
    <template v-else>
      <slot ref="defaultSlot" @slotchange=${syncDefaultSlot}></slot>
      <li v-if=${!hasDefaultContent} class="empty" role="status">
        <slot name="empty">${emptyLabel()}</slot>
      </li>
    </template>
  </ul>
`);

export { List };
