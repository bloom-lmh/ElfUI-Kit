import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  onUnmounted,
  useHost,
  useRef,
  useEffect
} from "@elfui/core";

import styles from "./style.scss?inline";
import { computeAnchoredPosition, listenForExternalOverlayMotion } from "../../Common/anchored-overlay";
import { useLocaleProvider } from "../../Providers/context";
import type {
  PaginationEmits,
  PaginationPopperStyle,
  PaginationProps,
  PaginationSlots
} from "./types";

export type {
  PaginationElement,
  PaginationEmits,
  PaginationExpose,
  PaginationLayoutPart,
  PaginationPopperStyle,
  PaginationProps,
  PaginationSize,
  PaginationSlots
} from "./types";

type PagerItem = { key: string; label: string; page: number; ellipsis: boolean };

const toStyleObject = (value: PaginationPopperStyle): Record<string, string> => {
  if (!value) return {};
  if (typeof value === "string") {
    return Object.fromEntries(
      value
        .split(";")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => {
          const separator = item.indexOf(":");
          return separator < 0
            ? [item, ""]
            : [item.slice(0, separator).trim(), item.slice(separator + 1).trim()];
        })
    );
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, String(item)])
  );
};

const props = defineProps<PaginationProps>({
  total: { type: Number, default: 0 },
  currentPage: { type: Number, default: undefined },
  defaultCurrentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: undefined },
  defaultPageSize: { type: Number, default: 10 },
  pageCount: { type: Number, default: 0 },
  pageSizes: { type: Array, default: () => [10, 20, 30, 40, 50, 100] },
  pagerCount: { type: Number, default: 7 },
  layout: { type: String, default: "total, sizes, prev, pager, next, jumper" },
  background: { type: Boolean, default: false },
  size: { type: String, default: "" },
  small: { type: Boolean, default: false },
  prevText: { type: String, default: "" },
  nextText: { type: String, default: "" },
  prevIcon: { type: String, default: "" },
  nextIcon: { type: String, default: "" },
  teleported: { type: Boolean, default: true },
  appendSizeTo: { type: [String, Object], default: "body" },
  popperClass: { type: String, default: "" },
  popperStyle: { type: [String, Object], default: "" },
  disabled: { type: Boolean, default: false },
  hideOnSinglePage: { type: Boolean, default: false },
  ariaLabel: { type: String, default: "" }
});

const emit = defineEmits<PaginationEmits>();

const host = useHost();
const locale = useLocaleProvider();
const initialSize = Math.max(1, Math.trunc(Number(props.defaultPageSize) || 10));
const page = useRef(Math.max(1, Math.trunc(Number(props.defaultCurrentPage) || 1)));
const size = useRef(initialSize);
const jumpValue = useRef(String(page.value));
const sizeOpen = useRef(false);
const sizeActiveIndex = useRef(-1);
const sizeOverlayStyle = useRef<Record<string, string>>({});
const sizePlacement = useRef<"bottom-start" | "top-start">("bottom-start");
let overlayFrame = 0;
let cleanupAnchoredOverlay = (): void => {};

const total = (): number => Math.max(0, Number(props.total) || 0);
const pageSize = (): number => Math.max(1, Math.trunc(Number(size.value) || initialSize));
const pageSizes = (): number[] => Array.from(new Set(
  (Array.isArray(props.pageSizes) ? props.pageSizes : [])
    .map((item) => Math.trunc(Number(item)))
    .filter((item) => Number.isFinite(item) && item > 0)
));
const pageCount = (): number => {
  const explicit = Math.trunc(Number(props.pageCount) || 0);
  return explicit > 0 ? explicit : Math.max(1, Math.ceil(total() / pageSize()));
};
const clampPage = (value: number): number =>
  Math.min(Math.max(1, Math.trunc(Number(value) || 1)), pageCount());

const hasPart = (part: string): boolean =>
  String(props.layout || "")
    .split(",")
    .map((item) => item.trim())
    .includes(part);

const isHidden = (): boolean => Boolean(props.hideOnSinglePage && pageCount() <= 1);
const isFirst = (): boolean => page.value <= 1;
const isLast = (): boolean => page.value >= pageCount();
const totalText = (): string => locale.t("pagination.total", { total: total() });
const componentClass = (): Record<string, boolean> => ({
  "is-background": props.background,
  "is-small": props.small || props.size === "small",
  "is-large": props.size === "large",
  "is-disabled": props.disabled
});

