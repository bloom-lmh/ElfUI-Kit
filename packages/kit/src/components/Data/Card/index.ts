import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  useEffect,
  useHost,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useRef,
} from "@elfui/core";

import { useLocaleProvider } from "../../Providers/context";
import styles from "./style.scss?inline";
import type {
  CardDensity,
  CardEmits,
  CardImagePlacement,
  CardProps,
  CardShadow,
  CardSlots,
  CardVariant,
} from "./types";

export type {
  CardBodyStyle,
  CardDensity,
  CardEmits,
  CardImagePlacement,
  CardProps,
  CardShadow,
  CardSlots,
  CardVariant,
} from "./types";

const CARD_SHADOWS: readonly CardShadow[] = ["always", "hover", "never"];
const CARD_VARIANTS: readonly CardVariant[] = ["elevated", "outlined", "filled", "tonal", "flat"];
const CARD_DENSITIES: readonly CardDensity[] = ["default", "comfortable", "compact"];
const NESTED_INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "input",
  "select",
  "textarea",
  "summary",
  "[contenteditable]",
  "[role='button']",
  "[role='link']",
  "elf-button",
  "elf-link",
].join(",");

const props = defineProps<CardProps>({
  header: { type: String, default: "" },
  footer: { type: String, default: "" },
  bodyStyle: { type: Object, default: () => ({}) },
  headerClass: { type: String, default: "" },
  bodyClass: { type: String, default: "" },
  footerClass: { type: String, default: "" },
  shadow: { type: String, default: "always" },
  variant: { type: String, default: "elevated" },
  density: { type: String, default: "default" },
  avatar: { type: String, default: "" },
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  image: { type: String, default: "" },
  imageAlt: { type: String, default: "" },
  imagePlacement: { type: String, default: "top" },
  imageHeight: { type: String, default: "200px" },
  imageWidth: { type: String, default: "40%" },
  overlay: { type: String, default: "" },
  clickable: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits<CardEmits>();
const host = useHost();
const locale = useLocaleProvider();

// State
const hasHeaderSlot = useRef(false);
const hasFooterSlot = useRef(false);
const hasCoverSlot = useRef(false);
const imageFailed = useRef(false);

// Derived state
const normalizedShadow = (): CardShadow => {
  const value = String(props.shadow || "always") as CardShadow;
  return CARD_SHADOWS.includes(value) ? value : "always";
};

const normalizedVariant = (): CardVariant => {
  const value = String(props.variant || "elevated") as CardVariant;
  return CARD_VARIANTS.includes(value) ? value : "elevated";
};

const normalizedDensity = (): CardDensity => {
  const value = String(props.density || "default") as CardDensity;
  return CARD_DENSITIES.includes(value) ? value : "default";
};

const normalizedImagePlacement = (): CardImagePlacement =>
  props.imagePlacement === "left" ? "left" : "top";

const showImage = (): boolean => Boolean(props.image) && !imageFailed.value;
const showImageError = (): boolean => Boolean(props.image) && imageFailed.value;
const showOverlay = (): boolean => showImage() && Boolean(props.overlay);
const showHeader = (): boolean =>
  Boolean(props.header || props.title || props.subtitle || props.avatar || hasHeaderSlot.value);
const showFooter = (): boolean => Boolean(props.footer || hasFooterSlot.value);
const showCover = (): boolean => Boolean(props.image || hasCoverSlot.value);
const interactionBlocked = (): boolean => Boolean(props.disabled || props.loading);
const isInteractive = (): boolean => Boolean(props.clickable) && !interactionBlocked();
const imageUnavailableLabel = (): string =>
  locale.name.toLowerCase().startsWith("en") ? "Image is unavailable" : "图片暂时无法显示";

const slotHasContent = (slot: HTMLSlotElement): boolean =>
  slot
    .assignedNodes({ flatten: true })
    .some((node) => node.nodeType === 1 || (node.textContent?.trim() ?? "") !== "");

const originatedFromNestedControl = (event: Event): boolean => {
  for (const node of event.composedPath()) {
    if (node === event.currentTarget) return false;
    if (node instanceof Element && node.matches(NESTED_INTERACTIVE_SELECTOR)) return true;
  }
  return false;
};

// Methods
const updateSlotState = (target: "header" | "footer" | "cover", slot: HTMLSlotElement): void => {
  const hasContent = slotHasContent(slot);
  if (target === "header") hasHeaderSlot.set(hasContent);
  if (target === "footer") hasFooterSlot.set(hasContent);
  if (target === "cover") hasCoverSlot.set(hasContent);
};

const onSlotChange =
  (target: "header" | "footer" | "cover") =>
  (event: Event): void =>
    updateSlotState(target, event.target as HTMLSlotElement);

const syncSlotStates = (): void => {
  for (const target of ["header", "footer", "cover"] as const) {
    const slot = host.shadowRoot?.querySelector<HTMLSlotElement>(`slot[name="${target}"]`);
    if (slot) updateSlotState(target, slot);
  }
};

const onCardClick = (event: MouseEvent): void => {
  if (!props.clickable) return;
  if (originatedFromNestedControl(event) || interactionBlocked()) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  event.stopPropagation();
  emit("click");
};

const onCardKeydown = (event: KeyboardEvent): void => {
  if (
    !isInteractive() ||
    originatedFromNestedControl(event) ||
    (event.key !== "Enter" && event.key !== " ")
  ) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  emit("click");
};

const onImageLoad = (event: Event): void => {
  imageFailed.set(false);
  emit("image-load", event);
};

const onImageError = (event: Event): void => {
  imageFailed.set(true);
  emit("image-error", event);
};

useEffect(() => {
  void props.image;
  imageFailed.set(false);
});

useHostAttr("variant", normalizedVariant);
useHostAttr("shadow", normalizedShadow);
useHostAttr("density", normalizedDensity);
useHostAttr("image-placement", normalizedImagePlacement);
useHostAttr("aria-busy", () => (props.loading ? "true" : null));
useHostFlag("clickable", () => Boolean(props.clickable));
useHostFlag("disabled", () => Boolean(props.disabled));
useHostFlag("loading", () => Boolean(props.loading));
useHostFlag("has-header", showHeader);
useHostFlag("has-footer", showFooter);
useHostFlag("has-cover", showCover);
useHostFlag("image-error", showImageError);
useHostCssVar("--_image-h", () => String(props.imageHeight || "200px"));
useHostCssVar("--_image-w", () => String(props.imageWidth || "40%"));

onMounted(() => queueMicrotask(syncSlotStates));

defineStyle(styles);

const Card = defineHtml<CardProps, CardEmits, CardSlots>(`
  <div
    v-if=${props.loading}
    class="loading"
    part="loading"
    role="status"
    :aria-label=${locale.t("loading.active")}
  >
    <slot name="loading"><span class="loading-indicator" aria-hidden="true"></span></slot>
  </div>

  <div class="card-image-wrap" v-show=${showCover()} @click=${onCardClick}>
    <img
      v-if=${showImage()}
      :src=${props.image}
      :alt=${props.imageAlt}
      loading="lazy"
      @load=${onImageLoad}
      @error=${onImageError}
    />
    <div
      v-if=${showImageError()}
      class="image-error"
      part="image-error"
      role="img"
      :aria-label=${imageUnavailableLabel()}
    >
      <slot name="image-error">
        <span aria-hidden="true">⌁</span>
        <small>${imageUnavailableLabel()}</small>
      </slot>
    </div>
    <slot name="cover" @slotchange=${onSlotChange("cover")}></slot>
    <div class="image-overlay" v-if=${showOverlay()}>${props.overlay}</div>
  </div>

  <div
    class="card-content"
    :role=${props.clickable ? "button" : null}
    :tabindex=${props.clickable ? (interactionBlocked() ? -1 : 0) : null}
    :aria-disabled=${props.clickable && interactionBlocked() ? "true" : null}
    :aria-busy=${props.loading ? "true" : null}
    @click=${onCardClick}
    @keydown=${onCardKeydown}
  >
    <div class="header" v-show=${showHeader()} :class=${props.headerClass}>
      <slot name="header" @slotchange=${onSlotChange("header")}>
        <img class="avatar" v-if=${props.avatar} :src=${props.avatar} alt="" />
        <div class="header-text" v-if=${props.title || props.subtitle || props.header}>
          <div class="title" v-if=${props.title || props.header}>
            <slot name="title">${props.title || props.header}</slot>
          </div>
          <div class="subtitle" v-if=${props.subtitle}>${props.subtitle}</div>
        </div>
        <div class="extra"><slot name="extra"></slot></div>
      </slot>
    </div>

    <div class="body" :class=${props.bodyClass} :style=${props.bodyStyle}>
      <slot></slot>
    </div>

    <div class="footer" v-show=${showFooter()} :class=${props.footerClass}>
      <slot name="footer" @slotchange=${onSlotChange("footer")}>${props.footer}</slot>
    </div>
  </div>
`);

export { Card };
