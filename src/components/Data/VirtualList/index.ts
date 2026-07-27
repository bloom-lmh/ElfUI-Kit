import {
  defineDirective,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onBeforeUnmount,
  onMounted,
  useHost,
  useRef,
  useTemplateRef,
  useEffect
} from "@elfui/core";
import { listContentDirective } from "../list-content";
import { computeVirtualWindow } from "../virtual-window";
import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";
import type { ListItemRenderer } from "../List/types";
import type { VirtualListAlign, VirtualListProps } from "./types";

export type { VirtualListAlign, VirtualListExpose, VirtualListProps } from "./types";

const props = defineProps<VirtualListProps>({
  items: { type: Array, default: () => [] },
  itemKey: { type: [String, Function], default: "id" },
  renderItem: { type: Function },
  height: { type: [String, Number], default: 320 },
  itemHeight: { type: Number, default: 48 },
  overscan: { type: Number, default: 10 },
  bordered: { type: Boolean, default: false },
  divided: { type: Boolean, default: true },
  emptyText: { type: String, default: "" },
  listItemClass: { type: String, default: "" },
  listItemStyle: { type: null, default: "" },
  dynamic: { type: Boolean, default: false },
  estimatedItemHeight: { type: Number, default: 48 },
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: "Loading…" }
});

const elfListContent = defineDirective(listContentDirective);

const locale = useLocaleProvider();

const viewportRef = useTemplateRef<HTMLElement>("viewport");
const host = useHost();
const scrollOffset = useRef(0);
const viewportSize = useRef(320);
const measurementVersion = useRef(0);
const measuredHeights = new Map<string, number>();
let resizeObserver: ResizeObserver | undefined;
let cachedWindowKey = "";
let cachedWindow = computeVirtualWindow({ count: 0, itemSize: 1, viewportSize: 0, scrollOffset: 0 });
let cachedVisibleSource: unknown[] | null = null;
let cachedVisibleStart = -1;
let cachedVisibleEnd = -1;
let cachedVisibleItems: Array<{ item: unknown; index: number; key: string }> = [];
let scrollSyncTimer: ReturnType<typeof setTimeout> | undefined;
let cachedOffsetSource: unknown[] | null = null;
let cachedOffsetVersion = -1;
let cachedOffsetEstimate = -1;
let cachedOffsets: number[] = [0];
const items = (): unknown[] => Array.isArray(props.items) ? props.items : [];
const itemHeight = (): number => Math.max(1, Number(props.itemHeight) || 48);
const estimatedItemHeight = (): number => Math.max(1, Number(props.estimatedItemHeight) || itemHeight());
const effectiveOverscan = (size = viewportSize.value): number => Math.max(
  0,
  Number(props.overscan) || 0,
  Math.ceil(Math.max(0, size) / itemHeight())
);
const cssSize = (value: string | number): string => {
  if (typeof value === "number") return `${value}px`;
  const normalized = String(value).trim();
  return /^-?\d+(?:\.\d+)?$/.test(normalized) ? `${normalized}px` : normalized;
};
const keyOf = (item: unknown, index: number): string => {
  if (typeof props.itemKey === "function") return String(props.itemKey(item, index));
  if (item && typeof item === "object") return String((item as Record<string, unknown>)[String(props.itemKey)] ?? index);
  return String(index);
};
const dynamicOffsets = (): number[] => {
  const source = items();
  const estimate = estimatedItemHeight();
  if (
    source === cachedOffsetSource
    && cachedOffsetVersion === measurementVersion.value
    && cachedOffsetEstimate === estimate
    && cachedOffsets.length === source.length + 1
  ) return cachedOffsets;
  const offsets = new Array<number>(source.length + 1);
  offsets[0] = 0;
  for (let index = 0; index < source.length; index += 1) {
    offsets[index + 1] = offsets[index]! + (measuredHeights.get(keyOf(source[index], index)) || estimate);
  }
  cachedOffsetSource = source;
  cachedOffsetVersion = measurementVersion.value;
  cachedOffsetEstimate = estimate;
  cachedOffsets = offsets;
  return offsets;
};
const indexAtOffset = (offsets: number[], offset: number): number => {
  let low = 0;
  let high = Math.max(0, offsets.length - 2);
  while (low <= high) {
    const middle = (low + high) >> 1;
    if (offsets[middle + 1]! <= offset) low = middle + 1;
    else high = middle - 1;
  }
  return Math.max(0, Math.min(offsets.length - 2, low));
};
const dynamicWindowState = () => {
  const source = items();
  if (source.length === 0) return { start: 0, end: 0, offset: 0, totalSize: 0 };
  const offsets = dynamicOffsets();
  const visibleStart = indexAtOffset(offsets, Math.max(0, scrollOffset.value));
  const visibleEnd = indexAtOffset(offsets, Math.max(0, scrollOffset.value + viewportSize.value)) + 1;
  const overscan = Math.max(0, Number(props.overscan) || 0);
  const start = Math.max(0, visibleStart - overscan);
  const end = Math.min(source.length, visibleEnd + overscan);
  return { start, end, offset: offsets[start] ?? 0, totalSize: offsets[offsets.length - 1] ?? 0 };
};
const windowState = () => {
  const source = items();
  const key = `${props.dynamic}:${source.length}:${itemHeight()}:${viewportSize.value}:${scrollOffset.value}:${effectiveOverscan()}:${measurementVersion.value}`;
  if (key === cachedWindowKey) return cachedWindow;
  cachedWindowKey = key;
  cachedWindow = props.dynamic ? dynamicWindowState() : computeVirtualWindow({
    count: source.length,
    itemSize: itemHeight(),
    viewportSize: viewportSize.value,
    scrollOffset: scrollOffset.value,
    overscan: effectiveOverscan()
  });
  return cachedWindow;
};
const visibleItems = (): Array<{ item: unknown; index: number; key: string }> => {
  const source = items();
  const state = windowState();
  if (source === cachedVisibleSource && state.start === cachedVisibleStart && state.end === cachedVisibleEnd) {
    return cachedVisibleItems;
  }
  cachedVisibleSource = source;
  cachedVisibleStart = state.start;
  cachedVisibleEnd = state.end;
  cachedVisibleItems = source.slice(state.start, state.end).map((item, offset) => {
    const index = state.start + offset;
    return { item, index, key: keyOf(item, index) };
  });
  return cachedVisibleItems;
};
const render = (item: unknown, index: number): unknown => {
  if (typeof props.renderItem === "function") return (props.renderItem as ListItemRenderer)(item, index);
  return item && typeof item === "object" ? JSON.stringify(item) : String(item ?? "");
};
const itemStyle = (): string | Record<string, string | number> =>
  typeof props.listItemStyle === "string"
    ? `${props.listItemStyle};${props.dynamic ? `min-height:${estimatedItemHeight()}px` : `height:${itemHeight()}px`}`
    : {
        ...(props.listItemStyle || {}),
        ...(props.dynamic ? { minHeight: `${estimatedItemHeight()}px` } : { height: `${itemHeight()}px` })
      };