let pagerWindow: { count: number; pagerCount: number; start: number; end: number } | null = null;

const pageItems = (): PagerItem[] => {
  const count = pageCount();
  const current = page.value;
  const rawPagerCount = Math.max(5, Number(props.pagerCount) || 7);
  const pagerCount = rawPagerCount % 2 === 0 ? rawPagerCount + 1 : rawPagerCount;
  if (count <= pagerCount) {
    pagerWindow = null;
    return Array.from({ length: count }, (_, index) => ({
      key: String(index + 1),
      label: String(index + 1),
      page: index + 1,
      ellipsis: false
    }));
  }

  // Keep a constant pager slot count while the window changes. The active
  // page remains in the same visual column at both transition boundaries.
  let start: number;
  let end: number;
  const cached =
    pagerWindow &&
    pagerWindow.count === count &&
    pagerWindow.pagerCount === pagerCount &&
    current >= pagerWindow.start &&
    current <= pagerWindow.end;
  if (cached) {
    ({ start, end } = pagerWindow!);
  } else {
    const side = Math.floor((pagerCount - 3) / 2);
    const nearStart = current <= side + 2;
    const nearEndStart = count - (pagerCount - side - 1);
    const nearEnd = current >= nearEndStart;
    start = nearStart ? 2 : nearEnd ? count - pagerCount + 1 : current - side;
    end = nearStart ? pagerCount : nearEnd ? count - 1 : current + side;
    pagerWindow = { count, pagerCount, start, end };
  }

  const items: PagerItem[] = [{ key: "1", label: "1", page: 1, ellipsis: false }];
  if (start > 2) items.push({ key: "prev-more", label: "...", page: Math.max(1, start - 1), ellipsis: true });
  for (let pageNo = start; pageNo <= end; pageNo++) {
    items.push({ key: String(pageNo), label: String(pageNo), page: pageNo, ellipsis: false });
  }
  if (end < count - 1) items.push({ key: "next-more", label: "...", page: Math.min(count, end + 1), ellipsis: true });
  items.push({ key: String(count), label: String(count), page: count, ellipsis: false });
  return items;
};

const isPageActive = (item: PagerItem): boolean => !item.ellipsis && item.page === page.value;
const pageLabel = (item: PagerItem): string =>
  locale.t(item.ellipsis ? "pagination.jumpTo" : "pagination.page", { page: item.page });
const isSizeSelected = (item: unknown): boolean => Number(item) === size.value;
const selectedSizeLabel = (): string => locale.t("pagination.perPage", { size: pageSize() });
const sizeOptionId = (index: number): string => `elf-pagination-size-${index}`;
const sizePanelClass = (): unknown[] => [
  "size-panel",
  props.popperClass,
  `placement-${sizePlacement.value}`,
  { "is-teleported": props.teleported }
];
const sizePanelStyle = (): Record<string, string> => ({
  ...toStyleObject(props.popperStyle),
  ...(props.teleported ? sizeOverlayStyle.value : {})
});
const sizeAppendTarget = (): string =>
  typeof props.appendSizeTo === "string" ? props.appendSizeTo : "element";
const getSizeTrigger = (): HTMLButtonElement | null =>
  host.shadowRoot?.querySelector<HTMLButtonElement>(".size-trigger") || null;
const getSizePanel = (): HTMLElement | null =>
  host.shadowRoot?.querySelector<HTMLElement>(".size-panel") || null;
const prevLabel = (): string => props.prevText || locale.t("pagination.previous");
const nextLabel = (): string => props.nextText || locale.t("pagination.next");
const defaultPageSize = (): number => {
  const attribute = host.getAttribute("default-page-size");
  return Math.max(1, Math.trunc(Number(attribute ?? props.defaultPageSize) || initialSize));
};
const defaultCurrentPage = (): number => {
  const attribute = host.getAttribute("default-current-page");
  return Math.max(1, Math.trunc(Number(attribute ?? props.defaultCurrentPage) || 1));
};

