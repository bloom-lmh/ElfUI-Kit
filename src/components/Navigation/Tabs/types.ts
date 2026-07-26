export type TabsAlign = "start" | "center" | "end" | "title";
export type TabsDensity = "compact" | "default" | "comfortable";
export type TabsDirection = "horizontal" | "vertical";
export type TabsType = "line" | "card" | "border-card";
export type TabsPosition = "top" | "right" | "bottom" | "left";
export type TabsTransition = "fade" | "slide" | "scale" | "none" | "custom";
export type TabPaneName = string | number;
export type TabsBeforeLeave = (
  newName: TabPaneName,
  oldName: TabPaneName
) => boolean | void | Promise<boolean | void>;

export interface TabsFieldNames {
  label?: string;
  value?: string;
  icon?: string;
  disabled?: string;
  closable?: string;
  lazy?: string;
  badge?: string;
  content?: string;
}

export interface TabsItem {
  label?: string;
  value?: TabPaneName;
  icon?: string;
  disabled?: boolean;
  closable?: boolean;
  lazy?: boolean;
  badge?: string | number;
  content?: string;
  [key: string]: unknown;
}

export interface TabsProps {
  items: TabsItem[];
  modelValue: TabPaneName | "";
  defaultValue: TabPaneName | "";
  alignTabs: TabsAlign;
  density: TabsDensity;
  direction: TabsDirection;
  type: TabsType;
  closable: boolean;
  addable: boolean;
  editable: boolean;
  tabPosition: TabsPosition;
  stretch: boolean;
  beforeLeave?: TabsBeforeLeave;
  tabindex: number;
  color: string;
  backgroundColor: string;
  sliderColor: string;
  grow: boolean;
  fixedTabs: boolean;
  centerActive: boolean;
  showArrows: boolean;
  draggable: boolean;
  stacked: boolean;
  showPanels: boolean;
  hideSlider: boolean;
  transition: TabsTransition;
  transitionDuration: number;
  props: TabsFieldNames;
}

export interface TabPaneProps {
  label?: string;
  name?: TabPaneName;
  disabled?: boolean;
  closable?: boolean;
  lazy?: boolean;
}

export interface TabPaneSlots {
  default?: unknown;
  label?: unknown;
}

export interface TabsSlots {
  default?: unknown;
  "add-icon"?: unknown;
  addIcon?: unknown;
  "prev-control"?: unknown;
  "next-control"?: unknown;
  "prev-icon"?: unknown;
  "next-icon"?: unknown;
}

export interface TabsPaneContext {
  name: TabPaneName;
  label: string;
  disabled: boolean;
  closable: boolean;
  lazy: boolean;
}

export interface TabsExpose {
  currentName: () => TabPaneName | "";
  select: (value: TabPaneName) => void;
  setActive: (value: TabPaneName) => void;
  removeTab: (value: TabPaneName) => void;
  add: () => void;
  scrollToActiveTab: () => void;
  removeFocus: () => void;
  update: () => DOMRect | null;
  readonly tabListRef: HTMLElement | null;
  readonly tabBarRef: HTMLElement | null;
}

export interface TabsReorderDetail {
  from: number;
  to: number;
  value: TabPaneName;
  items: TabsItem[];
}
