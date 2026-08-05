// cspell:words syncchange STIX editstart

import {
  defineDirective,
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  onUnmounted,
  useEffect,
  useHost,
  useHostAttr,
  useHostCssVar,
  useRef,
  useTemplateRef,
} from "@elfui/core";
import type { DirectiveBinding } from "@elfui/core";
import { cssSize } from "../../surface";
import {
  buildVirtualOffsets,
  computeVariableVirtualWindow,
  type VirtualWindow,
} from "../../../utils/virtual-window";
import { blockMarkup, estimateBlockHeight, indexAtOffset, normalizeBlocks } from "./model";
import styles from "./style.scss?inline";
import type {
  DocSyncBlock,
  DocSyncEmits,
  DocSyncExpose,
  DocSyncMode,
  DocSyncParser,
  DocSyncProps,
  DocSyncRenderer,
} from "./types";

export type {
  DocSyncBlock,
  DocSyncEmits,
  DocSyncExpose,
  DocSyncMode,
  DocSyncParser,
  DocSyncProps,
  DocSyncRenderer,
} from "./types";

type DocSyncSide = "left" | "right";

const props = defineProps<DocSyncProps>({
  blocks: { type: Array, default: () => [] },
  source: { type: null, default: null },
  parse: { type: Function, default: null },
  renderLeft: { type: Function, default: null },
  renderRight: { type: Function, default: null },
  editable: { type: Boolean, default: true },
  lineNumbers: { type: Boolean, default: true },
  ruler: { type: Boolean, default: true },
  leftMode: { type: String, default: "source" },
  rightMode: { type: String, default: "preview" },
  leftLabel: { type: String, default: "" },
  rightLabel: { type: String, default: "" },
  lockScroll: { type: Boolean, default: false },
  overscan: { type: Number, default: 6 },
  estimatedHeight: { type: Number, default: 28 },
  split: { type: Number, default: 50 },
  height: { type: [String, Number], default: 420 },
  ariaLabel: { type: String, default: "Synchronized document panels" },
});

const emit = defineEmits<DocSyncEmits>(["activate", "syncchange", "editstart", "edit", "swap"]);
const host = useHost();
const docSyncContent = defineDirective(
  (element: HTMLElement, binding: DirectiveBinding<unknown>): void => {
    element.replaceChildren();
    const value = binding.value;
    if (value == null) return;
    if (typeof value === "object" && "nodeType" in value) element.appendChild(value as Node);
    else element.innerHTML = String(value);
  },
);
const leftViewport = useTemplateRef<HTMLElement>("leftViewport");
const rightViewport = useTemplateRef<HTMLElement>("rightViewport");

const normalized = useRef<DocSyncBlock[]>([]);
const leftHeights = useRef<number[]>([]);
const rightHeights = useRef<number[]>([]);
const measurementVersion = useRef(0);
const leftScroll = useRef(0);
const rightScroll = useRef(0);
const leftSize = useRef(320);
const rightSize = useRef(320);
const draggingSplit = useRef(false);
const dragStart = useRef({ x: 0, y: 0 });
const suppressClick = useRef(false);
const activeId = useRef<string | null>(null);
const activeSide = useRef<DocSyncSide | null>(null);
const swapped = useRef(false);
const editingId = useRef<string | null>(null);
const editingSide = useRef<DocSyncSide | null>(null);
const editingText = useRef("");
const focusEditor = useRef(false);
const programmatic = useRef<DocSyncSide | null>(null);
const programmaticTimer = useRef(0);
const lastAnchor = useRef<Record<DocSyncSide, string | null>>({ left: null, right: null });
const splitRatio = useRef(50);
const blocksSignature = useRef("");
let resizeObserver: ResizeObserver | null = null;
let cachedBlocks: DocSyncBlock[] | null = null;
let cachedVersion = -1;
let cachedEstimate = -1;
let cachedLeftOffsets: number[] = [0];
let cachedRightOffsets: number[] = [0];

