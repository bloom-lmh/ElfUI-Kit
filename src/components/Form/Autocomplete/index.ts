import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onBeforeUnmount,
  onMounted,
  useEffect,
  useHost,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useRef
} from "@elfui/core";

import { useDisabled, useFormControl, useFormItem } from "../../../composables";
import { computeAnchoredPosition, listenForExternalOverlayMotion } from "../../Common/anchored-overlay";
import styles from "./style.scss?inline";
import { normalizeFieldVariant } from "../../../types/field";
import type {
    AutocompleteOption,
    AutocompletePlacement,
    AutocompletePopperModifier,
    AutocompletePopperOptions,
    AutocompleteProps,
    AutocompleteVariant,
} from "./types";

export type {
    AutocompleteElement,
    AutocompleteExpose,
    AutocompleteFetchSuggestions,
    AutocompleteOption,
    AutocompletePlacement,
    AutocompletePopperModifier,
    AutocompletePopperOptions,
    AutocompleteProps,
} from "./types";

interface ViewOption {
    key: string;
    label: string;
    text: string;
    disabled: boolean;
    index: number;
    raw: AutocompleteOption;
    isCreate: boolean;
}

const props = defineProps<AutocompleteProps>({
    modelValue: { type: String, default: "" },
    options: { type: Array, default: () => [] },
    fetchSuggestions: { type: Function, default: undefined },
    placeholder: { type: String, default: "" },
    label: { type: String, default: "" },
    variant: { type: String, default: "filled" },
    backgroundColor: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    triggerOnFocus: { type: Boolean, default: true },
    debounce: { type: Number, default: 300 },
    highlightFirstItem: { type: Boolean, default: false },
    allowCreate: { type: Boolean, default: false },
    createText: { type: String, default: "Create" },
    virtual: { type: Boolean, default: false },
    itemHeight: { type: Number, default: 40 },
    maxHeight: { type: Number, default: 280 },
    overscan: { type: Number, default: 3 },
    loading: { type: Boolean, default: false },
    loadingText: { type: String, default: "Loading..." },
    noDataText: { type: String, default: "No suggestions" },
    errorText: { type: String, default: "Unable to load suggestions" },
    placement: { type: String, default: "bottom-start" },
    popperClass: { type: String, default: "" },
    popperStyle: { type: Object, default: () => ({}) },
    popperOptions: { type: Object, default: () => ({}) },
    teleported: { type: Boolean, default: true },
    appendTo: { type: [String, Object], default: "body" },
    fitInputWidth: { type: Boolean, default: false },
    id: { type: String, default: "" },
    name: { type: String, default: "" },
    ariaLabel: { type: String, default: "" },
    validateEvent: { type: Boolean, default: true },
});

const emit = defineEmits<{
    "update:modelValue": [value: string];
    input: [value: string];
    change: [value: string];
    select: [option: AutocompleteOption];
    create: [option: AutocompleteOption];
    focus: [event: FocusEvent];
    blur: [event: FocusEvent];
    clear: [];
    "fetch-error": [error: unknown];
}>();

const ctl = useFormControl<string>(props, emit, {
    ...(props.validateEvent === false
      ? { triggers: { input: false, change: false, blur: false } }
      : {})
});
const fi = useFormItem(() => "");
const isDisabled = useDisabled(() => Boolean(props.disabled));
const host = useHost();
const open = useRef(false);
const suggestions = useRef<AutocompleteOption[] | null>(null);
const activeIndex = useRef(-1);
const activeDescendant = (): string | null =>
    panelRole() === "listbox" && activeIndex.value >= 0
        ? `${listboxId}-option-${activeIndex.value}`
        : null;
const pending = useRef(false);
const loadError = useRef<unknown | null>(null);
const overlayStyle = useRef<Record<string, string>>({});
const resolvedPlacement = useRef<AutocompletePlacement>("bottom-start");
const listScrollTop = useRef(0);
let requestId = 0;
let debounceTimer: ReturnType<typeof setTimeout> | undefined;
let blurTimer: ReturnType<typeof setTimeout> | undefined;
let cleanupAnchoredOverlay = (): void => {};
let overlayFrame = 0;
let mounted = false;
const listboxId = `elf-autocomplete-${Math.random().toString(36).slice(2)}`;

const resolvePlacement = (value: unknown): AutocompletePlacement => {
    const next = String(value || "bottom-start") as AutocompletePlacement;
    return ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end"].includes(next)
        ? next
        : "bottom-start";
};

