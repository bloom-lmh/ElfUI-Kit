import {
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
  useHostFlag,
  useRef,
  useTemplateRef,
} from "@elfui/core";

import {
  computeAnchoredPosition,
  connectAnchoredOverlayLifecycle,
  readOverlayViewport,
} from "../../Common/overlay/anchored-overlay";
import {
  buildTreeCollection,
  resolveTreeFields,
  type TreeCollection,
  type TreeFieldConfig,
} from "../../Data/Tree/tree-collection";
import type { TreeNode } from "../../Data/Tree/types";
import { useLocaleProvider } from "../../Providers/context";
import { useDismissibleOverlay } from "../../../composables/useDismissibleOverlay";
import { useFieldValueDefaults } from "../../../composables/field-values";
import {
  useDisabled,
  useFormControl,
  useFormItem,
} from "../../../composables/form";
import { normalizeFieldVariant } from "../../../types/field";
import {
  normalizeTreeSelectKeys,
  treeSelectEntries,
  treeSelectModelValue,
  type TreeSelectEntry,
} from "./model";
import styles from "./style.scss?inline";
import type {
  TreeSelectElement,
  TreeSelectEmits,
  TreeSelectExpose,
  TreeSelectModelValue,
  TreeSelectPlacement,
  TreeSelectProps,
  TreeSelectTreeElement,
  TreeSelectValue,
} from "./types";

export type {
  TreeSelectElement,
  TreeSelectEmits,
  TreeSelectExpose,
  TreeSelectModelValue,
  TreeSelectPlacement,
  TreeSelectProps,
  TreeSelectSize,
  TreeSelectValue,
  TreeSelectVariant,
} from "./types";

const props = defineProps<TreeSelectProps>({
  modelValue: { type: null, default: "" },
  data: { type: Array, default: () => [] },
  props: { type: Object, default: () => ({}) },
  nodeKey: { type: String, default: "" },
  valueKey: { type: String, default: "" },
  multiple: { type: Boolean, default: false },
  showCheckbox: { type: Boolean, default: false },
  checkStrictly: { type: Boolean, default: false },
  defaultExpandAll: { type: Boolean, default: false },
  defaultExpandedKeys: { type: Array, default: () => [] },
  autoExpandParent: { type: Boolean, default: true },
  expandOnClickNode: { type: Boolean, default: true },
  checkOnClickNode: { type: Boolean, default: false },
  checkOnClickLeaf: { type: Boolean, default: true },
  accordion: { type: Boolean, default: false },
  filterable: { type: Boolean, default: false },
  filterNodeMethod: { type: Function, default: undefined },
  lazy: { type: Boolean, default: false },
  load: { type: Function, default: undefined },
  renderContent: { type: Function, default: undefined },
  virtual: { type: Boolean, default: false },
  height: { type: [String, Number], default: 280 },
  itemSize: { type: Number, default: 40 },
  overscan: { type: Number, default: 6 },
  clearable: { type: Boolean, default: false },
  collapseTags: { type: Boolean, default: true },
  maxCollapseTags: { type: Number, default: 1 },
  multipleLimit: { type: Number, default: 0 },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: "" },
  variant: { type: String, default: "filled" },
  backgroundColor: { type: String, default: "" },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  filterPlaceholder: { type: String, default: "" },
  emptyText: { type: String, default: "" },
  ariaLabel: { type: String, default: "" },
  clearIcon: { type: String, default: "×" },
  suffixIcon: { type: String, default: "▾" },
  valueOnClear: { type: null, default: undefined },
  emptyValues: { type: Array, default: undefined },
  validateEvent: { type: Boolean, default: true },
  teleported: { type: Boolean, default: true },
  placement: { type: String, default: "bottom-start" },
  fallbackPlacements: { type: Array, default: () => ["top-start"] },
  fitInputWidth: { type: Boolean, default: true },
  offset: { type: Number, default: 0 },
  popperClass: { type: String, default: "" },
  popperStyle: { type: Object, default: () => ({}) },
  tabindex: { type: null, default: 0 },
  id: { type: String, default: "" },
  name: { type: String, default: "" },
});

