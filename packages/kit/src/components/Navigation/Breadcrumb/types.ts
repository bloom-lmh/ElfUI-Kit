export interface BreadcrumbFieldNames {
  label?: string;
  to?: string;
  disabled?: string;
  replace?: string;
}

export interface BreadcrumbRouteLocation {
  path?: string;
  name?: string;
  hash?: string;
}

export interface BreadcrumbItem {
  label?: string;
  to?: string | BreadcrumbRouteLocation;
  disabled?: boolean;
  replace?: boolean;
  [key: string]: unknown;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator: string;
  separatorIcon: string;
  router: boolean;
  currentPath: string;
  maxItems: number;
  props: BreadcrumbFieldNames;
}

export interface BreadcrumbSlots {
  default?: unknown;
}

export interface BreadcrumbItemProps {
  to: string | BreadcrumbRouteLocation;
  replace: boolean;
  /** Parent-managed compositional state. */
  current: boolean;
  /** Parent-managed compositional state. */
  last: boolean;
  /** Parent-managed separator. */
  separator: string;
  /** Parent-managed separator icon. */
  separatorIcon: string;
}

export interface BreadcrumbItemSlots {
  default?: unknown;
}