useEffect(() => {
  const blockSignature = (Array.isArray(props.blocks) ? props.blocks : [])
    .map(
      (block) =>
        `${String(block?.type ?? "")}:${String(block?.text ?? "")}:${String(block?.level ?? "")}`,
    )
    .join("|");
  const sourceSignature = `${typeof props.parse}:${typeof props.source}:${String(
    props.source ?? "",
  )}`;
  const signature = `${sourceSignature}|${blockSignature}`;
  if (signature === blocksSignature.value) return;
  blocksSignature.set(signature);
  const raw = Array.isArray(props.blocks) ? props.blocks : [];
  const parsed =
    typeof props.parse === "function" && props.source != null
      ? (props.parse as DocSyncParser)(props.source)
      : raw;
  const next = normalizeBlocks(parsed);
  normalized.set(next);
  leftHeights.set([]);
  rightHeights.set([]);
  measurementVersion.set(measurementVersion.value + 1);
  activeId.set(null);
  activeSide.set(null);
});

const estimated = (): number => Math.max(8, Number(props.estimatedHeight) || 28);
const overscanValue = (): number => Math.max(0, Number(props.overscan) || 0);
const modeOf = (side: DocSyncSide): DocSyncMode =>
  side === "left"
    ? props.leftMode === "preview"
      ? "preview"
      : "source"
    : props.rightMode === "preview"
      ? "preview"
      : "source";
const renderBlock = (side: DocSyncSide, block: DocSyncBlock, index: number): unknown => {
  const renderer = side === "left" ? props.renderLeft : props.renderRight;
  if (typeof renderer === "function") return (renderer as DocSyncRenderer)(block, index);
  return blockMarkup(block, modeOf(side));
};

const roleOf = (side: DocSyncSide): DocSyncSide =>
  swapped.value ? (side === "left" ? "right" : "left") : side;

const roleLabel = (side: DocSyncSide): string =>
  roleOf(side) === "right" ? props.rightLabel : props.leftLabel;

const swapPanes = (): void => {
  swapped.set(!swapped.value);
  emit("swap");
};

const updateSplitFromPointer = (event: PointerEvent): void => {
  const rect = host.getBoundingClientRect();
  if (rect.width === 0) return;
  const next = Math.min(70, Math.max(30, ((event.clientX - rect.left) / rect.width) * 100));
  splitRatio.set(next);
  host.style.setProperty("--_doc-sync-split", `${next}%`);
};