const emit = defineEmits<TreeSelectEmits>();
const locale = useLocaleProvider();
const fieldValues = useFieldValueDefaults();
const host = useHost();
const ctl = useFormControl<TreeSelectModelValue>(props, emit, {
  ...(props.validateEvent === false
    ? { triggers: { change: false, blur: false } }
    : {}),
});
const isDisabled = useDisabled(() => Boolean(props.disabled));
const normalizedOwnSize = (): "sm" | "md" | "lg" | "" =>
  props.size === "small" || props.size === "sm"
    ? "sm"
    : props.size === "large" || props.size === "lg"
      ? "lg"
      : props.size === "default" || props.size === "md"
        ? "md"
        : "";
const formItem = useFormItem(normalizedOwnSize);
const resolvedSize = (): "sm" | "md" | "lg" => formItem.formSize;

interface TemplateElementRef<T extends Element> {
  readonly value: T | null;
}

// ── State ─────────────────────────────────────────────────

const openState = useRef(false);
const query = useRef("");
const overlayStyle = useRef<Record<string, string>>({});
const resolvedPlacement = useRef<TreeSelectPlacement>("bottom-start");
const collection = useRef<TreeCollection>(
  buildTreeCollection([], resolveTreeFields("", {}), false),
);
const triggerRef = useTemplateRef(
  "triggerEl",
) as TemplateElementRef<HTMLElement>;
const filterRef = useTemplateRef(
  "filterEl",
) as TemplateElementRef<HTMLInputElement>;
const panelRef = useTemplateRef("panelEl") as TemplateElementRef<HTMLElement>;
let mounted = false;
let overlayFrame = 0;
let blurTimer = 0;
let cleanupAnchoredOverlay = (): void => {};

// ── Derived model ─────────────────────────────────────────

const isMultiple = (): boolean => Boolean(props.multiple || props.showCheckbox);
const keyField = (): string =>
  props.valueKey || props.nodeKey || props.props?.key || "key";
const fields = (): TreeFieldConfig =>
  resolveTreeFields(keyField(), props.props || {});
const selectedKeys = (): string[] =>
  normalizeTreeSelectKeys(ctl.model.value, isMultiple());
const selectedEntries = (): TreeSelectEntry[] =>
  treeSelectEntries(collection.value, fields(), selectedKeys());
const selectedLabel = (): string | string[] =>
  isMultiple()
    ? selectedEntries().map((entry) => entry.label)
    : selectedEntries()[0]?.label || "";
const visibleEntries = (): TreeSelectEntry[] => {
  const entries = selectedEntries();
  if (!isMultiple() || !props.collapseTags) return entries;
  return entries.slice(0, Math.max(1, Number(props.maxCollapseTags) || 1));
};
const collapsedCount = (): number =>
  Math.max(0, selectedEntries().length - visibleEntries().length);
const hasValue = (): boolean => selectedKeys().length > 0;
const placeholderText = (): string =>
  props.placeholder || locale.t("common.select");
const filterPlaceholderText = (): string =>
  props.filterPlaceholder || locale.t("tree.search");
const panelId = (): string => `${props.id || "elf-tree-select"}-panel`;
const treeFields = () => props.props || {};
const treeDefaultExpandedKeys = (): string[] =>
  (props.defaultExpandedKeys || []).map(String);
const treeModelValue = (): string =>
  isMultiple() ? "" : selectedKeys()[0] || "";
const treeElement = (): TreeSelectTreeElement | null =>
  (host.shadowRoot?.querySelector(
    "elf-tree",
  ) as TreeSelectTreeElement | null) ?? null;
const panelStyle = (): Record<string, string> => ({
  ...(props.popperStyle || {}),
  ...overlayStyle.value,
});
const panelClass = () => [
  "panel",
  props.popperClass,
  `placement-${resolvedPlacement.value}`,
  { "is-teleported": props.teleported },
];

