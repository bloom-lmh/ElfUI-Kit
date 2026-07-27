// elf-steps — 步骤条

import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  useComputed,
  useEventListener,
  useHost,
  useHostAttr,
  useHostFlag,
  useEffect,
  useRef,
  useResizeObserver
} from "@elfui/core";

import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";
import type { StepItem, StepStatus, StepsChangeDetail, StepsDirection, StepsProps, StepsSize, StepsSlots } from "./types";

export type {
    StepItem,
    StepProps,
    StepSlots,
    StepStatus,
    StepsChangeDetail,
    StepsDirection,
    StepsExpose,
    StepsProps,
    StepsSize,
    StepsSlots,
} from "./types";

interface StepViewItem extends StepItem {
    key: string;
    title: string;
    description: string;
    icon: string;
    status: "wait" | "process" | "finish" | "error";
    index: number;
    isLast: boolean;
    isActive: boolean;
    isClickable: boolean;
}

interface StepElement extends HTMLElement {
    description?: string;
    icon?: string;
    status?: StepStatus | "";
    disabled?: boolean;
    value?: string | number;
    stepIndex?: number;
    resolvedStatus?: StepStatus;
    active?: boolean;
    last?: boolean;
    clickable?: boolean;
    direction?: StepsDirection;
    size?: StepsSize;
    simple?: boolean;
    alignCenter?: boolean;
    alternativeLabel?: boolean;
    focusButton?: () => void;
}

interface StepNavigateDetail {
    index: number;
    key: string;
}

const props = defineProps<StepsProps>({
    active: { type: Number, default: 0 },
    direction: { type: String, default: "horizontal" },
    items: { type: Array, default: () => [] as StepItem[] },
    space: { type: [String, Number], default: "" },
    processStatus: { type: String, default: "process" },
    finishStatus: { type: String, default: "finish" },
    alignCenter: { type: Boolean, default: false },
    simple: { type: Boolean, default: false },
    size: { type: String, default: "md" },
    clickable: { type: Boolean, default: true },
    alternativeLabel: { type: Boolean, default: false },
    altLabels: { type: Boolean, default: false },
    editable: { type: Boolean, default: false },
    linear: { type: Boolean, default: true },
    showPanels: { type: Boolean, default: false },
    hideActions: { type: Boolean, default: false },
    previousText: { type: String, default: "" },
    nextText: { type: String, default: "" },
});

const emit = defineEmits<{
    "update:active": [active: number];
    change: [detail: StepsChangeDetail];
}>();

const host = useHost();
const locale = useLocaleProvider();
const compact = useRef(false);
const currentActive = useRef(0);
const hasStepChildren = useRef(false);
let lastControlledActive = Number.NaN;

const stepChildren = (): StepElement[] =>
    Array.from(host.children).filter(
        (child): child is StepElement => child.tagName.toLowerCase() === "elf-step",
    );

const childItems = (): StepItem[] =>
    stepChildren().map((child, index) => ({
        title: child.title || `Step ${index + 1}`,
        description: child.description || "",
        icon: child.icon || "",
        ...(child.status ? { status: child.status } : {}),
        disabled: Boolean(child.disabled),
        value: child.value ?? index,
    }));

const rawItems = (): StepItem[] =>
    hasStepChildren.value ? childItems() : Array.isArray(props.items) ? (props.items as StepItem[]) : [];
const count = (): number => rawItems().length;
const normalizeActive = (value: unknown): number => {
    const max = Math.max(0, count() - 1);
    const next = Math.trunc(Number(value) || 0);
    return Math.min(max, Math.max(0, next));
};
const clampedActive = (): number => normalizeActive(currentActive.value);
const direction = (): StepsDirection => (props.direction === "vertical" ? "vertical" : "horizontal");
const size = (): StepsSize => (props.size === "sm" || props.size === "lg" ? props.size : "md");
const normalizeStatus = (value: unknown, fallback: StepViewItem["status"]): StepViewItem["status"] =>
    value === "wait" || value === "process" || value === "finish" || value === "error" ? value : fallback;
const finishStatus = (): StepViewItem["status"] => normalizeStatus(props.finishStatus, "finish");
const processStatus = (): StepViewItem["status"] => normalizeStatus(props.processStatus, "process");
const normalizeSpace = (): string => {
    if (props.space === undefined || props.space === null || props.space === "") return "";
    if (typeof props.space === "number") return `${Math.max(0, props.space)}px`;
    const value = String(props.space).trim();
    return value ? value : "";
};

const inferStatus = (item: StepItem, index: number): StepViewItem["status"] => {
    if (item.status === "error" || item.status === "finish" || item.status === "process") {
        return item.status;
    }
    if (item.status === "wait") return "wait";
    const active = clampedActive();
    if (index < active) return finishStatus();
    if (index === active) return processStatus();
    return "wait";
};