const syncPage = (next: number): void => {
  const normalized = clampPage(next);
  if (normalized === page.peek()) return;
  page.set(normalized);
  jumpValue.set(String(normalized));
};

const emitPage = (next: number): void => {
  const normalized = clampPage(next);
  if (normalized === page.value) return;
  page.set(normalized);
  jumpValue.set(String(normalized));
  emit("update:currentPage", normalized);
  emit("current-change", normalized);
  emit("change", normalized, pageSize());
};

const emitSize = (next: number): void => {
  const normalized = Math.max(1, Math.trunc(Number(next) || pageSize()));
  if (normalized === size.value) return;
  const previousPage = page.value;
  size.set(normalized);
  const nextPage = clampPage(previousPage);
  page.set(nextPage);
  jumpValue.set(String(nextPage));
  emit("update:pageSize", normalized);
  emit("size-change", normalized);
  if (nextPage !== previousPage) {
    emit("update:currentPage", nextPage);
    emit("current-change", nextPage);
  }
  emit("change", nextPage, normalized);
};

const go = (next: number): void => {
  if (!props.disabled) emitPage(next);
};

const updateSizeOverlayPosition = (): void => {
  if (!props.teleported || typeof window === "undefined") {
    sizeOverlayStyle.set({});
    sizePlacement.set("bottom-start");
    return;
  }
  const trigger = getSizeTrigger();
  const panel = getSizePanel();
  if (!trigger || !panel) return;

  const anchorRect = trigger.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  const viewport = window.visualViewport;
  const next = computeAnchoredPosition(
    anchorRect,
    { width: Math.max(anchorRect.width, panelRect.width, 112), height: panelRect.height },
    {
      width: viewport?.width || window.innerWidth,
      height: viewport?.height || window.innerHeight,
      offsetLeft: viewport?.offsetLeft || 0,
      offsetTop: viewport?.offsetTop || 0
    },
    { placement: "bottom-start", offset: [0, 6], padding: 8, flip: true }
  );
  sizePlacement.set(next.placement as "bottom-start" | "top-start");
  sizeOverlayStyle.set({
    position: "fixed",
    left: `${next.left}px`,
    top: `${next.top}px`,
    minWidth: `${Math.max(anchorRect.width, 112)}px`
  });
};

const requestSizeOverlayUpdate = (): void => {
  if (typeof window === "undefined") return;
  if (overlayFrame) cancelAnimationFrame(overlayFrame);
  overlayFrame = requestAnimationFrame(() => {
    overlayFrame = 0;
    updateSizeOverlayPosition();
  });
};

const syncSizeTopLayer = (): void => {
  const panel = getSizePanel() as (HTMLElement & {
    showPopover?: () => void;
    hidePopover?: () => void;
  }) | null;
  if (!panel) return;
  try {
    if (props.teleported && sizeOpen.value) panel.showPopover?.();
    else panel.hidePopover?.();
  } catch {
    // Conditional rendering can disconnect the panel before its popover state settles.
  }
  if (sizeOpen.value) requestSizeOverlayUpdate();
};

const connectSizeOverlay = (): void => {
  cleanupAnchoredOverlay();
  if (!props.teleported || !sizeOpen.value || typeof window === "undefined") return;
  const trigger = getSizeTrigger();
  const panel = getSizePanel();
  const observer = typeof ResizeObserver !== "undefined"
    ? new ResizeObserver(requestSizeOverlayUpdate)
    : undefined;
  if (trigger) observer?.observe(trigger);
  if (panel) observer?.observe(panel);
  const cleanupMotion = listenForExternalOverlayMotion(
    () => [getSizePanel()],
    () => closeSizeMenu()
  );
  window.addEventListener("resize", requestSizeOverlayUpdate, { passive: true });
  window.visualViewport?.addEventListener("resize", requestSizeOverlayUpdate, { passive: true });
  cleanupAnchoredOverlay = () => {
    observer?.disconnect();
    cleanupMotion();
    window.removeEventListener("resize", requestSizeOverlayUpdate);
    window.visualViewport?.removeEventListener("resize", requestSizeOverlayUpdate);
  };
};

