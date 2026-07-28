// elf-dropdown — 下拉菜单
//
// 支持 click / hover / contextmenu、分裂按钮、嵌套子菜单、键盘触发与基础无障碍。

import {
  defineFragment,
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  useClickOutside,
  useComputed,
  useEffect,
  useEscapeKey,
  useEventListener,
  useHost,
  useHostAttr,
  useHostFlag,
  useRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import { computeAnchoredPosition, listenForExternalOverlayMotion } from "../../Common/anchored-overlay";
import { useLocaleProvider } from "../../Providers/context";
import {
  asStringList,
  cssSize,
  DEFAULT_TRIGGER_KEYS,
  normalizeItems,
  positiveDelay,
  resolveButtonType,
  resolveFieldNames,
  resolvePopperConfig,
  resolveSize,
  resolveTriggers,
  toStyleObject,
} from "./model";
import type { DropdownViewItem } from "./model";
import type {
  DropdownCommand,
  DropdownCommandDetail,
  DropdownEmits,
  DropdownFieldNames,
  DropdownItem,
  DropdownPlacement,
  DropdownProps,
  DropdownSlots,
  DropdownTriggerMode,
  DropdownVirtualRef,
} from "./types";

export type {
  DropdownButtonProps,
  DropdownButtonType,
  DropdownCommand,
  DropdownCommandDetail,
  DropdownEffect,
  DropdownElement,
  DropdownEmits,
  DropdownExpose,
  DropdownFieldNames,
  DropdownItem,
  DropdownItemProps,
  DropdownItemSlots,
  DropdownMenuProps,
  DropdownMenuSlots,
  DropdownPlacement,
  DropdownPopperModifier,
  DropdownPopperOptions,
  DropdownProps,
  DropdownSize,
  DropdownSlots,
  DropdownTrigger,
  DropdownTriggerMode,
  DropdownVirtualRef,
} from "./types";

const DROPDOWN_OPEN_EVENT = "elf-dropdown-open";

// ─── component setup ────────────────────────────────────────

const props = defineProps<DropdownProps>({
  items: { type: Array, default: () => [] },
  label: { type: String, default: "" },
  trigger: { type: [String, Array], default: "click" },
  placement: { type: String, default: "bottom-start" },
  size: { type: String, default: "md" },
  type: { type: String, default: "default" },
  buttonProps: { type: Object, default: () => ({}) },
  effect: { type: String, default: "light" },
  // default factory 会被编译器提升，只能写字面量，不能闭包模块常量
  triggerKeys: { type: Array, default: () => ["Enter", " ", "Space", "ArrowDown", "NumpadEnter"] },
  virtualTriggering: { type: Boolean, default: false },
  virtualRef: { type: Object, default: null },
  showArrow: { type: Boolean, default: true },
  showTimeout: { type: Number, default: 120 },
  hideTimeout: { type: Number, default: 180 },
  role: { type: String, default: "menu" },
  tabindex: { type: Number, default: 0 },
  popperClass: { type: String, default: "" },
  popperStyle: { type: Object, default: () => ({}) },
  popperOptions: { type: Object, default: () => ({}) },
  teleported: { type: Boolean, default: true },
  appendTo: { type: [String, Object], default: "body" },
  persistent: { type: Boolean, default: true },
  closeOnClickOutside: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  hideOnClick: { type: Boolean, default: true },
  splitButton: { type: Boolean, default: false },
  maxHeight: { type: [String, Number], default: "280px" },
  props: {
    type: Object,
    default: () => ({
      label: "label",
      command: "command",
      icon: "icon",
      disabled: "disabled",
      divided: "divided",
      shortcut: "shortcut",
      children: "children",
    }),
  },
});

const locale = useLocaleProvider();

const emit = defineEmits<DropdownEmits>();

const host = useHost();

const open = useRef(false);
const selectedCommand = useRef<DropdownCommand | null>(null);
const selectedLabel = useRef("");
const overlayStyle = useRef<Record<string, string>>({});
const resolvedPlacement = useRef<DropdownPlacement>("bottom-start");

let hoverCloseTimer: ReturnType<typeof setTimeout> | null = null;
let hoverOpenTimer: ReturnType<typeof setTimeout> | null = null;
let cleanupVirtualTrigger = (): void => {};
let cleanupAnchoredOverlay = (): void => {};
let overlayFrame = 0;
let mounted = false;

// ─── derived ────────────────────────────────────────────────

const isDisabled = (): boolean => Boolean(props.disabled);

const triggerModes = useComputed(() => resolveTriggers(props.trigger));

const hasTrigger = (mode: DropdownTriggerMode): boolean => triggerModes.value.includes(mode);

const popperConfig = useComputed(() => resolvePopperConfig(props.popperOptions, props.placement));

const placement = (): DropdownPlacement => popperConfig.value.placement;

const size = useComputed(() => resolveSize(props.size));

const buttonType = useComputed(() => resolveButtonType(props.type));

const fieldNames = useComputed(() => resolveFieldNames(props.props as DropdownFieldNames | undefined));

const viewItems = useComputed(() => normalizeItems(Array.isArray(props.items) ? props.items : [], fieldNames.value));

const triggerKeys = useComputed(() => asStringList(props.triggerKeys, DEFAULT_TRIGGER_KEYS));

const buttonPropsMap = useComputed<Record<string, unknown>>(() =>
  props.buttonProps && typeof props.buttonProps === "object" ? (props.buttonProps as Record<string, unknown>) : {},
);

const buttonDisabled = useComputed(() => isDisabled() || Boolean(buttonPropsMap.value.disabled));

const buttonClass = (base: string): unknown[] => [
  base,
  `is-${buttonType.value}`,
  String(buttonPropsMap.value.class || ""),
];

const buttonStyle = useComputed(() => toStyleObject(buttonPropsMap.value.style));

const menuStyle = useComputed<Record<string, string>>(() => ({
  "--dropdown-max-height": cssSize(props.maxHeight, "280px"),
  ...toStyleObject(props.popperStyle),
  ...(props.virtualTriggering || props.teleported ? overlayStyle.value : {}),
}));

const menuClass = useComputed<unknown[]>(() => [
  "menu",
  {
    "is-open": open.value,
    [`is-${resolvedPlacement.value || placement()}`]: true,
    [`is-${String(props.effect || "light")}`]: true,
    "is-virtual": Boolean(props.virtualTriggering),
    "is-teleported": Boolean(props.teleported),
  },
  String(props.popperClass || ""),
]);

const shouldRenderMenu = useComputed(() => Boolean(props.persistent) || open.value);

const shouldRenderTrigger = useComputed(() => !props.virtualTriggering);

const isSplitButton = useComputed(() => Boolean(props.splitButton));

const triggerTabindex = useComputed(() => Number(props.tabindex) || 0);

const showsArrow = useComputed(() => Boolean(props.showArrow));

const popoverMode = useComputed(() => (props.teleported ? "manual" : undefined));

const appendTargetLabel = useComputed(() => (typeof props.appendTo === "string" ? props.appendTo : "element"));

const hasCompositionalMenu = (): boolean => Boolean(host.querySelector("elf-dropdown-menu"));

const menuRole = (): string => (hasCompositionalMenu() ? "presentation" : String(props.role || "menu"));

const triggerLabel = useComputed(() => selectedLabel.value || String(props.label || locale.t("menu.label")));

const isSelected = (item: DropdownViewItem): boolean =>
  selectedCommand.value !== null && item.command === selectedCommand.value;

const virtualRef = (): DropdownVirtualRef | null => {
  const candidate = props.virtualRef as DropdownVirtualRef | null | undefined;
  return candidate && typeof candidate.getBoundingClientRect === "function" ? candidate : null;
};

const triggerElement = (): HTMLElement | null =>
  host.shadowRoot?.querySelector<HTMLElement>(".trigger, .split-toggle") ?? null;

const anchorReference = (): DropdownVirtualRef | HTMLElement | null =>
  props.virtualTriggering ? virtualRef() : triggerElement();

// ─── open / close ───────────────────────────────────────────

const getMenuEl = (): HTMLElement | null => host.shadowRoot?.querySelector(".menu") ?? null;

const getFocusableItems = (): HTMLElement[] => {
  const menu = getMenuEl();
  if (!menu) return [];
  const dataItems = Array.from(menu.querySelectorAll<HTMLElement>(".item:not(:disabled), .sub-trigger:not(:disabled)"));
  const composedItems = Array.from(host.querySelectorAll<HTMLElement>("elf-dropdown-item:not([disabled])"))
    .map((item) => item.shadowRoot?.querySelector<HTMLElement>(".dropdown-item") ?? null)
    .filter((item): item is HTMLElement => Boolean(item));
  return [...dataItems, ...composedItems];
};

const clearHoverCloseTimer = (): void => {
  if (!hoverCloseTimer) return;
  clearTimeout(hoverCloseTimer);
  hoverCloseTimer = null;
};

const clearHoverOpenTimer = (): void => {
  if (!hoverOpenTimer) return;
  clearTimeout(hoverOpenTimer);
  hoverOpenTimer = null;
};

const clearHoverTimers = (): void => {
  clearHoverOpenTimer();
  clearHoverCloseTimer();
};

const updateOverlayPosition = (): void => {
  if ((!props.virtualTriggering && !props.teleported) || typeof window === "undefined") {
    overlayStyle.set({});
    resolvedPlacement.set(placement());
    return;
  }
  const reference = anchorReference();
  const panel = getMenuEl();
  if (!reference || !panel) return;

  const referenceRect = reference.getBoundingClientRect();
  if (!props.virtualTriggering && referenceRect.width === 0 && referenceRect.height === 0) {
    resolvedPlacement.set(placement());
    return;
  }
  const panelRect = panel.getBoundingClientRect();
  const visualViewport = window.visualViewport;
  const viewport = {
    width: visualViewport?.width || window.innerWidth,
    height: visualViewport?.height || window.innerHeight,
    offsetLeft: visualViewport?.offsetLeft || 0,
    offsetTop: visualViewport?.offsetTop || 0,
  };
  const next = computeAnchoredPosition(
    referenceRect,
    {
      width: panelRect.width || panel.offsetWidth || 192,
      height: panelRect.height || panel.offsetHeight || 0,
    },
    viewport,
    {
      placement: placement(),
      offset: popperConfig.value.offset,
      padding: popperConfig.value.overflowPadding,
      flip: popperConfig.value.flip,
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

const syncTopLayer = (): void => {
  const panel = getMenuEl() as
    | (HTMLElement & {
        showPopover?: () => void;
        hidePopover?: () => void;
      })
    | null;
  if (!panel) return;
  try {
    if (props.teleported && open.peek()) panel.showPopover?.();
    else panel.hidePopover?.();
  } catch {
    // Browsers throw when popover state changes during disconnect; the fixed-position fallback remains usable.
  }
  if (open.peek()) requestOverlayUpdate();
};

const focusFirstEnabledItem = (): void => {
  queueMicrotask(() => {
    syncTopLayer();
    updateOverlayPosition();
    getFocusableItems()[0]?.focus();
  });
};

const deepestActiveElement = (): HTMLElement | null => {
  let active = document.activeElement as HTMLElement | null;
  while (active?.shadowRoot?.activeElement instanceof HTMLElement) {
    active = active.shadowRoot.activeElement;
  }
  return active;
};

const restoreFocusBeforeClose = (): void => {
  const activeElement = deepestActiveElement();
  const focusIsInMenu =
    activeElement && getFocusableItems().some((item) => item === activeElement || item.contains(activeElement));
  if (!focusIsInMenu) return;

  const target = anchorReference();
  if (target instanceof HTMLElement) target.focus({ preventScroll: true });
};

const closeDropdown = (): void => {
  clearHoverTimers();
  if (!open.peek()) return;
  restoreFocusBeforeClose();
  open.set(false);
  syncTopLayer();
  emit("visible-change", false);
};

const setOpen = (next: boolean): void => {
  if (isDisabled()) return;
  if (open.peek() === next) return;

  if (next) {
    clearHoverTimers();
    document.dispatchEvent(new CustomEvent(DROPDOWN_OPEN_EVENT, { detail: host }));
  }

  open.set(next);
  syncTopLayer();
  emit("visible-change", next);

  if (next) focusFirstEnabledItem();
};

const show = (): void => setOpen(true);
const hide = (): void => closeDropdown();

const toggle = (): void => {
  if (open.peek()) hide();
  else show();
};

const handleOpen = (): void => show();
const handleClose = (): void => hide();

const scheduleShow = (): void => {
  if (isDisabled()) return;
  clearHoverOpenTimer();
  const delay = positiveDelay(props.showTimeout);
  if (delay === 0) {
    show();
    return;
  }
  hoverOpenTimer = setTimeout(() => {
    hoverOpenTimer = null;
    show();
  }, delay);
};

const scheduleHide = (): void => {
  clearHoverCloseTimer();
  const delay = positiveDelay(props.hideTimeout);
  if (delay === 0) {
    closeDropdown();
    return;
  }
  hoverCloseTimer = setTimeout(() => {
    hoverCloseTimer = null;
    closeDropdown();
  }, delay);
};

// ─── handlers ───────────────────────────────────────────────

const onTriggerClick = (event: Event): void => {
  if (isDisabled()) return;
  if (!hasTrigger("click")) return;
  event.preventDefault();
  toggle();
};

const onTriggerKeydown = (event: KeyboardEvent): void => {
  if (isDisabled()) return;
  if (!triggerKeys.value.includes(event.key)) return;
  event.preventDefault();
  show();
};

const onContextMenu = (event: Event): void => {
  if (isDisabled() || !hasTrigger("contextmenu")) return;
  event.preventDefault();
  show();
};

const onMouseEnter = (): void => {
  if (isDisabled() || !hasTrigger("hover")) return;
  clearHoverCloseTimer();
  scheduleShow();
};

const onMouseLeave = (): void => {
  if (!hasTrigger("hover")) return;
  clearHoverOpenTimer();
  scheduleHide();
};

const onMainClick = (event: Event): void => {
  if (isDisabled()) return;
  event.preventDefault();
  event.stopPropagation();
  emit("click", event);
};

const onItemClick = (item: DropdownViewItem, event?: Event): void => {
  event?.preventDefault();
  event?.stopPropagation();
  if (item.disabled || item.children.length > 0) return;

  selectedCommand.set(item.command);
  selectedLabel.set(item.label);

  const detail: DropdownCommandDetail = {
    command: item.command,
    item: item.raw as DropdownItem,
  };
  emit("command", detail);

  if (props.hideOnClick !== false) closeDropdown();
};

const onCompositionalCommand = (
  event: CustomEvent<{
    command: DropdownCommand;
    label: string;
    item: DropdownItem;
  }>,
): void => {
  event.stopPropagation();
  if (isDisabled()) return;
  const detail = event.detail;
  selectedCommand.set(detail.command);
  selectedLabel.set(detail.label);
  Array.from(
    host.querySelectorAll<HTMLElement & { command?: DropdownCommand; selected?: boolean }>("elf-dropdown-item"),
  ).forEach((item) => {
    item.selected = item.command === detail.command;
  });
  emit("command", { command: detail.command, item: detail.item });
  if (props.hideOnClick !== false) closeDropdown();
};

const resolveFocusedIndex = (items: HTMLElement[], event?: KeyboardEvent): number => {
  const path = event?.composedPath?.() ?? [];
  const pathIndex = items.findIndex((item) =>
    path.some((node) => node === item || (node instanceof Node && item.contains(node))),
  );
  if (pathIndex >= 0) return pathIndex;
  const root = host.shadowRoot;
  const current = (root?.activeElement as HTMLElement | null) || (document.activeElement as HTMLElement | null);
  if (!current) return -1;
  const direct = items.indexOf(current);
  if (direct >= 0) return direct;
  return items.findIndex((item) => item.contains(current));
};

const onMenuKeydown = (event: KeyboardEvent): void => {
  if (!open.peek()) return;

  const items = getFocusableItems();
  if (items.length === 0) return;

  const index = resolveFocusedIndex(items, event);

  if (event.key === "ArrowDown") {
    event.preventDefault();
    event.stopPropagation();
    const next = items[(index + 1 + items.length) % items.length];
    next?.focus();
    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    event.stopPropagation();
    const next = items[(index - 1 + items.length) % items.length];
    next?.focus();
    return;
  }

  if (event.key === "Home") {
    event.preventDefault();
    event.stopPropagation();
    items[0]?.focus();
    return;
  }

  if (event.key === "End") {
    event.preventDefault();
    event.stopPropagation();
    items[items.length - 1]?.focus();
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    closeDropdown();
  }
};

useEventListener(host, "keydown", (event) => {
  if (!hasCompositionalMenu()) return;
  const keyboardEvent = event as KeyboardEvent;
  const fromItem = keyboardEvent
    .composedPath()
    .some((node) => node instanceof HTMLElement && node.tagName.toLowerCase() === "elf-dropdown-item");
  if (fromItem) onMenuKeydown(keyboardEvent);
});

const connectVirtualTrigger = (): void => {
  cleanupVirtualTrigger();
  if (!props.virtualTriggering || typeof window === "undefined") return;
  const target = virtualRef();
  const canListen =
    target && typeof target.addEventListener === "function" && typeof target.removeEventListener === "function";
  if (canListen) {
    target.addEventListener!("click", onTriggerClick as EventListener);
    target.addEventListener!("keydown", onTriggerKeydown as EventListener);
    target.addEventListener!("contextmenu", onContextMenu as EventListener);
    target.addEventListener!("mouseenter", onMouseEnter as EventListener);
    target.addEventListener!("mouseleave", onMouseLeave as EventListener);
  }
  cleanupVirtualTrigger = () => {
    if (canListen) {
      target.removeEventListener!("click", onTriggerClick as EventListener);
      target.removeEventListener!("keydown", onTriggerKeydown as EventListener);
      target.removeEventListener!("contextmenu", onContextMenu as EventListener);
      target.removeEventListener!("mouseenter", onMouseEnter as EventListener);
      target.removeEventListener!("mouseleave", onMouseLeave as EventListener);
    }
  };
};

const connectAnchoredOverlay = (): void => {
  cleanupAnchoredOverlay();
  if ((!props.virtualTriggering && !props.teleported) || typeof window === "undefined") return;

  const reference = anchorReference();
  const panel = getMenuEl();
  const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(requestOverlayUpdate) : undefined;
  if (reference instanceof Element) observer?.observe(reference);
  if (panel) observer?.observe(panel);

  const cleanupOverlayMotion = listenForExternalOverlayMotion(() => [panel], closeDropdown);

  window.addEventListener("resize", requestOverlayUpdate, { passive: true });
  window.visualViewport?.addEventListener("resize", requestOverlayUpdate, { passive: true });

  cleanupAnchoredOverlay = () => {
    observer?.disconnect();
    cleanupOverlayMotion();
    window.removeEventListener("resize", requestOverlayUpdate);
    window.visualViewport?.removeEventListener("resize", requestOverlayUpdate);
  };
  syncTopLayer();
  requestOverlayUpdate();
};

// ─── host bindings ──────────────────────────────────────────

useHostFlag("data-open", () => open.value);
useHostFlag("data-virtual-triggering", () => Boolean(props.virtualTriggering));
useHostFlag("disabled", isDisabled);
useHostAttr("size", () => size.value);
useHostAttr("type", () => buttonType.value);
useHostAttr("effect", () => String(props.effect || "light"));
useHostAttr("placement", placement);

useClickOutside(host, (event) => {
  const reference = virtualRef();
  const path: readonly unknown[] = event.composedPath();
  if (props.virtualTriggering && reference && path.includes(reference)) return;
  if (props.closeOnClickOutside !== false) hide();
});

useEscapeKey(() => {
  if (open.peek()) hide();
});

useEventListener<CustomEvent<HTMLElement>>(document, DROPDOWN_OPEN_EVENT, (event) => {
  if (event.detail !== host) closeDropdown();
});

useEventListener<
  CustomEvent<{
    command: DropdownCommand;
    label: string;
    item: DropdownItem;
  }>
>(host, "elf-dropdown-item-command", onCompositionalCommand);

useEffect(() => {
  void props.virtualTriggering;
  void props.virtualRef;
  void props.trigger;
  if (mounted)
    queueMicrotask(() => {
      connectVirtualTrigger();
      connectAnchoredOverlay();
    });
});

useEffect(() => {
  void props.placement;
  void props.popperOptions;
  void props.teleported;
  void props.appendTo;
  if (mounted)
    queueMicrotask(() => {
      syncTopLayer();
      connectAnchoredOverlay();
    });
});

onMounted(() => {
  mounted = true;
  connectVirtualTrigger();
  connectAnchoredOverlay();

  return () => {
    mounted = false;
    clearHoverTimers();
    cleanupVirtualTrigger();
    cleanupAnchoredOverlay();
    if (overlayFrame) cancelAnimationFrame(overlayFrame);
  };
});

defineExpose({
  openMenu: handleOpen,
  closeMenu: handleClose,
  toggleMenu: toggle,
});

// ─── view fragments ─────────────────────────────────────────

const StandardTrigger = defineFragment(
  () => `
    <button
      v-if=${shouldRenderTrigger && !isSplitButton}
      :class=${buttonClass("trigger")}
      :style=${buttonStyle}
      part="trigger"
      type="button"
      :disabled=${buttonDisabled}
      :aria-expanded=${open ? "true" : "false"}
      aria-haspopup="menu"
      :tabindex=${triggerTabindex}
      @click=${onTriggerClick}
      @keydown=${onTriggerKeydown}
    >
      <slot>
        <slot name="trigger">
          <span class="label">${triggerLabel}</span>
          <span class="arrow" v-if=${showsArrow} aria-hidden="true">▼</span>
        </slot>
      </slot>
    </button>
  `,
);

const SplitTrigger = defineFragment(
  () => `
    <template v-if=${shouldRenderTrigger && isSplitButton}>
      <button
        :class=${buttonClass("split-main")}
        :style=${buttonStyle}
        part="main"
        type="button"
        :disabled=${buttonDisabled}
        @click=${onMainClick}
      >
        <slot><slot name="main">${triggerLabel}</slot></slot>
      </button>
      <button
        :class=${buttonClass("split-toggle")}
        part="trigger"
        type="button"
        :disabled=${buttonDisabled}
        :aria-expanded=${open ? "true" : "false"}
        aria-haspopup="menu"
        :tabindex=${triggerTabindex}
        @click=${onTriggerClick}
        @keydown=${onTriggerKeydown}
        :aria-label=${locale.t("menu.expand")}
      >
        <span class="arrow" v-if=${showsArrow} aria-hidden="true">▼</span>
      </button>
    </template>
  `,
);

const MenuPanel = defineFragment(
  () => `
    <div
      v-if=${shouldRenderMenu}
      :class=${menuClass}
      :style=${menuStyle}
      part="menu"
      :popover=${popoverMode}
      :data-append-to=${appendTargetLabel}
      :role=${menuRole()}
      :aria-hidden=${open ? "false" : "true"}
      :inert=${open ? undefined : ""}
      @keydown=${onMenuKeydown}
    >
      <slot name="dropdown">
        <template v-for="item in viewItems" :key="item.key">
          <div v-if="item.children.length > 0" :class="['sub', { 'is-divided': item.divided }]">
            <button
              type="button"
              class="sub-trigger"
              :class="{ 'is-disabled': item.disabled }"
              :disabled="item.disabled"
              role="menuitem"
              aria-haspopup="true"
            >
              <span class="icon" aria-hidden="true">{{ item.icon }}</span>
              <span class="item-label">{{ item.label }}</span>
              <span class="shortcut">{{ item.shortcut }}</span>
              <span class="chevron" aria-hidden="true">›</span>
            </button>
            <div class="sub-menu" role="menu">
              <button
                v-for="child in item.children"
                :key="child.key"
                type="button"
                class="item"
                :class="{
                                  'is-disabled': child.disabled,
                                  'is-divided': child.divided,
                                  'is-selected': isSelected(child)
                                }"
                :disabled="child.disabled"
                role="menuitem"
                @click="onItemClick(child, $event)"
              >
                <span class="icon" aria-hidden="true">{{ child.icon }}</span>
                <span class="item-label">{{ child.label }}</span>
                <span class="shortcut">{{ child.shortcut }}</span>
                <span></span>
              </button>
            </div>
          </div>
          <button
            v-else
            type="button"
            class="item"
            :class="{
                          'is-disabled': item.disabled,
                          'is-divided': item.divided,
                          'is-selected': isSelected(item)
                        }"
            :disabled="item.disabled"
            role="menuitem"
            @click="onItemClick(item, $event)"
          >
            <span class="icon" aria-hidden="true">{{ item.icon }}</span>
            <span class="item-label">{{ item.label }}</span>
            <span class="shortcut">{{ item.shortcut }}</span>
            <span></span>
          </button>
        </template>
      </slot>
    </div>
  `,
);

defineStyle(styles);

// ─── root template ──────────────────────────────────────────

const Dropdown = defineHtml<DropdownProps, DropdownEmits, DropdownSlots>(`
  <div class="dropdown" @mouseenter=${onMouseEnter} @mouseleave=${onMouseLeave} @contextmenu=${onContextMenu}>
    <StandardTrigger />
    <SplitTrigger />
    <MenuPanel />
  </div>
`);

export { Dropdown };
