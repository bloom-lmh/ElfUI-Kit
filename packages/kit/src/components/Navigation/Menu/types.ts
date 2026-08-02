export type MenuMode = "vertical" | "horizontal";
export type MenuTheme = "light" | "dark";
export type MenuTogglePlacement = "footer" | "header";
export type MenuTrigger = "hover" | "click";
export type MenuPopperStyle = string | Record<string, string | number>;

export interface MenuFieldNames {
  index?: string;
  label?: string;
  title?: string;
  icon?: string;
  disabled?: string;
  children?: string;
  badge?: string;
  divider?: string;
  group?: string;
  route?: string;
  popperClass?: string;
  popperStyle?: string;
  teleported?: string;
  popperOffset?: string;
  showTimeout?: string;
  hideTimeout?: string;
  expandCloseIcon?: string;
  expandOpenIcon?: string;
  collapseCloseIcon?: string;
  collapseOpenIcon?: string;
}

export interface MenuItem {
  index?: string;
  label?: string;
  title?: string;
  icon?: string;
  disabled?: boolean;
  children?: MenuItem[];
  badge?: string | number;
  divider?: boolean;
  group?: string;
  route?: string | Record<string, unknown>;
  popperClass?: string;
  popperStyle?: MenuPopperStyle;
  teleported?: boolean;
  popperOffset?: number;
  showTimeout?: number;
  hideTimeout?: number;
  expandCloseIcon?: string;
  expandOpenIcon?: string;
  collapseCloseIcon?: string;
  collapseOpenIcon?: string;
  [key: string]: unknown;
}

export interface MenuProps {
  items: MenuItem[];
  modelValue: string;
  defaultActive: string;
  defaultOpeneds: string[];
  mode: MenuMode;
  theme: MenuTheme;
  collapse: boolean;
  ellipsis: boolean;
  ellipsisIcon: string;
  popperOffset: number;
  menuTrigger: MenuTrigger;
  collapseTransition: boolean;
  popperEffect: string;
  closeOnClickOutside: boolean;
  popperClass: string;
  popperStyle: MenuPopperStyle;
  showTimeout: number;
  hideTimeout: number;
  persistent: boolean;
  uniqueOpened: boolean;
  router: boolean;
  props: MenuFieldNames;
  backgroundColor: string;
  textColor: string;
  activeTextColor: string;
  activeBackground: string;
  width: string;
  collapseWidth: string;
  indent: number;
  rounded: boolean;
  elevation: boolean;
  bordered: boolean;
  showToggle: boolean;
  togglePlacement: MenuTogglePlacement;
  searchable: boolean;
  searchPlaceholder: string;
}

export interface SubMenuProps {
  index: string;
  title?: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
  popperClass?: string;
  popperStyle?: MenuPopperStyle;
  showTimeout?: number;
  hideTimeout?: number;
  teleported?: boolean;
  popperOffset?: number;
  expandCloseIcon?: string;
  expandOpenIcon?: string;
  collapseCloseIcon?: string;
  collapseOpenIcon?: string;
}

export interface MenuItemProps {
  index: string;
  title?: string;
  icon?: string;
  badge?: string | number;
  route?: string | Record<string, unknown>;
  disabled?: boolean;
}

export interface MenuItemGroupProps {
  title?: string;
}

export interface MenuItemClickDetail {
  index: string;
  indexPath: string[];
  route?: string | Record<string, unknown>;
}

export interface MenuSlots {
  default?: unknown;
  header?: unknown;
  search?: unknown;
  footer?: unknown;
  toggle?: unknown;
}

export interface MenuItemSlots {
  default?: unknown;
  title?: unknown;
}

export interface SubMenuSlots extends MenuItemSlots {}

export interface MenuItemGroupSlots {
  default?: unknown;
  title?: unknown;
}

export interface MenuExpose {
  open: (index: string) => void;
  close: (index: string) => void;
  select: (index: string) => void;
  handleResize: () => void;
  updateActiveIndex: (index: string) => void;
}
