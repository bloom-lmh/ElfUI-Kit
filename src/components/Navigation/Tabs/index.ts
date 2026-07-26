import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  useComputed,
  useEventListener,
  useHost,
  useHostFlag,
  useRef,
  useEffect
} from "@elfui/core";

import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";
import type {
  TabPaneName,
  TabsAlign,
  TabsBeforeLeave,
  TabsDensity,
  TabsDirection,
  TabsFieldNames,
  TabsPaneContext,
  TabsPosition,
  TabsProps,
  TabsReorderDetail,
  TabsSlots,
  TabsTransition,
  TabsType
} from "./types";

export type {
  TabPaneName,
  TabPaneProps,
  TabPaneSlots,
  TabsAlign,
  TabsBeforeLeave,
  TabsDensity,
  TabsDirection,
  TabsExpose,
  TabsFieldNames,
  TabsItem,
  TabsPaneContext,
  TabsPosition,
  TabsProps,
  TabsReorderDetail,
  TabsSlots,
  TabsTransition,
  TabsType
} from "./types";

type TabsRawItem = Record<string, unknown>;

interface TabPaneElement extends HTMLElement {
  label?: string;
  name?: TabPaneName;
  disabled?: boolean;
  closable?: boolean;
  lazy?: boolean;
  active?: boolean;
  rendered?: boolean;
  panelId?: string;
  labelledBy?: string;
}

interface TabsViewItem {
  raw: TabsRawItem;
  key: string;
  label: string;
  value: TabPaneName;
  icon: string;
  badge: string;
  disabled: boolean;
  closable: boolean;
  lazy: boolean;
  content: string;
  labelSlot: string;
}

interface LabelCloneRecord {
  element: HTMLElement;
  signature: string;
}

const props = defineProps<TabsProps>({
  items: { type: Array, default: () => [] },
  modelValue: { type: [String, Number], default: "" },
  defaultValue: { type: [String, Number], default: "" },
  alignTabs: { type: String, default: "start" },
  density: { type: String, default: "default" },
  direction: { type: String, default: "horizontal" },
  type: { type: String, default: "line" },
  closable: { type: Boolean, default: false },
  addable: { type: Boolean, default: false },
  editable: { type: Boolean, default: false },
  tabPosition: { type: String, default: "" },
  stretch: { type: Boolean, default: false },
  beforeLeave: { type: Function, default: null },
  tabindex: { type: Number, default: 0 },
  color: { type: String, default: "" },
  backgroundColor: { type: String, default: "" },
  sliderColor: { type: String, default: "" },
  grow: { type: Boolean, default: false },
  fixedTabs: { type: Boolean, default: false },
  centerActive: { type: Boolean, default: false },
  showArrows: { type: Boolean, default: false },
  draggable: { type: Boolean, default: false },
  stacked: { type: Boolean, default: false },
  showPanels: { type: Boolean, default: false },
  hideSlider: { type: Boolean, default: false },
  transition: { type: String, default: "fade" },
  transitionDuration: { type: Number, default: 180 },
  props: {
    type: Object,
    default: () => ({
      label: "label",
      value: "value",
      icon: "icon",
      disabled: "disabled",
      closable: "closable",
      lazy: "lazy",
      badge: "badge",
      content: "content"
    })
  }
});

const locale = useLocaleProvider();

const emit = defineEmits<{
  "update:modelValue": [value: TabPaneName];
  change: [value: TabPaneName, item: TabsRawItem];
  "tab-click": [context: TabsPaneContext & { item: TabsRawItem; event?: Event }];
  "tab-change": [value: TabPaneName];
  "tab-remove": [value: TabPaneName];
  "tab-add": [];
  "tab-reorder": [detail: TabsReorderDetail];
  "update:items": [items: TabsRawItem[]];
  edit: [value: TabPaneName | undefined, action: "add" | "remove"];
}>();

const host = useHost();
const active = useRef<TabPaneName | "">("");
const syncKey = useRef("");
const hasPaneChildren = useRef(false);
const sliderStyle = useRef<Record<string, string>>({ opacity: "0" });
const orderedKeys = useRef<string[]>([]);
const draggingKey = useRef("");
const visitedKeys = new Set<string>();
const labelClones = new Map<TabPaneElement, LabelCloneRecord>();

