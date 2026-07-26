// elf-dropdown 类型定义

export type DropdownTriggerMode = "click" | "hover" | "contextmenu";
export type DropdownTrigger = DropdownTriggerMode | DropdownTriggerMode[];
export type DropdownPlacement =
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "top"
  | "top-start"
  | "top-end";
export type DropdownSize = "sm" | "md" | "lg";
export type DropdownButtonType = "default" | "primary" | "success" | "warning" | "danger" | "info";
export type DropdownEffect = "light" | "dark" | string;
export type DropdownCommand = string | number | Record<string, unknown>;

export interface DropdownPopperModifier {
  name: string;
  enabled?: boolean;
  options?: {
    offset?: [number, number];
    padding?: number;
    [key: string]: unknown;
  };
}

export interface DropdownPopperOptions {
  strategy?: "absolute" | "fixed";
  placement?: DropdownPlacement;
  modifiers?: DropdownPopperModifier[];
  [key: string]: unknown;
}

export interface DropdownVirtualRef {
  getBoundingClientRect: () => DOMRect | DOMRectReadOnly;
  addEventListener?: EventTarget["addEventListener"];
  removeEventListener?: EventTarget["removeEventListener"];
}

export interface DropdownButtonProps {
  class?: string;
  style?: Record<string, string | number>;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface DropdownFieldNames {
  label?: string;
  command?: string;
  icon?: string;
  disabled?: string;
  divided?: string;
  shortcut?: string;
  children?: string;
}

export interface DropdownItem {
  label?: string;
  command?: DropdownCommand;
  icon?: string;
  disabled?: boolean;
  divided?: boolean;
  shortcut?: string;
  children?: DropdownItem[];
  [key: string]: unknown;
}

export interface DropdownCommandDetail {
  command: DropdownCommand;
  item: DropdownItem;
}

export interface DropdownProps {
  items: DropdownItem[];
  label: string;
  trigger: DropdownTrigger;
  placement: DropdownPlacement;
  size: DropdownSize;
  type: DropdownButtonType;
  buttonProps: DropdownButtonProps;
  effect: DropdownEffect;
  triggerKeys: string[];
  virtualTriggering: boolean;
  virtualRef?: DropdownVirtualRef | null;
  showArrow: boolean;
  showTimeout: number;
  hideTimeout: number;
  role: string;
  tabindex: number;
  popperClass: string;
  popperStyle: Record<string, string | number>;
  popperOptions: DropdownPopperOptions;
  teleported: boolean;
  appendTo: string | HTMLElement;
  persistent: boolean;
  closeOnClickOutside: boolean;
  disabled: boolean;
  hideOnClick: boolean;
  splitButton: boolean;
  maxHeight: string | number;
  props: DropdownFieldNames;
}

export type DropdownEmits = {
  command: [detail: DropdownCommandDetail];
  "visible-change": [visible: boolean];
  click: [event: Event];
};

export interface DropdownSlots {
  default?: unknown;
  trigger?: () => unknown;
  main?: () => unknown;
  dropdown?: () => unknown;
}

export interface DropdownMenuProps {
  role: string;
}

export interface DropdownMenuSlots {
  default?: unknown;
}

export interface DropdownItemProps {
  command: DropdownCommand;
  disabled: boolean;
  divided: boolean;
  icon: string;
  /** Parent-managed selected state for compositional menus. */
  selected?: boolean;
}

export interface DropdownItemSlots {
  default?: unknown;
  icon?: unknown;
}

export interface DropdownExpose {
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}

export type DropdownElement = HTMLElement & DropdownExpose & Partial<DropdownProps>;