const rebuildCollection = (): void => {
  collection.set(
    buildTreeCollection(props.data || [], fields(), Boolean(props.lazy)),
  );
};

// ── Value transactions ───────────────────────────────────

const commitEntries = (entries: TreeSelectEntry[]): void => {
  const next = treeSelectModelValue(entries, isMultiple());
  ctl.setValue(next);
  ctl.dispatchChange(next);
};

const commitKeys = (keys: readonly string[]): void => {
  commitEntries(treeSelectEntries(collection.peek(), fields(), keys));
};

const removeValue = (value: TreeSelectValue): void => {
  if (!isMultiple() || isDisabled()) return;
  const removed = selectedEntries().find((entry) =>
    Object.is(entry.value, value),
  );
  if (!removed) return;
  const next = selectedEntries().filter((entry) => entry.key !== removed.key);
  treeElement()?.setCheckedKeys(next.map((entry) => entry.key));
  commitEntries(next);
  emit("remove-tag", removed.value);
};

const clear = (event?: Event): void => {
  event?.stopPropagation();
  if (isDisabled() || !hasValue()) return;
  const next = fieldValues.valueOnClear<TreeSelectModelValue>(
    props.valueOnClear,
    () => (isMultiple() ? [] : ""),
  );
  treeElement()?.setCheckedKeys([]);
  ctl.setValue(next);
  ctl.dispatchChange(next);
  emit("clear");
};

// ── Overlay ──────────────────────────────────────────────

const updateOverlayPosition = (): void => {
  if (!props.teleported || typeof window === "undefined") {
    overlayStyle.set({});
    resolvedPlacement.set(props.placement);
    return;
  }
  const trigger = triggerRef.value;
  const panel = panelRef.value;
  if (!trigger || !panel) return;
  const anchorRect = trigger.getBoundingClientRect();
  if (anchorRect.width === 0 && anchorRect.height === 0) return;
  const panelRect = panel.getBoundingClientRect();
  const width = props.fitInputWidth
    ? anchorRect.width
    : Math.max(anchorRect.width, panelRect.width || panel.offsetWidth || 280);
  const next = computeAnchoredPosition(
    anchorRect,
    {
      width,
      height:
        panelRect.height || panel.offsetHeight || Number(props.height) || 280,
    },
    readOverlayViewport(),
    {
      placement: props.placement,
      fallbackPlacements: props.fallbackPlacements,
      offset: [0, Math.max(0, Number(props.offset) || 0)],
      padding: 8,
    },
  );
  resolvedPlacement.set(next.placement);
  overlayStyle.set({
    position: "fixed",
    left: `${Math.round(next.left * 100) / 100}px`,
    top: `${Math.round(next.top * 100) / 100}px`,
    right: "auto",
    bottom: "auto",
    margin: "0",
    width: props.fitInputWidth ? `${Math.round(width * 100) / 100}px` : "auto",
    minWidth: `${Math.round(anchorRect.width * 100) / 100}px`,
  });
};

const requestOverlayUpdate = (): void => {
  if (typeof window === "undefined") return;
  if (overlayFrame) cancelAnimationFrame(overlayFrame);
  overlayFrame = requestAnimationFrame(() => {
    overlayFrame = 0;
    updateOverlayPosition();
  });
};

const hideTopLayer = (): void => {
  try {
    panelRef.value?.hidePopover?.();
  } catch {
    // A conditional popover may already have left the top layer.
  }
};

const close = (restoreFocus = false): void => {
  if (!openState.peek()) return;
  if (restoreFocus) triggerRef.value?.focus({ preventScroll: true });
  hideTopLayer();
  cleanupAnchoredOverlay();
  cleanupAnchoredOverlay = (): void => {};
  dismissibleOverlay.deactivate();
  openState.set(false);
  query.set("");
  treeElement()?.filter("");
  emit("visible-change", false);
};