const onSwapPointerDown = (event: PointerEvent): void => {
  dragStart.set({ x: event.clientX, y: event.clientY });
  draggingSplit.set(true);
  (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
};

const onSwapPointerMove = (event: PointerEvent): void => {
  if (!draggingSplit.value) return;
  updateSplitFromPointer(event);
};

const onSwapPointerUp = (event: PointerEvent): void => {
  if (!draggingSplit.value) return;
  draggingSplit.set(false);
  const start = dragStart.value;
  const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6;
  if (moved) suppressClick.set(true);
  const target = event.currentTarget as HTMLElement;
  if (target.hasPointerCapture?.(event.pointerId)) target.releasePointerCapture?.(event.pointerId);
};

const onSwapClick = (): void => {
  if (suppressClick.value) {
    suppressClick.set(false);
    return;
  }
  swapPanes();
};

const paneClass = (side: DocSyncSide): Record<string, boolean> => {
  const mode = modeOf(roleOf(side));
  return {
    "is-source": mode === "source",
    "is-preview": mode === "preview",
  };
};

const lineLabel = (block: DocSyncBlock, index: number): string => {
  const start = block.line ?? index + 1;
  const count = block.text?.includes("\n")
    ? block.text.split("\n").length
    : (block.items?.length ?? block.rows?.length ?? 1);
  return count > 1 ? `${start}–${start + count - 1}` : String(start);
};

const rulerMarks = (): Array<{ label: string | null; major: boolean }> => {
  const marks: Array<{ label: string | null; major: boolean }> = [];
  for (let at = 0; at <= 100; at += 2) {
    marks.push({
      label: at % 20 === 0 ? String(at) : null,
      major: at % 10 === 0,
    });
  }
  return marks;
};

const updateProgress = (): void => {
  const apply = (side: DocSyncSide, viewport: HTMLElement | null): void => {
    if (!viewport) return;
    const ratio =
      viewport.scrollHeight > viewport.clientHeight
        ? viewport.scrollTop / (viewport.scrollHeight - viewport.clientHeight)
        : 0;
    host.style.setProperty(
      side === "left" ? "--_doc-sync-left-progress" : "--_doc-sync-right-progress",
      `${Math.max(0, Math.min(1, ratio)) * 100}%`,
    );
  };
  apply("left", leftViewport.value);
  apply("right", rightViewport.value);
};
const heightsOf = (side: DocSyncSide): number[] =>
  side === "left" ? leftHeights.value : rightHeights.value;
const scrollOf = (side: DocSyncSide): number =>
  side === "left" ? leftScroll.value : rightScroll.value;
const sizeOf = (side: DocSyncSide): number => (side === "left" ? leftSize.value : rightSize.value);
const viewportOf = (side: DocSyncSide): HTMLElement | null =>
  side === "left" ? leftViewport.value : rightViewport.value;

const offsetsOf = (side: DocSyncSide): number[] => {
  const blocks = normalized.value;
  const estimate = estimated();
  if (
    blocks !== cachedBlocks ||
    measurementVersion.value !== cachedVersion ||
    estimate !== cachedEstimate
  ) {
    cachedLeftOffsets = buildVirtualOffsets(
      blocks,
      (block, index) => leftHeights.value[index] || estimateBlockHeight(block),
      estimate,
    );
    cachedRightOffsets = buildVirtualOffsets(
      blocks,
      (block, index) => rightHeights.value[index] || estimateBlockHeight(block),
      estimate,
    );
    cachedBlocks = blocks;
    cachedVersion = measurementVersion.value;
    cachedEstimate = estimate;
  }
  return side === "left" ? cachedLeftOffsets : cachedRightOffsets;
};

const windowOf = (side: DocSyncSide): VirtualWindow =>
  computeVariableVirtualWindow({
    offsets: offsetsOf(side),
    viewportSize: sizeOf(side),
    scrollOffset: scrollOf(side),
    overscan: overscanValue(),
  });

const windowItems = (side: DocSyncSide): Array<{ item: DocSyncBlock; index: number }> => {
  const state = windowOf(side);
  return normalized.value
    .slice(state.start, state.end)
    .map((item, offset) => ({ item, index: state.start + offset }));
};

const spacerBeforeStyle = (side: DocSyncSide): Record<string, string> => ({
  height: `${windowOf(side).offset}px`,
});

const spacerAfterStyle = (side: DocSyncSide): Record<string, string> => {
  const state = windowOf(side);
  const offsets = offsetsOf(side);
  return { height: `${Math.max(0, state.totalSize - (offsets[state.end] ?? state.totalSize))}px` };
};

const indexOfId = (id: string): number => normalized.value.findIndex((block) => block.id === id);

const topVisibleId = (side: DocSyncSide): string | null => {
  const blocks = normalized.value;
  if (blocks.length === 0) return null;
  const index = indexAtOffset(offsetsOf(side), scrollOf(side) + 4);
  return blocks[index]?.id ?? blocks[0]!.id!;
};

const scrollToId = (id: string | null, side: DocSyncSide): void => {
  if (!id) return;
  const index = indexOfId(id);
  if (index < 0) return;
  const viewport = viewportOf(side);
  if (!viewport) return;
  const top = Math.max(0, (offsetsOf(side)[index] ?? 0) - 8);
  programmatic.set(side);
  if (programmaticTimer.value) window.clearTimeout(programmaticTimer.value);
  programmaticTimer.value = window.setTimeout(() => {
    if (programmatic.value === side) programmatic.set(null);
  }, 160);
  viewport.scrollTop = top;
};

const onPaneScroll = (event: Event, side: DocSyncSide): void => {
  const viewport = event.currentTarget as HTMLElement;
  if (side === "left") leftScroll.set(viewport.scrollTop);
  else rightScroll.set(viewport.scrollTop);
  updateProgress();
  if (programmatic.value === side) {
    programmatic.set(null);
    return;
  }
  if (props.lockScroll) return;
  const id = topVisibleId(side);
  if (!id || id === lastAnchor.value[side]) return;
  lastAnchor.value[side] = id;
  lastAnchor.value[side === "left" ? "right" : "left"] = null;
  scrollToId(id, side === "left" ? "right" : "left");
  emit("syncchange", { side, id });
};

const activate = (id: string | null, fromSide: DocSyncSide | null): void => {
  if (activeId.value === id && activeSide.value === fromSide) return;
  activeId.set(id);
  activeSide.set(fromSide);
  emit("activate", id);
  if (id && fromSide) {
    const other = fromSide === "left" ? "right" : "left";
    const index = indexOfId(id);
    const state = windowOf(other);
    if (index < state.start || index >= state.end) scrollToId(id, other);
  }
};

const clearActive = (): void => activate(null, null);

const scrollTo = (id: string, side: DocSyncSide = "left"): void => scrollToId(id, side);

const onBlockClick = (side: DocSyncSide, item: DocSyncBlock): void => {
  activate(item.id ?? null, side);
};

const onBlockKeydown = (side: DocSyncSide, item: DocSyncBlock, event: KeyboardEvent): void => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    const index = indexOfId(item.id ?? "");
    if (index < 0) return;
    const next = normalized.value[index + (event.key === "ArrowDown" ? 1 : -1)];
    if (!next) return;
    activate(next.id ?? null, side);
    requestAnimationFrame(() => {
      const viewport = viewportOf(side);
      const blocks = viewport?.querySelectorAll<HTMLElement>(".doc-sync-block") ?? [];
      const target = Array.from(blocks).find((el) => el.dataset.syncId === next.id);
      target?.focus();
    });
    return;
  }
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    activate(item.id ?? null, side);
  }
};