const toStyleObject = (value: unknown): Record<string, string> => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(
        Object.entries(value as Record<string, string | number>).map(([key, item]) => [key, String(item)]),
    );
};

const normalize = (items: AutocompleteOption[]): ViewOption[] =>
    items.map((item, index) => ({
        key: `${index}-${String(item.value ?? item.label ?? "")}`,
        label: String(item.label ?? item.value ?? ""),
        text: String(item.value ?? item.label ?? ""),
        disabled: Boolean(item.disabled),
        index,
        raw: item,
        isCreate: false,
    }));

const sourceOptions = (): AutocompleteOption[] => {
    const source = suggestions.value ?? props.options ?? [];
    const query = String(ctl.model.value || "").toLowerCase();
    return query
        ? source.filter((item) =>
              String(item.label ?? item.value ?? "")
                  .toLowerCase()
                  .includes(query),
          )
        : source;
};

const options = (): ViewOption[] => {
    const items = normalize(sourceOptions());
    const query = String(ctl.model.value || "").trim();
    if (!props.allowCreate || !query) return items;
    const hasExactMatch = items.some((item) =>
        item.label.localeCompare(query, undefined, { sensitivity: "accent" }) === 0
        || item.text.localeCompare(query, undefined, { sensitivity: "accent" }) === 0
    );
    if (hasExactMatch) return items;
    const raw = { label: query, value: query };
    return [
        { key: `create-${query}`, label: query, text: query, disabled: false, index: 0, raw, isCreate: true },
        ...items.map((item, index) => ({ ...item, index: index + 1 }))
    ];
};

const normalizedItemHeight = (): number => Math.max(28, Number(props.itemHeight) || 40);
const normalizedMaxHeight = (): number => Math.max(normalizedItemHeight(), Number(props.maxHeight) || 280);
const virtualEnabled = (): boolean => Boolean(props.virtual && options().length > 0);

const virtualOptions = (): ViewOption[] => {
    const items = options();
    if (!virtualEnabled()) return items;
    const itemHeight = normalizedItemHeight();
    const overscan = Math.max(0, Math.floor(Number(props.overscan) || 0));
    const start = Math.max(0, Math.floor(listScrollTop.value / itemHeight) - overscan);
    const visibleCount = Math.ceil(normalizedMaxHeight() / itemHeight) + overscan * 2;
    return items.slice(start, Math.min(items.length, start + visibleCount));
};

const optionsViewportStyle = (): Record<string, string> => ({
    maxHeight: `${normalizedMaxHeight()}px`,
    ...(virtualEnabled() ? { height: `${Math.min(options().length * normalizedItemHeight(), normalizedMaxHeight())}px` } : {})
});

const virtualTrackStyle = (): Record<string, string> => ({
    height: `${options().length * normalizedItemHeight()}px`
});

const optionStyle = (item: ViewOption): Record<string, string> =>
    virtualEnabled()
        ? { position: "absolute", top: `${item.index * normalizedItemHeight()}px`, height: `${normalizedItemHeight()}px` }
        : {};

const onOptionsScroll = (event: Event): void => {
    listScrollTop.set((event.currentTarget as HTMLElement).scrollTop);
};

const ensureActiveVisible = (): void => {
    if (!virtualEnabled() || activeIndex.peek() < 0) return;
    queueMicrotask(() => {
        const viewport = getPanelEl()?.querySelector<HTMLElement>(".options-viewport");
        if (!viewport) return;
        const top = activeIndex.peek() * normalizedItemHeight();
        const bottom = top + normalizedItemHeight();
        let next = viewport.scrollTop;
        if (top < next) next = top;
        else if (bottom > next + normalizedMaxHeight()) next = bottom - normalizedMaxHeight();
        if (next === viewport.scrollTop) return;
        viewport.scrollTop = next;
        listScrollTop.set(next);
    });
};

const popperOptions = (): AutocompletePopperOptions =>
    props.popperOptions && typeof props.popperOptions === "object"
        ? props.popperOptions as AutocompletePopperOptions
        : {};

const placement = (): AutocompletePlacement => resolvePlacement(popperOptions().placement || props.placement);

const modifier = (name: string): AutocompletePopperModifier | undefined =>
    popperOptions().modifiers?.find((item) => item.name === name && item.enabled !== false);

const offset = (): [number, number] => modifier("offset")?.options?.offset || [0, 0];

const overflowPadding = (): number => Math.max(0, Number(modifier("preventOverflow")?.options?.padding) || 8);