const mountContent = (element: HTMLElement, value: unknown): void => {
  element.replaceChildren();
  if (value == null) return;
  if (typeof Node !== "undefined" && value instanceof Node) element.appendChild(value);
  else element.textContent = String(value);
};
const renderWindowImmediately = (
  state: ReturnType<typeof computeVirtualWindow>,
  viewport: HTMLElement | null = viewportRef.value
): void => {
  if (props.dynamic) return;
  const windowElement = viewport?.querySelector<HTMLElement>(".window");
  if (!windowElement) return;
  const existing = new Map(
    Array.from(windowElement.querySelectorAll<HTMLElement>(".item[data-virtual-key]"))
      .map((element) => [String(element.dataset.virtualKey), element] as const)
  );
  const source = items();
  const nextKeys = new Set<string>();
  for (let index = state.start; index < state.end; index += 1) {
    nextKeys.add(keyOf(source[index], index));
  }
  const reusable = Array.from(existing.entries())
    .filter(([key]) => !nextKeys.has(key))
    .map(([, element]) => element);
  const nextElements: HTMLElement[] = [];
  for (let index = state.start; index < state.end; index += 1) {
    const item = source[index];
    const key = keyOf(item, index);
    // Recycle the previous window's elements when a thumb drag jumps farther
    // than the overscan range. Keeping the DOM layer alive avoids a white frame
    // while Chromium paints an entirely new row set.
    const element = existing.get(key) ?? reusable.shift() ?? document.createElement("div");
    element.className = `item ${String(props.listItemClass || "")}`.trim();
    element.setAttribute("part", "item list-item");
    element.setAttribute("role", "listitem");
    element.dataset.virtualKey = key;
    element.dataset.virtualIndex = String(index);
    element.tabIndex = 0;
    element.onkeydown = (event) => onItemKeydown(index, event);
    mountContent(element, render(item, index));
    element.style.cssText = typeof props.listItemStyle === "string" ? props.listItemStyle : "";
    if (props.listItemStyle && typeof props.listItemStyle === "object") {
      Object.entries(props.listItemStyle).forEach(([name, value]) => {
        const cssName = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
        element.style.setProperty(cssName, String(value));
      });
    }
    element.style.height = `${itemHeight()}px`;
    nextElements.push(element);
  }
  windowElement.style.top = "0px";
  windowElement.style.transform = `translate3d(0, ${state.offset}px, 0)`;
  windowElement.replaceChildren(...nextElements);
};