const instanceId = (() => {
  const store = globalThis as typeof globalThis & { __elfTabsIdSeed?: number };
  store.__elfTabsIdSeed = (store.__elfTabsIdSeed ?? 0) + 1;
  return `elf-tabs-${store.__elfTabsIdSeed}`;
})();

const nameKey = (value: unknown): string => String(value ?? "");
const sameName = (left: unknown, right: unknown): boolean => nameKey(left) === nameKey(right);
const hasName = (value: unknown): value is TabPaneName => value !== undefined && value !== null && value !== "";

const fieldNames = (): Required<TabsFieldNames> => {
  const value = props.props || {};
  return {
    label: value.label || "label",
    value: value.value || "value",
    icon: value.icon || "icon",
    disabled: value.disabled || "disabled",
    closable: value.closable || "closable",
    lazy: value.lazy || "lazy",
    badge: value.badge || "badge",
    content: value.content || "content"
  };
};

const paneChildren = (): TabPaneElement[] =>
  Array.from(host.children).filter(
    (child): child is TabPaneElement => child.tagName.toLowerCase() === "elf-tab-pane"
  );

const labelSource = (pane: TabPaneElement): HTMLElement | null =>
  Array.from(pane.children).find(
    (child): child is HTMLElement => child instanceof HTMLElement && child.slot === "label"
  ) ?? null;

const labelSlotName = (index: number): string => `${instanceId}-label-${index}`;
const tabId = (item: TabsViewItem): string => `${instanceId}-tab-${encodeURIComponent(item.key)}`;
const panelId = (item: TabsViewItem): string => `${instanceId}-panel-${encodeURIComponent(item.key)}`;

const dataItems = (): TabsViewItem[] => {
  const fields = fieldNames();
  const source = Array.isArray(props.items) ? props.items : [];
  const normalized = source.map((raw, index) => {
    const item = (raw || {}) as TabsRawItem;
    const value = (item[fields.value] ?? index) as TabPaneName;
    return {
      raw: item,
      key: nameKey(value),
      label: String(item[fields.label] ?? value),
      value,
      icon: String(item[fields.icon] ?? ""),
      badge: String(item[fields.badge] ?? ""),
      disabled: Boolean(item[fields.disabled]),
      closable: Boolean(item[fields.closable]),
      lazy: Boolean(item[fields.lazy]),
      content: String(item[fields.content] ?? ""),
      labelSlot: ""
    };
  });
  if (orderedKeys.value.length === 0) return normalized;
  const positions = new Map(orderedKeys.value.map((key, index) => [key, index]));
  return normalized.slice().sort((left, right) =>
    (positions.get(left.key) ?? Number.MAX_SAFE_INTEGER) -
    (positions.get(right.key) ?? Number.MAX_SAFE_INTEGER)
  );
};

const paneItems = (): TabsViewItem[] =>
  paneChildren().map((pane, index) => {
    const value = hasName(pane.name) ? pane.name : index;
    const source = labelSource(pane);
    const raw: TabsRawItem = {
      label: pane.label || source?.textContent?.trim() || String(value),
      value,
      disabled: Boolean(pane.disabled),
      closable: Boolean(pane.closable),
      lazy: Boolean(pane.lazy)
    };
    return {
      raw,
      key: nameKey(value),
      label: String(raw.label),
      value,
      icon: "",
      badge: "",
      disabled: Boolean(pane.disabled),
      closable: Boolean(pane.closable),
      lazy: Boolean(pane.lazy),
      content: "",
      labelSlot: source ? labelSlotName(index) : ""
    };
  });

const viewItems = (): TabsViewItem[] => hasPaneChildren.value ? paneItems() : dataItems();
const firstEnabledName = (): TabPaneName | "" => viewItems().find((item) => !item.disabled)?.value ?? "";
const activeItem = (): TabsViewItem | undefined => viewItems().find((item) => sameName(item.value, active.value));
const isActive = (item: TabsViewItem): boolean => sameName(item.value, active.value);
const isClosable = (item: TabsViewItem): boolean =>
  (Boolean(props.closable) || Boolean(props.editable) || item.closable) && !item.disabled;
const showPanels = (): boolean => hasPaneChildren.value || Boolean(props.showPanels);
const renderedPanels = (): TabsViewItem[] =>
  viewItems().filter((item) => !item.lazy || isActive(item) || visitedKeys.has(item.key));

