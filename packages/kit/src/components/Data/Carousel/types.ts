// elf-carousel 类型定义

export type CarouselEffect = "slide" | "fade";
export type CarouselType = "" | "card";
export type CarouselArrowStyle = "circle" | "square" | "ghost";
export type CarouselIndicatorType = "dot" | "line" | "number";
export type CarouselArrow = "always" | "hover" | "never";
export type CarouselTrigger = "hover" | "click";
export type CarouselDirection = "horizontal" | "vertical";
export type CarouselIndicatorPosition = "" | "outside" | "none";

export interface CarouselProps {
  effect: CarouselEffect;
  /** Card layout requires direct `elf-carousel-item` children. */
  type: CarouselType;
  autoplay: boolean;
  interval: number;
  loop: boolean;
  showArrow: CarouselArrowStyle | false;
  showIndicator: boolean;
  indicatorType: CarouselIndicatorType;
  /** 轮播高度 */
  height: string;
  /** 过渡时长 */
  duration: string;
  /** 悬停暂停 */
  pauseOnHover: boolean;
  /** Pause autoplay while the carousel or one of its controls has focus. */
  pauseOnFocus: boolean;
  /** Disable automatic movement when the operating system requests reduced motion. */
  respectReducedMotion: boolean;
  /** Render an accessible play/pause control when autoplay is enabled. */
  showPlayControl: boolean;
  /** 圆角 */
  radius: string;
  /** Initial zero-based slide index. */
  initialIndex: number;
  /** How indicators activate a slide. */
  trigger: CarouselTrigger;
  /** When navigation arrows are visible. */
  arrow: CarouselArrow;
  /** Indicator placement; `none` hides the indicators. */
  indicatorPosition: CarouselIndicatorPosition;
  /** Axis used by the slide transition. */
  direction: CarouselDirection;
  /** Accessible label for the carousel region. */
  ariaLabel: string;
}

export interface CarouselEmits {
  change: [current: number, previous: number];
  "play-state-change": [playing: boolean];
}

export interface CarouselExposes {
  readonly activeIndex: number;
  readonly isPlaying: boolean;
  setActiveItem(item: number | string): void;
  prev(): void;
  next(): void;
  pause(): void;
  play(): void;
}

export interface CarouselItemProps {
  /** Stable item identifier used by `setActiveItem`. */
  name: string | number;
  /** Human-readable item label used for assistive technology. */
  label: string;
  /** Overrides the generated accessible label. */
  ariaLabel: string;
  /** @internal Set by the owning carousel. */
  active: boolean;
  /** @internal Set by the owning carousel. */
  index: number;
  /** @internal Set by the owning carousel. */
  total: number;
}