const connectOverlay = (): void => {
  cleanupAnchoredOverlay();
  cleanupAnchoredOverlay = (): void => {};
  if (!openState.peek() || !props.teleported || typeof window === "undefined")
    return;
  const trigger = triggerRef.value;
  const panel = panelRef.value;
  if (!trigger || !panel) return;
  try {
    panel.showPopover?.();
  } catch {
    // Reconnecting a conditional popover can race with its previous teardown.
  }
  cleanupAnchoredOverlay = connectAnchoredOverlayLifecycle({
    resizeTargets: [trigger, panel],
    motionContainers: () => [panel],
    onResize: requestOverlayUpdate,
    onExternalMotion: () => close(true),
  });
  requestOverlayUpdate();
};

const open = (): void => {
  if (isDisabled() || openState.peek()) return;
  dismissibleOverlay.activate();
  openState.set(true);
  emit("visible-change", true);
  queueMicrotask(() => {
    connectOverlay();
    if (props.filterable) filterRef.value?.focus({ preventScroll: true });
  });
};

const toggle = (visible?: boolean): void => {
  if (visible === true) return open();
  if (visible === false) return close();
  if (openState.peek()) close();
  else open();
};

const dismissibleOverlay = useDismissibleOverlay({
  kind: "tree-select",
  containers: () => [host, panelRef.value],
  closeOnEscape: () => true,
  closeOnOutside: () => true,
  outsideEvent: "pointerdown",
  outsideCapture: true,
  onRequestClose: (reason) => close(reason === "escape"),
});

// ── Interaction ──────────────────────────────────────────

const focusTree = (last = false): void => {
  queueMicrotask(() => {
    const buttons = Array.from(
      treeElement()?.shadowRoot?.querySelectorAll<HTMLElement>(
        ".tree-content:not([aria-disabled='true'])",
      ) || [],
    );
    (last ? buttons.at(-1) : buttons[0])?.focus({ preventScroll: true });
  });
};

const onTriggerClick = (event: Event): void => {
  if ((event.target as HTMLElement | null)?.closest?.("button, input")) return;
  toggle();
};

const onTriggerKeydown = (event: KeyboardEvent): void => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    if (!openState.peek()) open();
    focusTree(event.key === "ArrowUp");
    return;
  }
  if (
    (event.key === "Enter" || event.key === " ") &&
    event.target === triggerRef.value
  ) {
    event.preventDefault();
    toggle();
  }
};

const onFilterInput = (event: Event): void => {
  const next = (event.target as HTMLInputElement).value;
  query.set(next);
  treeElement()?.filter(next);
};

const onFilterKeydown = (event: KeyboardEvent): void => {
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
  event.preventDefault();
  focusTree(event.key === "ArrowUp");
};

const onTreeNodeClick = (event: CustomEvent<unknown[]>): void => {
  const detail = Array.isArray(event.detail) ? event.detail : [];
  const node = detail[0] as TreeNode | undefined;
  const key = String(detail[1] ?? "");
  const entry = treeSelectEntries(collection.peek(), fields(), [key])[0];
  if (!node || !entry) return;
  emit("node-click", node, entry.value);
  if (isMultiple()) return;
  commitEntries([entry]);
  close(true);
};

const onCheckedKeysUpdate = (event: CustomEvent<unknown[]>): void => {
  const keys = Array.isArray(event.detail) ? event.detail.map(String) : [];
  const limit = Math.max(0, Number(props.multipleLimit) || 0);
  if (limit > 0 && keys.length > limit) {
    treeElement()?.setCheckedKeys(selectedKeys());
    return;
  }
  commitKeys(keys);
};

const onTreeCheck = (event: CustomEvent<unknown[]>): void => {
  const detail = Array.isArray(event.detail) ? event.detail : [];
  const node = detail[0] as TreeNode | undefined;
  if (node)
    emit(
      "check",
      node,
      selectedEntries().map((entry) => entry.value),
    );
};

