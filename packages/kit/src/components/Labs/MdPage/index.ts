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
  useHostAttr,
  useHostCssVar,
  useRef,
} from "@elfui/core";

import { useLocaleProvider } from "../../Providers/context";
import { createMutateController } from "../../../directives/observers";
import {
  createMdPipeline,
  DEFAULT_MD_CONTAINERS,
  highlightCodeBlocks,
  MD_DENSITIES,
  MD_THEMES,
  normalizeMarkdownSource,
  parseFrontmatter,
  resolveMdPageTheme,
  rewriteRelativeUrls,
  type MdPipeline,
} from "./md";
import styles from "./style.scss?inline";
import type {
  MdPageCodeTheme,
  MdPageDensity,
  MdPageElement,
  MdPageEmits,
  MdPageExpose,
  MdPageExtend,
  MdPageProps,
  MdPageLabels,
  MdPageSlots,
  MdPageTheme,
  MdPageTocEntry,
  MdRenderResult,
} from "./types";

export type {
  MdPageCodeTheme,
  MdPageDensity,
  MdPageElement,
  MdPageEmits,
  MdPageExpose,
  MdPageExtend,
  MdPageProps,
  MdPageRenderHook,
  MdPageLabels,
  MdPageSlots,
  MdPageTheme,
  MdPageTocEntry,
  MdRenderResult,
} from "./types";

const DENSITIES: readonly MdPageDensity[] = [...MD_DENSITIES];
const THEMES: readonly MdPageTheme[] = [...MD_THEMES];
const DEFAULT_CONTAINERS: readonly string[] = [...DEFAULT_MD_CONTAINERS];
const RENDER_CACHE_LIMIT = 60;
const renderCache = new Map<string, MdRenderResult>();

const props = defineProps<MdPageProps>({
  content: { type: String, default: "" },
  src: { type: String, default: "" },
  maxWidth: { type: String, default: "760px" },
  baseHeadingLevel: { type: Number, default: 2 },
  codeTheme: { type: String, default: "auto" },
  theme: { type: String, default: "default" },
  tokens: { type: Object, default: () => ({}) },
  toc: { type: Boolean, default: true },
  anchors: { type: Boolean, default: true },
  allowHtml: { type: Boolean, default: true },
  density: { type: String, default: "default" },
  taskLists: { type: Boolean, default: true },
  containers: { type: Array, default: () => ["tip", "warning", "danger", "info"] },
  codeGroups: { type: Boolean, default: true },
  footnotes: { type: Boolean, default: true },
  codeTools: { type: Boolean, default: true },
  sanitize: { type: Boolean, default: false },
  labels: { type: Object, default: () => ({}) },
  base: { type: String, default: "" },
  scrollRoot: { type: String, default: "" },
  parser: { type: Function, default: null },
  extend: { type: Function, default: null },
  render: { type: Function, default: null },
});

const emit = defineEmits<MdPageEmits>([
  "toc-change",
  "title-change",
  "load",
  "error",
  "link-click",
  "active-change",
]);
const host = useHost<MdPageElement>();
const locale = useLocaleProvider();

// State
const slotSource = useRef("");
const fetchedSource = useRef("");
const loading = useRef(false);
const loadError = useRef("");
const renderedHtml = useRef("");
const toc = useRef<MdPageTocEntry[]>([]);
const pageTitle = useRef("");
const activeId = useRef("");
const documentScheme = useRef<"light" | "dark">("light");
const lastSrc = useRef("");
const pipelineRef = useRef<MdPipeline | null>(null);
const lastExtend = useRef<MdPageExtend | null>(null);
const usedFetchedSource = useRef(false);
let highlightRequest = 0;
let fetchController: AbortController | null = null;
let themeObserver: ReturnType<typeof createMutateController> | undefined;
let scrollObserver: IntersectionObserver | null = null;
let codeObserver: IntersectionObserver | null = null;

// Derived state
const normalizedDensity = (): MdPageDensity =>
  DENSITIES.includes(props.density as MdPageDensity) ? (props.density as MdPageDensity) : "default";

