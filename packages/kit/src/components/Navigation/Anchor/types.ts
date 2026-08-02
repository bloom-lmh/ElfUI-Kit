export interface AnchorFieldNames {
  title?: string;
  href?: string;
  disabled?: string;
  children?: string;
}

export interface AnchorItem {
  title?: string;
  href?: string;
  disabled?: boolean;
  children?: AnchorItem[];
  [key: string]: unknown;
}

export interface AnchorClickDetail {
  href: string;
  item: AnchorItem;
  event: Event;
}

export interface AnchorChangeDetail {
  href: string;
  oldHref: string;
}

export interface AnchorProps {
  items: AnchorItem[];
  modelValue: string;
  defaultActive: string;
  container: ScrollContainerTarget;
  offset: number;
  bound?: number;
  bounds: number;
  duration?: number;
  easing?: GoToEasing;
  marker: boolean;
  type: "default" | "underline";
  direction: "vertical" | "horizontal";
  selectScrollTop: boolean;
  smooth: boolean;
  props: AnchorFieldNames;
}

export interface AnchorSlots {
  default?: unknown;
}

export interface AnchorLinkProps {
  title: string;
  href: string;
  /** Parent-managed active state. */
  active?: boolean;
  /** Parent-managed nesting level. */
  level?: number;
  /** Parent-managed layout direction. */
  direction?: "vertical" | "horizontal";
}

export interface AnchorLinkSlots {
  default?: unknown;
  "sub-link"?: unknown;
}

export interface AnchorElement {
  /** Safe Custom Element method; `scrollTo` is reserved by HTMLElement. */
  scrollToAnchor: (href: string) => void;
}
import type { GoToEasing } from "../../../composables/goTo";
import type { ScrollContainerTarget } from "../../../composables/scroll";