const openSizeMenu = (): void => {
  if (props.disabled || pageSizes().length === 0 || sizeOpen.value) return;
  const selectedIndex = pageSizes().findIndex(isSizeSelected);
  sizeActiveIndex.set(selectedIndex >= 0 ? selectedIndex : 0);
  sizeOpen.set(true);
  queueMicrotask(() => {
    syncSizeTopLayer();
    connectSizeOverlay();
  });
};

const closeSizeMenu = (returnFocus = false): void => {
  const panel = getSizePanel() as (HTMLElement & { hidePopover?: () => void }) | null;
  try {
    panel?.hidePopover?.();
  } catch {
    // The browser may already have closed a disconnected popover.
  }
  sizeOpen.set(false);
  sizeActiveIndex.set(-1);
  cleanupAnchoredOverlay();
  if (returnFocus) getSizeTrigger()?.focus();
};

const toggleSizeMenu = (): void => {
  if (sizeOpen.value) closeSizeMenu();
  else openSizeMenu();
};

const setSizeActive = (index: number): void => {
  if (index >= 0 && index < pageSizes().length) sizeActiveIndex.set(index);
};

const moveSizeActive = (step: number): void => {
  if (!sizeOpen.value) {
    openSizeMenu();
    return;
  }
  const count = pageSizes().length;
  if (!count) return;
  sizeActiveIndex.set((sizeActiveIndex.value + step + count) % count);
};

const selectPageSize = (value: number): void => {
  if (props.disabled) return;
  emitSize(value);
  closeSizeMenu(true);
};

const onSizeTriggerKeydown = (event: KeyboardEvent): void => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    moveSizeActive(event.key === "ArrowDown" ? 1 : -1);
    return;
  }
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (!sizeOpen.value) openSizeMenu();
    else {
      const value = pageSizes()[sizeActiveIndex.value];
      if (value != null) selectPageSize(value);
    }
    return;
  }
  if (event.key === "Escape" && sizeOpen.value) {
    event.preventDefault();
    closeSizeMenu(true);
  }
};

const onSizePanelKeydown = (event: KeyboardEvent): void => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeSizeMenu(true);
  }
};

const onDocumentPointerDown = (event: PointerEvent): void => {
  if (sizeOpen.value && !event.composedPath().includes(host)) closeSizeMenu();
};

const prev = (): void => {
  if (props.disabled || isFirst()) return;
  const nextPage = page.value - 1;
  emit("prev-click", nextPage);
  emitPage(nextPage);
};

const next = (): void => {
  if (props.disabled || isLast()) return;
  const nextPage = page.value + 1;
  emit("next-click", nextPage);
  emitPage(nextPage);
};

const onJumpInput = (event: Event): void => jumpValue.set((event.target as HTMLInputElement).value);
const commitJump = (): void => {
  if (!props.disabled) emitPage(Number(jumpValue.value));
};
const onJumpKeydown = (event: KeyboardEvent): void => {
  if (event.key === "Enter") {
    event.preventDefault();
    commitJump();
  }
};

// Defaults establish initial uncontrolled state. A supplied v-model prop takes over afterwards.
useEffect(() => {
  if (props.pageSize != null) {
    const nextSize = Math.max(1, Math.trunc(Number(props.pageSize) || initialSize));
    if (nextSize !== size.peek()) size.set(nextSize);
  }
});

useEffect(() => {
  if (props.currentPage != null) syncPage(Number(props.currentPage));
});

useEffect(() => {
  syncPage(page.value);
});

useEffect(() => {
  void props.teleported;
  void props.popperClass;
  void props.popperStyle;
  void props.appendSizeTo;
  if (sizeOpen.value) queueMicrotask(() => {
    syncSizeTopLayer();
    connectSizeOverlay();
  });
});

// Custom-element properties assigned before connection are finalized by mount time.
// Sample defaults once here without turning them into reactive controlled values.
onMounted(() => {
  if (props.pageSize == null) {
    size.set(defaultPageSize());
  }
  if (props.currentPage == null) {
    syncPage(defaultCurrentPage());
  }
  document.addEventListener("pointerdown", onDocumentPointerDown);
});

onUnmounted(() => {
  document.removeEventListener("pointerdown", onDocumentPointerDown);
  cleanupAnchoredOverlay();
  if (overlayFrame) cancelAnimationFrame(overlayFrame);
});

defineExpose({ openSizeMenu, closeSizeMenu });

