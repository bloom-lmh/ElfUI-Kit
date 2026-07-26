import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  useEffect,
  useHost,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useRef
} from "@elfui/core";

import { SplitterPanel } from "./panel";
import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";
import type {
  SplitterEmits,
  SplitterPanelProps,
  SplitterPanelSlots,
  SplitterProps,
  SplitterSlots
} from "./types";

export { SplitterPanel } from "./panel";
export type {
  SplitterEmits,
  SplitterPanelProps,
  SplitterPanelSlots,
  SplitterProps,
  SplitterSlots
} from "./types";

type SplitterPanelElement = HTMLElement & Partial<SplitterPanelProps>;

const props = defineProps<SplitterProps>({
  modelValue: { type: Number, default: 50 },
  min: { type: Number, default: 10 },
  max: { type: Number, default: 90 },
  vertical: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  collapsible: { type: Boolean, default: false },
  resizable: { type: Boolean, default: true },
  storageKey: { type: String, default: "" }
});

const emit = defineEmits<SplitterEmits>();
const locale = useLocaleProvider();
const host = useHost<HTMLElement>();

// State
const dragging = useRef(false);
const size = useRef(50);
const collapsed = useRef(false);
const lastExpandedSize = useRef(50);
const firstPanel = useRef<SplitterPanelElement | null>(null);
const panelContractRevision = useRef(0);
let panelContractObserver: MutationObserver | null = null;

// Size helpers
const numberOr = (value: unknown, fallback: number): number => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const panelMin = (): number => numberOr(firstPanel.value?.min, numberOr(props.min, 10));
const panelMax = (): number => numberOr(firstPanel.value?.max, numberOr(props.max, 90));

const clamp = (value: number): number => {
  const min = Math.min(panelMin(), panelMax());
  const max = Math.max(panelMin(), panelMax());
  return Math.min(max, Math.max(min, value));
};

const currentSize = (): number => (collapsed.value ? 0 : clamp(size.value));
const panelCanResize = (): boolean => {
  void panelContractRevision.value;
  const panel = firstPanel.value;
  if (!panel) return true;
  const reflected = panel.getAttribute("data-resizable");
  if (reflected != null) return reflected !== "false";
  return panel.resizable !== false;
};
const canResize = (): boolean => !props.disabled && props.resizable && panelCanResize();
const canCollapse = (): boolean => Boolean(props.collapsible || firstPanel.value?.collapsible);

const persist = (value: number): void => {
  if (!props.storageKey) return;
  try {
    localStorage.setItem(props.storageKey, String(value));
  } catch {
    // Storage can be unavailable in privacy mode; resizing must keep working.
  }
};

const hasPersistedSize = (): boolean => {
  if (!props.storageKey) return false;
  try {
    return localStorage.getItem(props.storageKey) != null;
  } catch {
    return false;
  }
};

const syncPanelState = (): void => {
  if (firstPanel.value?.tagName.toLowerCase() === "elf-splitter-panel") {
    firstPanel.value.collapsed = collapsed.value;
  }
};

const commitSize = (value: number): void => {
  const next = clamp(value);
  collapsed.set(false);
  size.set(next);
  lastExpandedSize.set(next);
  syncPanelState();
  persist(next);
  emit("update:modelValue", next);
  emit("change", next);
};

const toggleCollapse = (): void => {
  if (!canCollapse()) return;
  if (collapsed.value) {
    const restored = clamp(lastExpandedSize.value || 50);
    collapsed.set(false);
    size.set(restored);
    persist(restored);
    emit("update:modelValue", restored);
    emit("change", restored);
  } else {
    lastExpandedSize.set(Math.max(size.value, panelMin()));
    collapsed.set(true);
    persist(0);
    emit("update:modelValue", 0);
    emit("change", 0);
  }
  syncPanelState();
  emit("collapse", collapsed.value);
};

// Panel discovery
const resolvePanel = (event: Event): SplitterPanelElement | null => {
  const slot = event.currentTarget as HTMLSlotElement;
  return (slot.assignedElements({ flatten: true })[0] as SplitterPanelElement | undefined) ?? null;
};

const onFirstSlotChange = (event: Event): void => {
  panelContractObserver?.disconnect();
  panelContractObserver = null;
  firstPanel.set(resolvePanel(event));
  const panel = firstPanel.value;
  if (!panel) return;
  panelContractObserver = new MutationObserver(() => {
    panelContractRevision.set(panelContractRevision.peek() + 1);
    if (!canResize() && dragging.peek()) endResize();
  });
  panelContractObserver.observe(panel, {
    attributes: true,
    attributeFilter: ["data-resizable"]
  });
  if (!host.hasAttribute("model-value") && !hasPersistedSize() && panel.tagName.toLowerCase() === "elf-splitter-panel") {
    const initial = clamp(numberOr(panel.size, 50));
    size.set(initial);
    lastExpandedSize.set(initial);
  }
  syncPanelState();
};