const adjacentEnabledIndex = (from: number, directionValue: -1 | 1): number => {
    const source = rawItems();
    for (let index = from + directionValue; index >= 0 && index < source.length; index += directionValue) {
        if (!source[index]?.disabled) return index;
    }
    return from;
};

const canSelectIndex = (index: number, active: number): boolean => {
    const item = rawItems()[index];
    if (!item || item.disabled || index === active) return false;
    if (props.editable || !props.linear) return true;
    if (!props.clickable) return false;
    return index < active || index === adjacentEnabledIndex(active, 1);
};

const syncStepChildren = (): void => {
    const children = stepChildren();
    hasStepChildren.set(children.length > 0);
    if (children.length === 0) return;

    const items = childItems();
    const active = normalizeActive(currentActive.value);
    children.forEach((child, index) => {
        child.stepIndex = index;
        child.resolvedStatus = inferStatus(items[index]!, index);
        child.active = index === active;
        child.last = index === children.length - 1;
        // Keep the active composed step keyboard-enabled so Arrow/Home/End can
        // move focus and selection. The parent still gates actual selection
        // through canSelectIndex, so linear and disabled semantics remain intact.
        child.clickable = !child.disabled && Boolean(props.clickable || props.editable || !props.linear);
        child.direction = direction();
        child.size = size();
        child.simple = Boolean(props.simple);
        child.alignCenter = Boolean(props.alignCenter);
        child.alternativeLabel = Boolean(props.alternativeLabel) || Boolean(props.altLabels);
    });
};

const stepItems = useComputed<StepViewItem[]>(() => {
    const raw = rawItems();
    const active = clampedActive();
    return raw.map((item, index) => {
        const status = inferStatus(item, index);
        const stableKey = String(item.value ?? `${item.title}-${index}`);
        return {
            ...item,
            // Status is part of the key because the current compiler keeps keyed loop bindings stable.
            // Recreating only changed steps guarantees aria/class/icon state follows active immediately.
            key: `${stableKey}:${status}:${index === active ? "active" : "idle"}`,
            title: item.title || `Step ${index + 1}`,
            description: item.description || "",
            icon: item.icon || "",
            status,
            index,
            isLast: index === raw.length - 1,
            isActive: index === active,
            isClickable: canSelectIndex(index, active),
        };
    });
});

const rootClass = useComputed((): string => {
    const classes = ["steps", `is-${direction()}`, `size-${size()}`];
    if (compact.value) classes.push("is-compact");
    if (props.alternativeLabel || props.altLabels) classes.push("is-alternative");
    if (props.alignCenter) classes.push("is-align-center");
    if (props.simple) classes.push("is-simple");
    if (props.linear) classes.push("is-linear");
    if (normalizeSpace()) classes.push("has-space");
    if (hasStepChildren.value) classes.push("has-step-children");
    return classes.join(" ");
});

const rootStyle = useComputed((): Record<string, string> => {
    const space = normalizeSpace();
    return space ? { "--step-space": space } : {};
});

const stepItemClass = (item: StepViewItem): string => {
    const classes = ["step-item", `is-${item.status}`];
    if (item.isActive) classes.push("is-active");
    if (item.isClickable) classes.push("is-clickable");
    if (item.disabled) classes.push("is-disabled");
    return classes.join(" ");
};

const progressStyle = (item: StepViewItem): Record<string, string> => {
    if (item.isLast) return {};
    return { "--step-tail-progress": item.status === "finish" ? "100%" : "0%" };
};

const setActive = (index: number): void => {
    const items = rawItems();
    if (items.length === 0) return;
    const next = Math.min(items.length - 1, Math.max(0, Math.trunc(index)));
    const item = items[next]!;
    if (item.disabled || next === clampedActive()) return;
    currentActive.set(next);
    emit("update:active", next);
    emit("change", { active: next, item });
};

const next = (): void => setActive(adjacentEnabledIndex(clampedActive(), 1));
const prev = (): void => setActive(adjacentEnabledIndex(clampedActive(), -1));
const activeItem = (): StepItem | undefined => rawItems()[clampedActive()];
const previousText = (): string => String(props.previousText || locale.t("common.previous"));
const nextText = (): string => String(props.nextText || locale.t("common.next"));

const onStepClick = (item: StepViewItem): void => {
    if (!item.isClickable) return;
    setActive(item.index);
};

const focusStep = (index: number): void => {
    queueMicrotask(() => stepChildren()[index]?.focusButton?.());
};