const flipEnabled = (): boolean => modifier("flip")?.enabled !== false;

const isLoading = (): boolean => Boolean(props.loading || pending.value);

const hasLoadError = (): boolean => loadError.value !== null;
const isEmptyState = (): boolean =>
    !isLoading() &&
    !hasLoadError() &&
    options().length === 0 &&
    (props.fetchSuggestions ? suggestions.value !== null : Boolean(ctl.model.value));

const shouldShowPanel = (): boolean =>
    open.value && (isLoading() || hasLoadError() || isEmptyState() || options().length > 0);

const panelRole = (): "status" | "listbox" =>
    isLoading() || hasLoadError() || isEmptyState() ? "status" : "listbox";

const panelClass = (): unknown[] => [
    "panel",
    props.popperClass,
    `placement-${resolvedPlacement.value}`,
    { status: panelRole() === "status", error: hasLoadError(), "is-teleported": props.teleported },
];

const panelStyle = (): Record<string, string> => ({
    ...toStyleObject(props.popperStyle),
    ...(props.teleported ? overlayStyle.value : {}),
});

const getPanelEl = (): HTMLElement | null => host.shadowRoot?.querySelector<HTMLElement>(".panel") || null;
const getInputEl = (): HTMLInputElement | null => host.shadowRoot?.querySelector<HTMLInputElement>("input") || null;

const resetActive = (): void => {
    const firstEnabled = options().findIndex((option) => !option.disabled);
    activeIndex.set(props.highlightFirstItem ? firstEnabled : -1);
    ensureActiveVisible();
};

const loadSuggestions = async (query: string): Promise<void> => {
    const fetcher = props.fetchSuggestions;
    if (!fetcher) {
        pending.set(false);
        loadError.set(null);
        suggestions.set(null);
        resetActive();
        return;
    }
    const currentRequest = ++requestId;
    pending.set(true);
    loadError.set(null);
    suggestions.set([]);
    try {
        const result = await fetcher(query, (items) => {
            if (currentRequest !== requestId) return;
            suggestions.set(items || []);
            resetActive();
        });
        if (currentRequest === requestId && Array.isArray(result)) {
            suggestions.set(result);
            resetActive();
        }
    } catch (error) {
        if (currentRequest === requestId) {
            suggestions.set([]);
            loadError.set(error);
            activeIndex.set(-1);
            emit("fetch-error", error);
        }
    } finally {
        if (currentRequest === requestId) pending.set(false);
    }
};

const scheduleSuggestions = (query: string): void => {
    if (debounceTimer) clearTimeout(debounceTimer);
    loadError.set(null);
    const delay = Math.max(0, Number(props.debounce) || 0);
    if (!props.fetchSuggestions || delay === 0) {
        void loadSuggestions(query);
        return;
    }
    pending.set(true);
    suggestions.set([]);
    debounceTimer = setTimeout(() => {
        debounceTimer = undefined;
        void loadSuggestions(query);
    }, delay);
};

const setValue = (value: string, eventName: "input" | "change" = "input"): void => {
    if (eventName === "input") {
        ctl.dispatchInput(value);
        return;
    }
    ctl.setValue(value);
    ctl.dispatchChange(value);
};

const onInput = (event: Event): void => {
    const value = (event.target as HTMLInputElement).value;
    // A remote result belongs to the previous query until the new request resolves.
    // Clearing it here prevents stale labels from being paired with the new query.
    if (props.fetchSuggestions) suggestions.set([]);
    loadError.set(null);
    setValue(value, "input");
    scheduleSuggestions(value);
    open.set(true);
    resetActive();
};

const onFocus = (event: Event): void => {
    ctl.dispatchFocus(event);
    if (blurTimer) clearTimeout(blurTimer);
    if (props.triggerOnFocus && !isDisabled()) {
        scheduleSuggestions(String(ctl.model.value || ""));
        open.set(true);
        resetActive();
    }
};

const onBlur = (event: FocusEvent): void => {
    ctl.dispatchBlur(event);
    if (blurTimer) clearTimeout(blurTimer);
    blurTimer = setTimeout(() => {
        blurTimer = undefined;
        open.set(false);
    }, 120);
};

const selectAt = (index: number): void => {
    // Capture the rendered option before updating the model. Updating the model
    // immediately changes the filtered list, so looking it up afterwards can select
    // a different item at the same index.
    const option = options()[index];
    if (!option || option.disabled) return;
    setValue(option.text, "change");
    emit("select", option.raw);
    if (option.isCreate) emit("create", option.raw);
    open.set(false);
    activeIndex.set(-1);
};