const transition = (): TabsTransition => {
  const value = String(props.transition || "fade");
  return value === "slide" || value === "scale" || value === "none" || value === "custom" ? value : "fade";
};

const tabPosition = (): TabsPosition => {
  const value = String(props.tabPosition || "");
  if (value === "right" || value === "bottom" || value === "left" || value === "top") return value;
  return (props.direction as TabsDirection) === "vertical" ? "left" : "top";
};

const tabType = (): TabsType => {
  const value = String(props.type || "line");
  return value === "card" || value === "border-card" ? value : "line";
};

const hostStyle = useComputed(() => {
  const color = String(props.color || "");
  const backgroundColor = String(props.backgroundColor || "");
  const sliderColor = String(props.sliderColor || "");
  const duration = Math.max(0, Number(props.transitionDuration || 180));
  return {
    ...(color ? { "--tabs-color": color } : {}),
    ...(backgroundColor ? { "--tabs-background-color": backgroundColor } : {}),
    ...(sliderColor ? { "--tabs-slider-color": sliderColor } : {}),
    "--tabs-transition-duration": `${duration}ms`
  };
});

const rootClass = () => ({
  "is-vertical": tabPosition() === "left" || tabPosition() === "right",
  [`is-${tabPosition()}`]: true,
  [`is-${tabType()}`]: true,
  "is-grow": Boolean(props.grow),
  "is-fixed-tabs": Boolean(props.fixedTabs),
  "is-center-active": Boolean(props.centerActive),
  "has-arrows": Boolean(props.showArrows),
  "is-stretch": Boolean(props.stretch),
  "is-stacked": Boolean(props.stacked),
  "is-closable": Boolean(props.closable) || Boolean(props.editable),
  "is-hide-slider": Boolean(props.hideSlider),
  "is-compact": (props.density as TabsDensity) === "compact",
  "is-comfortable": (props.density as TabsDensity) === "comfortable",
  "has-pane-children": hasPaneChildren.value,
  "align-center": (props.alignTabs as TabsAlign) === "center",
  "align-end": (props.alignTabs as TabsAlign) === "end",
  "align-title": (props.alignTabs as TabsAlign) === "title",
  [`transition-${transition()}`]: true
});

const paneContext = (item: TabsViewItem): TabsPaneContext => ({
  name: item.value,
  label: item.label,
  disabled: item.disabled,
  closable: item.closable,
  lazy: item.lazy
});

const tabButtons = (): HTMLButtonElement[] =>
  Array.from(host.shadowRoot?.querySelectorAll<HTMLButtonElement>(".tab") ?? []);
const tabListRef = (): HTMLElement | null => host.shadowRoot?.querySelector<HTMLElement>(".tab-list") ?? null;
const tabBarRef = (): HTMLElement | null => host.shadowRoot?.querySelector<HTMLElement>(".tab-slider") ?? null;

const syncSlider = (): void => {
  const index = viewItems().findIndex((item) => isActive(item));
  const button = tabButtons()[index];
  if (!button) {
    sliderStyle.set({ opacity: "0" });
    return;
  }

  const vertical = tabPosition() === "left" || tabPosition() === "right";
  if (vertical) {
    sliderStyle.set({
      opacity: "1",
      width: "3px",
      height: `${Math.max(0, button.offsetHeight - 16)}px`,
      transform: `translate3d(0, ${button.offsetTop + 8}px, 0)`
    });
    return;
  }

  sliderStyle.set({
    opacity: "1",
    width: `${Math.max(0, button.offsetWidth - 24)}px`,
    height: "3px",
    transform: `translate3d(${button.offsetLeft + 12}px, 0, 0)`
  });
};

const scheduleSliderSync = (): void => queueMicrotask(syncSlider);

const syncLabelClone = (pane: TabPaneElement, index: number): void => {
  const source = labelSource(pane);
  const existing = labelClones.get(pane);
  if (!source) {
    existing?.element.remove();
    labelClones.delete(pane);
    return;
  }

  const signature = source.outerHTML;
  const slot = labelSlotName(index);
  if (existing && existing.signature === signature && existing.element.slot === slot) return;

  existing?.element.remove();
  const clone = source.cloneNode(true) as HTMLElement;
  clone.slot = slot;
  clone.dataset.elfTabsLabelClone = instanceId;
  host.appendChild(clone);
  labelClones.set(pane, { element: clone, signature });
};

