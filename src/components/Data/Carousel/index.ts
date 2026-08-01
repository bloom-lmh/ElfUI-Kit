import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  useComputed,
  useEffect,
  useHost,
  useHostAttr,
  useHostFlag,
  useRef,
} from "@elfui/core";

import { useLocaleProvider } from "../../Providers/context";
import styles from "./style.scss?inline";
import type {
  CarouselArrow,
  CarouselArrowStyle,
  CarouselDirection,
  CarouselEffect,
  CarouselEmits,
  CarouselIndicatorPosition,
  CarouselIndicatorType,
  CarouselProps,
  CarouselTrigger,
  CarouselType,
} from "./types";

export type {
  CarouselArrow,
  CarouselArrowStyle,
  CarouselDirection,
  CarouselEffect,
  CarouselEmits,
  CarouselExposes,
  CarouselIndicatorPosition,
  CarouselIndicatorType,
  CarouselItemProps,
  CarouselProps,
  CarouselTrigger,
  CarouselType,
} from "./types";

const CAROUSEL_EFFECTS: readonly CarouselEffect[] = ["slide", "fade"];
const CAROUSEL_TYPES: readonly CarouselType[] = ["", "card"];
const CAROUSEL_ARROW_STYLES: readonly CarouselArrowStyle[] = ["circle", "square", "ghost"];
const CAROUSEL_INDICATOR_TYPES: readonly CarouselIndicatorType[] = ["dot", "line", "number"];
const CAROUSEL_TRIGGERS: readonly CarouselTrigger[] = ["hover", "click"];
const CAROUSEL_ARROWS: readonly CarouselArrow[] = ["always", "hover", "never"];
const CAROUSEL_INDICATOR_POSITIONS: readonly CarouselIndicatorPosition[] = ["", "outside", "none"];
const CAROUSEL_DIRECTIONS: readonly CarouselDirection[] = ["horizontal", "vertical"];
const SWIPE_THRESHOLD = 36;
const MIN_AUTOPLAY_INTERVAL = 250;

const props = defineProps<CarouselProps>({
  effect: { type: String, default: "slide" },
  type: { type: String, default: "" },
  autoplay: { type: Boolean, default: true },
  interval: { type: Number, default: 4000 },
  loop: { type: Boolean, default: true },
  showArrow: { type: [String, Boolean], default: "circle" },
  showIndicator: { type: Boolean, default: true },
  indicatorType: { type: String, default: "dot" },
  height: { type: String, default: "320px" },
  duration: { type: String, default: "0.5s" },
  pauseOnHover: { type: Boolean, default: true },
  pauseOnFocus: { type: Boolean, default: true },
  respectReducedMotion: { type: Boolean, default: true },
  showPlayControl: { type: Boolean, default: false },
  radius: { type: String, default: "12px" },
  initialIndex: { type: Number, default: 0 },
  trigger: { type: String, default: "hover" },
  arrow: { type: String, default: "hover" },
  indicatorPosition: { type: String, default: "" },
  direction: { type: String, default: "horizontal" },
  ariaLabel: { type: String, default: "Carousel" },
});

const emit = defineEmits<CarouselEmits>();
const host = useHost();
const locale = useLocaleProvider();

// State
const active = useRef(0);
const total = useRef(0);
const visualIndex = useRef(0);
const playing = useRef(false);
const manualPaused = useRef(false);
const hoverPaused = useRef(false);
const focusPaused = useRef(false);
const pageHidden = useRef(false);
const reducedMotion = useRef(false);
const reducedMotionOverride = useRef(false);

let timer: ReturnType<typeof setInterval> | null = null;
let initialized = false;
let pendingLoopReset: number | null = null;
let pointerId: number | null = null;
let pointerStart = 0;

// Derived state
const normalizedEffect = (): CarouselEffect => {
  const value = String(props.effect || "slide") as CarouselEffect;
  return CAROUSEL_EFFECTS.includes(value) ? value : "slide";
};