const serializeBlock = (block: DocSyncBlock): string => {
  if (block.items?.length) return block.items.join("\n");
  if (block.rows?.length) return block.rows.map((row) => row.join(" | ")).join("\n");
  return block.text ?? "";
};

const applyEditedValue = (block: DocSyncBlock, value: string): DocSyncBlock => {
  if (block.items)
    return {
      ...block,
      items: value.split("\n").filter((line) => line.trim() !== ""),
    };
  if (block.rows)
    return {
      ...block,
      rows: value
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => line.split("|").map((cell) => cell.trim())),
    };
  return { ...block, text: value };
};

const isEditing = (block: DocSyncBlock): boolean =>
  Boolean(props.editable && editingId.value && block.id === editingId.value);

const onBlockDblClick = (side: DocSyncSide, block: DocSyncBlock): void => {
  if (!props.editable || !block.id) return;
  activate(block.id, side);
  editingId.set(block.id);
  editingSide.set(side);
  editingText.set(serializeBlock(block));
  focusEditor.set(true);
  emit("editstart", { id: block.id, side });
};

const onEditorInput = (event: Event): void => {
  editingText.set((event.target as HTMLTextAreaElement).value);
};

const cancelEdit = (): void => {
  editingId.set(null);
  editingSide.set(null);
  editingText.set("");
};

const commitEdit = (): void => {
  if (!editingId.value || !editingSide.value) return;
  const index = indexOfId(editingId.value);
  if (index >= 0) {
    const current = normalized.value[index]!;
    const next = applyEditedValue(current, editingText.value);
    const list = [...normalized.value];
    list[index] = next;
    normalized.set(list);
    measurementVersion.set(measurementVersion.value + 1);
    emit("edit", { id: next.id ?? "", side: editingSide.value, block: next });
  }
  cancelEdit();
};

const onEditorKeydown = (event: KeyboardEvent): void => {
  if (event.key === "Escape") {
    event.preventDefault();
    cancelEdit();
    return;
  }
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    commitEdit();
  }
};

const blockClass = (item: DocSyncBlock): Record<string, boolean> => ({
  "is-synced": Boolean(activeId.value && item.id === activeId.value),
});

const activeIndex = (): number => (activeId.value ? indexOfId(activeId.value) : -1);

const markerStyle = (side: DocSyncSide): Record<string, string> => {
  const index = activeIndex();
  if (index < 0) return {};
  const raw = (offsetsOf(side)[index] ?? 0) - scrollOf(side);
  const top = Math.max(0, Math.min(raw, Math.max(0, sizeOf(side) - 24)));
  return { top: `${top}px` };
};