const syncPaneChildren = (): void => {
  const children = paneChildren();
  hasPaneChildren.set(children.length > 0);

  for (const [pane, record] of labelClones) {
    if (children.includes(pane)) continue;
    record.element.remove();
    labelClones.delete(pane);
  }

  const items = paneItems();
  children.forEach((pane, index) => {
    const item = items[index]!;
    syncLabelClone(pane, index);
    pane.active = isActive(item);
    pane.rendered = visitedKeys.has(item.key);
    pane.panelId = panelId(item);
    pane.labelledBy = tabId(item);
  });
};

const commitActive = (item: TabsViewItem): void => {
  active.set(item.value);
  visitedKeys.add(item.key);
  emit("update:modelValue", item.value);
  emit("change", item.value, item.raw);
  emit("tab-change", item.value);
  queueMicrotask(() => {
    syncSlider();
    scrollToActiveTab();
  });
};

const runBeforeLeave = (item: TabsViewItem, oldValue: TabPaneName | "", commit: () => void): void => {
  const guard = props.beforeLeave as TabsBeforeLeave | null | undefined;
  if (typeof guard !== "function") {
    commit();
    return;
  }

  try {
    const result = guard(item.value, oldValue);
    if (result && typeof (result as Promise<boolean | void>).then === "function") {
      void Promise.resolve(result).then((allowed) => {
        if (allowed !== false) commit();
      }).catch(() => undefined);
      return;
    }
    if (result !== false) commit();
  } catch {
    // A thrown guard blocks navigation, matching a rejected guard promise.
  }
};

const select = (value: TabPaneName): void => {
  const item = viewItems().find((entry) => sameName(entry.value, value));
  if (!item || item.disabled || isActive(item)) return;
  runBeforeLeave(item, active.value, () => commitActive(item));
};

const onTabClick = (item: TabsViewItem, event: Event): void => {
  event.preventDefault();
  event.stopPropagation();
  emit("tab-click", { ...paneContext(item), item: item.raw, event });
  select(item.value);
};

const focusTab = (value: TabPaneName): void => {
  queueMicrotask(() => {
    const index = viewItems().findIndex((item) => sameName(item.value, value));
    tabButtons()[index]?.focus();
  });
};

const onTabKeydown = (item: TabsViewItem, event: KeyboardEvent): void => {
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const enabled = viewItems().filter((entry) => !entry.disabled);
  const currentIndex = Math.max(0, enabled.findIndex((entry) => sameName(entry.value, item.value)));
  let nextIndex = currentIndex;
  if (event.key === "Home") nextIndex = 0;
  else if (event.key === "End") nextIndex = enabled.length - 1;
  else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    nextIndex = (currentIndex + 1) % enabled.length;
  } else {
    nextIndex = (currentIndex - 1 + enabled.length) % enabled.length;
  }
  const next = enabled[nextIndex];
  if (!next) return;
  select(next.value);
  focusTab(next.value);
};

const nextAfterRemove = (item: TabsViewItem): TabPaneName | "" => {
  const all = viewItems();
  const available = all.filter((entry) => !entry.disabled && !sameName(entry.value, item.value));
  if (available.length === 0) return "";
  const currentIndex = all.findIndex((entry) => sameName(entry.value, item.value));
  return available.find((entry) => all.indexOf(entry) > currentIndex)?.value ?? available[available.length - 1]!.value;
};

const removeTab = (value: TabPaneName): void => {
  const item = viewItems().find((entry) => sameName(entry.value, value));
  if (!item || !isClosable(item)) return;
  const wasActive = isActive(item);
  const next = wasActive ? nextAfterRemove(item) : "";
  emit("tab-remove", item.value);
  emit("edit", item.value, "remove");
  if (!wasActive) return;
  if (hasName(next)) select(next);
};

const onRemoveClick = (item: TabsViewItem, event: Event): void => {
  event.preventDefault();
  event.stopPropagation();
  removeTab(item.value);
};

const add = (): void => {
  emit("tab-add");
  emit("edit", undefined, "add");
};