const normalizedTheme = (): MdPageTheme =>
  THEMES.includes(props.theme as MdPageTheme) ? (props.theme as MdPageTheme) : "default";

const normalizedBaseLevel = (): number =>
  Math.min(6, Math.max(1, Math.floor(Number(props.baseHeadingLevel) || 2)));

const containerNames = (): string[] => {
  const names = Array.isArray(props.containers) ? props.containers : DEFAULT_CONTAINERS;
  return names.length > 0 ? names.map((name) => String(name).trim()).filter(Boolean) : [];
};

const markdownSource = (): string => {
  const slot = slotSource.value.trim();
  if (slot) return slot;
  if (props.content) return props.content;
  return fetchedSource.value;
};

const parseContext = (source: string) => ({
  source,
  allowHtml: props.allowHtml,
  baseHeadingLevel: normalizedBaseLevel(),
  toc: props.toc,
  anchors: props.anchors,
  taskLists: props.taskLists,
  containers: containerNames(),
  codeGroups: props.codeGroups,
  footnotes: props.footnotes,
  codeTools: props.codeTools,
});

const getPipeline = (): MdPipeline => {
  if (pipelineRef.value && lastExtend.value === props.extend) return pipelineRef.value;
  lastExtend.set(props.extend ?? null);
  const pipeline = createMdPipeline(props.extend ?? undefined);
  pipelineRef.set(pipeline);
  return pipeline;
};

const runPipeline = (source: string): MdRenderResult => {
  const context = parseContext(source);
  const applyRenderHook = (html: string): string =>
    props.render ? props.render(html, context) : html;
  if (props.parser) {
    const result = props.parser(source, context);
    return {
      html: applyRenderHook(String(result.html || "")),
      ...(result.toc ? { toc: result.toc } : {}),
      ...(result.title !== undefined ? { title: result.title } : {}),
    };
  }
  const normalized = normalizeMarkdownSource(source);
  const { title, body } = parseFrontmatter(normalized);
  const result = getPipeline().render(body, {
    allowHtml: props.allowHtml,
    baseHeadingLevel: normalizedBaseLevel(),
    toc: props.toc,
    anchors: props.anchors,
    taskLists: props.taskLists,
    containers: containerNames(),
    codeGroups: props.codeGroups,
    footnotes: props.footnotes,
    codeTools: props.codeTools,
  });
  return {
    html: applyRenderHook(String(result.html || "")),
    ...(result.toc ? { toc: result.toc } : {}),
    title,
  };
};

const renderSignature = (): string => {
  const source = markdownSource();
  const options = [
    props.allowHtml,
    normalizedBaseLevel(),
    props.anchors,
    props.toc,
    props.taskLists,
    containerNames().join(","),
    props.codeGroups,
    props.footnotes,
    props.codeTools,
    String(props.parser),
    String(props.extend),
    String(props.render),
  ].join("\u0000");
  return `${source}\u0000${options}`;
};

const cachedRender = (): MdRenderResult => {
  const key = renderSignature();
  const cached = renderCache.get(key);
  if (cached) return cached;
  const result = runPipeline(markdownSource());
  renderCache.set(key, result);
  if (renderCache.size > RENDER_CACHE_LIMIT) {
    const firstKey = renderCache.keys().next().value as string | undefined;
    if (firstKey) renderCache.delete(firstKey);
  }
  return result;
};

const loadingLabel = (): string =>
  (props.labels as Partial<MdPageLabels> | undefined)?.loading || locale.t("table.loading");

const copyLabels = (): MdPageLabels => ({
  copy:
    (props.labels as Partial<MdPageLabels> | undefined)?.copy ||
    (locale.name.toLowerCase().startsWith("en") ? "Copy" : "复制"),
  copied:
    (props.labels as Partial<MdPageLabels> | undefined)?.copied ||
    (locale.name.toLowerCase().startsWith("en") ? "Copied" : "已复制"),
  loading: loadingLabel(),
});