const onTreeLoad = (event: CustomEvent<unknown[]>): void => {
  const detail = Array.isArray(event.detail) ? event.detail : [];
  const node = detail[0] as TreeNode | undefined;
  const children = Array.isArray(detail[1]) ? (detail[1] as TreeNode[]) : [];
  rebuildCollection();
  if (node) emit("node-load", node, children);
};

const onRemoveClick = (event: Event): void => {
  event.stopPropagation();
  const key = (event.currentTarget as HTMLElement).dataset.key || "";
  const entry = selectedEntries().find((item) => item.key === key);
  if (entry) removeValue(entry.value);
};

const onFocus = (event: FocusEvent): void => ctl.dispatchFocus(event);
const onFocusOut = (event: FocusEvent): void => {
  if (blurTimer) window.clearTimeout(blurTimer);
  // A pointer transition into the nested Tree fires `focusout` before its
  // `click`. Wait one task so selection is not cancelled before Tree emits.
  blurTimer = window.setTimeout(() => {
    blurTimer = 0;
    // `document.activeElement` is the TreeSelect host while any nested
    // shadow descendant owns focus. The shadow-root check also supports
    // test environments that expose the inner active element directly.
    if (document.activeElement === host || host.shadowRoot?.activeElement)
      return;
    ctl.dispatchBlur(event);
    if (openState.peek()) close(false);
  }, 0);
};
const focus = (): void => triggerRef.value?.focus();
const blur = (): void => triggerRef.value?.blur();
const filter = (keyword: string): void => {
  query.set(String(keyword || ""));
  treeElement()?.filter(query.peek());
};
const getCheckedKeys = (leafOnly = false): string[] =>
  treeElement()?.getCheckedKeys(leafOnly) || [];
const setCheckedKeys = (keys: TreeSelectValue[], leafOnly = false): void =>
  treeElement()?.setCheckedKeys(keys, leafOnly);
const getCurrentNode = (): TreeNode | undefined =>
  treeElement()?.getCurrentNode();
const scrollToNode = (key: TreeSelectValue): void =>
  treeElement()?.scrollToNode(key);

// ── Host, lifecycle, and public contract ─────────────────

useHostAttr("size", resolvedSize);
useHostAttr("variant", () => normalizeFieldVariant(props.variant));
useHostAttr("data-state", () => formItem.state);
useHostFlag("disabled", isDisabled);
useHostFlag("data-open", () => openState.value);
useHostFlag("data-dirty", hasValue);
useHostFlag("data-has-label", () => Boolean(props.label));
useHostCssVar("--elf-field-custom-bg", () => props.backgroundColor || "");

useEffect(() => {
  void props.data;
  void props.props;
  void props.nodeKey;
  void props.valueKey;
  void props.lazy;
  rebuildCollection();
});

useEffect(() => {
  void openState.value;
  void props.teleported;
  void props.placement;
  void props.fallbackPlacements;
  void props.fitInputWidth;
  void props.offset;
  if (mounted && openState.peek()) queueMicrotask(connectOverlay);
});

onMounted(() => {
  mounted = true;
  if (openState.peek()) connectOverlay();
});

onUnmounted(() => {
  mounted = false;
  cleanupAnchoredOverlay();
  dismissibleOverlay.deactivate();
  if (overlayFrame) cancelAnimationFrame(overlayFrame);
  if (blurTimer) window.clearTimeout(blurTimer);
});

const publicApi: TreeSelectExpose = {
  open,
  close,
  toggle,
  focus,
  blur,
  filter,
  selectedLabel,
  getCheckedKeys,
  setCheckedKeys,
  getCurrentNode,
  scrollToNode,
};

defineExpose(publicApi, { overrideNative: ["focus", "blur"] });

defineStyle(styles);

