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

import type { MdPageTocEntry } from "../MdPage/types";
import styles from "./style.scss?inline";
import type {
  MdOutlineElement,
  MdOutlineEmits,
  MdOutlineExpose,
  MdOutlineProps,
  MdOutlineSlots,
} from "./types";

export type {
  MdOutlineElement,
  MdOutlineEmits,
  MdOutlineExpose,
  MdOutlineProps,
  MdOutlineSlots,
} from "./types";

const props = defineProps<MdOutlineProps>({
  target: { type: String, default: "" },
  toc: { type: Array, default: () => [] },
  maxDepth: { type: Number, default: 3 },
  label: { type: String, default: "Page outline" },
  emptyText: { type: String, default: "No outline" },
});

const emit = defineEmits<MdOutlineEmits>(["select"]);
const host = useHost<MdOutlineElement>();

const entries = useRef<MdPageTocEntry[]>([]);
const activeId = useRef("");
const lastTarget = useRef("");
let targetElement: HTMLElement | null = null;
let listenersAttached = false;

const resolveTarget = (): HTMLElement | null => {
  const id = String(props.target || "");
  if (!id) return null;
  const root = host.getRootNode() as ShadowRoot | Document;
  const candidate =
    (typeof root.getElementById === "function" ? root.getElementById(id) : null) ??
    document.getElementById(id);
  return candidate instanceof HTMLElement ? candidate : null;
};

const syncFromTarget = (): void => {
  const target = resolveTarget();
  const page = target as (HTMLElement & { outline?: () => MdPageTocEntry[] }) | null;
  if (!page || typeof page.outline !== "function") return;
  const next = page.outline();
  if (JSON.stringify(next) !== JSON.stringify(entries.peek())) entries.set(next);
};

const onTargetToc = (event: Event): void => {
  entries.set((event as CustomEvent<MdPageTocEntry[]>).detail ?? []);
};

const onTargetActive = (event: Event): void => {
  activeId.set(String((event as CustomEvent<string>).detail ?? ""));
};

const attachTarget = (): void => {
  if (listenersAttached) return;
  targetElement = resolveTarget();
  if (!targetElement) return;
  targetElement.addEventListener("toc-change", onTargetToc);
  targetElement.addEventListener("active-change", onTargetActive);
  listenersAttached = true;
  syncFromTarget();
};

const detachTarget = (): void => {
  if (!listenersAttached || !targetElement) return;
  targetElement.removeEventListener("toc-change", onTargetToc);
  targetElement.removeEventListener("active-change", onTargetActive);
  listenersAttached = false;
  targetElement = null;
};

const visibleEntries = (): MdPageTocEntry[] => {
  const maxDepth = Math.max(1, Math.floor(Number(props.maxDepth) || 3));
  const source = props.toc.length > 0 ? props.toc : entries.value;
  return source.filter((entry) => Number(entry.depth) <= maxDepth);
};

const itemStyle = (entry: MdPageTocEntry): Record<string, string> => ({
  "--md-outline-depth": String(Number(entry.depth) || 1),
});

const scrollTo = (id: string): boolean => {
  const heading = resolveTarget()?.shadowRoot?.getElementById(id) ?? null;
  if (!heading) return false;
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  heading.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  return true;
};

const onEntryClick = (event: Event, entry: MdPageTocEntry): void => {
  event.preventDefault();
  if (scrollTo(entry.id)) emit("select", entry.id);
};

const active = (): string => activeId.value;

useEffect(() => {
  if (props.target !== lastTarget.peek()) {
    lastTarget.set(props.target);
    detachTarget();
    attachTarget();
  }
});

useEffect(() => {
  if (props.target) attachTarget();
});

onMounted(() => {
  attachTarget();
  return detachTarget;
});

onUnmounted(detachTarget);

defineExpose<MdOutlineExpose>({ scrollTo, active }, { overrideNative: ["scrollTo"] });
defineStyle(styles);

const MdOutline = defineHtml<MdOutlineProps, MdOutlineEmits, MdOutlineSlots>(`
  <nav class="md-outline" :aria-label=${props.label || "Page outline"}>
    <ul class="md-outline-list">
      <li
        v-for="entry in visibleEntries()"
        :key="entry.id"
        :class="['md-outline-item', { 'is-active': entry.id === activeId }]"
        :style="itemStyle(entry)"
      >
        <a
          class="md-outline-link"
          :href="'#' + entry.id"
          :aria-current="entry.id === activeId ? 'true' : null"
          @click="onEntryClick($event, entry)"
        >{{ entry.text }}</a>
      </li>
    </ul>
    <p v-if="visibleEntries().length === 0" class="md-outline-empty">{{ emptyText }}</p>
  </nav>
`);

export { MdOutline };

declare global {
  interface HTMLElementTagNameMap {
    "elf-md-outline": MdOutlineElement;
  }
}
