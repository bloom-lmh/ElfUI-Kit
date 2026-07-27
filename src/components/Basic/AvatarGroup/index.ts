import {
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  onUnmounted,
  useClickOutside,
  useComputed,
  useEscapeKey,
  useHost,
  useRef,
  useEffect
} from "@elfui/core";

import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";
import type { AvatarGroupEffect, AvatarGroupPlacement, AvatarGroupProps, AvatarGroupSlots } from "./types";

export type { AvatarGroupEffect, AvatarGroupPlacement, AvatarGroupProps, AvatarGroupSlots } from "./types";

interface ManagedAvatarState {
    hidden: HTMLElement["hidden"];
    ariaHidden: string | null;
    size: string | null;
    shape: string | null;
}

const AVATAR_SELECTOR = "elf-avatar";

const props = defineProps<AvatarGroupProps>({
    size: { type: String, default: "" },
    shape: { type: String, default: "" },
    collapseAvatars: { type: Boolean, default: false },
    collapseAvatarsTooltip: { type: Boolean, default: false },
    maxCollapseAvatars: { type: Number, default: 3 },
    effect: { type: String, default: "light" },
    placement: { type: String, default: "top" },
    popperClass: { type: String, default: "" },
    popperStyle: { type: Object, default: () => ({}) },
    collapseClass: { type: String, default: "" },
    collapseStyle: { type: Object, default: () => ({}) },
});

const locale = useLocaleProvider();
const host = useHost();
const collapsedCount = useRef(0);
const hiddenLabels = useRef<string[]>([]);
const expanded = useRef(false);
const states = new WeakMap<HTMLElement, ManagedAvatarState>();
let observer: MutationObserver | undefined;

const avatars = (): HTMLElement[] =>
    Array.from(host.children).filter((child): child is HTMLElement => child.matches(AVATAR_SELECTOR));

const maxVisible = (): number => Math.max(0, Math.floor(Number(props.maxCollapseAvatars) || 0));

const shouldCollapse = (): boolean => Boolean(props.collapseAvatars);

const normalizeEffect = (): AvatarGroupEffect => (props.effect === "dark" ? "dark" : "light");

const normalizePlacement = (): AvatarGroupPlacement => (props.placement === "bottom" ? "bottom" : "top");

const toStyle = (value: unknown): Record<string, string> => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(
        Object.entries(value as Record<string, string | number>).map(([key, item]) => [key, String(item)]),
    );
};

const capture = (avatar: HTMLElement): ManagedAvatarState => {
    const existing = states.get(avatar);
    if (existing) return existing;
    const state = {
        hidden: avatar.hidden,
        ariaHidden: avatar.getAttribute("aria-hidden"),
        size: avatar.getAttribute("size"),
        shape: avatar.getAttribute("shape"),
    };
    states.set(avatar, state);
    return state;
};

const restore = (avatar: HTMLElement, state = states.get(avatar)): void => {
    if (!state) return;
    avatar.hidden = state.hidden;
    if (state.ariaHidden === null) avatar.removeAttribute("aria-hidden");
    else avatar.setAttribute("aria-hidden", state.ariaHidden);
    if (state.size === null) avatar.removeAttribute("size");
    else avatar.setAttribute("size", state.size);
    if (state.shape === null) avatar.removeAttribute("shape");
    else avatar.setAttribute("shape", state.shape);
};

const setAttributeIfChanged = (avatar: HTMLElement, name: string, value: string | null): void => {
    if (value === null) {
        if (avatar.hasAttribute(name)) avatar.removeAttribute(name);
    } else if (avatar.getAttribute(name) !== value) {
        avatar.setAttribute(name, value);
    }
};

const applyGroupAppearance = (avatar: HTMLElement, state: ManagedAvatarState): void => {
    setAttributeIfChanged(avatar, "size", state.size === null && props.size ? props.size : state.size);
    setAttributeIfChanged(avatar, "shape", state.shape === null && props.shape ? props.shape : state.shape);
};

const avatarLabel = (avatar: HTMLElement, index: number): string =>
    avatar.getAttribute("alt") || avatar.getAttribute("aria-label") || `Avatar ${index + 1}`;

const sync = (): void => {
    const children = avatars();
    const limit = maxVisible();
    const collapse = shouldCollapse();
    const labels: string[] = [];

    children.forEach((avatar, index) => {
        const state = capture(avatar);
        applyGroupAppearance(avatar, state);
        const hidden = collapse && index >= limit;
        avatar.hidden = hidden ? true : state.hidden;
        setAttributeIfChanged(avatar, "aria-hidden", hidden ? "true" : state.ariaHidden);
        if (hidden) labels.push(avatarLabel(avatar, index));
    });

    collapsedCount.set(labels.length);
    hiddenLabels.set(labels);
    if (labels.length === 0) expanded.set(false);
};

const onSlotChange = (): void => sync();

const toggle = (): void => {
    if (collapsedCount.value > 0 && props.collapseAvatarsTooltip) expanded.set(!expanded.value);
};

const hidePopover = (): void => expanded.set(false);

const collapseLabel = useComputed(() => {
    const count = collapsedCount.value;
    return count ? locale.t("a11y.additionalAvatars", { count }) : "";
});

const showCollapse = useComputed(() => collapsedCount.value > 0);
const showPopover = useComputed(() => expanded.value && props.collapseAvatarsTooltip && collapsedCount.value > 0);
const collapsedText = (): string => String(collapsedCount.value);
const popoverText = (): string => hiddenLabels.value.join(", ");
const popoverClass = useComputed(() => [
    "popover",
    `is-${normalizePlacement()}`,
    `is-${normalizeEffect()}`,
    props.popperClass,
]);

useClickOutside(host, hidePopover);
useEscapeKey(hidePopover);

useEffect(() => {
    props.collapseAvatars;
    props.maxCollapseAvatars;
    props.size;
    props.shape;
    sync();
});

onMounted(() => {
    sync();
    observer = new MutationObserver(sync);
    observer.observe(host, { childList: true, subtree: false });
});

onUnmounted(() => {
    observer?.disconnect();
    avatars().forEach((avatar) => restore(avatar));
});

defineStyle(styles);

const AvatarGroup = defineHtml<AvatarGroupProps, Record<string, never>, AvatarGroupSlots>(`
    <div class="avatar-group" part="group">
        <slot @slotchange=${onSlotChange}></slot>
        <button
            v-if=${showCollapse}
            class="collapse"
            :class=${props.collapseClass}
            :style=${toStyle(props.collapseStyle)}
            type="button"
            part="collapse"
            :title=${props.collapseAvatarsTooltip ? collapseLabel : null}
            :aria-label=${collapseLabel}
            :aria-expanded=${showPopover ? "true" : "false"}
            @click=${toggle}
        >
            +${collapsedText()}
        </button>
        <div
            v-if=${showPopover}
            :class=${popoverClass}
            :style=${toStyle(props.popperStyle)}
            part="popover"
            role="tooltip"
        >
            ${popoverText()}
        </div>
    </div>
`);

export { AvatarGroup };