const currentName = (): TabPaneName | "" => active.value;
const setActive = (value: TabPaneName): void => select(value);
const scrollToActiveTab = (): void => {
  const index = viewItems().findIndex((item) => isActive(item));
  tabButtons()[index]?.scrollIntoView?.({
    block: props.centerActive && tabPosition() !== "top" && tabPosition() !== "bottom" ? "center" : "nearest",
    inline: props.centerActive && (tabPosition() === "top" || tabPosition() === "bottom") ? "center" : "nearest"
  });
};
const selectRelative = (direction: -1 | 1): void => {
  const enabled = viewItems().filter((item) => !item.disabled);
  if (enabled.length === 0) return;
  const current = Math.max(0, enabled.findIndex((item) => isActive(item)));
  const next = enabled[(current + direction + enabled.length) % enabled.length];
  if (!next) return;
  select(next.value);
  focusTab(next.value);
};

const onSlottedControlClick = (event: Event): void => {
  const control = event.composedPath().find((node): node is HTMLElement =>
    node instanceof HTMLElement
    && (node.slot === "prev-control" || node.slot === "next-control")
  );
  if (!control) return;
  selectRelative(control.slot === "prev-control" ? -1 : 1);
};

const onTabDragStart = (item: TabsViewItem, event: Event): void => {
  const dragEvent = event as DragEvent;
  if (!props.draggable || item.disabled) {
    dragEvent.preventDefault();
    return;
  }
  draggingKey.set(item.key);
  dragEvent.dataTransfer?.setData("text/plain", item.key);
  if (dragEvent.dataTransfer) dragEvent.dataTransfer.effectAllowed = "move";
};

const onTabDragEnd = (): void => draggingKey.set("");

const onTabDragOver = (item: TabsViewItem, event: Event): void => {
  const dragEvent = event as DragEvent;
  if (!props.draggable || item.disabled || !draggingKey.peek()) return;
  dragEvent.preventDefault();
  if (dragEvent.dataTransfer) dragEvent.dataTransfer.dropEffect = "move";
};

const onTabDrop = (target: TabsViewItem, event: Event): void => {
  const dragEvent = event as DragEvent;
  if (!props.draggable || target.disabled) return;
  dragEvent.preventDefault();
  const sourceKey = draggingKey.peek() || dragEvent.dataTransfer?.getData("text/plain") || "";
  const current = viewItems();
  const from = current.findIndex((item) => item.key === sourceKey);
  const to = current.findIndex((item) => item.key === target.key);
  draggingKey.set("");
  if (from < 0 || to < 0 || from === to) return;
  const reordered = current.slice();
  const [moved] = reordered.splice(from, 1);
  if (!moved) return;
  reordered.splice(to, 0, moved);
  orderedKeys.set(reordered.map((item) => item.key));
  const nextItems = reordered.map((item) => item.raw);
  emit("update:items", nextItems);
  emit("tab-reorder", { from, to, value: moved.value, items: nextItems });
  queueMicrotask(syncSlider);
};
const removeFocus = (): void => {
  const root = host.shadowRoot;
  if (root?.activeElement instanceof HTMLElement) root.activeElement.blur();
};
const update = (): DOMRect | null => {
  syncSlider();
  return tabBarRef()?.getBoundingClientRect() ?? null;
};
const onPanesSlotChange = (): void => {
  syncPaneChildren();
  scheduleSliderSync();
};

useEffect(() => {
  const next = hasName(props.modelValue)
    ? props.modelValue
    : hasName(props.defaultValue)
      ? props.defaultValue
      : firstEnabledName();
  const signature = `${nameKey(props.modelValue)}::${nameKey(props.defaultValue)}::${nameKey(firstEnabledName())}::${hasPaneChildren.value}`;
  if (syncKey.peek() === signature) return;
  syncKey.set(signature);
  active.set(next);
  if (hasName(next)) visitedKeys.add(nameKey(next));
});

useEffect(() => {
  void active.value;
  void props.closable;
  void props.editable;
  void props.grow;
  void props.stretch;
  void props.stacked;
  void props.alignTabs;
  void props.tabPosition;
  void props.direction;
  syncPaneChildren();
  scheduleSliderSync();
});

onMounted(() => {
  syncPaneChildren();
  scheduleSliderSync();
});
useEventListener(window, "resize", scheduleSliderSync);
useEventListener(host, "click", onSlottedControlClick);
useHostFlag("data-composed", () => hasPaneChildren.value);

