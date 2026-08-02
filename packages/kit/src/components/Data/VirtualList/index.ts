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
  useEffect,
} from "@elfui/core";
import { listContentDirective } from "../list-content";
import {
  buildVirtualOffsets,
  computeVariableVirtualWindow,
  computeVirtualWindow,
  type VirtualWindow,
} from "../virtual-window";
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
  loadingText: { type: String, default: "Loading…" },
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
let cachedWindow = computeVirtualWindow({
  count: 0,
  itemSize: 1,
  viewportSize: 0,
  scrollOffset: 0,
});
let cachedVisibleSource: unknown[] | null = null;
let cachedVisibleStart = -1;
let cachedVisibleEnd = -1;
let cachedVisibleItems: Array<{ item: unknown; index: number; key: string }> = [];
let scrollSyncTimer: ReturnType<typeof setTimeout> | undefined;
let dynamicScrollFrame = 0;
let dynamicSettleFrame = 0;
let pendingDynamicScroll: { offset: number; size: number } | undefined;
let measurementFrame = 0;
let pendingAnchorDelta = 0;
let cachedOffsetSource: unknown[] | null = null;
let cachedOffsetVersion = -1;
let cachedOffsetEstimate = -1;
let cachedOffsets: number[] = [0];
const items = (): unknown[] => (Array.isArray(props.items) ? props.items : []);
const itemHeight = (): number => Math.max(1, Number(props.itemHeight) || 48);
const estimatedItemHeight = (): number =>
  Math.max(1, Number(props.estimatedItemHeight) || itemHeight());
const effectiveOverscan = (size = viewportSize.value): number =>
  Math.max(0, Number(props.overscan) || 0, Math.ceil(Math.max(0, size) / itemHeight()));
const effectiveDynamicOverscan = (size = viewportSize.value): number =>
  Math.max(0, Number(props.overscan) || 0, Math.ceil(Math.max(0, size) / estimatedItemHeight()));
const cssSize = (value: string | number): string => {
  if (typeof value === "number") return `${value}px`;
  const normalized = String(value).trim();
  return /^-?\d+(?:\.\d+)?$/.test(normalized) ? `${normalized}px` : normalized;
};
const keyOf = (item: unknown, index: number): string => {
  if (typeof props.itemKey === "function") return String(props.itemKey(item, index));
  if (item && typeof item === "object")
    return String((item as Record<string, unknown>)[String(props.itemKey)] ?? index);
  return String(index);
};
const dynamicOffsets = (): number[] => {
  const source = items();
  const estimate = estimatedItemHeight();
  if (
    source === cachedOffsetSource &&
    cachedOffsetVersion === measurementVersion.value &&
    cachedOffsetEstimate === estimate &&
    cachedOffsets.length === source.length + 1
  )
    return cachedOffsets;
  const offsets = buildVirtualOffsets(
    source,
    (item, index) => measuredHeights.get(keyOf(item, index)) || estimate,
    estimate,
  );
  cachedOffsetSource = source;
  cachedOffsetVersion = measurementVersion.value;
  cachedOffsetEstimate = estimate;
  cachedOffsets = offsets;
  return offsets;
};
const dynamicWindowState = (): VirtualWindow =>
  computeVariableVirtualWindow({
    offsets: dynamicOffsets(),
    viewportSize: viewportSize.value,
    scrollOffset: scrollOffset.value,
    overscan: effectiveDynamicOverscan(),
  });
