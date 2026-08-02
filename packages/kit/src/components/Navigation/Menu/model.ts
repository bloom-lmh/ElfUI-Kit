import type { MenuFieldNames, MenuPopperStyle, MenuTrigger } from "./types";

export type MenuRawItem = Record<string, unknown>;

export interface MenuViewItem {
  raw: MenuRawItem;
  index: string;
  label: string;
  title: string;
  icon: string;
  iconColor: string;
  disabled: boolean;
  badge: string;
  divider: boolean;
  group: boolean;
  route: unknown;
  popperClass: string;
  popperStyle: MenuPopperStyle;
  teleported: boolean;
  popperOffset?: number | undefined;
  showTimeout?: number | undefined;
  hideTimeout?: number | undefined;
  expandCloseIcon: string;
  expandOpenIcon: string;
  collapseCloseIcon: string;
  collapseOpenIcon: string;
  source?: HTMLElement;
  level: number;
  indexPath: string[];
  hasChildren: boolean;
  children: MenuViewItem[];
}

export interface VisibleMenuOptions {
  collapsed: boolean;
  opened: readonly string[];
  searchable: boolean;
  searchText: string;
}

const DEFAULT_FIELDS: Required<MenuFieldNames> = {
  index: "index",
  label: "label",
  title: "title",
  icon: "icon",
  iconColor: "iconColor",
  disabled: "disabled",
  children: "children",
  badge: "badge",
  divider: "divider",
  group: "group",
  route: "route",
  popperClass: "popperClass",
  popperStyle: "popperStyle",
  teleported: "teleported",
  popperOffset: "popperOffset",
  showTimeout: "showTimeout",
  hideTimeout: "hideTimeout",
  expandCloseIcon: "expandCloseIcon",
  expandOpenIcon: "expandOpenIcon",
  collapseCloseIcon: "collapseCloseIcon",
  collapseOpenIcon: "collapseOpenIcon",
};

export const resolveMenuFieldNames = (
  partial?: MenuFieldNames | null,
): Required<MenuFieldNames> => {
  const source = partial ?? {};
  return Object.fromEntries(
    Object.entries(DEFAULT_FIELDS).map(([key, fallback]) => [
      key,
      source[key as keyof MenuFieldNames] || fallback,
    ]),
  ) as unknown as Required<MenuFieldNames>;
};

export const toOptionalNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
};

const baseViewItem = (
  item: MenuRawItem,
  fields: Required<MenuFieldNames>,
  level: number,
  ancestors: string[],
): Pick<
  MenuViewItem,
  | "raw"
  | "icon"
  | "iconColor"
  | "badge"
  | "route"
  | "popperClass"
  | "popperStyle"
  | "teleported"
  | "popperOffset"
  | "showTimeout"
  | "hideTimeout"
  | "expandCloseIcon"
  | "expandOpenIcon"
  | "collapseCloseIcon"
  | "collapseOpenIcon"
  | "level"
  | "indexPath"
> => ({
  raw: item,
  icon: String(item[fields.icon] ?? ""),
  iconColor: String(item[fields.iconColor] ?? ""),
  badge: String(item[fields.badge] ?? ""),
  route: item[fields.route],
  popperClass: String(item[fields.popperClass] ?? ""),
  popperStyle: (item[fields.popperStyle] ?? {}) as MenuPopperStyle,
  teleported: item[fields.teleported] !== false,
  popperOffset: toOptionalNumber(item[fields.popperOffset]),
  showTimeout: toOptionalNumber(item[fields.showTimeout]),
  hideTimeout: toOptionalNumber(item[fields.hideTimeout]),
  expandCloseIcon: String(item[fields.expandCloseIcon] ?? ""),
  expandOpenIcon: String(item[fields.expandOpenIcon] ?? ""),
  collapseCloseIcon: String(item[fields.collapseCloseIcon] ?? ""),
  collapseOpenIcon: String(item[fields.collapseOpenIcon] ?? ""),
  level,
  indexPath: ancestors,
});

