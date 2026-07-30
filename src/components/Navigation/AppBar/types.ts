import type { ScrollContainerTarget } from "../../../composables/scroll";

export type AppBarDensity = "default" | "comfortable" | "compact" | "prominent";

export type AppBarScrollBehavior =
  | ""
  | "hide"
  | "collapse"
  | "elevate"
  | "fade-image"
  | "inverted"
  | string;

export interface AppBarProps {
  title: string;
  ariaLabel: string;
  density: AppBarDensity;
  image: string;
  imageAlt: string;
  imagePosition: string;
  imageOpacity: number;
  color: string;
  elevation: number;
  height: string | number;
  extensionHeight: string | number;
  border: boolean;
  rounded: boolean;
  fixed: boolean;
  sticky: boolean;
  collapsed: boolean;
  scrollBehavior: AppBarScrollBehavior;
  scrollTarget: ScrollContainerTarget;
  scrollThreshold: number;
}

export interface AppBarEmits {
  scroll: [position: number, direction: "up" | "down"];
}

export interface AppBarSlots {
  prepend?: unknown;
  title?: unknown;
  default?: unknown;
  append?: unknown;
  extension?: unknown;
  background?: unknown;
}