const normalizedType = (): CarouselType => {
  const value = String(props.type || "") as CarouselType;
  return CAROUSEL_TYPES.includes(value) ? value : "";
};

const normalizedArrowStyle = (): CarouselArrowStyle | "false" => {
  if (props.showArrow === false || String(props.showArrow) === "false") return "false";
  const value = String(props.showArrow || "circle") as CarouselArrowStyle;
  return CAROUSEL_ARROW_STYLES.includes(value) ? value : "circle";
};

const normalizedIndicatorType = (): CarouselIndicatorType => {
  const value = String(props.indicatorType || "dot") as CarouselIndicatorType;
  return CAROUSEL_INDICATOR_TYPES.includes(value) ? value : "dot";
};

const normalizedTrigger = (): CarouselTrigger => {
  const value = String(props.trigger || "hover") as CarouselTrigger;
  return CAROUSEL_TRIGGERS.includes(value) ? value : "hover";
};

const normalizedArrow = (): CarouselArrow => {
  const value = String(props.arrow || "hover") as CarouselArrow;
  return CAROUSEL_ARROWS.includes(value) ? value : "hover";
};

const normalizedIndicatorPosition = (): CarouselIndicatorPosition => {
  const value = String(props.indicatorPosition || "") as CarouselIndicatorPosition;
  return CAROUSEL_INDICATOR_POSITIONS.includes(value) ? value : "";
};

const normalizedDirection = (): CarouselDirection => {
  const value = String(props.direction || "horizontal") as CarouselDirection;
  return CAROUSEL_DIRECTIONS.includes(value) ? value : "horizontal";
};

const autoplayInterval = (): number =>
  Math.max(MIN_AUTOPLAY_INTERVAL, Math.trunc(Number(props.interval) || 0));

const slides = (): HTMLElement[] => Array.from(host.children) as HTMLElement[];
const trackElement = (): HTMLElement | null =>
  host.shadowRoot?.querySelector<HTMLElement>(".track") ?? null;

const isCardMode = (): boolean =>
  normalizedType() === "card" &&
  slides().length > 0 &&
  slides().every((child) => child.tagName === "ELF-CAROUSEL-ITEM");

const isLoopSlideMode = (): boolean =>
  Boolean(props.loop) && normalizedEffect() !== "fade" && !isCardMode() && total.value > 1;

const usesSlideTrack = (): boolean => normalizedEffect() === "slide" && !isCardMode();
const normalVisualIndex = (index: number): number => (usesSlideTrack() ? index + 1 : index);

const clampIndex = (index: number): number => {
  const max = Math.max(0, total.value - 1);
  return Math.min(max, Math.max(0, Math.trunc(Number(index)) || 0));
};

const cardOffset = (index: number): number => {
  let offset = index - active.value;
  if (props.loop && total.value > 2) {
    const half = total.value / 2;
    if (offset > half) offset -= total.value;
    if (offset < -half) offset += total.value;
  }
  return offset;
};

const reducedMotionBlocksAutoplay = (): boolean =>
  Boolean(props.respectReducedMotion) && reducedMotion.value && !reducedMotionOverride.value;

const canAutoplay = (): boolean =>
  Boolean(props.autoplay) &&
  total.value > 1 &&
  !manualPaused.value &&
  !hoverPaused.value &&
  !focusPaused.value &&
  !pageHidden.value &&
  !reducedMotionBlocksAutoplay();

const canGoPrevious = (): boolean => total.value > 1 && (Boolean(props.loop) || active.value > 0);

const canGoNext = (): boolean =>
  total.value > 1 && (Boolean(props.loop) || active.value < total.value - 1);

const dots = useComputed(() => Array.from({ length: total.value }, (_, index) => index));
const showArrows = useComputed(
  () => normalizedArrow() !== "never" && normalizedArrowStyle() !== "false" && total.value > 1,
);
const showIndicators = useComputed(
  () => Boolean(props.showIndicator) && normalizedIndicatorPosition() !== "none" && total.value > 1,
);
const showPlaybackControl = useComputed(
  () => Boolean(props.showPlayControl) && Boolean(props.autoplay) && total.value > 1,
);

