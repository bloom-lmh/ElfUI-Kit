// elf-defaults-provider — 为子树批量提供组件默认 props
//
// 参考 Vuetify VDefaultsProvider。Web Components 没有统一 app 实例，
// 所以这里同时做两件事：
// 1) provide 一个可 inject 的 defaults context；
// 2) 对 light DOM 子组件实际写入默认 property/attribute，让现有组件立即可用。

import {
  defineProps,
  defineStyle,
  onBeforeUnmount,
  onMounted,
  provide,
  useEffect,
  useHost,
  useTemplateRef,
  defineHtml
} from "@elfui/core";

import {
    DEFAULTS_PROVIDER_KEY,
    type DefaultsProviderContext,
    type DefaultsStrategy,
    type ProviderDefaults,
    useDefaultsProvider,
} from "../context";
import styles from "./style.scss?inline";
import type { DefaultsProviderProps } from "./types";

export type { DefaultsProviderProps, DefaultsStrategy, ProviderDefaults } from "./types";

type LooseElement = HTMLElement & Record<string, unknown>;

const props = defineProps<DefaultsProviderProps>({
    defaults: { type: Object, default: () => ({}) },
    disabled: { type: Boolean, default: false },
    deep: { type: Boolean, default: true },
    strategy: { type: String, default: "missing" },
    reset: { type: Boolean, default: false },
});

const host = useHost();
const parentDefaults = useDefaultsProvider();

const slotRef = useTemplateRef<HTMLSlotElement>("slotEl");

const readOwnDefaults = (): ProviderDefaults => {
    const value = props.defaults as unknown;
    if (!value) return {};
    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value) as ProviderDefaults;
            return parsed && typeof parsed === "object" ? parsed : {};
        } catch {
            return {};
        }
    }
    return value && typeof value === "object" ? (value as ProviderDefaults) : {};
};

const readDefaults = (): ProviderDefaults => {
    const own = readOwnDefaults();
    if (props.reset || !parentDefaults || parentDefaults.disabled) return own;
    const merged: ProviderDefaults = { ...parentDefaults.defaults };
    for (const [component, config] of Object.entries(own)) {
        merged[component] = { ...(merged[component] || {}), ...config };
    }
    return merged;
};

const readStrategy = (): DefaultsStrategy => (props.strategy === "overwrite" ? "overwrite" : "missing");
type AppliedValue = { key: string; propertyValue: unknown; hadAttribute: boolean; attributeValue: string | null };
const appliedValues = new Map<Element, AppliedValue[]>();
let observer: MutationObserver | undefined;
let applyQueued = false;

const findConfig = (el: Element): Record<string, unknown> | undefined => {
    const defaults = readDefaults();
    const tag = el.tagName.toLowerCase();
    const short = tag.startsWith("elf-") ? tag.slice(4) : tag;
    const pascal = tag
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
    const shortPascal = short
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");

    return defaults[tag] ?? defaults[short] ?? defaults[pascal] ?? defaults[shortPascal];
};

const shouldSkip = (el: Element, propKey: string): boolean => {
    if (readStrategy() === "overwrite") return false;
    const attrName = toKebab(propKey);
    return el.hasAttribute(attrName) || el.hasAttribute(propKey);
};

const applyProp = (el: Element, propKey: string, value: unknown): void => {
    if (shouldSkip(el, propKey)) return;
    const target = el as LooseElement;
    const attrName = toKebab(propKey);
    const records = appliedValues.get(el) || [];
    records.push({
        key: propKey,
        propertyValue: target[propKey],
        hadAttribute: el.hasAttribute(attrName),
        attributeValue: el.getAttribute(attrName),
    });
    appliedValues.set(el, records);
    target[propKey] = value;

    if (typeof value === "boolean") {
        if (value) el.setAttribute(attrName, "");
        else if (readStrategy() === "overwrite") el.removeAttribute(attrName);
        return;
    }
    if (typeof value === "string" || typeof value === "number") {
        el.setAttribute(attrName, String(value));
    }
};

const applyElement = (el: Element): void => {
    const config = findConfig(el);
    if (!config) return;
    for (const [key, value] of Object.entries(config)) {
        applyProp(el, key, value);
    }
};

const walk = (el: Element): void => {
    applyElement(el);
    if (!props.deep) return;
    if (el !== host && el.tagName.toLowerCase() === "elf-defaults-provider") return;
    for (const child of Array.from(el.children)) walk(child);
};

const assignedElements = (): Element[] => {
    const slot = slotRef.value;
    if (slot) return slot.assignedElements({ flatten: true });
    return Array.from(host.children);
};

const restoreApplied = (): void => {
    for (const [element, records] of appliedValues) {
        const target = element as LooseElement;
        for (const record of records.reverse()) {
            const attrName = toKebab(record.key);
            target[record.key] = record.propertyValue;
            if (record.hadAttribute) element.setAttribute(attrName, record.attributeValue ?? "");
            else element.removeAttribute(attrName);
        }
    }
    appliedValues.clear();
};

const applyDefaults = (root?: ParentNode): void => {
    restoreApplied();
    if (props.disabled) return;
    const targetRoot = root && "children" in root ? root : undefined;
    const roots = targetRoot ? Array.from(targetRoot.children) : assignedElements();
    for (const child of roots) walk(child);
};
const queueApplyDefaults = (): void => {
    if (applyQueued) return;
    applyQueued = true;
    queueMicrotask(() => {
        applyQueued = false;
        applyDefaults();
    });
};

const context: DefaultsProviderContext = {
    get defaults() {
        return readDefaults();
    },
    get disabled() {
        return Boolean(props.disabled);
    },
    get strategy() {
        return readStrategy();
    },
    applyDefaults,
};

provide(DEFAULTS_PROVIDER_KEY, context);

onMounted(() => {
    // Apply before slotted custom-element children finish mounting, so their
    // reflected default attributes are not mistaken for explicit user input.
    applyDefaults();
    queueMicrotask(() => applyDefaults());
    if (typeof MutationObserver !== "undefined") {
        observer = new MutationObserver(queueApplyDefaults);
        observer.observe(host, { childList: true, subtree: true });
    }
});

useEffect(() => {
    readDefaults();
    readStrategy();
    Boolean(props.disabled);
    Boolean(props.deep);
    Boolean(props.reset);
    queueApplyDefaults();
});

onBeforeUnmount(() => {
    observer?.disconnect();
    observer = undefined;
    restoreApplied();
});

defineStyle(styles);

const DefaultsProvider = defineHtml(`<slot ref="slotEl" @slotchange=${queueApplyDefaults}></slot>`);

const toKebab = (value: string): string => value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

export { DefaultsProvider };
