// elf-menu — Material Design 3 导航菜单

import {
  defineEmits,
  defineExpose,
  defineProps,
  defineStyle,
  onMounted,
  onUnmounted,
  useComputed,
  useEventListener,
  useHost,
  useHostAttr,
  useRef,
  useShadowRoot,
  useEffect,
  defineHtml
} from "@elfui/core";

import baseStyles from "./style-base.scss?inline";
import modeStyles from "./style-mode.scss?inline";
import themeStyles from "./style-theme.scss?inline";
import { useDismissibleOverlay } from "../../../composables/useDismissibleOverlay";
import { useLocaleProvider } from "../../Providers/context";
import { normalizeCompositionItems } from "./composition-adapter";
import {
    findMenuItem,
    flattenMenuItems,
    getVisibleMenuItems,
    hasActiveMenuDescendant,
    normalizeMenuItems,
    resolveMenuFieldNames,
    resolveMenuRoutePath,
    resolveMenuTrigger,
    toMenuStyle,
} from "./model";
import type { MenuRawItem, MenuViewItem } from "./model";
import type {
    MenuItemClickDetail,
    MenuMode,
    MenuProps,
    MenuSlots,
    MenuTogglePlacement,
    MenuTrigger,
} from "./types";

export type {
    MenuExpose,
    MenuFieldNames,
    MenuItem,
    MenuItemClickDetail,
    MenuItemGroupProps,
    MenuItemGroupSlots,
    MenuItemProps,
    MenuItemSlots,
    MenuMode,
    MenuPopperStyle,
    MenuProps,
    MenuSlots,
    MenuTheme,
    MenuTogglePlacement,
    MenuTrigger,
    SubMenuProps,
    SubMenuSlots,
} from "./types";

const SIGNATURE_SEP = "::elf-menu::";

interface MenuRuntimeProps extends MenuProps {
    /** @deprecated Use menuTrigger. */
    trigger: MenuTrigger | "";
}

const props = defineProps<MenuRuntimeProps>({
    items: { type: Array, default: () => [] },
    modelValue: { type: String, default: "" },
    defaultActive: { type: String, default: "" },
    defaultOpeneds: { type: Array, default: () => [] },
    mode: { type: String, default: "vertical" },
    theme: { type: String, default: "light" },
    collapse: { type: Boolean, default: false },
    ellipsis: { type: Boolean, default: false },
    ellipsisIcon: { type: String, default: "..." },
    popperOffset: { type: Number, default: 4 },
    menuTrigger: { type: String, default: "" },
    collapseTransition: { type: Boolean, default: true },
    popperEffect: { type: String, default: "light" },
    closeOnClickOutside: { type: Boolean, default: true },
    popperClass: { type: String, default: "" },
    popperStyle: { type: Object, default: () => ({}) },
    showTimeout: { type: Number, default: 0 },
    hideTimeout: { type: Number, default: 300 },
    persistent: { type: Boolean, default: true },
    uniqueOpened: { type: Boolean, default: false },
    router: { type: Boolean, default: false },
    props: {
        type: Object,
        default: () => ({
            index: "index",
            label: "label",
            title: "title",
            icon: "icon",
            disabled: "disabled",
            children: "children",
            badge: "badge",
            route: "route",
            popperClass: "popperClass",
            popperStyle: "popperStyle",
            teleported: "teleported",
            popperOffset: "popperOffset",
            showTimeout: "showTimeout",
            hideTimeout: "hideTimeout",
            expandCloseIcon: "expandCloseIcon",
            expandOpenIcon: "expandOpenIcon",
            collapseCloseIcon: "collapseCloseIcon",
            collapseOpenIcon: "collapseOpenIcon",
        }),
    },
    backgroundColor: { type: String, default: "" },
    textColor: { type: String, default: "" },
    activeTextColor: { type: String, default: "" },
    activeBackground: { type: String, default: "" },
    width: { type: String, default: "" },
    collapseWidth: { type: String, default: "64px" },
    indent: { type: Number, default: 20 },
    rounded: { type: Boolean, default: false },
    elevation: { type: Boolean, default: false },
    bordered: { type: Boolean, default: false },
    showToggle: { type: Boolean, default: false },
    togglePlacement: { type: String, default: "header" },
    searchable: { type: Boolean, default: false },
    searchPlaceholder: { type: String, default: "" },
    trigger: { type: String, default: "click" },
});