defineStyle(styles);

const sizeActiveDescendant = (): string | null =>
  sizeOpen.value && sizeActiveIndex.value >= 0 ? sizeOptionId(sizeActiveIndex.value) : null;

const Pagination = defineHtml<PaginationProps, PaginationEmits, PaginationSlots>(`
  <nav
    v-if=${!isHidden()}
    class="pagination"
    :class=${componentClass()}
    role="navigation"
    :aria-label=${props.ariaLabel || locale.t("pagination.navigation")}
  >
    <span v-if=${hasPart("total")} class="total">${totalText()}</span>

    <div v-if=${hasPart("sizes")} class="sizes">
      <button
        class="size-trigger"
        part="size-trigger"
        type="button"
        aria-haspopup="listbox"
        :aria-expanded=${String(sizeOpen)}
        :aria-activedescendant=${sizeActiveDescendant()}
        :disabled=${props.disabled}
        @click=${toggleSizeMenu}
        @keydown=${onSizeTriggerKeydown}
      >
        <span>${selectedSizeLabel()}</span>
        <span class="size-chevron" aria-hidden="true"></span>
      </button>
      <div
        v-if=${sizeOpen}
        :popover=${props.teleported ? "manual" : undefined}
        :class=${sizePanelClass()}
        :style=${sizePanelStyle()}
        part="size-dropdown"
        role="listbox"
        :aria-label=${locale.t("pagination.pageSize")}
        :data-append-size-to=${sizeAppendTarget()}
        @keydown=${onSizePanelKeydown}
      >
        <button
          v-for="(item, index) in pageSizes()"
          :key="item"
          :id="sizeOptionId(index)"
          type="button"
          role="option"
          :aria-selected="isSizeSelected(item) ? 'true' : 'false'"
          :class="{ 'is-selected': isSizeSelected(item), 'is-active': index === sizeActiveIndex }"
          @mouseenter="setSizeActive(index)"
          @click="selectPageSize(item)"
        >
          {{locale.t("pagination.perPage", { size: item })}}
        </button>
      </div>
    </div>

    <button
      v-if=${hasPart("prev")}
      class="nav"
      type="button"
      :disabled=${props.disabled || isFirst()}
      :aria-label=${prevLabel()}
      @click=${prev}
    >
      <span v-if=${props.prevText}>${props.prevText}</span>
      <slot v-else name="prev-icon">
        <span v-if=${props.prevIcon} class="prop-icon" aria-hidden="true">${props.prevIcon}</span>
        <span v-else class="chevron chevron-left" aria-hidden="true"></span>
      </slot>
    </button>

    <div v-if=${hasPart("pager")} class="pager" role="list" aria-label="Page list">
      <button
        v-for="item in pageItems()"
        :key="item.key"
        type="button"
        class="page"
        :class="{ 'is-active': isPageActive(item), 'is-ellipsis': item.ellipsis }"
        :disabled=${props.disabled}
        :aria-label="pageLabel(item)"
        :aria-current="isPageActive(item) ? 'page' : undefined"
        @click="go(item.page)"
      >
        {{ item.label }}
      </button>
    </div>

    <button
      v-if=${hasPart("next")}
      class="nav"
      type="button"
      :disabled=${props.disabled || isLast()}
      :aria-label=${nextLabel()}
      @click=${next}
    >
      <span v-if=${props.nextText}>${props.nextText}</span>
      <slot v-else name="next-icon">
        <span v-if=${props.nextIcon} class="prop-icon" aria-hidden="true">${props.nextIcon}</span>
        <span v-else class="chevron chevron-right" aria-hidden="true"></span>
      </slot>
    </button>

    <label v-if=${hasPart("jumper")} class="jumper">
      <span>${locale.t("pagination.goTo")}</span>
      <input
        :value=${jumpValue}
        :disabled=${props.disabled}
        type="number"
        min="1"
        :max=${pageCount()}
        :aria-label=${locale.t("pagination.jumpPage")}
        @input=${onJumpInput}
        @change=${commitJump}
        @keydown=${onJumpKeydown}
      />
      <span>${locale.t("pagination.pageSuffix")}</span>
    </label>
    <slot></slot>
  </nav>
`);

export { Pagination };