const trackTransform = (): string => {
  if (isCardMode()) return "";
  const distance = visualIndex.value * 100;
  return normalizedDirection() === "vertical"
    ? `translateY(-${distance}%)`
    : `translateX(-${distance}%)`;
};

const playbackLabel = (): string => {
  const english = locale.name.toLowerCase().startsWith("en");
  if (playing.value) return english ? "Pause carousel" : "暂停轮播";
  return english ? "Play carousel" : "播放轮播";
};

// Methods
const setPlaying = (value: boolean): void => {
  if (playing.value === value) return;
  playing.set(value);
  emit("play-state-change", value);
};

const clearTimer = (notify = true): void => {
  if (timer) clearInterval(timer);
  timer = null;
  if (notify) setPlaying(false);
};

const startTimer = (): void => {
  if (timer) clearInterval(timer);
  timer = null;
  if (!canAutoplay()) {
    setPlaying(false);
    return;
  }
  timer = setInterval(doNext, autoplayInterval());
  setPlaying(true);
};

const stripCloneInteraction = (root: HTMLElement): void => {
  root.removeAttribute("id");
  root.setAttribute("aria-hidden", "true");
  root.setAttribute("inert", "");
  root.setAttribute("tabindex", "-1");
  root
    .querySelectorAll<HTMLElement>("[id], a, button, input, select, textarea, [tabindex]")
    .forEach((element) => {
      element.removeAttribute("id");
      element.setAttribute("tabindex", "-1");
      element.setAttribute("aria-hidden", "true");
    });
};

const syncLoopClones = (): void => {
  const root = host.shadowRoot;
  const firstClone = root?.querySelector<HTMLElement>(".loop-clone--first");
  const lastClone = root?.querySelector<HTMLElement>(".loop-clone--last");
  if (!firstClone || !lastClone) return;

  firstClone.replaceChildren();
  lastClone.replaceChildren();
  if (!isLoopSlideMode()) return;

  const items = slides();
  const first = items[0]?.cloneNode(true) as HTMLElement | undefined;
  const last = items[items.length - 1]?.cloneNode(true) as HTMLElement | undefined;
  if (first) {
    stripCloneInteraction(first);
    firstClone.append(first);
  }
  if (last) {
    stripCloneInteraction(last);
    lastClone.append(last);
  }
};

const syncSlides = (): void => {
  slides().forEach((slide, index) => {
    const isActive = index === active.value;
    slide.setAttribute("index", String(index));
    slide.setAttribute("total", String(total.value));
    slide.toggleAttribute("active", isActive);
    slide.toggleAttribute("inert", !isActive);
    slide.setAttribute("aria-hidden", isActive ? "false" : "true");
  });
};

const applyCard = (): void => {
  if (!isCardMode()) {
    slides().forEach((slide) => {
      slide.style.removeProperty("--_card-offset");
      slide.style.removeProperty("--_card-opacity");
      slide.style.removeProperty("--_card-scale");
      slide.style.removeProperty("--_card-z-index");
    });
    return;
  }

  slides().forEach((slide, index) => {
    const offset = cardOffset(index);
    slide.style.setProperty("--_card-offset", String(offset));
    slide.style.setProperty("--_card-opacity", Math.abs(offset) <= 1 ? "1" : "0");
    slide.style.setProperty("--_card-scale", offset === 0 ? "1" : "0.84");
    slide.style.setProperty("--_card-z-index", String(total.value - Math.abs(offset)));
  });
};

const applyFade = (): void => {
  if (normalizedEffect() !== "fade") {
    slides().forEach((slide) => {
      slide.style.removeProperty("opacity");
      slide.style.removeProperty("pointer-events");
    });
    return;
  }
  slides().forEach((slide, index) => {
    const isActive = index === active.value;
    slide.style.opacity = isActive ? "1" : "0";
    slide.style.pointerEvents = isActive ? "auto" : "none";
  });
};

