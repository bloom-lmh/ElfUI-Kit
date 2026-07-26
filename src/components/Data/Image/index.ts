import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  globalStyle,
  onMounted,
  useComputed,
  useEffect,
  useHost,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useRef,
  useScrollLock
} from "@elfui/core";

import { collectFocusable, deepActiveElement } from "../../Common/focus-scope";
import { useLocaleProvider } from "../../Providers/context";
import previewStyles from "./preview.scss?inline";
import styles from "./style.scss?inline";
import type {
  ImageEmits,
  ImageExposes,
  ImageFit,
  ImageProps,
  ImageSlots
} from "./types";

export type {
  ImageEmits,
  ImageExposes,
  ImageFit,
  ImageProps,
  ImageSlots
} from "./types";

const IMAGE_FITS = new Set<ImageFit>(["fill", "contain", "cover", "none", "scale-down"]);

const nextPreviewId = (): string => {
  const store = globalThis as typeof globalThis & { __elfImagePreviewIdSeed?: number };
  store.__elfImagePreviewIdSeed = (store.__elfImagePreviewIdSeed ?? 0) + 1;
  return `elf-image-preview-${store.__elfImagePreviewIdSeed}`;
};

const props = defineProps<ImageProps>({
  src: { type: String, default: "" },
  srcset: { type: String, default: "" },
  sizes: { type: String, default: "" },
  alt: { type: String, default: "" },
  fit: { type: String, default: "fill" },
  width: { type: [Number, String], default: "auto" },
  height: { type: [Number, String], default: "auto" },
  lazy: { type: Boolean, default: false },
  previewSrcList: { type: Array, default: () => [] },
  initialIndex: { type: Number, default: 0 },
  previewTeleported: { type: Boolean, default: false },
  zoomRate: { type: Number, default: 1.2 },
  toolbar: { type: Boolean, default: true }
});

const emit = defineEmits<ImageEmits>([
  "load",
  "error",
  "preview-open",
  "preview-close",
  "preview-change"
]);

const locale = useLocaleProvider();
const host = useHost();
const previewId = nextPreviewId();

// State
const error = useRef(false);
const loaded = useRef(false);
const previewOpen = useRef(false);
const activeIndex = useRef(0);
const scale = useRef(1);
const visible = useRef(false);
const resolvedSrc = useRef("");
let observer: IntersectionObserver | undefined;
let previousActiveElement: HTMLElement | null = null;

// Derived state
const cssSize = (value: number | string): string => {
  if (typeof value === "number") {
    return `${Math.max(0, Number.isFinite(value) ? value : 0)}px`;
  }
  const normalized = String(value || "auto").trim();
  return /^-?\d+(?:\.\d+)?$/.test(normalized)
    ? `${Math.max(0, Number(normalized))}px`
    : normalized;
};

const normalizedFit = (): ImageFit => {
  const value = String(props.fit || "fill") as ImageFit;
  return IMAGE_FITS.has(value) ? value : "fill";
};

const previewSources = (): string[] =>
  (Array.isArray(props.previewSrcList) ? props.previewSrcList : [])
    .filter((source): source is string => typeof source === "string" && source.trim().length > 0);

const normalizedIndex = (index: number): number => {
  const total = previewSources().length;
  if (total === 0) return 0;
  return Math.min(Math.max(0, Math.floor(index)), total - 1);
};

const isEnglish = (): boolean => locale.name.toLowerCase().startsWith("en");
const previewLabel = (): string => isEnglish() ? "Image preview" : "图片预览";
const previewTriggerLabel = (): string => {
  const action = isEnglish() ? "Preview image" : "预览图片";
  return props.alt ? `${action}：${props.alt}` : action;
};
const previousLabel = (): string => locale.t("common.previous");
const nextLabel = (): string => locale.t("common.next");
const closeLabel = (): string => locale.t("common.close");
const resetLabel = (): string => locale.t("common.reset");
const retryLabel = (): string => locale.t("common.retry");
const loadFailedLabel = (): string => isEnglish() ? "Image failed to load" : "图片加载失败";
const zoomOutLabel = (): string => isEnglish() ? "Zoom out" : "缩小";
const zoomInLabel = (): string => isEnglish() ? "Zoom in" : "放大";
const toolbarLabel = (): string => isEnglish() ? "Preview controls" : "预览控制";