const onOptionClick = (event: Event): void => {
    const index = Number((event.currentTarget as HTMLElement).dataset.index);
    if (Number.isInteger(index)) selectAt(index);
};

const clear = (): void => {
    if (isDisabled()) return;
    setValue("", "change");
    emit("clear");
};

const showClear = (): boolean => Boolean(props.clearable && ctl.model.value && !isDisabled());

const inputPlaceholder = (): string => {
    if (props.label && props.placeholder.trim() === props.label.trim()) return "";
    return props.placeholder;
};

const moveActive = (step: 1 | -1): void => {
    const items = options();
    if (!items.length) return;
    let index = activeIndex.value;
    for (let attempt = 0; attempt < items.length; attempt += 1) {
        index = (index + step + items.length) % items.length;
        const item = items[index];
        if (item && !item.disabled) {
            activeIndex.set(index);
            ensureActiveVisible();
            return;
        }
    }
};

const onKeydown = (event: KeyboardEvent): void => {
    if (isDisabled()) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        event.stopPropagation();
        if (!open.value) {
            open.set(true);
            scheduleSuggestions(String(ctl.model.value || ""));
            resetActive();
        }
        moveActive(event.key === "ArrowDown" ? 1 : -1);
        return;
    }
    if (event.key === "Enter" && open.value && activeIndex.value >= 0) {
        event.preventDefault();
        event.stopPropagation();
        selectAt(activeIndex.value);
        return;
    }
    if (event.key === "Escape") {
        if (!open.value) return;
        event.preventDefault();
        event.stopPropagation();
        open.set(false);
        activeIndex.set(-1);
    }
};

const onOptionMouseenter = (event: Event): void => {
    const index = Number((event.currentTarget as HTMLElement).dataset.index);
    if (Number.isInteger(index) && !options()[index]?.disabled) activeIndex.set(index);
};