const windowState = (): VirtualWindow => {
  const source = items();
  const overscan = props.dynamic ? effectiveDynamicOverscan() : effectiveOverscan();
  const key = `${props.dynamic}:${source.length}:${itemHeight()}:${estimatedItemHeight()}:${viewportSize.value}:${scrollOffset.value}:${overscan}:${measurementVersion.value}`;
  if (key === cachedWindowKey) return cachedWindow;
  cachedWindowKey = key;
  cachedWindow = props.dynamic
    ? dynamicWindowState()
    : computeVirtualWindow({
        count: source.length,
        itemSize: itemHeight(),
        viewportSize: viewportSize.value,
        scrollOffset: scrollOffset.value,
        overscan: effectiveOverscan(),
      });
  return cachedWindow;
};
const visibleItems = (): Array<{ item: unknown; index: number; key: string }> => {
  const source = items();
  const state = windowState();
  if (
    source === cachedVisibleSource &&
    state.start === cachedVisibleStart &&
    state.end === cachedVisibleEnd
  ) {
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
  if (typeof props.renderItem === "function")
    return (props.renderItem as ListItemRenderer)(item, index);
  return item && typeof item === "object" ? JSON.stringify(item) : String(item ?? "");
};
const itemStyle = (): string | Record<string, string | number> =>
  typeof props.listItemStyle === "string"
    ? `${props.listItemStyle};${props.dynamic ? `min-height:${estimatedItemHeight()}px` : `height:${itemHeight()}px`}`
    : {
        ...(props.listItemStyle || {}),
        ...(props.dynamic
          ? { minHeight: `${estimatedItemHeight()}px` }
          : { height: `${itemHeight()}px` }),
      };
const mountContent = (element: HTMLElement, value: unknown): void => {
  element.replaceChildren();
  if (value == null) return;
  if (typeof Node !== "undefined" && value instanceof Node) element.appendChild(value);
  else element.textContent = String(value);
};

const applyImmediateItemStyle = (element: HTMLElement): void => {
  element.style.cssText = typeof props.listItemStyle === "string" ? props.listItemStyle : "";
  if (props.listItemStyle && typeof props.listItemStyle === "object") {
    Object.entries(props.listItemStyle).forEach(([name, value]) => {
      const cssName = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      element.style.setProperty(cssName, String(value));
    });
  }
  if (props.dynamic) {
    element.style.removeProperty("height");
    element.style.minHeight = `${estimatedItemHeight()}px`;
  } else {
    element.style.removeProperty("min-height");
    element.style.height = `${itemHeight()}px`;
  }
};

const renderWindowImmediately = (
  state: VirtualWindow,
  viewport: HTMLElement | null = viewportRef.value,
): void => {
  const windowElement = viewport?.querySelector<HTMLElement>(
    props.dynamic ? ".scroll-window" : ".window",
  );
  if (!windowElement) return;
  if (props.dynamic) {
    if (dynamicSettleFrame) cancelAnimationFrame(dynamicSettleFrame);
    dynamicSettleFrame = 0;
    windowElement.hidden = false;
    const declarativeWindow = viewport?.querySelector<HTMLElement>(".window");
    declarativeWindow?.style.setProperty("visibility", "hidden");
  }
  const existing = new Map(
    Array.from(windowElement.querySelectorAll<HTMLElement>(".item[data-virtual-key]")).map(
      (element) => [String(element.dataset.virtualKey), element] as const,
    ),
  );
  const existingRows = Array.from(existing.values());
  if (
    existingRows.length === state.end - state.start &&
    Number(existingRows[0]?.dataset.virtualIndex) === state.start &&
    Number(existingRows.at(-1)?.dataset.virtualIndex) === state.end - 1
  ) {
    windowElement.style.transform = `translate3d(0, ${state.offset}px, 0)`;
    return;
  }
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
    applyImmediateItemStyle(element);
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

const settleDynamicScrollWindow = (): void => {
  dynamicSettleFrame = 0;
  const viewport = viewportRef.value;
  const scrollWindow = viewport?.querySelector<HTMLElement>(".scroll-window");
  const declarativeWindow = viewport?.querySelector<HTMLElement>(".window");
  if (scrollWindow) scrollWindow.hidden = true;
  declarativeWindow?.style.removeProperty("visibility");
  observeVisibleRows();
};

const scheduleDynamicScroll = (offset: number, size: number): void => {
  pendingDynamicScroll = { offset, size };
  if (dynamicScrollFrame) return;
  dynamicScrollFrame = requestAnimationFrame(() => {
    dynamicScrollFrame = 0;
    const next = pendingDynamicScroll;
    pendingDynamicScroll = undefined;
    if (!next) return;
    synchronizeDeclarativeWindow(next.offset, next.size);
    queueMicrotask(() => {
      observeVisibleRows();
      dynamicSettleFrame = requestAnimationFrame(settleDynamicScrollWindow);
    });
  });
};

const onScroll = (event: Event): void => {
  const target = event.currentTarget as HTMLElement;
  const normalizedOffset = Math.max(0, target.scrollTop);
  const nextViewportSize = Math.max(0, target.clientHeight);
  if (props.dynamic) {
    const nextWindow = computeVariableVirtualWindow({
      offsets: dynamicOffsets(),
      viewportSize: nextViewportSize,
      scrollOffset: normalizedOffset,
      overscan: effectiveDynamicOverscan(nextViewportSize),
    });
    renderWindowImmediately(nextWindow, target);
    scheduleDynamicScroll(normalizedOffset, nextViewportSize);
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
    overscan: effectiveOverscan(nextViewportSize),
  });
  renderWindowImmediately(nextWindow, target);

  // Keep the compositor-facing window synchronous while a scrollbar thumb is
  // moving. Reconciling the keyed template on every scroll event can briefly
  // clear that window in Chromium; commit once scrolling settles instead.
  if (scrollSyncTimer) clearTimeout(scrollSyncTimer);
  scrollSyncTimer = setTimeout(
    () => synchronizeDeclarativeWindow(normalizedOffset, nextViewportSize),
    160,
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
  align: VirtualListAlign = "start",
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
    top =
      bounds.start < current
        ? bounds.start
        : bounds.end > current + size
          ? bounds.end - size
          : current;
  }
  scrollToOffset(Math.max(0, top), behavior);
  synchronizeDeclarativeWindow(Math.max(0, top), size);
};
const scrollToKey = (
  key: string | number,
  behavior: ScrollBehavior = "auto",
  align: VirtualListAlign = "start",
): void => {
  const index = items().findIndex((item, itemIndex) => keyOf(item, itemIndex) === String(key));
  if (index >= 0) scrollToIndex(index, behavior, align);
};
const focusIndex = (index: number): void => {
  const normalized = Math.max(0, Math.min(items().length - 1, index));
  scrollToIndex(normalized, "auto", "auto");
  queueMicrotask(() =>
    host.shadowRoot
      ?.querySelector<HTMLElement>(`.item[data-virtual-index="${normalized}"]`)
      ?.focus(),
  );
};
const onItemKeydown = (index: number, event: KeyboardEvent): void => {
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const nextIndex =
    event.key === "Home"
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
  host.shadowRoot
    ?.querySelectorAll<HTMLElement>(".window > .item[data-virtual-key]")
    .forEach((row) => resizeObserver?.observe(row));
};

const measuredBlockSize = (entry: ResizeObserverEntry, row: HTMLElement): number => {
  const borderBox = Array.isArray(entry.borderBoxSize)
    ? entry.borderBoxSize[0]
    : entry.borderBoxSize;
  const borderBoxSize = Number(borderBox?.blockSize);
  if (Number.isFinite(borderBoxSize) && borderBoxSize > 0) return borderBoxSize;
  const renderedSize = row.getBoundingClientRect().height;
  return Number.isFinite(renderedSize) && renderedSize > 0
    ? renderedSize
    : entry.contentRect.height;
};

const onRowsResized = (entries: ResizeObserverEntry[]): void => {
  const viewport = viewportRef.value;
  const offsets = dynamicOffsets();
  const currentViewportSize = viewport?.clientHeight || viewportSize.peek();
  const currentScrollTop = viewport?.scrollTop ?? scrollOffset.peek();
  const currentMaximum = Math.max(0, (offsets.at(-1) || 0) - currentViewportSize);
  const keepEndPinned = currentMaximum - currentScrollTop <= 2;
  const visibleStart = computeVariableVirtualWindow({
    offsets,
    viewportSize: currentViewportSize,
    scrollOffset: currentScrollTop,
    overscan: 0,
  }).start;
  let changed = false;
  let totalDelta = 0;
  for (const entry of entries) {
    const row = entry.target as HTMLElement;
    const key = String(row.dataset.virtualKey || "");
    const index = Number(row.dataset.virtualIndex);
    const next = measuredBlockSize(entry, row);
    const previous = measuredHeights.get(key) || estimatedItemHeight();
    if (!key || !Number.isFinite(next) || next <= 0 || Math.abs(next - previous) < 0.5) continue;
    measuredHeights.set(key, next);
    const delta = next - previous;
    totalDelta += delta;
    if (!keepEndPinned && index < visibleStart) pendingAnchorDelta += delta;
    changed = true;
  }
  if (keepEndPinned) pendingAnchorDelta += totalDelta;
  if (!changed || measurementFrame) return;
  measurementFrame = requestAnimationFrame(() => {
    measurementFrame = 0;
    measurementVersion.set(measurementVersion.peek() + 1);
    const currentViewport = viewportRef.value;
    if (currentViewport && pendingAnchorDelta !== 0) {
      currentViewport.scrollTop = Math.max(0, currentViewport.scrollTop + pendingAnchorDelta);
      scrollOffset.set(currentViewport.scrollTop);
    }
    pendingAnchorDelta = 0;
    queueMicrotask(observeVisibleRows);
  });
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
  if (dynamicScrollFrame) cancelAnimationFrame(dynamicScrollFrame);
  dynamicScrollFrame = 0;
  if (dynamicSettleFrame) cancelAnimationFrame(dynamicSettleFrame);
  dynamicSettleFrame = 0;
  pendingDynamicScroll = undefined;
  if (measurementFrame) cancelAnimationFrame(measurementFrame);
  measurementFrame = 0;
  pendingAnchorDelta = 0;
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
      <div
        class="scroll-window"
        :class=${{ "is-divided": props.divided }}
        aria-hidden="true"
        hidden
      ></div>
    </div>
    <div v-else-if=${!props.loading} class="empty">${props.emptyText || locale.t("table.empty")}</div>
    <div v-if=${props.loading} class="loading" role="status">
      <span class="loading-spinner" aria-hidden="true"></span>
      <span>${props.loadingText}</span>
    </div>
  </div>
`);

export { VirtualList };