const imageClass = useComputed(() => `fit-${normalizedFit()}`);
const previewable = useComputed(() => previewSources().length > 0);
const canOpenPreview = (): boolean => previewable.value && loaded.value && !error.value;
const activeSource = useComputed(
  () => previewSources()[normalizedIndex(activeIndex.value)] || props.src
);
const previewCounter = useComputed(
  () => `${normalizedIndex(activeIndex.value) + 1} / ${previewSources().length}`
);
const zoomStep = (): number => Math.max(1.05, Number(props.zoomRate) || 1.2);
const imageTransform = useComputed(() => `scale(${scale.value})`);
const showNavigation = useComputed(() => previewSources().length > 1);
const resolvedSrcset = (): string | null =>
  resolvedSrc.value && props.srcset ? props.srcset : null;
const resolvedSizes = (): string | null =>
  resolvedSrc.value && props.sizes ? props.sizes : null;
const triggerRole = (): string | null => canOpenPreview() ? "button" : null;
const triggerTabIndex = (): string | null => canOpenPreview() ? "0" : null;
const triggerLabel = (): string | null => canOpenPreview() ? previewTriggerLabel() : null;
const triggerControls = (): string | null => canOpenPreview() ? previewId : null;
const triggerExpanded = (): string | null =>
  canOpenPreview() ? String(previewOpen.value) : null;
const previewRoot = (): HTMLElement | null =>
  host.shadowRoot?.querySelector<HTMLElement>(`[data-elf-image-preview="${previewId}"]`)
  ?? document.querySelector<HTMLElement>(`[data-elf-image-preview="${previewId}"]`);

// Methods
const onLoad = (event: Event): void => {
  error.set(false);
  loaded.set(true);
  emit("load", event);
};

const onError = (event: Event): void => {
  loaded.set(false);
  error.set(true);
  emit("error", event);
};

const focusPreview = (): void => {
  const root = previewRoot();
  if (!root || !previewOpen.value) return;
  (collectFocusable(root)[0] ?? root).focus({ preventScroll: true });
};

const restoreFocus = (): void => {
  const target = previousActiveElement;
  previousActiveElement = null;
  if (target?.isConnected) target.focus({ preventScroll: true });
};

const openPreview = (): void => {
  if (!previewable.value || previewOpen.peek()) return;
  previousActiveElement = deepActiveElement();
  activeIndex.set(normalizedIndex(Number(props.initialIndex) || 0));
  scale.set(1);
  previewOpen.set(true);
  emit("preview-open", activeIndex.value);
  queueMicrotask(() => queueMicrotask(focusPreview));
};

const closePreview = (): void => {
  if (!previewOpen.peek()) return;
  previewOpen.set(false);
  scale.set(1);
  emit("preview-close", activeIndex.value);
  queueMicrotask(restoreFocus);
};

const switchPreview = (offset: number): void => {
  const total = previewSources().length;
  if (total < 2) return;
  const next = (normalizedIndex(activeIndex.value) + offset + total) % total;
  activeIndex.set(next);
  scale.set(1);
  emit("preview-change", next);
};

const setPreviewIndex = (index: number): void => {
  const next = normalizedIndex(index);
  if (next === activeIndex.value) return;
  activeIndex.set(next);
  scale.set(1);
  emit("preview-change", next);
};

const zoom = (direction: 1 | -1): void => {
  const next = direction > 0 ? scale.value * zoomStep() : scale.value / zoomStep();
  scale.set(Math.min(7, Math.max(0.2, next)));
};

const resetZoom = (): void => scale.set(1);

const retry = (): void => {
  const source = props.src;
  error.set(false);
  loaded.set(false);
  if (!source || (props.lazy && !visible.value)) return;
  resolvedSrc.set("");
  queueMicrotask(() => {
    if (props.src === source) resolvedSrc.set(source);
  });
};

const onRetryClick = (event: MouseEvent): void => {
  event.preventDefault();
  event.stopPropagation();
  retry();
};

const onImageClick = (): void => {
  if (canOpenPreview()) openPreview();
};