const markerClass = (side: DocSyncSide): Record<string, boolean> => {
  const index = activeIndex();
  const classes: Record<string, boolean> = { "doc-sync-marker": true };
  if (index < 0) return classes;
  const raw = (offsetsOf(side)[index] ?? 0) - scrollOf(side);
  classes["is-above"] = raw < 0;
  classes["is-below"] = raw > sizeOf(side) - 24;
  return classes;
};

const measureBlocks = (side: DocSyncSide): void => {
  const viewport = viewportOf(side);
  if (!viewport) return;
  const heights = heightsOf(side);
  const visibleIndex = indexAtOffset(offsetsOf(side), scrollOf(side));
  let changed = false;
  let scrollDelta = 0;
  viewport.querySelectorAll<HTMLElement>(".doc-sync-block[data-index]").forEach((element) => {
    const index = Number(element.dataset.index);
    if (!Number.isFinite(index)) return;
    const height = element.offsetHeight;
    if (height <= 0) return;
    const previous = heights[index];
    if (previous === height) return;
    if (previous !== undefined && index < visibleIndex) scrollDelta += height - previous;
    heights[index] = height;
    changed = true;
  });
  if (!changed) return;
  if (scrollDelta !== 0) {
    viewport.scrollTop += scrollDelta;
    if (side === "left") leftScroll.set(viewport.scrollTop);
    else rightScroll.set(viewport.scrollTop);
  }
  measurementVersion.set(measurementVersion.value + 1);
};

useEffect(() => {
  measureBlocks("left");
  measureBlocks("right");
  updateProgress();
});

useEffect(() => {
  if (!focusEditor.value) return;
  focusEditor.set(false);
  if (!editingId.value || !editingSide.value) return;
  const viewport = viewportOf(editingSide.value);
  const editor = viewport?.querySelector<HTMLTextAreaElement>(".doc-sync-editor");
  editor?.focus();
  editor?.select();
});

onMounted(() => {
  const left = leftViewport.value;
  const right = rightViewport.value;
  if (typeof ResizeObserver === "undefined") {
    leftSize.set(left?.clientHeight || 320);
    rightSize.set(right?.clientHeight || 320);
    updateProgress();
    return;
  }
  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const height = Math.max(80, entry.contentRect.height);
      if (entry.target === left) leftSize.set(height);
      else if (entry.target === right) rightSize.set(height);
      updateProgress();
    }
  });
  if (left) resizeObserver.observe(left);
  if (right) resizeObserver.observe(right);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  if (programmaticTimer.value) window.clearTimeout(programmaticTimer.value);
});

const onSplitChange = (event: CustomEvent<number>): void => {
  const next = Number(event.detail);
  splitRatio.set(next);
  host.style.setProperty("--_doc-sync-split", `${next}%`);
};

useHostAttr("active-id", () => activeId.value);
useHostCssVar("--_doc-sync-height", () => cssSize(props.height));

defineStyle(styles);

defineExpose<DocSyncExpose>(
  { activate: (id) => activate(id, null), clearActive, scrollTo },
  { overrideNative: ["scrollTo"] },
);