const locale = useLocaleProvider();

const emit = defineEmits<{
    "update:modelValue": [index: string];
    select: [index: string, indexPath: string[], item: MenuRawItem];
    open: [index: string, indexPath: string[], item: MenuRawItem];
    close: [index: string, indexPath: string[], item: MenuRawItem];
    "collapse-change": [collapsed: boolean];
}>();

useHostAttr("theme", () => (props.theme === "dark" ? "dark" : "light"));

const host = useHost();

const shadow = useShadowRoot();

const activeKey = useRef("");

const openKeys = useRef<string[]>([]);

const activeSyncKey = useRef("");

const openSyncKey = useRef("");

const collapsed = useRef(Boolean(props.collapse));

const searchText = useRef("");

const compositionVersion = useRef(0);

const panelLeft = useRef("0px");

const popupTop = useRef("8px");

const nestedPopupTop = useRef("0px");

const lastHorizontalRootIndex = useRef("");

const hoveredIndex = useRef("");

const hoveredIndex2 = useRef("");

const lastHoveredIndex = useRef("");

const lastHoveredIndex2 = useRef("");

let compositionObserver: MutationObserver | undefined;
let resizeObserver: ResizeObserver | undefined;
let hoverTimer: ReturnType<typeof setTimeout> | null = null;

const fieldNames = useComputed(() => resolveMenuFieldNames(props.props));

const isHorizontal = useComputed(() => (props.mode as MenuMode) === "horizontal");

const isCollapsed = useComputed(() => !isHorizontal.value && collapsed.value);

const _collapsed = () => isCollapsed.value;

const menuTrigger = (): "click" | "hover" => {
    return resolveMenuTrigger(props.menuTrigger, props.trigger);
};

useEffect(() => {
    const next = Boolean(props.collapse);
    if (next !== collapsed.peek()) collapsed.set(next);
});

const toggleCollapse = () => {
    collapsed.set(!collapsed.peek());
    emit("collapse-change", collapsed.peek());
};

const togglePlacement = (): MenuTogglePlacement => (props.togglePlacement === "header" ? "header" : "footer");

const showHeaderToggle = (): boolean =>
    Boolean(props.showToggle && !isHorizontal.value && togglePlacement() === "header");

const showFooterToggle = (): boolean =>
    Boolean(props.showToggle && !isHorizontal.value && togglePlacement() !== "header");

const toggleTitle = (): string => locale.t(isCollapsed.value ? "menu.expand" : "menu.collapse");

const onCustomToggleClick = (event: Event): void => {
    const isToggle = event
        .composedPath()
        .some((node) => node instanceof HTMLElement && node.getAttribute("slot") === "toggle");
    if (isToggle) toggleCollapse();
};

const onCustomSearchInput = (event: Event): void => {
    const input = event
        .composedPath()
        .find((node): node is HTMLInputElement => node instanceof HTMLInputElement);
    if (input) searchText.set(input.value);
};

const onSearchInput = (event: Event): void => {
    searchText.set((event.currentTarget as HTMLInputElement).value);
};

const clearSearch = (): void => {
    if (!searchText.peek()) return;
    shadow?.querySelectorAll<HTMLInputElement>(".menu-search input")
        .forEach((input) => { input.value = ""; });
    searchText.set("");
    host.querySelectorAll<HTMLInputElement>('input[slot="search"], [slot="search"] input')
        .forEach((input) => { input.value = ""; });
};

useEventListener(host, "click", onCustomToggleClick);
useEventListener(host, "input", onCustomSearchInput);

onMounted(() => {
    compositionObserver = new MutationObserver(() => compositionVersion.set(compositionVersion.peek() + 1));
    compositionObserver.observe(host, { attributes: true, childList: true, subtree: true, characterData: true });

    if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => handleResize());
        resizeObserver.observe(host);
    }
});

onUnmounted(() => {
    compositionObserver?.disconnect();
    resizeObserver?.disconnect();
    clearHoverTimer();
});