const onTriggerKeydown = (event: KeyboardEvent): void => {
  if (!canOpenPreview() || (event.key !== "Enter" && event.key !== " ")) return;
  event.preventDefault();
  openPreview();
};

const onPreviewMaskClick = (event: MouseEvent): void => {
  if (event.target === event.currentTarget) closePreview();
};

const trapPreviewFocus = (event: KeyboardEvent): void => {
  const root = previewRoot();
  if (!root) return;
  const focusable = collectFocusable(root);
  if (focusable.length === 0) {
    event.preventDefault();
    root.focus({ preventScroll: true });
    return;
  }
  const active = deepActiveElement();
  const first = focusable[0]!;
  const last = focusable[focusable.length - 1]!;
  if (event.shiftKey && (active === first || !root.contains(active))) {
    event.preventDefault();
    last.focus({ preventScroll: true });
  } else if (!event.shiftKey && (active === last || !root.contains(active))) {
    event.preventDefault();
    first.focus({ preventScroll: true });
  }
};

const onDocumentKeydown = (event: KeyboardEvent): void => {
  if (!previewOpen.value) return;
  if (event.key === "Tab") {
    trapPreviewFocus(event);
    return;
  }

  const actions: Record<string, () => void> = {
    Escape: closePreview,
    ArrowLeft: () => switchPreview(-1),
    ArrowRight: () => switchPreview(1),
    Home: () => setPreviewIndex(0),
    End: () => setPreviewIndex(previewSources().length - 1),
    "+": () => zoom(1),
    "=": () => zoom(1),
    "-": () => zoom(-1),
    "0": resetZoom
  };
  const action = actions[event.key];
  if (!action) return;
  event.preventDefault();
  action();
};

const setupVisibility = (): void => {
  if (!props.lazy || typeof IntersectionObserver === "undefined") {
    visible.set(true);
    return;
  }
  observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    visible.set(true);
    observer?.disconnect();
    observer = undefined;
  }, { rootMargin: "120px 0px" });
  observer.observe(host);
};

useEffect(() => {
  props.src;
  error.set(false);
  loaded.set(false);
});

useEffect(() => {
  const src = props.src;
  if (!props.lazy || visible.value) resolvedSrc.set(src);
  else resolvedSrc.set("");
});

useEffect(() => {
  const sources = previewSources();
  if (!previewOpen.value) return;
  if (sources.length === 0) {
    closePreview();
    return;
  }
  const next = normalizedIndex(activeIndex.value);
  if (next !== activeIndex.value) activeIndex.set(next);
});

useHostAttr("fit", normalizedFit);
useHostFlag("loaded", () => loaded.value);
useHostFlag("error", () => error.value);
useHostFlag("lazy", () => Boolean(props.lazy));
useHostFlag("previewable", () => previewable.value);
useHostFlag("preview-open", () => previewOpen.value);
useHostCssVar("--_image-width", () => cssSize(props.width));
useHostCssVar("--_image-height", () => cssSize(props.height));
useHostCssVar("--_image-fit", normalizedFit);
useScrollLock(() => previewOpen.value);

onMounted(() => {
  setupVisibility();
  document.addEventListener("keydown", onDocumentKeydown);
  return () => {
    observer?.disconnect();
    observer = undefined;
    document.removeEventListener("keydown", onDocumentKeydown);
    if (previewOpen.peek()) restoreFocus();
  };
});

defineExpose<ImageExposes>({ openPreview, closePreview, retry });

defineStyle(styles, previewStyles);
globalStyle(previewStyles);

