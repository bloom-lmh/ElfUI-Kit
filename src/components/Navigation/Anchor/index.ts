import {
  defineEmits,
  defineExpose,
  defineProps,
  defineStyle,
  onMounted,
  onUnmounted,
  useEffect,
  useEventListener,
  useHost,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useRef,
  defineHtml,
} from "@elfui/core";

import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";
import type {
  AnchorChangeDetail,
  AnchorClickDetail,
  AnchorFieldNames,
  AnchorItem,
  AnchorProps,
  AnchorSlots,
} from "./types";

export type {
  AnchorChangeDetail,
  AnchorClickDetail,
  AnchorFieldNames,
  AnchorItem,
  AnchorLinkProps,
  AnchorLinkSlots,
  AnchorProps,
  AnchorSlots,
} from "./types";

type RawItem = Record<string, unknown>;

interface AnchorViewItem {
  raw: AnchorItem;
  title: string;
  href: string;
  disabled: boolean;
  level: number;
  children: AnchorViewItem[];
}

type ScrollContainer = Window | HTMLElement;

interface AnchorLinkElement extends HTMLElement {
  href?: string;
  active?: boolean;
  level?: number;
  direction?: "vertical" | "horizontal";
}

const props = defineProps<AnchorProps>({
  items: { type: Array, default: () => [] },
  modelValue: { type: String, default: "" },
  defaultActive: { type: String, default: "" },
  container: { type: null, default: "" },
  offset: { type: Number, default: 0 },
  bound: { type: Number, default: undefined },
  bounds: { type: Number, default: 15 },
  duration: { type: Number, default: 300 },
  marker: { type: Boolean, default: true },
  type: { type: String, default: "default" },
  direction: { type: String, default: "vertical" },
  selectScrollTop: { type: Boolean, default: false },
  smooth: { type: Boolean, default: true },
  props: {
    type: Object,
    default: () => ({
      title: "title",
      href: "href",
      disabled: "disabled",
      children: "children",
    }),
  },
});

const locale = useLocaleProvider();

const emit = defineEmits<{
  "update:modelValue": [href: string];
  change: [detail: AnchorChangeDetail];
  click: [detail: AnchorClickDetail];
}>();

const host = useHost();

const activeHref = useRef("");

const mounted = useRef(false);
const hasLinkChildren = useRef(false);

let scrollTarget: ScrollContainer | null = null;

let cleanup = (): void => {};

const fieldNames = (): Required<AnchorFieldNames> => {
  const field = (props.props || {}) as AnchorFieldNames;
  return {
    title: field.title || "title",
    href: field.href || "href",
    disabled: field.disabled || "disabled",
    children: field.children || "children",
  };
};

const normalizeItems = (source: unknown, level = 0): AnchorViewItem[] => {
  if (!Array.isArray(source)) return [];
  const field = fieldNames();
  return source.map((raw, index) => {
    const item = (raw || {}) as RawItem;
    const href = String(item[field.href] ?? "");
    const title = String(item[field.title] ?? (href || index + 1));
    const children = normalizeItems(item[field.children], level + 1);
    return {
      raw: item as AnchorItem,
      title,
      href,
      disabled: Boolean(item[field.disabled]) || !href,
      level,
      children,
    };
  });
};

const items = (): AnchorViewItem[] => normalizeItems(props.items);

const flatten = (source = items()): AnchorViewItem[] => {
  const out: AnchorViewItem[] = [];
  for (const item of source) {
    out.push(item);
    out.push(...flatten(item.children));
  }
  return out;
};

const linkChildren = (): AnchorLinkElement[] =>
  Array.from(host.querySelectorAll("elf-anchor-link")) as AnchorLinkElement[];

const linkLevel = (child: AnchorLinkElement): number => {
  let level = 0;
  let parent = child.parentElement;
  while (parent && parent !== host) {
    if (parent.tagName.toLowerCase() === "elf-anchor-link") level += 1;
    parent = parent.parentElement;
  }
  return level;
};

