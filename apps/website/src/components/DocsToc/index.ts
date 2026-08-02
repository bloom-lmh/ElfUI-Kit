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
  useRef,
} from "@elfui/core";

import { useLocaleProvider } from "@elfui/kit-src/components/Providers/context";
import type { GoToTask } from "@elfui/kit-src/composables/goTo";
import { findScrollContainer } from "@elfui/kit-src/composables/scroll";
import { useGoTo } from "@elfui/kit-src/composables/useGoTo";
import styles from "./style.scss?inline";
import type { DocsTocEmits, DocsTocProps } from "./types";

export type { DocsTocElement, DocsTocEmits, DocsTocExpose, DocsTocProps } from "./types";

interface TocItem {
  id: string;
  label: string;
  level: number;
}

const props = defineProps<DocsTocProps>({
  routeKey: { type: String, default: "" },
  label: { type: String, default: "" },
  target: { type: String, default: "elf-main" },
  minLevel: { type: Number, default: 2 },
  maxLevel: { type: Number, default: 3 },
});

const emit = defineEmits<DocsTocEmits>();
const host = useHost();
const locale = useLocaleProvider();
const goTo = useGoTo();

const items = useRef<readonly TocItem[]>([]);
const activeId = useRef("");
let headingElements = new Map<string, HTMLElement>();
let observedRoots: Array<Document | ShadowRoot | HTMLElement> = [];
let observers: MutationObserver[] = [];
let refreshTimers: Array<ReturnType<typeof setTimeout>> = [];
let intersectionObserver: IntersectionObserver | undefined;
let frame = 0;
let removeRootClickListener = (): void => {};
let scrollContainer: HTMLElement | null = null;
let navigationTask: GoToTask | null = null;

const tocLabel = (): string =>
  props.label || (locale.name.toLowerCase().startsWith("en") ? "On this page" : "本页目录");
const tocItems = (): readonly TocItem[] => items.value;
const hasItems = (): boolean => items.value.length > 0;
const itemClass = (item: TocItem): Record<string, boolean> => ({
  item: true,
  active: activeId.value === item.id,
  [`level-${item.level}`]: true,
});
const ariaCurrent = (item: TocItem): "location" | undefined =>
  activeId.value === item.id ? "location" : undefined;

const normalizeLevel = (tagName: string): number => Number(tagName.slice(1)) || 2;
const API_SECTION_PATTERN =
  /^(?:component\s+)?(?:api|props?|events?|exposes?|methods?|slots?|属性|事件|方法|插槽)$/i;
const normalizeItemLabel = (label: string): string =>
  API_SECTION_PATTERN.test(label) ? "API" : label;
const itemLevel = (element: HTMLElement): number => {
  const explicitLevel = Number(element.dataset.docsTocLevel);
  if (explicitLevel >= 1 && explicitLevel <= 6) return explicitLevel;
  return element.tagName === "ELF-PLAYGROUND" ? 2 : normalizeLevel(element.tagName);
};
const itemLabel = (element: HTMLElement): string =>
  normalizeItemLabel(
    (element.tagName === "ELF-PLAYGROUND"
      ? element.getAttribute("title")
      : element.textContent || ""
    )
      ?.replace(/\s+/g, " ")
      .trim() || "",
  );

const navigationElement = (heading: HTMLElement): HTMLElement => {
  if (!heading.hasAttribute("data-promoted-to-playground")) return heading;
  const playground = heading.nextElementSibling;
  return playground instanceof HTMLElement && playground.tagName === "ELF-PLAYGROUND"
    ? playground
    : heading;
};

const slugify = (label: string, index: number): string => {
  const slug = label
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return `docs-${slug || "section"}-${index + 1}`;
};

const queryAcrossRoots = (
  root: Document | ShadowRoot | HTMLElement,
  selector: string,
): HTMLElement | null => {
  const direct = root.querySelector<HTMLElement>(selector);
  if (direct) return direct;

  for (const element of Array.from(root.querySelectorAll<HTMLElement>("*"))) {
    if (!element.shadowRoot || element === host) continue;
    const nested = queryAcrossRoots(element.shadowRoot, selector);
    if (nested) return nested;
  }
  return null;
};

const disconnect = (): void => {
  observedRoots.forEach((root) => root.removeEventListener("scroll", scheduleActive, true));
  observedRoots = [];
  scrollContainer?.removeEventListener("scroll", scheduleActive);
  scrollContainer = null;
  observers.forEach((observer) => observer.disconnect());
  observers = [];
  intersectionObserver?.disconnect();
  intersectionObserver = undefined;
};

const scheduleActive = (): void => {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    const ordered = Array.from(headingElements.entries());
    if (ordered.length === 0) return;

    const threshold = 112;
    let next = ordered[0]![0];
    for (const [id, element] of ordered) {
      if (element.getBoundingClientRect().top <= threshold) next = id;
      else break;
    }
    activeId.set(next);
  });
};

