import type { RouteLocationRaw } from "@elfui/router";

export type LinkType = "default" | "primary" | "success" | "warning" | "danger" | "info";

export interface LinkProps {
  type: LinkType;
  underline: boolean;
  disabled: boolean;
  href: string;
  to: RouteLocationRaw | "";
  replace: boolean;
  target: string;
  rel: string;
  activeClass: string;
  exactActiveClass: string;
  icon: string;
}

export interface LinkEmits {
  navigate: [to: RouteLocationRaw];
}

export interface LinkSlots {
  default?: unknown;
  icon?: unknown;
}