const compositionalItems = (): AnchorViewItem[] =>
  linkChildren().map((child) => ({
    raw: { title: child.title || child.textContent?.trim() || child.href || "", href: child.href || "" },
    title: child.title || child.textContent?.trim() || child.href || "",
    href: child.href || "",
    disabled: !child.href,
    level: linkLevel(child),
    children: [],
  }));

const flatItems = (): AnchorViewItem[] => (hasLinkChildren.value ? compositionalItems() : flatten());
const renderedDataItems = (): AnchorViewItem[] => (hasLinkChildren.value ? [] : flatten());

const firstEnabledHref = (): string => flatItems().find((item) => !item.disabled)?.href || "";

useEffect(() => {
  const controlled = String(props.modelValue || "");
  if (controlled) {
    activeHref.set(controlled);
    return;
  }
  const current = activeHref.peek();
  if (!current) activeHref.set(String(props.defaultActive || firstEnabledHref()));
});

const currentHref = (): string =>
  String(props.modelValue || activeHref.value || props.defaultActive || firstEnabledHref());

const numberProp = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const boundValue = (): number => {
  const bound = numberProp(props.bound, Number.NaN);
  return Number.isFinite(bound) ? bound : numberProp(props.bounds, 15);
};

const direction = (): "vertical" | "horizontal" => (props.direction === "horizontal" ? "horizontal" : "vertical");

const type = (): "default" | "underline" => (props.type === "underline" ? "underline" : "default");

const isScrollContainer = (value: unknown): value is ScrollContainer =>
  typeof value === "object" && value !== null && "addEventListener" in value;

const getContainer = (): ScrollContainer => {
  if (typeof window === "undefined") return document.documentElement;
  const target = props.container;
  const root = host.getRootNode() as Document | ShadowRoot;
  if (typeof target === "string" && target) {
    return (
      (root.querySelector(target) as HTMLElement | null) ||
      (document.querySelector(target) as HTMLElement | null) ||
      window
    );
  }
  if (typeof target === "function") {
    const resolved = (target as () => ScrollContainer | null)();
    return resolved || window;
  }
  if (isScrollContainer(target)) return target;
  return window;
};

const findTarget = (href: string): HTMLElement | null => {
  if (!href || typeof document === "undefined") return null;
  const root = host.getRootNode() as Document | ShadowRoot;
  try {
    return (root.querySelector(href) as HTMLElement | null) || (document.querySelector(href) as HTMLElement | null);
  } catch {
    return null;
  }
};

const usesHorizontalContentAxis = (container: ScrollContainer): boolean => {
  if (container === window) return false;
  const element = container as HTMLElement;
  return direction() === "horizontal" && element.scrollWidth > element.clientWidth + 1;
};

const getScrollOffset = (container: ScrollContainer): number =>
  container === window
    ? window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
    : usesHorizontalContentAxis(container)
      ? (container as HTMLElement).scrollLeft
      : (container as HTMLElement).scrollTop;

const getElementOffset = (element: HTMLElement, container: ScrollContainer): number => {
  const rect = element.getBoundingClientRect();
  if (container === window) return getScrollOffset(container) + rect.top;
  const parent = container as HTMLElement;
  const parentRect = parent.getBoundingClientRect();
  return usesHorizontalContentAxis(container)
    ? parent.scrollLeft + rect.left - parentRect.left
    : parent.scrollTop + rect.top - parentRect.top;
};

const setActive = (href: string): void => {
  if (!href || href === activeHref.peek()) return;
  const oldHref = activeHref.peek();
  activeHref.set(href);
  emit("update:modelValue", href);
  const detail: AnchorChangeDetail = { href, oldHref };
  emit("change", detail);
  queueMicrotask(() => ensureHorizontalItemVisible(href));
};

