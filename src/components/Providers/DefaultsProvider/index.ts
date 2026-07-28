// elf-defaults-provider — 为子树批量提供组件默认 props
//
// Web Components 没有统一应用实例，因此 Provider 同时提供可注入上下文，
// 并把默认值写入 light DOM 子组件，使尚未接入 composable 的组件也能立即使用。

import {
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  provide,
  useEffect,
  useHost,
  useTemplateRef,
} from "@elfui/core";

import {
  DEFAULTS_PROVIDER_KEY,
  type DefaultsProviderContext,
  type DefaultsStrategy,
  type ProviderDefaults,
  useDefaultsProvider,
} from "../context";
import {
  mergeProviderDefaults,
  normalizeProviderDefaults,
  resolveComponentDefaults,
  toAttributeName,
} from "../defaults";
import styles from "./style.scss?inline";
import type { DefaultsProviderProps } from "./types";

export type { DefaultsProviderProps, DefaultsStrategy, ProviderDefaults } from "./types";

type LooseElement = HTMLElement & Record<string, unknown>;

interface AppliedValue {
  key: string;
  propertyValue: unknown;
  hadAttribute: boolean;
  attributeValue: string | null;
}

const props = defineProps<DefaultsProviderProps>({
  defaults: { type: Object, default: () => ({}) },
  disabled: { type: Boolean, default: false },
  deep: { type: Boolean, default: true },
  strategy: { type: String, default: "missing" },
  reset: { type: Boolean, default: false },
});

const host = useHost();
const slotRef = useTemplateRef<HTMLSlotElement>("slotEl");
const parentDefaults = useDefaultsProvider();

const appliedValues = new Map<Element, AppliedValue[]>();
const forwardedSlots = new Set<HTMLSlotElement>();
let observer: MutationObserver | undefined;
let applyQueued = false;

const readOwnDefaults = (): ProviderDefaults =>
  normalizeProviderDefaults(props.defaults as unknown);

const readDefaults = (): ProviderDefaults => {
  const own = readOwnDefaults();
  if (props.reset || !parentDefaults || parentDefaults.disabled) return own;
  return mergeProviderDefaults(parentDefaults.defaults, own);
};

const readStrategy = (): DefaultsStrategy =>
  props.strategy === "overwrite" ? "overwrite" : "missing";

const assignedElements = (): Element[] =>
  slotRef.value?.assignedElements({ flatten: true }) ?? Array.from(host.children);

const shouldSkip = (element: Element, propKey: string): boolean => {
  if (readStrategy() === "overwrite") return false;
  const attribute = toAttributeName(propKey);
  return element.hasAttribute(attribute) || element.hasAttribute(propKey);
};

const applyProp = (element: Element, propKey: string, value: unknown): void => {
  if (shouldSkip(element, propKey)) return;

  const target = element as LooseElement;
  const attribute = toAttributeName(propKey);
  const records = appliedValues.get(element) ?? [];
  records.push({
    key: propKey,
    propertyValue: target[propKey],
    hadAttribute: element.hasAttribute(attribute),
    attributeValue: element.getAttribute(attribute),
  });
  appliedValues.set(element, records);
  target[propKey] = value;

  if (typeof value === "boolean") {
    if (value) element.setAttribute(attribute, "");
    else if (readStrategy() === "overwrite") element.removeAttribute(attribute);
  } else if (typeof value === "string" || typeof value === "number") {
    element.setAttribute(attribute, String(value));
  }
};

const applyElement = (element: Element, defaults: ProviderDefaults): void => {
  const { global, component } = resolveComponentDefaults(defaults, element.tagName);
  if (!global && !component) return;

  const target = element as LooseElement;
  const applicableGlobal = Object.fromEntries(
    Object.entries(global ?? {}).filter(([key]) => key in target),
  );
  const resolved = { ...applicableGlobal, ...(component ?? {}) };

  for (const [key, value] of Object.entries(resolved)) {
    applyProp(element, key, value);
  }
};

const observeForwardedSlot = (slot: HTMLSlotElement): void => {
  if (forwardedSlots.has(slot)) return;
  forwardedSlots.add(slot);
  slot.addEventListener("slotchange", queueApplyDefaults);
};

const walk = (element: Element, defaults: ProviderDefaults): void => {
  if (element instanceof HTMLSlotElement) {
    observeForwardedSlot(element);
    for (const assigned of element.assignedElements({ flatten: true })) {
      walk(assigned, defaults);
    }
    return;
  }

  applyElement(element, defaults);
  if (!props.deep) return;
  if (element !== host && element.tagName.toLowerCase() === "elf-defaults-provider") return;

  for (const child of Array.from(element.children)) {
    walk(child, defaults);
  }
};

const restoreApplied = (): void => {
  for (const [element, records] of appliedValues) {
    const target = element as LooseElement;
    for (const record of records.reverse()) {
      const attribute = toAttributeName(record.key);
      target[record.key] = record.propertyValue;
      if (record.hadAttribute) element.setAttribute(attribute, record.attributeValue ?? "");
      else element.removeAttribute(attribute);
    }
  }
  appliedValues.clear();
};

const applyDefaults = (root?: ParentNode): void => {
  restoreApplied();
  if (props.disabled) return;

  const defaults = readDefaults();
  const roots =
    root && "children" in root
      ? Array.from(root.children)
      : assignedElements();

  for (const child of roots) {
    walk(child, defaults);
  }
};

function queueApplyDefaults(): void {
  if (applyQueued) return;
  applyQueued = true;
  queueMicrotask(() => {
    applyQueued = false;
    applyDefaults();
  });
}

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
  // 先于 slotted custom elements 完成挂载写入，避免默认反射属性被误判为用户显式输入。
  applyDefaults();
  queueMicrotask(applyDefaults);

  if (typeof MutationObserver !== "undefined") {
    observer = new MutationObserver(queueApplyDefaults);
    observer.observe(host, { childList: true, subtree: true });
  }

  return () => {
    observer?.disconnect();
    observer = undefined;
    for (const slot of forwardedSlots) {
      slot.removeEventListener("slotchange", queueApplyDefaults);
    }
    forwardedSlots.clear();
    restoreApplied();
  };
});

useEffect(() => {
  readDefaults();
  readStrategy();
  Boolean(props.disabled);
  Boolean(props.deep);
  Boolean(props.reset);
  queueApplyDefaults();
});

defineStyle(styles);

const DefaultsProvider = defineHtml(
  `<slot ref="slotEl" @slotchange=${queueApplyDefaults}></slot>`,
);

export { DefaultsProvider };