const resolveScrollRoot = (): Element | null => {
  const selector = String(props.scrollRoot || "").trim();
  if (!selector) return null;
  const root = host.getRootNode() as ShadowRoot | Document;
  const candidate =
    (typeof root.querySelector === "function" ? root.querySelector(selector) : null) ??
    document.querySelector(selector);
  return candidate instanceof Element ? candidate : null;
};

const prefersReducedMotion = (): boolean =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

const scrollToElement = (element: Element): void => {
  element.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
};

// Methods
const sanitizeContent = async (container: HTMLElement): Promise<void> => {
  const module = await import("dompurify");
  const candidate = (module as { default?: unknown }).default as unknown;
  const factory = candidate as
    ((window: Window) => { sanitize: (html: string, config?: unknown) => string }) | undefined;
  const instance =
    typeof factory === "function" &&
    typeof (factory as unknown as { sanitize?: unknown }).sanitize !== "function"
      ? factory(window)
      : (candidate as { sanitize: (html: string, config?: unknown) => string });
  if (instance?.sanitize) {
    const cleaned = instance.sanitize(container.innerHTML, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ["target"],
      CUSTOM_ELEMENT_HANDLING: { allowUnknown: true },
    });
    container.innerHTML = cleaned;
  }
  scrubUnsafe(container);
};

const scrubUnsafe = (root: HTMLElement): void => {
  root
    .querySelectorAll("script, style, iframe, object, embed, form, input, button, link, meta")
    .forEach((element) => element.remove());
  root.querySelectorAll("*").forEach((element) => {
    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase();
      if (name.startsWith("on")) element.removeAttribute(attribute.name);
      else if ((name === "href" || name === "src") && /^\s*javascript:/i.test(attribute.value)) {
        element.removeAttribute(attribute.name);
      }
    }
  });
};

const setupScrollSpy = (container: HTMLElement): void => {
  scrollObserver?.disconnect();
  scrollObserver = null;
  if (typeof IntersectionObserver === "undefined") return;
  const headings = Array.from(container.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6"));
  if (headings.length === 0) return;
  scrollObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const id = (entry.target as HTMLElement).id;
        if (id && id !== activeId.peek()) {
          activeId.set(id);
          emit("active-change", id);
        }
      }
    },
    { root: resolveScrollRoot(), rootMargin: "-25% 0px -65% 0px", threshold: 0 },
  );
  headings.forEach((heading) => scrollObserver?.observe(heading));
};

const scheduleHighlight = (): void => {
  const request = ++highlightRequest;
  queueMicrotask(() => {
    void (async () => {
      const container = host.shadowRoot?.querySelector<HTMLElement>(".md-content");
      if (!container || request !== highlightRequest) return;
      if (props.sanitize) await sanitizeContent(container);
      if (request !== highlightRequest) return;
      const theme = resolveMdPageTheme(props.codeTheme as MdPageCodeTheme, documentScheme.value);
      if (props.base && usedFetchedSource.value) rewriteRelativeUrls(container, props.base);
      container
        .querySelectorAll<HTMLImageElement>("img:not([loading])")
        .forEach((image) => image.setAttribute("loading", "lazy"));
      setupScrollSpy(container);
      const fences = Array.from(container.querySelectorAll<HTMLElement>("pre.md-fence"));
      if (!props.codeTools || fences.length === 0) return;
      if (typeof IntersectionObserver === "undefined") {
        void highlightCodeBlocks(container, theme, copyLabels()).catch(() => undefined);
        return;
      }
      codeObserver?.disconnect();
      codeObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            codeObserver?.unobserve(entry.target);
            void highlightCodeBlocks(entry.target as HTMLElement, theme, copyLabels()).catch(
              () => undefined,
            );
          }
        },
        { root: resolveScrollRoot(), rootMargin: "200px 0px" },
      );
      fences.forEach((fence) => codeObserver?.observe(fence));
    })();
  });
};