const ensureHorizontalItemVisible = (href: string): void => {
  if (direction() !== "horizontal" || !href) return;
  const list = host.shadowRoot?.querySelector<HTMLElement>(".list");
  const item = Array.from(host.shadowRoot?.querySelectorAll<HTMLElement>(".item") || []).find(
    (candidate) => candidate.dataset.href === href,
  );
  if (!list || !item || list.clientWidth <= 0) return;

  const viewportStart = list.scrollLeft;
  const viewportEnd = viewportStart + list.clientWidth;
  const itemStart = item.offsetLeft;
  const itemEnd = itemStart + item.offsetWidth;
  let next = viewportStart;
  if (itemStart < viewportStart) next = itemStart;
  else if (itemEnd > viewportEnd) next = itemEnd - list.clientWidth;
  if (next === viewportStart) return;

  if (typeof list.scrollTo === "function") {
    list.scrollTo({ left: Math.max(0, next), behavior: props.smooth ? "smooth" : "auto" });
  } else {
    list.scrollLeft = Math.max(0, next);
  }
};

const scrollHorizontal = (directionValue: -1 | 1): void => {
  const list = host.shadowRoot?.querySelector<HTMLElement>(".list");
  if (!list || direction() !== "horizontal") return;
  const distance = Math.max(160, list.clientWidth * 0.75) * directionValue;
  const maximum = Math.max(0, list.scrollWidth - list.clientWidth);
  const next = Math.max(0, Math.min(maximum, list.scrollLeft + distance));
  if (props.smooth && typeof list.scrollTo === "function") {
    list.scrollTo({ left: next, behavior: "smooth" });
  } else {
    // Assigning scrollLeft is deterministic in browsers and test DOMs; native
    // scrollBy is missing or a no-op in several Custom Element environments.
    list.scrollLeft = next;
  }
};