const hostStyle = useComputed(() => {
    const s: Record<string, string> = {};
    if (!isHorizontal.value) {
        s["--m-w"] = _collapsed() ? "" : String(props.width || "260px");
    }
    const backgroundColor = String(props.backgroundColor || "");
    const textColor = String(props.textColor || "");
    const activeTextColor = String(props.activeTextColor || "");
    const activeBackground = String(props.activeBackground || "");

    s["--m-cw"] = String(props.collapseWidth || "64px");
    s["--m-popper-offset"] = `${Math.max(0, Number(props.popperOffset) || 0)}px`;
    if (backgroundColor) s["--m-bg"] = backgroundColor;
    if (textColor) s["--m-color"] = textColor;
    if (activeTextColor) s["--m-active-c"] = activeTextColor;
    if (activeBackground) s["--m-active-bg"] = activeBackground;
    if (props.rounded) s["--m-radius"] = "var(--elf-radius-md)";
    if (props.elevation) s["--m-shadow"] = "var(--elf-shadow-1)";
    return s;
});

useEffect(() => {
    const sig = [props.modelValue ?? "", props.defaultActive ?? ""].map(String).join(SIGNATURE_SEP);
    if (activeSyncKey.peek() === sig) return;
    activeSyncKey.set(sig);
    activeKey.set(String(props.modelValue || props.defaultActive || ""));
});

useEffect(() => {
    const defaults = !isHorizontal.value && Array.isArray(props.defaultOpeneds) ? props.defaultOpeneds : [];
    const next = defaults.map((k) => String(k));
    const sig = `${isHorizontal.value ? "horizontal" : "vertical"}${SIGNATURE_SEP}${next.join(SIGNATURE_SEP)}`;
    if (openSyncKey.peek() === sig) return;
    openSyncKey.set(sig);
    openKeys.set(next);
});

const closeOpenMenus = (): void => {
    openKeys.set([]);
    hoveredIndex.set("");
    hoveredIndex2.set("");
};

const dismissibleOverlay = useDismissibleOverlay({
    kind: "menu",
    containers: () => [host],
    closeOnEscape: () => true,
    closeOnOutside: () => props.closeOnClickOutside !== false,
    outsideCapture: true,
    onRequestClose: closeOpenMenus,
});

useEffect(() => {
    if (isHorizontal.value && openKeys.value.length > 0) {
        dismissibleOverlay.activate();
    } else {
        dismissibleOverlay.deactivate();
    }
});

const dataItems = useComputed(() =>
    normalizeMenuItems(props.items, fieldNames.value),
);

const compositionItems = useComputed(() => {
    compositionVersion.value;
    return normalizeCompositionItems(host);
});

const menuTree = useComputed(() =>
    compositionItems.value.length > 0 ? compositionItems.value : dataItems.value,
);

const tree = (): MenuViewItem[] => menuTree.value;

const findItem = (index: string): MenuViewItem | undefined =>
    findMenuItem(menuTree.value, index);

const isOpen = (index: string): boolean => openKeys.value.includes(index);

const isActive = (index: string): boolean => activeKey.value === index;

const getVisibleItems = (): MenuViewItem[] =>
    getVisibleMenuItems(menuTree.value, {
        collapsed: _collapsed(),
        opened: openKeys.value,
        searchable: Boolean(props.searchable),
        searchText: searchText.value,
    });

const activeHorizontalRoot = (): MenuViewItem | undefined => {
    const roots = tree();
    const opened = openKeys.value.find((k) => roots.some((r) => r.index === k));
    if (opened) return roots.find((r) => r.index === opened);
    return roots.find((root) => root.index === activeKey.value || flattenMenuItems(root.children).some(
        (item) => item.index === activeKey.value,
    ));
};

const horizontalPanelRoot = (): MenuViewItem | undefined => {
    const current = activeHorizontalRoot();
    if (current?.hasChildren) return current;
    return findItem(lastHorizontalRootIndex.value);
};

const isHorizontalPanelVisible = (): boolean => {
    const root = horizontalPanelRoot();
    return Boolean(root && isOpen(root.index));
};

const getHorizontalPanelItems = (): MenuViewItem[] => {
    const root = horizontalPanelRoot();
    if (!root?.hasChildren) return [];
    if (!props.persistent && !isOpen(root.index)) return [];
    return flattenMenuItems(root.children);
};

const alignPanel = (item: MenuViewItem) => {
    if (!isHorizontal.value) return;
    requestAnimationFrame(() => {
        const bar = shadow?.querySelector(".horizontal-bar");
        const btn = bar?.querySelector(`[data-index="${item.index}"]`) as HTMLElement | null;
        if (btn) panelLeft.set(`${btn.offsetLeft}px`);
    });
};