const render = (): void => {
  const source = markdownSource();
  usedFetchedSource.set(source.length > 0 && source === fetchedSource.value);
  const result = cachedRender();
  if (result.html !== renderedHtml.peek()) renderedHtml.set(result.html);

  const nextToc = result.toc ?? [];
  if (JSON.stringify(nextToc) !== JSON.stringify(toc.peek())) {
    toc.set(nextToc);
    emit("toc-change", nextToc);
  }

  const title = result.title ?? "";
  if (title !== pageTitle.peek()) {
    pageTitle.set(title);
    emit("title-change", title);
  }

  scheduleHighlight();
};

const readSlot = (slot: HTMLSlotElement): void => {
  const text = slot
    .assignedNodes({ flatten: true })
    .map((node) => node.textContent || "")
    .join("");
  // Re-renders can transiently detach the slotted text; keep the last source
  // so embedded interactive components are not destroyed by an empty read.
  if (!text && slotSource.peek()) return;
  slotSource.set(text);
};

const onSlotChange = (event: Event): void => {
  readSlot(event.target as HTMLSlotElement);
};

const syncDocumentScheme = (): void => {
  const theme = document.documentElement.getAttribute("data-theme");
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  const next = theme === "dark" || (theme !== "light" && prefersDark) ? "dark" : "light";
  if (next !== documentScheme.peek()) {
    documentScheme.set(next);
    scheduleHighlight();
  }
};

const writeClipboard = async (text: string): Promise<void> => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to the textarea path.
    }
  }
  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  try {
    input.select();
    const succeeded = document.execCommand?.("copy") ?? false;
    if (!succeeded) throw new Error("Clipboard API is unavailable");
  } finally {
    input.remove();
  }
};

const onContentClick = (event: MouseEvent): void => {
  const target = event.target as Element | null;
  const groupTab = target?.closest?.<HTMLButtonElement>(".md-code-group-tab");
  if (groupTab) {
    activateGroupTab(groupTab);
    return;
  }
  const copyButton = target?.closest?.<HTMLButtonElement>(".md-code-copy");
  if (copyButton) {
    const block = copyButton.closest<HTMLElement>(".md-code-block");
    const code = block?.querySelector<HTMLElement>("pre.md-code-pre");
    if (!code) return;
    void writeClipboard(code.textContent ?? "")
      .then(() => {
        copyButton.textContent = copyLabels().copied;
        setTimeout(() => {
          copyButton.textContent = copyLabels().copy;
        }, 1600);
      })
      .catch(() => undefined);
    return;
  }

  const anchor = target?.closest?.<HTMLAnchorElement>("a[href]");
  if (!anchor) return;
  const href = anchor.getAttribute("href") || "";
  if (href.startsWith("#")) {
    const heading = host.shadowRoot?.getElementById(href.slice(1));
    if (heading) {
      event.preventDefault();
      scrollToElement(heading);
    }
    return;
  }
  const composed = new CustomEvent("link-click", {
    detail: {
      href,
      target: anchor.getAttribute("target") || "",
      text: anchor.textContent || "",
    },
    bubbles: true,
    composed: true,
    cancelable: true,
  });
  host.dispatchEvent(composed);
  if (composed.defaultPrevented) event.preventDefault();
};