defineExpose({
  select,
  setActive,
  removeTab,
  add,
  currentName,
  scrollToActiveTab,
  removeFocus,
  update,
  get tabListRef() {
    return tabListRef();
  },
  get tabBarRef() {
    return tabBarRef();
  },
  get tabNavRef() {
    return {
      scrollToActiveTab,
      removeFocus,
      get tabListRef() {
        return tabListRef();
      },
      get tabBarRef() {
        return tabBarRef();
      }
    };
  }
});

defineStyle(styles);

const Tabs = defineHtml<TabsProps, Record<string, never>, TabsSlots>(`
  <div :class=${["tabs", rootClass()]} :style=${hostStyle}>
    <div class="tab-navigation">
      <slot v-if=${props.showArrows} name="prev-control">
          <button
            type="button"
            class="tab-scroll tab-scroll-prev"
            :aria-label=${locale.t("pagination.previous")}
            @click=${() => selectRelative(-1)}
          >
            <slot name="prev-icon">
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m10 3.5-4.5 4.5 4.5 4.5"></path></svg>
            </slot>
          </button>
      </slot>
      <div
        class="tab-list"
        role="tablist"
        :aria-orientation=${tabPosition() === "left" || tabPosition() === "right" ? "vertical" : "horizontal"}
      >
      <button
        v-for="item in viewItems()"
        :key="item.key"
        type="button"
        role="tab"
        :id="tabId(item)"
        :aria-controls="panelId(item)"
        :class="['tab', { 'is-active': isActive(item), 'is-disabled': item.disabled }]"
        :disabled="item.disabled"
        :aria-selected="isActive(item) ? 'true' : 'false'"
        :tabindex="isActive(item) ? props.tabindex : -1"
        :draggable="props.draggable && !item.disabled ? 'true' : 'false'"
        @click="onTabClick(item, $event)"
        @keydown="onTabKeydown(item, $event)"
        @dragstart="onTabDragStart(item, $event)"
        @dragend=${onTabDragEnd}
        @dragover="onTabDragOver(item, $event)"
        @drop="onTabDrop(item, $event)"
      >
        <span v-if="item.icon" class="tab-icon">{{ item.icon }}</span>
        <span class="tab-label">
          <slot v-if="item.labelSlot" :name="item.labelSlot">{{ item.label }}</slot>
          <span v-else>{{ item.label }}</span>
        </span>
        <span v-if="item.badge" class="tab-badge">{{ item.badge }}</span>
        <span
          v-if="isClosable(item)"
          class="tab-close"
          role="button"
          tabindex="-1"
          :aria-label=${locale.t("a11y.closeTag")}
          @click="onRemoveClick(item, $event)"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M4.25 4.25 11.75 11.75M11.75 4.25 4.25 11.75"></path>
          </svg>
        </span>
      </button>
      <span class="tab-slider" aria-hidden="true" :style=${sliderStyle.value}></span>
      <button
        v-if=${props.addable || props.editable}
        class="tab-add"
        type="button"
        :aria-label=${locale.t("a11y.addTab")}
        @click=${add}
      >
        <slot name="add-icon">
          <slot name="addIcon">
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M8 3.25v9.5M3.25 8h9.5"></path>
            </svg>
          </slot>
        </slot>
      </button>
      </div>
      <slot v-if=${props.showArrows} name="next-control">
          <button
            type="button"
            class="tab-scroll tab-scroll-next"
            :aria-label=${locale.t("pagination.next")}
            @click=${() => selectRelative(1)}
          >
            <slot name="next-icon">
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5"></path></svg>
            </slot>
          </button>
      </slot>
    </div>
    <div v-if=${showPanels()} class="tab-panels">
      <slot v-if=${hasPaneChildren} @slotchange=${onPanesSlotChange}></slot>
      <template v-if=${!hasPaneChildren}>
        <section
          v-for="item in renderedPanels()"
          v-show="isActive(item)"
          :key="item.key"
          :id="panelId(item)"
          :aria-labelledby="tabId(item)"
          :class="['tab-panel', { 'is-active': isActive(item) }]"
          role="tabpanel"
        >
          {{ item.content }}
        </section>
      </template>
    </div>
  </div>
`);

export { Tabs };