const synchronizeDeclarativeWindow = (offset: number, size: number): void => {
  if (scrollOffset.peek() !== offset) scrollOffset.set(offset);
  if (viewportSize.peek() !== size) viewportSize.set(size);
};

const onScroll = (event: Event): void => {
  const target = event.currentTarget as HTMLElement;
  const normalizedOffset = Math.max(0, target.scrollTop);
  const nextViewportSize = Math.max(0, target.clientHeight);
  if (props.dynamic) {
    synchronizeDeclarativeWindow(normalizedOffset, nextViewportSize);
    queueMicrotask(observeVisibleRows);
    return;
  }
  // Native scrollbar thumb dragging can advance the compositor viewport
  // before a batched reactive render is committed. Recycle and position the
  // bounded row window synchronously in the scroll handler, then synchronize
  // the declarative state for subsequent prop-driven renders.
  const nextWindow = computeVirtualWindow({
    count: items().length,
    itemSize: itemHeight(),
    viewportSize: nextViewportSize,
    scrollOffset: normalizedOffset,
    overscan: effectiveOverscan(nextViewportSize)
  });
  renderWindowImmediately(nextWindow, target);

  // Keep the compositor-facing window synchronous while a scrollbar thumb is
  // moving. Reconciling the keyed template on every scroll event can briefly
  // clear that window in Chromium; commit once scrolling settles instead.
  if (scrollSyncTimer) clearTimeout(scrollSyncTimer);
  scrollSyncTimer = setTimeout(
    () => synchronizeDeclarativeWindow(normalizedOffset, nextViewportSize),
    160
  );
};
const scrollToOffset = (offset: number, behavior: ScrollBehavior = "auto"): void => {
  const viewport = viewportRef.value;
  if (!viewport) return;
  const top = Math.max(0, offset);
  if (typeof viewport.scrollTo === "function") viewport.scrollTo({ top, behavior });
  else viewport.scrollTop = top;
};
const itemBounds = (index: number): { start: number; end: number } => {
  const normalized = Math.max(0, Math.min(items().length - 1, Math.floor(index)));
  if (!props.dynamic) {
    const start = normalized * itemHeight();
    return { start, end: start + itemHeight() };
  }
  const offsets = dynamicOffsets();
  return { start: offsets[normalized] || 0, end: offsets[normalized + 1] || 0 };
};
const scrollToIndex = (
  index: number,
  behavior: ScrollBehavior = "auto",
  align: VirtualListAlign = "start"
): void => {
  if (items().length === 0) return;
  const bounds = itemBounds(index);
  const viewport = viewportRef.value;
  const current = viewport?.scrollTop ?? scrollOffset.peek();
  const size = viewport?.clientHeight || viewportSize.peek();
  let top = bounds.start;
  if (align === "center") top = bounds.start - (size - (bounds.end - bounds.start)) / 2;
  else if (align === "end") top = bounds.end - size;
  else if (align === "auto") {
    top = bounds.start < current ? bounds.start : bounds.end > current + size ? bounds.end - size : current;
  }
  scrollToOffset(Math.max(0, top), behavior);
  synchronizeDeclarativeWindow(Math.max(0, top), size);
};
const scrollToKey = (
  key: string | number,
  behavior: ScrollBehavior = "auto",
  align: VirtualListAlign = "start"
): void => {
  const index = items().findIndex((item, itemIndex) => keyOf(item, itemIndex) === String(key));
  if (index >= 0) scrollToIndex(index, behavior, align);
};
const focusIndex = (index: number): void => {
  const normalized = Math.max(0, Math.min(items().length - 1, index));
  scrollToIndex(normalized, "auto", "auto");
  queueMicrotask(() => host.shadowRoot
    ?.querySelector<HTMLElement>(`.item[data-virtual-index="${normalized}"]`)
    ?.focus());
};
const onItemKeydown = (index: number, event: KeyboardEvent): void => {
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const nextIndex = event.key === "Home"
    ? 0
    : event.key === "End"
      ? items().length - 1
      : index + (event.key === "ArrowDown" ? 1 : -1);
  focusIndex(nextIndex);
};
const getVisibleRange = (): { start: number; end: number } => {
  const state = windowState();
  return { start: state.start, end: state.end };
};