export const normalizeMenuItems = (
  rawItems: unknown,
  fields: Required<MenuFieldNames>,
  level = 0,
  ancestors: string[] = [],
): MenuViewItem[] => {
  if (!Array.isArray(rawItems)) return [];

  return rawItems.map((raw, position) => {
    const item = (raw || {}) as MenuRawItem;
    const divider = Boolean(item[fields.divider]);
    const group = Boolean(item[fields.group]) && !divider;
    const common = baseViewItem(item, fields, level, ancestors);

    if (divider) {
      return {
        ...common,
        index: `__divider_${level}_${position}`,
        label: "",
        title: "",
        icon: "",
        iconColor: "",
        disabled: false,
        badge: "",
        divider: true,
        group: false,
        route: undefined,
        popperClass: "",
        popperStyle: {},
        teleported: true,
        expandCloseIcon: "",
        expandOpenIcon: "",
        collapseCloseIcon: "",
        collapseOpenIcon: "",
        hasChildren: false,
        children: [],
      };
    }

    if (group) {
      const index = String(
        item[fields.index] ?? [...ancestors, `__group_${level}_${position}`].join("/"),
      );
      const label = String(item[fields.group] ?? "");
      const children = normalizeMenuItems(item[fields.children], fields, level + 1, ancestors);

      return {
        ...common,
        index,
        label,
        title: String(item[fields.title] ?? label),
        disabled: false,
        divider: false,
        group: true,
        hasChildren: children.length > 0,
        children,
      };
    }

    const index = String(item[fields.index] ?? [...ancestors, String(position)].join("-"));
    const children = normalizeMenuItems(item[fields.children], fields, level + 1, [
      ...ancestors,
      index,
    ]);

    return {
      ...common,
      index,
      label: String(item[fields.label] ?? item[fields.title] ?? index),
      title: String(item[fields.title] ?? item[fields.label] ?? index),
      disabled: Boolean(item[fields.disabled]),
      divider: false,
      group: false,
      hasChildren: children.length > 0,
      children,
    };
  });
};

export const findMenuItem = (
  items: readonly MenuViewItem[],
  index: string,
): MenuViewItem | undefined => {
  for (const item of items) {
    if (item.index === index) return item;
    const child = findMenuItem(item.children, index);
    if (child) return child;
  }
  return undefined;
};

export const flattenMenuItems = (items: readonly MenuViewItem[]): MenuViewItem[] => {
  const flattened: MenuViewItem[] = [];
  for (const item of items) {
    flattened.push(item);
    if (item.hasChildren) flattened.push(...flattenMenuItems(item.children));
  }
  return flattened;
};

export const getVisibleMenuItems = (
  items: readonly MenuViewItem[],
  options: VisibleMenuOptions,
): MenuViewItem[] => {
  const visible: MenuViewItem[] = [];
  const query = options.searchText.trim().toLocaleLowerCase();
  const opened = new Set(options.opened);

  for (const item of items) {
    const matches =
      !query ||
      item.label.toLocaleLowerCase().includes(query) ||
      item.index.toLocaleLowerCase().includes(query);
    if (options.searchable && query && !matches && !item.hasChildren) continue;

    visible.push(item);
    const shouldProjectChildren =
      !options.collapsed &&
      item.hasChildren &&
      (item.group || opened.has(item.index) || (options.searchable && Boolean(query)));
    if (shouldProjectChildren) {
      visible.push(...getVisibleMenuItems(item.children, options));
    }
  }

  return visible;
};

export const hasActiveMenuDescendant = (item: MenuViewItem, activeIndex: string): boolean =>
  item.children.some(
    (child) =>
      child.index === activeIndex ||
      (child.hasChildren && hasActiveMenuDescendant(child, activeIndex)),
  );

export const resolveMenuTrigger = (value: unknown, compatibilityValue: unknown): MenuTrigger =>
  String(value || compatibilityValue || "click") === "hover" ? "hover" : "click";

export const toMenuStyle = (value: unknown): Record<string, string> => {
  if (typeof value === "string") {
    return Object.fromEntries(
      value
        .split(";")
        .map((declaration) => declaration.split(":"))
        .filter((parts) => parts.length >= 2 && parts[0]?.trim())
        .map(([property, ...rest]) => [property!.trim(), rest.join(":").trim()]),
    );
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, string | number>).map(([key, item]) => [
      key,
      String(item),
    ]),
  );
};

export const resolveMenuRoutePath = (item: Pick<MenuViewItem, "index" | "route">): string => {
  if (typeof item.route === "string") return item.route;
  if (item.route && typeof item.route === "object" && "path" in item.route) {
    return String((item.route as { path?: unknown }).path || "");
  }
  return item.index;
};