const alignCollapsePopup = (item: MenuViewItem) => {
    if (!_collapsed()) return;
    requestAnimationFrame(() => {
        const menu = shadow?.querySelector(".menu") as HTMLElement | null;
        const btn = shadow?.querySelector(`[data-index="${item.index}"]`) as HTMLElement | null;
        if (!menu || !btn) return;
        const menuRect = menu.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        popupTop.set(`${Math.max(8, btnRect.top - menuRect.top)}px`);
    });
};

const alignNestedPopup = (item: MenuViewItem) => {
    if (!_collapsed()) return;
    requestAnimationFrame(() => {
        const popup = shadow?.querySelector(".collapse-popup") as HTMLElement | null;
        const btn = popup?.querySelector(`[data-index="${item.index}"]`) as HTMLElement | null;
        if (!popup || !btn) return;
        const popupRect = popup.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        nestedPopupTop.set(`${Math.max(0, btnRect.top - popupRect.top)}px`);
    });
};

const emitOpen = (item: MenuViewItem) => emit("open", item.index, [...item.indexPath, item.index], item.raw);

const emitClose = (item: MenuViewItem) => emit("close", item.index, [...item.indexPath, item.index], item.raw);

const closeBranch = (item: MenuViewItem) => {
    const rm = new Set([item.index, ...flattenMenuItems(item.children).map((c) => c.index)]);
    openKeys.set(openKeys.value.filter((k) => !rm.has(k)));
    emitClose(item);
};