const TreeSelect = defineHtml<TreeSelectProps>(`
  <div class="tree-select" @focusout=${onFocusOut}>
    <div ref="triggerEl" class="trigger" part="trigger" :id=${props.id || null}
      :tabindex=${isDisabled() ? -1 : props.tabindex} role="combobox" aria-haspopup="tree"
      :aria-label=${props.ariaLabel || props.label || placeholderText()} :aria-expanded=${openState ? "true" : "false"}
      :aria-controls=${openState ? panelId() : null} :aria-disabled=${isDisabled() ? "true" : "false"}
      @click=${onTriggerClick} @focus=${onFocus} @keydown=${onTriggerKeydown}>
      <fieldset v-if=${props.label} class="field-outline" aria-hidden="true">
        <legend><span>${props.label}</span></legend>
      </fieldset>
      <span v-if=${props.label} class="field-label">${props.label}</span>
      <slot name="prefix"></slot>
      <span v-if=${!hasValue() && !(props.filterable && openState)} class="placeholder">
        ${placeholderText()}
      </span>
      <template v-if=${isMultiple()}>
        <span v-for="entry in visibleEntries()" :key="entry.key" class="tag" part="tag">
          {{ entry.label }}
          <button type="button" class="tag-remove" :data-key="entry.key" :aria-label="\`Remove \${entry.label}\`"
            @click=${onRemoveClick}>×</button>
        </span>
        <span v-if=${collapsedCount() > 0} class="collapse-tag">+${collapsedCount()}</span>
      </template>
      <span v-else-if=${hasValue() && !(props.filterable && openState)} class="value">
        ${selectedLabel()}
      </span>
      <input v-if=${props.filterable && openState} ref="filterEl" class="filter-input" type="search"
        :name=${props.name || null} :value=${query} :placeholder=${filterPlaceholderText()}
        :aria-label=${filterPlaceholderText()} @click.stop @input=${onFilterInput} @keydown=${onFilterKeydown} />
      <span class="suffix" part="suffix">
        <button v-if=${props.clearable && hasValue() && !isDisabled()} class="clear" type="button"
          :aria-label='locale.t("common.clear")' @click=${clear}>${props.clearIcon}</button>
        <span v-else class="arrow" :data-icon=${props.suffixIcon} aria-hidden="true"></span>
      </span>
    </div>

    <div v-if=${openState && !isDisabled()} ref="panelEl" :id=${panelId()} :class=${panelClass()} :style=${panelStyle()}
      part="panel" :popover=${props.teleported ? "manual" : undefined}>
      <elf-tree :data.prop=${props.data} :props.prop=${treeFields()}
        :nodeKey.prop=${props.valueKey || props.nodeKey || "key"} :modelValue.prop=${treeModelValue()}
        :checkedKeys.prop=${isMultiple() ? selectedKeys() : []} :showCheckbox.prop=${isMultiple()}
        :checkStrictly.prop=${props.checkStrictly} :defaultExpandAll.prop=${props.defaultExpandAll}
        :defaultExpandedKeys.prop=${treeDefaultExpandedKeys()} :autoExpandParent.prop=${props.autoExpandParent}
        :expandOnClickNode.prop=${props.expandOnClickNode} :checkOnClickNode.prop=${props.checkOnClickNode}
        :checkOnClickLeaf.prop=${props.checkOnClickLeaf} :accordion.prop=${props.accordion} :lazy.prop=${props.lazy}
        :load.prop=${props.load} :filterNodeMethod.prop=${props.filterNodeMethod} :renderContent.prop=${props.renderContent}
        :virtual.prop=${props.virtual} :height.prop=${props.height} :itemSize.prop=${props.itemSize}
        :overscan.prop=${props.overscan} :emptyText.prop=${props.emptyText}
        :ariaLabel.prop=${props.ariaLabel || props.label || placeholderText()} @node-click=${onTreeNodeClick}
        @update:checkedKeys=${onCheckedKeysUpdate} @check=${onTreeCheck} @node-load=${onTreeLoad}></elf-tree>
      <slot name="footer"></slot>
    </div>
  </div>
`);

export { TreeSelect };