const activateGroupTab = (button: HTMLButtonElement): void => {
  const group = button.closest<HTMLElement>(".md-code-group");
  if (!group) return;
  const index = button.dataset.panel || "0";
  group.querySelectorAll<HTMLButtonElement>(".md-code-group-tab").forEach((tab, tabIndex) => {
    const active = String(tabIndex) === index;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  group.querySelectorAll<HTMLElement>(".md-code-group-panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.tab === index);
  });
  scheduleHighlight();
};

const onRootKeydown = (event: KeyboardEvent): void => {
  const target = event.target as Element | null;
  const tab = target?.closest?.<HTMLButtonElement>(".md-code-group-tab");
  if (!tab) return;
  const tabs = Array.from(
    tab
      .closest<HTMLElement>(".md-code-group")
      ?.querySelectorAll<HTMLButtonElement>(".md-code-group-tab") ?? [],
  );
  const current = tabs.indexOf(tab);
  let next = current;
  if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
  else if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = tabs.length - 1;
  else return;
  event.preventDefault();
  const nextTab = tabs[next];
  if (!nextTab) return;
  activateGroupTab(nextTab);
  nextTab.focus();
};

const outline = (): MdPageTocEntry[] => [...toc.value];
const getHtml = (): string => renderedHtml.value;
const active = (): string => activeId.value;

useEffect(() => {
  const source = String(props.src || "").trim();
  if (source === lastSrc.peek()) return;
  lastSrc.set(source);

  fetchController?.abort();
  fetchController = null;
  if (!source) {
    fetchedSource.set("");
    loading.set(false);
    loadError.set("");
    return;
  }

  const controller = new AbortController();
  fetchController = controller;
  loading.set(true);
  loadError.set("");

  fetch(source, { signal: controller.signal })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then((text) => {
      if (controller.signal.aborted) return;
      fetchedSource.set(text);
      loading.set(false);
      emit("load", text);
    })
    .catch((error: unknown) => {
      if (controller.signal.aborted) return;
      loading.set(false);
      const message = error instanceof Error ? error.message : String(error);
      loadError.set(message);
      emit("error", message);
    });
});

useEffect(() => {
  render();
});

useEffect(() => {
  const style = host.style;
  for (const [name, value] of Object.entries(props.tokens || {})) {
    if (value === null || value === undefined || value === "") style.removeProperty(name);
    else style.setProperty(name, String(value));
  }
});

useHostAttr("density", normalizedDensity);
useHostAttr("theme", normalizedTheme);
useHostCssVar("--elf-md-max-width", () => props.maxWidth || "760px");

onMounted(() => {
  const slot = host.shadowRoot?.querySelector<HTMLSlotElement>(".md-source");
  if (slot) readSlot(slot);
  const root = host.shadowRoot?.querySelector<HTMLElement>(".md-page");
  root?.addEventListener("click", onContentClick);
  root?.addEventListener("keydown", onRootKeydown);
  syncDocumentScheme();
  themeObserver = createMutateController(document.documentElement, {
    handler: syncDocumentScheme,
    observer: {
      attributes: true,
      attributeFilter: ["data-theme"],
    },
  });
  const media = window.matchMedia?.("(prefers-color-scheme: dark)");
  media?.addEventListener?.("change", syncDocumentScheme);

  return () => {
    themeObserver?.dispose();
    themeObserver = undefined;
    media?.removeEventListener?.("change", syncDocumentScheme);
  };
});

onUnmounted(() => {
  highlightRequest += 1;
  fetchController?.abort();
  fetchController = null;
  scrollObserver?.disconnect();
  scrollObserver = null;
  codeObserver?.disconnect();
  codeObserver = null;
  const root = host.shadowRoot?.querySelector<HTMLElement>(".md-page");
  root?.removeEventListener("click", onContentClick);
  root?.removeEventListener("keydown", onRootKeydown);
});

defineExpose<MdPageExpose>({ render, outline, getHtml, active }, { overrideNative: ["render"] });
defineStyle(styles);

const MdPage = defineHtml<MdPageProps, MdPageEmits, MdPageSlots>(`
  <section class="md-page">
    <div v-if=${loading} class="md-state is-loading" part="loading">
      <slot name="loading">
        <span class="md-skeleton" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="md-sr-only">${loadingLabel()}</span>
      </slot>
    </div>
    <div v-else-if=${loadError} class="md-state is-error" part="error" role="alert">
      <slot name="error"><span class="md-state-label">${loadError}</span></slot>
    </div>
    <article
      v-else
      class="md-content"
      part="content"
      v-html=${renderedHtml}
    ></article>
    <slot class="md-source" @slotchange=${onSlotChange}></slot>
  </section>
`);

export { MdPage };

export {
  createMdPipeline,
  DEFAULT_MD_CONTAINERS,
  MD_CODE_THEMES,
  MD_DENSITIES,
  MD_THEMES,
  normalizeMarkdownSource,
  parseFrontmatter,
  resolveMdPageTheme,
  rewriteRelativeUrls,
} from "./md";

declare global {
  interface HTMLElementTagNameMap {
    "elf-md-page": MdPageElement;
  }
}