const setActive = (index: number, direction?: "previous" | "next"): boolean => {
  const next = clampIndex(index);
  const previous = active.value;
  if (next === previous) return false;

  const wrapsForward =
    isLoopSlideMode() && direction === "next" && previous === total.value - 1 && next === 0;
  const wrapsBackward =
    isLoopSlideMode() && direction === "previous" && previous === 0 && next === total.value - 1;

  active.set(next);
  if (wrapsForward) {
    visualIndex.set(total.value + 1);
    pendingLoopReset = 1;
  } else if (wrapsBackward) {
    visualIndex.set(0);
    pendingLoopReset = total.value;
  } else {
    visualIndex.set(normalVisualIndex(next));
    pendingLoopReset = null;
  }
  emit("change", next, previous);
  return true;
};

const doPrevious = (): void => {
  if (!canGoPrevious()) return;
  const next = active.value > 0 ? active.value - 1 : total.value - 1;
  if (setActive(next, "previous")) startTimer();
};

const doNext = (): void => {
  if (!canGoNext()) {
    clearTimer();
    return;
  }
  const next = active.value < total.value - 1 ? active.value + 1 : 0;
  if (setActive(next, "next")) startTimer();
};

const goTo = (index: number): void => {
  if (index < 0 || index >= total.value) return;
  if (setActive(index)) startTimer();
};

const pause = (): void => {
  manualPaused.set(true);
  startTimer();
};

const play = (): void => {
  manualPaused.set(false);
  reducedMotionOverride.set(true);
  startTimer();
};

const togglePlayback = (event: Event): void => {
  event.preventDefault();
  event.stopPropagation();
  if (playing.value) pause();
  else play();
};

const stopPointerEvent = (event: Event): void => event.stopPropagation();

const onPreviousClick = (event: Event): void => {
  event.preventDefault();
  event.stopPropagation();
  doPrevious();
};

const onNextClick = (event: Event): void => {
  event.preventDefault();
  event.stopPropagation();
  doNext();
};

const onTrackTransitionEnd = (event: TransitionEvent): void => {
  if (event.propertyName !== "transform" || pendingLoopReset == null) return;
  const track = trackElement();
  if (!track) return;

  const resetTo = pendingLoopReset;
  pendingLoopReset = null;
  track.classList.add("is-resetting");
  visualIndex.set(resetTo);
  requestAnimationFrame(() => {
    void track.offsetWidth;
    track.classList.remove("is-resetting");
  });
};

const pointerCoordinate = (event: PointerEvent): number =>
  normalizedDirection() === "vertical" ? event.clientY : event.clientX;

