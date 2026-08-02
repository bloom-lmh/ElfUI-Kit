import type { MenuPopperStyle } from "./types";
import { toOptionalNumber, type MenuRawItem, type MenuViewItem } from "./model";

const MENU_CHILD_TAGS = new Set(["elf-menu-item", "elf-sub-menu", "elf-menu-item-group"]);

const elementValue = (element: HTMLElement, name: string): unknown => {
  const value = (element as unknown as Record<string, unknown>)[name];
  if (value !== undefined && value !== null && value !== "") return value;
  const attribute = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return element.getAttribute(attribute) ?? undefined;
};

const elementBoolean = (element: HTMLElement, name: string, fallback = false): boolean => {
  const value = elementValue(element, name);
  if (value === undefined) return fallback;
  return value !== false && value !== "false";
};

const titleText = (element: HTMLElement): string => {
  const title = elementValue(element, "title");
  if (title !== undefined) return String(title);
  const source = Array.from(element.children).find(
    (child): child is HTMLElement => child instanceof HTMLElement && child.slot === "title",
  );
  return source?.textContent?.trim() || "";
};

const compositionChildren = (parent: HTMLElement): HTMLElement[] =>
  Array.from(parent.children).filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && MENU_CHILD_TAGS.has(child.tagName.toLowerCase()),
  );

const normalizeCompositionItem = (
  element: HTMLElement,
  level: number,
  ancestors: string[],
  fallbackIndex: string,
): MenuViewItem => {
  const tag = element.tagName.toLowerCase();
  const group = tag === "elf-menu-item-group";
  const submenu = tag === "elf-sub-menu";
  const index = group
    ? `__group_${fallbackIndex}`
    : String(elementValue(element, "index") ?? fallbackIndex);
  const title = titleText(element) || index;
  const children =
    submenu || group
      ? compositionChildren(element).map((child, childIndex) =>
          normalizeCompositionItem(
            child,
            level + 1,
            group ? ancestors : [...ancestors, index],
            `${fallbackIndex}-${childIndex}`,
          ),
        )
      : [];

  return {
    raw: { source: element } as MenuRawItem,
    index,
    label: title,
    title,
    icon: String(elementValue(element, "icon") ?? ""),
    disabled: elementBoolean(element, "disabled"),
    badge: String(elementValue(element, "badge") ?? ""),
    divider: false,
    group,
    route: elementValue(element, "route"),
    popperClass: String(elementValue(element, "popperClass") ?? ""),
    popperStyle: (elementValue(element, "popperStyle") ?? {}) as MenuPopperStyle,
    teleported: elementBoolean(element, "teleported", level === 0),
    popperOffset: toOptionalNumber(elementValue(element, "popperOffset")),
    showTimeout: toOptionalNumber(elementValue(element, "showTimeout")),
    hideTimeout: toOptionalNumber(elementValue(element, "hideTimeout")),
    expandCloseIcon: String(elementValue(element, "expandCloseIcon") ?? ""),
    expandOpenIcon: String(elementValue(element, "expandOpenIcon") ?? ""),
    collapseCloseIcon: String(elementValue(element, "collapseCloseIcon") ?? ""),
    collapseOpenIcon: String(elementValue(element, "collapseOpenIcon") ?? ""),
    source: element,
    level,
    indexPath: ancestors,
    hasChildren: children.length > 0,
    children,
  };
};

export const normalizeCompositionItems = (host: HTMLElement): MenuViewItem[] =>
  compositionChildren(host).map((child, index) =>
    normalizeCompositionItem(child, 0, [], String(index)),
  );