const collectRootsAndHeadings = (root: Document | ShadowRoot | HTMLElement): HTMLElement[] => {
  const headings: HTMLElement[] = [];
  if (!observedRoots.includes(root)) {
    observedRoots.push(root);
    root.addEventListener("scroll", scheduleActive, true);
  }

  const elements = Array.from(root.querySelectorAll<HTMLElement>("*"));
  for (const element of elements) {
    const isPlayground = element.tagName === "ELF-PLAYGROUND";
    if (isPlayground) {
      if (element.getAttribute("title")?.trim()) headings.push(element);
      continue;
    }
    const insidePlayground = Boolean(element.parentElement?.closest("elf-playground"));
    if (/^H[1-6]$/.test(element.tagName)) {
      const level = normalizeLevel(element.tagName);
      const promotedByAdjacentPlayground =
        level === 2 && element.nextElementSibling?.tagName === "ELF-PLAYGROUND";
      if (
        !insidePlayground &&
        !promotedByAdjacentPlayground &&
        level >= props.minLevel &&
        level <= props.maxLevel &&
        !element.closest("[data-docs-toc-ignore]")
      ) {
        headings.push(element);
      }
    }
    // Playground contributes its own title as a level-3 item. Its shadow tree is
    // intentionally skipped so runtime component headings cannot pollute the TOC.
    if (element.shadowRoot && element !== host && !insidePlayground) {
      headings.push(...collectRootsAndHeadings(element.shadowRoot));
    }
  }
  return headings;
};

const refresh = (): void => {
  disconnect();
  const shellRoot = host.getRootNode() as Document | ShadowRoot;
  const target =
    queryAcrossRoots(shellRoot, props.target) ||
    (host.ownerDocument && shellRoot !== host.ownerDocument
      ? queryAcrossRoots(host.ownerDocument, props.target)
      : null);
  if (!target) {
    items.set([]);
    headingElements = new Map();
    host.toggleAttribute("hidden", true);
    return;
  }

  const headings = collectRootsAndHeadings(target);
  const nextItems: TocItem[] = [];
  const nextElements = new Map<string, HTMLElement>();
  const navigationHeadings: HTMLElement[] = [];
  let hasApiItem = false;
  headings.forEach((heading, index) => {
    const label = itemLabel(heading);
    if (!label) return;
    if (label === "API") {
      if (hasApiItem) return;
      hasApiItem = true;
    }
    const targetElement = navigationElement(heading);
    const id =
      targetElement.dataset.docsTocId || heading.dataset.docsTocId || slugify(label, index);
    if (targetElement !== heading) delete heading.dataset.docsTocId;
    targetElement.dataset.docsTocId = id;
    nextItems.push({ id, label, level: itemLevel(heading) });
    nextElements.set(id, targetElement);
    navigationHeadings.push(targetElement);
  });

  items.set(nextItems);
  headingElements = nextElements;
  activeId.set(nextItems[0]?.id || "");
  host.toggleAttribute("hidden", nextItems.length === 0);

  scrollContainer = findScrollContainer(navigationHeadings[0] || target);
  scrollContainer?.addEventListener("scroll", scheduleActive, { passive: true });

  if (typeof IntersectionObserver !== "undefined") {
    intersectionObserver = new IntersectionObserver(scheduleActive, {
      root: null,
      rootMargin: "-96px 0px -70% 0px",
      threshold: [0, 1],
    });
    navigationHeadings.forEach((heading) => intersectionObserver?.observe(heading));
  }

  observedRoots.forEach((root) => {
    const observer = new MutationObserver(() => scheduleRefresh(40));
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    observers.push(observer);
  });
  scheduleActive();
};

const scheduleRefresh = (delay = 0): void => {
  const timer = setTimeout(refresh, delay);
  refreshTimers.push(timer);
};

const navigate = (id: string): void => {
  const heading = headingElements.get(id);
  if (!heading) return;
  activeId.set(id);
  const container = findScrollContainer(heading);
  navigationTask?.cancel();
  const task = goTo(heading, {
    container,
    offset: container ? 24 : 0,
  });
  navigationTask = task;
  void task.finished.then((result) => {
    if (navigationTask !== task) return;
    navigationTask = null;
    if (result.status === "completed") scheduleActive();
  });
  emit("navigate", id);
};

const onRootClick = (event: Event): void => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const button = target.closest<HTMLButtonElement>("button[data-toc-id]");
  if (button?.dataset.tocId) navigate(button.dataset.tocId);
};

useEffect(() => {
  void props.routeKey;
  scheduleRefresh();
  scheduleRefresh(60);
});

onMounted(() => {
  host.shadowRoot?.addEventListener("click", onRootClick);
  removeRootClickListener = () => host.shadowRoot?.removeEventListener("click", onRootClick);
  scheduleRefresh();
  scheduleRefresh(100);
});

onUnmounted(() => {
  navigationTask?.cancel();
  navigationTask = null;
  removeRootClickListener();
  removeRootClickListener = () => {};
  disconnect();
  refreshTimers.forEach((timer) => clearTimeout(timer));
  refreshTimers = [];
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
});

defineExpose({ refresh });
defineStyle(styles);

const DocsToc = defineHtml<DocsTocProps, DocsTocEmits>(`
  <nav class="toc" :aria-label=${tocLabel()} v-if="hasItems()">
    <strong class="label">${tocLabel()}</strong>
    <div class="items">
      <button
        v-for="item in tocItems()"
        :key="item.id"
        type="button"
        :class="itemClass(item)"
        :aria-current="ariaCurrent(item)"
        :data-toc-id="item.id"
      >{{ item.label }}</button>
    </div>
  </nav>
`);

export { DocsToc };