const onPointerDown = (event: PointerEvent): void => {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  pointerId = event.pointerId;
  pointerStart = pointerCoordinate(event);
  (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
};

const onPointerUp = (event: PointerEvent): void => {
  if (pointerId !== event.pointerId) return;
  const distance = pointerCoordinate(event) - pointerStart;
  pointerId = null;
  if (Math.abs(distance) < SWIPE_THRESHOLD) return;
  if (distance > 0) doPrevious();
  else doNext();
};

const onPointerCancel = (): void => {
  pointerId = null;
};

const setActiveItem = (item: number | string): void => {
  if (typeof item === "number") {
    goTo(item);
    return;
  }
  const index = slides().findIndex(
    (child) => child.getAttribute("label") === item || child.getAttribute("name") === item,
  );
  if (index >= 0) goTo(index);
};

const onMouseEnter = (): void => {
  if (!props.pauseOnHover) return;
  hoverPaused.set(true);
  startTimer();
};

const onMouseLeave = (): void => {
  if (!props.pauseOnHover) return;
  hoverPaused.set(false);
  startTimer();
};

const onFocusIn = (): void => {
  if (!props.pauseOnFocus) return;
  focusPaused.set(true);
  startTimer();
};

const onFocusOut = (): void => {
  if (!props.pauseOnFocus) return;
  queueMicrotask(() => {
    focusPaused.set(host.matches(":focus-within"));
    startTimer();
  });
};

const indicatorIndex = (event: Event): number => {
  const value = (event.currentTarget as HTMLElement | null)?.dataset.index;
  return value == null ? -1 : Number(value);
};

const onIndicatorClick = (event: Event): void => {
  if (normalizedTrigger() === "click") goTo(indicatorIndex(event));
};

const onIndicatorEnter = (event: Event): void => {
  if (normalizedTrigger() === "hover") goTo(indicatorIndex(event));
};

const onKeydown = (event: KeyboardEvent): void => {
  const previousKey = normalizedDirection() === "vertical" ? "ArrowUp" : "ArrowLeft";
  const nextKey = normalizedDirection() === "vertical" ? "ArrowDown" : "ArrowRight";
  if (event.key === previousKey) {
    event.preventDefault();
    doPrevious();
  } else if (event.key === nextKey) {
    event.preventDefault();
    doNext();
  } else if (event.key === "Home") {
    event.preventDefault();
    goTo(0);
  } else if (event.key === "End") {
    event.preventDefault();
    goTo(total.value - 1);
  }
};

const updateTotal = (): void => {
  const previous = active.value;
  const wasInitialized = initialized;
  total.set(slides().length);
  if (!initialized) {
    active.set(clampIndex(props.initialIndex));
    initialized = true;
  } else {
    active.set(clampIndex(active.value));
  }
  visualIndex.set(normalVisualIndex(active.value));
  pendingLoopReset = null;
  syncLoopClones();
  syncSlides();
  applyFade();
  applyCard();
  startTimer();
  if (wasInitialized && previous !== active.value) emit("change", active.value, previous);
};

const onDocumentVisibilityChange = (): void => {
  pageHidden.set(document.hidden);
  startTimer();
};

useHostAttr("effect", normalizedEffect);
useHostAttr("type", normalizedType);
useHostAttr("show-arrow", normalizedArrowStyle);
useHostAttr("indicator-type", normalizedIndicatorType);
useHostAttr("trigger", normalizedTrigger);
useHostAttr("arrow", normalizedArrow);
useHostAttr("indicator-position", normalizedIndicatorPosition);
useHostAttr("direction", normalizedDirection);
useHostFlag("playing", () => playing.value);
useHostFlag("paused", () => Boolean(props.autoplay) && !playing.value);
useHostFlag("reduced-motion", () => reducedMotionBlocksAutoplay());

onMounted(() => {
  const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  const onMotionChange = (): void => {
    reducedMotion.set(Boolean(media?.matches));
    if (!media?.matches) reducedMotionOverride.set(false);
    startTimer();
  };

  pageHidden.set(document.hidden);
  reducedMotion.set(Boolean(media?.matches));
  updateTotal();
  document.addEventListener("visibilitychange", onDocumentVisibilityChange);
  media?.addEventListener?.("change", onMotionChange);

  return () => {
    clearTimer(false);
    document.removeEventListener("visibilitychange", onDocumentVisibilityChange);
    media?.removeEventListener?.("change", onMotionChange);
  };
});

useEffect(() => {
  void active.value;
  void total.value;
  void props.type;
  void props.loop;
  void props.effect;
  void props.direction;
  syncLoopClones();
  applyFade();
  syncSlides();
  applyCard();
});

useEffect(() => {
  void props.autoplay;
  void props.interval;
  void props.pauseOnHover;
  void props.pauseOnFocus;
  void props.respectReducedMotion;
  void manualPaused.value;
  void hoverPaused.value;
  void focusPaused.value;
  void pageHidden.value;
  void reducedMotion.value;
  void reducedMotionOverride.value;
  void total.value;
  startTimer();
});

defineExpose({
  get activeIndex() {
    return active.peek();
  },
  get isPlaying() {
    return playing.peek();
  },
  setActiveItem,
  prev: doPrevious,
  next: doNext,
  pause,
  play,
});

defineStyle(styles);

const Carousel = defineHtml<CarouselProps, CarouselEmits>(`
  <div
    class="carousel"
    :style=${{
      height: props.height,
      borderRadius: props.radius,
      "--_dur": props.duration,
    }}
    role="region"
    aria-roledescription="carousel"
    :aria-label=${props.ariaLabel}
    :aria-live=${playing ? "off" : "polite"}
    tabindex="0"
    @mouseenter=${onMouseEnter}
    @mouseleave=${onMouseLeave}
    @focusin=${onFocusIn}
    @focusout=${onFocusOut}
    @keydown=${onKeydown}
    @pointerdown=${onPointerDown}
    @pointerup=${onPointerUp}
    @pointercancel=${onPointerCancel}
  >
    <div
      class="track"
      :style=${normalizedEffect() !== "fade" ? { transform: trackTransform() } : {}}
      @transitionend=${onTrackTransitionEnd}
    >
      <div class="loop-clone loop-clone--last" aria-hidden="true"></div>
      <slot @slotchange=${updateTotal}></slot>
      <div class="loop-clone loop-clone--first" aria-hidden="true"></div>
    </div>

    <button
      v-if=${showPlaybackControl}
      class="play-control"
      type="button"
      :aria-label=${playbackLabel()}
      :aria-pressed=${String(!playing)}
      @pointerdown.stop=${stopPointerEvent}
      @pointerup.stop=${stopPointerEvent}
      @click=${togglePlayback}
    >
      <span v-if=${playing} class="pause-icon" aria-hidden="true"></span>
      <span v-else class="play-icon" aria-hidden="true"></span>
    </button>

    <div class="arrows" v-if=${showArrows}>
      <button
        class="arrow arrow-left"
        type="button"
        :disabled=${!canGoPrevious()}
        :aria-label=${locale.t("carousel.previous")}
        @pointerdown.stop=${stopPointerEvent}
        @pointerup.stop=${stopPointerEvent}
        @click=${onPreviousClick}
      >
        <span aria-hidden="true"></span>
      </button>
      <button
        class="arrow arrow-right"
        type="button"
        :disabled=${!canGoNext()}
        :aria-label=${locale.t("carousel.next")}
        @pointerdown.stop=${stopPointerEvent}
        @pointerup.stop=${stopPointerEvent}
        @click=${onNextClick}
      >
        <span aria-hidden="true"></span>
      </button>
    </div>

    <div
      class="indicators"
      v-if=${showIndicators && normalizedIndicatorPosition() !== "outside"}
      role="group"
      :aria-label=${locale.t("carousel.pagination")}
    >
      <button
        v-for="(dot, idx) in dots"
        :key="idx"
        class="dot"
        :class="{ 'is-active': idx === active }"
        :data-index="idx"
        :aria-label='locale.t("carousel.goTo", { page: idx + 1 })'
        :aria-current="idx === active ? 'true' : undefined"
        type="button"
        @click=${onIndicatorClick}
        @mouseenter=${onIndicatorEnter}
      >
        <span v-if=${normalizedIndicatorType() === "number"}>{{ idx + 1 }}</span>
      </button>
    </div>
  </div>

  <div
    class="indicators"
    v-if=${showIndicators && normalizedIndicatorPosition() === "outside"}
    role="group"
    :aria-label=${locale.t("carousel.pagination")}
    @focusin=${onFocusIn}
    @focusout=${onFocusOut}
  >
    <button
      v-for="(dot, idx) in dots"
      :key="idx"
      class="dot"
      :class="{ 'is-active': idx === active }"
      :data-index="idx"
      :aria-label='locale.t("carousel.goTo", { page: idx + 1 })'
      :aria-current="idx === active ? 'true' : undefined"
      type="button"
      @click=${onIndicatorClick}
      @mouseenter=${onIndicatorEnter}
    >
      <span v-if=${normalizedIndicatorType() === "number"}>{{ idx + 1 }}</span>
    </button>
  </div>
`);

export { Carousel };