const observeVisibleRows = (): void => {
  if (!props.dynamic || !resizeObserver) return;
  resizeObserver.disconnect();
  host.shadowRoot?.querySelectorAll<HTMLElement>(".item[data-virtual-key]").forEach((row) => resizeObserver?.observe(row));
};
const onRowsResized = (entries: ResizeObserverEntry[]): void => {
  const state = windowState();
  let changed = false;
  let anchorDelta = 0;
  for (const entry of entries) {
    const row = entry.target as HTMLElement;
    const key = String(row.dataset.virtualKey || "");
    const index = Number(row.dataset.virtualIndex);
    const next = entry.contentRect.height;
    const previous = measuredHeights.get(key) || estimatedItemHeight();
    if (!key || !Number.isFinite(next) || next <= 0 || Math.abs(next - previous) < 0.5) continue;
    measuredHeights.set(key, next);
    if (index < state.start) anchorDelta += next - previous;
    changed = true;
  }
  if (!changed) return;
  measurementVersion.set(measurementVersion.peek() + 1);
  const viewport = viewportRef.value;
  if (viewport && anchorDelta !== 0) {
    viewport.scrollTop = Math.max(0, viewport.scrollTop + anchorDelta);
    scrollOffset.set(viewport.scrollTop);
  }
  queueMicrotask(observeVisibleRows);
};

useEffect(() => {
  const maximum = Math.max(0, windowState().totalSize - viewportSize.value);
  if (scrollOffset.value <= maximum) return;
  scrollToOffset(maximum);
});

useEffect(() => {
  if (!props.dynamic) return;
  visibleItems();
  queueMicrotask(observeVisibleRows);
});

onMounted(() => {
  const viewport = viewportRef.value;
  if (viewport?.clientHeight) viewportSize.set(viewport.clientHeight);
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(onRowsResized);
    observeVisibleRows();
  }
});

onBeforeUnmount(() => {
  if (scrollSyncTimer) clearTimeout(scrollSyncTimer);
  scrollSyncTimer = undefined;
  resizeObserver?.disconnect();
  resizeObserver = undefined;
});

defineExpose({ scrollToIndex, scrollToOffset, scrollToKey, getVisibleRange });
defineStyle(styles);

const VirtualList = defineHtml<VirtualListProps>(`
  <div ref="viewport" class="viewport" :class=${{ "is-bordered": props.bordered }} :style=${{ height: cssSize(props.height) }} role="list" :aria-busy=${props.loading ? "true" : "false"} @scroll=${onScroll}>
    <div v-if=${items().length > 0} class="spacer" :style=${{ height: `${windowState().totalSize}px` }}>
      <div
        class="window"
        :class=${{ "is-divided": props.divided }}
        :style=${{ transform: `translate3d(0, ${windowState().offset}px, 0)` }}
      >
        <div
          v-for="entry in visibleItems()"
          :key="entry.key"
          :class=${["item", props.listItemClass]}
          part="item list-item"
          :data-virtual-key="entry.key"
          :data-virtual-index="entry.index"
          :style=${itemStyle()}
          role="listitem"
          tabindex="0"
          @keydown="onItemKeydown(entry.index, $event)"
          v-elf-list-content="render(entry.item, entry.index)"
        ></div>
      </div>
    </div>
    <div v-else-if=${!props.loading} class="empty">${props.emptyText || locale.t("table.empty")}</div>
    <div v-if=${props.loading} class="loading" role="status">
      <span class="loading-spinner" aria-hidden="true"></span>
      <span>${props.loadingText}</span>
    </div>
  </div>
`);

export { VirtualList };