const DocSync = defineHtml<DocSyncProps, DocSyncEmits>(`
  <div class="doc-sync" :aria-label=${props.ariaLabel}>
    <elf-splitter class="doc-sync-splitter" :modelValue.prop=${splitRatio} :min=${30} :max=${70} @update:modelValue=${onSplitChange}>
      <section slot="first" class="doc-sync-pane" part="pane" :class=${paneClass("left")}>
        <header class="doc-sync-pane-head" part="pane-head">${roleLabel("left")}<span class="doc-sync-top-progress is-left" aria-hidden="true"></span></header>
        <div v-if="props.ruler && modeOf(roleOf('left')) === 'source'" class="doc-sync-ruler" aria-hidden="true">
          <span v-for="(mark, index) in rulerMarks()" :key="index" class="doc-sync-ruler-mark" :class="{ 'has-label': mark.label != null, 'is-major': mark.major }"><b v-if="mark.label != null">{{ mark.label }}</b></span>
        </div>
        <div ref="leftViewport" class="doc-sync-viewport" @scroll=${(event: Event) => onPaneScroll(event, "left")}>
          <div class="doc-sync-spacer" :style=${spacerBeforeStyle("left")}></div>
          <div
            v-for="entry in windowItems('left')"
            :key="entry.item.id"
            class="doc-sync-block"
            :class="blockClass(entry.item)"
            :data-index="entry.index"
            :data-sync-id="entry.item.id"
            :data-sync-type="entry.item.type"
            :tabindex="0"
            :aria-label="entry.item.text || entry.item.type"
            @click="onBlockClick('left', entry.item)"
            @dblclick="onBlockDblClick('left', entry.item)"
            @keydown="onBlockKeydown('left', entry.item, $event)"
          >
            <span v-if="props.lineNumbers && modeOf(roleOf('left')) === 'source'" class="doc-sync-line" aria-hidden="true">{{ lineLabel(entry.item, entry.index) }}</span>
            <textarea v-if="isEditing(entry.item)" class="doc-sync-editor" :value.prop=${editingText} @input=${onEditorInput} @keydown=${onEditorKeydown} @blur=${commitEdit} aria-label="Edit block"></textarea>
            <span v-else v-doc-sync-content="renderBlock(roleOf('left'), entry.item, entry.index)"></span>
          </div>
          <div class="doc-sync-spacer" :style=${spacerAfterStyle("left")}></div>
          <span :class=${markerClass("left")} :style=${markerStyle("left")} aria-hidden="true"></span>
        </div>
      </section>
      <section slot="second" class="doc-sync-pane" part="pane" :class=${paneClass("right")}>
        <header class="doc-sync-pane-head" part="pane-head">${roleLabel("right")}<span class="doc-sync-top-progress is-right" aria-hidden="true"></span></header>
        <div v-if="props.ruler && modeOf(roleOf('right')) === 'source'" class="doc-sync-ruler" aria-hidden="true">
          <span v-for="(mark, index) in rulerMarks()" :key="index" class="doc-sync-ruler-mark" :class="{ 'has-label': mark.label != null, 'is-major': mark.major }"><b v-if="mark.label != null">{{ mark.label }}</b></span>
        </div>
        <div ref="rightViewport" class="doc-sync-viewport" @scroll=${(event: Event) => onPaneScroll(event, "right")}>
          <div class="doc-sync-spacer" :style=${spacerBeforeStyle("right")}></div>
          <div
            v-for="entry in windowItems('right')"
            :key="entry.item.id"
            class="doc-sync-block"
            :class="blockClass(entry.item)"
            :data-index="entry.index"
            :data-sync-id="entry.item.id"
            :data-sync-type="entry.item.type"
            :tabindex="0"
            :aria-label="entry.item.text || entry.item.type"
            @click="onBlockClick('right', entry.item)"
            @dblclick="onBlockDblClick('right', entry.item)"
            @keydown="onBlockKeydown('right', entry.item, $event)"
          >
            <span v-if="props.lineNumbers && modeOf(roleOf('right')) === 'source'" class="doc-sync-line" aria-hidden="true">{{ lineLabel(entry.item, entry.index) }}</span>
            <textarea v-if="isEditing(entry.item)" class="doc-sync-editor" :value.prop=${editingText} @input=${onEditorInput} @keydown=${onEditorKeydown} @blur=${commitEdit} aria-label="Edit block"></textarea>
            <span v-else v-doc-sync-content="renderBlock(roleOf('right'), entry.item, entry.index)"></span>
          </div>
          <div class="doc-sync-spacer" :style=${spacerAfterStyle("right")}></div>
          <span :class=${markerClass("right")} :style=${markerStyle("right")} aria-hidden="true"></span>
        </div>
      </section>
    </elf-splitter>
    <button
      type="button"
      :class=${["doc-sync-swap", { "is-dragging": draggingSplit }]}
      aria-label="Swap panes"
      @pointerdown=${onSwapPointerDown}
      @pointermove=${onSwapPointerMove}
      @pointerup=${onSwapPointerUp}
      @click=${onSwapClick}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M21 9L17 5V8H10V10H17V13M7 11L3 15L7 19V16H14V14H7V11Z"></path></svg>
    </button>
  </div>
`);

export { DocSync };