const openBranch = (item: MenuViewItem) => {
    if (props.uniqueOpened || isHorizontal.value) openKeys.set([...item.indexPath, item.index]);
    else if (!openKeys.value.includes(item.index)) openKeys.set([...openKeys.value, item.index]);
    if (isHorizontal.value && item.level === 0) lastHorizontalRootIndex.set(item.index);
    emitOpen(item);
    alignPanel(item);
    // 展开后滚动到可见
    requestAnimationFrame(() => {
        const el = shadow?.querySelector(`[data-index="${item.index}"]`);
        if (el?.scrollIntoView) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
};

const toggleOpen = (item: MenuViewItem) => {
    if (isOpen(item.index)) closeBranch(item);
    else openBranch(item);
};

const navigate = (item: MenuViewItem) => {
    const target = resolveMenuRoutePath(item);
    if (props.router && typeof window !== "undefined" && target.startsWith("/")) window.location.hash = target;
};

const isMenuRoute = (value: unknown): value is NonNullable<MenuItemClickDetail["route"]> =>
    typeof value === "string" || (typeof value === "object" && value !== null);

const selectItem = (item: MenuViewItem) => {
    activeKey.set(item.index);
    clearSearch();
    emit("update:modelValue", item.index);
    emit("select", item.index, [...item.indexPath, item.index], item.raw);
    if (item.source) {
        const detail: MenuItemClickDetail = {
            index: item.index,
            indexPath: [...item.indexPath, item.index],
            ...(isMenuRoute(item.route)
                ? { route: item.route }
                : {}),
        };
        item.source.dispatchEvent(new CustomEvent("click", { detail, bubbles: true, composed: true }));
    }
    navigate(item);
};

const onItemClick = (item: MenuViewItem, e?: Event) => {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    if (item.disabled || item.divider || item.group) return;
    if (item.hasChildren) {
        if (_collapsed()) {
            selectItem(item);
            return;
        }
        toggleOpen(item);
        return;
    }
    if (isHorizontal.value) openKeys.set([]);
    selectItem(item);
};

const open = (index: string) => {
    const item = findItem(String(index));
    if (item?.hasChildren && !item.disabled) openBranch(item);
};

const close = (index: string) => {
    const item = findItem(String(index));
    if (item) closeBranch(item);
};

const select = (index: string) => {
    const item = findItem(String(index));
    if (item && !item.disabled && !item.hasChildren) selectItem(item);
};

const updateActiveIndex = (index: string): void => {
    activeKey.set(String(index || ""));
};

const handleResize = (): void => {
    const item = activeHorizontalRoot();
    if (item) alignPanel(item);
};

defineExpose({ open, close, select, handleResize, updateActiveIndex });

const clearHoverTimer = () => {
    if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
    }
};

const runAfter = (delay: unknown, callback: () => void): void => {
    const timeout = Math.max(0, Number(delay) || 0);
    if (timeout === 0) {
        callback();
        return;
    }
    hoverTimer = setTimeout(() => {
        hoverTimer = null;
        callback();
    }, timeout);
};

const itemShowTimeout = (item: MenuViewItem): number => item.showTimeout ?? (Number(props.showTimeout) || 0);

const itemHideTimeout = (item?: MenuViewItem): number => item?.hideTimeout ?? (Number(props.hideTimeout) || 0);

const onItemEnter = (item: MenuViewItem) => {
    if (item.divider || item.group) return;
    clearHoverTimer();
    if (_collapsed()) {
        clearHoverTimer();
        hoveredIndex.set(item.hasChildren ? item.index : "");
        if (item.hasChildren) lastHoveredIndex.set(item.index);
        hoveredIndex2.set("");
        if (item.hasChildren) alignCollapsePopup(item);
    } else if (menuTrigger() === "hover" && item.hasChildren) {
        // 关闭其他已展开的同级项，再展开当前
        runAfter(itemShowTimeout(item), () => {
            const currentOpen = openKeys.peek();
            const path = [...item.indexPath, item.index];
            const siblingsOpen = currentOpen.filter((k) => !path.includes(k));
            if (siblingsOpen.length > 0) openKeys.set(path);
            if (!isOpen(item.index)) openBranch(item);
            hoveredIndex.set(item.index);
        });
    }
};

const onItemLeave = (item?: MenuViewItem) => {
    clearHoverTimer();
    if (_collapsed()) {
        runAfter(itemHideTimeout(item), () => {
            hoveredIndex.set("");
            hoveredIndex2.set("");
        });
    } else if (menuTrigger() === "hover") {
        const idx = hoveredIndex.peek();
        runAfter(itemHideTimeout(item), () => {
            if (idx) {
                const item = findItem(idx);
                if (item && isOpen(idx)) closeBranch(item);
            }
            hoveredIndex.set("");
        });
    }
};

const onSubItemEnter = (item: MenuViewItem) => {
    clearHoverTimer();
    if (item.hasChildren) {
        hoveredIndex2.set(item.index);
        lastHoveredIndex2.set(item.index);
        alignNestedPopup(item);
    }
};

const onSubItemLeave = () => {
    clearHoverTimer();
    runAfter(props.hideTimeout, () => {
        hoveredIndex2.set("");
    });
};

const getHoveredChildren = (): MenuViewItem[] => {
    const idx = hoveredIndex.value || (props.persistent ? lastHoveredIndex.value : "");
    if (!idx) return [];
    return findItem(idx)?.children ?? [];
};

const getHoveredChildren2 = (): MenuViewItem[] => {
    const idx = hoveredIndex2.value || (props.persistent ? lastHoveredIndex2.value : "");
    if (!idx) return [];
    return findItem(idx)?.children ?? [];
};

const collapsePopupRoot = (): MenuViewItem | undefined =>
    findItem(hoveredIndex.value || (props.persistent ? lastHoveredIndex.value : ""));

const nestedPopupRoot = (): MenuViewItem | undefined =>
    findItem(hoveredIndex2.value || (props.persistent ? lastHoveredIndex2.value : ""));

const onPopupEnter = () => clearHoverTimer();

const onPopupLeave = () => {
    clearHoverTimer();
    runAfter(props.hideTimeout, () => {
        hoveredIndex.set("");
        hoveredIndex2.set("");
    });
};

const hasActiveChild = (item: MenuViewItem): boolean => {
    return item.hasChildren && hasActiveMenuDescendant(item, activeKey.value);
};

const itemClass = (item: MenuViewItem): Record<string, boolean> => ({
    "is-active": isActive(item.index) || (item.hasChildren && hasActiveChild(item)),
    "is-open": isOpen(item.index),
    "is-disabled": item.disabled,
    "has-children": item.hasChildren,
    "is-divider": item.divider,
    "is-group": item.group,
});

const itemStyle = (item: MenuViewItem): Record<string, string> => {
    if (isHorizontal.value || _collapsed() || item.divider || item.group) return {};
    return { paddingLeft: `${12 + item.level * (Number(props.indent) || 20)}px` };
};

const itemAriaCurrent = (item: MenuViewItem): "page" | undefined => isActive(item.index) ? "page" : undefined;

const itemTabIndex = (item: MenuViewItem): number => {
    if (item.disabled || item.divider || item.group) return -1;
    const focusable = getVisibleItems().filter((entry) => !entry.disabled && !entry.divider && !entry.group);
    return isActive(item.index) || (!activeKey.value && focusable[0]?.index === item.index) ? 0 : -1;
};

const itemArrow = (item: MenuViewItem): string => {
    if (_collapsed()) {
        if (isOpen(item.index) && item.collapseOpenIcon) return item.collapseOpenIcon;
        return item.collapseCloseIcon || "›";
    }
    if (isOpen(item.index) && item.expandOpenIcon) return item.expandOpenIcon;
    return item.expandCloseIcon || "›";
};

const popperClass = (base: string, item?: MenuViewItem): unknown[] => [
    base,
    String(props.popperClass || ""),
    String(item?.popperClass || ""),
    `is-${String(props.popperEffect || "light")}`,
];

const popperStyle = (extra: Record<string, string> = {}): Record<string, string> => ({
    ...toMenuStyle(props.popperStyle),
    ...extra,
});

const horizontalPanelStyle = (): Record<string, string> => {
    const item = horizontalPanelRoot();
    const offset = item?.popperOffset ?? (Number(props.popperOffset) || 0);
    return {
        ...popperStyle(),
        ...toMenuStyle(item?.popperStyle),
        left: panelLeft.value,
        marginTop: `${offset}px`,
    };
};

const collapsePopupStyle = (): Record<string, string> => {
    const item = collapsePopupRoot();
    const offset = item?.popperOffset ?? (Number(props.popperOffset) || 0);
    return { ...popperStyle(), ...toMenuStyle(item?.popperStyle), top: popupTop.value, marginLeft: `${offset}px` };
};

const nestedPopupStyle = (): Record<string, string> => {
    const item = nestedPopupRoot();
    const offset = item?.popperOffset ?? (Number(props.popperOffset) || 0);
    return {
        ...popperStyle(),
        ...toMenuStyle(item?.popperStyle),
        top: nestedPopupTop.value,
        marginLeft: `${offset}px`,
    };
};

const nestedPopperClass = (): unknown[] => [
    ...popperClass("collapse-popup", nestedPopupRoot()),
    "collapse-popup--nested",
    { "is-hidden": !hoveredIndex2.value },
];

const onKeydown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target?.classList.contains("menu-item")) return;
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        target.click();
        return;
    }
    const index = target.dataset.index || "";
    const item = findItem(index);
    if (e.key === "ArrowRight" && item?.hasChildren) {
        e.preventDefault();
        open(item.index);
        requestAnimationFrame(() => {
            const firstChild = shadow?.querySelector<HTMLElement>(`[data-index="${item.children[0]?.index}"]`);
            firstChild?.focus();
        });
        return;
    }
    if (e.key === "ArrowLeft" && item) {
        const parentIndex = item.indexPath.at(-1);
        if (parentIndex) {
            e.preventDefault();
            close(parentIndex);
            shadow?.querySelector<HTMLElement>(`[data-index="${parentIndex}"]`)?.focus();
        }
        return;
    }
    if (e.key === "Escape") {
        e.preventDefault();
        if (!dismissibleOverlay.isActive() || dismissibleOverlay.claim(e)) {
            closeOpenMenus();
        }
        return;
    }
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    const root = target.getRootNode() as ParentNode;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".menu-item:not(.is-disabled):not(.is-divider):not(.is-group)"));
    const idx = items.indexOf(target);
    if (idx < 0) return;
    e.preventDefault();
    const nextIndex = e.key === "Home"
        ? 0
        : e.key === "End"
            ? items.length - 1
            : (idx + (["ArrowDown", "ArrowRight"].includes(e.key) ? 1 : -1) + items.length) % items.length;
    items[nextIndex]?.focus();
};