// Pointer and keyboard methods
const percentageFromPointer = (bar: HTMLElement, clientX: number, clientY: number): number => {
  const container = bar.parentElement;
  if (!container) return currentSize();
  const rect = container.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return currentSize();
  const raw = props.vertical
    ? ((clientY - rect.top) / rect.height) * 100
    : ((clientX - rect.left) / rect.width) * 100;
  return clamp(raw);
};

const onPointerDown = (event: PointerEvent): void => {
  if (!canResize()) return;
  event.preventDefault();
  const bar = event.currentTarget as HTMLElement;
  try {
    bar.setPointerCapture?.(event.pointerId);
  } catch {
    // Pointer capture is not available in every test/browser environment.
  }
  dragging.set(true);
  emit("resize-start", currentSize());
};

const onPointerMove = (event: PointerEvent): void => {
  if (!dragging.value || !canResize()) return;
  event.preventDefault();
  commitSize(percentageFromPointer(event.currentTarget as HTMLElement, event.clientX, event.clientY));
};

const endResize = (): void => {
  if (!dragging.value) return;
  dragging.set(false);
  emit("resize-end", currentSize());
};

const onPointerUp = (event: PointerEvent): void => {
  if (!dragging.value) return;
  try {
    (event.currentTarget as HTMLElement).releasePointerCapture?.(event.pointerId);
  } catch {
    // Capture may already have been released.
  }
  endResize();
};

const onKeyDown = (event: KeyboardEvent): void => {
  if (!canResize()) return;
  if (event.key === "Home" && canCollapse()) {
    event.preventDefault();
    if (!collapsed.value) toggleCollapse();
    return;
  }
  if (event.key === "End" && collapsed.value) {
    event.preventDefault();
    toggleCollapse();
    return;
  }

  const increase = ["ArrowRight", "ArrowDown"].includes(event.key);
  const decrease = ["ArrowLeft", "ArrowUp"].includes(event.key);
  if (!increase && !decrease) return;
  event.preventDefault();
  commitSize(currentSize() + (increase ? 5 : -5));
};

const stopCollapsePointerDown = (event: PointerEvent): void => {
  event.stopPropagation();
};

// Reactive synchronization and lifecycle
useEffect(() => {
  if (firstPanel.value && !host.hasAttribute("model-value") && !hasPersistedSize()) return;
  const next = clamp(numberOr(props.modelValue, 50));
  if (!dragging.peek() && !collapsed.peek() && size.peek() !== next) {
    size.set(next);
    lastExpandedSize.set(next);
  }
});

onMounted(() => {
  if (!props.storageKey) return;
  try {
    const storedValue = localStorage.getItem(props.storageKey);
    if (storedValue == null) return;
    const stored = Number(storedValue);
    if (!Number.isFinite(stored)) return;
    if (stored === 0 && canCollapse()) collapsed.set(true);
    else {
      size.set(clamp(stored));
      lastExpandedSize.set(clamp(stored));
    }
    syncPanelState();
  } catch {
    // Ignore unavailable or invalid storage.
  }
});

onMounted(() => () => {
  panelContractObserver?.disconnect();
  panelContractObserver = null;
});

useHostAttr("vertical", () => (props.vertical ? "" : null));
useHostFlag("disabled", () => Boolean(props.disabled));
useHostFlag("collapsed", () => collapsed.value);
useHostCssVar("--_splitter-size", () => `${currentSize()}%`);

defineStyle(styles);

const Splitter = defineHtml<SplitterProps, SplitterEmits, SplitterSlots>(`
  <div class="splitter" part="splitter">
    <section :class=${["pane", "first", { "is-collapsed": collapsed }]} part="first">
      <slot name="first" @slotchange=${onFirstSlotChange}></slot>
    </section>
    <div
      :class=${["bar", { "is-static": !canResize() }]}
      part="bar"
      role="separator"
      :tabindex=${canResize() ? 0 : -1}
      :aria-disabled=${!canResize() ? "true" : undefined}
      :aria-valuenow=${currentSize()}
      :aria-valuemin=${panelMin()}
      :aria-valuemax=${panelMax()}
      :aria-valuetext=${collapsed
        ? locale.t("a11y.collapsed")
        : locale.t("splitter.size", { size: Math.round(currentSize()) })}
      :aria-orientation=${props.vertical ? "vertical" : "horizontal"}
      @pointerdown=${onPointerDown}
      @pointermove=${onPointerMove}
      @pointerup=${onPointerUp}
      @lostpointercapture=${endResize}
      @keydown=${onKeyDown}
      @dblclick=${toggleCollapse}
    >
      <button
        v-if=${canCollapse()}
        class="collapse-button"
        type="button"
        :aria-label=${locale.t(
          collapsed ? "a11y.expandFirstPanel" : "a11y.collapseFirstPanel"
        )}
        @pointerdown=${stopCollapsePointerDown}
        @click.stop=${toggleCollapse}
      >
        ${props.vertical ? (collapsed ? "⌄" : "⌃") : collapsed ? "›" : "‹"}
      </button>
    </div>
    <section class="pane second" part="second"><slot name="second"></slot></section>
  </div>
`);

export { Splitter };
