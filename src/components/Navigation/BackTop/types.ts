import type { GoToEasing } from "../../../composables/goTo";
import type { ScrollContainerTarget } from "../../../composables/scroll";

export type BackTopShape = "circle" | "square";

export interface BackTopProps {
  target: ScrollContainerTarget;
  visibilityHeight: number;
  right: string | number;
  bottom: string | number;
  zIndex: string | number;
  smooth: boolean;
  duration?: number;
  easing?: GoToEasing;
  shape: BackTopShape;
  size: string | number;
  icon: string;
  disabled: boolean;
}

export interface BackTopElement {
  scrollToTop: () => void;
}

export interface BackTopSlots {
  default?: unknown;
}