const updateOverlayPosition = (): void => {
    if (!props.teleported || typeof window === "undefined") {
        overlayStyle.set({});
        resolvedPlacement.set(placement());
        return;
    }
    const input = getInputEl();
    const panel = getPanelEl();
    if (!input || !panel) return;

    const anchorRect = input.getBoundingClientRect();
    if (anchorRect.width === 0 && anchorRect.height === 0) {
        resolvedPlacement.set(placement());
        return;
    }
    const panelRect = panel.getBoundingClientRect();
    const visualViewport = window.visualViewport;
    const width = props.fitInputWidth
        ? anchorRect.width
        : Math.max(anchorRect.width, panelRect.width || panel.offsetWidth || 240);
    const next = computeAnchoredPosition(
        anchorRect,
        { width, height: panelRect.height || panel.offsetHeight || 0 },
        {
            width: visualViewport?.width || window.innerWidth,
            height: visualViewport?.height || window.innerHeight,
            offsetLeft: visualViewport?.offsetLeft || 0,
            offsetTop: visualViewport?.offsetTop || 0,
        },
        {
            placement: placement(),
            offset: offset(),
            padding: overflowPadding(),
            flip: flipEnabled(),
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

const syncTopLayer = (): void => {
    const panel = getPanelEl() as (HTMLElement & {
        showPopover?: () => void;
        hidePopover?: () => void;
    }) | null;
    if (!panel) return;
    try {
        if (props.teleported && shouldShowPanel()) panel.showPopover?.();
        else panel.hidePopover?.();
    } catch {
        // Disconnecting or rapidly replacing a conditional panel may change its popover state first.
    }
    if (shouldShowPanel()) requestOverlayUpdate();
};

const connectAnchoredOverlay = (): void => {
    cleanupAnchoredOverlay();
    if (!props.teleported || typeof window === "undefined") return;

    const input = getInputEl();
    const panel = getPanelEl();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(requestOverlayUpdate) : undefined;
    if (input) observer?.observe(input);
    if (panel) observer?.observe(panel);

    const cleanupOverlayMotion = listenForExternalOverlayMotion(() => [panel], close);

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

const close = (): void => {
    open.set(false);
    activeIndex.set(-1);
};

useHostAttr("variant", () => normalizeFieldVariant(props.variant));
useHostAttr("data-state", () => fi.state);
useHostFlag("disabled", isDisabled);
useHostFlag("data-open", () => open.value);
useHostFlag("data-dirty", () => Boolean(ctl.model.value));
useHostFlag("data-has-label", () => Boolean(props.label));
useHostCssVar("--elf-field-custom-bg", () => props.backgroundColor || "");

useEffect(() => {
    void open.value;
    void pending.value;
    void props.loading;
    void props.teleported;
    void props.placement;
    void props.popperOptions;
    void props.fitInputWidth;
    if (mounted) queueMicrotask(() => {
        syncTopLayer();
        connectAnchoredOverlay();
    });
});

onMounted(() => {
    mounted = true;
    connectAnchoredOverlay();
});

onBeforeUnmount(() => {
    mounted = false;
    requestId += 1;
    if (debounceTimer) clearTimeout(debounceTimer);
    if (blurTimer) clearTimeout(blurTimer);
    cleanupAnchoredOverlay();
    if (overlayFrame) cancelAnimationFrame(overlayFrame);
});

defineExpose({ close });

defineStyle(styles);

const Autocomplete = defineHtml<AutocompleteProps>(`
    <div
        class="autocomplete"
        part="autocomplete"
        :class=${[
            `placement-${placement()}`,
            { loading: isLoading() },
        ]}
        :data-state=${fi.state || null}
    >
        <div class="field" part="field">
            <fieldset class="field-outline" aria-hidden="true">
                <legend><span v-if=${props.label}>${props.label}</span></legend>
            </fieldset>
            <span v-if=${props.label} class="field-label">${props.label}</span>
            <input
                ref="inputEl"
                part="input"
                :id=${props.id || null}
                :name=${props.name || null}
                :value.prop=${ctl.model.value}
                :placeholder=${inputPlaceholder()}
                :disabled=${isDisabled()}
                :aria-label=${props.ariaLabel || props.label || props.placeholder || null}
                role="combobox"
                aria-autocomplete="list"
                :aria-expanded=${shouldShowPanel() ? "true" : "false"}
                :aria-controls=${shouldShowPanel() ? listboxId : null}
                :aria-activedescendant=${activeDescendant()}
                @input=${onInput}
                @focus=${onFocus}
                @blur=${onBlur}
                @keydown=${onKeydown}
            />
            <button v-if=${showClear()} class="clear" type="button" aria-label="Clear" @click=${clear}>
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 4l8 8M12 4l-8 8"></path></svg>
            </button>
        </div>
        <div
            v-if=${shouldShowPanel()}
            ref="panelEl"
            :id=${listboxId}
            :class=${panelClass()}
            :style=${panelStyle()}
            part="panel"
            :popover=${props.teleported ? "manual" : undefined}
            :data-append-to=${typeof props.appendTo === "string" ? props.appendTo : "element"}
            :role=${panelRole()}
            aria-live="polite"
        >
            <div v-if=${isLoading()} class="panel-state">
                <slot name="loading">${props.loadingText}</slot>
            </div>
            <div v-else-if=${hasLoadError()} class="panel-state panel-state--error">
                <slot name="error" :error=${loadError}>${props.errorText}</slot>
            </div>
            <div v-else-if=${isEmptyState()} class="panel-state">
                <slot name="empty">${props.noDataText}</slot>
            </div>
            <template v-else>
                <div
                    class="options-viewport"
                    :class=${{ "is-virtual": virtualEnabled() }}
                    :style=${optionsViewportStyle()}
                    :data-virtualized=${virtualEnabled() ? "true" : "false"}
                    @scroll=${onOptionsScroll}
                >
                    <div class="options-track" :style=${virtualEnabled() ? virtualTrackStyle() : {}}>
                        <button
                            v-for="item in virtualOptions()"
                            :key="item.key"
                            :id="\`${listboxId}-option-\${item.index}\`"
                            class="option"
                            type="button"
                            :style="optionStyle(item)"
                            :data-index="item.index"
                            :data-create="item.isCreate ? 'true' : null"
                            :disabled="item.disabled"
                            role="option"
                            :aria-selected="activeIndex === item.index ? 'true' : 'false'"
                            :class="{ active: activeIndex === item.index, 'option--create': item.isCreate }"
                            @mousedown=${onOptionClick}
                            @mouseenter=${onOptionMouseenter}
                        >
                            <span v-if="item.isCreate" class="create-prefix">${props.createText}</span>
                            <slot :item="item">{{ item.label }}</slot>
                        </button>
                    </div>
                </div>
            </template>
        </div>
    </div>
`);

export { Autocomplete };