const navigateStep = (detail: StepNavigateDetail): void => {
    const children = stepChildren();
    if (children.length === 0) return;
    const enabled = children
        .map((child, index) => ({ child, index }))
        .filter(({ child }) => !child.disabled)
        .map(({ index }) => index);
    if (enabled.length === 0) return;

    const currentPosition = Math.max(0, enabled.indexOf(detail.index));
    let nextPosition = currentPosition;
    if (detail.key === "Home") nextPosition = 0;
    else if (detail.key === "End") nextPosition = enabled.length - 1;
    else if (detail.key === "ArrowRight" || detail.key === "ArrowDown") {
        nextPosition = Math.min(enabled.length - 1, currentPosition + 1);
    } else if (detail.key === "ArrowLeft" || detail.key === "ArrowUp") {
        nextPosition = Math.max(0, currentPosition - 1);
    }

    const nextIndex = enabled[nextPosition]!;
    if (canSelectIndex(nextIndex, clampedActive())) {
        setActive(nextIndex);
        focusStep(nextIndex);
    }
};

const onStepsSlotChange = (): void => syncStepChildren();

const statusIcon = (item: StepViewItem): string => {
    if (item.icon) return item.icon;
    return String(item.index + 1);
};
const showFinishIcon = (item: StepViewItem): boolean => !item.icon && item.status === "finish";
const showErrorIcon = (item: StepViewItem): boolean => !item.icon && item.status === "error";

useResizeObserver(host, ({ width }) => {
    compact.set(width > 0 && width < 420);
});
useEffect(() => {
    const controlled = normalizeActive(props.active);
    if (controlled === lastControlledActive) return;
    lastControlledActive = controlled;
    currentActive.set(controlled);
});
useEffect(() => {
    void currentActive.value;
    void props.clickable;
    void props.direction;
    void props.size;
    void props.simple;
    void props.alignCenter;
    void props.alternativeLabel;
    void props.altLabels;
    void props.editable;
    void props.linear;
    void props.processStatus;
    void props.finishStatus;
    syncStepChildren();
});
useEventListener(host, "elf-step-select", (event) => {
    event.stopPropagation();
    const child = event.target as StepElement;
    const index = stepChildren().indexOf(child);
    if (index >= 0 && canSelectIndex(index, clampedActive())) setActive(index);
});
useEventListener(host, "elf-step-navigate", (event) => {
    event.stopPropagation();
    navigateStep((event as CustomEvent<StepNavigateDetail>).detail);
});
onMounted(syncStepChildren);
useHostAttr("direction", direction);
useHostAttr("size", size);
useHostFlag("data-compact", () => compact.value);

defineExpose({
    get activeIndex() {
        return currentActive.peek();
    },
    next,
    prev,
    setActive,
});
defineStyle(styles);

const Steps = defineHtml<StepsProps, Record<string, never>, StepsSlots>(`
  <div :class=${["stepper", { "has-panels": props.showPanels }]}>
    <div :class=${rootClass} :style=${rootStyle} role="list" :aria-orientation=${direction()}>
        <slot v-if=${hasStepChildren} @slotchange=${onStepsSlotChange}></slot>
        <template v-if=${!hasStepChildren}>
            <div
                v-for="item in stepItems"
                :key="item.key"
                :class="stepItemClass(item)"
                :style="progressStyle(item)"
                role="listitem"
            >
                <button
                    class="step-button"
                    type="button"
                    :disabled="item.disabled"
                    :tabindex="item.isActive ? 0 : -1"
                    :aria-current="item.isActive ? 'step' : null"
                    :aria-disabled="item.disabled ? 'true' : null"
                    @click="onStepClick(item)"
                >
                    <span class="step-head">
                        <span class="step-icon" aria-hidden="true">
                          <svg v-if="showFinishIcon(item)" viewBox="0 0 18 18"><path d="m4 9.25 3.1 3.1L14 5.75"></path></svg>
                          <svg v-else-if="showErrorIcon(item)" viewBox="0 0 18 18"><path d="M9 4.5v5.25M9 13.25v.25"></path></svg>
                          <span v-else>{{ statusIcon(item) }}</span>
                        </span>
                    </span>
                    <span class="step-main">
                        <span class="step-title">{{ item.title }}</span>
                        <span class="step-description" v-if="item.description">{{ item.description }}</span>
                    </span>
                </button>
                <span class="step-tail" v-if="!item.isLast" aria-hidden="true">
                    <span class="step-tail-track"></span>
                    <span class="step-tail-progress"></span>
                </span>
            </div>
        </template>
    </div>
    <section v-if=${props.showPanels} class="stepper-panel" role="region" aria-live="polite">
      <slot name="panel">
        <h3>${activeItem()?.title || ''}</h3>
        <p>${activeItem()?.content || activeItem()?.description || ''}</p>
      </slot>
    </section>
    <footer v-if=${props.showPanels && !props.hideActions} class="stepper-actions">
      <button type="button" class="stepper-action is-previous" :disabled=${clampedActive() <= 0} @click=${prev}>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m10 3.5-4.5 4.5 4.5 4.5"></path></svg>
        <span>${previousText()}</span>
      </button>
      <button type="button" class="stepper-action is-next" :disabled=${clampedActive() >= count() - 1} @click=${next}>
        <span>${nextText()}</span>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5"></path></svg>
      </button>
    </footer>
  </div>
`);

export { Steps };