const onHorizontalWheel = (event: WheelEvent): void => {
  if (direction() !== "horizontal" || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
  const list = event.currentTarget as HTMLElement;
  if (list.scrollWidth <= list.clientWidth) return;
  event.preventDefault();
  list.scrollLeft += event.deltaY;
};

const updateActive = (): void => {
  if (!mounted.peek()) return;
  const target = scrollTarget || getContainer();
  const scrollOffset = getScrollOffset(target) + numberProp(props.offset) + boundValue();
  let next = "";
  if (props.selectScrollTop && getScrollOffset(target) <= 0) {
    setActive(firstEnabledHref());
    return;
  }
  for (const item of flatItems()) {
    if (item.disabled) continue;
    const element = findTarget(item.href);
    if (!element) continue;
    if (getElementOffset(element, target) <= scrollOffset) next = item.href;
  }
  if (!next) next = firstEnabledHref();
  setActive(next);
};

const connect = (): void => {
  if (typeof window === "undefined") return;
  cleanup();
  const target = getContainer();
  scrollTarget = target;
  target.addEventListener("scroll", updateActive, { passive: true });
  window.addEventListener("resize", updateActive);
  cleanup = () => {
    target.removeEventListener("scroll", updateActive);
    window.removeEventListener("resize", updateActive);
  };
  updateActive();
};

const scrollContainerTo = (container: ScrollContainer, position: number): void => {
  const behavior = props.smooth && numberProp(props.duration, 300) > 0 ? "smooth" : "auto";
  if (container === window) {
    window.scrollTo({ top: position, behavior });
    return;
  }
  const element = container as HTMLElement & {
    scrollTo?: (options: ScrollToOptions) => void;
  };
  if (typeof element.scrollTo === "function") {
    element.scrollTo(usesHorizontalContentAxis(container) ? { left: position, behavior } : { top: position, behavior });
  } else if (usesHorizontalContentAxis(container)) {
    element.scrollLeft = position;
  } else {
    element.scrollTop = position;
  }
};

const scrollTo = (href: string): void => {
  const element = findTarget(href);
  if (!element) return;
  const target = scrollTarget || getContainer();
  const position = Math.max(0, getElementOffset(element, target) - numberProp(props.offset));
  scrollContainerTo(target, position);
};

const onItemClick = (item: AnchorViewItem, event: Event): void => {
  event.preventDefault();
  event.stopPropagation();
  if (item.disabled) return;
  const detail: AnchorClickDetail = { href: item.href, item: item.raw, event };
  emit("click", detail);
  setActive(item.href);
  scrollTo(item.href);
};

const onLinksSlotChange = (): void => syncLinkChildren();

const syncLinkChildren = (): void => {
  const children = linkChildren();
  hasLinkChildren.set(children.length > 0);
  const current = currentHref();
  children.forEach((child) => {
    child.active = child.href === current;
    child.level = linkLevel(child);
    child.direction = direction();
  });
};

useEventListener(host, "elf-anchor-link-click", (event) => {
  event.stopPropagation();
  const customEvent = event as CustomEvent<{ href: string; event: MouseEvent }>;
  const child = customEvent.target as AnchorLinkElement;
  const item: AnchorViewItem = {
    raw: { title: child.title || child.textContent?.trim() || customEvent.detail.href, href: customEvent.detail.href },
    title: child.title || child.textContent?.trim() || customEvent.detail.href,
    href: customEvent.detail.href,
    disabled: false,
    level: child.level || 0,
    children: [],
  };
  onItemClick(item, customEvent.detail.event);
});

useEffect(() => {
  void activeHref.value;
  void props.modelValue;
  void props.direction;
  syncLinkChildren();
  queueMicrotask(() => ensureHorizontalItemVisible(currentHref()));
});

useEffect(() => {
  void props.container;
  if (mounted.peek()) queueMicrotask(connect);
});

useEffect(() => {
  void props.offset;
  void props.bound;
  void props.bounds;
  void props.selectScrollTop;
  if (mounted.peek()) updateActive();
});

const renderLevelStyle = (item: AnchorViewItem): Record<string, string> => ({
  "--anchor-level": String(item.level),
});

onMounted(() => {
  if (typeof window === "undefined") return;
  mounted.set(true);
  syncLinkChildren();
  connect();
});

onUnmounted(() => {
  mounted.set(false);
  cleanup();
});

useHostAttr("active", currentHref);
useHostCssVar("--anchor-offset", () => `${numberProp(props.offset)}px`);
useHostFlag("data-mounted", () => mounted.value);

const rootClass = (): Record<string, boolean> => ({
  [`is-${direction()}`]: true,
  [`is-${type()}`]: true,
  "is-marker-hidden": !props.marker,
});

// HTMLElement already owns `scrollTo`; exposing the same name would overwrite the
// native method and trigger the runtime's host-collision warning.
defineExpose({ scrollToAnchor: scrollTo });

defineStyle(styles);

const Anchor = defineHtml<AnchorProps, Record<string, never>, AnchorSlots>(`
  <nav :class=${["anchor", rootClass()]} :aria-label=${locale.t("a11y.anchorNavigation")}>
    <div v-if=${props.marker} class="track" aria-hidden="true"></div>
    <button
      v-if=${direction() === "horizontal"}
      type="button"
      class="scroll-control is-previous"
      :aria-label=${locale.t("common.previous")}
      @click=${() => scrollHorizontal(-1)}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m10 3.5-4.5 4.5 4.5 4.5"></path></svg>
    </button>
    <ul class="list" @wheel=${onHorizontalWheel}>
      <slot @slotchange=${onLinksSlotChange}></slot>
      <template v-for="item in renderedDataItems()" :key="item.href || item.title">
        <li
          :class="[
            'item',
            { 'is-active': item.href === currentHref(), 'is-disabled': item.disabled }
          ]"
          :style="renderLevelStyle(item)"
          :data-href="item.href"
        >
          <a
            class="link"
            :href="item.href || '#'"
            :aria-current="item.href === currentHref() ? 'true' : null"
            @click="onItemClick(item, $event)"
          >
            {{ item.title }}
          </a>
        </li>
      </template>
    </ul>
    <button
      v-if=${direction() === "horizontal"}
      type="button"
      class="scroll-control is-next"
      :aria-label=${locale.t("common.next")}
      @click=${() => scrollHorizontal(1)}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5"></path></svg>
    </button>
  </nav>
`);

export { Anchor };