defineStyle(baseStyles);

defineStyle(modeStyles);

defineStyle(themeStyles);

const Menu = defineHtml<MenuRuntimeProps, Record<string, never>, MenuSlots>(`
    <nav
        :class=${[
            "menu",
            {
                "is-horizontal": isHorizontal,
                "is-collapsed": isCollapsed,
                "is-ellipsis": props.ellipsis,
                "is-bordered": props.bordered,
                "is-no-collapse-transition": !props.collapseTransition,
            },
        ]}
        :style=${hostStyle}
        role="navigation"
        aria-label="Menu"
        @keydown=${onKeydown}
    >
        <slot class="composition-slot"></slot>
        <div class="menu-header">
            <div class="menu-header-content"><slot name="header"></slot></div>
            <div v-if=${showHeaderToggle()} class="menu-toggle-slot menu-toggle-slot--header">
                <slot name="toggle">
                    <button class="collapse-toggle collapse-toggle--header" type="button" :title=${toggleTitle()} @click=${toggleCollapse}>
                        <span class="toggle-icon">${isCollapsed ? "›" : "‹"}</span>
                    </button>
                </slot>
            </div>
        </div>

        <div class="menu-search" v-if=${props.searchable && !isHorizontal && !isCollapsed} @input=${onCustomSearchInput}>
            <slot name="search">
                <input class="search-input" :value=${searchText} :placeholder=${props.searchPlaceholder || locale.t("menu.search")} @input=${onSearchInput} />
            </slot>
        </div>

        <template v-if=${isHorizontal}>
            <div class="horizontal-wrap">
                <div class="horizontal-bar" role="menubar">
                    <button
                        v-for="item in tree()"
                        :key="item.index"
                        type="button"
                        :data-index="item.index"
                        :class="['menu-item', itemClass(item)]"
                        :disabled="item.disabled || item.divider || item.group"
                        :title="item.label"
                        role="menuitem"
                        :tabindex="itemTabIndex(item)"
                        :aria-current="itemAriaCurrent(item)"
                        :aria-disabled='item.disabled ? "true" : undefined'
                        :aria-haspopup='item.hasChildren ? "menu" : undefined'
                        :aria-expanded="item.hasChildren ? String(isOpen(item.index)) : undefined"
                        @click="onItemClick(item, $event)"
                        @mouseenter="onItemEnter(item)"
                        @mouseleave="onItemLeave(item)"
                    >
                        <span v-if="item.icon" class="menu-icon">{{ item.icon }}</span>
                        <span class="menu-label">{{ item.label }}</span>
                        <span v-if="item.badge" class="menu-badge">{{ item.badge }}</span>
                        <span v-if="item.hasChildren" class="menu-arrow" aria-hidden="true">{{ itemArrow(item) }}</span>
                    </button>
                    <button v-if=${props.ellipsis} class="menu-ellipsis" type="button" aria-label="more">
                        ${props.ellipsisIcon || "..."}
                    </button>
                </div>
                <div
                    v-if=${getHorizontalPanelItems().length > 0}
                    :class=${[
                        ...popperClass("horizontal-panel", horizontalPanelRoot()),
                        { "is-hidden": !isHorizontalPanelVisible() },
                    ]}
                    role="menu"
                    :aria-hidden=${String(!isHorizontalPanelVisible())}
                    :style=${horizontalPanelStyle()}
                >
                    <template v-for="item in getHorizontalPanelItems()" :key="item.index">
                        <hr v-if="item.divider" class="menu-divider" />
                        <strong v-else-if="item.group" class="menu-group-title">{{ item.label }}</strong>
                        <button
                            v-else
                            type="button"
                            :data-index="item.index"
                            :class="['menu-item', itemClass(item)]"
                            :disabled="item.disabled"
                            :title="item.label"
                            role="menuitem"
                            :tabindex="itemTabIndex(item)"
                            :aria-current="itemAriaCurrent(item)"
                            :aria-disabled='item.disabled ? "true" : undefined'
                            :aria-haspopup='item.hasChildren ? "menu" : undefined'
                            :aria-expanded="item.hasChildren ? String(isOpen(item.index)) : undefined"
                            @click="onItemClick(item, $event)"
                        >
                            <span v-if="item.icon" class="menu-icon">{{ item.icon }}</span>
                            <span class="menu-label">{{ item.label }}</span>
                            <span v-if="item.badge" class="menu-badge">{{ item.badge }}</span>
                            <span v-if="item.hasChildren" class="menu-arrow" aria-hidden="true">{{ itemArrow(item) }}</span>
                        </button>
                    </template>
                </div>
            </div>
            <slot name="footer"></slot>
        </template>

        <template v-else>
            <div class="menu-body" role="menu">
                <template v-for="item in getVisibleItems()" :key="item.index">
                    <hr v-if="item.divider" class="menu-divider" />
                    <strong v-else-if="item.group" class="menu-group-title">{{ item.label }}</strong>
                    <button
                        v-else
                        type="button"
                        :data-index="item.index"
                        :class="['menu-item', itemClass(item)]"
                        :style="itemStyle(item)"
                        :disabled="item.disabled"
                        :title="isCollapsed ? item.label : ''"
                        role="menuitem"
                        :tabindex="itemTabIndex(item)"
                        :aria-current="itemAriaCurrent(item)"
                        :aria-disabled='item.disabled ? "true" : undefined'
                        :aria-haspopup='item.hasChildren ? "menu" : undefined'
                        :aria-expanded="item.hasChildren ? String(isOpen(item.index)) : undefined"
                        @click="onItemClick(item, $event)"
                        @mouseenter="onItemEnter(item)"
                        @mouseleave="onItemLeave(item)"
                    >
                        <span v-if="item.icon" class="menu-icon">{{ item.icon }}</span>
                        <span class="menu-label">{{ item.label }}</span>
                        <span v-if="item.badge" class="menu-badge">{{ item.badge }}</span>
                        <span v-if="item.hasChildren && !isCollapsed" class="menu-arrow" aria-hidden="true">{{ itemArrow(item) }}</span>
                    </button>
                </template>
                <div v-if=${getVisibleItems().length === 0} class="menu-empty">${locale.t("common.noResults")}</div>

                <div
                    v-if=${isCollapsed && getHoveredChildren().length > 0}
                    :class=${[
                        ...popperClass("collapse-popup", collapsePopupRoot()),
                        { "is-hidden": !hoveredIndex },
                    ]}
                    role="menu"
                    :aria-hidden=${String(!hoveredIndex)}
                    :style=${collapsePopupStyle()}
                    @mouseenter=${onPopupEnter}
                    @mouseleave=${onPopupLeave}
                >
                    <button
                        v-for="item in getHoveredChildren()"
                        :key="item.index"
                        type="button"
                        :data-index="item.index"
                        :class="['menu-item', itemClass(item)]"
                        :disabled="item.disabled"
                        :title="item.label"
                        role="menuitem"
                        :tabindex="itemTabIndex(item)"
                        :aria-current="itemAriaCurrent(item)"
                        :aria-disabled='item.disabled ? "true" : undefined'
                        :aria-haspopup='item.hasChildren ? "menu" : undefined'
                        @click="onItemClick(item, $event)"
                        @mouseenter="onSubItemEnter(item)"
                        @mouseleave=${onSubItemLeave}
                    >
                        <span v-if="item.icon" class="menu-icon">{{ item.icon }}</span>
                        <span class="menu-label">{{ item.label }}</span>
                        <span v-if="item.badge" class="menu-badge">{{ item.badge }}</span>
                        <span v-if="item.hasChildren" class="menu-arrow" aria-hidden="true">{{ itemArrow(item) }}</span>
                    </button>
                    <div
                        v-if=${getHoveredChildren2().length > 0}
                        :class=${nestedPopperClass()}
                        role="menu"
                        :style=${nestedPopupStyle()}
                    >
                        <button
                            v-for="item in getHoveredChildren2()"
                            :key="item.index"
                            type="button"
                            :data-index="item.index"
                            :class="['menu-item', itemClass(item)]"
                            :disabled="item.disabled"
                            :title="item.label"
                            role="menuitem"
                            :tabindex="itemTabIndex(item)"
                            :aria-current="itemAriaCurrent(item)"
                            :aria-disabled='item.disabled ? "true" : undefined'
                            @click="onItemClick(item, $event)"
                        >
                            <span v-if="item.icon" class="menu-icon">{{ item.icon }}</span>
                            <span class="menu-label">{{ item.label }}</span>
                            <span v-if="item.badge" class="menu-badge">{{ item.badge }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="menu-footer">
                <slot name="footer"></slot>
                <div v-if=${showFooterToggle()} class="menu-toggle-slot">
                    <slot name="toggle">
                        <button class="collapse-toggle" type="button" :title=${toggleTitle()} @click=${toggleCollapse}>
                            <span class="toggle-icon">${isCollapsed ? "›" : "‹"}</span>
                        </button>
                    </slot>
                </div>
            </div>
        </template>
    </nav>
`);

export { Menu };