const Image = defineHtml<ImageProps, ImageEmits, ImageSlots>(`
  <div
    class="image"
    :class=${{ "is-previewable": canOpenPreview }}
    part="image"
    :role=${triggerRole()}
    :tabindex=${triggerTabIndex()}
    :aria-label=${triggerLabel()}
    :aria-controls=${triggerControls()}
    :aria-haspopup=${canOpenPreview() ? "dialog" : null}
    :aria-expanded=${triggerExpanded()}
    @click=${onImageClick}
    @keydown=${onTriggerKeydown}
  >
    <slot v-if=${error} name="error">
      <div class="error" part="error" role="alert">
        <span class="error-mark" aria-hidden="true">!</span>
        <span>${loadFailedLabel()}</span>
        <button type="button" @click=${onRetryClick}>${retryLabel()}</button>
      </div>
    </slot>
    <slot v-if=${!error && (!resolvedSrc || !loaded)} name="loading">
      <div class="pending" part="placeholder" role="status" aria-live="polite">
        <span class="pending-indicator" aria-hidden="true"></span>
        <span class="visually-hidden">${locale.t("a11y.imagePending")}</span>
      </div>
    </slot>
    <img
      v-if=${!error && resolvedSrc}
      part="img"
      :class=${[imageClass, { "is-loaded": loaded }]}
      :src=${resolvedSrc}
      :srcset=${resolvedSrcset()}
      :sizes=${resolvedSizes()}
      :alt=${props.alt}
      :loading=${props.lazy ? "lazy" : null}
      decoding="async"
      draggable="false"
      @load=${onLoad}
      @error=${onError}
    />
  </div>

  <Teleport to="body">
    <div
      v-if=${previewOpen && props.previewTeleported}
      class="elf-image-preview"
      :id=${previewId}
      :data-elf-image-preview=${previewId}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      :aria-label=${previewLabel()}
      @click=${onPreviewMaskClick}
    >
      <img
        class="elf-image-preview__image"
        :src=${activeSource}
        :alt=${props.alt}
        :style=${{ transform: imageTransform }}
      />
      <button class="elf-image-preview__close" type="button" :aria-label=${closeLabel()} @click=${closePreview}>
        ×
      </button>
      <button
        v-if=${showNavigation}
        class="elf-image-preview__nav elf-image-preview__nav--previous"
        type="button"
        :aria-label=${previousLabel()}
        @click=${() => switchPreview(-1)}
      >
        ‹
      </button>
      <button
        v-if=${showNavigation}
        class="elf-image-preview__nav elf-image-preview__nav--next"
        type="button"
        :aria-label=${nextLabel()}
        @click=${() => switchPreview(1)}
      >
        ›
      </button>
      <span v-if=${showNavigation} class="elf-image-preview__counter" aria-live="polite">
        ${previewCounter}
      </span>
      <div v-if=${props.toolbar} class="elf-image-preview__toolbar" role="toolbar" :aria-label=${toolbarLabel()}>
        <button type="button" :aria-label=${zoomOutLabel()} @click=${() => zoom(-1)}>−</button>
        <button type="button" :aria-label=${resetLabel()} @click=${resetZoom}>⟳</button>
        <button type="button" :aria-label=${zoomInLabel()} @click=${() => zoom(1)}>+</button>
      </div>
    </div>
  </Teleport>

  <div
    v-if=${previewOpen && !props.previewTeleported}
    class="elf-image-preview"
    :id=${previewId}
    :data-elf-image-preview=${previewId}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    :aria-label=${previewLabel()}
    @click=${onPreviewMaskClick}
  >
    <img
      class="elf-image-preview__image"
      :src=${activeSource}
      :alt=${props.alt}
      :style=${{ transform: imageTransform }}
    />
    <button class="elf-image-preview__close" type="button" :aria-label=${closeLabel()} @click=${closePreview}>
      ×
    </button>
    <button
      v-if=${showNavigation}
      class="elf-image-preview__nav elf-image-preview__nav--previous"
      type="button"
      :aria-label=${previousLabel()}
      @click=${() => switchPreview(-1)}
    >
      ‹
    </button>
    <button
      v-if=${showNavigation}
      class="elf-image-preview__nav elf-image-preview__nav--next"
      type="button"
      :aria-label=${nextLabel()}
      @click=${() => switchPreview(1)}
    >
      ›
    </button>
    <span v-if=${showNavigation} class="elf-image-preview__counter" aria-live="polite">
      ${previewCounter}
    </span>
    <div v-if=${props.toolbar} class="elf-image-preview__toolbar" role="toolbar" :aria-label=${toolbarLabel()}>
      <button type="button" :aria-label=${zoomOutLabel()} @click=${() => zoom(-1)}>−</button>
      <button type="button" :aria-label=${resetLabel()} @click=${resetZoom}>⟳</button>
      <button type="button" :aria-label=${zoomInLabel()} @click=${() => zoom(1)}>+</button>
    </div>
  </div>
`);

export { Image };
